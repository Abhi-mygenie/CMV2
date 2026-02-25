from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import os
import httpx

from core.database import db
from core.auth import get_current_user
from core.helpers import generate_qr_code, build_customer_query
from models.schemas import (
    Customer, CustomerCreate, CustomerUpdate,
    Segment, SegmentCreate, SegmentUpdate
)

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/sync-from-mygenie")
async def sync_customers_from_mygenie(user: dict = Depends(get_current_user)):
    """
    Fetch customers from MyGenie API and sync to local database
    """
    try:
        # Get MyGenie token from user record
        user_record = await db.users.find_one({"id": user["id"]})
        mygenie_token = user_record.get("mygenie_token")
        
        if not mygenie_token:
            raise HTTPException(
                status_code=400,
                detail="MyGenie token not found. Please login again."
            )
        
        # Fetch customers from MyGenie
        mygenie_api_url = os.getenv("MYGENIE_API_URL", "https://preprod.mygenie.online")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{mygenie_api_url}/api/v2/vendoremployee/restaurant-customer-list",
                headers={
                    "Authorization": f"Bearer {mygenie_token}",
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-localization": "en"
                },
                json={},
                timeout=15.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch customers from MyGenie"
                )
            
            data = response.json()
            customer_list = data.get("customer_list", [])
            
            synced_count = 0
            updated_count = 0
            
            for mygenie_customer in customer_list:
                # Map MyGenie customer to our schema
                customer_data = {
                    "user_id": user["id"],
                    "name": mygenie_customer.get("customer_name") or "Unknown",
                    "phone": mygenie_customer.get("phone") or "",
                    "country_code": "+91",
                    "email": f"customer{mygenie_customer['id']}@mygenie.local",
                    "dob": mygenie_customer.get("date_of_birth"),
                    "anniversary": mygenie_customer.get("date_of_anniversary"),
                    "gst_name": mygenie_customer.get("gst_name"),
                    "gst_number": mygenie_customer.get("gst_number"),
                    "total_points": mygenie_customer.get("loyalty_point", 0),
                    "total_points_earned": mygenie_customer.get("total_points_earned", 0),
                    "total_points_redeemed": mygenie_customer.get("total_points_redeemed", 0),
                    "total_spent": float(mygenie_customer.get("total_spent") or 0),
                    "wallet_balance": float(mygenie_customer.get("wallet_balance") or 0),
                    "total_wallet_deposit": float(mygenie_customer.get("total_wallet_deposit") or 0),
                    "wallet_used": float(mygenie_customer.get("wallet_used") or 0),
                    "mygenie_customer_id": mygenie_customer["id"],
                    "mygenie_synced": True,
                    "last_synced_at": datetime.now(timezone.utc).isoformat()
                }
                
                # Determine tier based on points
                points = customer_data["total_points"]
                if points >= 5000:
                    tier = "Platinum"
                elif points >= 1500:
                    tier = "Gold"
                elif points >= 500:
                    tier = "Silver"
                else:
                    tier = "Bronze"
                customer_data["tier"] = tier
                
                # Check if customer already exists
                existing = await db.customers.find_one({
                    "user_id": user["id"],
                    "mygenie_customer_id": mygenie_customer["id"]
                })
                
                if existing:
                    # Update existing customer
                    await db.customers.update_one(
                        {"id": existing["id"]},
                        {"$set": customer_data}
                    )
                    updated_count += 1
                else:
                    # Create new customer
                    customer_data["id"] = str(uuid.uuid4())
                    customer_data["created_at"] = datetime.now(timezone.utc).isoformat()
                    customer_data["customer_type"] = "normal"
                    customer_data["notes"] = None
                    customer_data["address"] = None
                    customer_data["city"] = None
                    customer_data["pincode"] = None
                    customer_data["allergies"] = []
                    customer_data["custom_field_1"] = None
                    customer_data["custom_field_2"] = None
                    customer_data["custom_field_3"] = None
                    customer_data["favorites"] = []
                    customer_data["total_visits"] = 0
                    customer_data["total_spent"] = 0.0
                    customer_data["last_visit"] = None
                    
                    await db.customers.insert_one(customer_data)
                    synced_count += 1
            
            return {
                "success": True,
                "synced": synced_count,
                "updated": updated_count,
                "total": len(customer_list),
                "message": f"Successfully synced {synced_count} new and updated {updated_count} existing customers from MyGenie"
            }
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="MyGenie API timeout")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"MyGenie API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.post("", response_model=Customer)
async def create_customer(customer_data: CustomerCreate, user: dict = Depends(get_current_user)):
    # Check if phone exists for this user
    existing = await db.customers.find_one({"user_id": user["id"], "phone": customer_data.phone})
    if existing:
        raise HTTPException(status_code=400, detail="Customer with this phone already exists")
    
    customer_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Get user's MyGenie token for API sync
    user_record = await db.users.find_one({"id": user["id"]})
    mygenie_token = user_record.get("mygenie_token") if user_record else None
    mygenie_customer_id = None
    
    # Sync to MyGenie if token available
    if mygenie_token:
        mygenie_api_url = os.getenv("MYGENIE_API_URL", "https://preprod.mygenie.online")
        
        # Split name into first and last name
        name_parts = (customer_data.name or "").split(" ", 1)
        f_name = name_parts[0] if name_parts else ""
        l_name = name_parts[1] if len(name_parts) > 1 else ""
        
        mygenie_payload = {
            "phone": customer_data.phone or "",
            "f_name": f_name,
            "l_name": l_name,
            "email": customer_data.email or "",
            "gst_number": customer_data.gst_number or "",
            "gst_name": customer_data.gst_name or "",
            "date_of_birth": customer_data.dob or "",
            "date_of_anniversary": customer_data.anniversary or "",
            "membership_id": ""
        }
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{mygenie_api_url}/api/v1/vendoremployee/pos/user-check-create",
                    headers={
                        "Authorization": f"Bearer {mygenie_token}",
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-localization": "en"
                    },
                    json=mygenie_payload,
                    timeout=15.0
                )
                
                if resp.status_code == 200:
                    mygenie_resp = resp.json()
                    mygenie_customer_id = mygenie_resp.get("user_id")
                    print(f"✅ Customer synced to MyGenie: {mygenie_customer_id}")
                else:
                    print(f"⚠️ MyGenie sync failed: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"⚠️ MyGenie sync error (non-critical): {str(e)}")
    
    # Check for first visit bonus
    settings = await db.loyalty_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    first_visit_bonus = 0
    if settings and settings.get("first_visit_bonus_enabled", False):
        first_visit_bonus = settings.get("first_visit_bonus_points", 50)
    
    customer_doc = {
        "id": customer_id,
        "user_id": user["id"],
        "created_at": now,
        "updated_at": now,
        
        # Basic Information
        "name": customer_data.name,
        "phone": customer_data.phone,
        "country_code": customer_data.country_code,
        "email": customer_data.email,
        "gender": customer_data.gender,
        "dob": customer_data.dob,
        "anniversary": customer_data.anniversary,
        "preferred_language": customer_data.preferred_language,
        "customer_type": customer_data.customer_type,
        "segment_tags": customer_data.segment_tags or [],
        
        # Contact & Marketing Permissions
        "whatsapp_opt_in": customer_data.whatsapp_opt_in,
        "whatsapp_opt_in_date": customer_data.whatsapp_opt_in_date,
        "promo_whatsapp_allowed": customer_data.promo_whatsapp_allowed,
        "promo_sms_allowed": customer_data.promo_sms_allowed,
        "email_marketing_allowed": customer_data.email_marketing_allowed,
        "call_allowed": customer_data.call_allowed,
        "is_blocked": customer_data.is_blocked,
        
        # Loyalty Information
        "total_points": first_visit_bonus,
        "wallet_balance": 0.0,
        "tier": "Bronze",
        "referral_code": customer_data.referral_code,
        "referred_by": customer_data.referred_by,
        "membership_id": customer_data.membership_id,
        "membership_expiry": customer_data.membership_expiry,
        
        # Spending & Visit Behavior
        "total_visits": 0,
        "total_spent": 0.0,
        "avg_order_value": 0.0,
        "last_visit": None,
        "favorite_category": customer_data.favorite_category,
        "preferred_payment_mode": customer_data.preferred_payment_mode,
        
        # Corporate Information
        "gst_name": customer_data.gst_name,
        "gst_number": customer_data.gst_number,
        "billing_address": customer_data.billing_address,
        "credit_limit": customer_data.credit_limit,
        "payment_terms": customer_data.payment_terms,
        
        # Address
        "address": customer_data.address,
        "address_line_2": customer_data.address_line_2,
        "city": customer_data.city,
        "state": customer_data.state,
        "pincode": customer_data.pincode,
        "country": customer_data.country,
        "delivery_instructions": customer_data.delivery_instructions,
        "map_location": customer_data.map_location,
        
        # Preferences
        "allergies": customer_data.allergies or [],
        "favorites": customer_data.favorites or [],
        
        # Custom Fields
        "custom_field_1": customer_data.custom_field_1,
        "custom_field_2": customer_data.custom_field_2,
        "custom_field_3": customer_data.custom_field_3,
        
        # Notes
        "notes": customer_data.notes,
        
        # MyGenie Sync
        "mygenie_customer_id": mygenie_customer_id,
        "mygenie_synced": mygenie_customer_id is not None,
        "first_visit_bonus_awarded": first_visit_bonus > 0
    }
    
    await db.customers.insert_one(customer_doc)
    
    # Record first visit bonus transaction if awarded
    if first_visit_bonus > 0:
        tx_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "customer_id": customer_id,
            "points": first_visit_bonus,
            "transaction_type": "bonus",
            "description": "First visit bonus - Welcome reward",
            "bill_amount": None,
            "balance_after": first_visit_bonus,
            "created_at": now
        }
        await db.points_transactions.insert_one(tx_doc)
    
    return Customer(**customer_doc)

