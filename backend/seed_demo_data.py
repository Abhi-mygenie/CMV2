#!/usr/bin/env python3
"""
Seed demo data into MongoDB for demo account
Creates a demo restaurant account with 55+ customers and all features
"""

import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
import bcrypt
import random

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

print("🎯 Starting Demo Data Seeding...")

# Clear existing demo data
print("🧹 Clearing existing demo data...")
demo_user = db.users.find_one({"email": "demo@restaurant.com"})
if demo_user:
    demo_user_id = demo_user["id"]
    # Clear with both user_id and restaurant_id (for old data)
    db.customers.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.points_transactions.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.wallet_transactions.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.coupons.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.segments.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.feedback.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.whatsapp_templates.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.automation_rules.delete_many({"$or": [{"user_id": demo_user_id}, {"restaurant_id": demo_user_id}]})
    db.users.delete_one({"id": demo_user_id})
    print(f"✅ Cleared data for existing demo user")

# Create demo user
print("👤 Creating demo user account...")
demo_user_id = "demo-user-restaurant"

# Hash password using bcrypt (same as backend)
password = "demo123"
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

demo_user = {
    "id": demo_user_id,
    "email": "demo@restaurant.com",
    "password_hash": hashed_password,
    "api_key": "demo-api-key-12345",
    "restaurant_name": "Demo Restaurant & Cafe",
    "phone": "+919876543210",
    "created_at": datetime.utcnow().isoformat()
}
db.users.insert_one(demo_user)
print(f"✅ Created demo user: demo@restaurant.com / demo123")

# Helper functions
def random_date_ago(max_days):
    days_ago = random.randint(1, max_days)
    return (datetime.utcnow() - timedelta(days=days_ago)).isoformat()

# Generate customers
print("👥 Creating 55+ customers...")
cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"]
first_names = ["Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Anita", "Sanjay", "Kavita", "Rahul", "Deepika", 
               "Arjun", "Pooja", "Karan", "Neha", "Rohan", "Anjali", "Aditya", "Riya", "Nikhil", "Simran",
               "Varun", "Swati", "Akash", "Meera", "Siddharth", "Nisha", "Harsh", "Tanvi", "Manish", "Isha"]
last_names = ["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Iyer", "Gupta", "Joshi", "Shah", "Mehta",
              "Rao", "Nair", "Verma", "Desai", "Pillai", "Agarwal", "Chopra", "Malhotra", "Saxena", "Bhatia"]

customers = []
for i in range(55):
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    name = f"{first_name} {last_name}"
    phone = f"98{random.randint(10000000, 99999999)}"
    total_spent = random.randint(1000, 50000)
    total_points = int(total_spent * 0.1)
    visits = random.randint(1, 30)
    
    # Determine tier
    if total_spent < 5000:
        tier = "Bronze"
    elif total_spent < 15000:
        tier = "Silver"
    elif total_spent < 30000:
        tier = "Gold"
    else:
        tier = "Platinum"
    
    customer_type = "corporate" if random.random() > 0.85 else "normal"
    wallet_balance = random.randint(0, 2000) if random.random() > 0.7 else 0
    
    customer = {
        "id": f"customer-demo-{i+1}",
        "user_id": demo_user_id,
        "name": name,
        "phone": phone,
        "country_code": "+91",
        "email": f"{first_name.lower()}.{last_name.lower()}@email.com",
        "total_points": total_points,
        "total_spent": total_spent,
        "visits": visits,
        "tier": tier,
        "last_visit": random_date_ago(90),
        "created_at": random_date_ago(365),
        "customer_type": customer_type,
        "gst_name": f"{name} Pvt Ltd" if customer_type == "corporate" else None,
        "gst_number": f"27AABCU9603R1Z{i}" if customer_type == "corporate" else None,
        "city": random.choice(cities),
        "address": f"Office {i+1}, Business Park" if customer_type == "corporate" else None,
        "pincode": f"400{str(random.randint(0, 99)).zfill(3)}",
        "dob": f"199{random.randint(0, 9)}-{str(random.randint(1, 12)).zfill(2)}-{str(random.randint(1, 28)).zfill(2)}" if random.random() > 0.5 else None,
        "anniversary": f"201{random.randint(0, 9)}-{str(random.randint(1, 12)).zfill(2)}-{str(random.randint(1, 28)).zfill(2)}" if random.random() > 0.7 else None,
        "allergies": random.sample(["Peanuts", "Dairy", "Gluten", "Shellfish"], k=random.randint(0, 2)) if random.random() > 0.8 else None,
        "notes": "Prefers window seating" if random.random() > 0.7 else None,
        "wallet_balance": wallet_balance,
        "custom_field_1": random.choice(["Dine-in", "Takeaway", "Delivery"]) if random.random() > 0.5 else None,
        "custom_field_2": None,
        "custom_field_3": None
    }
    customers.append(customer)

