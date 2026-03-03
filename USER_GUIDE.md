# MyGenie CRM - Complete Screen-by-Screen User Guide

## Overview
MyGenie CRM is a Restaurant CRM and Loyalty platform for managing customers, loyalty programs, coupons, WhatsApp automation, feedback, and AI-driven customer insights. This guide walks you through all 25 screens in the application.

---

## 1. Login Screen
**Screenshot**: `01_login.jpeg`

The login page is your entry point to MyGenie CRM. You have two options: sign in with your MyGenie credentials (email + password) for production use, or click "Try Demo Mode" for instant access with pre-loaded test data. Demo mode is perfect for exploring all features without needing real credentials. A purple banner appears on all pages when in demo mode. New restaurants can register via the "Register" link at the bottom.

---

## 2. Dashboard Overview
**Screenshot**: `02_dashboard.jpeg`

The home dashboard gives you a quick snapshot of your restaurant's loyalty program performance. It shows total customers, active loyalty members, today's new signups, and points distributed. Below the stats, you'll see your most recent customer signups with their tier badges (Bronze, Silver, Gold, Platinum). Quick action buttons let you jump to add new customers or generate QR codes for in-store registration.

---

## 3. Customers List
**Screenshot**: `03_customers_list.jpeg`

The customer directory shows all your registered customers in a scrollable list. Each card displays the customer name, phone number, tier badge, and total points. Use the search bar at the top to find customers by name or phone. Quick-filter chips (All, Gold, Silver, etc.) let you filter by tier instantly. The "+" button opens the add customer form, and the filter icon opens the advanced filter drawer.

---

## 4. Customer Filters
**Screenshot**: `04_customer_filters.jpeg`

The advanced filter drawer lets you segment customers using 11 different parameters. Filter by tier (Bronze/Silver/Gold/Platinum), VIP status, date of birth range, registration date, lead source (Walk-in, Swiggy, Zomato, etc.), visit count, spending thresholds, diet preference, and more. Combine multiple filters to find specific customer segments - for example, "Gold tier VIP customers who prefer vegetarian food and visited in the last 30 days."

---

## 5. Add Customer
**Screenshot**: `05_add_customer.jpeg`

The add customer dialog collects essential information for new customer registration. Required fields are name and phone number with country code selector. Optional fields include email, gender, date of birth, and anniversary. The form supports both individual and corporate customer types, with additional fields for GST details when corporate is selected.

---

## 6. Customer Detail
**Screenshot**: `06_customer_detail_top.jpeg`

Tapping a customer opens their detailed profile. The top section shows their name, phone, email, tier badge, and current loyalty points balance alongside wallet balance. Action buttons allow you to give bonus points or add wallet money. Below that, key stats show total visits, lifetime spend, average order value, and last visit date.

---

## 7. AI Insights
**Screenshot**: `07_customer_ai_insights.jpeg`

Below the customer stats, the AI Insights card automatically analyzes order history to surface actionable intelligence. It shows the customer's top ordered items with frequency counts, their preferred cuisine categories with percentages (e.g., "North Indian 55%, Beverages 28%"), visit frequency pattern (e.g., "every ~12 days"), preferred day of the week, usual dining time slot, spending trend direction, and common food customization requests (e.g., "less spicy", "extra gravy"). These insights help staff personalize service without asking the customer.

---

## 8. Order History
**Screenshot**: `08_customer_history.jpeg`

The order history tab within the customer detail page shows a chronological list of all transactions. Each entry displays the order date, amount, points earned or redeemed, and payment method. This provides a complete picture of the customer's engagement with your restaurant over time.

---

## 9. Edit Customer
**Screenshot**: `09_edit_customer.jpeg`

The edit customer form lets you update any customer field. Modify personal details (name, email, phone), preferences, dietary information, allergies, VIP status, and custom fields. Changes are saved immediately and reflected across all views. Corporate customers have additional fields for GST details.

---

## 10. Give Bonus Points
**Screenshot**: `10_give_bonus_points.jpeg`

The bonus points dialog allows you to award extra loyalty points to a customer outside of regular order-based earning. Enter the number of points and a reason (e.g., "Birthday bonus", "Complaint resolution", "Special event"). This is useful for customer service recovery, promotional campaigns, or rewarding loyal customers.

---

## 11. Add Wallet Money
**Screenshot**: `11_add_wallet_money.jpeg`

The wallet top-up dialog lets you add money to a customer's prepaid wallet. Enter the amount and optionally set a bonus percentage for the top-up. For example, "Add Rs. 1000 with 10% bonus" credits Rs. 1100 to their wallet. Wallet balance can be used for future orders through the POS system.

---

## 12. Templates List
**Screenshot**: `12_templates_list.jpeg`

The templates page manages your WhatsApp message templates for automated customer communication. Each template has a name, category, language, and message body with variable placeholders (like {customer_name}, {points_balance}). Templates are the building blocks for WhatsApp automation - create the message here, then map it to events in WhatsApp Automation settings.

---

## 13. Create Template
**Screenshot**: `13_create_template.jpeg`