@router.get("/sample-data")
async def get_sample_customer_data(user: dict = Depends(get_current_user)):
    """Get the first customer's data as sample for template previews."""
    customer = await db.customers.find_one(
        {"user_id": user["id"]}, {"_id": 0}
    )
    user_doc = await db.users.find_one({"id": user["id"]}, {"_id": 0, "restaurant_name": 1})
    restaurant_name = user_doc.get("restaurant_name", "") if user_doc else ""
    
    if not customer:
        return {"sample": {}, "restaurant_name": restaurant_name}
    
    return {
        "sample": {
            "customer_name": customer.get("name", ""),
            "phone": customer.get("phone", ""),
            "points_balance": str(customer.get("total_points", 0)),
            "points_earned": str(customer.get("total_points_earned", 0)),
            "points_redeemed": str(customer.get("total_points_redeemed", 0)),
            "wallet_balance": f"₹{customer.get('wallet_balance', 0)}",
            "amount": f"₹{customer.get('total_spent', 0)}",
            "tier": customer.get("tier", ""),
            "coupon_code": "",
            "expiry_date": "",
            "order_id": "",
            "visit_count": str(customer.get("total_visits", 0))
        },
        "restaurant_name": restaurant_name
    }

@router.get("", response_model=List[Customer])
async def list_customers(
    search: Optional[str] = None,
    tier: Optional[str] = None,
    customer_type: Optional[str] = None,
    has_allergies: Optional[bool] = None,
    last_visit_days: Optional[int] = None,
    favorite: Optional[str] = None,
    city: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    limit: int = 100,
    skip: int = 0,
    user: dict = Depends(get_current_user)
):
    query = {"user_id": user["id"]}
    and_conditions = []
    
    if search:
        and_conditions.append({
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}}
            ]
        })
    
    if tier:
        query["tier"] = tier
    
    if customer_type:
        query["customer_type"] = customer_type
    
    if has_allergies:
        query["allergies"] = {"$exists": True, "$ne": []}
    
    if last_visit_days:
        cutoff_date = (datetime.now(timezone.utc) - timedelta(days=last_visit_days)).isoformat()
        and_conditions.append({
            "$or": [
                {"last_visit": {"$lt": cutoff_date}},
                {"last_visit": None}
            ]
        })
    
    if favorite:
        query["favorites"] = {"$in": [favorite]}
    
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    if and_conditions:
        query["$and"] = and_conditions
    
    sort_direction = -1 if sort_order == "desc" else 1
    sort_field = sort_by if sort_by in ["created_at", "last_visit", "total_spent", "total_points", "name"] else "created_at"
    
    customers = await db.customers.find(query, {"_id": 0}).sort(sort_field, sort_direction).skip(skip).limit(limit).to_list(limit)
    return [Customer(**c) for c in customers]

