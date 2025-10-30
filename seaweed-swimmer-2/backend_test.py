#!/usr/bin/env python3
"""
Seaweed Swimmer 2 Backend API Test Suite
Tests all leaderboard endpoints according to the review request specifications.
"""

import requests
import json
import time
from typing import Dict, Any

# Test configuration
BASE_URL = "http://localhost:8002"
API_BASE = f"{BASE_URL}/api"

class SW2BackendTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    Details: {details}")
    
    def test_health_check(self):
        """Test 1: Health Check"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            expected = {"message": "Seaweed Swimmer 2 API", "version": "1.0"}
            
            if response.status_code == 200 and response.json() == expected:
                self.log_test("Health Check", True, f"Response: {response.json()}")
            else:
                self.log_test("Health Check", False, 
                            f"Status: {response.status_code}, Response: {response.json()}")
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
    
    def test_username_validation(self):
        """Test 2: Username Validation Tests"""
        test_cases = [
            ("ValidUser", True, "Valid username should be available"),
            ("AB", False, "Too short (2 chars) should fail"),
            ("TooLongUsername1", False, "Too long (16 chars) should fail"),
            ("User@123", False, "Invalid characters should fail"),
            ("User Name", True, "Spaces should be allowed")
        ]
        
        for username, should_pass, description in test_cases:
            try:
                response = requests.get(f"{API_BASE}/leaderboard/check-username", 
                                      params={"username": username}, timeout=10)
                
                if should_pass:
                    # Valid usernames should return 200 with availability info
                    if response.status_code == 200:
                        data = response.json()
                        self.log_test(f"Username Validation: {username}", True, 
                                    f"{description} - Available: {data.get('available')}")
                    else:
                        self.log_test(f"Username Validation: {username}", False,
                                    f"{description} - Expected 200, got {response.status_code}")
                else:
                    # Invalid usernames should return 400
                    if response.status_code == 400:
                        self.log_test(f"Username Validation: {username}", True,
                                    f"{description} - Correctly rejected with 400")
                    else:
                        self.log_test(f"Username Validation: {username}", False,
                                    f"{description} - Expected 400, got {response.status_code}")
                        
            except Exception as e:
                self.log_test(f"Username Validation: {username}", False, 
                            f"{description} - Exception: {str(e)}")
    
    def test_score_submission(self):
        """Test 3: Score Submission Tests"""
        # Clear any existing test data first
        self.clear_test_data()
        
        # Test valid score submission
        try:
            payload = {
                "username": "Player1",
                "score": 100,
                "achievement": "🥇 Gold Swimmer"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("username") == "Player1" and data.get("score") == 100:
                    self.log_test("Score Submission: Initial", True, 
                                f"Player1 score 100 submitted successfully")
                else:
                    self.log_test("Score Submission: Initial", False,
                                f"Unexpected response data: {data}")
            else:
                self.log_test("Score Submission: Initial", False,
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Score Submission: Initial", False, f"Exception: {str(e)}")
        
        # Test higher score update
        try:
            payload = {
                "username": "Player1",
                "score": 200,
                "achievement": "⭐ Deep Sea Explorer"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("score") == 200:
                    self.log_test("Score Submission: Higher Score", True,
                                f"Player1 score updated to 200")
                else:
                    self.log_test("Score Submission: Higher Score", False,
                                f"Score not updated correctly: {data}")
            else:
                self.log_test("Score Submission: Higher Score", False,
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Score Submission: Higher Score", False, f"Exception: {str(e)}")
        
        # Test lower score (should not update)
        try:
            payload = {
                "username": "Player1",
                "score": 50,
                "achievement": "🥉 Bronze Swimmer"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("score") == 200:  # Should remain 200, not 50
                    self.log_test("Score Submission: Lower Score", True,
                                f"Player1 score correctly remained at 200")
                else:
                    self.log_test("Score Submission: Lower Score", False,
                                f"Score incorrectly updated to: {data.get('score')}")
            else:
                self.log_test("Score Submission: Lower Score", False,
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Score Submission: Lower Score", False, f"Exception: {str(e)}")
        
        # Submit different users
        users = [
            ("Player2", 150, "🥇 Gold Swimmer"),
            ("Player3", 300, "🐠 Fish Whisperer"),
            ("Player4", 250, "🐠 Fish Whisperer"),
            ("Player5", 80, "🥈 Silver Swimmer")
        ]
        
        for username, score, achievement in users:
            try:
                payload = {
                    "username": username,
                    "score": score,
                    "achievement": achievement
                }
                response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                       json=payload, timeout=10)
                
                if response.status_code == 200:
                    self.log_test(f"Score Submission: {username}", True,
                                f"{username} score {score} submitted")
                else:
                    self.log_test(f"Score Submission: {username}", False,
                                f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Score Submission: {username}", False, f"Exception: {str(e)}")
    
    def test_leaderboard_retrieval(self):
        """Test 4: Leaderboard Retrieval"""
        try:
            response = requests.get(f"{API_BASE}/leaderboard/global", 
                                  params={"limit": 10}, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if sorted by score DESC
                    scores = [entry.get("score", 0) for entry in data]
                    is_sorted = all(scores[i] >= scores[i+1] for i in range(len(scores)-1))
                    
                    # Check if Player3 (300) is #1
                    top_player = data[0]
                    player3_is_top = (top_player.get("username") == "Player3" and 
                                    top_player.get("score") == 300)
                    
                    # Find Player1 and check score is 200
                    player1_entry = next((entry for entry in data if entry.get("username") == "Player1"), None)
                    player1_correct = player1_entry and player1_entry.get("score") == 200
                    
                    if is_sorted and player3_is_top and player1_correct:
                        self.log_test("Leaderboard Retrieval", True,
                                    f"Correctly sorted, Player3 #1 (300), Player1 has 200")
                    else:
                        self.log_test("Leaderboard Retrieval", False,
                                    f"Sorting: {is_sorted}, Player3 top: {player3_is_top}, Player1 score: {player1_correct}")
                else:
                    self.log_test("Leaderboard Retrieval", False,
                                f"Empty or invalid response: {data}")
            else:
                self.log_test("Leaderboard Retrieval", False,
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Leaderboard Retrieval", False, f"Exception: {str(e)}")
    
    def test_user_rank(self):
        """Test 5: User Rank Tests"""
        # Test existing users
        test_users = ["Player1", "Player3"]
        
        for username in test_users:
            try:
                response = requests.get(f"{API_BASE}/leaderboard/rank/{username}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if "rank" in data and "score" in data:
                        self.log_test(f"User Rank: {username}", True,
                                    f"Rank: {data['rank']}, Score: {data['score']}")
                    else:
                        self.log_test(f"User Rank: {username}", False,
                                    f"Missing rank/score in response: {data}")
                else:
                    self.log_test(f"User Rank: {username}", False,
                                f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"User Rank: {username}", False, f"Exception: {str(e)}")
        
        # Test non-existent user (should 404)
        try:
            response = requests.get(f"{API_BASE}/leaderboard/rank/NonExistentPlayer", timeout=10)
            
            if response.status_code == 404:
                self.log_test("User Rank: Non-existent", True,
                            "Correctly returned 404 for non-existent user")
            else:
                self.log_test("User Rank: Non-existent", False,
                            f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("User Rank: Non-existent", False, f"Exception: {str(e)}")
    
    def test_edge_cases(self):
        """Test 6: Edge Cases"""
        # Test score of 0
        try:
            payload = {
                "username": "ZeroPlayer",
                "score": 0,
                "achievement": "🐟 Novice Swimmer"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Edge Case: Score 0", True, "Score 0 accepted")
            else:
                self.log_test("Edge Case: Score 0", False,
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Edge Case: Score 0", False, f"Exception: {str(e)}")
        
        # Test negative score (should fail with 400)
        try:
            payload = {
                "username": "NegativePlayer",
                "score": -10,
                "achievement": "Invalid"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 422 or response.status_code == 400:
                self.log_test("Edge Case: Negative Score", True,
                            f"Correctly rejected negative score with {response.status_code}")
            else:
                self.log_test("Edge Case: Negative Score", False,
                            f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Edge Case: Negative Score", False, f"Exception: {str(e)}")
        
        # Test empty username (should fail with 400)
        try:
            payload = {
                "username": "",
                "score": 100,
                "achievement": "Invalid"
            }
            response = requests.post(f"{API_BASE}/leaderboard/submit", 
                                   json=payload, timeout=10)
            
            if response.status_code == 422 or response.status_code == 400:
                self.log_test("Edge Case: Empty Username", True,
                            f"Correctly rejected empty username with {response.status_code}")
            else:
                self.log_test("Edge Case: Empty Username", False,
                            f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Edge Case: Empty Username", False, f"Exception: {str(e)}")
    
    def clear_test_data(self):
        """Clear test data from database (optional helper)"""
        # Note: This would require direct database access
        # For now, we'll work with existing data
        pass
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🧪 Starting Seaweed Swimmer 2 Backend API Tests")
        print("=" * 60)
        
        self.test_health_check()
        print()
        
        self.test_username_validation()
        print()
        
        self.test_score_submission()
        print()
        
        self.test_leaderboard_retrieval()
        print()
        
        self.test_user_rank()
        print()
        
        self.test_edge_cases()
        print()
        
        # Summary
        total_tests = len(self.test_results)
        passed_tests = total_tests - len(self.failed_tests)
        
        print("=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = SW2BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {len(tester.failed_tests)} test(s) failed!")