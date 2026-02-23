# 🧪 DinePoints (MyGenie) - Comprehensive Test Cases

## Overview
This document contains all test cases organized by module for the DinePoints loyalty and CRM platform.

**Application Under Test:** https://loyalty-automation-1.preview.emergentagent.com
**Test Account:** demo@restaurant.com / Demo@123

---

## 📋 Module List

1. Authentication Module
2. Dashboard/Analytics Module
3. Customer Management Module
4. Points Transaction Module
5. Wallet Transaction Module
6. Coupon Management Module
7. Customer Segments Module
8. Feedback Module
9. QR Code Module
10. WhatsApp Templates Module
11. WhatsApp Automation Module
12. Loyalty Settings Module

---

## 1️⃣ AUTHENTICATION MODULE

### Test Cases:

#### TC-AUTH-001: Valid Login
**Objective:** Verify user can login with valid credentials
**Preconditions:** User account exists
**Test Data:**
- Email: demo@restaurant.com
- Password: Demo@123
**Steps:**
1. Navigate to login page
2. Enter valid email
3. Enter valid password
4. Click "Sign In" button
**Expected Result:**
- User is redirected to dashboard
- Token is stored
- User details are displayed
**Priority:** High

#### TC-AUTH-002: Invalid Email Login
**Objective:** Verify login fails with invalid email
**Test Data:**
- Email: invalid@test.com
- Password: Demo@123
**Steps:**
1. Navigate to login page
2. Enter invalid email
3. Enter password
4. Click "Sign In" button
**Expected Result:**
- Error message displayed: "Invalid credentials"
- User remains on login page
**Priority:** High

#### TC-AUTH-003: Invalid Password Login
**Objective:** Verify login fails with invalid password
**Test Data:**
- Email: demo@restaurant.com
- Password: WrongPass123
**Steps:**
1. Navigate to login page
2. Enter valid email
3. Enter wrong password
4. Click "Sign In" button
**Expected Result:**
- Error message displayed: "Invalid credentials"
- User remains on login page
**Priority:** High

#### TC-AUTH-004: Empty Email Field
**Objective:** Verify validation for empty email
**Steps:**
1. Navigate to login page
2. Leave email field empty
3. Enter password
4. Click "Sign In" button
**Expected Result:**
- HTML5 validation error displayed
- Form not submitted
**Priority:** Medium

#### TC-AUTH-005: Empty Password Field
**Objective:** Verify validation for empty password
**Steps:**
1. Navigate to login page
2. Enter email
3. Leave password field empty
4. Click "Sign In" button
**Expected Result:**
- HTML5 validation error displayed
- Form not submitted
**Priority:** Medium

#### TC-AUTH-006: Remember Me Functionality
**Objective:** Verify remember me checkbox works
**Steps:**
1. Navigate to login page
2. Check "Remember me" checkbox
3. Enter credentials and login
4. Logout
5. Return to login page
**Expected Result:**
- Credentials should be pre-filled
**Priority:** Low

#### TC-AUTH-007: Logout Functionality
**Objective:** Verify user can logout successfully
**Preconditions:** User is logged in
**Steps:**
1. Navigate to Settings page
2. Click "Logout" button
**Expected Result:**
- User is redirected to login page
- Token is cleared
- Cannot access protected routes
**Priority:** High

#### TC-AUTH-008: Protected Route Access Without Login
**Objective:** Verify protected routes redirect to login
**Steps:**
1. Without logging in, try to access /customers
**Expected Result:**
- User is redirected to /login
**Priority:** High

#### TC-AUTH-009: Password Visibility Toggle
**Objective:** Verify password show/hide functionality
**Steps:**
1. Navigate to login page
2. Enter password
3. Click eye icon
**Expected Result:**
- Password should toggle between visible/hidden
**Priority:** Low

#### TC-AUTH-010: Registration with Valid Data
**Objective:** Verify new user can register
**Test Data:**
- Email: newuser@test.com
- Restaurant Name: Test Restaurant
- Phone: 9876543210
- Password: Test@123
**Steps:**
1. Navigate to register page
2. Fill all required fields
3. Click "Sign Up" button
**Expected Result:**
- User account created
- User logged in automatically
- Redirected to dashboard
**Priority:** High

---

## 2️⃣ DASHBOARD/ANALYTICS MODULE

### Test Cases:

#### TC-DASH-001: Dashboard Loading
**Objective:** Verify dashboard loads with all stats
**Preconditions:** User is logged in
**Steps:**
1. Login successfully
2. Observe dashboard
**Expected Result:**
- Total Customers count displayed
- Points Issued displayed
- Points Redeemed displayed
- Active Customers (30d) displayed
- Average Rating displayed
- Recent customers list shown
**Priority:** High

#### TC-DASH-002: Total Customers Count Accuracy
**Objective:** Verify total customers count is accurate
**Steps:**
1. Navigate to Customers page
2. Count total customers
3. Return to dashboard
4. Compare count
**Expected Result:**
- Dashboard count matches customers page count
**Priority:** Medium

