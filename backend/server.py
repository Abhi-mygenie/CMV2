from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
import logging

from core.database import db, close_db_connection
from routers import auth, customers, points, wallet, coupons, feedback, whatsapp, pos

# Create the main app
app = FastAPI(title="DinePoints - Loyalty & CRM")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(customers.router)
api_router.include_router(customers.qr_router)
api_router.include_router(customers.segments_router)
api_router.include_router(points.router)
api_router.include_router(points.loyalty_router)
api_router.include_router(wallet.router)
api_router.include_router(coupons.router)
api_router.include_router(feedback.router)
api_router.include_router(feedback.analytics_router)
api_router.include_router(whatsapp.router)
api_router.include_router(pos.router)
api_router.include_router(pos.messaging_router)

# Root routes
@api_router.get("/")
async def root():
    return {"message": "DinePoints API - Loyalty & CRM for Restaurants"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_connection()
