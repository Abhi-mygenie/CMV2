from fastapi import APIRouter, HTTPException, Depends, Header
from datetime import datetime, timezone
import uuid

from ..core.database import db
from ..core.auth import get_current_user, generate_api_key
from ..core.helpers import calculate_tier, get_earn_percent_for_tier
from ..models.schemas import (
    POSPaymentWebhook, POSCustomerLookup, POSResponse,
    MessageRequest
)

router = APIRouter(prefix="/pos", tags=["POS Gateway"])
messaging_router = APIRouter(prefix="/messaging", tags=["Messaging"])

# API Key Authentication Dependency
async def verify_pos_api_key(x_api_key: str = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required in X-API-Key header")
    
    user = await db.users.find_one({"api_key": x_api_key}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return user

@router.post("/webhook/payment-received", response_model=POSResponse)
async def pos_payment_received(
    webhook_data: POSPaymentWebhook,
    user: dict = Depends(verify_pos_api_key)
):
    """
    Main POS webhook endpoint - processes payments and manages loyalty points
    """
    try:
        # Find customer by phone
        customer = await db.customers.find_one({
            "user_id": user["id"],
            "phone": webhook_data.customer_phone
        })
        
        if not customer:
            # Auto-create customer if not exists
            customer_id = str(uuid.uuid4())
            now = datetime.now(timezone.utc).isoformat()
            
            customer = {
                "id": customer_id,
                "user_id": user["id"],
                "name": f"Customer {webhook_data.customer_phone[-4:]}",
                "phone": webhook_data.customer_phone,
                "country_code": "+91",
                "email": None,
                "notes": "Auto-created via POS",
                "dob": None,
                "anniversary": None,
                "customer_type": "normal",
                "gst_name": None,
                "gst_number": None,
                "address": None,
                "city": None,
                "pincode": None,
                "allergies": [],
                "custom_field_1": None,
                "custom_field_2": None,
                "custom_field_3": None,
                "favorites": [],
                "total_points": 0,
                "wallet_balance": 0.0,
                "total_visits": 0,
                "total_spent": 0.0,
                "tier": "Bronze",
                "created_at": now,
                "last_visit": None
            }
            await db.customers.insert_one(customer)
        
        # Get loyalty settings
        settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
        if not settings:
            settings = {
                "min_order_value": 100.0,
                "bronze_earn_percent": 5.0,
                "silver_earn_percent": 7.0,
                "gold_earn_percent": 10.0,
                "platinum_earn_percent": 15.0,
                "redemption_value": 0.25,
                "min_redemption_points": 100,
                "max_redemption_percent": 50.0,
                "max_redemption_amount": 500.0,
                "tier_silver_min": 500,
                "tier_gold_min": 1500,
                "tier_platinum_min": 5000
            }
        
        response_data = {
            "customer_id": customer["id"],
            "customer_name": customer["name"],
            "current_points": customer.get("total_points", 0),
            "current_tier": customer.get("tier", "Bronze"),
            "wallet_balance": customer.get("wallet_balance", 0.0),
            "transactions": []
        }
        
        final_bill_amount = webhook_data.bill_amount
        
        # Process coupon if provided
        if webhook_data.coupon_code:
            coupon = await db.coupons.find_one({
                "user_id": user["id"],
                "code": webhook_data.coupon_code.upper(),
                "is_active": True
            })
            
            if coupon:
                now = datetime.now(timezone.utc).isoformat()
                if coupon["start_date"] <= now <= coupon["end_date"]:
                    if coupon["discount_type"] == "percentage":
                        discount = (final_bill_amount * coupon["discount_value"]) / 100
                        if coupon.get("max_discount"):
                            discount = min(discount, coupon["max_discount"])
                    else:
                        discount = min(coupon["discount_value"], final_bill_amount)
                    
                    final_bill_amount -= discount
                    response_data["coupon_applied"] = {
                        "code": webhook_data.coupon_code,
                        "discount": round(discount, 2)
                    }
                    response_data["transactions"].append({
                        "type": "coupon",
                        "amount": round(discount, 2),
                        "description": f"Coupon {webhook_data.coupon_code} applied"
                    })
        
        # Process points redemption if requested
        points_redeemed = 0
        if webhook_data.redeem_points and webhook_data.redeem_points > 0:
            current_points = customer.get("total_points", 0)
            min_redemption = settings.get("min_redemption_points", 100)
            max_redemption_percent = settings.get("max_redemption_percent", 50.0)
            max_redemption_amount = settings.get("max_redemption_amount", 500.0)
            redemption_value = settings.get("redemption_value", 0.25)
            
            max_redemption_by_percent = (final_bill_amount * max_redemption_percent) / 100
            max_redemption = min(max_redemption_by_percent, max_redemption_amount)
            
            if current_points >= min_redemption:
                points_to_redeem = min(webhook_data.redeem_points, current_points)
                redemption_amount = points_to_redeem * redemption_value
                
                if redemption_amount > max_redemption:
                    redemption_amount = max_redemption
                    points_to_redeem = int(redemption_amount / redemption_value)
                
                if redemption_amount > final_bill_amount:
                    redemption_amount = final_bill_amount
                    points_to_redeem = int(redemption_amount / redemption_value)
                
                if points_to_redeem > 0:
                    new_points = current_points - points_to_redeem
                    await db.customers.update_one(
                        {"id": customer["id"]},
                        {"$set": {"total_points": new_points}}
                    )
                    
                    tx_doc = {
                        "id": str(uuid.uuid4()),
                        "user_id": user["id"],
                        "customer_id": customer["id"],
                        "points": points_to_redeem,
                        "transaction_type": "redeem",
                        "description": f"Redeemed at POS (Bill: Rs.{webhook_data.bill_amount})",
                        "bill_amount": webhook_data.bill_amount,
                        "balance_after": new_points,
                        "created_at": datetime.now(timezone.utc).isoformat()
                    }
                    await db.points_transactions.insert_one(tx_doc)
                    
                    final_bill_amount -= redemption_amount
                    points_redeemed = points_to_redeem
                    response_data["points_redeemed"] = {
                        "points": points_to_redeem,
                        "value": round(redemption_amount, 2)
                    }
                    response_data["transactions"].append({
                        "type": "redeem",
                        "points": points_to_redeem,
                        "value": round(redemption_amount, 2),
                        "description": "Points redeemed"
                    })
        
        # Calculate points earned
        min_order = settings.get("min_order_value", 100.0)
        points_earned = 0
        
        if webhook_data.bill_amount >= min_order:
            customer_tier = customer.get("tier", "Bronze")
            earn_percent = get_earn_percent_for_tier(customer_tier, settings)
            points_earned = int(webhook_data.bill_amount * earn_percent / 100)
            
            if points_earned > 0:
                current_points = customer.get("total_points", 0)
                if points_redeemed > 0:
                    current_points = current_points - points_redeemed
                new_points = current_points + points_earned
                new_tier = calculate_tier(new_points, settings)
                
                await db.customers.update_one(
                    {"id": customer["id"]},
                    {"$set": {
                        "total_points": new_points,
                        "tier": new_tier,
                        "total_visits": customer.get("total_visits", 0) + 1,
                        "total_spent": customer.get("total_spent", 0) + webhook_data.bill_amount,
                        "last_visit": datetime.now(timezone.utc).isoformat()
                    }}
                )
                
                tx_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": user["id"],
                    "customer_id": customer["id"],
                    "points": points_earned,
                    "transaction_type": "earn",
                    "description": f"Earned {earn_percent}% on bill of Rs.{webhook_data.bill_amount}",
                    "bill_amount": webhook_data.bill_amount,
                    "balance_after": new_points,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.points_transactions.insert_one(tx_doc)
                
                response_data["points_earned"] = {
                    "points": points_earned,
                    "percentage": earn_percent
                }
                response_data["new_points"] = new_points
                response_data["new_tier"] = new_tier
                response_data["transactions"].append({
                    "type": "earn",
                    "points": points_earned,
                    "description": f"Earned {earn_percent}% on purchase"
                })
        else:
            await db.customers.update_one(
                {"id": customer["id"]},
                {"$set": {
                    "total_visits": customer.get("total_visits", 0) + 1,
                    "total_spent": customer.get("total_spent", 0) + webhook_data.bill_amount,
                    "last_visit": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        response_data["final_bill_amount"] = round(final_bill_amount, 2)
        response_data["original_bill_amount"] = webhook_data.bill_amount
        
        return POSResponse(
            success=True,
            message="Payment processed successfully",
            data=response_data
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/customer-lookup", response_model=POSResponse)
async def pos_customer_lookup(
    lookup_data: POSCustomerLookup,
    user: dict = Depends(verify_pos_api_key)
):
    """
    Look up customer by phone number for POS display
    """
    customer = await db.customers.find_one({
        "user_id": user["id"],
        "phone": lookup_data.phone
    }, {"_id": 0})
    
    if not customer:
        return POSResponse(
            success=False,
            message="Customer not found",
            data={"registered": False}
        )
    
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    redemption_value = settings.get("redemption_value", 0.25) if settings else 0.25
    
    return POSResponse(
        success=True,
        message="Customer found",
        data={
            "registered": True,
            "customer_id": customer["id"],
            "name": customer["name"],
            "phone": customer["phone"],
            "tier": customer.get("tier", "Bronze"),
            "total_points": customer.get("total_points", 0),
            "points_value": round(customer.get("total_points", 0) * redemption_value, 2),
            "wallet_balance": customer.get("wallet_balance", 0.0),
            "total_visits": customer.get("total_visits", 0),
            "total_spent": customer.get("total_spent", 0.0),
            "allergies": customer.get("allergies", []),
            "favorites": customer.get("favorites", []),
            "last_visit": customer.get("last_visit")
        }
    )

@router.get("/api-key")
async def get_api_key(user: dict = Depends(get_current_user)):
    """Get the current API key for POS integration"""
    user_doc = await db.users.find_one({"id": user["id"]}, {"_id": 0, "api_key": 1})
    if not user_doc or not user_doc.get("api_key"):
        new_key = generate_api_key()
        await db.users.update_one({"id": user["id"]}, {"$set": {"api_key": new_key}})
        return {"api_key": new_key}
    
    return {"api_key": user_doc["api_key"]}

@router.post("/api-key/regenerate")
async def regenerate_api_key(user: dict = Depends(get_current_user)):
    """Regenerate API key for POS integration"""
    new_key = generate_api_key()
    await db.users.update_one({"id": user["id"]}, {"$set": {"api_key": new_key}})
    return {
        "message": "API key regenerated successfully",
        "api_key": new_key,
        "warning": "Make sure to update your POS system with the new key"
    }


# Messaging routes
@messaging_router.post("/send")
async def send_message(msg_data: MessageRequest, user: dict = Depends(get_current_user)):
    """Mock messaging endpoint - ready for real provider integration"""
    customer = await db.customers.find_one({"id": msg_data.customer_id, "user_id": user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    message_log = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "customer_id": msg_data.customer_id,
        "customer_phone": customer["phone"],
        "message": msg_data.message,
        "channel": msg_data.channel,
        "status": "sent",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.message_logs.insert_one(message_log)
    
    return {
        "message": "Message sent successfully (MOCK)",
        "log_id": message_log["id"],
        "note": "Real messaging provider integration pending"
    }
