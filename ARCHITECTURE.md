# 🏗️ DinePoints (MyGenie) - Complete Architecture

## 📦 Monorepo Structure

This is a **MONOREPO** with three separate applications sharing one backend:

```
/app/
├── backend/          # FastAPI (Python) - Shared by all clients
├── frontend/         # React Web App (separate codebase)
├── mobile/           # React Native + Expo (separate codebase)
├── backend_old/      # Backup
├── frontend_old/     # Backup
└── memory/           # Documentation & PRD
```

---

## 🎯 Architecture Overview

### **3 Applications, 1 Backend:**

```
┌─────────────────┐
│   Web App       │──┐
│   (React)       │  │
└─────────────────┘  │
                     │    ┌──────────────────┐      ┌──────────────┐
┌─────────────────┐  ├───▶│  Backend API     │─────▶│   MongoDB    │
│   Mobile App    │──┘    │  (FastAPI)       │      │   Database   │
│  (React Native) │       │  Port: 8001      │      └──────────────┘
└─────────────────┘       └──────────────────┘
```

---

## 1️⃣ **Backend (Shared API)**

**Location:** `/app/backend/`

**Tech Stack:**
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Motor async driver)
- **Authentication:** JWT (bcrypt password hashing)
- **Port:** 8001

**Structure:**
```
backend/
├── server.py                    # Main FastAPI app
├── core/
│   ├── auth.py                 # JWT auth, password hashing
│   ├── database.py             # MongoDB connection
│   └── config.py               # Configuration
├── routers/
│   ├── auth.py                 # Login, register, /auth/me
│   ├── customers.py            # Customer CRUD
│   ├── points.py               # Points transactions
│   ├── wallet.py               # Wallet operations
│   ├── coupons.py              # Coupon management
│   ├── segments.py             # Customer segments
│   ├── feedback.py             # Feedback system
│   ├── whatsapp.py             # WhatsApp templates & automation
│   ├── loyalty.py              # Loyalty settings
│   ├── analytics.py            # Dashboard analytics
│   └── qr.py                   # QR code generation
├── models/
│   └── schemas.py              # Pydantic models
└── seed_demo_data.py           # Demo data seeding script
```

**Key Features:**
- ✅ RESTful API with `/api` prefix
- ✅ JWT authentication
- ✅ Async MongoDB operations
- ✅ CORS enabled for web & mobile
- ✅ Comprehensive error handling

**API Base URL:**
- Production: `https://loyalty-automation-1.preview.emergentagent.com/api`
- Local: `http://localhost:8001/api`

---

## 2️⃣ **Frontend (Web App)**

**Location:** `/app/frontend/`

**Tech Stack:**
- **Framework:** React 19
- **Styling:** Tailwind CSS + Custom CSS
- **UI Components:** Radix UI (shadcn/ui pattern)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Create React App (CRACO)
- **Port:** 3000

**Structure:**
```
frontend/src/
├── App.js                      # Main app with all pages (5500+ lines)
├── App.css                     # Global styles
├── components/
│   └── ui/                     # Radix UI components (Button, Input, etc.)
├── contexts/
│   ├── AuthContext.jsx         # Authentication state
│   ├── DemoContext.jsx         # Demo mode state (NEW)
│   └── (integrated in App.js)
├── services/
│   └── mockApi.js              # Mock API for demo mode (NEW)
├── data/
│   └── mockData.js             # Mock data generator (NEW)
├── lib/
│   ├── utils.js                # Utility functions
│   └── constants.js            # Constants
└── hooks/
    └── (custom hooks)
```

**Key Features:**
- ✅ Single-page architecture (everything in App.js)
- ✅ JWT authentication with token storage
- ✅ Mobile-responsive design
- ✅ Bottom navigation for mobile
- ✅ Dashboard, customers, segments, coupons, feedback
- ✅ QR code generation
- ✅ WhatsApp automation
- ✅ Demo mode (offline) - NEW

**Pages:**
- Login / Register
- Dashboard
- Customers (list & detail)
- Segments
- QR Code
- Feedback
- Coupons
- Settings (Loyalty program settings)
- WhatsApp Automation

---

## 3️⃣ **Mobile App (React Native)**

**Location:** `/app/mobile/`

