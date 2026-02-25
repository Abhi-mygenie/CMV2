# Dine-In Rewards - Product Requirements Document

## Original Problem Statement
Pull code from `https://github.com/parth-mygenie/dine-in-rewards.git` and set up a full-stack loyalty rewards application for restaurants. The app features customer management, points/wallet transactions, coupon management, POS integration, and WhatsApp automation.

## Architecture
- **Frontend:** React.js (Vite + Shadcn UI)
- **Backend:** FastAPI + Motor (async MongoDB)
- **Database:** MongoDB
- **Auth:** JWT + MyGenie external API
- **Background Jobs:** APScheduler

## What's Been Implemented

### Core Features
- Customer management with tiers (Bronze, Silver, Gold, Platinum)
- Points earning/redemption system
- Wallet transactions
- Coupon management
- POS order webhook integration
- QR code customer sign-up
- Feedback system
- Segments for customer grouping

### WhatsApp Automation
- 10 default templates per user (Welcome, Order Confirmation, Birthday, Anniversary, Points Redeemed, Bonus Points, Tier Upgrade, Points Expiring, Feedback, Wallet Top-up)
- 10 automation rules per user linked to templates
- Template CRUD
- Automation rule CRUD with toggle
- **WhatsApp API Key (AuthKey.io) settings** — added 2026-02-25

### Loyalty Event Automation (Cron Jobs)
- APScheduler daily jobs for birthday/anniversary bonus and points expiry
- Admin endpoints: `/api/cron/status`, `/api/cron/trigger/{job_id}`, `/api/cron/trigger-all`
- Business logic in `backend/core/loyalty_jobs.py`

### POS Webhook
- Refactored into helper functions (_validate_order, _find_or_create_customer, etc.)
- Off-peak bonus logic integrated
- Validation for pos_id and restaurant_id

### Recent Changes (2026-02-25)
- Added WhatsApp API Key (AuthKey.io) input in WhatsApp Settings tab
- Backend: `GET/PUT /api/whatsapp/api-key` endpoints
- Frontend: New "Settings" tab in WhatsApp Automation page

## Pending Issues
- **P0:** Hardcoded `pos_id="0001"` in `backend/routers/auth.py` (~line 240) during MyGenie login

## Known Mocks
- `/api/messaging/send` — does not send real WhatsApp messages

## Key Credentials
- Demo: `demo@restaurant.com` / `demo123`
- MyGenie: `owner@kunafamahal.com` / `Qplazm@10`

## Key Files
- `/app/backend/routers/whatsapp.py` — WhatsApp templates, automation, API key
- `/app/backend/routers/pos.py` — POS webhook (refactored)
- `/app/backend/routers/auth.py` — Auth + MyGenie login
- `/app/backend/core/scheduler.py` — APScheduler config
- `/app/backend/core/loyalty_jobs.py` — Cron job business logic
- `/app/backend/routers/cron.py` — Cron admin endpoints

### DB Export/Import (2026-02-25)
- Created `scripts/db_export.py` — exports all MongoDB collections to `/app/db_export/*.json`
- Created `scripts/db_import.py` — imports data back with `--drop` (replace) or `--merge` (skip duplicates) modes
- All 13 collections exported (1967 customers, 6 users, 70 automation rules, etc.)

## Backlog
- P0: Fix hardcoded pos_id in MyGenie login
- P1: Implement WhatsApp message sending logic via AuthKey.io
- P2: Refactor App.js into smaller components