#### TC-DASH-003: Recent Customers Display
**Objective:** Verify recent customers are displayed
**Steps:**
1. View dashboard recent customers section
**Expected Result:**
- Shows at least 5 recent customers
- Each shows name, phone, tier, points
**Priority:** Medium

#### TC-DASH-004: Quick Action - Add Customer
**Objective:** Verify Add Customer quick action works
**Steps:**
1. On dashboard, click "Add Customer" button
**Expected Result:**
- Add customer modal/form appears
**Priority:** Medium

#### TC-DASH-005: Quick Action - Show QR
**Objective:** Verify Show QR quick action works
**Steps:**
1. On dashboard, click "Show QR" button
**Expected Result:**
- Redirected to QR code page
- QR code displayed
**Priority:** Medium

#### TC-DASH-006: View All Customers Link
**Objective:** Verify "View all" link navigates to customers page
**Steps:**
1. Click "View all" link in recent customers
**Expected Result:**
- Redirected to /customers page
**Priority:** Low

#### TC-DASH-007: Dashboard Refresh
**Objective:** Verify dashboard data refreshes
**Steps:**
1. View dashboard
2. Open new tab, add a customer
3. Return to dashboard tab and refresh
**Expected Result:**
- Total customers count increases
- New customer appears in recent list
**Priority:** Medium

---

## 3️⃣ CUSTOMER MANAGEMENT MODULE

### Test Cases:

#### TC-CUST-001: View All Customers
**Objective:** Verify customers list displays correctly
**Preconditions:** User is logged in
**Steps:**
1. Navigate to Customers page
**Expected Result:**
- List of customers displayed
- Each customer shows: name, phone, tier, points, visits
**Priority:** High

#### TC-CUST-002: Add New Customer - All Fields
**Objective:** Verify customer can be added with all fields
**Test Data:**
- Name: Test Customer
- Phone: 9123456789
- Email: test@customer.com
- City: Mumbai
- DOB: 1990-01-15
- Customer Type: Normal
**Steps:**
1. Click "Add Customer" button
2. Fill all fields
3. Click "Save" button
**Expected Result:**
- Customer created successfully
- Success message displayed
- Customer appears in list
**Priority:** High

#### TC-CUST-003: Add New Customer - Required Fields Only
**Objective:** Verify customer can be added with minimum data
**Test Data:**
- Name: Min Customer
- Phone: 9234567890
**Steps:**
1. Click "Add Customer" button
2. Fill only name and phone
3. Click "Save" button
**Expected Result:**
- Customer created successfully
- Default values applied (tier: Bronze, points: 0)
**Priority:** High

#### TC-CUST-004: Add Customer - Duplicate Phone
**Objective:** Verify validation for duplicate phone number
**Test Data:**
- Use phone number of existing customer
**Steps:**
1. Try to add customer with existing phone
**Expected Result:**
- Error message: "Customer with this phone already exists"
- Customer not created
**Priority:** High

#### TC-CUST-005: Add Customer - Invalid Phone Format
**Objective:** Verify phone number validation
**Test Data:**
- Phone: 123 (too short)
**Steps:**
1. Try to add customer with invalid phone
**Expected Result:**
- Validation error displayed
- Customer not created
**Priority:** Medium

#### TC-CUST-006: Add Customer - Invalid Email Format
**Objective:** Verify email validation
**Test Data:**
- Email: invalidemail
**Steps:**
1. Try to add customer with invalid email
**Expected Result:**
- Validation error displayed
- Customer not created
**Priority:** Medium

#### TC-CUST-007: Add Corporate Customer
**Objective:** Verify corporate customer creation
**Test Data:**
- Customer Type: Corporate
- GST Name: Test Corp Pvt Ltd
- GST Number: 27AABCU9603R1Z1
**Steps:**
1. Select customer type as Corporate
2. Fill GST details
3. Save customer
**Expected Result:**
- Corporate customer created with GST info
**Priority:** Medium

#### TC-CUST-008: Edit Customer Details
**Objective:** Verify customer details can be edited
**Steps:**
1. Select a customer
2. Click edit icon
3. Modify name
4. Save changes
**Expected Result:**
- Customer details updated
- Changes reflected in list
**Priority:** High

#### TC-CUST-009: Delete Customer
**Objective:** Verify customer can be deleted
**Steps:**
1. Select a customer
2. Click delete icon
3. Confirm deletion
**Expected Result:**
- Customer removed from list
- Success message displayed
**Priority:** High

#### TC-CUST-010: View Customer Details
**Objective:** Verify customer detail page displays all info
**Steps:**
1. Click on a customer name
**Expected Result:**
- Redirected to customer detail page
- Shows: profile, points balance, transaction history, wallet balance
**Priority:** High

#### TC-CUST-011: Search Customer by Name
**Objective:** Verify search functionality by name
**Test Data:**
- Search: "Amit"
**Steps:**
1. Enter "Amit" in search box
**Expected Result:**
- Only customers with "Amit" in name displayed
**Priority:** High