**Tech Stack:**
- **Framework:** React Native
- **Platform:** Expo (~54.0.33)
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind for React Native)
- **HTTP Client:** Axios
- **Storage:** expo-secure-store (tokens)
- **Platforms:** iOS, Android, Web

**Structure:**
```
mobile/
├── app/
│   ├── (auth)/                 # Auth routes (login, register)
│   ├── (tabs)/                 # Tab navigation (home, customers, etc.)
│   ├── _layout.js              # Root layout
│   └── index.js                # Entry point
├── src/
│   ├── components/             # Reusable UI components
│   ├── contexts/               # Auth & other contexts
│   ├── hooks/                  # Custom hooks
│   └── services/
│       └── api.js              # API client (same endpoints as web)
├── assets/                     # Images, icons
└── .env                        # API URL config (NEW)
```

**Key Features:**
- ✅ Native iOS & Android apps
- ✅ Web support (same codebase)
- ✅ Expo Go development
- ✅ File-based routing (Expo Router)
- ✅ Secure token storage
- ✅ Same API as web app
- ✅ NativeWind styling (Tailwind syntax)

**Supported Platforms:**
- 📱 iOS (via Expo Go or standalone)
- 📱 Android (via Expo Go or standalone)
- 🌐 Web (expo web)

---

## 🔄 Data Flow

### Authentication Flow:
```
1. User enters credentials
2. Frontend/Mobile → POST /api/auth/login
3. Backend validates & returns JWT token
4. Client stores token (localStorage / SecureStore)
5. Client includes token in Authorization header
6. Backend validates token on protected routes
```

### Customer Management Flow:
```
1. Frontend/Mobile → GET /api/customers
2. Backend queries MongoDB
3. Returns customer data with points, wallet, tier
4. Client displays in UI
5. User actions → POST/PUT/DELETE /api/customers/*
6. Backend updates MongoDB
7. Returns updated data
```

---

## 🗄️ Database Schema (MongoDB)

**Collections:**

1. **users** - Restaurant owners
   - id, email, password_hash, restaurant_name, phone

2. **customers** - End customers
   - id, restaurant_id, name, phone, email
   - total_points, total_spent, visits, tier
   - wallet_balance, city, allergies, etc.

3. **points_transactions** - Points history
   - id, restaurant_id, customer_id
   - points, type (earned/redeemed/bonus)
   - bill_amount, reason

4. **wallet_transactions** - Wallet history
   - id, restaurant_id, customer_id
   - amount, type (credit/debit)
   - bonus_amount, reason

5. **coupons** - Promotional coupons
   - id, restaurant_id, code, description
   - discount_type, discount_value
   - usage_limit, used_count, channels

6. **segments** - Customer segments
   - id, restaurant_id, name, filters
   - customer_count

7. **feedback** - Customer feedback
   - id, restaurant_id, customer_id
   - rating, comments

8. **whatsapp_templates** - Message templates
   - id, restaurant_id, name, content
   - variables

9. **automation_rules** - WhatsApp automation
   - id, restaurant_id, event, template_id
   - is_enabled, delay_minutes

10. **loyalty_settings** - Loyalty configuration
    - restaurant_id, points_per_rupee
    - tier_thresholds, bonus_percentages

---

## 🔐 Authentication

**Method:** JWT (JSON Web Tokens)

**Flow:**
1. Login → Server validates credentials
2. Server generates JWT with user_id
3. Client stores token:
   - **Web:** localStorage
   - **Mobile:** expo-secure-store
4. Client sends token in Authorization header
5. Server validates token on each request

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 UI/UX Design

