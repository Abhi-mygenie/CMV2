# DinePoints - Restaurant CRM & Loyalty System

## Overview
DinePoints is a full-stack Restaurant CRM and Loyalty platform for managing customers, loyalty programs, coupons, WhatsApp automation, and feedback. Built with React, FastAPI, and MongoDB.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Shadcn/UI
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **Auth**: JWT-based + Demo Mode

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB

### Running the Application
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
yarn install
yarn start
```

### Demo Mode
Click the **"Try Demo Mode"** button on the login page for instant access with pre-loaded test data.

## Project Structure

```
/app/
  backend/
    server.py               # FastAPI application & all API routes
    routers/
      auth.py               # Authentication endpoints
    models/
      schemas.py            # Pydantic models
    core/
      auth.py               # JWT utilities
      database.py           # MongoDB connection
    requirements.txt
    .env                    # MONGO_URL, DB_NAME

  frontend/
    src/
      App.js                # Routing only (59 lines)
      App.css               # Global styles
      index.js              # Entry point

      pages/                # Page components
        LoginPage.jsx           # Login + Demo mode
        RegisterPage.jsx        # User registration
        DashboardPage.jsx       # Home dashboard with stats
        CustomersPage.jsx       # Customer list + advanced filters
        CustomerDetailPage.jsx  # Customer profile + transactions
        QRCodePage.jsx          # QR code for customer registration
        FeedbackPage.jsx        # Customer feedback management
        CouponsPage.jsx         # Coupon CRUD
        SegmentsPage.jsx        # Customer segments
        SettingsPage.jsx        # 4-tab settings (Profile/Coupons/WhatsApp/Loyalty)
        LoyaltySettingsPage.jsx # Standalone loyalty config
        TemplatesPage.jsx       # WhatsApp message templates
        CustomerRegistrationPage.jsx  # Public customer self-registration

      components/
        MobileLayout.jsx        # App shell with bottom navigation
        ProtectedRoute.jsx      # Auth guard for protected routes
        shared/
          WhatsAppAutomationContent.jsx  # Reusable WhatsApp automation (embedded + standalone)
          ComingSoonOverlay.jsx          # Feature placeholder overlay
          DemoModeBanner.jsx             # Demo mode indicator banner
        ui/                     # Shadcn/UI components

      contexts/
        AuthContext.jsx         # Auth state management

      lib/
        constants.js            # Shared constants (country codes, options, etc.)
        utils.js                # Utility functions

  scripts/
    import_demo_data.py       # Populate MongoDB with demo data

  db_backup/                  # MongoDB demo data dumps
```

## Key Features
- **Customer Management**: CRUD with 55+ fields, advanced filtering (11 parameters), quick-filter chips
- **Loyalty Program**: Tier-based (Bronze/Silver/Gold/Platinum), points earning/redemption, configurable rules
- **Coupon Management**: Create, edit, toggle, delete coupons with usage tracking
- **WhatsApp Automation**: Event-based templates, variable mapping, automation rules
- **Feedback Collection**: Star ratings, phone-linked, dialog-based entry
- **QR Code Registration**: Generate shareable QR for customer self-registration
- **Segments**: Customer grouping and targeted messaging
- **Settings**: Unified 4-tab interface (Profile, Coupons, WhatsApp, Loyalty)

## API Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for POS integration endpoints.

## Documentation
- [Architecture Flow](./ARCHITECTURE_FLOW.md) - Authentication flow diagrams
- [Demo Mode Guide](./DEMO_MODE_IMPLEMENTATION.md) - Demo mode implementation
- [MyGenie Integration](./MYGENIE_INTEGRATION_GUIDE.md) - POS integration guide
- [Auth Clarification](./USER_AUTHENTICATION_CLARIFICATION.md) - Auth system details

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Backend API base URL |

## Last Updated
March 3, 2026