db.customers.insert_many(customers)
print(f"✅ Created {len(customers)} customers")

# Generate points transactions
print("💰 Creating points transactions...")
points_transactions = []
transaction_types = ["earned", "redeemed", "bonus"]
reasons = {
    "earned": ["Bill payment", "Purchase", "Dine-in"],
    "redeemed": ["Discount redemption", "Reward claimed"],
    "bonus": ["Birthday bonus", "Anniversary bonus", "First visit bonus"]
}

for customer in customers[:30]:  # Add transactions for first 30 customers
    num_transactions = random.randint(5, 15)
    for j in range(num_transactions):
        trans_type = random.choice(transaction_types)
        points = -random.randint(100, 500) if trans_type == "redeemed" else random.randint(50, 500)
        
        transaction = {
            "id": f"points-{customer['id']}-{j}",
            "user_id": demo_user_id,
            "customer_id": customer["id"],
            "customer_name": customer["name"],
            "points": points,
            "type": trans_type,
            "reason": random.choice(reasons[trans_type]),
            "bill_amount": random.randint(500, 5000) if trans_type == "earned" else None,
            "created_at": random_date_ago(180)
        }
        points_transactions.append(transaction)

if points_transactions:
    db.points_transactions.insert_many(points_transactions)
    print(f"✅ Created {len(points_transactions)} points transactions")

# Generate wallet transactions
print("💳 Creating wallet transactions...")
wallet_transactions = []
wallet_types = ["credit", "debit"]
wallet_reasons = {
    "credit": ["Wallet top-up", "Refund", "Bonus credit"],
    "debit": ["Bill payment", "Purchase"]
}

for customer in customers[:20]:  # Add wallet transactions for first 20 customers
    if customer["wallet_balance"] > 0 or random.random() > 0.5:
        num_transactions = random.randint(3, 10)
        for j in range(num_transactions):
            trans_type = random.choice(wallet_types)
            amount = -random.randint(100, 1000) if trans_type == "debit" else random.randint(500, 2000)
            
            transaction = {
                "id": f"wallet-{customer['id']}-{j}",
                "user_id": demo_user_id,
                "customer_id": customer["id"],
                "customer_name": customer["name"],
                "amount": amount,
                "type": trans_type,
                "reason": random.choice(wallet_reasons[trans_type]),
                "bonus_amount": int(amount * 0.1) if trans_type == "credit" and random.random() > 0.7 else None,
                "created_at": random_date_ago(120)
            }
            wallet_transactions.append(transaction)

if wallet_transactions:
    db.wallet_transactions.insert_many(wallet_transactions)
    print(f"✅ Created {len(wallet_transactions)} wallet transactions")

