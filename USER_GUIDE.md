# MyGenie CRM - Screen-by-Screen User Guide

## Overview
MyGenie CRM is a Restaurant CRM and Loyalty platform for managing customers, loyalty programs, coupons, WhatsApp automation, and feedback. This guide walks you through every screen in the application.

---

## 1. Login Page
**Screenshot**: `01_login.jpeg`

The login page is your entry point to MyGenie CRM. You have two options: sign in with your MyGenie credentials (email + password) for production use, or click "Try Demo Mode" for instant access with pre-loaded test data. Demo mode is perfect for exploring all features without needing real credentials. A purple banner appears on all pages when in demo mode. New restaurants can register via the "Register" link at the bottom.

---

## 2. Dashboard
**Screenshot**: `02_dashboard.jpeg`

The home dashboard gives you a quick snapshot of your restaurant's loyalty program performance. It shows total customers, active loyalty members, today's new signups, and points distributed. Below the stats, you'll see your most recent customer signups with their tier badges (Bronze, Silver, Gold, Platinum). Quick action buttons let you jump to add new customers or generate QR codes for in-store registration.

---

## 3. Customers List
**Screenshot**: `03_customers_list.jpeg`

The customer directory shows all your registered customers in a scrollable list. Each card displays the customer name, phone number, tier badge, and total points. Use the search bar at the top to find customers by name or phone. Quick-filter chips (All, Gold, Silver, etc.) let you filter by tier instantly. The "+" button opens the add customer form, and the filter icon opens the advanced filter drawer.

---

## 4. Customer Detail - Profile & Stats
**Screenshot**: `04_customer_detail.jpeg`

Tapping a customer opens their detailed profile. The top section shows their name, phone, email, tier badge, and current loyalty points balance alongside wallet balance. Action buttons allow you to give bonus points or add wallet money. Below that, key stats show total visits, lifetime spend, and last visit date. This is the central hub for understanding each customer's relationship with your restaurant.

---

## 5. Customer Detail - AI Insights
**Screenshot**: `05_customer_ai_insights.jpeg`

Below the customer stats, the AI Insights card automatically analyzes order history to surface actionable intelligence. It shows the customer's top ordered items with frequency counts, their preferred cuisine categories with percentages, visit frequency pattern (e.g., "every ~12 days"), preferred day of the week, usual dining time slot, and common food customization requests (e.g., "less spicy", "extra gravy"). These insights help staff personalize service without asking the customer.

---

## 6. Customer Filters
**Screenshot**: `06_customer_filters.jpeg`

The advanced filter drawer lets you segment customers using 11 different parameters. Filter by tier (Bronze/Silver/Gold/Platinum), VIP status, date of birth range, registration date, lead source (Walk-in, Swiggy, Zomato, etc.), visit count, spending thresholds, diet preference, and more. Combine multiple filters to find specific customer segments - for example, "Gold tier VIP customers who prefer vegetarian food and visited in the last 30 days." Apply filters to instantly see matching results.

---

## 7. Add Customer
**Screenshot**: `07_add_customer.jpeg`

The add customer dialog collects essential information for new customer registration. Required fields are name and phone number with country code selector. Optional fields include email, gender, date of birth, and anniversary. The form supports both individual and corporate customer types, with additional fields for GST details when corporate is selected. Customers can also self-register via the QR code (see Screen 14).

---

## 8. Templates Page
**Screenshot**: `08_templates.jpeg`

The templates page manages your WhatsApp message templates for automated customer communication. Each template has a name, category, language, and message body with variable placeholders (like {customer_name}, {points_balance}). Templates are the building blocks for WhatsApp automation - you create the message template here, then map it to events (like birthday, post-visit) in the WhatsApp Automation settings.

---

## 9. Feedback Page
**Screenshot**: `09_feedback.jpeg`

The feedback page shows all customer feedback collected through your restaurant. Each entry displays the customer name, phone number, star rating (1-5), and written comments. Use the "+" button to manually add feedback when customers share their experience via phone or in person. The feedback data feeds into the customer profile and can be used for service quality tracking and sentiment analysis in future AI features.

---

## 10. Settings - Profile Tab
**Screenshot**: `10_settings_profile.jpeg`

The Profile tab in Settings shows your restaurant's business information including name, email, phone, and address. It also displays your WhatsApp API Key configuration - this is the AuthKey.io API key needed to enable WhatsApp automation features. The key is masked for security and can be updated anytime. A logout button at the bottom lets you sign out of the application.

---

## 11. Settings - Coupons Tab
**Screenshot**: `11_settings_coupons.jpeg`

The Coupons tab provides full coupon management directly within Settings. View all your active and inactive coupons with their codes, discount values (percentage or flat), and validity dates. The "New" button creates a new coupon with fields for code, type (percentage/flat), value, start/end dates, minimum order amount, and maximum uses. Toggle coupons on/off, edit details, or delete them. Coupons are automatically validated when applied via the POS order webhook.

---

## 12. Settings - WhatsApp Tab
**Screenshot**: `12_settings_whatsapp.jpeg`

The WhatsApp tab shows your automation configuration inline. When the API key is configured, this tab displays all automation events (like Birthday Greeting, Post-Visit Thank You, Points Expiry Alert) with their mapped templates and enabled/disabled status. Each event can be configured with a specific message template, trigger conditions, and variable mappings. If no API key is set, a prompt directs you to configure it in the Profile tab.

---

## 13. Settings - Loyalty Tab
**Screenshot**: `13_settings_loyalty.jpeg`

The Loyalty tab lets you configure your entire loyalty program rules. Set points earning rates per tier (e.g., Gold earns 5 points per 100 spent), redemption rates (e.g., 100 points = 25 rupees), and tier thresholds (e.g., 1500 points to reach Gold). Enable bonus features like first-visit bonus points, birthday multipliers, and off-peak earning multipliers. Configure points expiry rules and auto-tier-upgrade/downgrade settings. Changes take effect immediately for all future transactions.

---

## 14. QR Code Page
**Screenshot**: `14_qr_code.jpeg`

The QR Code page generates a unique, scannable QR code for your restaurant. When customers scan this code with their phone, it opens a self-registration form where they can enter their name, phone number, and basic details. This eliminates manual data entry by staff and speeds up the loyalty signup process. The QR code can be printed and displayed at your billing counter, table tents, or entrance. Copy the registration link or download the QR image directly.

---

## 15. WhatsApp Automation (Standalone)
**Screenshot**: `15_whatsapp_standalone.jpeg`

This is the full-page version of WhatsApp Automation, accessible via the direct route. It shows the same content as the WhatsApp tab in Settings but with a dedicated header and back navigation. This page is useful when you want to focus entirely on configuring automation rules without the Settings tab context. All changes made here are reflected in the Settings WhatsApp tab and vice versa.

---

## Navigation
The bottom navigation bar is present on every page with 5 sections:
- **Home** - Dashboard with stats overview
- **Customers** - Customer directory and management
- **Templates** - WhatsApp message templates
- **Feedback** - Customer feedback collection
- **Settings** - Profile, Coupons, WhatsApp, Loyalty (4 tabs)

---

## Demo Mode
When using Demo Mode (accessed via the login page button), a purple banner appears at the top of every screen indicating you're exploring with test data. All features work identically to production mode - you can create customers, add feedback, modify settings, and test the full workflow without affecting real data.

---

*Document generated: March 3, 2026*
*Screenshots folder: `/app/screenshots/`*
*Screenshots ZIP: `/app/screenshots.zip`*