The create template form lets you build a new WhatsApp message template. Enter a name, select the category and language, then compose the message body using variable placeholders. Preview the rendered message with sample data before saving. Templates must be approved by WhatsApp before they can be used in automation.

---

## 14. Feedback List
**Screenshot**: `14_feedback_list.jpeg`

The feedback page shows all customer feedback collected through your restaurant. Each entry displays the customer name, phone number, star rating (1-5), and written comments. This data feeds into the customer profile and provides service quality tracking.

---

## 15. Add Feedback
**Screenshot**: `15_add_feedback.jpeg`

The add feedback dialog lets you manually record customer feedback. Search for the customer by phone number, select a star rating (1-5), and enter their comments. Use this when customers share feedback via phone, in person, or through other channels outside the automated collection flow.

---

## 16. Settings - Profile
**Screenshot**: `16_settings_profile.jpeg`

The Profile tab in Settings shows your restaurant's business information including name, email, phone, and address. It also displays your WhatsApp API Key configuration - this is the AuthKey.io API key needed to enable WhatsApp automation features. The key is masked for security. A logout button at the bottom lets you sign out.

---

## 17. Settings - Coupons
**Screenshot**: `17_settings_coupons.jpeg`

The Coupons tab provides full coupon management within Settings. View all active and inactive coupons with their codes, discount values (percentage or flat), and validity dates. Toggle coupons on/off, edit details, or delete them. Coupons are validated automatically when applied via the POS order webhook.

---

## 18. Add Coupon
**Screenshot**: `18_add_coupon.jpeg`

The add coupon form lets you create a new coupon with: code, discount type (percentage or flat), value, start/end dates, minimum order amount, maximum discount cap, and usage limit. Optional tier restrictions let you create tier-exclusive coupons (e.g., "Gold members only"). Coupons activate immediately upon creation.

---

## 19. Settings - WhatsApp
**Screenshot**: `19_settings_whatsapp.jpeg`

The WhatsApp tab shows your automation configuration inline. When the API key is configured, it displays all automation events (Birthday Greeting, Post-Visit Thank You, Points Expiry Alert, etc.) with their mapped templates and enabled/disabled status. If no API key is set, a prompt directs you to configure it in the Profile tab.

---

## 20. Configure WA Event
**Screenshot**: `20_configure_wa_event.jpeg`

The event configuration dialog lets you set up a specific WhatsApp automation trigger. Select the event type, choose a message template, map template variables to customer/order data fields, set timing (immediate or delayed), and toggle the rule on/off. For example, map the "Birthday Greeting" event to your birthday template with customer_name and bonus_points variables.

---

## 21. Settings - Loyalty (Top)
**Screenshot**: `21_settings_loyalty_top.jpeg`

The top section of the Loyalty tab configures points earning rules. Set the base earning rate (points per rupee spent), tier-specific multipliers (Bronze 100%, Silver 110%, Gold 125%, Platinum 150%), and tier thresholds based on total spending. Enable bonus features like first-visit bonus points and birthday/anniversary multipliers.

---

## 22. Settings - Loyalty (Bottom)
**Screenshot**: `22_settings_loyalty_bottom.jpeg`

The bottom section configures redemption rules and advanced settings. Set redemption rate (points to rupees conversion), minimum points to redeem, maximum redemption as percentage of bill, and absolute cap. Configure off-peak hours for bonus earning periods and points expiry rules. Changes take effect immediately for all future transactions.

---

## 23. QR Code
**Screenshot**: `23_qr_code.jpeg`

The QR Code page generates a unique, scannable QR code for your restaurant. When customers scan this code with their phone, it opens a self-registration form (see Screen 24). This eliminates manual data entry by staff and speeds up the loyalty signup process. The QR code can be printed and displayed at your billing counter, table tents, or entrance. Copy the registration link or download the QR image directly.

---

## 24. Customer Self-Registration
**Screenshot**: `24_customer_self_registration.jpeg`

This is the public-facing registration page that customers see when scanning the QR code. It shows your restaurant's branding, a "Join Our Loyalty Program" heading, and fields for name, phone number, and optional email. After submitting, the customer is automatically added to your CRM with a welcome message. No login required - this page is accessible without authentication.

---

## 25. Customer Segments
**Screenshot**: `25_customer_segments.jpeg`

The segments page lets you create and manage customer groups for targeted messaging. Each segment has a name, description, and filter criteria (e.g., "VIP Gold Members", "Inactive 30+ days", "Corporate Clients"). Segments automatically calculate matching customer counts. Use segments to send targeted WhatsApp campaigns or track specific customer cohorts.

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
When using Demo Mode (accessed via the login page button), a purple banner appears at the top of every screen indicating you're exploring with test data. All features work identically - you can create customers, add feedback, modify settings, and test the full workflow. Demo mode includes 55 customers with full order histories, making AI Insights fully populated and demonstrable.

---

*Document generated: March 3, 2026*
*Screenshots folder: `/app/screenshots/`*
*Screenshots ZIP: `/app/screenshots.zip`*
*Video Reel: `/app/mygenie_crm_reel.mp4`*
