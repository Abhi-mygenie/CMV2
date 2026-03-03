# DinePoints (MyGenie) - Restaurant CRM & Loyalty System

## Original Problem Statement
Clone and develop a Restaurant CRM and Loyalty System with customer management, loyalty points, WhatsApp automation, coupon management, and feedback collection.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI (single App.js monolith)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT-based with demo mode support

## Core Features (Implemented)
- Customer CRUD with 55+ fields
- Advanced customer filtering (11 filter parameters)
- Loyalty points system with tier management
- Coupon management
- WhatsApp automation (event-based templates)
- Feedback collection
- QR code generation
- Segments management
- Demo mode with pre-loaded data

## What's Been Implemented
- **Customer Management**: Full CRUD with advanced filtering, quick filter chips, full-screen filter drawer
- **Settings Page Refactor (COMPLETED Feb 2026)**: 4-tab layout (Profile, Coupons, WhatsApp, Loyalty) with ALL tabs displaying content inline:
  - Profile: WhatsApp API key config + Business profile
  - Coupons: Full CRUD inline
  - WhatsApp: Automation content embedded via `WhatsAppAutomationContent` component with `embedded` prop
  - Loyalty: Full settings inline with tier thresholds, earning/redemption rules, bonus features
- **WhatsApp Automation**: Event-based template mapping, variable mapping, template preview
- **Demo Data**: Populated via `scripts/import_demo_data.py`

## Key Technical Decisions
- `WhatsAppAutomationContent` component uses `ContentWrapper` pattern with `embedded` prop to work both inline (Settings tab) and as standalone page (`/whatsapp-automation`)
- Default tab on Settings page is "Profile"

## Prioritized Backlog
- No pending tasks from user
- Potential: Extract more components from monolithic App.js for better maintainability

## Key Files
- `/app/frontend/src/App.js` - Main monolithic frontend file (8400+ lines)
- `/app/backend/server.py` - FastAPI backend
- `/app/scripts/import_demo_data.py` - Demo data import

## Test Credentials
- Use "Try Demo Mode" button on login page
