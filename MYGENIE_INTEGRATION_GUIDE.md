# MyGenie API Integration Guide

## Overview
This application uses a dual authentication system:
- **Demo Mode**: Instant access using local database (for testing/demos)
- **Production Mode**: ALL regular logins authenticate through MyGenie API

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LOGIN PAGE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Email] [Password] [Sign In Button]                       │
│           ↓                                                 │
│        STRICTLY MyGenie API                                 │
│        (for ALL users)                                      │
│                                                             │
│  ─────────────── or ───────────────                        │
│                                                             │
│  [🎭 Try Demo Mode Button]                                 │
│           ↓                                                 │
│        Local DB Only                                        │
│        (test@restaurant.com)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flows

### 1. Regular Login (MyGenie API) ⭐ PRIMARY METHOD

**For**: ALL production users including test users
**Endpoint**: `POST /api/auth/login` → `POST /api/auth/mygenie-login`
**Process**:
```
User enters credentials
     ↓
Frontend: POST /api/auth/login
     ↓
Backend: Forward to /api/auth/mygenie-login
     ↓
Call MyGenie API: POST https://api.mygenie.com/auth/login
     ↓
MyGenie validates credentials
     ↓
Sync user to local DB (if new)
     ↓
Return JWT token with is_demo=false
```

### 2. Demo Mode (Local DB) 🎭 TESTING ONLY

**For**: Quick demos without MyGenie dependency
**Endpoint**: `POST /api/auth/demo-login`
**Process**:
```
User clicks "Try Demo Mode"
     ↓
Frontend: POST /api/auth/demo-login
     ↓
Backend: Query local DB for test@restaurant.com
     ↓
Return JWT token with is_demo=true
```

## MyGenie API Integration Steps

### Step 1: Get MyGenie API Credentials

Contact MyGenie team to obtain:
- API Base URL (e.g., `https://api.mygenie.com`)
- API Key or Secret
- Authentication endpoint details
- Request/Response format documentation

### Step 2: Add Environment Variables

Update `/app/backend/.env`:

```bash
# MyGenie API Configuration
MYGENIE_API_URL=https://api.mygenie.com
MYGENIE_API_KEY=your_api_key_here
```

### Step 3: Update Backend Code

Edit `/app/backend/routers/auth.py`:

1. **Uncomment the MyGenie API section** (lines ~145-205)
2. **Remove the temporary local DB fallback** (lines ~210-225)
3. **Adjust based on actual MyGenie API format**

### Step 4: Expected MyGenie API Format

**Request Example:**
```bash
POST https://api.mygenie.com/auth/login
Content-Type: application/json
X-API-Key: your_api_key_here

{
  "email": "user@restaurant.com",
  "password": "userpassword"
}
```

**Success Response (200):**
```json
{
  "id": "user-unique-id",
  "email": "user@restaurant.com",
  "restaurant_name": "User's Restaurant",
  "phone": "9876543210",
  "created_at": "2026-02-24T10:00:00Z"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### Step 5: Update Integration Code

Modify the MyGenie API call section based on actual response format:

```python
# In /app/backend/routers/auth.py - mygenie_login function

response = await client.post(
    f"{mygenie_api_url}/auth/login",  # Adjust endpoint path
    json={
        "email": credentials.email,
        "password": credentials.password
        # Add other fields if required by MyGenie
    },
    headers={
        "X-API-Key": mygenie_api_key,  # Or Authorization: Bearer {token}
        "Content-Type": "application/json"
    },
    timeout=10.0
)

# Adjust this based on actual MyGenie response structure
mygenie_user = response.json()
user_id = mygenie_user.get("id")  # Or mygenie_user["user_id"]
restaurant_name = mygenie_user.get("restaurant_name")  # Or mygenie_user["name"]
```

### Step 6: Test the Integration

1. **Test with valid credentials:**
```bash
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "real@restaurant.com", "password": "password123"}'

# Expected: Success response with token
```

2. **Test with invalid credentials:**
```bash
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@email.com", "password": "wrong"}'

# Expected: 401 error
```

3. **Test demo mode still works:**
```bash
curl -X POST "http://localhost:8001/api/auth/demo-login"

# Expected: Success with is_demo=true
```

### Step 7: Update Frontend (if needed)

If MyGenie requires additional fields during login:

Edit `/app/frontend/src/App.js` - LoginPage component:

```javascript
// Add new fields if required
const [restaurantCode, setRestaurantCode] = useState("");

