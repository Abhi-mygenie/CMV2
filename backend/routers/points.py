from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone, timedelta
import uuid

from core.database import db
from core.auth import get_current_user
from core.helpers import calculate_tier, get_earn_percent_for_tier
from models.schemas import (
    PointsTransaction, PointsTransactionCreate,
    LoyaltySettings, LoyaltySettingsUpdate
)

router = APIRouter(prefix="/points", tags=["Points"])
loyalty_router = APIRouter(prefix="/loyalty", tags=["Loyalty Settings"])

@router.post("/transaction", response_model=PointsTransaction)
async def create_points_transaction(tx_data: PointsTransactionCreate, user: dict = Depends(get_current_user)):
    customer = await db.customers.find_one({"id": tx_data.customer_id, "user_id": user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        settings = {"tier_bronze_min": 0, "tier_silver_min": 500, "tier_gold_min": 1500, "tier_platinum_min": 5000}
    
    current_points = customer.get("total_points", 0)
    
    if tx_data.transaction_type == "redeem":
        if current_points < tx_data.points:
            raise HTTPException(status_code=400, detail="Insufficient points")
        new_balance = current_points - tx_data.points
    else:
        new_balance = current_points + tx_data.points
    
    new_tier = calculate_tier(new_balance, settings)
    
    update_data = {
        "total_points": new_balance,
        "tier": new_tier,
        "last_visit": datetime.now(timezone.utc).isoformat()
    }
    
    if tx_data.transaction_type == "earn" and tx_data.bill_amount:
        update_data["total_spent"] = customer.get("total_spent", 0) + tx_data.bill_amount
        update_data["total_visits"] = customer.get("total_visits", 0) + 1
    
    await db.customers.update_one({"id": tx_data.customer_id}, {"$set": update_data})
    
    tx_id = str(uuid.uuid4())
    tx_doc = {
        "id": tx_id,
        "user_id": user["id"],
        "customer_id": tx_data.customer_id,
        "points": tx_data.points,
        "transaction_type": tx_data.transaction_type,
        "description": tx_data.description,
        "bill_amount": tx_data.bill_amount,
        "balance_after": new_balance,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.points_transactions.insert_one(tx_doc)
    return PointsTransaction(**tx_doc)

@router.get("/transactions/{customer_id}", response_model=List[PointsTransaction])
async def get_customer_transactions(customer_id: str, limit: int = 50, user: dict = Depends(get_current_user)):
    transactions = await db.points_transactions.find(
        {"customer_id": customer_id, "user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return [PointsTransaction(**t) for t in transactions]

@router.post("/earn")
async def earn_points(customer_id: str, bill_amount: float, user: dict = Depends(get_current_user)):
    """Quick endpoint to earn points based on bill amount and tier"""
    customer = await db.customers.find_one({"id": customer_id, "user_id": user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        settings = {
            "min_order_value": 100.0,
            "bronze_earn_percent": 5.0,
            "silver_earn_percent": 7.0,
            "gold_earn_percent": 10.0,
            "platinum_earn_percent": 15.0
        }
    
    min_order = settings.get("min_order_value", 100.0)
    if bill_amount < min_order:
        raise HTTPException(status_code=400, detail=f"Minimum order value is Rs.{min_order}")
    
    customer_tier = customer.get("tier", "Bronze")
    earn_percent = get_earn_percent_for_tier(customer_tier, settings)
    
    points_earned = int(bill_amount * earn_percent / 100)
    
    tx_data = PointsTransactionCreate(
        customer_id=customer_id,
        points=points_earned,
        transaction_type="earn",
        description=f"Earned {earn_percent}% on bill of Rs.{bill_amount}",
        bill_amount=bill_amount
    )
    
    return await create_points_transaction(tx_data, user)

@router.get("/expiring/{customer_id}")
async def get_expiring_points(customer_id: str, user: dict = Depends(get_current_user)):
    """Get points that are expiring soon for a customer"""
    customer = await db.customers.find_one({"id": customer_id, "user_id": user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    expiry_months = settings.get("points_expiry_months", 6) if settings else 6
    reminder_days = settings.get("expiry_reminder_days", 30) if settings else 30
    
    if expiry_months == 0:
        return {"expiring_soon": 0, "expiring_date": None, "already_expired": 0}
    
    now = datetime.now(timezone.utc)
    expiry_cutoff = now - timedelta(days=expiry_months * 30)
    reminder_cutoff = now - timedelta(days=(expiry_months * 30) - reminder_days)
    
    transactions = await db.points_transactions.find({
        "customer_id": customer_id,
        "user_id": user["id"],
        "transaction_type": {"$in": ["earn", "bonus"]}
    }, {"_id": 0}).to_list(1000)
    
    expiring_soon = 0
    already_expired = 0
    earliest_expiry = None
    
    for tx in transactions:
        tx_date = datetime.fromisoformat(tx["created_at"].replace("Z", "+00:00")) if isinstance(tx["created_at"], str) else tx["created_at"]
        
        if tx_date < expiry_cutoff:
            already_expired += tx["points"]
        elif tx_date < reminder_cutoff:
            expiring_soon += tx["points"]
            expiry_date = tx_date + timedelta(days=expiry_months * 30)
            if earliest_expiry is None or expiry_date < earliest_expiry:
                earliest_expiry = expiry_date
    
    return {
        "expiring_soon": max(0, expiring_soon),
        "expiring_date": earliest_expiry.isoformat() if earliest_expiry else None,
        "already_expired": max(0, already_expired),
        "expiry_months": expiry_months
    }


@router.post("/process-expiry-reminders")
async def process_expiry_reminders(user: dict = Depends(get_current_user)):
    """
    Process points expiry reminders for all customers.
    Identifies customers with points expiring within reminder window.
    Should be called daily via cron job.
    Returns list of customers needing reminders (for WhatsApp/SMS integration).
    """
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    
    expiry_months = settings.get("points_expiry_months", 6) if settings else 6
    reminder_days = settings.get("expiry_reminder_days", 30) if settings else 30
    
    if expiry_months == 0:
        return {
            "message": "Points expiry is disabled",
            "customers_to_remind": 0,
            "reminders": []
        }
    
    now = datetime.now(timezone.utc)
    current_year = now.year
    current_month = now.month
    
    # Get all customers with points
    customers = await db.customers.find({
        "user_id": user["id"],
        "total_points": {"$gt": 0}
    }, {"_id": 0}).to_list(10000)
    
    customers_to_remind = 0
    reminders = []
    
    for customer in customers:
        # Check if already reminded this month
        last_reminder = customer.get("last_expiry_reminder")
        if last_reminder:
            last_reminder_date = datetime.fromisoformat(last_reminder.replace("Z", "+00:00")) if isinstance(last_reminder, str) else last_reminder
            # Skip if reminded in the same month
            if last_reminder_date.year == current_year and last_reminder_date.month == current_month:
                continue
        
        # Calculate expiring points for this customer
        # Points earned before (now - expiry_months + reminder_days) will expire within reminder_days
        expiry_cutoff = now - timedelta(days=expiry_months * 30)
        reminder_cutoff = now - timedelta(days=(expiry_months * 30) - reminder_days)
        
        transactions = await db.points_transactions.find({
            "customer_id": customer["id"],
            "user_id": user["id"],
            "transaction_type": {"$in": ["earn", "bonus"]}
        }, {"_id": 0}).to_list(1000)
        
        expiring_points = 0
        earliest_expiry = None
        
        for tx in transactions:
            try:
                tx_date = datetime.fromisoformat(tx["created_at"].replace("Z", "+00:00")) if isinstance(tx["created_at"], str) else tx["created_at"]
                
                # Points that will expire within reminder window
                if expiry_cutoff <= tx_date <= reminder_cutoff:
                    expiring_points += tx["points"]
                    expiry_date = tx_date + timedelta(days=expiry_months * 30)
                    if earliest_expiry is None or expiry_date < earliest_expiry:
                        earliest_expiry = expiry_date
            except:
                continue
        
        # Only remind if there are points expiring
        if expiring_points > 0:
            # Update last reminder timestamp
            await db.customers.update_one(
                {"id": customer["id"]},
                {"$set": {"last_expiry_reminder": now.isoformat()}}
            )
            
            customers_to_remind += 1
            reminders.append({
                "customer_id": customer["id"],
                "name": customer.get("name"),
                "phone": customer.get("phone"),
                "email": customer.get("email"),
                "total_points": customer.get("total_points", 0),
                "expiring_points": expiring_points,
                "expiry_date": earliest_expiry.isoformat() if earliest_expiry else None,
                "days_until_expiry": (earliest_expiry - now).days if earliest_expiry else None
            })
    
    return {
        "message": f"Found {customers_to_remind} customers with expiring points",
        "customers_to_remind": customers_to_remind,
        "expiry_months": expiry_months,
        "reminder_window_days": reminder_days,
        "reminders": reminders
    }

@router.post("/expire")
async def expire_old_points(user: dict = Depends(get_current_user)):
    """
    Expire old points for all customers.
    Only expires points from transactions not already processed.
    Should be called daily via cron job.
    """
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    expiry_months = settings.get("points_expiry_months", 6) if settings else 6
    
    if expiry_months == 0:
        return {
            "message": "Points expiry is disabled",
            "total_expired": 0,
            "customers_affected": 0,
            "expired_details": []
        }
    
    now = datetime.now(timezone.utc)
    expiry_cutoff = now - timedelta(days=expiry_months * 30)
    expiry_cutoff_str = expiry_cutoff.isoformat()
    
    customers = await db.customers.find({
        "user_id": user["id"],
        "total_points": {"$gt": 0}
    }, {"_id": 0}).to_list(10000)
    
    total_expired = 0
    customers_affected = 0
    expired_details = []
    
    for customer in customers:
        # Find earn/bonus transactions older than expiry cutoff that haven't been marked as expired
        old_transactions = await db.points_transactions.find({
            "customer_id": customer["id"],
            "user_id": user["id"],
            "transaction_type": {"$in": ["earn", "bonus"]},
            "created_at": {"$lt": expiry_cutoff_str},
            "points_expired": {"$ne": True}  # Not already processed
        }, {"_id": 0}).to_list(1000)
        
        if not old_transactions:
            continue
        
        points_to_expire = sum(tx["points"] for tx in old_transactions)
        
        if points_to_expire > 0:
            # Don't expire more than customer has
            current_points = customer.get("total_points", 0)
            points_to_expire = min(points_to_expire, current_points)
            
            if points_to_expire > 0:
                # Mark source transactions as expired
                tx_ids = [tx["id"] for tx in old_transactions]
                await db.points_transactions.update_many(
                    {"id": {"$in": tx_ids}},
                    {"$set": {"points_expired": True, "expired_at": now.isoformat()}}
                )
                
                # Create expiry transaction
                tx_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": user["id"],
                    "customer_id": customer["id"],
                    "points": points_to_expire,
                    "transaction_type": "expired",
                    "description": f"Points expired (older than {expiry_months} months)",
                    "bill_amount": None,
                    "balance_after": current_points - points_to_expire,
                    "source_transaction_ids": tx_ids,
                    "created_at": now.isoformat()
                }
                await db.points_transactions.insert_one(tx_doc)
                
                # Update customer total points and tier
                new_points = current_points - points_to_expire
                new_tier = calculate_tier(new_points, settings)
                
                await db.customers.update_one(
                    {"id": customer["id"]},
                    {"$set": {
                        "total_points": new_points,
                        "tier": new_tier,
                        "last_points_expiry": now.isoformat()
                    }}
                )
                
                total_expired += points_to_expire
                customers_affected += 1
                expired_details.append({
                    "customer_id": customer["id"],
                    "name": customer.get("name"),
                    "phone": customer.get("phone"),
                    "points_expired": points_to_expire,
                    "points_remaining": new_points,
                    "new_tier": new_tier,
                    "transactions_processed": len(tx_ids)
                })
    
    return {
        "message": f"Expired {total_expired} points from {customers_affected} customers",
        "total_expired": total_expired,
        "customers_affected": customers_affected,
        "expiry_months": expiry_months,
        "expired_details": expired_details
    }


# Loyalty Settings routes
@loyalty_router.get("/settings", response_model=LoyaltySettings)
async def get_loyalty_settings(user: dict = Depends(get_current_user)):
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        settings = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "min_order_value": 100.0,
            "bronze_earn_percent": 5.0,
            "silver_earn_percent": 7.0,
            "gold_earn_percent": 10.0,
            "platinum_earn_percent": 15.0,
            "redemption_value": 1.0,
            "min_redemption_points": 50,
            "max_redemption_percent": 50.0,
            "max_redemption_amount": 500.0,
            "points_expiry_months": 6,
            "expiry_reminder_days": 30,
            "tier_silver_min": 500,
            "tier_gold_min": 1500,
            "tier_platinum_min": 5000,
            "custom_field_1_label": "Custom Field 1",
            "custom_field_2_label": "Custom Field 2",
            "custom_field_3_label": "Custom Field 3",
            "custom_field_1_enabled": False,
            "custom_field_2_enabled": False,
            "custom_field_3_enabled": False
        }
        await db.loyalty_settings.insert_one(settings)
    return LoyaltySettings(**settings)

@loyalty_router.put("/settings", response_model=LoyaltySettings)
async def update_loyalty_settings(update_data: LoyaltySettingsUpdate, user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.loyalty_settings.update_one({"user_id": user["id"]}, {"$set": update_dict})
    
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    return LoyaltySettings(**settings)


@router.post("/process-birthday-bonus")
async def process_birthday_bonus(user: dict = Depends(get_current_user)):
    """
    Process birthday bonus for all eligible customers.
    Now delegates to shared core logic (also used by cron scheduler).
    """
    from core.loyalty_jobs import run_birthday_bonus
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        return {"message": "Birthday bonus is disabled", "customers_awarded": 0, "total_points_awarded": 0}
    result = await run_birthday_bonus(user["id"], settings)
    return {"message": f"Birthday bonus processed for {result['customers_awarded']} customers", **result}


@router.post("/process-anniversary-bonus")
async def process_anniversary_bonus(user: dict = Depends(get_current_user)):
    """
    Process anniversary bonus for all eligible customers.
    Now delegates to shared core logic (also used by cron scheduler).
    """
    from core.loyalty_jobs import run_anniversary_bonus
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        return {"message": "Anniversary bonus is disabled", "customers_awarded": 0, "total_points_awarded": 0}
    result = await run_anniversary_bonus(user["id"], settings)
    return {"message": f"Anniversary bonus processed for {result['customers_awarded']} customers", **result}