@router.get("/segments/stats")
async def get_customer_segments(user: dict = Depends(get_current_user)):
    """Get customer segment statistics for campaign targeting"""
    user_id = user["id"]
    
    total = await db.customers.count_documents({"user_id": user_id})
    
    tier_stats = {}
    for tier in ["Bronze", "Silver", "Gold", "Platinum"]:
        tier_stats[tier.lower()] = await db.customers.count_documents({"user_id": user_id, "tier": tier})
    
    normal_count = await db.customers.count_documents({"user_id": user_id, "customer_type": "normal"})
    corporate_count = await db.customers.count_documents({"user_id": user_id, "customer_type": "corporate"})
    
    thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    inactive_30d = await db.customers.count_documents({
        "user_id": user_id,
        "$or": [
            {"last_visit": {"$lt": thirty_days_ago}},
            {"last_visit": None}
        ]
    })
    
    sixty_days_ago = (datetime.now(timezone.utc) - timedelta(days=60)).isoformat()
    inactive_60d = await db.customers.count_documents({
        "user_id": user_id,
        "$or": [
            {"last_visit": {"$lt": sixty_days_ago}},
            {"last_visit": None}
        ]
    })
    
    with_allergies = await db.customers.count_documents({
        "user_id": user_id,
        "allergies": {"$exists": True, "$ne": []}
    })
    
    cities_pipeline = [
        {"$match": {"user_id": user_id, "city": {"$exists": True, "$nin": [None, ""]}}},
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    cities = await db.customers.aggregate(cities_pipeline).to_list(10)
    
    favorites_pipeline = [
        {"$match": {"user_id": user_id, "favorites": {"$exists": True, "$ne": []}}},
        {"$unwind": "$favorites"},
        {"$group": {"_id": "$favorites", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_favorites = await db.customers.aggregate(favorites_pipeline).to_list(10)
    
    return {
        "total": total,
        "by_tier": tier_stats,
        "by_type": {"normal": normal_count, "corporate": corporate_count},
        "inactive_30_days": inactive_30d,
        "inactive_60_days": inactive_60d,
        "with_allergies": with_allergies,
        "top_cities": [{"city": c["_id"], "count": c["count"]} for c in cities],
        "top_favorites": [{"item": f["_id"], "count": f["count"]} for f in top_favorites]
    }

@router.get("/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str, user: dict = Depends(get_current_user)):
    customer = await db.customers.find_one({"id": customer_id, "user_id": user["id"]}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return Customer(**customer)

@router.put("/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, update_data: CustomerUpdate, user: dict = Depends(get_current_user)):
    customer = await db.customers.find_one({"id": customer_id, "user_id": user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if "phone" in update_dict and update_dict["phone"] != customer.get("phone"):
        existing = await db.customers.find_one({
            "user_id": user["id"], 
            "phone": update_dict["phone"],
            "id": {"$ne": customer_id}
        })
        if existing:
            raise HTTPException(status_code=400, detail="Another customer with this phone already exists")
    
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.customers.update_one({"id": customer_id}, {"$set": update_dict})
    
    # Sync to MyGenie if user has token
    user_record = await db.users.find_one({"id": user["id"]})
    mygenie_token = user_record.get("mygenie_token") if user_record else None
    
    if mygenie_token:
        # Get updated customer data
        updated_customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
        
        mygenie_api_url = os.getenv("MYGENIE_API_URL", "https://preprod.mygenie.online")
        
        # Split name into first and last name
        name_parts = (updated_customer.get("name") or "").split(" ", 1)
        f_name = name_parts[0] if name_parts else ""
        l_name = name_parts[1] if len(name_parts) > 1 else ""
        
        mygenie_payload = {
            "phone": updated_customer.get("phone") or "",
            "f_name": f_name,
            "l_name": l_name,
            "email": updated_customer.get("email") or "",
            "gst_number": updated_customer.get("gst_number") or "",
            "gst_name": updated_customer.get("gst_name") or "",
            "date_of_birth": updated_customer.get("dob") or "",
            "date_of_anniversary": updated_customer.get("anniversary") or "",
            "membership_id": ""
        }
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{mygenie_api_url}/api/v1/vendoremployee/pos/user-check-create",
                    headers={
                        "Authorization": f"Bearer {mygenie_token}",
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-localization": "en"
                    },
                    json=mygenie_payload,
                    timeout=15.0
                )
                
                if resp.status_code == 200:
                    mygenie_resp = resp.json()
                    mygenie_customer_id = mygenie_resp.get("user_id")
                    # Update mygenie_customer_id if not already set
                    if not customer.get("mygenie_customer_id"):
                        await db.customers.update_one(
                            {"id": customer_id},
                            {"$set": {"mygenie_customer_id": mygenie_customer_id, "mygenie_synced": True}}
                        )
                    print(f"✅ Customer updated in MyGenie: {mygenie_customer_id}")
                else:
                    print(f"⚠️ MyGenie update failed: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"⚠️ MyGenie update error (non-critical): {str(e)}")
    
    updated = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    return Customer(**updated)

@router.delete("/{customer_id}")
async def delete_customer(customer_id: str, user: dict = Depends(get_current_user)):
    result = await db.customers.delete_one({"id": customer_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    await db.points_transactions.delete_many({"customer_id": customer_id})
    return {"message": "Customer deleted"}


# QR Code endpoints
qr_router = APIRouter(prefix="/qr", tags=["QR Code"])

@qr_router.get("/generate")
async def generate_customer_qr(user: dict = Depends(get_current_user)):
    """Generate QR code for customer registration"""
    frontend_url = os.environ.get('FRONTEND_URL', 'https://dinepoints-loyalty-2.preview.emergentagent.com')
    registration_url = f"{frontend_url}/register-customer/{user['id']}"
    
    qr_base64 = generate_qr_code(registration_url)
    
    return {
        "qr_code": f"data:image/png;base64,{qr_base64}",
        "registration_url": registration_url,
        "restaurant_name": user["restaurant_name"]
    }

@qr_router.post("/register/{restaurant_id}")
async def register_via_qr(restaurant_id: str, customer_data: CustomerCreate):
    """Register customer via QR code (no auth required)"""
    user = await db.users.find_one({"id": restaurant_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    existing = await db.customers.find_one({"user_id": restaurant_id, "phone": customer_data.phone})
    if existing:
        raise HTTPException(status_code=400, detail="Customer already registered")
    
    customer_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Check for first visit bonus
    settings = await db.loyalty_settings.find_one({"user_id": restaurant_id}, {"_id": 0})
    first_visit_bonus = 0
    if settings and settings.get("first_visit_bonus_enabled", False):
        first_visit_bonus = settings.get("first_visit_bonus_points", 50)
    
    customer_doc = {
        "id": customer_id,
        "user_id": restaurant_id,
        "created_at": now,
        "updated_at": now,
        
        # Basic Information
        "name": customer_data.name,
        "phone": customer_data.phone,
        "country_code": customer_data.country_code,
        "email": customer_data.email,
        "gender": customer_data.gender,
        "dob": customer_data.dob,
        "anniversary": customer_data.anniversary,
        "preferred_language": customer_data.preferred_language,
        "customer_type": customer_data.customer_type,
        "segment_tags": customer_data.segment_tags or [],
        
        # Contact & Marketing Permissions
        "whatsapp_opt_in": customer_data.whatsapp_opt_in,
        "whatsapp_opt_in_date": customer_data.whatsapp_opt_in_date,
        "promo_whatsapp_allowed": customer_data.promo_whatsapp_allowed,
        "promo_sms_allowed": customer_data.promo_sms_allowed,
        "email_marketing_allowed": customer_data.email_marketing_allowed,
        "call_allowed": customer_data.call_allowed,
        "is_blocked": customer_data.is_blocked,
        
        # Loyalty Information
        "total_points": first_visit_bonus,
        "wallet_balance": 0.0,
        "tier": "Bronze",
        "referral_code": customer_data.referral_code,
        "referred_by": customer_data.referred_by,
        "membership_id": customer_data.membership_id,
        "membership_expiry": customer_data.membership_expiry,
        
        # Spending & Visit Behavior
        "total_visits": 0,
        "total_spent": 0.0,
        "avg_order_value": 0.0,
        "last_visit": None,
        "favorite_category": customer_data.favorite_category,
        "preferred_payment_mode": customer_data.preferred_payment_mode,
        
        # Corporate Information
        "gst_name": customer_data.gst_name,
        "gst_number": customer_data.gst_number,
        
        # Address
        "address": customer_data.address,
        "city": customer_data.city,
        "pincode": customer_data.pincode,
        
        # Preferences
        "allergies": customer_data.allergies or [],
        "favorites": customer_data.favorites or [],
        
        # Custom Fields
        "custom_field_1": customer_data.custom_field_1,
        "custom_field_2": customer_data.custom_field_2,
        "custom_field_3": customer_data.custom_field_3,
        
        # Notes
        "notes": customer_data.notes,
        
        # Bonus
        "first_visit_bonus_awarded": first_visit_bonus > 0
    }
    
    await db.customers.insert_one(customer_doc)
    
    # Record first visit bonus transaction if awarded
    if first_visit_bonus > 0:
        tx_doc = {
            "id": str(uuid.uuid4()),
            "user_id": restaurant_id,
            "customer_id": customer_id,
            "points": first_visit_bonus,
            "transaction_type": "bonus",
            "description": "First visit bonus - Welcome reward",
            "bill_amount": None,
            "balance_after": first_visit_bonus,
            "created_at": now
        }
        await db.points_transactions.insert_one(tx_doc)
    
    return {
        "message": "Registration successful",
        "customer_id": customer_id,
        "first_visit_bonus_awarded": first_visit_bonus
    }


# Segments router
segments_router = APIRouter(prefix="/segments", tags=["Segments"])

async def count_customers_by_filters(user_id: str, filters: dict) -> int:
    query = build_customer_query(user_id, filters)
    return await db.customers.count_documents(query)

@segments_router.post("", response_model=Segment)
async def create_segment(segment_data: SegmentCreate, user: dict = Depends(get_current_user)):
    segment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    customer_count = await count_customers_by_filters(user["id"], segment_data.filters)
    
    segment_doc = {
        "id": segment_id,
        "user_id": user["id"],
        "name": segment_data.name,
        "filters": segment_data.filters,
        "customer_count": customer_count,
        "created_at": now,
        "updated_at": now
    }
    
    await db.segments.insert_one(segment_doc)
    return Segment(**segment_doc)

@segments_router.get("", response_model=List[Segment])
async def list_segments(user: dict = Depends(get_current_user)):
    segments = await db.segments.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    for segment in segments:
        count = await count_customers_by_filters(user["id"], segment["filters"])
        segment["customer_count"] = count
        await db.segments.update_one(
            {"id": segment["id"]},
            {"$set": {"customer_count": count}}
        )
    
    return [Segment(**s) for s in segments]

@segments_router.get("/{segment_id}", response_model=Segment)
async def get_segment(segment_id: str, user: dict = Depends(get_current_user)):
    segment = await db.segments.find_one({"id": segment_id, "user_id": user["id"]}, {"_id": 0})
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    
    count = await count_customers_by_filters(user["id"], segment["filters"])
    segment["customer_count"] = count
    
    return Segment(**segment)

@segments_router.get("/{segment_id}/customers", response_model=List[Customer])
async def get_segment_customers(segment_id: str, user: dict = Depends(get_current_user)):
    segment = await db.segments.find_one({"id": segment_id, "user_id": user["id"]}, {"_id": 0})
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    
    query = build_customer_query(user["id"], segment["filters"])
    customers = await db.customers.find(query, {"_id": 0}).to_list(1000)
    
    return [Customer(**c) for c in customers]

@segments_router.put("/{segment_id}", response_model=Segment)
async def update_segment(segment_id: str, update_data: SegmentUpdate, user: dict = Depends(get_current_user)):
    segment = await db.segments.find_one({"id": segment_id, "user_id": user["id"]})
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        if "filters" in update_dict:
            count = await count_customers_by_filters(user["id"], update_dict["filters"])
            update_dict["customer_count"] = count
        
        await db.segments.update_one({"id": segment_id}, {"$set": update_dict})
    
    updated_segment = await db.segments.find_one({"id": segment_id}, {"_id": 0})
    return Segment(**updated_segment)

@segments_router.delete("/{segment_id}")
async def delete_segment(segment_id: str, user: dict = Depends(get_current_user)):
    result = await db.segments.delete_one({"id": segment_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Segment not found")
    # Also delete any WhatsApp config for this segment
    await db.segment_whatsapp_config.delete_one({"segment_id": segment_id, "user_id": user["id"]})
    return {"message": "Segment deleted"}

# WhatsApp Configuration for Segments
@segments_router.get("/{segment_id}/whatsapp-config")
async def get_segment_whatsapp_config(segment_id: str, user: dict = Depends(get_current_user)):
    """Get WhatsApp automation config for a segment"""
    config = await db.segment_whatsapp_config.find_one(
        {"segment_id": segment_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not config:
        return {"configured": False}
    return {"configured": True, "config": config}

@segments_router.post("/{segment_id}/whatsapp-config")
async def save_segment_whatsapp_config(segment_id: str, config: dict, user: dict = Depends(get_current_user)):
    """Save WhatsApp automation config for a segment"""
    from datetime import datetime, timezone
    
    # Verify segment exists
    segment = await db.segments.find_one({"id": segment_id, "user_id": user["id"]})
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    
    now = datetime.now(timezone.utc).isoformat()
    config_doc = {
        "segment_id": segment_id,
        "user_id": user["id"],
        "template_id": config.get("template_id"),
        "template_name": config.get("template_name"),
        "variable_mappings": config.get("variable_mappings", {}),
        "variable_modes": config.get("variable_modes", {}),
        "schedule_type": config.get("schedule_type", "now"),  # now, scheduled, recurring
        "scheduled_date": config.get("scheduled_date"),
        "scheduled_time": config.get("scheduled_time", "10:00"),
        "recurring_frequency": config.get("recurring_frequency"),  # daily, weekly, monthly
        "recurring_days": config.get("recurring_days", []),
        "recurring_day_of_month": config.get("recurring_day_of_month"),
        "recurring_end_option": config.get("recurring_end_option", "never"),
        "recurring_end_date": config.get("recurring_end_date"),
        "recurring_occurrences": config.get("recurring_occurrences"),
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }
    
    # Upsert the config
    await db.segment_whatsapp_config.update_one(
        {"segment_id": segment_id, "user_id": user["id"]},
        {"$set": config_doc},
        upsert=True
    )
    
    return {"message": "WhatsApp config saved", "config": config_doc}

@segments_router.delete("/{segment_id}/whatsapp-config")
async def delete_segment_whatsapp_config(segment_id: str, user: dict = Depends(get_current_user)):
    """Remove WhatsApp automation config for a segment"""
    result = await db.segment_whatsapp_config.delete_one(
        {"segment_id": segment_id, "user_id": user["id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="WhatsApp config not found")
    return {"message": "WhatsApp config removed"}

@segments_router.patch("/{segment_id}/whatsapp-config/toggle")
async def toggle_segment_whatsapp_config(segment_id: str, user: dict = Depends(get_current_user)):
    """Pause or resume WhatsApp automation for a segment"""
    from datetime import datetime, timezone
    
    config = await db.segment_whatsapp_config.find_one(
        {"segment_id": segment_id, "user_id": user["id"]}
    )
    if not config:
        raise HTTPException(status_code=404, detail="WhatsApp config not found")
    
    new_status = not config.get("is_active", True)
    now = datetime.now(timezone.utc).isoformat()
    
    await db.segment_whatsapp_config.update_one(
        {"segment_id": segment_id, "user_id": user["id"]},
        {"$set": {"is_active": new_status, "updated_at": now}}
    )
    
    return {
        "message": f"WhatsApp automation {'resumed' if new_status else 'paused'}",
        "is_active": new_status
    }

@segments_router.get("/whatsapp-configs/all")
async def get_all_segment_whatsapp_configs(user: dict = Depends(get_current_user)):
    """Get all WhatsApp configs for user's segments"""
    configs = await db.segment_whatsapp_config.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).to_list(100)
    return {"configs": configs}


