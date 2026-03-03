# DinePoints (MyGenie CRM) - Restaurant CRM & Loyalty System

## Original Problem Statement
Build a Restaurant CRM and Loyalty System with customer management, loyalty points, WhatsApp automation, coupon management, feedback collection, and native mobile app support.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Shadcn/UI (modular components)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT-based with Demo Mode
- **Native Apps**: Capacitor 6 (iOS + Android from same codebase)

## File Structure
```
frontend/src/
  App.js                          # Routing only (59 lines)
  pages/                          # 12 page components
  components/
    MobileLayout.jsx              # App shell + bottom nav
    ProtectedRoute.jsx            # Auth guard
    shared/
      WhatsAppAutomationContent.jsx
      ComingSoonOverlay.jsx
      DemoModeBanner.jsx
  contexts/AuthContext.jsx
  lib/constants.js

frontend/android/                 # Capacitor Android project
frontend/ios/                     # Capacitor iOS project
frontend/resources/               # Source icon + splash images
frontend/capacitor.config.ts      # Capacitor config (plugins, splash, status bar)
```

## Core Features (All Implemented)
- Customer CRUD with 55+ fields, advanced filtering (11 params)
- Loyalty program: Tier-based (Bronze/Silver/Gold/Platinum), configurable rules
- Coupon management (CRUD)
- WhatsApp automation with event-based templates
- Feedback collection with star ratings
- QR code customer registration
- Settings: Unified 4-tab interface (Profile/Coupons/WhatsApp/Loyalty)
- Demo Mode with pre-loaded data

## Order System
- **Order webhook**: Supports `order_notes` (order-level) + `items[]` with `item_notes` (food-level) + `item_category`
- **Dual storage**: Items embedded in order doc + separate `order_items` collection (AI-ready)
- **Indexes**: `customer_id`, `item_name`, `order_id` on `order_items`
- **avg_order_value**: Recalculated on every order in both webhook paths

## Native App (Capacitor 6)
- Bundle ID: `com.crmmygenie.app`
- App Name: MyGenie CRM
- Plugins: Push Notifications, Camera, Splash Screen, Status Bar
- Icons: Generated for all Android densities + iOS sizes
- Splash: Orange (#F26B33) themed, all screen sizes
- Build: `yarn build && npx cap sync` then open in Android Studio / Xcode

## Customer Fields Architecture
- **POS-sourced**: name, phone, email, address, allergies, etc.
- **CRM-managed**: preferences, consent flags, VIP status, etc.
- **System-calculated**: total_visits, total_spent, avg_order_value, tier, last_visit
- **AI-derived (future)**: favorites, favorite_category (from order_items data)
- **Notes**: order_notes (order-level from POS), item_notes (food-level from POS)

## Key DB Collections
- `customers`, `orders` (embedded items[]), `order_items` (flat, indexed), 
- `points_transactions`, `wallet_transactions`, `coupons`, `loyalty_settings`, `users`

## Completed Work Timeline
- **Feb 2026**: Initial setup, Customer CRUD, Advanced filtering
- **Feb 2026**: Settings page 4-tab refactor
- **Mar 2026**: WhatsApp tab inline embedding
- **Mar 2026**: Full codebase refactor (App.js 8400+ → 59 lines)
- **Mar 2026**: Order items + notes schema (dual storage, AI-ready)
- **Mar 2026**: avg_order_value live recalculation fix
- **Mar 2026**: item_category added to OrderItem schema
- **Mar 2026**: Capacitor native app setup (Android + iOS + plugins + icons)
- **Mar 2026**: P0 AI Insights on Customer Detail page (top items, preferred cuisine, visit pattern, common requests)
- **Mar 2026**: Complete 25-screen video reel (1080x1920, 2min, crossfade transitions)
- **Mar 2026**: Demo data script updated with orders, order_items, categories, notes (AI Insights ready)

## Prioritized Backlog
- P1: Build Data Migration Script (bulk import from legacy POS)
- P1: AI Insights Phase 2 - Churn risk, next visit prediction, birthday alerts (rules-based)
- P2: AI Insights Phase 3 - Upsell recommendations, sentiment analysis (LLM-powered)
- P2: Activate native features (push notifications, offline data)
- P2: Connect WhatsApp integration to live API
- P3: Display order items + notes in Customer Detail UI
- P3: App Store / Play Store signing & submission