#### TC-CUST-012: Search Customer by Phone
**Objective:** Verify search functionality by phone
**Test Data:**
- Search: "9876"
**Steps:**
1. Enter "9876" in search box
**Expected Result:**
- Customers with matching phone numbers displayed
**Priority:** High

#### TC-CUST-013: Filter by Tier - Bronze
**Objective:** Verify tier filter works
**Steps:**
1. Select "Bronze" from tier filter
**Expected Result:**
- Only Bronze tier customers displayed
**Priority:** Medium

#### TC-CUST-014: Filter by Tier - Silver
**Objective:** Verify Silver tier filter
**Steps:**
1. Select "Silver" from tier filter
**Expected Result:**
- Only Silver tier customers displayed
**Priority:** Medium

#### TC-CUST-015: Filter by Tier - Gold
**Objective:** Verify Gold tier filter
**Steps:**
1. Select "Gold" from tier filter
**Expected Result:**
- Only Gold tier customers displayed
**Priority:** Medium

#### TC-CUST-016: Filter by Tier - Platinum
**Objective:** Verify Platinum tier filter
**Steps:**
1. Select "Platinum" from tier filter
**Expected Result:**
- Only Platinum tier customers displayed
**Priority:** Medium

#### TC-CUST-017: Filter by Customer Type - Corporate
**Objective:** Verify customer type filter
**Steps:**
1. Select "Corporate" from customer type filter
**Expected Result:**
- Only corporate customers displayed
**Priority:** Medium

#### TC-CUST-018: Filter by Last Visit
**Objective:** Verify last visit filter
**Steps:**
1. Select "30+ days" from last visit filter
**Expected Result:**
- Customers who haven't visited in 30+ days displayed
**Priority:** Medium

#### TC-CUST-019: Filter by City
**Objective:** Verify city filter
**Steps:**
1. Select "Mumbai" from city filter
**Expected Result:**
- Only Mumbai customers displayed
**Priority:** Low

#### TC-CUST-020: Sort Customers by Name
**Objective:** Verify sorting by name
**Steps:**
1. Click on "Name" column header
**Expected Result:**
- Customers sorted alphabetically by name
**Priority:** Low

#### TC-CUST-021: Sort Customers by Points
**Objective:** Verify sorting by points
**Steps:**
1. Click on "Points" column header
**Expected Result:**
- Customers sorted by points (high to low)
**Priority:** Low

#### TC-CUST-022: Add Customer with Allergies
**Objective:** Verify allergy information can be added
**Test Data:**
- Allergies: Peanuts, Dairy
**Steps:**
1. Add customer and select allergies
**Expected Result:**
- Allergies saved and displayed in customer profile
**Priority:** Low

#### TC-CUST-023: Customer List Pagination
**Objective:** Verify pagination works if many customers
**Preconditions:** More than 20 customers exist
**Steps:**
1. View customers list
2. Check if pagination appears
3. Click next page
**Expected Result:**
- Next set of customers loaded
**Priority:** Low

---

## 4️⃣ POINTS TRANSACTION MODULE

### Test Cases:

#### TC-POINTS-001: Earn Points from Bill
**Objective:** Verify points are earned based on bill amount
**Preconditions:** Customer exists, logged in
**Test Data:**
- Customer: Any customer
- Bill Amount: ₹1000
**Steps:**
1. Go to customer detail page
2. Click "Add Points" or similar
3. Select "Earn Points"
4. Enter bill amount: 1000
5. Save transaction
**Expected Result:**
- Points calculated based on loyalty settings (e.g., 1000 points if 1 point per rupee)
- Customer's total points increased
- Transaction appears in history
**Priority:** High

#### TC-POINTS-002: Redeem Points
**Objective:** Verify customer can redeem points
**Preconditions:** Customer has sufficient points
**Test Data:**
- Customer: Customer with 500+ points
- Points to redeem: 200
**Steps:**
1. Go to customer detail page
2. Click "Redeem Points"
3. Enter 200 points
4. Save transaction
**Expected Result:**
- 200 points deducted from customer balance
- Redeemed transaction in history
- Customer's points balance updated
**Priority:** High

#### TC-POINTS-003: Redeem More Points Than Balance
**Objective:** Verify cannot redeem more than available
**Preconditions:** Customer has 100 points
**Test Data:**
- Points to redeem: 500
**Steps:**
1. Try to redeem 500 points
**Expected Result:**
- Error message: "Insufficient points"
- Transaction not saved
**Priority:** High

#### TC-POINTS-004: Issue Bonus Points
**Objective:** Verify bonus points can be issued
**Test Data:**
- Customer: Any customer
- Bonus Points: 100
- Reason: Birthday bonus
**Steps:**
1. Go to customer detail page
2. Click "Issue Bonus Points"
3. Enter 100 points with reason
4. Save
**Expected Result:**
- 100 bonus points added to customer
- Transaction type: "bonus"
- Reason displayed in history
**Priority:** High

