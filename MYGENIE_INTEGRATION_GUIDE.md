# MyGenie API Integration Guide

## Overview
DinePoints uses a dual authentication system:
- **Demo Mode**: Instant access using local database (for testing/demos)
- **Production Mode**: Regular logins authenticate through MyGenie API

## Current Architecture

```
LOGIN PAGE
  [Email] [Password] [Sign In Button]
     -> STRICTLY MyGenie API (for ALL users)

  ------------- or -------------

  [Try Demo Mode Button]
     -> Local DB Only (test@restaurant.com)
```

## Authentication Flows

### 1. Regular Login (MyGenie API) - PRIMARY
**For**: Real production users only
**Endpoint**: `POST /api/auth/login` -> `POST /api/auth/mygenie-login`

### 2. Demo Mode (Local DB) - TESTING ONLY
**For**: Quick demos without MyGenie dependency
**Endpoint**: `POST /api/auth/demo-login`

## Integration Steps

### Step 1: Get MyGenie API Credentials
Contact MyGenie team to obtain:
- API Base URL (e.g., `https://api.mygenie.com`)
- API Key or Secret
- Authentication endpoint details

### Step 2: Add Environment Variables
Update `/app/backend/.env`:
```bash
MYGENIE_API_URL=https://api.mygenie.com
MYGENIE_API_KEY=your_api_key_here
```

### Step 3: Update Backend Code
Edit `/app/backend/routers/auth.py`:
1. Uncomment the MyGenie API section
2. Remove the temporary local DB fallback
3. Adjust based on actual MyGenie API format

### Step 4: Expected API Format

**Request:**
```bash
POST https://api.mygenie.com/auth/login
Content-Type: application/json
X-API-Key: your_api_key_here

{"email": "user@restaurant.com", "password": "userpassword"}
```

**Success Response (200):**
```json
{
  "id": "user-unique-id",
  "email": "user@restaurant.com",
  "restaurant_name": "User's Restaurant",
  "phone": "9876543210"
}
```

### Step 5: Test
```bash
# Test regular login (uses MyGenie after uncommenting)
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "real@restaurant.com", "password": "password123"}'

# Test demo mode (always uses local DB)
curl -X POST "http://localhost:8001/api/auth/demo-login"
```

## File References

### Backend
- **Auth logic**: `/app/backend/routers/auth.py`
- **Environment**: `/app/backend/.env`
- **Auth helpers**: `/app/backend/core/auth.py`
- **Database**: `/app/backend/core/database.py`

### Frontend
- **Login UI**: `/app/frontend/src/pages/LoginPage.jsx`
- **Auth context**: `/app/frontend/src/contexts/AuthContext.jsx`

## Error Handling

| Error | Status Code | Meaning |
|-------|-------------|---------|
| Invalid credentials | 401 | Wrong email/password in MyGenie |
| MyGenie API timeout | 504 | MyGenie API not responding |
| MyGenie API error | 503 | Connection/network error |
| MyGenie not configured | 500 | Missing MYGENIE_API_URL |

## Deployment Checklist

- [ ] MyGenie API credentials configured in .env
- [ ] Uncommented MyGenie API call section
- [ ] Removed local DB fallback code
- [ ] Tested with valid MyGenie user
- [ ] Tested with invalid credentials (401 error)
- [ ] Demo mode still works independently
- [ ] User sync to local DB working
- [ ] Loyalty settings created for new users

## Security Notes
1. Never commit MYGENIE_API_KEY to git
2. Always use HTTPS for MyGenie API calls
3. Implement JWT refresh tokens if needed
4. Add rate limiting for brute force prevention

---

**Status**: Ready for MyGenie API Integration
**Priority**: HIGH - Required for production deployment
**Last Updated**: March 3, 2026