// Update login call
await login(email, password, restaurantCode);
```

## User Data Sync Strategy

When a user logs in via MyGenie:

1. **First Time Login**: Create user in local DB
2. **Subsequent Logins**: Use existing local user_id
3. **Data Updates**: Optionally sync updated info from MyGenie

```python
# In mygenie_login function

local_user = await db.users.find_one({"email": credentials.email})

if not local_user:
    # New user - create in local DB
    user_doc = {
        "id": mygenie_user["id"],
        "email": mygenie_user["email"],
        "restaurant_name": mygenie_user["restaurant_name"],
        "phone": mygenie_user.get("phone", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "mygenie_synced": True
    }
    await db.users.insert_one(user_doc)
    
    # Create default loyalty settings
    await create_loyalty_settings(user_doc["id"])
    
else:
    # Existing user - optionally update info
    await db.users.update_one(
        {"email": credentials.email},
        {"$set": {
            "restaurant_name": mygenie_user["restaurant_name"],
            "phone": mygenie_user.get("phone", ""),
            "last_login": datetime.now(timezone.utc).isoformat()
        }}
    )
```

## Error Handling

The integration includes comprehensive error handling:

| Error | Status Code | Meaning |
|-------|-------------|---------|
| Invalid credentials | 401 | User not found or wrong password in MyGenie |
| MyGenie API timeout | 504 | MyGenie API not responding |
| MyGenie API error | 503 | Connection or network error |
| MyGenie not configured | 500 | Missing MYGENIE_API_URL or key |

## Testing Checklist

Before going to production:

- [ ] MyGenie API credentials configured in .env
- [ ] Uncommented MyGenie API call section
- [ ] Removed local DB fallback code
- [ ] Tested with valid MyGenie user
- [ ] Tested with invalid credentials (401 error)
- [ ] Tested API timeout handling
- [ ] Demo mode still works independently
- [ ] User sync to local DB working
- [ ] Loyalty settings created for new users
- [ ] Frontend displays correct error messages

## Code Location Reference

### Backend Files
- **Main auth logic**: `/app/backend/routers/auth.py`
- **Environment config**: `/app/backend/.env`
- **Auth helpers**: `/app/backend/core/auth.py`
- **Database**: `/app/backend/core/database.py`

### Frontend Files
- **Login UI**: `/app/frontend/src/App.js` (LoginPage component)
- **Auth context**: `/app/frontend/src/contexts/AuthContext.jsx`
- **Environment**: `/app/frontend/.env`

## FAQ

### Q: Can test@restaurant.com still be used?
**A**: Yes! But it must be authenticated through MyGenie API. Demo Mode bypasses MyGenie and uses local DB.

### Q: What if MyGenie API is down?
**A**: Regular logins will fail (503 error). Demo Mode will still work as it uses local DB.

### Q: Do we need to store passwords locally?
**A**: No! MyGenie handles authentication. We only store user profile data locally.

### Q: Can we use both MyGenie and local auth?
**A**: 
- Production: MyGenie only (recommended)
- Demo Mode: Local DB only (for testing)
- No mixing of auth methods for regular users

### Q: What about user registration?
**A**: Current `/api/auth/register` creates users locally. You may need to:
1. Route registration to MyGenie API as well, OR
2. Keep local registration and sync to MyGenie, OR
3. Disable registration if MyGenie handles it

## Security Considerations

1. **API Keys**: Never commit MYGENIE_API_KEY to git
2. **HTTPS**: Always use HTTPS for MyGenie API calls
3. **Token Expiry**: Implement JWT refresh tokens if needed
4. **Rate Limiting**: Add rate limiting to prevent brute force
5. **Demo Mode**: Restrict demo mode in production (optional)

## Deployment Checklist

- [ ] Update .env with production MyGenie credentials
- [ ] Remove all "TODO" and "TEMPORARY" code sections
- [ ] Test end-to-end login flow
- [ ] Monitor MyGenie API performance
- [ ] Set up alerts for authentication failures
- [ ] Document MyGenie API SLA and support contact

---

## Quick Start Commands

```bash
# Add MyGenie credentials
echo "MYGENIE_API_URL=https://api.mygenie.com" >> /app/backend/.env
echo "MYGENIE_API_KEY=your_key_here" >> /app/backend/.env

# Restart backend
sudo supervisorctl restart backend

# Test regular login (will use MyGenie after uncommenting code)
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@restaurant.com", "password": "pass123"}'

# Test demo mode (always uses local DB)
curl -X POST "http://localhost:8001/api/auth/demo-login"
```

---

**Status**: Ready for MyGenie API Integration
**Priority**: HIGH - Required for production deployment
**Owner**: Backend Team
**Last Updated**: February 24, 2026
