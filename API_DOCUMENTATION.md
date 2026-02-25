# MyGenie POS Integration API Documentation

**Base URL:** `https://whatsapp-automation-13.preview.emergentagent.com/api`

**Authentication:** All endpoints require `X-API-Key` header

---

## Authentication

All POS API endpoints require authentication via API Key in the request header:

```
X-API-Key: your_api_key_here
```

**Example API Key:** `dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4`

---

## 1. Create Customer

Create a new customer in the loyalty system.

### Endpoint
```
POST /api/pos/customers
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-API-Key` | string | Yes | API key for authentication |
| `Content-Type` | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos_id` | string | **Yes** | POS system identifier (e.g., "mygenie", "petpooja", "ezzo") |
| `restaurant_id` | string | **Yes** | Restaurant ID in the POS system |
| `name` | string | **Yes** | Customer's full name |
| `phone` | string | **Yes** | Phone number (10 digits, without country code) |
| `country_code` | string | No | Country code (default: "+91") |
| `email` | string | No | Email address |
| `dob` | string | No | Date of birth (format: YYYY-MM-DD) |
| `anniversary` | string | No | Anniversary date (format: YYYY-MM-DD) |
| `customer_type` | string | No | "normal" or "corporate" (default: "normal") |
| `gst_name` | string | No | GST registered name |
| `gst_number` | string | No | GST number |
| `address` | string | No | Street address |
| `city` | string | No | City |
| `pincode` | string | No | PIN/ZIP code |
| `allergies` | array | No | List of allergies (e.g., ["Gluten", "Dairy"]) |
| `favorites` | array | No | List of favorite items |
| `custom_field_1` | string | No | Custom field 1 |
| `custom_field_2` | string | No | Custom field 2 |
| `custom_field_3` | string | No | Custom field 3 |
| `notes` | string | No | Additional notes |

### Example Request

```bash
curl -X POST "https://whatsapp-automation-13.preview.emergentagent.com/api/pos/customers" \
  -H "X-API-Key: dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4" \
  -H "Content-Type: application/json" \
  -d '{
    "pos_id": "mygenie",
    "restaurant_id": "rest_12345",
    "name": "John Doe",
    "phone": "9876543210",
    "country_code": "+91",
    "email": "john@example.com",
    "dob": "1990-05-15",
    "customer_type": "normal",
    "city": "Mumbai",
    "allergies": ["Gluten", "Peanuts"],
    "favorites": ["Butter Chicken", "Naan"]
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "phone": "9876543210",
    "created_at": "2025-02-24T12:30:00.000000+00:00"
  }
}
```

### Error Response - Customer Exists (200 OK)

```json
{
  "success": false,
  "message": "Customer with this phone already exists",
  "data": {
    "customer_id": "existing_customer_id",
    "existing": true
  }
}
```

---

## 2. Update Customer

Update an existing customer's information.

### Endpoint
```
PUT /api/pos/customers/{customer_id}
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | **Yes** | The unique customer ID returned from create or lookup |

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-API-Key` | string | Yes | API key for authentication |
| `Content-Type` | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos_id` | string | **Yes** | POS system identifier |
| `restaurant_id` | string | **Yes** | Restaurant ID in the POS system |
| `phone` | string | **Yes** | Phone number (unique identifier) |
| `name` | string | No | Customer's full name |
| `country_code` | string | No | Country code |
| `email` | string | No | Email address |
| `dob` | string | No | Date of birth (format: YYYY-MM-DD) |
| `anniversary` | string | No | Anniversary date (format: YYYY-MM-DD) |
| `customer_type` | string | No | "normal" or "corporate" |
| `gst_name` | string | No | GST registered name |
| `gst_number` | string | No | GST number |
| `address` | string | No | Street address |
| `city` | string | No | City |
| `pincode` | string | No | PIN/ZIP code |
| `allergies` | array | No | List of allergies |
| `favorites` | array | No | List of favorite items |
| `custom_field_1` | string | No | Custom field 1 |
| `custom_field_2` | string | No | Custom field 2 |
| `custom_field_3` | string | No | Custom field 3 |
| `notes` | string | No | Additional notes |

### Example Request

