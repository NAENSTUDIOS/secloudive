import { Shield, ExternalLink, Info, CheckCircle2 } from 'lucide-react'

export default function CopyrightDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="copyright-disclaimer-compact">
        <Info size={14} className="text-cyan" />
        <span>
          <strong>Educational Fair-Use Notice:</strong> All product names, logos, brands, and registered trademarks belong to their respective owners (AWS®, Amazon.com, Inc., CIS®, MITRE®, etc.). SeCloudive is an independent non-commercial educational training platform.
        </span>
      </div>
    )
  }

  return (
    <section className="copyright-disclaimer-panel">
      <div className="disclaimer-header">
        <div className="disclaimer-icon">
          <Shield size={20} />
        </div>
        <div>
          <div className="eyebrow">LEGAL COMPLIANCE /// INTELLECTUAL PROPERTY & FAIR USE</div>
          <h3>Trademark Attribution & Educational Fair-Use Declaration</h3>
        </div>
      </div>

      <div className="disclaimer-body">
        <p>
          SeCloudive is an independent, non-commercial educational career development platform designed exclusively to simulate defensive cloud security incident investigations, architecture reviews, and operational engineering workflows.
        </p>

        <div className="disclaimer-grid">
          <div className="disclaimer-card">
            <h4><CheckCircle2 size={15} /> Respective Rights & Trademark Attribution</h4>
            <p>
              <strong>Amazon Web Services, AWS</strong>, the AWS logo, AWS CloudTrail, Amazon S3, AWS IAM, Amazon GuardDuty, AWS Bedrock, AWS KMS, and other AWS service names are registered trademarks of <strong>Amazon.com, Inc.</strong> or its affiliates.
            </p>
            <p>
              References to <strong>TryHackMe®</strong> (TryHackMe Ltd), <strong>HackTheBox®</strong> (Hack The Box Ltd), <strong>CIS Benchmarks®</strong> (Center for Internet Security), and <strong>MITRE ATT&CK®</strong> (The MITRE Corporation) are used strictly for educational comparison, methodology referencing, and curriculum alignment.
            </p>
          </div>

          <div className="disclaimer-card">
            <h4><CheckCircle2 size={15} /> Educational Fair-Use Doctrine (17 U.S.C. § 107)</h4>
            <p>
              All scenario simulations, forensic logs, incident tickets, Terraform blueprints, and runbooks provided on this platform are 100% original educational simulations created to teach defensive security judgment, root cause analysis, and risk remediation.
            </p>
            <p>
              SeCloudive is <strong>not affiliated with, associated with, authorized by, sponsored by, or endorsed by</strong> Amazon Web Services, Inc., TryHackMe Ltd, HackTheBox Ltd, or any other trademark holder.
            </p>
          </div>
        </div>

        <div className="disclaimer-footer">
          <span>All rights, titles, and intellectual property in third-party trademarks belong exclusively to their respective owners.</span>
          <span className="disclaimer-badge">100% Educational • Non-Commercial</span>
        </div>
      </div>
    </section>
  )
}
