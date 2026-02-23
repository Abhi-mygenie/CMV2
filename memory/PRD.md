# DinePoints - Loyalty & CRM (MyGenie)

## Original Problem Statement
Pull code from https://github.com/Abhi-mygenie/CMV2.git and set it up to run as-is.

## Application Overview
DinePoints is a comprehensive loyalty and CRM platform for restaurants, branded as "MyGenie". It enables restaurant owners to manage customer loyalty programs, track customer visits, issue points, manage wallet balances, and run coupon campaigns.

## Tech Stack
- **Frontend**: React 19 with Tailwind CSS, Radix UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based auth

## Core Features
1. **Customer Management**
   - Add/edit/delete customers
   - Track visits, spending, and loyalty points
   - Customer segmentation by tier (Bronze, Silver, Gold, Platinum)
   - Allergy tracking
   - Custom fields support

2. **Loyalty Program**
   - Points earning based on bill amount
   - Tier-based earning percentages
   - Points redemption
   - Birthday/Anniversary bonuses
   - First visit bonus
   - Off-peak hours bonus

3. **Wallet System**
   - Virtual wallet balance
   - Credit/Debit transactions

4. **Coupon Management**
   - Create/manage promotional coupons
   - Percentage or fixed discounts
   - Usage limits
   - Channel-specific (dine-in, delivery, takeaway)

5. **Customer Segments**
   - Create segments based on filters
   - Target specific customer groups

6. **QR Code Registration**
   - Generate QR codes for customer self-registration

7. **Feedback System**
   - Collect customer feedback
   - Rating system (1-5 stars)

8. **Analytics Dashboard**
   - Total customers, points issued/redeemed
   - Active customers metrics
   - Average ratings

## What's Been Implemented (Feb 23, 2026)
- ✅ Cloned repository and configured for preview environment
- ✅ Updated environment variables (frontend & backend .env)
- ✅ Installed all dependencies
- ✅ Added registration route and signup link to login page
- ✅ Backend APIs tested (88.9% success rate)
- ✅ Frontend fully functional

## API Endpoints
- `/api/auth/*` - Authentication (login, register, me)
- `/api/customers/*` - Customer CRUD
- `/api/segments/*` - Customer segments
- `/api/points/*` - Points transactions
- `/api/wallet/*` - Wallet transactions
- `/api/coupons/*` - Coupon management
- `/api/loyalty/settings` - Loyalty program settings
- `/api/qr/*` - QR code generation
- `/api/feedback/*` - Customer feedback
- `/api/analytics/*` - Dashboard analytics

## Known Issues (Minor)
- POS webhook endpoint requires valid API key
- Some API endpoint parameter formats

## Next Action Items
- None required - app is running as-is

## Preview URL
https://f3af903f-99d0-4b63-a819-ece8671ebffc.preview.emergentagent.com