```bash
curl -X PUT "https://whatsapp-automation-13.preview.emergentagent.com/api/pos/customers/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4" \
  -H "Content-Type: application/json" \
  -d '{
    "pos_id": "mygenie",
    "restaurant_id": "rest_12345",
    "phone": "9876543210",
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "city": "Delhi",
    "allergies": ["Gluten", "Peanuts", "Dairy"]
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe Updated",
    "phone": "9876543210",
    "updated_at": "2025-02-24T12:45:00.000000+00:00"
  }
}
```

### Error Response - Customer Not Found (200 OK)

```json
{
  "success": false,
  "message": "Customer not found",
  "data": null
}
```

---

## 3. Customer Lookup

Look up a customer by phone number to get their loyalty information before processing a transaction.

### Endpoint
```
POST /api/pos/customer-lookup
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-API-Key` | string | Yes | API key for authentication |
| `Content-Type` | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | **Yes** | Customer phone number (10 digits) |

### Example Request

```bash
curl -X POST "https://whatsapp-automation-13.preview.emergentagent.com/api/pos/customer-lookup" \
  -H "X-API-Key: dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

### Success Response - Customer Found (200 OK)

```json
{
  "success": true,
  "message": "Customer found",
  "data": {
    "registered": true,
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "phone": "9876543210",
    "tier": "Gold",
    "total_points": 1500,
    "points_value": 375.00,
    "wallet_balance": 250.00,
    "total_visits": 25,
    "total_spent": 15000.00,
    "allergies": ["Gluten", "Peanuts"],
    "favorites": ["Butter Chicken", "Naan"],
    "last_visit": "2025-02-20T18:30:00.000000+00:00"
  }
}
```

### Response - Customer Not Found (200 OK)

```json
{
  "success": false,
  "message": "Customer not found",
  "data": {
    "registered": false
  }
}
```

---

## 4. Max Redeemable Points

Check the maximum loyalty points a customer can redeem for a given bill amount. Use this before checkout to validate redemption.

### Endpoint
```
POST /api/pos/max-redeemable
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-API-Key` | string | Yes | API key for authentication |
| `Content-Type` | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos_id` | string | **Yes** | POS system identifier ("mygenie") |
| `restaurant_id` | string | **Yes** | Restaurant ID in POS system |
| `cust_mobile` | string | **Yes** | Customer phone number (10 digits) |
| `bill_amount` | float | **Yes** | Order bill amount |

### Example Request

```bash
curl -X POST "https://whatsapp-automation-13.preview.emergentagent.com/api/pos/max-redeemable" \
  -H "X-API-Key: dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4" \
  -H "Content-Type: application/json" \
  -d '{
    "pos_id": "mygenie",
    "restaurant_id": "478",
    "cust_mobile": "9876543210",
    "bill_amount": 1000
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Max redeemable calculated",
  "data": {
    "max_points_redeemable": 400,
    "max_discount_value": 100.00
  }
}
```

### Response - Customer Not Found (200 OK)

```json
{
  "success": false,
  "message": "Customer not found",
  "data": {
    "registered": false
  }
}
```

### Response - Below Minimum Points (200 OK)

```json
{
  "success": true,
  "message": "Customer does not have minimum points required for redemption",
  "data": {
    "max_points_redeemable": 0,
    "max_discount_value": 0.0,
    "available_points": 50,
    "min_points_required": 100
  }
}
```

### Calculation Logic

The maximum redeemable points are calculated considering:

1. **Customer's available points** - Cannot redeem more than they have
2. **Minimum points required** - Customer must have at least 100 points (configurable)
3. **Max redemption percent** - Cannot exceed 50% of bill amount (configurable)
4. **Max redemption cap** - Cannot exceed ₹500 absolute cap (configurable)

The API returns the **lowest** of all these limits.

---

## 5. Order Webhook

Webhook endpoint for MyGenie to send order data on every completed order. Automatically calculates and awards loyalty points.

