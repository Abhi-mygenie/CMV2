# DinePoints Loyalty & CRM - Product Requirements Document

## Original Problem Statement
Full-stack "DinePoints Loyalty & CRM" application with WhatsApp marketing capabilities via Authkey.io integration. Major UI/UX overhaul for template management, dynamic previews, and navigation restructuring.

## Architecture
- **Frontend**: React (monolithic App.js), Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **3rd Party**: Authkey.io (WhatsApp messaging)

## Credentials
- Email: owner@18march.com / Password: Qplazm@10

## What's Been Implemented
- [x] Advanced Template Management with filtering (status, category, mapped status)
- [x] Dynamic WhatsApp-style previews with live sample customer data
- [x] Custom "Draft" template CRUD flow
- [x] Navigation refactor: Templates as top-level page, Segments as tab in Customers
- [x] Category labels on template cards (verified Feb 2026)
- [x] Variable mapping UI with "Map to Field" / "Custom Text" toggle

## Prioritized Backlog

### P0 - Critical
- [ ] Implement "Send Bill" WhatsApp Automation (backend webhook -> Authkey.io)

### P1 - High
- [ ] Consume Template Status from Authkey API (instead of assuming all Approved)

### P2 - Medium
- [ ] Refactor App.js monolith into modular components/pages/hooks

## Key Files
- `/app/frontend/src/App.js` - All frontend code (7000+ lines)
- `/app/backend/routers/whatsapp.py` - Template & mapping endpoints
- `/app/backend/routers/customers.py` - Customer endpoints + sample data
- `/app/backend/routers/pos.py` - POS webhook (target for Send Bill)

## Key API Endpoints
- `GET /api/customers/sample` - Sample customer for previews
- `POST /api/whatsapp/custom-templates` - Create draft template
- `DELETE /api/whatsapp/custom-templates/{id}` - Delete draft
- `POST /api/pos/webhook/payment-received` - Target for Send Bill automation
