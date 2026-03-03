# Demo Mode Implementation Guide

## Overview
DinePoints includes a **Demo Mode** feature that allows users to explore the platform with test data, while keeping regular user authentication ready for MyGenie API integration.

## Architecture

### Data Flow
```
LOGIN PAGE
  * Regular Login Form -> MyGenie API (placeholder)
  * "Try Demo Mode" Button -> Local DB

Demo Mode Path:
  POST /api/auth/demo-login
  -> No credentials needed
  -> Uses test@restaurant.com
  -> Returns is_demo: true

Regular Login Path:
  POST /api/auth/login -> /api/auth/mygenie-login
  -> Requires email/password
  -> TODO: MyGenie API integration
  -> Returns is_demo: false
```

## Backend Changes

### 1. Schema (`/app/backend/models/schemas.py`)
```python
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_demo: bool = False
```

### 2. Auth Endpoints (`/app/backend/routers/auth.py`)

| Endpoint | Purpose | Data Source |
|----------|---------|-------------|
| `POST /api/auth/demo-login` | Instant demo access | Local MongoDB |
| `POST /api/auth/mygenie-login` | Production auth | MyGenie API (placeholder) |
| `POST /api/auth/login` | Unified entry | Routes to mygenie-login |

## Frontend Implementation

### File Structure (Post-Refactor)
```
frontend/src/
  pages/LoginPage.jsx          # Login form + Demo Mode button
  contexts/AuthContext.jsx      # isDemoMode state, demoLogin()
  components/shared/DemoModeBanner.jsx  # Purple banner component
  components/MobileLayout.jsx   # Includes DemoModeBanner
```

### AuthContext (`/app/frontend/src/contexts/AuthContext.jsx`)
- `isDemoMode` state persisted in localStorage
- `demoLogin()` function for one-click demo access

### DemoModeBanner (`/app/frontend/src/components/shared/DemoModeBanner.jsx`)
- Shows purple gradient banner at top of every page in demo mode
- Sticky positioning, clearly indicates demo status

### Login Page (`/app/frontend/src/pages/LoginPage.jsx`)
- Regular login form (email + password)
- "Try Demo Mode" button with gradient styling
- Visual divider between both options

## Demo User Credentials
- **Email**: test@restaurant.com
- **Password**: Test123456
- **Database**: Local MongoDB
- **Data**: Populated via `scripts/import_demo_data.py`

## Usage

### For End Users
**Demo Mode (Instant Access):**
1. Go to login page
2. Click "Try Demo Mode" button
3. Instantly logged in with test data
4. Purple banner indicates demo mode

**Regular Login (Production):**
1. Enter email and password
2. Click "Sign In"
3. Authenticates via MyGenie (when integrated)

### For Developers
```bash
# API Test - Demo login
curl -X POST http://localhost:8001/api/auth/demo-login

# Seed demo data
cd /app && python scripts/import_demo_data.py
```

## Quick Reference

| Feature | Demo Mode | Regular Mode |
|---------|-----------|--------------|
| Login Method | One-click button | Email + Password |
| Authentication | Local DB | MyGenie API |
| Banner Display | Yes (purple) | No |
| Data Source | Local MongoDB | MyGenie/Local |
| `is_demo` flag | `true` | `false` |

---

**Status**: Fully Implemented and Working
**Last Updated**: March 3, 2026