### Endpoint
```
POST /api/pos/orders
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-API-Key` | string | Yes | API key for authentication |
| `Content-Type` | string | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos_id` | string | **Yes** | POS system identifier ("mygenie") |
| `restaurant_id` | string | **Yes** | Restaurant ID in POS system |
| `order_id` | string | **Yes** | Unique order ID from POS |
| `cust_mobile` | string | **Yes** | Customer phone number (10 digits) |
| `cust_name` | string | No | Customer name (required only for new customers) |
| `order_amount` | float | **Yes** | Total order amount |
| `wallet_used` | float | No | Wallet amount used (default: 0) |
| `coupon_code` | string | No | Coupon code applied |
| `coupon_discount` | float | No | Discount from coupon (default: 0) |
| `payment_method` | string | No | Payment method (e.g., "TAB", "CASH", "CARD") |
| `payment_status` | string | **Yes** | Must be "success" to process |
| `order_type` | string | No | Order type: "pos", "dine_in", "takeaway", "delivery" |

### Example Request

```bash
curl -X POST "https://whatsapp-automation-13.preview.emergentagent.com/api/pos/orders" \
  -H "X-API-Key: dp_live_u-AFJd9rSTjej07ENWfbXT3XaK9OuoxdAJ70BWSylb4" \
  -H "Content-Type: application/json" \
  -d '{
    "pos_id": "mygenie",
    "restaurant_id": "478",
    "order_id": "ORD-2025-001234",
    "cust_mobile": "9653078025",
    "cust_name": "Piyush",
    "order_amount": 987.0,
    "wallet_used": 0.0,
    "coupon_code": "",
    "coupon_discount": 0.0,
    "payment_method": "TAB",
    "payment_status": "success",
    "order_type": "pos"
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Order processed successfully",
  "data": {
    "order_id": "e4252338-1f3b-413b-83a6-d90072bb9ecd",
    "pos_order_id": "ORD-2025-001234",
    "customer_id": "f95ce018-89d8-4818-a90d-a541078d10a9",
    "customer_name": "Piyush",
    "is_new_customer": true,
    "order_amount": 987.0,
    "points_earned": 49,
    "total_points": 49,
    "tier": "Bronze",
    "wallet_used": 0.0,
    "wallet_balance_after": 500.0,
    "coupon_applied": "",
    "coupon_discount": 0.0
  }
}
```

### Response - Insufficient Wallet Balance (200 OK)

```json
{
  "success": false,
  "message": "Insufficient wallet balance. Available: 300.0, Requested: 500.0",
  "data": {
    "available_balance": 300.0
  }
}
```

### Response - Duplicate Order (200 OK)

```json
{
  "success": false,
  "message": "Duplicate order - already processed",
  "data": {
    "order_id": "e4252338-1f3b-413b-83a6-d90072bb9ecd",
    "duplicate": true
  }
}
```

### Response - Payment Not Successful (200 OK)

```json
{
  "success": false,
  "message": "Order not processed - payment status: failed",
  "data": null
}
```

---

## Response Schema

All API responses follow this standard format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | `true` if operation succeeded, `false` otherwise |
| `message` | string | Human-readable message describing the result |
| `data` | object/null | Response data (varies by endpoint) |

---

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success (check `success` field for operation result) |
| 401 | Unauthorized - Missing or invalid API key |
| 500 | Internal Server Error |

---

## Points Calculation

Points are calculated automatically based on tier:

| Tier | Points Earned | Threshold |
|------|---------------|-----------|
| Bronze | 5% of order amount | 0 - 499 points |
| Silver | 7% of order amount | 500 - 1,499 points |
| Gold | 10% of order amount | 1,500 - 4,999 points |
| Platinum | 15% of order amount | 5,000+ points |

**Note:** Points are only earned on orders meeting the minimum order value (default: ₹100).

---

## Rate Limits

Currently no rate limits are enforced. Please use responsibly.

---

## Notes for Integration

1. **Phone Number Format**: Send phone numbers as 10-digit strings without country code.

2. **Customer Auto-Creation**: If an order is received for a non-existent customer, the system will auto-create the customer using `cust_mobile` and `cust_name`.

3. **Duplicate Prevention**: Orders with the same `pos_id` + `order_id` combination will be rejected as duplicates.

4. **Payment Status**: Only orders with `payment_status: "success"` will be processed.

5. **Points Calculation**: Points are calculated locally based on `order_amount` and the customer's current tier.

---

## Contact

For API support or questions, please contact the development team.
