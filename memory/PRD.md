# MyGenie CRM - Product Requirements Document

## Original Problem Statement
Pull https://github.com/Abhi-mygenie/CMV2.git - Restaurant CRM/Loyalty system

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Radix UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB

## Schema Migration Summary

### Phase 1 (17 fields) - Basic, Contact, Loyalty, Behavior
- gender, preferred_language, segment_tags
- whatsapp_opt_in, promo_whatsapp/sms/email_allowed, call_allowed, is_blocked
- referral_code, referred_by, membership_id, membership_expiry
- avg_order_value, favorite_category, preferred_payment_mode, updated_at

### Phase 2 (8 fields) - Address & Corporate
- address_line_2, state, country, delivery_instructions, map_location
- billing_address, credit_limit, payment_terms

### Phase 3 (10 fields) - Journey & WhatsApp CRM
- lead_source, campaign_source, last_interaction_date, assigned_salesperson
- last_whatsapp_sent, last_whatsapp_response, last_campaign_clicked
- last_coupon_used, automation_status_tag, first_visit_date

### Phase 4 (11 fields) - Dining & Occasions
- preferred_dining_type, preferred_time_slot, favorite_table, avg_party_size
- diet_preference, spice_level, cuisine_preference
- kids_birthday, spouse_name, festival_preference, special_dates

### Phase 5 (9 fields) - Feedback, Flags & AI
- last_rating, nps_score, complaint_flag, vip_flag, blacklist_flag
- predicted_next_visit, churn_risk_score, recommended_offer_type, price_sensitivity_score

## Total: 55 New Customer Fields

## Prioritized Backlog

### P0 - Critical
- [ ] UI form sections for all new fields

### P1 - High
- [ ] Referral code generation logic
- [ ] Membership management

### P2 - Medium
- [ ] AI scoring algorithms
- [ ] Churn prediction model

### P3 - Low
- [ ] Phase 6: Cleanup (gst_name → company_name rename)

## Documentation
- `/app/docs/CUSTOMER_SCHEMA_MIGRATION_WORKBOOK.md`
- `/app/docs/PHASE1_DEPENDENCY_ANALYSIS.md`