# Create coupons
print("🎟️ Creating coupons...")
now = datetime.utcnow()
coupons = [
    {
        "id": "coupon-demo-1",
        "user_id": demo_user_id,
        "code": "WELCOME20",
        "description": "Welcome offer - 20% off on first order",
        "discount_type": "percentage",
        "discount_value": 20,
        "min_order_value": 500,
        "max_discount": 200,
        "usage_limit": 100,
        "used_count": 45,
        "valid_from": (now - timedelta(days=30)).isoformat(),
        "valid_until": (now + timedelta(days=30)).isoformat(),
        "channels": ["dine-in", "delivery", "takeaway"],
        "is_active": True,
        "created_at": (now - timedelta(days=30)).isoformat()
    },
    {
        "id": "coupon-demo-2",
        "user_id": demo_user_id,
        "code": "GOLD50",
        "description": "Flat ₹50 off for Gold tier members",
        "discount_type": "fixed",
        "discount_value": 50,
        "min_order_value": 300,
        "max_discount": None,
        "usage_limit": 200,
        "used_count": 87,
        "valid_from": (now - timedelta(days=15)).isoformat(),
        "valid_until": (now + timedelta(days=45)).isoformat(),
        "channels": ["dine-in"],
        "tier_restriction": "Gold",
        "is_active": True,
        "created_at": (now - timedelta(days=15)).isoformat()
    },
    {
        "id": "coupon-demo-3",
        "user_id": demo_user_id,
        "code": "WEEKEND15",
        "description": "Weekend special - 15% off",
        "discount_type": "percentage",
        "discount_value": 15,
        "min_order_value": 800,
        "max_discount": 150,
        "usage_limit": 50,
        "used_count": 23,
        "valid_from": (now - timedelta(days=7)).isoformat(),
        "valid_until": (now + timedelta(days=7)).isoformat(),
        "channels": ["dine-in", "takeaway"],
        "is_active": True,
        "created_at": (now - timedelta(days=7)).isoformat()
    }
]

db.coupons.insert_many(coupons)
print(f"✅ Created {len(coupons)} coupons")

# Create segments
print("📊 Creating customer segments...")
segments = [
    {
        "id": "segment-demo-1",
        "user_id": demo_user_id,
        "name": "VIP Gold Members",
        "description": "Gold tier loyalty members",
        "filters": {"tier": "Gold"},
        "customer_count": len([c for c in customers if c["tier"] == "Gold"]),
        "created_at": (now - timedelta(days=45)).isoformat(),
        "updated_at": (now - timedelta(days=45)).isoformat()
    },
    {
        "id": "segment-demo-2",
        "user_id": demo_user_id,
        "name": "Inactive Customers (30+ days)",
        "description": "Customers who haven't visited in 30+ days",
        "filters": {"last_visit_days": "30"},
        "customer_count": 18,
        "created_at": (now - timedelta(days=30)).isoformat(),
        "updated_at": (now - timedelta(days=30)).isoformat()
    },
    {
        "id": "segment-demo-3",
        "user_id": demo_user_id,
        "name": "Corporate Clients",
        "description": "Business and corporate customers",
        "filters": {"customer_type": "corporate"},
        "customer_count": len([c for c in customers if c["customer_type"] == "corporate"]),
        "created_at": (now - timedelta(days=20)).isoformat(),
        "updated_at": (now - timedelta(days=20)).isoformat()
    }
]

db.segments.insert_many(segments)
print(f"✅ Created {len(segments)} segments")

# Create feedback
print("⭐ Creating feedback entries...")
feedback_list = []
comments = [
    "Great food and service!",
    "Excellent ambiance, loved the experience",
    "Good food but service could be faster",
    "Amazing food quality, will visit again",
    "Nice place for family dining",
    "Delicious food, highly recommended",
    "Outstanding service and hospitality",
    "Best restaurant in the area!"
]

for i, customer in enumerate(customers[:25]):
    if random.random() > 0.3:
        feedback = {
            "id": f"feedback-demo-{i+1}",
            "user_id": demo_user_id,
            "customer_id": customer["id"],
            "customer_name": customer["name"],
            "customer_phone": customer["phone"],
            "rating": random.randint(3, 5),
            "comments": random.choice(comments),
            "created_at": random_date_ago(60)
        }
        feedback_list.append(feedback)

if feedback_list:
    db.feedback.insert_many(feedback_list)
    print(f"✅ Created {len(feedback_list)} feedback entries")

