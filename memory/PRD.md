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
https://whatsapp-crm-fix-3.preview.emergentagent.com

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

### None Option in Template Dropdown (Feb 25, 2026)
**Feature**: Added "None" option to unmap/clear templates from events
- "None" option appears at top of dropdown in Automation tab
- Selecting "None" and saving removes the template mapping
- Status changes from "Mapped" → "Not Mapped"
- Added DELETE endpoint: `/api/whatsapp/event-template-map/{event_key}`

### Variable Mapping Feature (Feb 25, 2026)
**Feature**: Map template placeholders ({{1}}, {{2}}, etc.) to database fields

**UI Components Added**:
- "Map Variables" button on each template card
- "Mapped" / "Not Mapped" badge showing mapping status
- Variable badges showing current mapping (e.g., `{{1}} → Customer Name`)
- Modal with dropdowns for each variable

**Available Database Fields**:
- customer_name, points_balance, points_earned, points_redeemed
- wallet_balance, amount, tier, restaurant_name
- coupon_code, expiry_date

**Backend Endpoints Added**:
- `GET /api/whatsapp/template-variable-map` - Get all mappings
- `PUT /api/whatsapp/template-variable-map/{template_id}` - Save mappings

**Files Changed**:
- `/app/frontend/src/App.js` - Added modal, state, and functions
- `/app/backend/routers/whatsapp.py` - Added endpoints

### WhatsApp Message Scheduling UI (Feb 25, 2026)
**Feature**: Added scheduling options to the "Send WhatsApp Message" modal in Segments page

**UI Components Added**:
- **Send Now**: Immediate one-time send (default)
- **Schedule for Later**: Date picker + time picker for one-time scheduled send
- **Recurring**: Repeating message schedule with:
  - Frequency: Daily, Weekly, Monthly
  - Weekly: Day selector (Mon-Sun circular buttons)
  - Monthly: Day of month dropdown (1st-31st)
  - Send Time picker
  - End condition: Never, On date, After X occurrences

**Button Text Changes**:
- "Send Now" → for immediate send
- "Schedule Message" → for scheduled
- "Set Recurring" → for recurring

**Validation**:
- Requires date for scheduled option
- Requires at least one day selected for weekly recurring

**State Variables Added**:
- sendOption, scheduledDate, scheduledTime
- recurringFrequency, recurringDays, recurringDayOfMonth
- recurringEndOption, recurringEndDate, recurringOccurrences

**Files Changed**:
- `/app/frontend/src/App.js` (Segments page - Send Message Modal)

## Upcoming Tasks
- Backend API for saving and processing scheduled messages
- Cron job for triggering scheduled/recurring messages
- Message history and status tracking