**Design System:**
- **Colors:** Orange (#F26B33), Gray scale
- **Typography:** System fonts, responsive sizing
- **Components:** Radix UI (accessible, unstyled)
- **Layout:** Mobile-first responsive design

**Web:**
- Bottom navigation for mobile
- Sidebar for desktop (if expanded)
- Card-based layouts
- Gradient backgrounds

**Mobile:**
- Tab-based navigation
- Native feel with React Native components
- Platform-specific adaptations

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│   Kubernetes Cluster (Preview Env)      │
│                                          │
│  ┌──────────────────┐  ┌──────────────┐│
│  │  Frontend Pod    │  │  Backend Pod ││
│  │  (Port 3000)     │  │  (Port 8001) ││
│  └──────────────────┘  └──────────────┘│
│           │                    │        │
│  ┌────────▼────────────────────▼──────┐ │
│  │      Nginx Ingress Controller      │ │
│  └────────────────────────────────────┘ │
│           │                              │
│  ┌────────▼────────────────────────┐    │
│  │  Cloudflare CDN (Caching)       │    │
│  └─────────────────────────────────┘    │
│           │                              │
└───────────┼──────────────────────────────┘
            │
            ▼
  https://loyalty-automation-1.preview.emergentagent.com
```

**Components:**
- **Frontend Service:** Port 3000 (React dev server)
- **Backend Service:** Port 8001 (Uvicorn/FastAPI)
- **MongoDB:** Localhost:27017 (internal)
- **Ingress:** Routes `/api` → Backend, others → Frontend
- **CDN:** Cloudflare caching layer

---

## 📊 Code Statistics

| Component | Lines of Code | Language | Files |
|-----------|---------------|----------|-------|
| Frontend  | ~5,500        | JavaScript (React) | 1 main + components |
| Mobile    | ~2,000        | JavaScript (React Native) | Multiple files |
| Backend   | ~3,000        | Python (FastAPI) | 15+ files |
| **Total** | **~10,500**   | Mixed | **50+ files** |

---

## 🔧 Development Setup

### Backend:
```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend (Web):
```bash
cd /app/frontend
yarn install
yarn start  # Runs on port 3000
```

### Mobile:
```bash
cd /app/mobile
npm install
npm start   # Opens Expo dev tools
# Then: press 'w' for web, 'a' for Android, 'i' for iOS
```

---

## 🎯 Key Differences: Web vs Mobile

| Feature | Web App | Mobile App |
|---------|---------|------------|
| **Framework** | React 19 | React Native + Expo |
| **Routing** | React Router | Expo Router (file-based) |
| **Storage** | localStorage | expo-secure-store |
| **Styling** | Tailwind CSS | NativeWind (Tailwind) |
| **Components** | Radix UI (HTML) | React Native components |
| **Navigation** | Bottom nav / Links | Tab Navigator |
| **Platform** | Web only | iOS, Android, Web |
| **Hot Reload** | webpack | Metro bundler |
| **Code Sharing** | No shared code | No shared code |

**Note:** While both are React-based, they are **separate codebases** with similar features but different implementations.

---

## 🎉 Demo Mode Architecture (NEW)

**Frontend Only Feature:**

```
┌─────────────────────────────────────┐
│  DemoProvider (Context)             │
│  - enableDemoMode()                 │
│  - disableDemoMode()                │
│  - demoData (all mock data)         │
│  - CRUD operations in-memory        │
└─────────────────┬───────────────────┘
                  │
      ┌───────────▼──────────┐
      │  AuthContext         │
      │  - Detects demo mode │
      │  - Switches API      │
      └───────┬──────────────┘
              │
    ┌─────────▼─────────┐
    │  isDemoMode?      │
    └─────────┬─────────┘
         Yes  │  No
    ┌─────────▼─────────┬──────────────┐
    │                   │              │
┌───▼────────┐    ┌────▼──────┐  ┌────▼──────┐
│ MockApiClient│    │Real Axios │  │Real Axios │
│ (in-memory)  │    │  Client   │  │  Client   │
└──────────────┘    └───────────┘  └───────────┘
```

**Files:**
- `/app/frontend/src/contexts/DemoContext.jsx` - Demo state
- `/app/frontend/src/services/mockApi.js` - Mock API service
- `/app/frontend/src/data/mockData.js` - 55+ mock customers, etc.

---

## 📝 Summary

### **Is this ONE codebase?**

**Yes and No:**

✅ **ONE MONOREPO** - All code in one repository
✅ **ONE BACKEND** - Shared by web and mobile
❌ **THREE SEPARATE APPS:**
  1. Backend (Python/FastAPI)
  2. Frontend Web (React)
  3. Mobile App (React Native)

**NOT shared:**
- Frontend and Mobile have separate implementations
- No code sharing between web and mobile
- Similar folder structure but independent codebases

**SHARED:**
- Same backend API
- Same database
- Same authentication system
- Same data models
- Same business logic

---

**Architecture Type:** **Monorepo with Microservices approach**
- One backend serves multiple frontend clients
- Each client is independently deployable
- Shared API contract (REST endpoints)

---

Built with ❤️ for DinePoints (MyGenie)
