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
   - Edit customer from customer list (edit icon next to name)
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
   - Bonus amount on top-ups (credit to wallet or loyalty points)

4. **Coupon Management**
   - Create/manage promotional coupons
   - Percentage or fixed discounts
   - Usage limits
   - Channel-specific (dine-in, delivery, takeaway)

5. **Customer Segments**
   - Create segments based on filters
   - Target specific customer groups
   - Send WhatsApp campaigns to segments

6. **QR Code Registration**
   - Generate QR codes for customer self-registration

7. **Feedback System**
   - Collect customer feedback
   - Rating system (1-5 stars)

8. **Analytics Dashboard**
   - Total customers, points issued/redeemed
   - Active customers metrics
   - Average ratings

9. **WhatsApp Automation** (NEW - Feb 23, 2026)
   - Create reusable message templates with dynamic variables
   - Variables: {{customer_name}}, {{points_earned}}, {{points_balance}}, {{wallet_balance}}, {{amount}}, {{tier}}, {{restaurant_name}}, {{coupon_code}}, {{expiry_date}}
   - Configure automation rules (event -> template mapping)
   - 13 supported events: points_earned, points_redeemed, bonus_points, wallet_credit, wallet_debit, birthday, anniversary, first_visit, tier_upgrade, coupon_earned, points_expiring, feedback_received, inactive_reminder
   - Enable/disable rules, set delay before sending
   - Live message preview with variable substitution

## What's Been Implemented

### Session: Feb 23, 2026
- ✅ Cloned repository and configured for preview environment
- ✅ Updated environment variables (frontend & backend .env)
- ✅ Installed all dependencies
- ✅ Added registration route and signup link to login page
- ✅ Test data seeding script
- ✅ Bonus points UI/UX improvements
- ✅ WhatsApp campaign UI on Segments page
- ✅ Wallet top-up with bonus amount
- ✅ Bonus destination choice (wallet or loyalty points)
- ✅ Customer card shows wallet balance
- ✅ Coupons page UI redesign
- ✅ Customer edit from both detail and list pages
- ✅ **WhatsApp Templates & Automation feature** (100% tested)

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
- `/api/whatsapp/templates` - WhatsApp template CRUD
- `/api/whatsapp/automation` - Automation rule CRUD
- `/api/whatsapp/automation/events` - List available events
- `/api/whatsapp/automation/{id}/toggle` - Toggle rule enabled/disabled

## MOCKED Features
- Actual WhatsApp message sending (requires WhatsApp Business API integration)
- Segments page "Send via WhatsApp" button shows "Coming Soon"

## Known Issues
- None critical

## Next Action Items
- P1: Integrate WhatsApp Business API for actual message sending
- P2: Customer search with autocomplete in wallet modal
- P3: Backend refactoring (split server.py into routers)

## Preview URL
https://customer-segment-cms.preview.emergentagent.com

## Test Credentials
- Email: demo@restaurant.com
- Password: Demo@123
