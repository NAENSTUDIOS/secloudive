import os
import sys
import unittest

os.environ["JWT_SECRET"] = "test-only-secret-with-at-least-32-characters"
sys.path.insert(0, os.path.dirname(__file__))

from auth import (  # noqa: E402
    authenticate_user,
    create_jwt_token,
    hash_password,
    register_user,
    verify_jwt_token,
    verify_password,
)


class AuthRegressionTests(unittest.TestCase):
    def test_passwords_use_salted_pbkdf2_and_verify(self):
        first = hash_password("correct horse battery staple")
        second = hash_password("correct horse battery staple")

        self.assertTrue(first.startswith("pbkdf2_sha256$"))
        self.assertNotEqual(first, second)
        self.assertTrue(verify_password("correct horse battery staple", first))
        self.assertFalse(verify_password("wrong password", first))

    def test_registration_and_login_use_hashed_password(self):
        user = register_user("learner@example.com", "safe-password")
        self.assertNotEqual(user["email"], "")
        self.assertEqual(authenticate_user("LEARNER@example.com", "safe-password")["email"], "learner@example.com")
        self.assertIsNone(authenticate_user("learner@example.com", "wrong-password"))

    def test_jwt_round_trip(self):
        token = create_jwt_token({"userId": "SEC-TEST-001"})
        self.assertEqual(verify_jwt_token(token)["userId"], "SEC-TEST-001")


if __name__ == "__main__":
    unittest.main()
