# MyGenie CRM - Product Requirements Document

## Original Problem Statement
Pull https://github.com/Abhi-mygenie/CMV2.git - Restaurant CRM/Loyalty system

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Radix UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB

## Schema Migration Complete (55 New Fields)

### Phase 1-5 Fields Added
- Basic, Contact, Loyalty, Behavior (17)
- Address & Corporate (8)
- Journey & WhatsApp CRM (10)
- Dining & Occasions (11)
- Feedback, Flags & AI (9)

## UI Implementation Status

### Phase 1 UI Complete ✅
New Accordion-Based Add Customer Form with 10 sections:
1. Basic Information (8 fields)
2. Contact Preferences (6 toggles)
3. Membership (2 fields)
4. Address (6 fields)
5. Corporate Info (4 fields) - conditional
6. Source & Journey (3 fields)
7. Dining Preferences (7 fields)
8. Special Occasions (2 fields)
9. Tags & Flags (3 toggles)
10. Custom Fields & Notes (4 fields)

## Prioritized Backlog

### P0 - Critical
- [ ] Update Edit Customer modal with accordion structure

### P1 - High
- [ ] Customer detail view (read-only sections)
- [ ] Referral code auto-generation

### P2 - Medium
- [ ] AI scoring algorithms
- [ ] Churn prediction model

## Documentation
- `/app/docs/CUSTOMER_SCHEMA_MIGRATION_WORKBOOK.md`
- `/app/docs/PHASE1_DEPENDENCY_ANALYSIS.md`
