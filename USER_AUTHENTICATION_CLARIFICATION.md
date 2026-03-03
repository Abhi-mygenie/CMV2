# User Authentication Clarification

## User Types and Data Sources

### Key Understanding

```
demo@restaurant.com
  - Does NOT exist in MyGenie API
  - Exists ONLY in Local MongoDB
  - For Demo Mode ONLY

owner@18march.com (and other real users)
  - Exist in MyGenie API
  - Synced to Local MongoDB after login
  - Must authenticate via MyGenie
```

## Authentication Matrix

| User Email | MyGenie API | Local DB | Regular Login | Demo Mode |
|------------|-------------|----------|---------------|-----------|
| demo@restaurant.com | No | Yes | Will fail | Works |
| owner@18march.com | Yes | After login | Works | Not accessible |

## Common Scenarios

### Will NOT Work:
```
User enters: demo@restaurant.com / demo123
Clicks: "Sign In" button
Result: 401 Error - demo@restaurant.com doesn't exist in MyGenie!
```

### WILL Work:
```
User clicks: "Try Demo Mode" button
Result: Instant login with demo@restaurant.com data
Data source: Local MongoDB (seeded via seed_demo_data.py)
```

### Also Works:
```
User enters: owner@18march.com / Qplazm@10
Clicks: "Sign In" button
Result: Authenticated via MyGenie API, synced to local DB
```

## Technical Implementation

### File Locations
- **Login Page**: `/app/frontend/src/pages/LoginPage.jsx`
- **Auth Context**: `/app/frontend/src/contexts/AuthContext.jsx`
- **Demo Banner**: `/app/frontend/src/components/shared/DemoModeBanner.jsx`
- **Auth Router**: `/app/backend/routers/auth.py`
- **Demo Seeder**: `/app/backend/seed_demo_data.py`

### Demo Mode Button Click:
```
Frontend: demoLogin() -> POST /api/auth/demo-login
Backend: Query local MongoDB for demo@restaurant.com
Returns: JWT token with is_demo=true
```

### Regular Login Form Submit:
```
Frontend: login(email, password) -> POST /api/auth/login
Backend: Forward to /api/auth/mygenie-login -> MyGenie API
Returns: JWT token with is_demo=false
```

## FAQ

**Q: Can demo@restaurant.com be used in production?**
A: No. It only exists locally for demos. Production users must be in MyGenie.

**Q: What if MyGenie is down?**
A: Regular logins will fail (503 error). Demo Mode still works (uses local DB).

**Q: Can I disable Demo Mode in production?**
A: Yes. Add environment check in the demo-login endpoint.

**Q: What data is available in Demo Mode?**
A: 55 customers, 305 orders, 1,080 order items, loyalty transactions, coupons, segments, feedback, templates, and automation rules. AI Insights are fully populated.

## Summary

| Method | Users | Data Source | Purpose |
|--------|-------|-------------|---------|
| **Regular Login** | Real MyGenie users | MyGenie API | Production |
| **Demo Mode** | demo@restaurant.com only | Local MongoDB | Testing |

---

**Last Updated**: March 3, 2026
