# User Authentication Clarification

## User Types and Data Sources

### Key Understanding

```
test@restaurant.com
  - Does NOT exist in MyGenie API
  - Exists ONLY in Local MongoDB
  - For Demo Mode ONLY

Real Production Users (e.g., owner@restaurant.com)
  - Exist in MyGenie API
  - Synced to Local MongoDB after login
  - Must authenticate via MyGenie
```

## Authentication Matrix

| User Email | MyGenie API | Local DB | Regular Login | Demo Mode |
|------------|-------------|----------|---------------|-----------|
| test@restaurant.com | No | Yes | Will fail | Works |
| owner@restaurant.com | Yes | After login | Works | Not accessible |

## Common Scenarios

### Will NOT Work:
```
User enters: test@restaurant.com / Test123456
Clicks: "Sign In" button
Result: 401 Error - test@restaurant.com doesn't exist in MyGenie!
```

### WILL Work:
```
User clicks: "Try Demo Mode" button
Result: Instant login with test@restaurant.com data
Data source: Local MongoDB
```

## Technical Implementation

### File Locations (Post-Refactor)
- **Login Page**: `/app/frontend/src/pages/LoginPage.jsx`
- **Auth Context**: `/app/frontend/src/contexts/AuthContext.jsx`
- **Demo Banner**: `/app/frontend/src/components/shared/DemoModeBanner.jsx`
- **Auth Router**: `/app/backend/routers/auth.py`

### Demo Mode Button Click:
```
Frontend: demoLogin() -> POST /api/auth/demo-login
Backend: Query local MongoDB for test@restaurant.com
Returns: JWT token with is_demo=true
```

### Regular Login Form Submit:
```
Frontend: login(email, password) -> POST /api/auth/login
Backend: Forward to /api/auth/mygenie-login -> MyGenie API
Returns: JWT token with is_demo=false
```

## FAQ

**Q: Can test@restaurant.com be used in production?**
A: No. It only exists locally for demos. Production users must be in MyGenie.

**Q: What if MyGenie is down?**
A: Regular logins will fail (503 error). Demo Mode still works (uses local DB).

**Q: Can I disable Demo Mode in production?**
A: Yes. Add environment check in the demo-login endpoint.

## Summary

| Method | Users | Data Source | Purpose |
|--------|-------|-------------|---------|
| **Regular Login** | Real MyGenie users | MyGenie API | Production |
| **Demo Mode** | test@restaurant.com only | Local MongoDB | Testing |

---

**Last Updated**: March 3, 2026
