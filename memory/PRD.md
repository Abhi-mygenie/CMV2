# DinePoints - Loyalty & CRM for Restaurants

## Original Problem Statement
Pull code from `https://github.com/parth-mygenie/dine-in-rewards.git` and extend a full-stack loyalty rewards application for restaurants (React + FastAPI + MongoDB). Features include customer management, points/wallet transactions, coupon management, POS integration, and WhatsApp automation.

## Architecture
- **Frontend:** React.js (port 3000)
- **Backend:** FastAPI (port 8001)
- **Database:** MongoDB (loyalty_app)
- **Auth:** JWT + MyGenie external API
- **Scheduler:** APScheduler (AsyncIOScheduler)

## What's Been Implemented
- Application setup from GitHub repo
- Webhook validation for `pos_id` and `restaurant_id` in POS orders
- Birthday & Anniversary bonus endpoints with duplicate prevention
- First Visit bonus on customer creation
- Points expiry reminders and expiry processing
- Default WhatsApp templates/automations for new users
- Frontend bug fix on WhatsApp Automation page
- **[2026-02-25] Automated Cron Jobs:** APScheduler-based daily cron (00:30 UTC) running birthday bonus, anniversary bonus, expiry reminders, and points expiry for ALL users. Includes admin endpoints: `GET /api/cron/status`, `POST /api/cron/trigger`, `POST /api/cron/trigger-all-users`. Run logs persisted to `cron_job_logs` collection.

## Key API Endpoints
- `POST /api/pos/orders` — POS webhook
- `POST /api/auth/mygenie-login` — MyGenie auth
- `POST /api/points/process-birthday-bonus` — Manual birthday bonus
- `POST /api/points/process-anniversary-bonus` — Manual anniversary bonus
- `POST /api/points/process-expiry-reminders` — Manual expiry reminders
- `POST /api/points/expire` — Manual points expiry
- `GET /api/cron/status` — Scheduler status + recent logs
- `POST /api/cron/trigger` — Trigger jobs for current user
- `POST /api/cron/trigger-all-users` — Trigger jobs for all users

## Known Issues
- **Hardcoded `pos_id`:** MyGenie login in `auth.py` hardcodes `pos_id="0001"` (should be dynamic)
- **Mocked messaging:** `/api/messaging/send` does not send real messages

## Backlog (P0-P2)
- **P1:** Fix hardcoded `pos_id` in MyGenie login
- **P1:** Implement Off-Peak Bonus Logic in POS webhook
- **P2:** Refactor monolithic `pos_order_webhook` into helpers

## Credentials
- Demo: `demo@restaurant.com` / `demo123` (via `/api/auth/demo-login`)
- MyGenie: `owner@kunafamahal.com` / `Qplazm@10`