#### TC-POINTS-005: Points Transaction History
**Objective:** Verify transaction history displays correctly
**Steps:**
1. Go to customer detail page
2. View points transaction history
**Expected Result:**
- All transactions displayed (earned, redeemed, bonus)
- Each shows: date, points, type, reason
- Most recent first
**Priority:** Medium

#### TC-POINTS-006: Negative Points Validation
**Objective:** Verify cannot enter negative points
**Steps:**
1. Try to enter -100 points
**Expected Result:**
- Validation error or field rejects negative values
**Priority:** Medium

#### TC-POINTS-007: Zero Points Validation
**Objective:** Verify cannot enter zero points
**Steps:**
1. Try to enter 0 points
**Expected Result:**
- Validation error: "Points must be greater than 0"
**Priority:** Low

#### TC-POINTS-008: Points Calculation with Tier Bonus
**Objective:** Verify tier-based earning percentage
**Preconditions:** Customer is Gold tier (125% earning)
**Test Data:**
- Bill Amount: ₹1000
**Steps:**
1. Issue points for ₹1000 bill
**Expected Result:**
- Points earned: 1250 (1000 * 1.25)
**Priority:** Medium

#### TC-POINTS-009: Birthday Bonus Auto-Applied
**Objective:** Verify birthday bonus on customer's birthday
**Preconditions:** Customer DOB is today
**Steps:**
1. Add points on customer's birthday
**Expected Result:**
- Birthday bonus automatically added (per loyalty settings)
**Priority:** Low

#### TC-POINTS-010: Filter Transactions by Type
**Objective:** Verify filtering by transaction type
**Steps:**
1. View points transactions
2. Filter by "Earned" type
**Expected Result:**
- Only earned transactions displayed
**Priority:** Low

---

## 5️⃣ WALLET TRANSACTION MODULE

### Test Cases:

#### TC-WALLET-001: Credit to Wallet
**Objective:** Verify amount can be credited to wallet
**Test Data:**
- Customer: Any customer
- Amount: ₹500
**Steps:**
1. Go to customer detail page
2. Click "Credit Wallet" or similar
3. Enter ₹500
4. Save transaction
**Expected Result:**
- ₹500 added to customer's wallet balance
- Transaction appears in wallet history
**Priority:** High

#### TC-WALLET-002: Debit from Wallet
**Objective:** Verify amount can be debited from wallet
**Preconditions:** Customer has ₹500 in wallet
**Test Data:**
- Amount: ₹200
**Steps:**
1. Go to customer detail page
2. Click "Debit Wallet"
3. Enter ₹200
4. Save transaction
**Expected Result:**
- ₹200 deducted from wallet
- Wallet balance updated
- Transaction in history
**Priority:** High

#### TC-WALLET-003: Debit More Than Balance
**Objective:** Verify cannot debit more than available
**Preconditions:** Wallet balance is ₹100
**Test Data:**
- Amount: ₹500
**Steps:**
1. Try to debit ₹500
**Expected Result:**
- Error: "Insufficient wallet balance"
- Transaction not processed
**Priority:** High

#### TC-WALLET-004: Wallet with Bonus Amount
**Objective:** Verify bonus amount on wallet top-up
**Test Data:**
- Credit Amount: ₹1000
- Bonus: 10%
**Steps:**
1. Credit ₹1000 to wallet
2. Check if bonus applied
**Expected Result:**
- If bonus configured: ₹1100 credited (₹1000 + ₹100 bonus)
- Bonus amount shown separately in transaction
**Priority:** Medium

#### TC-WALLET-005: View Wallet Transaction History
**Objective:** Verify wallet transaction history
**Steps:**
1. Go to customer detail page
2. View wallet transactions
**Expected Result:**
- All wallet transactions displayed (credits, debits)
- Each shows: date, amount, type, reason
**Priority:** Medium

#### TC-WALLET-006: Zero Amount Validation
**Objective:** Verify cannot enter zero amount
**Steps:**
1. Try to credit/debit ₹0
**Expected Result:**
- Validation error
**Priority:** Low

#### TC-WALLET-007: Negative Amount Validation
**Objective:** Verify cannot enter negative amount
**Steps:**
1. Try to enter -₹100
**Expected Result:**
- Validation error or field rejects negative
**Priority:** Low

#### TC-WALLET-008: Wallet Balance Display
**Objective:** Verify wallet balance shows correctly
**Steps:**
1. View customer profile
**Expected Result:**
- Current wallet balance displayed prominently
**Priority:** Medium

---

## 6️⃣ COUPON MANAGEMENT MODULE

### Test Cases:

