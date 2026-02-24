# DinePoints - Customer Management & Loyalty Application

## Original Problem Statement
Build a customer management application with MyGenie API integration for:
1. User authentication via MyGenie API
2. Bi-directional customer sync between local DB and MyGenie
3. POS webhook endpoints for external systems
4. Manual customer sync triggered by UI button (not auto-sync on login)

## User Personas
- **Restaurant Owners**: Primary users managing customer loyalty programs
- **POS Systems**: External systems integrating via webhooks

## Core Requirements
- Login via MyGenie API credentials
- Demo mode for testing without MyGenie
- Customer CRUD operations with sync to MyGenie
- Manual customer sync from MyGenie
- POS webhook endpoints for customer create/update

## Technical Stack
- **Frontend**: React + Shadcn/UI + TailwindCSS
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **External API**: MyGenie (preprod.mygenie.online)

## What's Been Implemented

### February 24, 2025

#### Completed
1. **Removed Auto-Sync on Login** (P0)
   - Modified `/app/backend/routers/auth.py` to remove automatic customer sync during MyGenie login
   - Login is now faster (~1.8s vs ~10s+ with auto-sync)
   - Note in code explains users should use manual sync button

2. **Manual Sync API** - Already existed
   - Endpoint: `POST /api/customers/sync-from-mygenie`
   - Uses MyGenie token stored during login
   - Returns sync statistics (new/updated/total)

3. **Frontend Sync Button** - Already existed
   - Located in Customers page header
   - Shows when NOT in demo mode (`!isDemoMode`)
   - Calls manual sync API on click

#### Previously Completed (from earlier sessions)
- MyGenie authentication integration
- Bi-directional customer sync TO MyGenie (on create/update)
- POS webhook endpoints with API key auth:
  - `POST /api/pos/customers` - Create customer
  - `PUT /api/pos/customers/{id}` - Update customer
- Comprehensive customer schema with loyalty fields

## Prioritized Backlog

### P1 - Soon
- [ ] Move hardcoded MyGenie API URLs to `.env` file
- [ ] Add sync button to Settings page as alternative location

### P2 - Later
- [ ] Implement loyalty/wallet redemption UI
- [ ] Address incomplete loyalty transaction history from MyGenie API

### P3 - Future
- [ ] Customer loyalty point redemption flow
- [ ] Wallet balance usage flow

## Key API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | None | MyGenie login |
| `/api/auth/demo-login` | POST | None | Demo mode login |
| `/api/customers` | GET/POST | JWT | List/Create customers |
| `/api/customers/{id}` | GET/PUT/DELETE | JWT | Customer CRUD |
| `/api/customers/sync-from-mygenie` | POST | JWT | Manual sync from MyGenie |
| `/api/pos/customers` | POST | API Key | POS webhook - create |
| `/api/pos/customers/{id}` | PUT | API Key | POS webhook - update |

## Test Credentials
- **MyGenie User**: `owner@kunafamahal.com` / `Qplazm@10`
- **POS API Key**: `dp_live_HsC-SvTGzEeO1WLZcNUfWNnjfZTi7vzQrLDHEKnVLzA`

## Architecture Notes
- `/app/backend/` - Active backend code (served by supervisor)
- `/app/frontend/` - Active frontend code
- `/app/CMV2/` - Git clone reference (not actively served)
