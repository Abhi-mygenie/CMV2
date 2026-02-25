# Authentication Flow - Visual Summary

## Current Implementation (February 24, 2026)

```
╔════════════════════════════════════════════════════════════════╗
║                      LOGIN PAGE                                ║
╚════════════════════════════════════════════════════════════════╝
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌─────────────────┐
        │  REGULAR      │       │  DEMO MODE      │
        │  LOGIN FORM   │       │  BUTTON         │
        └───────┬───────┘       └────────┬────────┘
                │                        │
                │                        │
        [Email + Password]        [One Click]
                │                        │
                ▼                        ▼
    ┌─────────────────────┐    ┌──────────────────┐
    │ POST /auth/login    │    │ POST /auth/      │
    │         ↓           │    │   demo-login     │
    │ /auth/mygenie-login │    └────────┬─────────┘
    └─────────┬───────────┘             │
              │                         │
              ▼                         ▼
    ┌──────────────────┐      ┌────────────────────┐
    │  MYGENIE API     │      │  LOCAL MONGODB     │
    │                  │      │                    │
    │  • Validate      │      │  • Query demo user │
    │    credentials   │      │  • Return token    │
    │  • Return user   │      │  • is_demo: true   │
    │    data          │      │                    │
    │  • Sync to       │      └────────────────────┘
    │    local DB      │
    │  • is_demo: false│
    └──────────────────┘

╔════════════════════════════════════════════════════════════════╗
║                    DATA SOURCES                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Regular Login:        MyGenie API (STRICTLY)                 ║
║  • ONLY real production users                                 ║
║  • test@restaurant.com does NOT exist in MyGenie             ║
║  • Auth happens on MyGenie servers                            ║
║  • User data synced to local DB after auth                    ║
║                                                                ║
║  Demo Mode:            Local MongoDB ONLY                      ║
║  • Demo user: test@restaurant.com                             ║
║  • No MyGenie API call                                         ║
║  • Instant access for testing                                  ║
║  • Shows purple banner: "🎭 Demo Mode"                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

## Authentication Endpoints

| Endpoint | Method | Purpose | Data Source | is_demo |
|----------|--------|---------|-------------|---------|
| `/auth/login` | POST | Regular login (routes to mygenie-login) | MyGenie API | false |
| `/auth/mygenie-login` | POST | Production auth (explicit) | MyGenie API | false |
| `/auth/demo-login` | POST | Demo mode access | Local MongoDB | true |
| `/auth/register` | POST | New user signup | Local MongoDB* | false |

*Note: Registration may need to route to MyGenie API as well

## User Journey Examples

### Example 1: Production User Login
```
1. User visits login page
2. Enters email: owner@myrestaurant.com
3. Enters password: ********
4. Clicks "Sign In"
5. Frontend → POST /api/auth/login
6. Backend → POST https://api.mygenie.com/auth/login
7. MyGenie validates credentials
8. MyGenie returns user data
9. Backend syncs user to local DB
10. Backend creates JWT token
11. User logged in ✅
12. No demo banner shown
```

### Example 2: Trying to Login with test@restaurant.com via Regular Login
```
1. User visits login page
2. Enters email: test@restaurant.com
3. Enters password: Test123456
4. Clicks "Sign In"
5. Frontend → POST /api/auth/login
6. Backend → POST https://api.mygenie.com/auth/login
7. ❌ MyGenie returns 401 - User not found
8. Error: "Invalid credentials"
   
Note: test@restaurant.com does NOT exist in MyGenie!
Use Demo Mode button instead.
```

### Example 3: Demo Mode (Quick Testing)
```
1. User visits login page
2. Clicks "🎭 Try Demo Mode" button
3. Frontend → POST /api/auth/demo-login
4. Backend → Query local MongoDB
5. Returns test@restaurant.com data
6. User logged in instantly ✅
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
| **Data Source** | MyGenie → Local sync | Local only |
| **Speed** | ~1-2 seconds | Instant |

## Integration Status

### ✅ Completed
- Demo Mode fully functional
- Regular login endpoint structure ready
- MyGenie API call code prepared (commented)
- User sync logic implemented
- Error handling comprehensive
- Frontend UI with both options
- Demo banner working

### 🔄 Pending (MyGenie Team)
- MyGenie API credentials (URL, Key)
- API endpoint documentation
- Request/response format confirmation
- Test credentials for development

### 📝 To Do After MyGenie Integration
1. Uncomment MyGenie API code in `/app/backend/routers/auth.py`
2. Add MYGENIE_API_URL and MYGENIE_API_KEY to `.env`
3. Adjust code based on actual MyGenie response format
4. Remove local DB fallback code
5. Test with real MyGenie users
6. Deploy to production

## Files Modified

```
/app/
├── backend/
│   ├── routers/
│   │   └── auth.py              ✏️ Updated with MyGenie structure
│   ├── models/
│   │   └── schemas.py           ✏️ Added is_demo field
│   └── .env                     📝 Need MYGENIE credentials
├── frontend/
│   ├── src/
│   │   ├── App.js               ✏️ Added demo button & banner
│   │   └── contexts/
│   │       └── AuthContext.jsx  ✏️ Added demo mode state
└── Documentation/
    ├── MYGENIE_INTEGRATION_GUIDE.md  ✅ Complete integration guide
    ├── DEMO_MODE_IMPLEMENTATION.md   ✅ Demo mode documentation
    └── ARCHITECTURE_FLOW.md          ✅ This file
```

## Next Steps

1. **Contact MyGenie Team**: Get API credentials
2. **Review Integration Guide**: `/app/MYGENIE_INTEGRATION_GUIDE.md`
3. **Update Environment**: Add MyGenie credentials to `.env`
4. **Activate MyGenie Code**: Uncomment the prepared code
5. **Test Thoroughly**: Both demo and regular login
6. **Deploy**: Ship to production

---

**For detailed integration steps, see**: `/app/MYGENIE_INTEGRATION_GUIDE.md`