# Create WhatsApp templates
print("💬 Creating WhatsApp templates...")
templates = [
    {
        "id": "template-demo-1",
        "user_id": demo_user_id,
        "name": "Welcome Message",
        "content": "Welcome to {{restaurant_name}}, {{customer_name}}! 🎉 Thank you for joining our loyalty program.",
        "variables": ["restaurant_name", "customer_name"],
        "created_at": (now - timedelta(days=60)).isoformat()
    },
    {
        "id": "template-demo-2",
        "user_id": demo_user_id,
        "name": "Points Earned",
        "content": "Hi {{customer_name}}! You've earned {{points_earned}} points. Your balance: {{points_balance}} points. 🌟",
        "variables": ["customer_name", "points_earned", "points_balance"],
        "created_at": (now - timedelta(days=55)).isoformat()
    },
    {
        "id": "template-demo-3",
        "user_id": demo_user_id,
        "name": "Birthday Wishes",
        "content": "Happy Birthday {{customer_name}}! 🎂 We've added {{points_earned}} bonus points to your account!",
        "variables": ["customer_name", "points_earned"],
        "created_at": (now - timedelta(days=50)).isoformat()
    }
]

db.whatsapp_templates.insert_many(templates)
print(f"✅ Created {len(templates)} WhatsApp templates")

# Create automation rules
print("🤖 Creating automation rules...")
rules = [
    {
        "id": "rule-demo-1",
        "user_id": demo_user_id,
        "event": "points_earned",
        "template_id": "template-demo-2",
        "template_name": "Points Earned",
        "is_enabled": True,
        "delay_minutes": 5,
        "created_at": (now - timedelta(days=50)).isoformat()
    },
    {
        "id": "rule-demo-2",
        "user_id": demo_user_id,
        "event": "birthday",
        "template_id": "template-demo-3",
        "template_name": "Birthday Wishes",
        "is_enabled": True,
        "delay_minutes": 0,
        "created_at": (now - timedelta(days=45)).isoformat()
    }
]

db.automation_rules.insert_many(rules)
print(f"✅ Created {len(rules)} automation rules")

# Create loyalty settings
print("⚙️ Creating loyalty settings...")
loyalty_settings = {
    "id": f"settings-{demo_user_id}",
    "user_id": demo_user_id,
    "points_per_rupee": 1,
    "redemption_rate": 1,
    "min_points_to_redeem": 100,
    "points_expiry_days": 365,
    "birthday_bonus_points": 100,
    "anniversary_bonus_points": 150,
    "first_visit_bonus": 50,
    "bronze_earning_percentage": 100,
    "silver_earning_percentage": 110,
    "gold_earning_percentage": 125,
    "platinum_earning_percentage": 150,
    "bronze_threshold": 0,
    "silver_threshold": 5000,
    "gold_threshold": 15000,
    "platinum_threshold": 30000,
    "off_peak_hours_start": "14:00",
    "off_peak_hours_end": "17:00",
    "off_peak_bonus_percentage": 20,
    "updated_at": now.isoformat()
}

db.loyalty_settings.replace_one(
    {"user_id": demo_user_id},
    loyalty_settings,
    upsert=True
)
print(f"✅ Created loyalty settings")

print("\n" + "="*50)
print("🎉 DEMO DATA SEEDING COMPLETE!")
print("="*50)
print("\n📋 Demo Account Credentials:")
print("   Email: demo@restaurant.com")
print("   Password: demo123")
print("\n📊 Seeded Data Summary:")
print(f"   ✅ {len(customers)} Customers (Bronze, Silver, Gold, Platinum)")
print(f"   ✅ {len(points_transactions)} Points Transactions")
print(f"   ✅ {len(wallet_transactions)} Wallet Transactions")
print(f"   ✅ {len(coupons)} Coupons")
print(f"   ✅ {len(segments)} Customer Segments")
print(f"   ✅ {len(feedback_list)} Feedback Entries")
print(f"   ✅ {len(templates)} WhatsApp Templates")
print(f"   ✅ {len(rules)} Automation Rules")
print(f"   ✅ Loyalty Settings Configured")
print("\n🌐 Login at: https://dinepoints-loyalty-1.preview.emergentagent.com/login")
print("="*50)