#### TC-COUPON-001: Create Percentage Coupon
**Objective:** Verify percentage discount coupon creation
**Test Data:**
- Code: TEST20
- Type: Percentage
- Value: 20%
- Min Order: ₹500
- Max Discount: ₹200
- Usage Limit: 100
**Steps:**
1. Navigate to Coupons page
2. Click "Add Coupon"
3. Fill all fields
4. Save coupon
**Expected Result:**
- Coupon created successfully
- Appears in coupons list
**Priority:** High

#### TC-COUPON-002: Create Fixed Discount Coupon
**Objective:** Verify fixed discount coupon creation
**Test Data:**
- Code: FLAT50
- Type: Fixed
- Value: ₹50
- Min Order: ₹300
**Steps:**
1. Create fixed discount coupon
**Expected Result:**
- Coupon created with fixed amount
**Priority:** High

#### TC-COUPON-003: Duplicate Coupon Code Validation
**Objective:** Verify cannot create duplicate coupon code
**Test Data:**
- Code: Existing code (e.g., WELCOME20)
**Steps:**
1. Try to create coupon with existing code
**Expected Result:**
- Error: "Coupon code already exists"
**Priority:** High

#### TC-COUPON-004: Edit Coupon Details
**Objective:** Verify coupon can be edited
**Steps:**
1. Select a coupon
2. Click edit
3. Modify discount value
4. Save changes
**Expected Result:**
- Coupon details updated
**Priority:** Medium

#### TC-COUPON-005: Delete Coupon
**Objective:** Verify coupon can be deleted
**Steps:**
1. Select a coupon
2. Click delete
3. Confirm deletion
**Expected Result:**
- Coupon removed from list
**Priority:** Medium

#### TC-COUPON-006: Toggle Coupon Active/Inactive
**Objective:** Verify coupon can be activated/deactivated
**Steps:**
1. Click toggle switch on a coupon
**Expected Result:**
- Coupon status changes
- Active/inactive status updated
**Priority:** Medium

#### TC-COUPON-007: Set Coupon Valid Dates
**Objective:** Verify date range can be set
**Test Data:**
- Valid From: Today
- Valid Until: 30 days from today
**Steps:**
1. Set date range while creating coupon
**Expected Result:**
- Dates saved
- Coupon only valid within date range
**Priority:** Medium

#### TC-COUPON-008: Coupon with Tier Restriction
**Objective:** Verify tier-specific coupons
**Test Data:**
- Tier Restriction: Gold
**Steps:**
1. Create coupon with Gold tier restriction
**Expected Result:**
- Coupon only applicable to Gold tier customers
**Priority:** Low

#### TC-COUPON-009: Coupon with Channel Restriction
**Objective:** Verify channel-specific coupons
**Test Data:**
- Channels: Dine-in only
**Steps:**
1. Create coupon for dine-in only
**Expected Result:**
- Coupon applicable only for dine-in orders
**Priority:** Low

#### TC-COUPON-010: View Coupon Usage Stats
**Objective:** Verify usage statistics display
**Steps:**
1. View coupon details
**Expected Result:**
- Shows: used count, remaining uses, usage limit
**Priority:** Low

#### TC-COUPON-011: Expired Coupon Display
**Objective:** Verify expired coupons are marked
**Steps:**
1. View coupons list
2. Check for expired coupons
**Expected Result:**
- Expired coupons marked/greyed out
**Priority:** Low

---

## 7️⃣ CUSTOMER SEGMENTS MODULE

### Test Cases:

#### TC-SEG-001: Create Segment by Tier
**Objective:** Verify segment creation by tier filter
**Test Data:**
- Segment Name: Gold Members
- Filter: Tier = Gold
**Steps:**
1. Navigate to Segments page
2. Click "Create Segment"
3. Enter name and select tier filter
4. Save segment
**Expected Result:**
- Segment created
- Customer count calculated and displayed
**Priority:** High

#### TC-SEG-002: Create Segment by Last Visit
**Objective:** Verify segment by last visit filter
**Test Data:**
- Segment Name: Inactive 30+ days
- Filter: Last Visit > 30 days
**Steps:**
1. Create segment with last visit filter
**Expected Result:**
- Segment created showing inactive customers
**Priority:** High

#### TC-SEG-003: Create Segment by Customer Type
**Objective:** Verify segment by customer type
**Test Data:**
- Segment Name: Corporate Clients
- Filter: Type = Corporate
**Steps:**
1. Create segment with type filter
**Expected Result:**
- Segment shows only corporate customers
**Priority:** Medium

#### TC-SEG-004: Create Segment by City
**Objective:** Verify segment by city filter
**Test Data:**
- Segment Name: Mumbai Customers
- Filter: City = Mumbai
**Steps:**
1. Create segment with city filter
**Expected Result:**
- Segment shows only Mumbai customers
**Priority:** Medium

#### TC-SEG-005: Create Segment with Multiple Filters
**Objective:** Verify combining multiple filters
**Test Data:**
- Filters: Tier = Gold AND City = Mumbai
**Steps:**
1. Create segment with multiple filters
**Expected Result:**
- Segment shows customers matching all filters
**Priority:** Medium

