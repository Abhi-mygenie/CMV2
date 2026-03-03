# DinePoints (MyGenie) - Restaurant CRM & Loyalty System

## Original Problem Statement
Clone and develop a Restaurant CRM and Loyalty System with customer management, loyalty points, WhatsApp automation, coupon management, and feedback collection.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Shadcn/UI (modular component architecture)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT-based with Demo Mode support

## File Structure (Post-Refactor - March 2026)
```
frontend/src/
  App.js                          # 59 lines - Routing only
  pages/
    LoginPage.jsx                 # Auth - Login + Demo mode
    RegisterPage.jsx              # Auth - Registration
    DashboardPage.jsx             # Home dashboard with stats
    CustomersPage.jsx             # Customer list + advanced filters
    CustomerDetailPage.jsx        # Customer profile + transactions
    QRCodePage.jsx                # QR code generation
    FeedbackPage.jsx              # Feedback management
    CouponsPage.jsx               # Standalone coupons page
    SegmentsPage.jsx              # Customer segments
    SettingsPage.jsx              # 4-tab settings (Profile/Coupons/WhatsApp/Loyalty)
    LoyaltySettingsPage.jsx       # Standalone loyalty settings
    TemplatesPage.jsx             # WhatsApp message templates
    CustomerRegistrationPage.jsx  # Public customer self-registration
  components/
    MobileLayout.jsx              # App shell with bottom nav
    ProtectedRoute.jsx            # Auth guard
    shared/
      WhatsAppAutomationContent.jsx  # Reusable (embedded prop support)
      ComingSoonOverlay.jsx
      DemoModeBanner.jsx
  contexts/AuthContext.jsx
  lib/constants.js                # Shared constants
```

## Core Features (All Implemented)
- Customer CRUD with 55+ fields and advanced filtering (11 parameters)
- Loyalty program: Tier-based (Bronze/Silver/Gold/Platinum), configurable rules
- Coupon management with full CRUD
- WhatsApp automation with event-based templates
- Feedback collection with star ratings
- QR code customer registration
- Customer segments
- Settings: Unified 4-tab interface (Profile, Coupons, WhatsApp, Loyalty)
- Demo Mode with pre-loaded data

## Completed Work Timeline
- **Feb 2026**: Initial project setup, Customer CRUD, Advanced filtering (UI + Backend)
- **Feb 2026**: Settings page 4-tab refactor, inline content for all tabs
- **Mar 2026**: WhatsApp tab inline embedding (embedded prop pattern)
- **Mar 2026**: Full codebase refactor - App.js from 8,400+ to 59 lines
- **Mar 2026**: All documentation updated to reflect new architecture

## Key Technical Decisions
- `WhatsAppAutomationContent` uses `ContentWrapper` pattern with `embedded` prop
- Settings page default tab is "Profile"
- MobileLayout includes DemoModeBanner for all pages
- Constants extracted to shared `lib/constants.js`

## Prioritized Backlog
- No pending tasks from user

## Key API Endpoints
- `GET /api/customers` - Fetch customers with filtering
- `PUT /api/customers/{id}` - Update customer
- `GET /api/coupons` - Retrieve all coupons
- `POST /api/settings/loyalty` - Save loyalty config
- `POST /api/users/me/whatsapp-key` - Update WhatsApp API key
- `POST /api/auth/demo-login` - Demo mode access

## Test Credentials
Use "Try Demo Mode" button on login page for instant access.
