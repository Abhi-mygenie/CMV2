# CMV2 - DinePoints Loyalty & CRM

## Project Overview
Restaurant loyalty and CRM application cloned from https://github.com/Abhi-mygenie/CMV2.git

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React with Tailwind CSS
- **Database**: MongoDB

## What's Been Implemented (Feb 25, 2026)
- ✅ Cloned repository from GitHub
- ✅ Installed backend dependencies (requirements.txt)
- ✅ Installed frontend dependencies (yarn)
- ✅ Fixed seed script database name (loyalty_app → test_database)
- ✅ Imported production database from db_export/ (2508 documents)
- ✅ Services running (backend on 8001, frontend on 3000)

## Database Contents
- 6 users
- 1967 customers
- 280 points transactions
- 81 wallet transactions
- 70 WhatsApp templates
- 70 automation rules
- 17 feedback entries
- 4 segments
- 3 coupons
- 7 loyalty settings

## Demo Credentials
- Email: demo@restaurant.com
- Password: demo123

## Core Features
- Customer management with tiers (Bronze/Silver/Gold/Platinum)
- Points & loyalty program
- Wallet system
- Coupon management
- Customer segments
- Feedback collection
- WhatsApp automation
- POS integration

## App URL
https://cmv2-test.preview.emergentagent.com

## Updates (Feb 25, 2026 - Session 2)

### Template Dropdown Filtering in WhatsApp Automation
**Feature**: Filter templates in dropdown based on event type
- **Send Bill event**: Shows ALL templates (19 available)
- **Other events**: Only shows templates where first 3 letters match event label
  - E.g., "Wallet Top-up" → shows `wallet_credit` (both start with "wal")
  - E.g., "Points Earned" → shows templates starting with "poi" (if any exist)

**File Changed**: `/app/frontend/src/App.js` (lines 5210-5235)

### Templates Tab Filtering (Feb 25, 2026)
**Feature**: Filter templates list to only show templates matching any event key
- Templates tab now shows only templates whose first 3 letters match ANY event key's first 3 letters
- Count updated from 19 to 3 (filtered)
- Matching templates: `send_creds_first_time`, `wallet_credit`, `send_bill_to_customer`

### Automation Tab Dropdown Fix
- Changed from matching event LABEL to event KEY
- E.g., `wallet_credit` event now matches `wallet_credit` template (both start with "wal")
