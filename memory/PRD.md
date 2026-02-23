# DinePoints - Restaurant Loyalty & CRM Platform

## Original Problem Statement
Build and evolve a restaurant loyalty and CRM platform from the GitHub repository `https://github.com/parth-mygenie/dine-in-rewards.git`. The system should provide:
1. POS Integration with secure API for any POS to connect
2. Configurable Loyalty Rules for earning and redeeming points
3. Dynamic Customer Segmentation with saved filters
4. Segment Management UI for full CRUD operations

## Core Features

### Implemented Features (Dec 2025)
- [x] POS Integration Gateway with API key authentication
- [x] Configurable Bonus Engine (First Visit, Birthday, Anniversary, Off-Peak, Feedback)
- [x] Settings UI for loyalty rule configuration
- [x] Dynamic Customer Segmentation (save filters as auto-updating segments)
- [x] **Segments Management Page** - Full CRUD for customer segments
  - Navigation link in bottom nav bar
  - Display all segments with customer counts and filter tags
  - View customers within a segment
  - Edit/rename segments
  - Delete segments
  - Send Message placeholder (MOCKED - WhatsApp/SMS coming soon)

### Upcoming Tasks (P0)
1. **WhatsApp/SMS Notification Integration** - Integrate Twilio/WATI for automated messages

### Future Tasks (P1-P2)
2. Customer Self-Service Portal - Web portal for customers to view points/history
3. Staff Training Materials - Documentation for restaurant staff
4. Advanced Analytics & Reports
5. Referral Program
6. Multi-Location Support
7. Gamification features
8. Wallet Top-up functionality

## Technical Architecture

### Backend
- **Framework:** FastAPI
- **Database:** MongoDB with Motor (async driver)
- **Auth:** JWT tokens, API key for POS

### Frontend
- **Framework:** React.js with React Router
- **UI:** Tailwind CSS, Shadcn/UI components
- **State:** React hooks (useState, useEffect)

### Key Files
- `/app/backend/server.py` - All backend logic, API endpoints
- `/app/frontend/src/App.js` - All frontend components

### Key API Endpoints
- `POST /api/pos/webhook/payment-received` - POS transaction webhook
- `GET/POST /api/segments` - List and create segments
- `GET/PUT/DELETE /api/segments/{id}` - Manage specific segment
- `GET /api/segments/{id}/customers` - Get customers in segment
- `GET/PUT /api/settings` - Loyalty settings configuration

## Database Schema

### segments
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "filters": {
    "tier": "Gold|Silver|Bronze|Platinum",
    "city": "string",
    "customer_type": "normal|corporate",
    "last_visit_days": "number"
  },
  "customer_count": "number",
  "created_at": "ISO date",
  "updated_at": "ISO date"
}
```

## Test Credentials
- **Email:** test@restaurant.com
- **Password:** test123

## Known Limitations
- WhatsApp/SMS messaging is MOCKED (shows "Coming Soon" toast)
- Frontend is monolithic (single App.js file - needs refactoring)
- Backend is monolithic (single server.py file - needs refactoring)
