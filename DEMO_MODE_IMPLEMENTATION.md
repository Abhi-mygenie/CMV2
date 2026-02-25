# Demo Mode Implementation Guide

## Overview
Successfully implemented a **Demo Mode** feature that allows users to explore the DinePoints platform with test data, while keeping regular user authentication ready for MyGenie API integration.

## Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  LOGIN PAGE                                                 │
│  • Regular Login Form → MyGenie API (placeholder)          │
│  • "Try Demo Mode" Button → Local DB                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├─── Demo Mode Path
                      │    POST /api/auth/demo-login
                      │    • No credentials needed
                      │    • Uses test@restaurant.com
                      │    • Returns is_demo: true
                      │
                      └─── Regular Login Path
                           POST /api/auth/login → /api/auth/mygenie-login
                           • Requires email/password
                           • TODO: MyGenie API integration
                           • Returns is_demo: false
```

## Backend Changes

### 1. Updated Schema (`/app/backend/models/schemas.py`)
```python
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_demo: bool = False  # New field
```

### 2. New Auth Endpoints (`/app/backend/routers/auth.py`)

#### A. Demo Login Endpoint
- **Endpoint**: `POST /api/auth/demo-login`
- **Purpose**: Instant login with test user for demos
- **Data Source**: Local MongoDB
- **User**: test@restaurant.com
- **Response**: `is_demo: true`

#### B. MyGenie Login Endpoint
- **Endpoint**: `POST /api/auth/mygenie-login`
- **Purpose**: Production authentication
- **Data Source**: MyGenie API (placeholder - currently uses local DB)
- **Response**: `is_demo: false`
- **TODO**: Replace with actual MyGenie API integration

#### C. Unified Login Endpoint
- **Endpoint**: `POST /api/auth/login`
- **Purpose**: Backward compatibility
- **Behavior**: Routes to `mygenie-login` internally

## Frontend Changes

### 1. AuthContext Updates (`/app/frontend/src/contexts/AuthContext.jsx`)

Added:
- `isDemoMode` state
- `demoLogin()` function
- Demo mode persistence in localStorage

```javascript
const [isDemoMode, setIsDemoMode] = useState(
  localStorage.getItem("is_demo") === "true"
);

const demoLogin = async () => {
  const res = await axios.post(`${API}/auth/demo-login`);
  localStorage.setItem("is_demo", "true");
  setIsDemoMode(true);
  // ... set token and user
};
```

### 2. Login Page Updates (`/app/frontend/src/App.js`)

Added:
- "Try Demo Mode" button with gradient styling
- Demo login handler
- Visual divider between regular and demo login

### 3. Demo Mode Banner Component

```javascript
const DemoModeBanner = () => {
  const { isDemoMode } = useAuth();
  
  if (!isDemoMode) return null;
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600...">
      🎭 Demo Mode - Exploring with test data
    </div>
  );
};
```

Banner appears:
- At the top of every page when in demo mode
- Sticky positioning
- Purple-pink gradient with emoji
- Clearly indicates demo status

## Testing Results

### ✅ Demo Login API
```bash
curl -X POST http://localhost:8001/api/auth/demo-login
# Response:
{
  "is_demo": true,
  "access_token": "...",
  "user": {
    "email": "test@restaurant.com",
    "restaurant_name": "Test Restaurant"
  }
}
```

### ✅ Regular Login API
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -d '{"email": "test@restaurant.com", "password": "Test123456"}'
# Response:
{
  "is_demo": false,
  "access_token": "...",
  "user": {...}
}
```

### ✅ UI Testing
- Login page displays both options
- Demo button works without credentials
- Dashboard shows demo banner
- Banner persists across all pages
- Regular login doesn't show banner

## Demo User Credentials

**Local Test User** (for demo mode):
- Email: test@restaurant.com
- Password: Test123456
- Database: Local MongoDB
- Data: Empty (can seed with `/app/backend/seed_demo_data.py`)

## MyGenie API Integration (TODO)

### Current State
The `mygenie_login` endpoint currently uses local authentication as a placeholder.

### Integration Steps
1. Get MyGenie API credentials:
   - API Base URL
   - Authentication endpoint
   - API key/secret
   - Request/response format

2. Update `/app/backend/routers/auth.py`:
```python
@router.post("/mygenie-login")
async def mygenie_login(credentials: UserLogin):
    # TODO: Replace this section
    import httpx
    
    mygenie_api_url = os.getenv("MYGENIE_API_URL")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{mygenie_api_url}/auth/login",
            json={
                "email": credentials.email,
                "password": credentials.password
            },
            headers={"X-API-Key": os.getenv("MYGENIE_API_KEY")}
        )
        
        if response.status_code != 200:
            raise HTTPException(401, "Invalid credentials")
        
        mygenie_user = response.json()
        
        # Sync user to local DB if needed
        # Create token
        # Return response with is_demo=False
```

3. Add environment variables:
```bash
# Backend .env
MYGENIE_API_URL=https://api.mygenie.com
MYGENIE_API_KEY=your_api_key_here
```

## Usage Instructions

### For End Users

**Demo Mode** (Instant Access):
1. Go to login page
2. Click "🎭 Try Demo Mode" button
3. Instantly logged in with test data
4. Purple banner at top indicates demo mode

**Regular Login** (Production):
1. Enter your email and password
2. Click "Sign In"
3. Authenticates via MyGenie (when integrated)
4. No demo banner shown

### For Developers

**Testing Demo Mode:**
```bash
# API Test
curl -X POST http://localhost:8001/api/auth/demo-login

# UI Test
# Visit login page and click demo button
```

**Adding Demo Data:**
```bash
# Run seed script to populate demo restaurant with customers
cd /app/backend
python seed_demo_data.py
```

## File Changes Summary

### Backend
- ✅ `/app/backend/models/schemas.py` - Added `is_demo` field
- ✅ `/app/backend/routers/auth.py` - Added demo/mygenie endpoints

### Frontend
- ✅ `/app/frontend/src/contexts/AuthContext.jsx` - Demo mode state & functions
- ✅ `/app/frontend/src/App.js` - Demo button & banner UI

## Security Notes

1. Demo mode uses actual authentication (JWT tokens)
2. Demo user is a real user in the database
3. All API endpoints work normally in demo mode
4. Demo mode flag is stored in localStorage (client-side only)
5. Backend validates tokens the same way for both modes

## Future Enhancements

- [ ] Add data isolation for demo mode (separate DB or namespace)
- [ ] Auto-reset demo data periodically
- [ ] Add more demo users with different roles
- [ ] Demo mode timeout/session management
- [ ] Analytics tracking for demo vs real usage

---

## Quick Reference

| Feature | Demo Mode | Regular Mode |
|---------|-----------|--------------|
| Login Method | One-click button | Email + Password |
| Authentication | Local DB | MyGenie API |
| Banner Display | Yes (purple) | No |
| Data Source | Local MongoDB | MyGenie/Local |
| Test Credentials | Not needed | User's own |
| `is_demo` flag | `true` | `false` |

---

**Status**: ✅ Fully Implemented and Working
**Last Updated**: February 24, 2026
