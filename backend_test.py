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
    def __init__(self, base_url="https://loyalty-dining.preview.emergentagent.com/api"):
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

    def test_authentication(self):
        """Test authentication endpoints"""
        self.log("=" * 50)
        self.log("TESTING AUTHENTICATION")
        self.log("=" * 50)
        
        # Test login with provided credentials
        success, response = self.run_test(
            "Login with test credentials",
            "POST",
            "auth/login",
            200,
            data={"email": "test@restaurant.com", "password": "test123"}
        )
        
        if success and 'access_token' in response:
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
        
        # Create test customer
        today = datetime.now().strftime("%Y-%m-%d")
        customer_data = {
            "name": "UI Test Customer",
            "phone": "8888888888",
            "country_code": "+91",
            "email": "uitest@test.com",
            "dob": today,
            "customer_type": "normal",
            "city": "Mumbai"
        }
        
        # Use unique phone number to avoid conflicts
        import random
        unique_phone = f"888888{random.randint(1000, 9999)}"
        customer_data["phone"] = unique_phone
        
        success, response = self.run_test(
            "Create customer",
            "POST",
            "customers",
            200,  # Backend returns 200, not 201
            data=customer_data
        )
        
        if success and 'id' in response:
            self.test_customer_id = response['id']
            self.log(f"✅ Customer created with ID: {self.test_customer_id}", "SUCCESS")
            
            # Test get customer
            self.run_test(f"Get customer by ID", "GET", f"customers/{self.test_customer_id}", 200)
            
            # Test update customer
            update_data = {"name": "UI Test Customer Updated"}
            self.run_test(f"Update customer", "PUT", f"customers/{self.test_customer_id}", 200, data=update_data)
            
            # Test list customers
            self.run_test("List all customers", "GET", "customers", 200)
            
            # Test customer filters
            self.run_test("Filter by Bronze tier", "GET", "customers?tier=Bronze", 200)
            self.run_test("Search customers", "GET", "customers?search=UI Test", 200)
            
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

    def test_points_and_bonuses(self):
        """Test points transactions and bonus features"""
        self.log("=" * 50)
        self.log("TESTING POINTS & BONUSES")
        self.log("=" * 50)
        
        if not self.test_customer_id:
            self.log("❌ No test customer available for points testing", "SKIP")
            return False
            
        # Test POS webhook with bonuses (first visit + birthday)
        webhook_data = {
            "customer_phone": "8888888888",
            "bill_amount": 1000.00,
            "channel": "dine_in"
        }
        
        success, response = self.run_test(
            "POS webhook - First visit + Birthday bonus",
            "POST",
            "pos/webhook/payment-received",
            200,
            data=webhook_data,
            use_api_key=True
        )
        
        if success:
            points_earned = response.get('points_earned', 0)
            bonuses = response.get('bonus_applied', [])
            self.log(f"✅ Points earned: {points_earned}, Bonuses: {bonuses}", "SUCCESS")
        
        # Test points redemption
        redeem_data = {
            "customer_phone": "8888888888",
            "bill_amount": 1000.00,
            "channel": "dine_in",
            "redeem_points": 100
        }
        
        self.run_test(
            "POS webhook - Points redemption",
            "POST",
            "pos/webhook/payment-received",
            200,
            data=redeem_data,
            use_api_key=True
        )
        
        # Test get customer transactions
        self.run_test(f"Get customer transactions", "GET", f"points/transactions/{self.test_customer_id}", 200)
        
        return True

    def test_loyalty_settings(self):
        """Test loyalty settings and bonus features"""
        self.log("=" * 50)
        self.log("TESTING LOYALTY SETTINGS & BONUS FEATURES")
        self.log("=" * 50)
        
        # Get current settings
        success, settings = self.run_test("Get loyalty settings", "GET", "loyalty/settings", 200)
        
        if success:
            # Test updating bonus features
            update_data = {
                "first_visit_bonus_enabled": True,
                "first_visit_bonus_points": 100,
                "birthday_bonus_enabled": True,
                "birthday_bonus_points": 200,
                "birthday_bonus_days_after": 14,
                "off_peak_bonus_enabled": True,
                "off_peak_start_time": "14:00",
                "off_peak_end_time": "17:00",
                "off_peak_bonus_type": "multiplier",
                "off_peak_bonus_value": 3.0,
                "feedback_bonus_enabled": True,
                "feedback_bonus_points": 50
            }
            
            self.run_test("Update loyalty settings", "PUT", "loyalty/settings", 200, data=update_data)
            
            # Verify settings persisted
            self.run_test("Verify settings updated", "GET", "loyalty/settings", 200)
            
            return True
        
        return False

    def test_coupon_management(self):
        """Test coupon CRUD operations"""
        self.log("=" * 50)
        self.log("TESTING COUPON MANAGEMENT")
        self.log("=" * 50)
        
        # Create test coupon
        start_date = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        coupon_data = {
            "code": "UITEST20",
            "discount_type": "percentage",
            "discount_value": 20,
            "start_date": start_date,
            "end_date": end_date,
            "applicable_channels": ["delivery", "takeaway", "dine_in"],
            "min_order_value": 500
        }
        
        success, response = self.run_test(
            "Create coupon",
            "POST",
            "coupons",
            201,
            data=coupon_data
        )
        
        if success and 'id' in response:
            self.test_coupon_id = response['id']
            self.log(f"✅ Coupon created with ID: {self.test_coupon_id}", "SUCCESS")
            
            # Test list coupons
            self.run_test("List all coupons", "GET", "coupons", 200)
            
            # Test validate coupon
            if self.test_customer_id:
                validate_data = {
                    "code": "UITEST20",
                    "customer_id": self.test_customer_id,
                    "order_value": 1000.0,
                    "channel": "dine_in"
                }
                self.run_test("Validate coupon", "POST", "coupons/validate", 200, data=validate_data)
            
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
            201,
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

    def test_analytics_dashboard(self):
        """Test analytics and dashboard endpoints"""
        self.log("=" * 50)
        self.log("TESTING ANALYTICS DASHBOARD")
        self.log("=" * 50)
        
        # Test dashboard stats
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

    def test_qr_code_generation(self):
        """Test QR code generation"""
        self.log("=" * 50)
        self.log("TESTING QR CODE GENERATION")
        self.log("=" * 50)
        
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
            self.test_customer_management,
            self.test_customer_segmentation,  # NEW FEATURE - Priority
            self.test_points_and_bonuses,
            self.test_loyalty_settings,
            self.test_coupon_management,
            self.test_feedback_system,
            self.test_analytics_dashboard,
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