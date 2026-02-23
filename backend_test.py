#!/usr/bin/env python3
"""
DinePoints Loyalty System - Comprehensive Backend API Testing
Tests all API endpoints including the new customer segmentation feature
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import time

class DinePointsAPITester:
    def __init__(self, base_url="https://code-puller-37.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.api_key = "dp_live_AhPCH3O1Pd7wDd3SL4_jl-ISXc2dhm3J2cWizXDFXRM"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_customer_id = None
        self.test_segment_id = None
        self.test_coupon_id = None
        self.test_feedback_id = None

    def log(self, message, status="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {status}: {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_api_key=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if use_api_key:
            test_headers['X-API-Key'] = self.api_key
        elif self.token and not use_api_key:
            test_headers['Authorization'] = f'Bearer {self.token}'
            
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}", "PASS")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", "FAIL")
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}", "ERROR")
                except:
                    self.log(f"   Response: {response.text[:200]}", "ERROR")
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}", "FAIL")
            return False, {}

    def test_health_and_basics(self):
        """Test health check and basic endpoints"""
        self.log("=" * 50)
        self.log("TESTING HEALTH CHECK & BASICS")
        self.log("=" * 50)
        
        # Test health check endpoint (mentioned in review request)
        self.run_test("Health check", "GET", "health", 200)
        
        return True

    def test_authentication(self):
        """Test authentication endpoints"""
        self.log("=" * 50)
        self.log("TESTING AUTHENTICATION & REGISTRATION")
        self.log("=" * 50)
        
        # Test registration (mentioned in review request)
        import random
        test_email = f"testuser{random.randint(1000, 9999)}@restaurant.com"
        registration_data = {
            "email": test_email,
            "password": "test123456",
            "restaurant_name": "Test Restaurant",
            "phone": "9876543210"
        }
        
        success, response = self.run_test(
            "User registration",
            "POST", 
            "auth/register",
            200,
            data=registration_data
        )
        # Test login with existing credentials or the newly created one
        login_success = False
        if success:
            # Try logging in with the newly created account
            success, response = self.run_test(
                "Login with newly registered credentials",
                "POST",
                "auth/login", 
                200,
                data={"email": test_email, "password": "test123456"}
            )
            login_success = success
        
        if not login_success:
            # Try login with provided test credentials from review request
            success, response = self.run_test(
                "Login with test credentials",
                "POST",
                "auth/login",
                200,
                data={"email": "demo@restaurant.com", "password": "Demo@123"}
            )
            login_success = success
        
        if login_success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log(f"✅ Login successful - Token obtained", "SUCCESS")
            
            # Test get current user
            self.run_test("Get current user", "GET", "auth/me", 200)
            return True
        else:
            self.log("❌ Login failed - Cannot proceed with authenticated tests", "CRITICAL")
            return False

    def test_customer_management(self):
        """Test customer CRUD operations"""
        self.log("=" * 50)
        self.log("TESTING CUSTOMER MANAGEMENT")
        self.log("=" * 50)
        
        # Create test customer as specified in review request
        customer_data = {
            "name": "Test Customer",
            "phone": "+1555123456",
            "country_code": "+1",
            "email": "testcustomer@test.com",
            "dob": None,
            "customer_type": "normal",
            "city": "Test City"
        }
        
        # Use unique phone number to avoid conflicts
        import random
        unique_phone = f"+155512{random.randint(1000, 9999)}"
        customer_data["phone"] = unique_phone
        
        # Test POST /api/customers - Create customer
        success, response = self.run_test(
            "Create customer (name: Test Customer, phone: +1555123456)",
            "POST",
            "customers",
            200,
            data=customer_data
        )
        
        if success and 'id' in response:
            self.test_customer_id = response['id']
            self.log(f"✅ Customer created with ID: {self.test_customer_id}", "SUCCESS")
            
            # Test GET /api/customers/{id} - Get customer by ID
            self.run_test(f"Get customer by ID", "GET", f"customers/{self.test_customer_id}", 200)
            
            # Test GET /api/customers - List all customers  
            self.run_test("List all customers", "GET", "customers", 200)
            
            return True
        else:
            self.log("❌ Customer creation failed", "FAIL")
            return False

    def test_customer_segmentation(self):
        """Test the NEW customer segmentation feature (PRIORITY)"""
        self.log("=" * 50)
        self.log("TESTING CUSTOMER SEGMENTATION (NEW FEATURE)")
        self.log("=" * 50)
        
        # Test segment stats
        self.run_test("Get customer segment stats", "GET", "customers/segments/stats", 200)
        
        # Create a test segment
        segment_data = {
            "name": "Test Gold Customers",
            "filters": {
                "tier": "Gold",
                "city": "Mumbai"
            }
        }
        
        success, response = self.run_test(
            "Create customer segment",
            "POST",
            "segments",
            200,  # Backend returns 200, not 201
            data=segment_data
        )
        
        if success and 'id' in response:
            self.test_segment_id = response['id']
            self.log(f"✅ Segment created with ID: {self.test_segment_id}", "SUCCESS")
            
            # Test list segments
            self.run_test("List all segments", "GET", "segments", 200)
            
            # Test get specific segment
            self.run_test(f"Get segment by ID", "GET", f"segments/{self.test_segment_id}", 200)
            
            # Test get segment customers
            self.run_test(f"Get segment customers", "GET", f"segments/{self.test_segment_id}/customers", 200)
            
            # Test update segment
            update_data = {"name": "Updated Test Segment"}
            self.run_test(f"Update segment", "PUT", f"segments/{self.test_segment_id}", 200, data=update_data)
            
            return True
        else:
            self.log("❌ Segment creation failed", "FAIL")
            return False

    def test_points_apis(self):
        """Test points APIs - using actual backend endpoints"""
        self.log("=" * 50)
        self.log("TESTING POINTS APIs")
        self.log("=" * 50)
        
        if not self.test_customer_id:
            self.log("❌ No test customer available for points testing", "SKIP")
            return False
            
        # Test POST /api/points/earn - Earn points based on bill amount (simulating bill_amount: 100)
        success, response = self.run_test(
            "Earn points (bill_amount: 100)",
            "POST",
            f"points/earn?customer_id={self.test_customer_id}&bill_amount=100",
            200
        )
        
        # Test GET /api/points/transactions/{customer_id} - Get points history
        self.run_test(
            f"Get points history",
            "GET", 
            f"points/transactions/{self.test_customer_id}",
            200
        )
        
        return True

    def test_wallet_apis(self):
        """Test wallet APIs as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING WALLET APIs")
        self.log("=" * 50)
        
        if not self.test_customer_id:
            self.log("❌ No test customer available for wallet testing", "SKIP")
            return False
            
        # Test Credit Wallet API - POST /api/wallet/{customer_id}/credit
        credit_data = {
            "amount": 50
        }
        
        success, response = self.run_test(
            "Credit wallet (amount: 50)",
            "POST",
            f"wallet/{self.test_customer_id}/credit",
            200,
            data=credit_data
        )
        
        # Test Get Wallet History API - GET /api/wallet/{customer_id}/history
        self.run_test(
            f"Get wallet history",
            "GET",
            f"wallet/{self.test_customer_id}/history", 
            200
        )
        
        return True

    def test_coupon_management(self):
        """Test coupon CRUD operations as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING COUPON MANAGEMENT")
        self.log("=" * 50)
        
        # Test GET /api/coupons - List coupons
        self.run_test("List all coupons", "GET", "coupons", 200)
        
        # Create test coupon as specified in review request
        start_date = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        coupon_data = {
            "code": "TEST20",
            "discount_type": "percentage", 
            "discount_value": 20,
            "start_date": start_date,
            "end_date": end_date,
            "applicable_channels": ["delivery", "takeaway", "dine_in"],
            "min_order_value": 100
        }
        
        # Test POST /api/coupons - Create coupon
        success, response = self.run_test(
            "Create coupon (code: TEST20, discount_type: percentage, discount_value: 20)",
            "POST",
            "coupons",
            200,
            data=coupon_data
        )
        
        if success and 'id' in response:
            self.test_coupon_id = response['id']
            self.log(f"✅ Coupon created with ID: {self.test_coupon_id}", "SUCCESS")
            return True
        
        return False

    def test_feedback_system(self):
        """Test feedback management"""
        self.log("=" * 50)
        self.log("TESTING FEEDBACK SYSTEM")
        self.log("=" * 50)
        
        # Create feedback
        feedback_data = {
            "customer_id": self.test_customer_id,
            "customer_name": "UI Test Customer",
            "customer_phone": "8888888888",
            "rating": 5,
            "message": "Great service!"
        }
        
        success, response = self.run_test(
            "Create feedback",
            "POST",
            "feedback",
            200,  # Backend returns 200, not 201
            data=feedback_data
        )
        
        if success and 'id' in response:
            self.test_feedback_id = response['id']
            self.log(f"✅ Feedback created with ID: {self.test_feedback_id}", "SUCCESS")
            
            # Test list feedback
            self.run_test("List all feedback", "GET", "feedback", 200)
            
            # Test resolve feedback
            self.run_test(f"Resolve feedback", "POST", f"feedback/{self.test_feedback_id}/resolve", 200)
            
            return True
        
        return False

    def test_analytics_api(self):
        """Test analytics API as specified in review request"""
        self.log("=" * 50)  
        self.log("TESTING ANALYTICS API")
        self.log("=" * 50)
        
        # Test GET /api/analytics/dashboard - Get dashboard stats
        success, stats = self.run_test("Get dashboard stats", "GET", "analytics/dashboard", 200)
        
        if success:
            # Verify stats structure
            required_fields = ['total_customers', 'total_points_issued', 'total_points_redeemed', 'active_customers_30d']
            for field in required_fields:
                if field in stats:
                    self.log(f"✅ {field}: {stats[field]}", "SUCCESS")
                else:
                    self.log(f"❌ Missing field: {field}", "FAIL")
            
            return True
        
        return False

    def test_loyalty_settings_api(self):
        """Test loyalty settings API as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING LOYALTY SETTINGS API")
        self.log("=" * 50)
        
        # Test GET /api/loyalty/settings - Get loyalty settings
        success, settings = self.run_test("Get loyalty settings", "GET", "loyalty/settings", 200)
        return success

    def test_segments_api(self):
        """Test segments API as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING SEGMENTS API")
        self.log("=" * 50)
        
        # Test GET /api/segments - List segments
        self.run_test("List segments", "GET", "segments", 200)
        
        # Create segment as specified in review request
        segment_data = {
            "name": "Test Segment",
            "filters": {}
        }
        
        # Test POST /api/segments - Create segment
        success, response = self.run_test(
            "Create segment (name: Test Segment, filters: {})",
            "POST",
            "segments",
            200,
            data=segment_data
        )
        
        if success and 'id' in response:
            self.test_segment_id = response['id']
            self.log(f"✅ Segment created with ID: {self.test_segment_id}", "SUCCESS")
            return True
        
        return False

    def test_whatsapp_apis(self):
        """Test WhatsApp APIs as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING WHATSAPP APIs")
        self.log("=" * 50)
        
        # Test GET /api/whatsapp/templates - List templates
        self.run_test("List WhatsApp templates", "GET", "whatsapp/templates", 200)
        
        # Test GET /api/whatsapp/automation - List automation rules
        self.run_test("List WhatsApp automation rules", "GET", "whatsapp/automation", 200)
        
        return True

    def test_qr_api(self):
        """Test QR API as specified in review request"""
        self.log("=" * 50)
        self.log("TESTING QR API")
        self.log("=" * 50)
        
        # Test GET /api/qr/generate - Generate QR code
        success, response = self.run_test("Generate QR code", "GET", "qr/generate", 200)
        
        if success:
            if 'qr_code' in response and 'registration_url' in response:
                self.log(f"✅ QR code generated successfully", "SUCCESS")
                self.log(f"   Registration URL: {response['registration_url']}", "INFO")
                return True
            else:
                self.log(f"❌ QR code response missing required fields", "FAIL")
        
        return False

    def cleanup_test_data(self):
        """Clean up test data"""
        self.log("=" * 50)
        self.log("CLEANING UP TEST DATA")
        self.log("=" * 50)
        
        # Delete test segment
        if self.test_segment_id:
            self.run_test(f"Delete test segment", "DELETE", f"segments/{self.test_segment_id}", 200)
        
        # Delete test coupon
        if self.test_coupon_id:
            self.run_test(f"Delete test coupon", "DELETE", f"coupons/{self.test_coupon_id}", 200)
        
        # Delete test customer (this will also delete related transactions)
        if self.test_customer_id:
            self.run_test(f"Delete test customer", "DELETE", f"customers/{self.test_customer_id}", 200)

    def run_all_tests(self):
        """Run all backend API tests"""
        self.log("🚀 Starting DinePoints Backend API Testing")
        self.log(f"📍 Base URL: {self.base_url}")
        
        start_time = time.time()
        
        # Test authentication first
        if not self.test_authentication():
            self.log("❌ Authentication failed - stopping tests", "CRITICAL")
            return False
        
        # Run all test suites
        test_suites = [
            self.test_health_and_basics,  # NEW - Health check from review request
            self.test_authentication,      # Registration + Login from review request
            self.test_analytics_dashboard, # Dashboard stats from review request (moved up for priority)
            self.test_customer_management,
            self.test_customer_segmentation,  # NEW FEATURE - Priority
            self.test_points_and_bonuses,
            self.test_loyalty_settings,
            self.test_coupon_management,
            self.test_feedback_system,
            self.test_qr_code_generation
        ]
        
        for test_suite in test_suites:
            try:
                test_suite()
            except Exception as e:
                self.log(f"❌ Test suite failed: {str(e)}", "ERROR")
        
        # Cleanup
        self.cleanup_test_data()
        
        # Final results
        end_time = time.time()
        duration = end_time - start_time
        
        self.log("=" * 60)
        self.log("🏁 BACKEND API TESTING COMPLETE")
        self.log("=" * 60)
        self.log(f"📊 Tests Run: {self.tests_run}")
        self.log(f"✅ Tests Passed: {self.tests_passed}")
        self.log(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        self.log(f"⏱️  Duration: {duration:.2f} seconds")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = DinePointsAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())