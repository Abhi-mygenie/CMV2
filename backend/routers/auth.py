from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
import os

from core.database import db
from core.auth import hash_password, verify_password, create_token, generate_api_key, get_current_user
from models.schemas import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Demo user credentials
DEMO_EMAIL = "test@restaurant.com"
DEMO_PASSWORD = "Test123456"

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    api_key = generate_api_key()
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "restaurant_name": user_data.restaurant_name,
        "phone": user_data.phone,
        "password_hash": hash_password(user_data.password),
        "api_key": api_key,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create default loyalty settings
    settings_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "min_order_value": 100.0,
        "bronze_earn_percent": 5.0,
        "silver_earn_percent": 7.0,
        "gold_earn_percent": 10.0,
        "platinum_earn_percent": 15.0,
        "redemption_value": 0.25,
        "min_redemption_points": 100,
        "max_redemption_percent": 50.0,
        "max_redemption_amount": 500.0,
        "points_expiry_months": 6,
        "expiry_reminder_days": 30,
        "tier_silver_min": 500,
        "tier_gold_min": 1500,
        "tier_platinum_min": 5000,
        "birthday_bonus_enabled": True,
        "birthday_bonus_points": 100,
        "birthday_bonus_days_before": 0,
        "birthday_bonus_days_after": 7,
        "anniversary_bonus_enabled": True,
        "anniversary_bonus_points": 150,
        "anniversary_bonus_days_before": 0,
        "anniversary_bonus_days_after": 7,
        "first_visit_bonus_enabled": True,
        "first_visit_bonus_points": 50,
        "off_peak_bonus_enabled": False,
        "off_peak_start_time": "14:00",
        "off_peak_end_time": "17:00",
        "off_peak_bonus_type": "multiplier",
        "off_peak_bonus_value": 2.0,
        "feedback_bonus_enabled": True,
        "feedback_bonus_points": 25
    }
    await db.loyalty_settings.insert_one(settings_doc)
    
    token = create_token(user_id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            restaurant_name=user_data.restaurant_name,
            phone=user_data.phone,
            created_at=user_doc["created_at"]
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    Unified login endpoint - routes to MyGenie authentication
    Kept for backward compatibility, calls mygenie_login internally
    """
    return await mygenie_login(credentials)

@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        restaurant_name=user["restaurant_name"],
        phone=user["phone"],
        created_at=user["created_at"]
    )

@router.post("/demo-login", response_model=TokenResponse)
async def demo_login():
    """
    Demo mode login - uses local test user without MyGenie authentication
    For testing and demonstration purposes only
    """
    user = await db.users.find_one({"email": DEMO_EMAIL}, {"_id": 0})
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Demo user not found. Please run setup first."
        )
    
    token = create_token(user["id"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            restaurant_name=user["restaurant_name"],
            phone=user["phone"],
            created_at=user["created_at"]
        ),
        is_demo=True
    )

@router.post("/mygenie-login", response_model=TokenResponse)
async def mygenie_login(credentials: UserLogin):
    """
    Production login - Authenticates via MyGenie API
    Endpoint: https://preprod.mygenie.online/api/v1/auth/vendoremployee/login
    """
    import httpx
    
    mygenie_api_url = os.getenv("MYGENIE_API_URL", "https://preprod.mygenie.online")
    login_endpoint = os.getenv("MYGENIE_LOGIN_ENDPOINT", "/api/v1/auth/vendoremployee/login")
    profile_endpoint = os.getenv("MYGENIE_PROFILE_ENDPOINT", "/api/v1/vendoremployee/profile")
    
    async with httpx.AsyncClient() as client:
        try:
            # Step 1: Authenticate with MyGenie
            login_response = await client.post(
                f"{mygenie_api_url}{login_endpoint}",
                json={
                    "email": credentials.email,
                    "password": credentials.password
                },
                headers={"Content-Type": "application/json"},
                timeout=10.0
            )
            
            if login_response.status_code != 200:
                raise HTTPException(
                    status_code=401, 
                    detail="Invalid credentials"
                )
            
            login_data = login_response.json()
            mygenie_token = login_data.get("token")
            
            if not mygenie_token:
                raise HTTPException(
                    status_code=500,
                    detail="MyGenie authentication failed - no token received"
                )
            
            # Step 2: Get user profile from MyGenie
            profile_response = await client.get(
                f"{mygenie_api_url}{profile_endpoint}",
                headers={
                    "Authorization": f"Bearer {mygenie_token}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            
            if profile_response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to fetch user profile from MyGenie"
                )
            
            profile_data = profile_response.json()
            
            # Extract user information
            user_id = str(profile_data.get("emp_id", uuid.uuid4()))
            email = profile_data.get("emp_email") or credentials.email
            first_name = profile_data.get("emp_f_name", "")
            last_name = profile_data.get("emp_l_name", "") or ""
            restaurant_name = "Unknown"
            phone = ""
            
            # Get restaurant info if available
            if profile_data.get("restaurants") and len(profile_data["restaurants"]) > 0:
                restaurant = profile_data["restaurants"][0]
                restaurant_name = restaurant.get("name", "Unknown")
                phone = restaurant.get("phone", "")
            
            # Step 3: Sync user to local database
            local_user = await db.users.find_one({"email": email})
            
            if not local_user:
                # Create new local user
                user_doc = {
                    "id": user_id,
                    "email": email,
                    "restaurant_name": restaurant_name,
                    "phone": phone,
                    "first_name": first_name,
                    "last_name": last_name,
                    "mygenie_token": mygenie_token,
                    "mygenie_synced": True,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.users.insert_one(user_doc)
                
                # Create default loyalty settings
                settings_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "min_order_value": 100.0,
                    "bronze_earn_percent": 5.0,
                    "silver_earn_percent": 7.0,
                    "gold_earn_percent": 10.0,
                    "platinum_earn_percent": 15.0,
                    "redemption_value": 0.25,
                    "min_redemption_points": 100,
                    "max_redemption_percent": 50.0,
                    "max_redemption_amount": 500.0,
                    "points_expiry_months": 6,
                    "expiry_reminder_days": 30,
                    "tier_silver_min": 500,
                    "tier_gold_min": 1500,
                    "tier_platinum_min": 5000,
                    "birthday_bonus_enabled": True,
                    "birthday_bonus_points": 100,
                    "birthday_bonus_days_before": 0,
                    "birthday_bonus_days_after": 7,
                    "anniversary_bonus_enabled": True,
                    "anniversary_bonus_points": 150,
                    "anniversary_bonus_days_before": 0,
                    "anniversary_bonus_days_after": 7,
                    "first_visit_bonus_enabled": True,
                    "first_visit_bonus_points": 50,
                    "off_peak_bonus_enabled": False,
                    "off_peak_start_time": "14:00",
                    "off_peak_end_time": "17:00",
                    "off_peak_bonus_type": "multiplier",
                    "off_peak_bonus_value": 2.0,
                    "feedback_bonus_enabled": True,
                    "feedback_bonus_points": 25
                }
                await db.loyalty_settings.insert_one(settings_doc)
            else:
                # Update existing user
                user_id = local_user["id"]
                await db.users.update_one(
                    {"email": email},
                    {"$set": {
                        "restaurant_name": restaurant_name,
                        "phone": phone,
                        "first_name": first_name,
                        "last_name": last_name,
                        "mygenie_token": mygenie_token,
                        "last_login": datetime.now(timezone.utc).isoformat()
                    }}
                )
            
            # Step 4: Create local JWT token
            token = create_token(user_id)
            
            # Step 5: Auto-sync customers from MyGenie in background
            try:
                # Fetch customers from MyGenie
                customers_response = await client.post(
                    f"{mygenie_api_url}/api/v2/vendoremployee/restaurant-customer-list",
                    headers={
                        "Authorization": f"Bearer {mygenie_token}",
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-localization": "en"
                    },
                    json={},
                    timeout=15.0
                )
                
                if customers_response.status_code == 200:
                    customers_data = customers_response.json()
                    customer_list = customers_data.get("customer_list", [])
                    
                    # Sync customers to local DB
                    for mygenie_customer in customer_list:
                        customer_data = {
                            "user_id": user_id,
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
                        
                        # Determine tier
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
                        
                        # Check if customer exists
                        existing = await db.customers.find_one({
                            "user_id": user_id,
                            "mygenie_customer_id": mygenie_customer["id"]
                        })
                        
                        if existing:
                            await db.customers.update_one(
                                {"id": existing["id"]},
                                {"$set": customer_data}
                            )
                        else:
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
                    
                    print(f"✅ Auto-synced {len(customer_list)} customers from MyGenie on login")
            except Exception as e:
                # Don't fail login if customer sync fails
                print(f"⚠️ Customer auto-sync failed (non-critical): {str(e)}")
            
            return TokenResponse(
                access_token=token,
                user=UserResponse(
                    id=user_id,
                    email=email,
                    restaurant_name=restaurant_name,
                    phone=phone,
                    created_at=local_user["created_at"] if local_user else user_doc["created_at"]
                ),
                is_demo=False
            )
            
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="MyGenie API timeout")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"MyGenie API error: {str(e)}")
        except Exception as e:
            # Log the error for debugging
            print(f"MyGenie login error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")
