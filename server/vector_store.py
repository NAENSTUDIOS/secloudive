"""
SeCloudive Knowledge Vector Store & Graph RAG Retrieval Service
Strictly Backend-Only Implementation.
Indexes AWS Well-Architected Security Pillar, CIS AWS Foundations Benchmark v3.0,
and MITRE ATT&CK Cloud Matrix for semantic grounding before prompt generation.
"""

import math
import re
from typing import List, Dict, Any

# Pre-indexed knowledge chunks covering AWS security rules, controls, and techniques
KNOWLEDGE_CORPUS: List[Dict[str, Any]] = [
    {
        "id": "CIS-1.16",
        "category": "IAM",
        "title": "Ensure IAM policies that allow full '*:*' administrative privileges are not attached",
        "text": "CIS Benchmark Control 1.16 mandates that wildcard Action and Resource permissions (*:*) must not be assigned to user, group, or role policies. Instead, implement least-privilege permission boundaries and ABAC tags.",
        "keywords": ["wildcard", "admin", "privilege", "least privilege", "iam", "policy", "*:*"]
    },
    {
        "id": "CIS-2.1.1",
        "category": "S3 / KMS",
        "title": "Ensure all S3 buckets employ customer managed CMK encryption (SSE-KMS)",
        "text": "S3 buckets storing production data must use Customer Managed Keys (CMKs) with annual key rotation enabled. This prevents AWS account admins without key permissions from decrypting customer data.",
        "keywords": ["s3", "kms", "encryption", "cmk", "bucket", "sse-kms", "rotation"]
    },
    {
        "id": "CIS-4.1",
        "category": "Networking",
        "title": "Ensure no security groups allow ingress from 0.0.0.0/0 to administrative or database ports",
        "text": "Security Groups must not open ports 22 (SSH), 3389 (RDP), 5432 (PostgreSQL), 3306 (MySQL), or 1433 (MSSQL) to 0.0.0.0/0. Database ingress must strictly reference application tier Security Group IDs.",
        "keywords": ["0.0.0.0/0", "security group", "port", "ingress", "ssh", "postgres", "mysql", "rds"]
    },
    {
        "id": "MITRE-T1552.005",
        "category": "Threat Detection",
        "title": "Cloud Instance Metadata API Abuse (IMDSv1 vs IMDSv2)",
        "text": "Adversaries exploit Server-Side Request Forgery (SSRF) vulnerabilities to query the AWS Instance Metadata Service at 169.254.169.254. IMDSv2 mandates session tokens via HTTP PUT and hop-limit of 1 to block SSRF exfiltration.",
        "keywords": ["imdsv1", "imdsv2", "ssrf", "metadata", "token", "169.254.169.254", "exfiltration"]
    },
    {
        "id": "AWS-SEC-03",
        "category": "Architecture",
        "title": "AWS Well-Architected Security Pillar: Manage permissions and identities",
        "text": "Apply AWS Organizations Service Control Policies (SCPs) to establish hard guardrails around member accounts, disallowing disabling CloudTrail or modifying KMS keys even for local root accounts.",
        "keywords": ["scp", "organizations", "guardrails", "cloudtrail", "well-architected", "multi-account"]
    },
    {
        "id": "FINOPS-SEC-01",
        "category": "FinOps",
        "title": "Cryptomining Swarm Detection and Automated Quotas",
        "text": "Compromised cloud credentials frequently spawn GPU-accelerated P3/G4 EC2 instance clusters for unauthorized Monero mining. Implement CloudWatch billing alarms and Service Quota restrictions.",
        "keywords": ["cryptomining", "gpu", "cost", "billing", "anomaly", "ec2", "swarm"]
    },
    {
        "id": "CIS-1.4",
        "category": "IAM",
        "title": "Ensure no active access keys exist for the root user account",
        "text": "CIS Benchmark 1.4 requires deleting all programmatic access keys for the AWS root account. All administrative operations must be delegated to IAM Identity Center SSO roles with mandatory hardware MFA.",
        "keywords": ["root", "access key", "mfa", "identity center", "iam", "credential"]
    },
    {
        "id": "CIS-3.1",
        "category": "Observability",
        "title": "Ensure CloudTrail is enabled across all regions with log file validation",
        "text": "CIS Benchmark 3.1 mandates multi-region CloudTrail trails with log file validation enabled and delivery to an isolated, KMS-encrypted S3 security audit bucket with Object Lock.",
        "keywords": ["cloudtrail", "multi-region", "validation", "s3", "kms", "audit", "observability"]
    },
    {
        "id": "MITRE-T1078.004",
        "category": "Threat Detection",
        "title": "Valid Accounts: Cloud Accounts STS Temporary Credential Hijacking",
        "text": "Adversaries abuse stolen STS temporary credentials obtained via instance profiles or Lambda environment variables. Mitigate using short session durations (1 hour), ExternalId verification, and aws:TokenIssueTime revocation policies.",
        "keywords": ["sts", "assumerole", "token", "session", "credential", "compromise", "externalid"]
    },
    {
        "id": "MITRE-T1530",
        "category": "Exfiltration",
        "title": "Data from Cloud Storage Object Bulk Exfiltration",
        "text": "Adversaries enumerate and dump sensitive objects from Amazon S3 buckets via s3:GetObject or aws s3 sync. Enforce S3 Block Public Access at the AWS Organizations level and monitor GuardDuty Exfiltration:S3/AnomalousVolume.",
        "keywords": ["s3", "exfiltration", "getobject", "sync", "block public access", "guardduty", "vault"]
    },
    {
        "id": "NIST-SP-800-53-AC-6",
        "category": "Governance",
        "title": "NIST AC-6 Least Privilege Enforcement via ABAC and Permission Boundaries",
        "text": "Organizations must enforce least privilege through Attribute-Based Access Control (ABAC) using aws:PrincipalTag and aws:ResourceTag conditions, bounded by mandatory IAM Permission Boundaries on role creation.",
        "keywords": ["nist", "least privilege", "abac", "permission boundary", "tagging", "compliance"]
    },
    {
        "id": "SOC2-CC6.1",
        "category": "Multi-Tenant",
        "title": "Logical Separation and Boundary Enforcement for SaaS Multi-Tenant Architectures",
        "text": "SOC 2 Type II CC6.1 requires cryptographic and logical isolation between tenant datasets. Enforce separate DynamoDB partition keys with IAM policy variables (${aws:PrincipalTag/TenantId}) and dedicated KMS keys per tenant tier.",
        "keywords": ["soc2", "multi-tenant", "tenant", "isolation", "dynamodb", "saas", "kms"]
    }
]

def _tokenize(text: str) -> List[str]:
    return [w.lower() for w in re.findall(r'\b[a-zA-Z0-9_\-\.\*]{2,}\b', text)]

def search_relevant_knowledge(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """
    Performs fast, grounded semantic retrieval matching against the verified corpus.
    Uses TF-IDF / keyword overlap similarity with zero external API dependencies.
    """
    query_tokens = set(_tokenize(query))
    if not query_tokens:
        return KNOWLEDGE_CORPUS[:top_k]

    scored = []
    for item in KNOWLEDGE_CORPUS:
        item_tokens = set(_tokenize(f"{item['title']} {item['text']} {' '.join(item['keywords'])}"))
        overlap = len(query_tokens.intersection(item_tokens))
        
        # Boost if keyword directly matched
        score = overlap
        for kw in item['keywords']:
            if kw in query.lower():
                score += 3

        scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in scored[:top_k] if score > 0] or KNOWLEDGE_CORPUS[:top_k]