#### TC-SEG-006: View Segment Customer List
**Objective:** Verify clicking segment shows customers
**Steps:**
1. Click on a segment
**Expected Result:**
- List of customers in that segment displayed
**Priority:** High

#### TC-SEG-007: Delete Segment
**Objective:** Verify segment can be deleted
**Steps:**
1. Select a segment
2. Click delete
3. Confirm deletion
**Expected Result:**
- Segment removed from list
**Priority:** Medium

#### TC-SEG-008: Segment Customer Count Auto-Update
**Objective:** Verify count updates when customers change
**Steps:**
1. Note customer count in a segment
2. Add/edit customer to match segment criteria
3. Check segment count
**Expected Result:**
- Customer count automatically updated
**Priority:** Low

#### TC-SEG-009: Empty Segment Display
**Objective:** Verify handling of segments with 0 customers
**Steps:**
1. Create segment with very specific filters (no matches)
**Expected Result:**
- Segment created with 0 customer count
- Shows message "No customers in this segment"
**Priority:** Low

#### TC-SEG-010: Segment Stats Display
**Objective:** Verify segment statistics page
**Steps:**
1. Navigate to Segments page
2. View segment stats section
**Expected Result:**
- Shows breakdown by tier, type, etc.
**Priority:** Low

---

## 8️⃣ FEEDBACK MODULE

### Test Cases:

#### TC-FEED-001: View All Feedback
**Objective:** Verify feedback list displays
**Steps:**
1. Navigate to Feedback page
**Expected Result:**
- List of all feedback displayed
- Each shows: customer name, rating, comments, date
**Priority:** High

#### TC-FEED-002: Submit 5-Star Feedback
**Objective:** Verify 5-star rating submission
**Test Data:**
- Customer: Any customer
- Rating: 5 stars
- Comments: "Excellent service!"
**Steps:**
1. Submit feedback with 5 stars
**Expected Result:**
- Feedback saved
- Appears in feedback list
**Priority:** Medium

#### TC-FEED-003: Submit 1-Star Feedback
**Objective:** Verify low rating submission
**Test Data:**
- Rating: 1 star
- Comments: "Poor experience"
**Steps:**
1. Submit feedback with 1 star
**Expected Result:**
- Low rating feedback saved
**Priority:** Medium

#### TC-FEED-004: Submit Feedback Without Comments
**Objective:** Verify rating-only feedback
**Steps:**
1. Select rating
2. Leave comments empty
3. Submit
**Expected Result:**
- Feedback saved with rating only
**Priority:** Low

#### TC-FEED-005: Filter Feedback by Rating
**Objective:** Verify filtering by star rating
**Steps:**
1. Select "5 stars" filter
**Expected Result:**
- Only 5-star feedback displayed
**Priority:** Low

#### TC-FEED-006: Search Feedback by Customer
**Objective:** Verify searching feedback
**Steps:**
1. Enter customer name in search
**Expected Result:**
- Feedback from that customer displayed
**Priority:** Low

#### TC-FEED-007: View Feedback from Customer Profile
**Objective:** Verify feedback shows in customer detail
**Steps:**
1. Go to customer detail page
2. Check feedback section
**Expected Result:**
- Customer's feedback history displayed
**Priority:** Low

#### TC-FEED-008: Average Rating Calculation
**Objective:** Verify average rating on dashboard
**Steps:**
1. Note feedback ratings
2. Check dashboard average
**Expected Result:**
- Average correctly calculated from all feedback
**Priority:** Medium

---

## 9️⃣ QR CODE MODULE

### Test Cases:

#### TC-QR-001: Generate QR Code
**Objective:** Verify QR code can be generated
**Steps:**
1. Navigate to QR Code page
2. Click "Generate QR" button
**Expected Result:**
- QR code displayed
- Contains registration URL
**Priority:** High

#### TC-QR-002: Download QR Code
**Objective:** Verify QR code can be downloaded
**Steps:**
1. Generate QR code
2. Click "Download" button
**Expected Result:**
- QR code image downloaded
- File format: PNG or SVG
**Priority:** Medium

#### TC-QR-003: QR Code Contains Restaurant ID
**Objective:** Verify QR code has unique restaurant identifier
**Steps:**
1. Generate QR code
2. Scan/decode QR code
**Expected Result:**
- URL contains restaurant ID
- Format: /register-customer/{restaurant_id}
**Priority:** Medium

#### TC-QR-004: Regenerate QR Code
**Objective:** Verify QR code can be regenerated
**Steps:**
1. Generate QR code
2. Click "Regenerate" if available
**Expected Result:**
- New QR code generated (if feature exists)
**Priority:** Low

---

## 🔟 WHATSAPP TEMPLATES MODULE

### Test Cases:

