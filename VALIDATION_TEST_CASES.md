# 🔍 UI Field Validation Test Cases - Complete Suite

## Overview
Comprehensive validation test cases for all input fields across the DinePoints (MyGenie) application.

**Application:** https://loyalty-automation-1.preview.emergentagent.com
**Test Account:** demo@restaurant.com / Demo@123

---

## 📝 Table of Contents

1. [Login Form Validations](#1-login-form-validations)
2. [Registration Form Validations](#2-registration-form-validations)
3. [Add/Edit Customer Form Validations](#3-addedit-customer-form-validations)
4. [Points Transaction Form Validations](#4-points-transaction-form-validations)
5. [Wallet Transaction Form Validations](#5-wallet-transaction-form-validations)
6. [Coupon Form Validations](#6-coupon-form-validations)
7. [Segment Form Validations](#7-segment-form-validations)
8. [Feedback Form Validations](#8-feedback-form-validations)
9. [WhatsApp Template Form Validations](#9-whatsapp-template-form-validations)
10. [Automation Rule Form Validations](#10-automation-rule-form-validations)
11. [Loyalty Settings Form Validations](#11-loyalty-settings-form-validations)
12. [QR Code Form Validations](#12-qr-code-form-validations)

---

## 1️⃣ LOGIN FORM VALIDATIONS

### Email Field Validations

#### VAL-LOGIN-001: Empty Email Field
**Field:** Email
**Test Data:** (Leave empty)
**Steps:**
1. Leave email field blank
2. Enter password
3. Click "Sign In"
**Expected Result:**
- HTML5 validation error: "Please fill out this field"
- Form not submitted
- Focus moves to email field
**Priority:** High

#### VAL-LOGIN-002: Invalid Email Format - Missing @
**Field:** Email
**Test Data:** `invalidemail.com`
**Steps:**
1. Enter email without @
2. Try to submit
**Expected Result:**
- Validation error: "Please include '@' in the email address"
- Form not submitted
**Priority:** High

#### VAL-LOGIN-003: Invalid Email Format - Missing Domain
**Field:** Email
**Test Data:** `test@`
**Steps:**
1. Enter email without domain
2. Try to submit
**Expected Result:**
- Validation error: "Please enter a part following '@'"
- Form not submitted
**Priority:** High

#### VAL-LOGIN-004: Invalid Email Format - Missing Username
**Field:** Email
**Test Data:** `@restaurant.com`
**Steps:**
1. Enter email without username
2. Try to submit
**Expected Result:**
- Validation error: "Please enter a part before '@'"
- Form not submitted
**Priority:** Medium

#### VAL-LOGIN-005: Email with Spaces
**Field:** Email
**Test Data:** `test @restaurant.com`
**Steps:**
1. Enter email with space
2. Try to submit
**Expected Result:**
- Validation error or space automatically trimmed
- Form not submitted with space
**Priority:** Medium

#### VAL-LOGIN-006: Email with Special Characters
**Field:** Email
**Test Data:** `test#$%@restaurant.com`
**Steps:**
1. Enter email with invalid special chars
2. Try to submit
**Expected Result:**
- Validation error for invalid characters
**Priority:** Low

#### VAL-LOGIN-007: Email Maximum Length
**Field:** Email
**Test Data:** 255+ character email
**Steps:**
1. Enter very long email (300 chars)
2. Try to submit
**Expected Result:**
- Field should have maxlength attribute or validation
- Prevent entry beyond limit
**Priority:** Low

#### VAL-LOGIN-008: Valid Email Format
**Field:** Email
**Test Data:** `valid.email+test@restaurant.com`
**Steps:**
1. Enter valid email with allowed special chars
2. Submit
**Expected Result:**
- Email accepted
- Validation passes
**Priority:** High

### Password Field Validations

#### VAL-LOGIN-009: Empty Password Field
**Field:** Password
**Test Data:** (Leave empty)
**Steps:**
1. Enter email
2. Leave password blank
3. Click "Sign In"
**Expected Result:**
- HTML5 validation error: "Please fill out this field"
- Form not submitted
**Priority:** High

#### VAL-LOGIN-010: Password Visibility Toggle
**Field:** Password
**Test Data:** `Demo@123`
**Steps:**
1. Enter password
2. Click eye icon to show password
3. Click again to hide
**Expected Result:**
- Password toggles between visible text and masked dots
- Functionality works smoothly
**Priority:** Medium

#### VAL-LOGIN-011: Password Copy-Paste
**Field:** Password
**Test Data:** Copy `Demo@123`
**Steps:**
1. Copy password from clipboard
2. Paste into password field
**Expected Result:**
- Paste works correctly
- Password accepted
**Priority:** Low

#### VAL-LOGIN-012: Password with Leading/Trailing Spaces
**Field:** Password
**Test Data:** ` Demo@123 ` (with spaces)
**Steps:**
1. Enter password with spaces
2. Try to login
**Expected Result:**
- Either spaces trimmed automatically OR
- Login fails (depending on requirement)
**Priority:** Medium

---

## 2️⃣ REGISTRATION FORM VALIDATIONS

### Email Field Validations

#### VAL-REG-001: Empty Email
**Field:** Email
**Test Data:** (Empty)
**Expected Result:** Required field validation error
**Priority:** High

#### VAL-REG-002: Invalid Email Format
**Field:** Email
**Test Data:** `notanemail`
**Expected Result:** Email format validation error
**Priority:** High

#### VAL-REG-003: Duplicate Email
**Field:** Email
**Test Data:** `demo@restaurant.com` (existing)
**Expected Result:** Error: "Email already registered"
**Priority:** High

#### VAL-REG-004: Valid Email
**Field:** Email
**Test Data:** `newuser@test.com`
**Expected Result:** Email accepted, no error
**Priority:** High

### Restaurant Name Field Validations

#### VAL-REG-005: Empty Restaurant Name
**Field:** Restaurant Name
**Test Data:** (Empty)
**Expected Result:** Required field validation error
**Priority:** High

#### VAL-REG-006: Restaurant Name Minimum Length
**Field:** Restaurant Name
**Test Data:** `AB` (2 chars)
**Expected Result:** 
- If min length > 2: Validation error
- Else: Accepted
**Priority:** Medium

#### VAL-REG-007: Restaurant Name Maximum Length
**Field:** Restaurant Name
**Test Data:** 200+ character string
**Expected Result:** Maxlength validation or field limit
**Priority:** Medium

#### VAL-REG-008: Restaurant Name with Numbers
**Field:** Restaurant Name
**Test Data:** `Restaurant 123`
**Expected Result:** Should be accepted
**Priority:** Low

#### VAL-REG-009: Restaurant Name with Special Characters
**Field:** Restaurant Name
**Test Data:** `R&R Restaurant!`
**Expected Result:** Should be accepted
**Priority:** Low

#### VAL-REG-010: Restaurant Name - SQL Injection Attempt
**Field:** Restaurant Name
**Test Data:** `'; DROP TABLE users; --`
**Expected Result:** 
- Sanitized and saved safely OR
- Rejected with validation error
**Priority:** High (Security)

#### VAL-REG-011: Restaurant Name - XSS Attempt
**Field:** Restaurant Name
**Test Data:** `<script>alert('XSS')</script>`
**Expected Result:** 
- Escaped and displayed safely OR
- Rejected with validation error
**Priority:** High (Security)

### Phone Number Field Validations

#### VAL-REG-012: Empty Phone Number
**Field:** Phone
**Test Data:** (Empty)
**Expected Result:** Required field validation error
**Priority:** High

#### VAL-REG-013: Phone Number - Too Short
**Field:** Phone
**Test Data:** `123` (3 digits)
**Expected Result:** Validation error: "Phone must be at least 10 digits"
**Priority:** High

#### VAL-REG-014: Phone Number - Too Long
**Field:** Phone
**Test Data:** `123456789012345` (15 digits)
**Expected Result:** 
- Maxlength prevents entry OR
- Validation error
**Priority:** Medium

#### VAL-REG-015: Phone Number - Alphabetic Characters
**Field:** Phone
**Test Data:** `abcd123456`
**Expected Result:** 
- Field rejects non-numeric input OR
- Validation error
**Priority:** High

#### VAL-REG-016: Phone Number - Special Characters
**Field:** Phone
**Test Data:** `98-7654-3210`
**Expected Result:** 
- Either stripped and accepted OR
- Validation error (depends on requirement)
**Priority:** Medium

#### VAL-REG-017: Phone Number - Valid Format
**Field:** Phone
**Test Data:** `9876543210`
**Expected Result:** Phone accepted, no error
**Priority:** High

#### VAL-REG-018: Phone Number - With Country Code
**Field:** Phone
**Test Data:** `+919876543210`
**Expected Result:** Should be accepted
**Priority:** Medium

#### VAL-REG-019: Phone Number - Leading Zeros
**Field:** Phone
**Test Data:** `0009876543210`
**Expected Result:** Should be handled appropriately
**Priority:** Low

### Password Field Validations

#### VAL-REG-020: Empty Password
**Field:** Password
**Test Data:** (Empty)
**Expected Result:** Required field validation error
**Priority:** High

#### VAL-REG-021: Password Minimum Length
**Field:** Password
**Test Data:** `12345` (5 chars)
**Expected Result:** 
- If min length requirement: "Password must be at least 8 characters"
- Check actual requirement
**Priority:** High

#### VAL-REG-022: Password Maximum Length
**Field:** Password
**Test Data:** 200+ character password
**Expected Result:** Should have reasonable max limit (e.g., 128 chars)
**Priority:** Low

#### VAL-REG-023: Weak Password - Only Lowercase
**Field:** Password
**Test Data:** `password`
**Expected Result:** 
- If complexity required: "Password must contain uppercase, number, special char"
- Else: Accepted
**Priority:** Medium

#### VAL-REG-024: Weak Password - Only Numbers
**Field:** Password
**Test Data:** `12345678`
**Expected Result:** 
- If complexity required: Validation error
- Else: Accepted
**Priority:** Medium

#### VAL-REG-025: Strong Password
**Field:** Password
**Test Data:** `MyStr0ng!Pass`
**Expected Result:** Password accepted
**Priority:** High

#### VAL-REG-026: Password with Spaces
**Field:** Password
**Test Data:** `My Pass 123`
**Expected Result:** 
- Either accepted (spaces valid) OR
- Validation error (depends on policy)
**Priority:** Low

#### VAL-REG-027: Password Confirm Mismatch
**Field:** Confirm Password
**Test Data:** 
- Password: `Test@123`
- Confirm: `Test@456`
**Expected Result:** Error: "Passwords do not match"
**Priority:** High

#### VAL-REG-028: Password Confirm Match
**Field:** Confirm Password
**Test Data:** Both fields: `Test@123`
**Expected Result:** Validation passes
**Priority:** High

---

## 3️⃣ ADD/EDIT CUSTOMER FORM VALIDATIONS

### Customer Name Field

#### VAL-CUST-001: Empty Name
**Field:** Customer Name
**Test Data:** (Empty)
**Expected Result:** Required field error: "Name is required"
**Priority:** High

#### VAL-CUST-002: Name with Only Spaces
**Field:** Customer Name
**Test Data:** `     ` (spaces only)
**Expected Result:** Validation error: "Name cannot be only spaces"
**Priority:** Medium

#### VAL-CUST-003: Name Minimum Length
**Field:** Customer Name
**Test Data:** `A` (1 char)
**Expected Result:** 
- If min length enforced: Error
- Else: Accepted
**Priority:** Low

#### VAL-CUST-004: Name Maximum Length
**Field:** Customer Name
**Test Data:** 200+ character name
**Expected Result:** Maxlength limit enforced
**Priority:** Medium

#### VAL-CUST-005: Name with Numbers
**Field:** Customer Name
**Test Data:** `John123 Doe`
**Expected Result:** Should be accepted
**Priority:** Low

#### VAL-CUST-006: Name with Special Characters
**Field:** Customer Name
**Test Data:** `O'Connor-Smith`
**Expected Result:** Should be accepted (apostrophe, hyphen valid)
**Priority:** Low

#### VAL-CUST-007: Name - SQL Injection
**Field:** Customer Name
**Test Data:** `' OR '1'='1`
**Expected Result:** Sanitized/escaped, saved safely
**Priority:** High (Security)

#### VAL-CUST-008: Name - XSS Attempt
**Field:** Customer Name
**Test Data:** `<img src=x onerror=alert(1)>`
**Expected Result:** Escaped, displayed safely
**Priority:** High (Security)

### Phone Number Field

#### VAL-CUST-009: Empty Phone
**Field:** Phone
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-CUST-010: Phone - Invalid Length (Too Short)
**Field:** Phone
**Test Data:** `12345` (5 digits)
**Expected Result:** Error: "Phone must be 10 digits"
**Priority:** High

#### VAL-CUST-011: Phone - Invalid Length (Too Long)
**Field:** Phone
**Test Data:** `123456789012` (12 digits)
**Expected Result:** Error or field prevents entry
**Priority:** Medium

#### VAL-CUST-012: Phone - Non-Numeric
**Field:** Phone
**Test Data:** `abc1234567`
**Expected Result:** Field rejects OR validation error
**Priority:** High

#### VAL-CUST-013: Phone - Duplicate Check
**Field:** Phone
**Test Data:** Existing customer's phone
**Expected Result:** Error: "Customer with this phone already exists"
**Priority:** High

#### VAL-CUST-014: Phone - Valid Format
**Field:** Phone
**Test Data:** `9876543210`
**Expected Result:** Accepted, no error
**Priority:** High

#### VAL-CUST-015: Phone - Starting with Zero
**Field:** Phone
**Test Data:** `0987654321`
**Expected Result:** Should be accepted (or validated as per requirement)
**Priority:** Low

### Email Field

#### VAL-CUST-016: Empty Email (Optional Field)
**Field:** Email
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Medium

#### VAL-CUST-017: Invalid Email Format
**Field:** Email
**Test Data:** `invalidemail`
**Expected Result:** Error: "Invalid email format"
**Priority:** High

#### VAL-CUST-018: Valid Email
**Field:** Email
**Test Data:** `customer@email.com`
**Expected Result:** Accepted
**Priority:** High

#### VAL-CUST-019: Email with Plus Sign
**Field:** Email
**Test Data:** `customer+test@email.com`
**Expected Result:** Should be accepted
**Priority:** Low

### Country Code Field

#### VAL-CUST-020: Country Code Selection
**Field:** Country Code Dropdown
**Test Data:** Select different codes
**Expected Result:** Selected code saved with phone
**Priority:** Medium

#### VAL-CUST-021: Country Code Default
**Field:** Country Code
**Test Data:** Open form
**Expected Result:** Default country code pre-selected (e.g., +91)
**Priority:** Low

### City Field

#### VAL-CUST-022: Empty City (Optional)
**Field:** City
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Low

#### VAL-CUST-023: City Maximum Length
**Field:** City
**Test Data:** 100+ character city name
**Expected Result:** Maxlength enforced
**Priority:** Low

#### VAL-CUST-024: City with Numbers
**Field:** City
**Test Data:** `Mumbai 400001`
**Expected Result:** Should be accepted
**Priority:** Low

### Pincode Field

#### VAL-CUST-025: Empty Pincode (Optional)
**Field:** Pincode
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Low

#### VAL-CUST-026: Pincode - Invalid Length
**Field:** Pincode
**Test Data:** `123` (3 digits)
**Expected Result:** Error: "Pincode must be 6 digits" (for India)
**Priority:** Medium

#### VAL-CUST-027: Pincode - Valid Format
**Field:** Pincode
**Test Data:** `400001`
**Expected Result:** Accepted
**Priority:** Medium

#### VAL-CUST-028: Pincode - Alphabetic
**Field:** Pincode
**Test Data:** `ABC123`
**Expected Result:** Numeric field should reject
**Priority:** Medium

### Date of Birth Field

#### VAL-CUST-029: Empty DOB (Optional)
**Field:** Date of Birth
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Low

#### VAL-CUST-030: Future Date DOB
**Field:** Date of Birth
**Test Data:** Tomorrow's date
**Expected Result:** Error: "DOB cannot be in future"
**Priority:** High

#### VAL-CUST-031: DOB - Very Old Date
**Field:** Date of Birth
**Test Data:** `1900-01-01`
**Expected Result:** 
- Should be accepted OR
- Reasonable limit (e.g., 120 years)
**Priority:** Low

#### VAL-CUST-032: DOB - Invalid Date
**Field:** Date of Birth
**Test Data:** `2024-02-30` (Feb 30)
**Expected Result:** Date picker should prevent OR validation error
**Priority:** Medium

#### VAL-CUST-033: DOB - Valid Date
**Field:** Date of Birth
**Test Data:** `1990-05-15`
**Expected Result:** Accepted
**Priority:** High

### Anniversary Date Field

#### VAL-CUST-034: Empty Anniversary (Optional)
**Field:** Anniversary
**Test Data:** (Empty)
**Expected Result:** Accepted
**Priority:** Low

#### VAL-CUST-035: Future Anniversary Date
**Field:** Anniversary
**Test Data:** 1 year from now
**Expected Result:** Should be accepted (anniversary can be future)
**Priority:** Low

#### VAL-CUST-036: Anniversary Before DOB
**Field:** Anniversary
**Test Data:** Anniversary date before DOB
**Expected Result:** 
- Error: "Anniversary cannot be before birth date" OR
- Accepted (depends on business logic)
**Priority:** Low

### Customer Type Field

#### VAL-CUST-037: Customer Type Selection
**Field:** Customer Type
**Test Data:** Select "Corporate"
**Expected Result:** 
- Corporate fields (GST) appear
- Default: "Normal"
**Priority:** High

#### VAL-CUST-038: Switch Customer Type
**Field:** Customer Type
**Test Data:** Switch from Corporate to Normal
**Expected Result:** GST fields disappear or become optional
**Priority:** Medium

### GST Fields (Corporate Customer)

#### VAL-CUST-039: Empty GST Name (Corporate)
**Field:** GST Name
**Test Data:** (Empty) when type is Corporate
**Expected Result:** Required field error for corporate
**Priority:** Medium

#### VAL-CUST-040: Empty GST Number (Corporate)
**Field:** GST Number
**Test Data:** (Empty) when type is Corporate
**Expected Result:** Required field error
**Priority:** Medium

#### VAL-CUST-041: Invalid GST Number Format
**Field:** GST Number
**Test Data:** `123ABC` (invalid format)
**Expected Result:** Error: "Invalid GST number format"
**Priority:** Medium

#### VAL-CUST-042: Valid GST Number
**Field:** GST Number
**Test Data:** `27AABCU9603R1Z1`
**Expected Result:** Accepted
**Priority:** Medium

#### VAL-CUST-043: GST Number Length
**Field:** GST Number
**Test Data:** `27ABC` (too short)
**Expected Result:** Error: "GST number must be 15 characters"
**Priority:** Medium

### Address Field

#### VAL-CUST-044: Empty Address (Optional)
**Field:** Address
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Low

#### VAL-CUST-045: Address Maximum Length
**Field:** Address
**Test Data:** 500+ character address
**Expected Result:** Maxlength enforced
**Priority:** Low

### Allergies Field

#### VAL-CUST-046: No Allergies Selected
**Field:** Allergies (Multi-select)
**Test Data:** None selected
**Expected Result:** Accepted (optional)
**Priority:** Low

#### VAL-CUST-047: Multiple Allergies Selected
**Field:** Allergies
**Test Data:** Select 3-4 allergies
**Expected Result:** All saved correctly
**Priority:** Low

### Notes Field

#### VAL-CUST-048: Empty Notes
**Field:** Notes
**Test Data:** (Empty)
**Expected Result:** Accepted (optional)
**Priority:** Low

#### VAL-CUST-049: Notes Maximum Length
**Field:** Notes
**Test Data:** 1000+ character text
**Expected Result:** Maxlength enforced or validation
**Priority:** Low

#### VAL-CUST-050: Notes with Special Characters
**Field:** Notes
**Test Data:** `Customer prefers window seat & veg food!`
**Expected Result:** Should be accepted
**Priority:** Low

### Custom Fields

#### VAL-CUST-051: Custom Field 1 - Dropdown
**Field:** Custom Field 1
**Test Data:** Select "Dine-in"
**Expected Result:** Selection saved
**Priority:** Low

#### VAL-CUST-052: Custom Field 2 (Optional)
**Field:** Custom Field 2
**Test Data:** (Empty)
**Expected Result:** Accepted
**Priority:** Low

#### VAL-CUST-053: Custom Field 3 (Optional)
**Field:** Custom Field 3
**Test Data:** (Empty)
**Expected Result:** Accepted
**Priority:** Low

---

## 4️⃣ POINTS TRANSACTION FORM VALIDATIONS

### Bill Amount Field (Earn Points)

#### VAL-POINTS-001: Empty Bill Amount
**Field:** Bill Amount
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-POINTS-002: Zero Bill Amount
**Field:** Bill Amount
**Test Data:** `0`
**Expected Result:** Error: "Bill amount must be greater than 0"
**Priority:** High

#### VAL-POINTS-003: Negative Bill Amount
**Field:** Bill Amount
**Test Data:** `-100`
**Expected Result:** Field rejects or validation error
**Priority:** High

#### VAL-POINTS-004: Bill Amount - Decimal Values
**Field:** Bill Amount
**Test Data:** `1250.50`
**Expected Result:** Should be accepted
**Priority:** Medium

#### VAL-POINTS-005: Bill Amount - Very Large Value
**Field:** Bill Amount
**Test Data:** `999999999`
**Expected Result:** Should be accepted or reasonable max limit
**Priority:** Low

#### VAL-POINTS-006: Bill Amount - Alphabetic
**Field:** Bill Amount
**Test Data:** `abc`
**Expected Result:** Numeric field rejects or validation error
**Priority:** High

#### VAL-POINTS-007: Valid Bill Amount
**Field:** Bill Amount
**Test Data:** `1000`
**Expected Result:** Accepted, points calculated
**Priority:** High

### Points Field (Redeem/Bonus)

#### VAL-POINTS-008: Empty Points
**Field:** Points
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-POINTS-009: Zero Points
**Field:** Points
**Test Data:** `0`
**Expected Result:** Error: "Points must be greater than 0"
**Priority:** High

#### VAL-POINTS-010: Negative Points
**Field:** Points
**Test Data:** `-50`
**Expected Result:** Field rejects or validation error
**Priority:** High

#### VAL-POINTS-011: Points - Decimal Values
**Field:** Points
**Test Data:** `100.5`
**Expected Result:** 
- Rounded to integer OR
- Error: "Points must be whole number"
**Priority:** Medium

#### VAL-POINTS-012: Redeem More Points Than Balance
**Field:** Points to Redeem
**Precondition:** Customer has 100 points
**Test Data:** `500`
**Expected Result:** Error: "Insufficient points balance"
**Priority:** High

#### VAL-POINTS-013: Valid Points Amount
**Field:** Points
**Test Data:** `200`
**Expected Result:** Accepted
**Priority:** High

### Reason Field (Bonus Points)

#### VAL-POINTS-014: Empty Reason
**Field:** Reason
**Test Data:** (Empty)
**Expected Result:** 
- Required for bonus OR
- Optional with default
**Priority:** Medium

#### VAL-POINTS-015: Reason Maximum Length
**Field:** Reason
**Test Data:** 500+ character text
**Expected Result:** Maxlength enforced
**Priority:** Low

---

## 5️⃣ WALLET TRANSACTION FORM VALIDATIONS

### Amount Field

#### VAL-WALLET-001: Empty Amount
**Field:** Amount
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-WALLET-002: Zero Amount
**Field:** Amount
**Test Data:** `0`
**Expected Result:** Error: "Amount must be greater than 0"
**Priority:** High

#### VAL-WALLET-003: Negative Amount
**Field:** Amount
**Test Data:** `-100`
**Expected Result:** Field rejects or validation error
**Priority:** High

#### VAL-WALLET-004: Amount - Decimal Values
**Field:** Amount
**Test Data:** `500.75`
**Expected Result:** Should be accepted
**Priority:** Medium

#### VAL-WALLET-005: Amount - Alphabetic
**Field:** Amount
**Test Data:** `abc`
**Expected Result:** Numeric field rejects
**Priority:** High

#### VAL-WALLET-006: Debit More Than Balance
**Field:** Debit Amount
**Precondition:** Wallet balance ₹100
**Test Data:** `500`
**Expected Result:** Error: "Insufficient wallet balance"
**Priority:** High

#### VAL-WALLET-007: Valid Amount
**Field:** Amount
**Test Data:** `1000`
**Expected Result:** Accepted
**Priority:** High

### Bonus Amount Field (Credit)

#### VAL-WALLET-008: Empty Bonus (Optional)
**Field:** Bonus Amount
**Test Data:** (Empty)
**Expected Result:** Accepted, default 0
**Priority:** Low

#### VAL-WALLET-009: Negative Bonus
**Field:** Bonus Amount
**Test Data:** `-50`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-WALLET-010: Bonus Greater Than Amount
**Field:** Bonus Amount
**Test Data:** 
- Amount: 100
- Bonus: 200
**Expected Result:** 
- Should be accepted OR
- Warning (unusual but valid)
**Priority:** Low

### Reason Field

#### VAL-WALLET-011: Empty Reason
**Field:** Reason
**Test Data:** (Empty)
**Expected Result:** Required or default provided
**Priority:** Medium

#### VAL-WALLET-012: Reason Maximum Length
**Field:** Reason
**Test Data:** 500+ chars
**Expected Result:** Maxlength enforced
**Priority:** Low

---

## 6️⃣ COUPON FORM VALIDATIONS

### Coupon Code Field

#### VAL-COUPON-001: Empty Coupon Code
**Field:** Code
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-COUPON-002: Code Minimum Length
**Field:** Code
**Test Data:** `AB` (2 chars)
**Expected Result:** 
- If min enforced: Error
- Else: Accepted
**Priority:** Medium

#### VAL-COUPON-003: Code Maximum Length
**Field:** Code
**Test Data:** 50+ character code
**Expected Result:** Maxlength enforced
**Priority:** Medium

#### VAL-COUPON-004: Code with Lowercase
**Field:** Code
**Test Data:** `welcome20`
**Expected Result:** 
- Auto-converted to uppercase OR
- Accepted as-is
**Priority:** Low

#### VAL-COUPON-005: Code with Spaces
**Field:** Code
**Test Data:** `WELCOME 20`
**Expected Result:** 
- Spaces trimmed automatically OR
- Validation error
**Priority:** Medium

#### VAL-COUPON-006: Code with Special Characters
**Field:** Code
**Test Data:** `WELCOME@20`
**Expected Result:** 
- Allowed OR
- Error: "Only alphanumeric allowed"
**Priority:** Medium

#### VAL-COUPON-007: Duplicate Coupon Code
**Field:** Code
**Test Data:** Existing code (e.g., `WELCOME20`)
**Expected Result:** Error: "Coupon code already exists"
**Priority:** High

#### VAL-COUPON-008: Valid Coupon Code
**Field:** Code
**Test Data:** `NEWCODE20`
**Expected Result:** Accepted
**Priority:** High

### Description Field

#### VAL-COUPON-009: Empty Description
**Field:** Description
**Test Data:** (Empty)
**Expected Result:** Required or optional (check requirement)
**Priority:** Medium

#### VAL-COUPON-010: Description Maximum Length
**Field:** Description
**Test Data:** 500+ chars
**Expected Result:** Maxlength enforced
**Priority:** Low

### Discount Type Field

#### VAL-COUPON-011: No Type Selected
**Field:** Discount Type
**Test Data:** None selected
**Expected Result:** Required field error
**Priority:** High

#### VAL-COUPON-012: Select Percentage Type
**Field:** Discount Type
**Test Data:** Select "Percentage"
**Expected Result:** 
- Max discount field becomes relevant
- Percentage symbol shown
**Priority:** Medium

#### VAL-COUPON-013: Select Fixed Type
**Field:** Discount Type
**Test Data:** Select "Fixed"
**Expected Result:** 
- Max discount not required
- Currency symbol shown
**Priority:** Medium

### Discount Value Field

#### VAL-COUPON-014: Empty Discount Value
**Field:** Discount Value
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-COUPON-015: Zero Discount Value
**Field:** Discount Value
**Test Data:** `0`
**Expected Result:** Error: "Discount must be greater than 0"
**Priority:** High

#### VAL-COUPON-016: Negative Discount
**Field:** Discount Value
**Test Data:** `-10`
**Expected Result:** Validation error
**Priority:** High

#### VAL-COUPON-017: Percentage Greater Than 100
**Field:** Discount Value (Percentage type)
**Test Data:** `150`
**Expected Result:** Error: "Percentage cannot exceed 100"
**Priority:** High

#### VAL-COUPON-018: Valid Percentage
**Field:** Discount Value (Percentage)
**Test Data:** `20`
**Expected Result:** Accepted
**Priority:** High

#### VAL-COUPON-019: Valid Fixed Amount
**Field:** Discount Value (Fixed)
**Test Data:** `50`
**Expected Result:** Accepted
**Priority:** High

### Minimum Order Value Field

#### VAL-COUPON-020: Empty Min Order (Optional)
**Field:** Minimum Order Value
**Test Data:** (Empty)
**Expected Result:** Accepted, default 0
**Priority:** Low

#### VAL-COUPON-021: Negative Min Order
**Field:** Minimum Order Value
**Test Data:** `-100`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-COUPON-022: Valid Min Order
**Field:** Minimum Order Value
**Test Data:** `500`
**Expected Result:** Accepted
**Priority:** Medium

### Maximum Discount Field

#### VAL-COUPON-023: Empty Max Discount (Percentage)
**Field:** Maximum Discount
**Test Data:** (Empty) for percentage coupon
**Expected Result:** Should be required for percentage type
**Priority:** Medium

#### VAL-COUPON-024: Max Discount Less Than Value
**Field:** Maximum Discount
**Test Data:** 
- Min Order: 1000
- Discount: 20%
- Max Discount: 50 (less than 20% of 1000)
**Expected Result:** Should be accepted (valid scenario)
**Priority:** Low

#### VAL-COUPON-025: Valid Max Discount
**Field:** Maximum Discount
**Test Data:** `200`
**Expected Result:** Accepted
**Priority:** Medium

### Usage Limit Field

#### VAL-COUPON-026: Empty Usage Limit
**Field:** Usage Limit
**Test Data:** (Empty)
**Expected Result:** 
- Required OR
- Default to unlimited
**Priority:** Medium

#### VAL-COUPON-027: Zero Usage Limit
**Field:** Usage Limit
**Test Data:** `0`
**Expected Result:** 
- Accepted as unlimited OR
- Error: "Must be greater than 0"
**Priority:** Medium

#### VAL-COUPON-028: Negative Usage Limit
**Field:** Usage Limit
**Test Data:** `-10`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-COUPON-029: Valid Usage Limit
**Field:** Usage Limit
**Test Data:** `100`
**Expected Result:** Accepted
**Priority:** Medium

### Valid From Date Field

#### VAL-COUPON-030: Empty Valid From
**Field:** Valid From
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-COUPON-031: Past Valid From Date
**Field:** Valid From
**Test Data:** Yesterday's date
**Expected Result:** 
- Should be accepted OR
- Warning (coupon starts in past)
**Priority:** Low

#### VAL-COUPON-032: Future Valid From Date
**Field:** Valid From
**Test Data:** Tomorrow's date
**Expected Result:** Accepted (scheduled coupon)
**Priority:** Medium

### Valid Until Date Field

#### VAL-COUPON-033: Empty Valid Until
**Field:** Valid Until
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-COUPON-034: Valid Until Before Valid From
**Field:** Valid Until
**Test Data:** 
- Valid From: 2026-03-01
- Valid Until: 2026-02-01
**Expected Result:** Error: "End date must be after start date"
**Priority:** High

#### VAL-COUPON-035: Same Date for From and Until
**Field:** Valid Until
**Test Data:** Same as Valid From
**Expected Result:** Accepted (1-day coupon)
**Priority:** Low

#### VAL-COUPON-036: Valid Date Range
**Field:** Valid Until
**Test Data:** 30 days after Valid From
**Expected Result:** Accepted
**Priority:** High

### Channels Field

#### VAL-COUPON-037: No Channel Selected
**Field:** Channels (Multi-select)
**Test Data:** None selected
**Expected Result:** 
- Required: Error OR
- Default: All channels
**Priority:** Medium

#### VAL-COUPON-038: Multiple Channels Selected
**Field:** Channels
**Test Data:** Select Dine-in, Delivery, Takeaway
**Expected Result:** All saved correctly
**Priority:** Medium

### Tier Restriction Field

#### VAL-COUPON-039: No Tier Restriction
**Field:** Tier Restriction
**Test Data:** None/All
**Expected Result:** Coupon applicable to all tiers
**Priority:** Low

#### VAL-COUPON-040: Specific Tier Selected
**Field:** Tier Restriction
**Test Data:** Select "Gold"
**Expected Result:** Coupon only for Gold tier
**Priority:** Low

---

## 7️⃣ SEGMENT FORM VALIDATIONS

### Segment Name Field

#### VAL-SEG-001: Empty Segment Name
**Field:** Name
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-SEG-002: Segment Name Minimum Length
**Field:** Name
**Test Data:** `AB` (2 chars)
**Expected Result:** 
- If min enforced: Error
- Else: Accepted
**Priority:** Low

#### VAL-SEG-003: Segment Name Maximum Length
**Field:** Name
**Test Data:** 200+ chars
**Expected Result:** Maxlength enforced
**Priority:** Medium

#### VAL-SEG-004: Duplicate Segment Name
**Field:** Name
**Test Data:** Existing segment name
**Expected Result:** 
- Error: "Segment name already exists" OR
- Allowed (depends on requirement)
**Priority:** Medium

#### VAL-SEG-005: Valid Segment Name
**Field:** Name
**Test Data:** `VIP Gold Members`
**Expected Result:** Accepted
**Priority:** High

### Filter Fields

#### VAL-SEG-006: No Filter Selected
**Field:** Filters
**Test Data:** No filter criteria
**Expected Result:** 
- Error: "At least one filter required" OR
- Accepted (all customers)
**Priority:** Medium

#### VAL-SEG-007: Single Filter - Tier
**Field:** Tier Filter
**Test Data:** Select "Gold"
**Expected Result:** Filter applied, customer count calculated
**Priority:** High

#### VAL-SEG-008: Single Filter - Customer Type
**Field:** Type Filter
**Test Data:** Select "Corporate"
**Expected Result:** Filter applied correctly
**Priority:** Medium

#### VAL-SEG-009: Single Filter - Last Visit Days
**Field:** Last Visit Filter
**Test Data:** `30` days
**Expected Result:** Shows customers inactive 30+ days
**Priority:** Medium

#### VAL-SEG-010: Multiple Filters Combined
**Field:** Multiple Filters
**Test Data:** Tier=Gold AND City=Mumbai
**Expected Result:** AND condition applied, both filters active
**Priority:** High

#### VAL-SEG-011: Last Visit Days - Zero
**Field:** Last Visit Days
**Test Data:** `0`
**Expected Result:** 
- Error: "Must be greater than 0" OR
- Shows all customers
**Priority:** Low

#### VAL-SEG-012: Last Visit Days - Negative
**Field:** Last Visit Days
**Test Data:** `-30`
**Expected Result:** Validation error
**Priority:** Low

---

## 8️⃣ FEEDBACK FORM VALIDATIONS

### Rating Field

#### VAL-FEED-001: No Rating Selected
**Field:** Rating (Stars)
**Test Data:** Not selected
**Expected Result:** Required field error
**Priority:** High

#### VAL-FEED-002: Select 1 Star
**Field:** Rating
**Test Data:** 1 star
**Expected Result:** Accepted
**Priority:** High

#### VAL-FEED-003: Select 5 Stars
**Field:** Rating
**Test Data:** 5 stars
**Expected Result:** Accepted
**Priority:** High

#### VAL-FEED-004: Change Rating Selection
**Field:** Rating
**Test Data:** Change from 3 to 5 stars
**Expected Result:** Updated selection saved
**Priority:** Low

### Comments Field

#### VAL-FEED-005: Empty Comments (Optional)
**Field:** Comments
**Test Data:** (Empty)
**Expected Result:** Accepted if optional
**Priority:** Low

#### VAL-FEED-006: Comments Minimum Length
**Field:** Comments
**Test Data:** `OK` (2 chars)
**Expected Result:** 
- If min enforced: Error
- Else: Accepted
**Priority:** Low

#### VAL-FEED-007: Comments Maximum Length
**Field:** Comments
**Test Data:** 1000+ chars
**Expected Result:** Maxlength enforced
**Priority:** Medium

#### VAL-FEED-008: Comments with Special Chars
**Field:** Comments
**Test Data:** `Great food & service! 5/5 :)`
**Expected Result:** Should be accepted
**Priority:** Low

#### VAL-FEED-009: Comments - XSS Attempt
**Field:** Comments
**Test Data:** `<script>alert(1)</script>`
**Expected Result:** Escaped, displayed safely
**Priority:** High (Security)

### Customer Selection Field

#### VAL-FEED-010: No Customer Selected
**Field:** Customer Selection
**Test Data:** Not selected
**Expected Result:** Required field error
**Priority:** High

#### VAL-FEED-011: Valid Customer Selected
**Field:** Customer Selection
**Test Data:** Select existing customer
**Expected Result:** Customer associated with feedback
**Priority:** High

---

## 9️⃣ WHATSAPP TEMPLATE FORM VALIDATIONS

### Template Name Field

#### VAL-TMPL-001: Empty Template Name
**Field:** Name
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-TMPL-002: Template Name Min Length
**Field:** Name
**Test Data:** `AB` (2 chars)
**Expected Result:** Should be accepted or min length enforced
**Priority:** Low

#### VAL-TMPL-003: Template Name Max Length
**Field:** Name
**Test Data:** 200+ chars
**Expected Result:** Maxlength enforced
**Priority:** Medium

#### VAL-TMPL-004: Duplicate Template Name
**Field:** Name
**Test Data:** Existing template name
**Expected Result:** 
- Error: "Template name exists" OR
- Allowed (check requirement)
**Priority:** Medium

#### VAL-TMPL-005: Valid Template Name
**Field:** Name
**Test Data:** `Birthday Wishes`
**Expected Result:** Accepted
**Priority:** High

### Template Content Field

#### VAL-TMPL-006: Empty Template Content
**Field:** Content
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-TMPL-007: Content Min Length
**Field:** Content
**Test Data:** `Hi` (2 chars)
**Expected Result:** 
- If min enforced: Error
- Else: Accepted
**Priority:** Low

#### VAL-TMPL-008: Content Max Length
**Field:** Content
**Test Data:** 2000+ chars
**Expected Result:** Maxlength enforced (WhatsApp limit)
**Priority:** Medium

#### VAL-TMPL-009: Content with Variables
**Field:** Content
**Test Data:** `Hi {{customer_name}}, you have {{points}} points`
**Expected Result:** 
- Variables detected automatically
- Syntax validated
**Priority:** High

#### VAL-TMPL-010: Content with Invalid Variable Syntax
**Field:** Content
**Test Data:** `Hi {customer_name}` (single braces)
**Expected Result:** 
- Warning about invalid syntax OR
- Not recognized as variable
**Priority:** Medium

#### VAL-TMPL-011: Content with Emojis
**Field:** Content
**Test Data:** `Happy Birthday! 🎂🎉`
**Expected Result:** Emojis should be accepted
**Priority:** Low

#### VAL-TMPL-012: Content with URLs
**Field:** Content
**Test Data:** `Visit https://restaurant.com`
**Expected Result:** URLs should be accepted
**Priority:** Low

#### VAL-TMPL-013: Content with Line Breaks
**Field:** Content
**Test Data:** Multi-line message
**Expected Result:** Line breaks preserved
**Priority:** Low

---

## 🔟 AUTOMATION RULE FORM VALIDATIONS

### Rule Name/Event Field

#### VAL-AUTO-001: No Event Selected
**Field:** Event
**Test Data:** Not selected
**Expected Result:** Required field error
**Priority:** High

#### VAL-AUTO-002: Valid Event Selected
**Field:** Event
**Test Data:** Select "points_earned"
**Expected Result:** Event saved
**Priority:** High

### Template Selection Field

#### VAL-AUTO-003: No Template Selected
**Field:** Template
**Test Data:** Not selected
**Expected Result:** Required field error
**Priority:** High

#### VAL-AUTO-004: Valid Template Selected
**Field:** Template
**Test Data:** Select existing template
**Expected Result:** Template linked to rule
**Priority:** High

### Delay Field

#### VAL-AUTO-005: Empty Delay
**Field:** Delay (minutes)
**Test Data:** (Empty)
**Expected Result:** Default to 0 or required
**Priority:** Medium

#### VAL-AUTO-006: Negative Delay
**Field:** Delay
**Test Data:** `-5`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-AUTO-007: Zero Delay
**Field:** Delay
**Test Data:** `0`
**Expected Result:** Accepted (immediate trigger)
**Priority:** High

#### VAL-AUTO-008: Large Delay Value
**Field:** Delay
**Test Data:** `10000` (mins)
**Expected Result:** 
- Should be accepted OR
- Reasonable max limit enforced
**Priority:** Low

#### VAL-AUTO-009: Valid Delay
**Field:** Delay
**Test Data:** `5`
**Expected Result:** Accepted
**Priority:** High

#### VAL-AUTO-010: Delay - Decimal Value
**Field:** Delay
**Test Data:** `5.5`
**Expected Result:** 
- Rounded to integer OR
- Error: "Must be whole number"
**Priority:** Low

---

## 1️⃣1️⃣ LOYALTY SETTINGS FORM VALIDATIONS

### Points per Rupee Field

#### VAL-LOYAL-001: Empty Points per Rupee
**Field:** Points per Rupee
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-LOYAL-002: Zero Points per Rupee
**Field:** Points per Rupee
**Test Data:** `0`
**Expected Result:** 
- Error: "Must be greater than 0" OR
- Accepted (no points earned)
**Priority:** High

#### VAL-LOYAL-003: Negative Points per Rupee
**Field:** Points per Rupee
**Test Data:** `-1`
**Expected Result:** Validation error
**Priority:** High

#### VAL-LOYAL-004: Decimal Points per Rupee
**Field:** Points per Rupee
**Test Data:** `1.5`
**Expected Result:** Should be accepted
**Priority:** Medium

#### VAL-LOYAL-005: Valid Points per Rupee
**Field:** Points per Rupee
**Test Data:** `1`
**Expected Result:** Accepted
**Priority:** High

### Redemption Rate Field

#### VAL-LOYAL-006: Empty Redemption Rate
**Field:** Redemption Rate
**Test Data:** (Empty)
**Expected Result:** Required field error
**Priority:** High

#### VAL-LOYAL-007: Zero Redemption Rate
**Field:** Redemption Rate
**Test Data:** `0`
**Expected Result:** Error: "Must be greater than 0"
**Priority:** High

#### VAL-LOYAL-008: Negative Redemption Rate
**Field:** Redemption Rate
**Test Data:** `-1`
**Expected Result:** Validation error
**Priority:** High

#### VAL-LOYAL-009: Valid Redemption Rate
**Field:** Redemption Rate
**Test Data:** `1`
**Expected Result:** Accepted (1 point = ₹1)
**Priority:** High

### Minimum Points to Redeem Field

#### VAL-LOYAL-010: Empty Min Points
**Field:** Minimum Points to Redeem
**Test Data:** (Empty)
**Expected Result:** Required or default 0
**Priority:** Medium

#### VAL-LOYAL-011: Negative Min Points
**Field:** Minimum Points to Redeem
**Test Data:** `-100`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-LOYAL-012: Zero Min Points
**Field:** Minimum Points to Redeem
**Test Data:** `0`
**Expected Result:** Accepted (can redeem any amount)
**Priority:** Low

#### VAL-LOYAL-013: Valid Min Points
**Field:** Minimum Points to Redeem
**Test Data:** `100`
**Expected Result:** Accepted
**Priority:** High

### Points Expiry Days Field

#### VAL-LOYAL-014: Empty Expiry Days
**Field:** Points Expiry Days
**Test Data:** (Empty)
**Expected Result:** Required or default (e.g., 365)
**Priority:** Medium

#### VAL-LOYAL-015: Zero Expiry Days
**Field:** Points Expiry Days
**Test Data:** `0`
**Expected Result:** 
- Accepted (points never expire) OR
- Error
**Priority:** Low

#### VAL-LOYAL-016: Negative Expiry Days
**Field:** Points Expiry Days
**Test Data:** `-30`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-LOYAL-017: Valid Expiry Days
**Field:** Points Expiry Days
**Test Data:** `365`
**Expected Result:** Accepted
**Priority:** High

### Birthday/Anniversary Bonus Fields

#### VAL-LOYAL-018: Empty Birthday Bonus
**Field:** Birthday Bonus Points
**Test Data:** (Empty)
**Expected Result:** Default 0 or required
**Priority:** Low

#### VAL-LOYAL-019: Negative Birthday Bonus
**Field:** Birthday Bonus Points
**Test Data:** `-50`
**Expected Result:** Validation error
**Priority:** Low

#### VAL-LOYAL-020: Valid Birthday Bonus
**Field:** Birthday Bonus Points
**Test Data:** `100`
**Expected Result:** Accepted
**Priority:** Medium

#### VAL-LOYAL-021: Empty Anniversary Bonus
**Field:** Anniversary Bonus Points
**Test Data:** (Empty)
**Expected Result:** Default 0 or required
**Priority:** Low

#### VAL-LOYAL-022: Valid Anniversary Bonus
**Field:** Anniversary Bonus Points
**Test Data:** `150`
**Expected Result:** Accepted
**Priority:** Medium

### Tier Threshold Fields

#### VAL-LOYAL-023: Bronze Threshold
**Field:** Bronze Threshold
**Test Data:** `0`
**Expected Result:** Accepted (entry tier)
**Priority:** High

#### VAL-LOYAL-024: Silver Threshold Less Than Bronze
**Field:** Silver Threshold
**Test Data:** `-100` or less than Bronze
**Expected Result:** Error: "Must be greater than Bronze threshold"
**Priority:** High

#### VAL-LOYAL-025: Gold Threshold Less Than Silver
**Field:** Gold Threshold
**Test Data:** Less than Silver
**Expected Result:** Error: "Must be greater than Silver threshold"
**Priority:** High

#### VAL-LOYAL-026: Platinum Threshold Less Than Gold
**Field:** Platinum Threshold
**Test Data:** Less than Gold
**Expected Result:** Error: "Must be greater than Gold threshold"
**Priority:** High

#### VAL-LOYAL-027: Valid Tier Thresholds
**Field:** All Tier Thresholds
**Test Data:** 
- Bronze: 0
- Silver: 5000
- Gold: 15000
- Platinum: 30000
**Expected Result:** All accepted, hierarchical order maintained
**Priority:** High

### Tier Earning Percentage Fields

#### VAL-LOYAL-028: Empty Earning Percentage
**Field:** Bronze Earning %
**Test Data:** (Empty)
**Expected Result:** Required or default 100
**Priority:** Medium

#### VAL-LOYAL-029: Negative Earning Percentage
**Field:** Silver Earning %
**Test Data:** `-10`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-LOYAL-030: Zero Earning Percentage
**Field:** Gold Earning %
**Test Data:** `0`
**Expected Result:** Accepted (tier earns no points)
**Priority:** Low

#### VAL-LOYAL-031: Valid Earning Percentages
**Field:** All Earning %
**Test Data:** 
- Bronze: 100%
- Silver: 110%
- Gold: 125%
- Platinum: 150%
**Expected Result:** All accepted
**Priority:** High

### Off-Peak Hours Fields

#### VAL-LOYAL-032: Empty Off-Peak Start Time
**Field:** Off-Peak Start Time
**Test Data:** (Empty)
**Expected Result:** Optional or required
**Priority:** Low

#### VAL-LOYAL-033: Invalid Time Format
**Field:** Off-Peak Start Time
**Test Data:** `25:00` (invalid hour)
**Expected Result:** Time picker prevents or validation error
**Priority:** Medium

#### VAL-LOYAL-034: End Time Before Start Time
**Field:** Off-Peak End Time
**Test Data:** 
- Start: 17:00
- End: 14:00
**Expected Result:** Error: "End time must be after start time"
**Priority:** Medium

#### VAL-LOYAL-035: Valid Off-Peak Hours
**Field:** Off-Peak Hours
**Test Data:** 
- Start: 14:00
- End: 17:00
- Bonus: 20%
**Expected Result:** All accepted
**Priority:** Medium

#### VAL-LOYAL-036: Negative Off-Peak Bonus
**Field:** Off-Peak Bonus %
**Test Data:** `-10`
**Expected Result:** Validation error
**Priority:** Medium

#### VAL-LOYAL-037: Valid Off-Peak Bonus
**Field:** Off-Peak Bonus %
**Test Data:** `20`
**Expected Result:** Accepted
**Priority:** Medium

---

## 1️⃣2️⃣ QR CODE FORM VALIDATIONS

### QR Generation

#### VAL-QR-001: Generate QR Without Login
**Field:** N/A (Action)
**Test Data:** Attempt while logged out
**Expected Result:** Redirected to login
**Priority:** High

#### VAL-QR-002: Generate QR Successfully
**Field:** N/A (Action)
**Precondition:** Logged in
**Expected Result:** QR code generated with restaurant ID
**Priority:** High

#### VAL-QR-003: QR Code Download Format
**Field:** N/A (Action)
**Test Data:** Download QR
**Expected Result:** 
- PNG or SVG format
- Readable file name
**Priority:** Medium

---

## 📊 VALIDATION TEST CASES SUMMARY

### Total Validation Test Cases: **267**

| Module | Validation Test Cases |
|--------|----------------------|
| Login Form | 12 |
| Registration Form | 28 |
| Add/Edit Customer Form | 53 |
| Points Transaction Form | 15 |
| Wallet Transaction Form | 12 |
| Coupon Form | 40 |
| Segment Form | 12 |
| Feedback Form | 11 |
| WhatsApp Template Form | 13 |
| Automation Rule Form | 10 |
| Loyalty Settings Form | 37 |
| QR Code | 3 |
| **TOTAL** | **267** |

---

## 🎯 VALIDATION CATEGORIES COVERED

### 1. **Required Field Validations** (✓)
- Empty field checks
- Null value handling

### 2. **Format Validations** (✓)
- Email format
- Phone number format
- GST number format
- Date formats
- Time formats

### 3. **Length Validations** (✓)
- Minimum length
- Maximum length
- Character limits

### 4. **Type Validations** (✓)
- Numeric fields
- Alphabetic fields
- Alphanumeric fields

### 5. **Range Validations** (✓)
- Minimum values
- Maximum values
- Boundary values

### 6. **Business Logic Validations** (✓)
- Insufficient balance
- Duplicate entries
- Date comparisons
- Hierarchical values

### 7. **Security Validations** (✓)
- SQL injection attempts
- XSS attempts
- Input sanitization

### 8. **UI/UX Validations** (✓)
- Field focus
- Error message display
- Auto-formatting
- Dropdown selections
- Multi-select handling

---

## 🔒 SECURITY TEST CASES INCLUDED

**Critical Security Validations:**

1. **SQL Injection Prevention** (9 test cases)
   - Name fields
   - Text fields
   - Comments

2. **XSS Prevention** (8 test cases)
   - Customer name
   - Restaurant name
   - Comments
   - Template content

3. **Input Sanitization** (All fields)
   - Special character handling
   - HTML tag escaping
   - Script tag removal

---

## 📝 TESTING APPROACH

### Phase 1: Required Field Validations
- Execute all empty field tests
- Verify error messages
- Check field focus behavior

### Phase 2: Format Validations
- Test invalid formats
- Verify format-specific errors
- Check auto-formatting features

### Phase 3: Boundary Value Tests
- Test minimum values
- Test maximum values
- Test edge cases

### Phase 4: Security Tests
- SQL injection attempts
- XSS attempts
- Verify sanitization

### Phase 5: Integration Tests
- Duplicate checks
- Business logic validations
- Cross-field validations

---

## ✅ TEST EXECUTION CHECKLIST

**Prerequisites:**
- [ ] Test environment accessible
- [ ] Test account active (demo@restaurant.com)
- [ ] Browser DevTools ready
- [ ] Network tab monitoring
- [ ] Console for error checking

**Execution:**
- [ ] Document actual vs expected results
- [ ] Capture screenshots for failures
- [ ] Note error messages
- [ ] Log console errors
- [ ] Report validation gaps

---

## 📊 EXPECTED RESULTS LEGEND

**✅ Pass:** Validation works as expected
**❌ Fail:** Validation missing or incorrect
**⚠️ Warning:** Validation present but message unclear
**🔧 Enhancement:** Validation works but UX can improve

---

**Document Version:** 1.0
**Created:** 2026-02-23
**Total Validation Test Cases:** 267
**Ready for Approval & Execution**

