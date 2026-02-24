# MyGenie POS Integration API Documentation

**Base URL:** `https://cmv2-sync.preview.emergentagent.com/api`

**Authentication:** All endpoints require `X-API-Key` header

---

## Authentication

All POS API endpoints require authentication via API Key in the request header:

```
X-API-Key: your_api_key_here
```

**Example API Key:** `dp_live_HsC-SvTGzEeO1WLZcNUfWNnjfZTi7vzQrLDHEKnVLzA`

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
curl -X POST "https://cmv2-sync.preview.emergentagent.com/api/pos/customers" \
  -H "X-API-Key: dp_live_HsC-SvTGzEeO1WLZcNUfWNnjfZTi7vzQrLDHEKnVLzA" \
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

### Error Response - Unauthorized (401)

```json
{
  "detail": "API key required in X-API-Key header"
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
curl -X PUT "https://cmv2-sync.preview.emergentagent.com/api/pos/customers/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: dp_live_HsC-SvTGzEeO1WLZcNUfWNnjfZTi7vzQrLDHEKnVLzA" \
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

### Error Response - Phone Conflict (200 OK)

```json
{
  "success": false,
  "message": "Another customer with this phone already exists",
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
curl -X POST "https://cmv2-sync.preview.emergentagent.com/api/pos/customer-lookup" \
  -H "X-API-Key: dp_live_HsC-SvTGzEeO1WLZcNUfWNnjfZTi7vzQrLDHEKnVLzA" \
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

## Rate Limits

Currently no rate limits are enforced. Please use responsibly.

---

## Notes for Integration

1. **Phone Number Format**: Send phone numbers as 10-digit strings without country code. The country code is sent separately in the `country_code` field.

2. **Customer Uniqueness**: Phone number is the unique identifier for customers within a restaurant. Attempting to create a customer with an existing phone will return the existing customer's ID.

3. **Date Format**: All dates should be in `YYYY-MM-DD` format.

4. **POS Identification**: Always include `pos_id` (your system identifier) and `restaurant_id` (restaurant's ID in your system) for tracking and debugging purposes.

5. **Allergies & Favorites**: These are arrays of strings. Common allergies include: "Gluten", "Dairy", "Eggs", "Peanuts", "Tree Nuts", "Soy", "Fish", "Shellfish", "Sesame", "Mustard".

---

## Contact

For API support or questions, please contact the development team.
