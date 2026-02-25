from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional

# Auth Models
class UserBase(BaseModel):
    email: EmailStr
    restaurant_name: str
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    restaurant_name: str
    phone: str
    pos_id: str = ""
    pos_name: str = ""
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_demo: bool = False

# Customer Models
class CustomerBase(BaseModel):
    name: str
    phone: str
    country_code: str = "+91"
    email: Optional[str] = None
    notes: Optional[str] = None
    dob: Optional[str] = None
    anniversary: Optional[str] = None
    customer_type: str = "normal"
    gst_name: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    allergies: Optional[List[str]] = None
    custom_field_1: Optional[str] = None
    custom_field_2: Optional[str] = None
    custom_field_3: Optional[str] = None
    favorites: Optional[List[str]] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    country_code: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    dob: Optional[str] = None
    anniversary: Optional[str] = None
    customer_type: Optional[str] = None
    gst_name: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    allergies: Optional[List[str]] = None
    custom_field_1: Optional[str] = None
    custom_field_2: Optional[str] = None
    custom_field_3: Optional[str] = None
    favorites: Optional[List[str]] = None

class Customer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    name: str
    phone: str
    country_code: str = "+91"
    email: Optional[str] = None
    notes: Optional[str] = None
    dob: Optional[str] = None
    anniversary: Optional[str] = None
    customer_type: str = "normal"
    gst_name: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    allergies: Optional[List[str]] = None
    custom_field_1: Optional[str] = None
    custom_field_2: Optional[str] = None
    custom_field_3: Optional[str] = None
    favorites: Optional[List[str]] = None
    total_points: int = 0
    wallet_balance: float = 0.0
    total_visits: int = 0
    total_spent: float = 0.0
    tier: str = "Bronze"
    created_at: str
    last_visit: Optional[str] = None
    mygenie_customer_id: Optional[int] = None
    mygenie_synced: Optional[bool] = None

# Wallet Transaction Models
class WalletTransactionCreate(BaseModel):
    customer_id: str
    amount: float
    transaction_type: str
    description: str
    payment_method: Optional[str] = None

class WalletTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    customer_id: str
    amount: float
    transaction_type: str
    description: str
    payment_method: Optional[str] = None
    balance_after: float
    created_at: str

