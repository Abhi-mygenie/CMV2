# Demo Mode - Complete Guide

## 🎉 What is Demo Mode?

Demo Mode is a fully functional offline demonstration mode that allows users to explore all features of the DinePoints (MyGenie) application without needing:
- Backend API
- Database connection
- Login credentials
- Any setup or configuration

## ✨ Features

### Comprehensive Mock Data
- **55+ Realistic Customers** with variety:
  - Different tiers: Bronze, Silver, Gold, Platinum
  - Customer types: Normal and Corporate
  - Multiple cities: Mumbai, Delhi, Bangalore, Pune, etc.
  - Various spending levels and visit histories
  - Some with wallet balances
  - Birthday and anniversary data
  - Allergies and custom fields

- **Points Transactions** (100+ entries):
  - Earned points from purchases
  - Redeemed points
  - Bonus points (birthday, anniversary, first visit)
  - Historical transaction data

- **Wallet Transactions** (50+ entries):
  - Credits (top-ups, refunds, bonuses)
  - Debits (bill payments)
  - Bonus amounts on top-ups

- **Coupons** (5 active & expired):
  - Percentage and fixed discounts
  - Channel-specific (dine-in, delivery, takeaway)
  - Usage limits and tracking
  - Tier restrictions

- **Customer Segments** (4 pre-defined):
  - VIP Gold Members
  - Inactive customers (30+ days)
  - Corporate clients
  - Mumbai Premium

- **Feedback** (20+ entries):
  - Customer ratings (1-5 stars)
  - Comments and reviews
  - Historical data

- **WhatsApp Templates** (5 templates):
  - Welcome messages
  - Points earned notifications
  - Birthday wishes
  - Wallet credit alerts
  - Tier upgrade congratulations

- **Automation Rules** (4 rules):
  - Event-based messaging
  - Configurable delays
  - Enable/disable toggles

- **Loyalty Settings**:
  - Points earning rates
  - Tier thresholds
  - Bonus configurations
  - Off-peak hours settings

- **Analytics Dashboard**:
  - Total customers
  - Active customers
  - Points issued/redeemed
  - Average ratings

## 🚀 How to Use

### Activating Demo Mode

1. Navigate to the login page
2. Click the **"Try Demo Mode"** button (purple gradient button)
3. You'll be instantly logged in with full access to all features

### Demo Mode Interface

When in demo mode, you'll see:
- **Purple-pink banner** at the top indicating "Demo Mode - Explore freely!"
- **Exit button** (X icon) in the banner to return to login
- All features work exactly like the real application

### What You Can Do

#### ✅ Full CRUD Operations (In-Memory)
- **Add** new customers, coupons, segments, etc.
- **Edit** existing data
- **Delete** items
- **Search and Filter** through data
- **Sort** by various criteria

#### ✅ All Features Work
- View dashboard with real-time stats
- Browse customer list with filters
- View customer details
- Add/edit customer information
- Record points transactions
- Manage wallet transactions
- Create and manage coupons
- Create customer segments
- View and filter feedback
- Create WhatsApp templates
- Configure automation rules
- Adjust loyalty settings
- Generate QR codes
- View analytics

#### ✅ Persistent Session
- All changes remain during the demo session
- Data resets when you exit and re-enter demo mode

### Exiting Demo Mode

Click the **X icon** in the purple banner or click "Logout" from settings to return to the login page.

## 🛠️ Technical Implementation

### Architecture

```
DemoProvider (Context)
    ↓
AuthProvider (Enhanced for demo mode)
    ↓
All App Components
```

### Files Created/Modified

**New Files:**
1. `/app/frontend/src/data/mockData.js` - Comprehensive mock data generation
2. `/app/frontend/src/contexts/DemoContext.jsx` - Demo mode state management
3. `/app/frontend/src/services/mockApi.js` - Mock API service

**Modified Files:**
1. `/app/frontend/src/contexts/AuthContext.jsx` - Added demo mode support
2. `/app/frontend/src/App.js` - Integrated demo mode UI and providers

### How It Works

1. **DemoContext**: Manages demo mode state and provides CRUD operations
2. **MockApiService**: Intercepts all API calls and returns mock data
3. **AuthContext**: Switches between real and mock API based on demo mode
4. **In-Memory Operations**: All CRUD operations update state without backend

### Mock API Endpoints Supported

All endpoints that the real backend supports:
- `/api/auth/*` - Authentication
- `/api/customers/*` - Customer management
- `/api/segments/*` - Segments
- `/api/points/*` - Points transactions
- `/api/wallet/*` - Wallet transactions
- `/api/coupons/*` - Coupons
- `/api/feedback/*` - Feedback
- `/api/whatsapp/templates` - WhatsApp templates
- `/api/whatsapp/automation` - Automation rules
- `/api/loyalty/settings` - Loyalty settings
- `/api/analytics/dashboard` - Analytics
- `/api/qr/generate` - QR code generation

## 🎯 Use Cases

### For Sales/Marketing
- Demo the product to potential customers
- Showcase features without setup
- No need for test accounts or data

### For Development
- Test UI without backend
- Develop frontend features independently
- Quick testing of new features

### For Training
- Train staff on the application
- Practice without affecting real data
- Learn all features risk-free

## ⚠️ Limitations

1. **Session-Based**: Data resets when exiting demo mode
2. **No Persistence**: Changes don't save to database
3. **No Real WhatsApp**: WhatsApp messages are simulated
4. **Fixed Data Set**: Starts with same data each time
5. **No Multi-User**: Single user demo experience

## 🔄 Resetting Demo Data

Demo data automatically resets when you:
- Exit demo mode
- Refresh the page (after re-entering demo mode)
- Re-activate demo mode

## 📱 All Features Available in Demo Mode

### ✅ Dashboard
- View statistics
- Recent customers
- Quick actions

### ✅ Customers
- List all customers (55+)
- Search by name/phone
- Filter by tier, type, last visit, city
- Sort by various criteria
- View customer details
- Add new customers
- Edit customer information
- Delete customers
- View customer segments

### ✅ Customer Details
- View full profile
- Points history
- Wallet transactions
- Add points (earn/redeem/bonus)
- Add wallet transactions
- Edit customer info
- Delete customer

### ✅ Segments
- View saved segments
- Create new segments
- WhatsApp campaigns UI
- Delete segments

### ✅ Feedback
- View all feedback
- Filter feedback
- Customer ratings
- Comments

### ✅ Coupons
- View all coupons
- Create new coupons
- Edit coupons
- Delete coupons
- Toggle active/inactive

### ✅ QR Code
- Generate registration QR
- Download QR code

### ✅ Settings
- Loyalty program settings
- Tier thresholds
- Points configuration
- Off-peak hours
- WhatsApp automation link
- Profile settings
- Logout

### ✅ WhatsApp Automation
- Create templates
- Edit templates
- Delete templates
- Create automation rules
- Configure events
- Enable/disable rules
- Delete rules
- Live preview

## 🎨 UI Highlights

- **Demo Mode Banner**: Clear visual indicator with purple-pink gradient
- **Sparkles Icon**: Fun, inviting demo mode button
- **Seamless Experience**: Identical to real mode
- **Exit Anytime**: One-click exit from demo mode
- **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

Simply visit the app and click **"Try Demo Mode"** to start exploring!

No signup, no setup, no hassle. Just instant access to a fully-featured restaurant loyalty platform.

---

**Built with ❤️ for DinePoints (MyGenie)**
