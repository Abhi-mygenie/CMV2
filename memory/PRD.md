# MyGenie CRM - Product Requirements Document

## Original Problem Statement
Pull https://github.com/Abhi-mygenie/CMV2.git - Restaurant CRM/Loyalty system

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Radix UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB

## Core Features
- Customer Management with loyalty points
- Wallet transactions
- Coupon system
- Feedback management
- WhatsApp automation
- POS integration with MyGenie

## What's Been Implemented

### Feb 25, 2026 - Initial Setup
- [x] Repository cloned and setup
- [x] Database imported (2,508 documents, 1,967 customers, 6 users)
- [x] Services running (backend + frontend)

### Feb 25, 2026 - Phase 1 Schema Migration
- [x] Added 17 new fields to Customer schema
- [x] Updated backend models (schemas.py)
- [x] Updated customer router (customers.py)
- [x] Updated POS router (pos.py)
- [x] Updated frontend state (App.js)
- [x] Backward compatible - existing data works

## New Customer Fields (Phase 1)
- Basic: gender, preferred_language, segment_tags
- Contact: whatsapp_opt_in, promo_whatsapp/sms/email_allowed, call_allowed, is_blocked
- Loyalty: referral_code, referred_by, membership_id, membership_expiry
- Behavior: avg_order_value, favorite_category, preferred_payment_mode
- System: updated_at

## Prioritized Backlog

### P0 - Critical
- [ ] UI form fields for new customer properties

### P1 - High
- [ ] Phase 2: Address & Corporate expansion fields
- [ ] Phase 3: Journey & WhatsApp CRM tracking fields
- [ ] Referral code generation logic

### P2 - Medium
- [ ] Phase 4: Dining Preferences & Occasions fields
- [ ] Phase 5: Feedback, Flags & AI fields
- [ ] Membership management UI

### P3 - Low
- [ ] Phase 6: Cleanup (gst_name rename, favorites restructure)

## Users in System
1. owner@18march.com - 18march (45 customers)
2. owner@kunafamahal.com - Kunafa Mahal (1,432 customers)
3. owner@hungry.com - Hungry Keya?? (435 customers)
4. demo@restaurant.com - Demo Restaurant (55 customers)
5. owner@shimlatest.com - Shimla Test
6. owner@companyclub.com - Company club

## Documentation
- `/app/docs/CUSTOMER_SCHEMA_MIGRATION_WORKBOOK.md` - Full field mapping
- `/app/docs/PHASE1_DEPENDENCY_ANALYSIS.md` - Implementation details