# Coupon Models
class CouponCreate(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    start_date: str
    end_date: str
    usage_limit: Optional[int] = None
    per_user_limit: int = 1
    min_order_value: float = 0
    max_discount: Optional[float] = None
    specific_users: Optional[List[str]] = None
    applicable_channels: List[str] = ["delivery", "takeaway", "dine_in"]
    description: Optional[str] = None

class CouponUpdate(BaseModel):
    code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    usage_limit: Optional[int] = None
    per_user_limit: Optional[int] = None
    min_order_value: Optional[float] = None
    max_discount: Optional[float] = None
    specific_users: Optional[List[str]] = None
    applicable_channels: Optional[List[str]] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    code: str
    discount_type: str
    discount_value: float
    start_date: str
    end_date: str
    usage_limit: Optional[int] = None
    per_user_limit: int = 1
    min_order_value: float = 0
    max_discount: Optional[float] = None
    specific_users: Optional[List[str]] = None
    applicable_channels: List[str] = ["delivery", "takeaway", "dine_in"]
    description: Optional[str] = None
    is_active: bool = True
    total_used: int = 0
    created_at: str

class CouponUsage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    coupon_id: str
    customer_id: str
    order_value: float
    discount_applied: float
    channel: str
    used_at: str

# Segment Models
class SegmentCreate(BaseModel):
    name: str
    filters: dict

class SegmentUpdate(BaseModel):
    name: Optional[str] = None
    filters: Optional[dict] = None

class Segment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    name: str
    filters: dict
    customer_count: int = 0
    created_at: str
    updated_at: str

# Points Transaction Models
class PointsTransactionType(str):
    EARN = "earn"
    REDEEM = "redeem"
    BONUS = "bonus"
    EXPIRED = "expired"

class PointsTransactionCreate(BaseModel):
    customer_id: str
    points: int
    transaction_type: str
    description: str
    bill_amount: Optional[float] = None

class PointsTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    customer_id: str
    points: int
    transaction_type: str
    description: str
    bill_amount: Optional[float] = None
    balance_after: int
    created_at: str

# Loyalty Settings Models
class LoyaltySettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    min_order_value: float = 100.0
    bronze_earn_percent: float = 5.0
    silver_earn_percent: float = 7.0
    gold_earn_percent: float = 10.0
    platinum_earn_percent: float = 15.0
    redemption_value: float = 1.0
    min_redemption_points: int = 50
    max_redemption_percent: float = 50.0
    max_redemption_amount: float = 500.0
    points_expiry_months: int = 6
    expiry_reminder_days: int = 30
    tier_silver_min: int = 500
    tier_gold_min: int = 1500
    tier_platinum_min: int = 5000
    custom_field_1_label: str = "Custom Field 1"
    custom_field_2_label: str = "Custom Field 2"
    custom_field_3_label: str = "Custom Field 3"
    custom_field_1_enabled: bool = False
    custom_field_2_enabled: bool = False
    custom_field_3_enabled: bool = False
    birthday_bonus_enabled: bool = True
    birthday_bonus_points: int = 100
    birthday_bonus_days_before: int = 0
    birthday_bonus_days_after: int = 7
    anniversary_bonus_enabled: bool = True
    anniversary_bonus_points: int = 150
    anniversary_bonus_days_before: int = 0
    anniversary_bonus_days_after: int = 7
    first_visit_bonus_enabled: bool = True
    first_visit_bonus_points: int = 50
    off_peak_bonus_enabled: bool = False
    off_peak_start_time: str = "14:00"
    off_peak_end_time: str = "17:00"
    off_peak_bonus_type: str = "multiplier"
    off_peak_bonus_value: float = 2.0
    feedback_bonus_enabled: bool = True
    feedback_bonus_points: int = 25

class LoyaltySettingsUpdate(BaseModel):
    min_order_value: Optional[float] = None
    bronze_earn_percent: Optional[float] = None
    silver_earn_percent: Optional[float] = None
    gold_earn_percent: Optional[float] = None
    platinum_earn_percent: Optional[float] = None
    redemption_value: Optional[float] = None
    min_redemption_points: Optional[int] = None
    max_redemption_percent: Optional[float] = None
    max_redemption_amount: Optional[float] = None
    points_expiry_months: Optional[int] = None
    expiry_reminder_days: Optional[int] = None
    tier_silver_min: Optional[int] = None
    tier_gold_min: Optional[int] = None
    tier_platinum_min: Optional[int] = None
    custom_field_1_label: Optional[str] = None
    custom_field_2_label: Optional[str] = None
    custom_field_3_label: Optional[str] = None
    custom_field_1_enabled: Optional[bool] = None
    custom_field_2_enabled: Optional[bool] = None
    custom_field_3_enabled: Optional[bool] = None
    birthday_bonus_enabled: Optional[bool] = None
    birthday_bonus_points: Optional[int] = None
    birthday_bonus_days_before: Optional[int] = None
    birthday_bonus_days_after: Optional[int] = None
    anniversary_bonus_enabled: Optional[bool] = None
    anniversary_bonus_points: Optional[int] = None
    anniversary_bonus_days_before: Optional[int] = None
    anniversary_bonus_days_after: Optional[int] = None
    first_visit_bonus_enabled: Optional[bool] = None
    first_visit_bonus_points: Optional[int] = None
    off_peak_bonus_enabled: Optional[bool] = None
    off_peak_start_time: Optional[str] = None
    off_peak_end_time: Optional[str] = None
    off_peak_bonus_type: Optional[str] = None
    off_peak_bonus_value: Optional[float] = None
    feedback_bonus_enabled: Optional[bool] = None
    feedback_bonus_points: Optional[int] = None

# Feedback Models
class FeedbackCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    rating: int = Field(..., ge=1, le=5)
    message: Optional[str] = None

class Feedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    rating: int
    message: Optional[str] = None
    status: str = "pending"
    created_at: str

# Analytics Models
class DashboardStats(BaseModel):
    total_customers: int
    total_points_issued: int
    total_points_redeemed: int
    active_customers_30d: int
    new_customers_7d: int
    avg_rating: float
    total_feedback: int

# Messaging Models
class MessageRequest(BaseModel):
    customer_id: str
    message: str
    channel: str = "whatsapp"

# POS Gateway Models
class POSPaymentWebhook(BaseModel):
    customer_phone: str
    bill_amount: float
    channel: str = "dine_in"
    coupon_code: Optional[str] = None
    redeem_points: Optional[int] = None
    bill_id: Optional[str] = None
    metadata: Optional[dict] = None

class POSCustomerLookup(BaseModel):
    phone: str

class POSResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# WhatsApp Template Models
class WhatsAppTemplateCreate(BaseModel):
    name: str
    message: str
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    variables: Optional[List[str]] = None

class WhatsAppTemplateUpdate(BaseModel):
    name: Optional[str] = None
    message: Optional[str] = None
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    variables: Optional[List[str]] = None
    is_active: Optional[bool] = None

class WhatsAppTemplate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    name: str
    message: str
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    variables: Optional[List[str]] = None
    is_active: bool = True
    created_at: str
    updated_at: str

# Automation Rule Models
class AutomationRuleCreate(BaseModel):
    event_type: str
    template_id: str
    is_enabled: bool = True
    delay_minutes: int = 0
    conditions: Optional[dict] = None

class AutomationRuleUpdate(BaseModel):
    event_type: Optional[str] = None
    template_id: Optional[str] = None
    is_enabled: Optional[bool] = None
    delay_minutes: Optional[int] = None
    conditions: Optional[dict] = None

class AutomationRule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    event_type: str
    template_id: str
    is_enabled: bool = True
    delay_minutes: int = 0
    conditions: Optional[dict] = None
    created_at: str
    updated_at: str

# Automation Events
AUTOMATION_EVENTS = [
    "send_bill",
    "points_earned",
    "points_redeemed",
    "bonus_points",
    "wallet_credit",
    "wallet_debit",
    "birthday",
    "anniversary",
    "first_visit",
    "tier_upgrade",
    "coupon_earned",
    "points_expiring",
    "feedback_received",
    "inactive_reminder"
]