#### TC-TMPL-001: Create WhatsApp Template
**Objective:** Verify WhatsApp template creation
**Test Data:**
- Name: Welcome Message
- Content: "Welcome {{customer_name}} to {{restaurant_name}}!"
- Variables: customer_name, restaurant_name
**Steps:**
1. Navigate to WhatsApp Automation page
2. Go to Templates section
3. Click "Add Template"
4. Fill details
5. Save template
**Expected Result:**
- Template created successfully
- Variables detected automatically
- Appears in templates list
**Priority:** High

#### TC-TMPL-002: Edit WhatsApp Template
**Objective:** Verify template can be edited
**Steps:**
1. Select a template
2. Click edit
3. Modify content
4. Save changes
**Expected Result:**
- Template content updated
**Priority:** Medium

#### TC-TMPL-003: Delete WhatsApp Template
**Objective:** Verify template can be deleted
**Steps:**
1. Select a template
2. Click delete
3. Confirm deletion
**Expected Result:**
- Template removed
- If used in automation, show warning
**Priority:** Medium

#### TC-TMPL-004: Template Variable Detection
**Objective:** Verify variables are auto-detected
**Test Data:**
- Content: "Hi {{name}}, you have {{points}} points"
**Steps:**
1. Enter template content with variables
**Expected Result:**
- Variables automatically detected and listed
- Format: {{variable_name}}
**Priority:** Medium

#### TC-TMPL-005: Template Preview
**Objective:** Verify template preview with sample data
**Steps:**
1. View template
2. Check preview section
**Expected Result:**
- Template shown with placeholder values filled
**Priority:** Low

---

## 1️⃣1️⃣ WHATSAPP AUTOMATION MODULE

### Test Cases:

#### TC-AUTO-001: Create Automation Rule
**Objective:** Verify automation rule creation
**Test Data:**
- Event: Points Earned
- Template: Points Earned template
- Delay: 5 minutes
**Steps:**
1. Navigate to Automation Rules section
2. Click "Add Rule"
3. Select event and template
4. Set delay
5. Save rule
**Expected Result:**
- Automation rule created
- Shows in rules list
- Status: Enabled
**Priority:** High

#### TC-AUTO-002: Edit Automation Rule
**Objective:** Verify rule can be edited
**Steps:**
1. Select a rule
2. Click edit
3. Change template or delay
4. Save changes
**Expected Result:**
- Rule updated successfully
**Priority:** Medium

#### TC-AUTO-003: Delete Automation Rule
**Objective:** Verify rule can be deleted
**Steps:**
1. Select a rule
2. Click delete
3. Confirm deletion
**Expected Result:**
- Rule removed from list
**Priority:** Medium

#### TC-AUTO-004: Enable/Disable Automation Rule
**Objective:** Verify rule can be toggled on/off
**Steps:**
1. Click toggle switch on a rule
**Expected Result:**
- Rule status changes (enabled/disabled)
- Disabled rules don't trigger
**Priority:** High

#### TC-AUTO-005: View Available Events
**Objective:** Verify all automation events are listed
**Steps:**
1. Click "Add Rule"
2. View event dropdown
**Expected Result:**
- Shows all available events:
  - Points earned
  - Points redeemed
  - Bonus points
  - Wallet credit
  - Birthday
  - Anniversary
  - First visit
  - Tier upgrade
  etc.
**Priority:** Medium

#### TC-AUTO-006: Automation Rule with Zero Delay
**Objective:** Verify immediate trigger (0 delay)
**Steps:**
1. Create rule with 0 minutes delay
**Expected Result:**
- Rule created
- Triggers immediately when event occurs
**Priority:** Low

#### TC-AUTO-007: Automation Rule Execution
**Objective:** Verify rule triggers on event
**Preconditions:** Rule enabled for "Points Earned"
**Steps:**
1. Add points to a customer
2. Check if message would be sent (simulation)
**Expected Result:**
- Rule triggered
- Message queued/sent
**Priority:** High (if WhatsApp integration active)

---

## 1️⃣2️⃣ LOYALTY SETTINGS MODULE

### Test Cases:

#### TC-LOYAL-001: View Loyalty Settings
**Objective:** Verify settings page displays all options
**Steps:**
1. Navigate to Settings > Loyalty Program
**Expected Result:**
- Shows all settings:
  - Points per rupee
  - Redemption rate
  - Minimum points to redeem
  - Points expiry days
  - Bonus configurations
  - Tier thresholds
  - Off-peak hours
**Priority:** High

#### TC-LOYAL-002: Update Points per Rupee
**Objective:** Verify points earning rate can be changed
**Test Data:**
- Points per Rupee: 2
**Steps:**
1. Change value to 2
2. Save settings
**Expected Result:**
- Setting updated
- Success message displayed
- New rate applies to future transactions
**Priority:** High

#### TC-LOYAL-003: Update Redemption Rate
**Objective:** Verify redemption rate modification
**Test Data:**
- Redemption Rate: 1 (1 point = ₹1)
**Steps:**
1. Update redemption rate
2. Save
**Expected Result:**
- Rate updated
- Applies to redemptions going forward
**Priority:** High

