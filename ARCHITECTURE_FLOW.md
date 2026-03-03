# Authentication & Data Flow - Visual Summary

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

## Frontend Architecture

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
  |     +-- SegmentsPage.jsx .......... /segments
  |     +-- TemplatesPage.jsx ......... /templates
  |     +-- QRCodePage.jsx ............ /qr
  |     +-- FeedbackPage.jsx .......... /feedback
  |     +-- CouponsPage.jsx ........... /coupons
  |     +-- SettingsPage.jsx .......... /settings (4 inline tabs)
  |     +-- LoyaltySettingsPage.jsx ... /loyalty-settings
  |
  +-- Shared Components
        +-- MobileLayout.jsx .......... App shell + bottom nav
        +-- ProtectedRoute.jsx ........ Auth guard
        +-- DemoModeBanner.jsx ........ Demo mode indicator
        +-- ComingSoonOverlay.jsx ..... Feature placeholder
        +-- WhatsAppAutomationContent . Reusable (embedded prop)
```

## Order & AI Insights Data Flow

```
POS System (MyGenie)
        |
        v
POST /api/pos/orders
  (with items[], order_notes, item_notes, item_category)
        |
        +---> orders collection (embedded items[])
        |       Used for: order history display, spending trends
        |
        +---> order_items collection (flat, one doc per item)
        |       Indexed on: customer_id, item_name, order_id
        |       Used for: AI Insights aggregation
        |
        +---> customers collection (update totals)
                avg_order_value, total_spent, visits, tier
        
        
GET /api/customers/{id}/insights
        |
        +---> Aggregates order_items -> top_items, top_categories, common_notes
        +---> Aggregates orders -> frequency, preferred_day, preferred_time, spending_trend
        +---> Reads customer -> avg_order_value
        |
        v
    AI Insights Card (CustomerDetailPage.jsx)
```

## User Journey Examples

### Example 1: Production User Login
```
1. User visits login page
2. Enters email: owner@18march.com
3. Enters password: ********
4. Clicks "Sign In"
5. Frontend -> POST /api/auth/login
6. Backend -> POST MyGenie API
7. MyGenie validates credentials
8. Backend syncs user to local DB
9. Backend creates JWT token
10. User logged in (no demo banner)
```

### Example 2: Demo Mode
```
1. User visits login page
2. Clicks "Try Demo Mode" button
3. Frontend -> POST /api/auth/demo-login
4. Backend -> Query local MongoDB
5. Returns demo@restaurant.com data
6. User logged in instantly
7. Purple demo banner shown on all pages
8. 55 customers + AI Insights available
```

### Example 3: POS Order Processing
```
1. Customer orders at restaurant via POS
2. POS sends POST /api/pos/orders with items[]
3. Backend creates/finds customer
4. Order stored in orders collection (embedded items)
5. Items stored in order_items collection (flat)
6. Points calculated and awarded
7. Customer avg_order_value recalculated
8. AI Insights endpoint now reflects new data
```

## Key Differences

| Aspect | Regular Login | Demo Mode |
|--------|--------------|-----------|
| **Purpose** | Production use | Testing/demos |
| **Authentication** | MyGenie API | Local DB |
| **Users** | ALL users | demo@restaurant.com only |
| **Credentials** | Required | Not required |
| **Banner** | No | Yes (purple) |
| **Data Source** | MyGenie -> Local sync | Local only |
| **AI Insights** | Based on real orders | Pre-seeded (1,080 items) |

## File References

### Backend
- **Main server**: `/app/backend/server.py`
- **Auth router**: `/app/backend/routers/auth.py`
- **Customers router**: `/app/backend/routers/customers.py` (includes insights)
- **POS router**: `/app/backend/routers/pos.py` (order webhook)
- **Schemas**: `/app/backend/models/schemas.py`
- **Auth helpers**: `/app/backend/core/auth.py`
- **Database**: `/app/backend/core/database.py`
- **Demo seeder**: `/app/backend/seed_demo_data.py`

### Frontend
- **Routing**: `/app/frontend/src/App.js`
- **Login UI**: `/app/frontend/src/pages/LoginPage.jsx`
- **Customer Detail + AI Insights**: `/app/frontend/src/pages/CustomerDetailPage.jsx`
- **Auth context**: `/app/frontend/src/contexts/AuthContext.jsx`
- **Settings (4 tabs)**: `/app/frontend/src/pages/SettingsPage.jsx`
- **WhatsApp Automation**: `/app/frontend/src/components/shared/WhatsAppAutomationContent.jsx`
- **Constants**: `/app/frontend/src/lib/constants.js`

---

**Last Updated**: March 3, 2026
