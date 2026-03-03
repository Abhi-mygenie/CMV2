# Authentication Flow - Visual Summary

## Current Implementation (March 2026)

```
+================================================================+
|                      LOGIN PAGE                                 |
+=================================================================+
                            |
                +-----------+-----------+
                |                       |
                v                       v
        +---------------+       +-----------------+
        |  REGULAR      |       |  DEMO MODE      |
        |  LOGIN FORM   |       |  BUTTON         |
        +-------+-------+       +--------+--------+
                |                        |
                |                        |
        [Email + Password]        [One Click]
                |                        |
                v                        v
    +---------------------+    +------------------+
    | POST /auth/login    |    | POST /auth/      |
    |         |           |    |   demo-login     |
    | /auth/mygenie-login |    +--------+---------+
    +---------+-----------+             |
              |                         |
              v                         v
    +------------------+      +--------------------+
    |  MYGENIE API     |      |  LOCAL MONGODB     |
    |                  |      |                    |
    |  * Validate      |      |  * Query demo user |
    |    credentials   |      |  * Return token    |
    |  * Return user   |      |  * is_demo: true   |
    |    data          |      |                    |
    |  * Sync to       |      +--------------------+
    |    local DB      |
    |  * is_demo: false|
    +------------------+
```

## Authentication Endpoints

| Endpoint | Method | Purpose | Data Source | is_demo |
|----------|--------|---------|-------------|---------|
| `/auth/login` | POST | Regular login (routes to mygenie-login) | MyGenie API | false |
| `/auth/mygenie-login` | POST | Production auth (explicit) | MyGenie API | false |
| `/auth/demo-login` | POST | Demo mode access | Local MongoDB | true |
| `/auth/register` | POST | New user signup | Local MongoDB | false |

## Frontend Architecture (Post-Refactor)

```
App.js (Routing Only - 59 lines)
  |
  +-- LoginPage.jsx ................... /login
  +-- RegisterPage.jsx ................ /register
  +-- CustomerRegistrationPage.jsx .... /register-customer/:restaurantId
  |
  +-- [ProtectedRoute wrapper]
  |     +-- DashboardPage.jsx ......... /
  |     +-- CustomersPage.jsx ......... /customers
  |     +-- CustomerDetailPage.jsx .... /customers/:id
  |     +-- SegmentsPage.jsx .......... /segments (redirects to /customers)
  |     +-- TemplatesPage.jsx ......... /templates
  |     +-- QRCodePage.jsx ............ /qr
  |     +-- FeedbackPage.jsx .......... /feedback
  |     +-- CouponsPage.jsx ........... /coupons
  |     +-- SettingsPage.jsx .......... /settings (4 inline tabs)
  |     +-- LoyaltySettingsPage.jsx ... /loyalty-settings
  |     +-- WhatsAppAutomationPage .... /whatsapp-automation
  |
  +-- Shared Components
        +-- MobileLayout.jsx .......... App shell + bottom nav
        +-- ProtectedRoute.jsx ........ Auth guard
        +-- DemoModeBanner.jsx ........ Demo mode indicator
        +-- ComingSoonOverlay.jsx ..... Feature placeholder
        +-- WhatsAppAutomationContent . Reusable (embedded prop)
```

## User Journey Examples

### Example 1: Production User Login
```
1. User visits login page
2. Enters email: owner@myrestaurant.com
3. Enters password: ********
4. Clicks "Sign In"
5. Frontend -> POST /api/auth/login
6. Backend -> POST https://api.mygenie.com/auth/login
7. MyGenie validates credentials
8. MyGenie returns user data
9. Backend syncs user to local DB
10. Backend creates JWT token
11. User logged in
12. No demo banner shown
```

### Example 2: Demo Mode (Quick Testing)
```
1. User visits login page
2. Clicks "Try Demo Mode" button
3. Frontend -> POST /api/auth/demo-login
4. Backend -> Query local MongoDB
5. Returns test@restaurant.com data
6. User logged in instantly
7. Purple demo banner shown on all pages
```

## Key Differences

| Aspect | Regular Login | Demo Mode |
|--------|--------------|-----------|
| **Purpose** | Production use | Testing/demos |
| **Authentication** | MyGenie API | Local DB |
| **Users** | ALL users | test@restaurant.com only |
| **Credentials** | Required | Not required |
| **Banner** | No | Yes (purple) |
| **Data Source** | MyGenie -> Local sync | Local only |
| **Speed** | ~1-2 seconds | Instant |

## Integration Status

### Completed
- Demo Mode fully functional
- Regular login endpoint structure ready
- MyGenie API call code prepared
- User sync logic implemented
- Frontend UI with both options
- Demo banner working
- Full codebase refactored into modular components

### Pending (MyGenie Team)
- MyGenie API credentials (URL, Key)
- API endpoint documentation
- Request/response format confirmation

## File References

### Backend
- **Main server**: `/app/backend/server.py`
- **Auth router**: `/app/backend/routers/auth.py`
- **Schemas**: `/app/backend/models/schemas.py`
- **Auth helpers**: `/app/backend/core/auth.py`
- **Database**: `/app/backend/core/database.py`

### Frontend
- **Routing**: `/app/frontend/src/App.js`
- **Login UI**: `/app/frontend/src/pages/LoginPage.jsx`
- **Auth context**: `/app/frontend/src/contexts/AuthContext.jsx`
- **Settings (4 tabs)**: `/app/frontend/src/pages/SettingsPage.jsx`
- **WhatsApp Automation**: `/app/frontend/src/components/shared/WhatsAppAutomationContent.jsx`
- **Constants**: `/app/frontend/src/lib/constants.js`

---

**Last Updated**: March 3, 2026
