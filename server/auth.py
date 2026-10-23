"""
SeCloudive Authentication & Session Security Service
Strictly Backend-Only Implementation.
Handles JWT token issuance, verification, password hashing, and lab session tracking.
"""

import os
import time
import hmac
import hashlib
import json
import base64
import secrets
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

JWT_SECRET = os.getenv("JWT_SECRET", "").strip()
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7 # 7 days
PASSWORD_HASH_ITERATIONS = 310_000

# In-memory user database (backed by production DB or SQLite)
USER_DB: Dict[str, Dict[str, Any]] = {}

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    target_role: Optional[str] = "Cloud Security Engineer"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
    expiresIn: int
    user: Dict[str, Any]

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def is_auth_configured() -> bool:
    return len(JWT_SECRET) >= 32

def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PASSWORD_HASH_ITERATIONS
    )
    return "pbkdf2_sha256${}${}${}".format(
        PASSWORD_HASH_ITERATIONS,
        _base64url_encode(salt),
        _base64url_encode(digest),
    )

def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        algorithm, iterations, salt_b64, digest_b64 = encoded_hash.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        expected = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            _base64url_decode(salt_b64),
            int(iterations),
        )
        return hmac.compare_digest(expected, _base64url_decode(digest_b64))
    except (TypeError, ValueError):
        return False

def require_auth_configuration() -> None:
    if not is_auth_configured():
        raise RuntimeError("JWT_SECRET must be configured with at least 32 characters.")

def create_jwt_token(payload: Dict[str, Any], expiry_seconds: int = TOKEN_EXPIRY_SECONDS) -> str:
    """Creates a signed HMAC-SHA256 JWT token without external heavy dependencies."""
    require_auth_configuration()
    header = {"alg": "HS256", "typ": "JWT"}
    body = {
        **payload,
        "exp": int(time.time()) + expiry_seconds,
        "iat": int(time.time()),
        "iss": "secloudive-intelligence-engine"
    }

    header_b64 = _base64url_encode(json.dumps(header).encode('utf-8'))
    body_b64 = _base64url_encode(json.dumps(body).encode('utf-8'))
    signing_input = f"{header_b64}.{body_b64}".encode('utf-8')

    signature = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = _base64url_encode(signature)

    return f"{header_b64}.{body_b64}.{signature_b64}"

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies a JWT token signature and expiration."""
    if not is_auth_configured():
        return None
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None

        header_b64, body_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{body_b64}".encode('utf-8')

        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(_base64url_decode(body_b64).decode('utf-8'))
        if time.time() > payload.get("exp", 0):
            return None # Expired

        return payload
    except Exception:
        return None

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    user = USER_DB.get(email.strip().lower())
    if not user:
        return None
    if verify_password(password, user["passwordHash"]):
        return {
            "userId": user["userId"],
            "email": user["email"],
            "role": user["role"],
            "tier": user["tier"]
        }
    return None

def register_user(email: str, password: str, target_role: str = "Cloud Security Engineer") -> Dict[str, Any]:
    norm_email = email.strip().lower()
    if norm_email in USER_DB:
        raise ValueError("User with this email already exists.")

    new_user = {
        "userId": f"USR-{int(time.time())}",
        "email": norm_email,
        "passwordHash": hash_password(password),
        "role": target_role,
        "tier": "Tier 1: Cloud Explorer",
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    USER_DB[norm_email] = new_user
    return {
        "userId": new_user["userId"],
        "email": new_user["email"],
        "role": new_user["role"],
        "tier": new_user["tier"]
    }

# Mapping: Google sub -> userId (Strictly enforces exactly ONE User ID per Google account)
GOOGLE_USER_MAP: Dict[str, str] = {}

class GoogleAuthRequest(BaseModel):
    credentialToken: Optional[str] = None
    sub: str
    email: str
    name: Optional[str] = "Cloud Security Learner"
    picture: Optional[str] = None

def authenticate_or_register_google_user(sub: str, email: str, name: str = "", picture: str = "") -> Dict[str, Any]:
    """
    Strict 1-to-1 Google Account to Single User ID Authentication Engine.
    - If Google account already has a User ID, resolves to that exact ID.
    - If email exists in local store, binds Google sub to that single User ID.
    - Otherwise, creates a deterministic single User ID and registers it.
    """
    norm_email = email.strip().lower()
    clean_sub = sub.strip()

    # Case 1: sub already bound
    if clean_sub in GOOGLE_USER_MAP:
        bound_user_id = GOOGLE_USER_MAP[clean_sub]
        for u in USER_DB.values():
            if u.get("userId") == bound_user_id:
                return {
                    "userId": u["userId"],
                    "email": u["email"],
                    "role": u.get("role", "Cloud Security Engineer"),
                    "tier": u.get("tier", "Tier 1: Cloud Explorer"),
                    "authProvider": "google",
                    "syncStatus": "existing_single_user_id"
                }

    # Case 2: email exists
    if norm_email in USER_DB:
        existing = USER_DB[norm_email]
        GOOGLE_USER_MAP[clean_sub] = existing["userId"]
        existing["googleSub"] = clean_sub
        existing["authProvider"] = "google"
        return {
            "userId": existing["userId"],
            "email": existing["email"],
            "role": existing.get("role", "Cloud Security Engineer"),
            "tier": existing.get("tier", "Tier 1: Cloud Explorer"),
            "authProvider": "google",
            "syncStatus": "linked_existing_user_id"
        }

    # Case 3: Provision new deterministic single User ID
    # Hash sub to derive stable code
    hash_code = abs(int(hashlib.md5(clean_sub.encode()).hexdigest()[:6], 16)) % 9000 + 1000
    email_prefix = norm_email.split('@')[0].upper().replace('.', '').replace('-', '')[:8]
    single_user_id = f"SEC-{email_prefix or 'GGL'}-{hash_code}"

    new_user = {
        "userId": single_user_id,
        "email": norm_email,
        "name": name or email_prefix,
        "passwordHash": "", # OAuth user
        "authProvider": "google",
        "googleSub": clean_sub,
        "picture": picture,
        "role": "Cloud Security Engineer",
        "tier": "Tier 1: Cloud Explorer",
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    USER_DB[norm_email] = new_user
    GOOGLE_USER_MAP[clean_sub] = single_user_id

    return {
        "userId": single_user_id,
        "email": norm_email,
        "name": new_user["name"],
        "role": new_user["role"],
        "tier": new_user["tier"],
        "authProvider": "google",
        "syncStatus": "registered_new_single_user_id"
    }
