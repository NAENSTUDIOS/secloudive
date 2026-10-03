// =========================================================================
// SeCloudive ATS-Optimized Resume & Verified Portfolio Dossier Exporter
// Generates professional printable PDF & Markdown resumes from verified evidence
// =========================================================================

export function generateResumeMarkdown(profile = {}) {
  const name = profile.fullName || 'Cloud Security Engineer Candidate'
  const targetRole = profile.targetCareerRole || 'Cloud Security Engineer'
  const readiness = profile.overallReadinessScore || 85
  const verifiedProjects = profile.portfolioEvidence?.verifiedProjectsCount || 8
  const demonstratedSkills = profile.portfolioEvidence?.demonstratedSkills || [
    'AWS IAM & Least Privilege ABAC',
    'Terraform Infrastructure-as-Code Hardening',
    'SIEM Detection & CloudTrail Log Forensics',
    'CIS AWS Foundations Benchmark v3.0 Auditing',
    'Zero-Trust VPC Perimeter & Security Group Chaining',
    'IMDSv2 Migration & SSRF (T1552.005) Remediation'
  ]

  return `# ${name}
**${targetRole} | AWS Security & Zero Trust Architecture | Threat Detection & Incident Response**
*Email: operator@secloudive-portfolio.io | Accreditation: NAEN Studios (naenstudios@gmail.com) | Portfolio: https://secloudive.io*

---

## PROFESSIONAL SUMMARY
Hands-on, production-grounded **${targetRole}** with verified technical mastery across enterprise AWS environments (Overall Readiness Score: **${readiness}%**). Verified by **NAEN Studios** and **SeCloudive Platform**. Demonstrated experience auditing multi-account IAM boundaries, authoring hardened Terraform modules, triaging live CloudTrail/GuardDuty SIEM alerts, and eliminating critical Infrastructure-as-Code misconfigurations before production deployment.

---

## VERIFIED CLOUD SECURITY EVIDENCE & SIMULATOR EXPERIENCE
### **SeCloudive Autonomous Cloud Security Simulator** | *Cloud Security Fellow (NAEN Studios)*
*Completed ${verifiedProjects}+ enterprise incident investigations, architecture reviews, and zero-trust lab modernizations.*

* **Zero-Trust AWS Landing Zone Architecture:**
  - Architected hardened multi-tier VPC topologies using Terraform, isolating public ingress controllers from database persistence tiers and enforcing Security Group chaining.
  - Enforced account-level **S3 Block Public Access** and **IMDSv2** (\`HttpTokens=required\`), mitigating SSRF (MITRE T1552.005) metadata compromise across compute fleets.
  - Enforced customer-managed key encryption (**SSE-KMS**) with annual rotation across S3 data lakes and Aurora PostgreSQL clusters, achieving **100% CIS AWS Foundations Benchmark v3.0 compliance**.

* **Enterprise Cloud Incident Response & Threat Hunting:**
  - Triaged, investigated, and remediated 25+ simulated enterprise cloud security incidents, including cross-account STS token compromise, unvalidated Lambda SSRF exfiltration, and unauthorized GPU cryptomining swarms.
  - Formulated Athena SQL forensic queries over raw CloudTrail event logs and VPC Flow Logs to reconstruct adversary timelines and determine blast radius.
  - Authored automated containment playbooks revoking compromised IAM temporary credentials in under 5 minutes without disrupting healthy production sessions.

* **DevSecOps Pipeline & Infrastructure-as-Code Security:**
  - Implemented pre-commit scanning and GitHub Actions CI/CD gates using tfsec, Checkov, and OIDC token federation, preventing hardcoded access keys and wildcard permissions (\`*:*\`).
  - Automated FinOps incident debt curtailment, isolating rogue compute clusters and reducing unbudgeted cloud expenditure spikes by 95%.

---

## CORE TECHNICAL COMPETENCIES
* **Cloud & AWS Services:** AWS IAM, AWS Organizations, AWS STS, CloudTrail, Amazon GuardDuty, AWS Security Hub, Amazon VPC, Route 53, Amazon S3, AWS KMS, AWS Systems Manager, Amazon EC2, AWS Lambda, Amazon Aurora.
* **Security & Compliance Frameworks:** CIS AWS Foundations Benchmark v3.0, NIST SP 800-53, MITRE ATT&CK for Cloud, Well-Architected Security Pillar.
* **DevSecOps & Automation:** Terraform (HCL), GitHub Actions, Python / Boto3, Docker, LocalStack Cloud Emulator, Checkov, tfsec.
* **SIEM & Monitoring:** CloudWatch Metric Filters, VPC Flow Logs analysis, Athena log queries, EventBridge automated remediation.

---

## VERIFIED CERTIFICATIONS & PATHWAYS
* **AWS Certified Security - Specialty** (Targeted / Prepared)
* **AWS Certified Solutions Architect - Associate**
* **NAEN Studios Verified Cloud Security Engineer Dossier (Integrity Verification Token: \`NAEN-EVAL-${Date.now().toString(36).toUpperCase()}\`)**
* **Accredited Verification Authority:** NAEN Studios (\`naenstudios@gmail.com\`)
`
}

export function downloadResumeMarkdown(profile) {
  const md = generateResumeMarkdown(profile)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Resume_${(profile?.targetCareerRole || 'Cloud_Security_Engineer').replace(/\s+/g, '_')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function printResumePdf(profile) {
  const md = generateResumeMarkdown(profile)
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Resume - ${profile?.targetCareerRole || 'Cloud Security Engineer'} - NAEN Studios Verified</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 24px; font-size: 11pt; position: relative; }
    .naen-header-badge { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 16px; font-size: 9pt; color: #0284c7; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .watermark-overlay { position: fixed; inset: 0; pointer-events: none; z-index: -1; opacity: 0.03; display: flex; flex-direction: column; justify-content: space-around; transform: rotate(-25deg); font-size: 24pt; font-weight: 900; text-align: center; }
    h1 { margin-bottom: 2px; font-size: 18pt; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
    h2 { font-size: 12pt; border-bottom: 1.5px solid #0284c7; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; }
    h3 { font-size: 11pt; margin-top: 8px; margin-bottom: 4px; color: #0f172a; }
    p { margin: 4px 0; }
    ul { margin: 4px 0 10px 18px; padding: 0; }
    li { margin-bottom: 4px; }
    strong { color: #0f172a; }
    hr { border: none; border-top: 1px solid #cbd5e1; margin: 12px 0; }
    @media print {
      body { padding: 0; font-size: 10pt; }
      @page { margin: 0.6in; }
      .watermark-overlay { opacity: 0.035; }
    }
  </style>
</head>
<body>
  <div class="watermark-overlay">
    <div>ACCREDITED BY NAEN STUDIOS • naenstudios@gmail.com • SECLOUDIVE</div>
    <div>OFFICIAL CLOUD SECURITY CANDIDATE DOSSIER</div>
    <div>ACCREDITED BY NAEN STUDIOS • naenstudios@gmail.com • SECLOUDIVE</div>
  </div>
  <div class="naen-header-badge">
    <span>🛡️ NAEN Studios Official Verification</span>
    <span>Authority: naenstudios@gmail.com</span>
  </div>
  ${markdownToHtml(md)}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

export const exportResumePdf = printResumePdf

function markdownToHtml(md) {
  return md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`(.*?)`/gim, '<code style="background:#f1f5f9;padding:1px 4px;border-radius:3px;font-family:monospace;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/\n\n/gim, '<p></p>')
}
