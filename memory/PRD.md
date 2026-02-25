# DinePoints - Loyalty & CRM Platform

## Original Problem Statement
Pull and set up the CMV2 repository from https://github.com/Abhi-mygenie/CMV2.git

## Architecture
- **Frontend**: React 19 with Tailwind CSS, Radix UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based + MyGenie API integration

## Core Features Implemented
- Customer Management (55+ demo customers)
- Loyalty Points System (319 transactions seeded)
- Wallet Management (66 transactions)
- Coupon Management (3 coupons)
- Customer Segmentation (Bronze, Silver, Gold, Platinum)
- Feedback Collection (19 entries)
- WhatsApp Automation Templates (3 templates)
- QR Code Generation
- Demo Mode for testing

## What's Been Completed (Feb 24, 2026)
- [x] Repository cloned successfully
- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] Services running (backend:8001, frontend:3000)
- [x] Demo data seeded (55 customers, transactions, coupons, etc.)
- [x] Demo login verified working

## Demo Credentials
- **Email**: demo@restaurant.com
- **Password**: demo123

## API Endpoints
- `/api/health` - Health check
- `/api/auth/*` - Authentication routes
- `/api/customers/*` - Customer management
- `/api/points/*` - Points system
- `/api/wallet/*` - Wallet transactions
- `/api/coupons/*` - Coupon management
- `/api/feedback/*` - Feedback collection
- `/api/whatsapp/*` - WhatsApp automation

## URLs
- **Frontend**: https://dine-auth-api.preview.emergentagent.com
- **Backend API**: https://dine-auth-api.preview.emergentagent.com/api
