#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
from pathlib import Path

class NGOAPITester:
    def __init__(self, base_url="https://greatworks-staging.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.auth_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}
        
        # Add auth token if required and available
        if auth_required and self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart
                    if 'Content-Type' in headers:
                        del headers['Content-Type']
                    response = requests.post(url, data=data, files=files, headers=headers, timeout=10)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n=== Testing Basic Endpoints ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test settings
        self.run_test("Get Settings", "GET", "settings", 200)
        
        # Test analytics summary
        self.run_test("Analytics Summary", "GET", "analytics/summary", 200)

    def test_content_endpoints(self):
        """Test content management endpoints"""
        print("\n=== Testing Content Endpoints ===")
        
        # Test posts
        self.run_test("List Posts", "GET", "posts", 200)
        self.run_test("List Published Posts", "GET", "posts?status=published", 200)
        
        # Test programs
        self.run_test("List Programs", "GET", "programs", 200)
        
        # Test media
        self.run_test("List Media", "GET", "media", 200)
        
        # Test pages
        self.run_test("List Pages", "GET", "pages", 200)

    def test_event_endpoints(self):
        """Test event management endpoints"""
        print("\n=== Testing Event Endpoints ===")
        
        # Test events
        self.run_test("List Events", "GET", "events", 200)

    def test_volunteer_endpoints(self):
        """Test volunteer management endpoints"""
        print("\n=== Testing Volunteer Endpoints ===")
        
        # Test volunteers (requires auth)
        self.run_test("List Volunteers", "GET", "volunteers", 200, auth_required=True)

    def test_donation_endpoints(self):
        """Test donation management endpoints"""
        print("\n=== Testing Donation Endpoints ===")
        
        # Test donors (requires auth)
        self.run_test("List Donors", "GET", "donors", 200, auth_required=True)
        
        # Test donations (requires auth)
        self.run_test("List Donations", "GET", "donations", 200, auth_required=True)
        
        # Test goals
        self.run_test("List Goals", "GET", "goals", 200)

    def test_newsletter_endpoints(self):
        """Test newsletter endpoints"""
        print("\n=== Testing Newsletter Endpoints ===")
        
        # Test newsletter list
        self.run_test("List Newsletter", "GET", "newsletter", 200)

    def test_contact_endpoints(self):
        """Test contact endpoints"""
        print("\n=== Testing Contact Endpoints ===")
        
        # Test contact list
        self.run_test("List Contacts", "GET", "contact", 200)

    def test_reports_endpoints(self):
        """Test reports endpoints"""
        print("\n=== Testing Reports Endpoints ===")
        
        # Test annual reports
        self.run_test("List Annual Reports", "GET", "annual-reports", 200)
        
        # Test reports (requires auth)
        self.run_test("List Reports", "GET", "reports", 200, auth_required=True)

    def test_integration_endpoints(self):
        """Test integration endpoints"""
        print("\n=== Testing Integration Endpoints ===")
        
        # Test integrations (requires auth)
        self.run_test("List Integrations", "GET", "integrations", 200, auth_required=True)
        
        # Test webhooks (requires auth)
        self.run_test("List Webhooks", "GET", "webhooks", 200, auth_required=True)

    def test_post_endpoints(self):
        """Test POST endpoints with sample data"""
        print("\n=== Testing POST Endpoints ===")
        
        # Test newsletter signup
        newsletter_data = {"email": f"test_{datetime.now().strftime('%H%M%S')}@example.com"}
        self.run_test("Newsletter Signup", "POST", "newsletter", 200, newsletter_data)
        
        # Test contact form
        contact_data = {
            "name": "Test User",
            "email": f"contact_{datetime.now().strftime('%H%M%S')}@example.com",
            "message": "This is a test message",
            "phone": "123-456-7890",
            "topic": "General"
        }
        self.run_test("Contact Form", "POST", "contact", 200, contact_data)
        
        # Test donation
        donation_data = {
            "donor_name": "Test Donor",
            "donor_email": f"donor_{datetime.now().strftime('%H%M%S')}@example.com",
            "amount": 50.0,
            "currency": "USD",
            "recurring": False,
            "frequency": "",
            "campaign": "General"
        }
        self.run_test("Create Donation", "POST", "donations", 200, donation_data)

    def test_volunteer_form(self):
        """Test volunteer application form"""
        print("\n=== Testing Volunteer Form ===")
        
        # Test volunteer application (multipart form)
        url = f"{self.base_url}/api/volunteers"
        volunteer_data = {
            "name": "Test Volunteer",
            "email": f"volunteer_{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "123-456-7890",
            "skills": "Python, Testing, Communication",
            "availability": "Weekends",
            "motivation": "I want to help the community"
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing Volunteer Application...")
        print(f"   URL: {url}")
        
        try:
            response = requests.post(url, data=volunteer_data, timeout=10)
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': "Volunteer Application",
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': "Volunteer Application",
                'error': str(e)
            })

    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n=== Testing Authentication ===")
        
        # Test login with provided credentials
        login_data = {
            "email": "admin@greatworksf.org",
            "password": "pass1234"
        }
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, login_data)
        
        if success and 'token' in response:
            self.auth_token = response['token']
            print(f"   🔑 Auth token obtained: {self.auth_token[:20]}...")
            
            # Test auth/me endpoint
            self.run_test("Get Current User", "GET", "auth/me", 200, auth_required=True)
        else:
            print("   ⚠️  Could not obtain auth token, admin tests will fail")

    def test_admin_crud_operations(self):
        """Test admin CRUD operations"""
        print("\n=== Testing Admin CRUD Operations ===")
        
        if not self.auth_token:
            print("   ⚠️  Skipping admin tests - no auth token")
            return
            
        # Test post creation
        post_data = {
            "title": "Test Blog Post",
            "content": "<p>This is a test blog post with <strong>WYSIWYG</strong> content.</p>",
            "status": "draft",
            "category": "Urban Scholarship",
            "program_type": "Urban Scholarship"
        }
        success, post_response = self.run_test("Create Post", "POST", "posts", 200, post_data, auth_required=True)
        
        if success and 'id' in post_response:
            post_id = post_response['id']
            
            # Test post update
            updated_post_data = {
                "title": "Updated Test Blog Post",
                "content": "<p>This is an updated test blog post.</p>",
                "status": "published",
                "category": "Urban Scholarship",
                "program_type": "Urban Scholarship"
            }
            self.run_test("Update Post", "PUT", f"posts/{post_id}", 200, updated_post_data, auth_required=True)
            
            # Test post deletion
            self.run_test("Delete Post", "DELETE", f"posts/{post_id}", 200, auth_required=True)
        
        # Test page creation
        page_data = {
            "slug": "test-page",
            "title": "Test Page",
            "content": "<p>This is a test page content.</p>",
            "status": "draft"
        }
        success, page_response = self.run_test("Create Page", "POST", "pages", 200, page_data, auth_required=True)
        
        if success and 'id' in page_response:
            page_id = page_response['id']
            
            # Test page update
            updated_page_data = {
                "slug": "updated-test-page",
                "title": "Updated Test Page",
                "content": "<p>This is updated page content.</p>",
                "status": "published"
            }
            self.run_test("Update Page", "PUT", f"pages/{page_id}", 200, updated_page_data, auth_required=True)
            
            # Test page deletion
            self.run_test("Delete Page", "DELETE", f"pages/{page_id}", 200, auth_required=True)
        
        # Test event creation
        event_data = {
            "title": "Test Event",
            "description": "This is a test event description",
            "start_datetime": "2024-12-31T10:00:00",
            "end_datetime": "2024-12-31T12:00:00",
            "location": "Test Location",
            "capacity": 50
        }
        success, event_response = self.run_test("Create Event", "POST", "events", 200, event_data, auth_required=True)
        
        if success and 'id' in event_response:
            event_id = event_response['id']
            
            # Test event update
            updated_event_data = {
                "title": "Updated Test Event",
                "description": "Updated event description",
                "start_datetime": "2024-12-31T14:00:00",
                "end_datetime": "2024-12-31T16:00:00",
                "location": "Updated Location",
                "capacity": 100
            }
            self.run_test("Update Event", "PUT", f"events/{event_id}", 200, updated_event_data, auth_required=True)
            
            # Test event deletion
            self.run_test("Delete Event", "DELETE", f"events/{event_id}", 200, auth_required=True)
        
        # Test goal creation
        goal_data = {
            "title": "Test Goal 2024",
            "target_amount": 10000
        }
        success, goal_response = self.run_test("Create Goal", "POST", "goals", 200, goal_data, auth_required=True)
        
        if success and 'id' in goal_response:
            goal_id = goal_response['id']
            
            # Test goal update
            updated_goal_data = {
                "title": "Updated Test Goal 2024",
                "target_amount": 15000
            }
            self.run_test("Update Goal", "PUT", f"goals/{goal_id}", 200, updated_goal_data, auth_required=True)
            
            # Test goal deletion
            self.run_test("Delete Goal", "DELETE", f"goals/{goal_id}", 200, auth_required=True)

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting NGO API Testing...")
        print(f"Testing against: {self.base_url}")
        
        self.test_basic_endpoints()
        self.test_authentication()  # Test auth first to get token
        self.test_content_endpoints()
        self.test_event_endpoints()
        self.test_volunteer_endpoints()
        self.test_donation_endpoints()
        self.test_newsletter_endpoints()
        self.test_contact_endpoints()
        self.test_reports_endpoints()
        self.test_integration_endpoints()
        self.test_post_endpoints()
        self.test_volunteer_form()
        self.test_admin_crud_operations()  # Test CRUD operations
        
        # Print summary
        print(f"\n📊 Test Results:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                if 'error' in test:
                    print(f"  - {test['name']}: {test['error']}")
                else:
                    print(f"  - {test['name']}: Expected {test.get('expected')}, got {test.get('actual')}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = NGOAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())