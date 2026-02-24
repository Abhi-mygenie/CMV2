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
    Production login - STRICTLY authenticates via MyGenie API
    All users (including test users) must authenticate through MyGenie
    
    Integration Required:
    1. Set MYGENIE_API_URL in environment (.env)
    2. Set MYGENIE_API_KEY in environment (.env)
    3. Uncomment the MyGenie API call section below
    """
    
    # ==========================================
    # TODO: UNCOMMENT THIS SECTION WHEN MYGENIE API IS READY
    # ==========================================
    # import httpx
    # 
    # mygenie_api_url = os.getenv("MYGENIE_API_URL", "https://api.mygenie.com")
    # mygenie_api_key = os.getenv("MYGENIE_API_KEY")
    # 
    # if not mygenie_api_url or not mygenie_api_key:
    #     raise HTTPException(
    #         status_code=500, 
    #         detail="MyGenie API not configured"
    #     )
    # 
    # async with httpx.AsyncClient() as client:
    #     try:
    #         response = await client.post(
    #             f"{mygenie_api_url}/auth/login",
    #             json={
    #                 "email": credentials.email,
    #                 "password": credentials.password
    #             },
    #             headers={
    #                 "X-API-Key": mygenie_api_key,
    #                 "Content-Type": "application/json"
    #             },
    #             timeout=10.0
    #         )
    #         
    #         if response.status_code != 200:
    #             raise HTTPException(
    #                 status_code=401, 
    #                 detail="Invalid credentials from MyGenie"
    #             )
    #         
    #         mygenie_user = response.json()
    #         
    #         # Sync user to local database if needed
    #         user_id = mygenie_user.get("id") or str(uuid.uuid4())
    #         
    #         # Check if user exists locally, if not create
    #         local_user = await db.users.find_one({"email": credentials.email})
    #         if not local_user:
    #             user_doc = {
    #                 "id": user_id,
    #                 "email": mygenie_user["email"],
    #                 "restaurant_name": mygenie_user["restaurant_name"],
    #                 "phone": mygenie_user.get("phone", ""),
    #                 "created_at": datetime.now(timezone.utc).isoformat()
    #             }
    #             await db.users.insert_one(user_doc)
    #         else:
    #             user_id = local_user["id"]
    #         
    #         # Create local JWT token
    #         token = create_token(user_id)
    #         
    #         return TokenResponse(
    #             access_token=token,
    #             user=UserResponse(
    #                 id=user_id,
    #                 email=mygenie_user["email"],
    #                 restaurant_name=mygenie_user["restaurant_name"],
    #                 phone=mygenie_user.get("phone", ""),
    #                 created_at=local_user["created_at"] if local_user else user_doc["created_at"]
    #             ),
    #             is_demo=False
    #         )
    #         
    #     except httpx.TimeoutException:
    #         raise HTTPException(status_code=504, detail="MyGenie API timeout")
    #     except httpx.RequestError as e:
    #         raise HTTPException(status_code=503, detail=f"MyGenie API error: {str(e)}")
    
    # ==========================================
    # TEMPORARY: Local DB fallback (REMOVE AFTER MYGENIE INTEGRATION)
    # ==========================================
    # This is ONLY for development/testing
    # In production, this entire section should be removed
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
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
        is_demo=False
    )
