# MyGenie CRM - Product Requirements Document

## Original Problem Statement
Pull https://github.com/Abhi-mygenie/CMV2.git - Restaurant CRM/Loyalty system

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Radix UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB

## What's Been Implemented

### Feb 25, 2026 - Initial Setup
- [x] Repository cloned and setup
- [x] Database imported (2,508 documents, 1,967 customers, 6 users)

### Feb 25, 2026 - Phase 1 Schema Migration (17 fields)
- [x] Basic: gender, preferred_language, segment_tags
- [x] Contact: whatsapp_opt_in, promo_whatsapp/sms/email_allowed, call_allowed, is_blocked
- [x] Loyalty: referral_code, referred_by, membership_id, membership_expiry
- [x] Behavior: avg_order_value, favorite_category, preferred_payment_mode
- [x] System: updated_at

### Feb 25, 2026 - Phase 2 Schema Migration (8 fields)
- [x] Corporate: billing_address, credit_limit, payment_terms
- [x] Address: address_line_2, state, country, delivery_instructions, map_location

## Total New Fields: 25

## Prioritized Backlog

### P0 - Critical
- [ ] UI form fields for new customer properties

### P1 - High
- [ ] Phase 3: Journey & WhatsApp CRM tracking (5 fields)
- [ ] Phase 4: Dining Preferences & Occasions
- [ ] Referral code generation logic

### P2 - Medium
- [ ] Phase 5: Feedback, Flags & AI fields
- [ ] Membership management UI

### P3 - Low
- [ ] Phase 6: Cleanup (gst_name rename)

## Documentation
- `/app/docs/CUSTOMER_SCHEMA_MIGRATION_WORKBOOK.md`
- `/app/docs/PHASE1_DEPENDENCY_ANALYSIS.md`
