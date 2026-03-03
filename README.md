# DinePoints - Restaurant CRM & Loyalty System

## Overview
DinePoints (MyGenie CRM) is a full-stack Restaurant CRM and Loyalty platform for managing customers, loyalty programs, coupons, WhatsApp automation, feedback, and AI-driven customer insights. Built with React, FastAPI, and MongoDB, with native mobile support via Capacitor.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Shadcn/UI
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **Auth**: JWT-based + Demo Mode
- **Native Apps**: Capacitor 6 (iOS + Android from same codebase)

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

### Building Native Apps
```bash
cd frontend
yarn build
npx cap sync
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode
```

### Demo Mode
Click the **"Try Demo Mode"** button on the login page for instant access with pre-loaded test data.

### Seeding Demo Data
```bash
cd backend
python seed_demo_data.py
```
This populates 55 customers, 305 orders, 1,080 order items, loyalty transactions, coupons, segments, feedback, WhatsApp templates, and automation rules.

## Project Structure

```
/app/
  backend/
    server.py               # FastAPI app entry point & lifespan
    routers/
      auth.py               # Authentication (login, register, demo)
      customers.py          # Customer CRUD, filters, AI Insights
      pos.py                # POS order webhook, customer lookup
      points.py             # Points transactions, loyalty settings
      wallet.py             # Wallet transactions
      coupons.py            # Coupon CRUD
      feedback.py           # Feedback collection & analytics
      whatsapp.py           # WhatsApp templates & automation
      cron.py               # Scheduler admin routes
    models/
      schemas.py            # Pydantic models
    core/
      auth.py               # JWT utilities
      database.py           # MongoDB connection
      scheduler.py          # Background job scheduler
    seed_demo_data.py       # Demo data seeder (orders, items, insights-ready)
    requirements.txt
    .env                    # MONGO_URL, DB_NAME

  frontend/
    src/
      App.js                # Routing only (59 lines)
      App.css               # Global styles
      index.js              # Entry point

      pages/                # Page components (13 files)
        LoginPage.jsx
        RegisterPage.jsx
        DashboardPage.jsx
        CustomersPage.jsx
        CustomerDetailPage.jsx
        CustomerRegistrationPage.jsx  # Public self-registration
        QRCodePage.jsx
        FeedbackPage.jsx
        CouponsPage.jsx
        SegmentsPage.jsx
        SettingsPage.jsx              # 4-tab (Profile/Coupons/WhatsApp/Loyalty)
        LoyaltySettingsPage.jsx
        TemplatesPage.jsx

      components/
        MobileLayout.jsx        # App shell with bottom navigation
        ProtectedRoute.jsx      # Auth guard for protected routes
        shared/
          WhatsAppAutomationContent.jsx
          ComingSoonOverlay.jsx
          DemoModeBanner.jsx
        ui/                     # Shadcn/UI components

      contexts/
        AuthContext.jsx         # Auth state management

      lib/
        constants.js            # Shared constants
        utils.js                # Utility functions

    capacitor.config.ts         # Capacitor configuration
    android/                    # Capacitor Android project
    ios/                        # Capacitor iOS project
    resources/                  # App icon & splash screen sources

  scripts/
    db_export.py              # MongoDB export utility
    db_import.py              # MongoDB import utility

  db_export/                  # MongoDB data dumps (JSON)
```

## Key Features
- **Customer Management**: CRUD with 55+ fields, advanced filtering (11 parameters), quick-filter chips
- **AI Insights**: Real-time customer intelligence (top items, preferred cuisine, visit patterns, spending trends, food customizations)
- **Loyalty Program**: Tier-based (Bronze/Silver/Gold/Platinum), configurable earning/redemption rules, off-peak bonuses
- **Order Processing**: POS webhook with dual storage (embedded items + separate `order_items` collection for AI analytics)
- **Coupon Management**: Create, edit, toggle, delete coupons with usage tracking
- **WhatsApp Automation**: Event-based templates, variable mapping, automation rules
- **Feedback Collection**: Star ratings, phone-linked, dialog-based entry
- **QR Code Registration**: Generate shareable QR for customer self-registration
- **Customer Segments**: Custom grouping for targeted messaging
- **Settings**: Unified 4-tab interface (Profile, Coupons, WhatsApp, Loyalty)
- **Native Mobile Apps**: Capacitor 6 for iOS and Android from same codebase

## Key Database Collections
| Collection | Purpose |
|------------|---------|
| `customers` | Customer profiles (~75 fields) with tier, points, wallet, preferences |
| `orders` | Order records with embedded `items[]` array |
| `order_items` | Flat item documents indexed for AI aggregation queries |
| `points_transactions` | Loyalty points earn/redeem history |
| `wallet_transactions` | Wallet credit/debit history |
| `coupons` | Coupon definitions with usage tracking |
| `loyalty_settings` | Configurable loyalty program rules |
| `feedback` | Customer feedback with star ratings |
| `whatsapp_templates` | Message templates with variable placeholders |
| `automation_rules` | Event-to-template mapping for WhatsApp automation |
| `segments` | Customer segment definitions |
| `users` | Restaurant owner accounts |

## Key API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Regular login (MyGenie API) |
| `/api/auth/demo-login` | POST | Demo mode access |
| `/api/customers` | GET | List customers with filtering |
| `/api/customers/{id}` | GET | Customer detail |
| `/api/customers/{id}/insights` | GET | AI-powered customer insights |
| `/api/pos/orders` | POST | POS order webhook (dual storage) |
| `/api/pos/customer-lookup` | POST | Lookup customer by phone |
| `/api/pos/max-redeemable` | POST | Calculate max redeemable points |

## Documentation
- [API Documentation](./API_DOCUMENTATION.md) - POS integration endpoints with examples
- [Architecture Flow](./ARCHITECTURE_FLOW.md) - Authentication & data flow diagrams
- [Demo Mode Guide](./DEMO_MODE_IMPLEMENTATION.md) - Demo mode setup & usage
- [MyGenie Integration](./MYGENIE_INTEGRATION_GUIDE.md) - POS integration guide
- [Auth Clarification](./USER_AUTHENTICATION_CLARIFICATION.md) - Auth system details
- [User Guide](./USER_GUIDE.md) - Screen-by-screen walkthrough (25 screens)

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

## Demo Credentials
- **Demo Mode**: Click "Try Demo Mode" on login page
- **Demo Account**: `demo@restaurant.com` / `demo123`
- **Production Account**: `owner@18march.com` / `Qplazm@10`

## Project Assets
- **Screenshots**: `/app/screenshots/` (25 mobile-viewport screenshots)
- **Video Reel**: `/app/mygenie_crm_reel.mp4` (2-min 9:16 walkthrough)
- **Screenshots ZIP**: `/app/screenshots.zip`

## Last Updated
March 3, 2026
