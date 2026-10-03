"""
SeCLOUDIVE Python Backend Supabase Integration Module
Architecture: NAEN Studios / SeCLOUDIVE Engineering
Zero external dependencies (uses standard library urllib & json).
"""

import os
import json
import time
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

SUPABASE_URL = (
    os.getenv("SUPABASE_URL") or
    os.getenv("VITE_SUPABASE_URL") or
    os.getenv("NEXT_PUBLIC_SUPABASE_URL") or
    "https://wcthjlnbkwkhvxrcuwfx.supabase.co"
).rstrip("/")

SUPABASE_SERVICE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY") or
    os.getenv("SUPABASE_KEY") or
    os.getenv("SUPABASE_ANON_KEY") or
    os.getenv("VITE_SUPABASE_ANON_KEY") or
    ""
)

def _execute_request(
    endpoint: str,
    method: str = "GET",
    body: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    url = f"{SUPABASE_URL}/rest/v1/{endpoint.lstrip('/')}"
    req_headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
        "User-Agent": "SeCLOUDIVE-AgentEngine/3.0"
    }
    if headers:
        req_headers.update(headers)

    data_bytes = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data_bytes, headers=req_headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            status_code = response.getcode()
            raw_data = response.read().decode("utf-8")
            parsed = json.loads(raw_data) if raw_data else {}
            return {"ok": True, "status": status_code, "data": parsed, "error": None}
    except urllib.error.HTTPError as e:
        raw_error = e.read().decode("utf-8")
        try:
            err_json = json.loads(raw_error)
        except Exception:
            err_json = {"raw": raw_error}
        return {"ok": False, "status": e.code, "data": None, "error": err_json}
    except Exception as e:
        return {"ok": False, "status": 500, "data": None, "error": str(e)}

def check_supabase_health() -> Dict[str, Any]:
    """Tests connectivity and latency to Supabase PostgreSQL REST layer."""
    t0 = time.time()
    res = _execute_request("user_profiles?select=count", method="GET", headers={"Prefer": "count=exact"})
    latency_ms = round((time.time() - t0) * 1000, 2)
    return {
        "configured": bool(SUPABASE_URL and SUPABASE_SERVICE_KEY),
        "url": SUPABASE_URL,
        "ok": res["ok"],
        "status": res["status"],
        "latency_ms": latency_ms,
        "error": res["error"]
    }

def log_audit_event(
    action: str,
    user_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
) -> Dict[str, Any]:
    """Appends an event to the public.audit_logs table."""
    body = {
        "action": action,
        "metadata": metadata or {},
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    if user_id:
        body["user_id"] = user_id
    if ip_address:
        body["ip_address"] = ip_address
    return _execute_request("audit_logs", method="POST", body=body)

def log_interview_session(
    user_id: str,
    job_role: str,
    questions: List[Dict[str, Any]],
    transcript: List[Dict[str, Any]],
    overall_score: int,
    passed: bool
) -> Dict[str, Any]:
    """Records a completed mock interview to public.interview_sessions."""
    body = {
        "user_id": user_id,
        "job_role": job_role,
        "questions": questions,
        "transcript": transcript,
        "overall_score": overall_score,
        "passed": passed,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    return _execute_request("interview_sessions", method="POST", body=body)

def get_user_progress(user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves learner progress blob from public.user_progress."""
    res = _execute_request(f"user_progress?user_id=eq.{user_id}&select=*")
    if res["ok"] and isinstance(res["data"], list) and len(res["data"]) > 0:
        return res["data"][0]
    return None