#### TC-LOYAL-004: Set Birthday Bonus Points
**Objective:** Verify birthday bonus configuration
**Test Data:**
- Birthday Bonus: 200 points
**Steps:**
1. Update birthday bonus value
2. Save
**Expected Result:**
- Bonus amount saved
- Applied on customer birthdays
**Priority:** Medium

#### TC-LOYAL-005: Set Anniversary Bonus Points
**Objective:** Verify anniversary bonus
**Test Data:**
- Anniversary Bonus: 250 points
**Steps:**
1. Update anniversary bonus
2. Save
**Expected Result:**
- Bonus saved
**Priority:** Medium

#### TC-LOYAL-006: Configure Tier Thresholds
**Objective:** Verify tier threshold updates
**Test Data:**
- Bronze: ₹0
- Silver: ₹5000
- Gold: ₹15000
- Platinum: ₹30000
**Steps:**
1. Update tier thresholds
2. Save settings
**Expected Result:**
- Thresholds updated
- Customers auto-upgraded when they cross thresholds
**Priority:** High

#### TC-LOYAL-007: Set Tier Earning Percentages
**Objective:** Verify tier-based earning rates
**Test Data:**
- Bronze: 100%
- Silver: 110%
- Gold: 125%
- Platinum: 150%
**Steps:**
1. Update earning percentages
2. Save
**Expected Result:**
- Percentages saved
- Different tiers earn at different rates
**Priority:** High

#### TC-LOYAL-008: Configure Off-Peak Hours
**Objective:** Verify off-peak hours settings
**Test Data:**
- Start: 14:00
- End: 17:00
- Bonus: 20%
**Steps:**
1. Set off-peak time range and bonus
2. Save
**Expected Result:**
- Settings saved
- Extra bonus during off-peak hours
**Priority:** Medium

#### TC-LOYAL-009: Set Points Expiry Days
**Objective:** Verify points expiry configuration
**Test Data:**
- Expiry: 365 days
**Steps:**
1. Update expiry days
2. Save
**Expected Result:**
- Expiry period updated
- Points older than this expire
**Priority:** Low

#### TC-LOYAL-010: Set Minimum Points to Redeem
**Objective:** Verify minimum redemption threshold
**Test Data:**
- Minimum: 100 points
**Steps:**
1. Update minimum points
2. Save
**Expected Result:**
- Minimum set
- Cannot redeem less than this amount
**Priority:** Medium

#### TC-LOYAL-011: Invalid Settings Validation
**Objective:** Verify validation for invalid values
**Steps:**
1. Try to enter negative values
2. Try to enter text in number fields
**Expected Result:**
- Validation errors displayed
- Settings not saved
**Priority:** Medium

---

## 📊 Test Case Summary

| Module | Total Test Cases | High Priority | Medium Priority | Low Priority |
|--------|------------------|---------------|-----------------|--------------|
| Authentication | 10 | 6 | 3 | 1 |
| Dashboard | 7 | 1 | 5 | 1 |
| Customer Management | 23 | 10 | 9 | 4 |
| Points Transaction | 10 | 5 | 3 | 2 |
| Wallet Transaction | 8 | 3 | 3 | 2 |
| Coupon Management | 11 | 3 | 5 | 3 |
| Customer Segments | 10 | 3 | 4 | 3 |
| Feedback | 8 | 1 | 2 | 5 |
| QR Code | 4 | 1 | 2 | 1 |
| WhatsApp Templates | 5 | 1 | 3 | 1 |
| WhatsApp Automation | 7 | 3 | 2 | 2 |
| Loyalty Settings | 11 | 4 | 4 | 3 |
| **TOTAL** | **114** | **41** | **45** | **28** |

---

## 🎯 Test Execution Strategy

### Phase 1: Smoke Testing (High Priority)
- Execute all 41 High Priority test cases
- Validates core functionality
- Must pass before proceeding

### Phase 2: Regression Testing (Medium Priority)
- Execute 45 Medium Priority test cases
- Comprehensive feature testing
- Ensures no regressions

### Phase 3: Extended Testing (Low Priority)
- Execute 28 Low Priority test cases
- Edge cases and optional features
- Nice-to-have validations

---

## 📝 Test Data Requirements

**Test Account:**
- Email: demo@restaurant.com
- Password: Demo@123

**Test Environment:**
- URL: https://loyalty-automation-1.preview.emergentagent.com
- Backend: FastAPI
- Database: MongoDB (pre-seeded with demo data)

**Prerequisites:**
- Browser: Chrome/Firefox (latest)
- Network: Stable internet connection
- Account: Demo account should be active

---

## ✅ Test Execution Checklist

- [ ] Environment is accessible
- [ ] Test account credentials verified
- [ ] Demo data is loaded
- [ ] Browser DevTools ready for debugging
- [ ] Screenshot capability available
- [ ] Test results document ready

---

**Document Version:** 1.0
**Created:** 2026-02-23
**Application:** DinePoints (MyGenie)
**Total Test Cases:** 114
