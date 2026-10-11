import { useState } from 'react'
import {
  Globe,
  Layers,
  Terminal,
  Copy,
  Check,
  Shield,
  ExternalLink,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

// ─── Multi-Cloud Domain Mapping Matrix (AWS • Azure • Google Cloud) ───────────
const DOMAIN_CROSSWALKS = {
  iam: {
    domainName: 'Identity & Access Management (IAM & Zero-Trust)',
    coreConcept: 'Least Privilege, Temporary Tokens, Workload Identity & Permission Boundaries',
    providers: {
      aws: {
        name: 'Amazon Web Services (AWS)',
        badgeColor: '#ff9900',
        service: 'AWS IAM & AWS IAM Identity Center',
        mechanism: 'IAM Roles with STS AssumeRole, Permission Boundaries, Service Control Policies (SCPs)',
        cli: 'aws sts get-caller-identity',
        bestPractice: 'Enforce temporary credentials via STS AssumeRole with external ID. Never generate permanent access keys for EC2 or EKS; attach IAM Instance Profiles or IRSA.'
      },
      azure: {
        name: 'Microsoft Azure',
        badgeColor: '#0089d6',
        service: 'Microsoft Entra ID (Azure AD) & PIM',
        mechanism: 'Managed Identities (System-assigned / User-assigned), Privileged Identity Management (PIM), Azure RBAC',
        cli: 'az account show --query "{user:user.name, tenantId:tenantId}" -o table',
        bestPractice: 'Use System-Assigned Managed Identities for Azure VMs/Functions. Enforce Just-In-Time (JIT) role elevation with Entra PIM and Conditional Access policies.'
      },
      gcp: {
        name: 'Google Cloud Platform (GCP)',
        badgeColor: '#4285f4',
        service: 'Google Cloud IAM & Workload Identity',
        mechanism: 'Service Accounts, Workload Identity Federation (OIDC/SAML), Organization Policies',
        cli: 'gcloud auth list --filter=status:ACTIVE',
        bestPractice: 'Federate external workloads (GitHub Actions, Kubernetes) via Workload Identity Pools. Avoid downloading service account JSON keys.'
      }
    },
    traps: [
      {
        title: 'Policy Evaluation Differences',
        detail: 'In AWS, an explicit Deny ALWAYS trumps Allow across identity and resource policies. In Azure, role assignments are additive, but explicit Deny Assignments (used by Blueprints/Managed Apps) override Allows. In GCP, permissions union across hierarchy (Org > Folder > Project).'
      },
      {
        title: 'Machine Identity Credentials',
        detail: 'AWS uses Instance Profiles (metadata service token via IMDSv2). Azure uses Managed Identity endpoints (http://169.254.169.254/metadata/identity/oauth2/token). GCP uses Metadata server (http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/). All require SSRF protection headers.'
      }
    ]
  },
  s3: {
    domainName: 'Cloud Object Storage & Data Protection',
    coreConcept: 'Bucket Security, Immutability, Private Endpoints & Customer-Managed Encryption',
    providers: {
      aws: {
        name: 'Amazon Web Services (AWS)',
        badgeColor: '#ff9900',
        service: 'Amazon S3 & AWS KMS',
        mechanism: 'S3 Block Public Access (BPA), Bucket Policies (aws:SecureTransport), KMS CMK, Object Lock',
        cli: 'aws s3api get-public-access-block --bucket <bucket-name>',
        bestPractice: 'Enable S3 Block Public Access at the account level. Deny non-TLS requests with Condition: {"Bool": {"aws:SecureTransport": "false"}}.'
      },
      azure: {
        name: 'Microsoft Azure',
        badgeColor: '#0089d6',
        service: 'Azure Blob Storage & Azure Key Vault',
        mechanism: 'Disable Public Blob Access, Storage Firewall with Virtual Network Rules, Customer-Managed Keys (CMK), Blob Immutability',
        cli: 'az storage account show -n <storage-account> --query "allowBlobPublicAccess"',
        bestPractice: 'Set allowBlobPublicAccess to false on the Storage Account. Restrict network access to specific Azure VNet subnets and Private Endpoints.'
      },
      gcp: {
        name: 'Google Cloud Platform (GCP)',
        badgeColor: '#4285f4',
        service: 'Google Cloud Storage (GCS) & Cloud KMS',
        mechanism: 'Uniform Bucket-Level Access, Public Access Prevention (enforced), Cloud KMS CMEK, Retention Policies',
        cli: 'gcloud storage buckets describe gs://<bucket-name> --format="yaml(publicAccessPrevention,iamConfiguration)"',
        bestPractice: 'Enforce Uniform Bucket-Level Access and Public Access Prevention at the organization folder level. Attach Cloud KMS Customer-Managed Encryption Keys.'
      }
    },
    traps: [
      {
        title: 'Public Access Granularity',
        detail: 'AWS S3 allows individual object ACLs if BPA is not enforced. Azure Blob Storage controls public access at the storage account and container level. GCP enforces bucket-wide IAM with Uniform Bucket-Level Access, disabling object ACLs entirely.'
      }
    ]
  },
  network: {
    domainName: 'Network Perimeter & Traffic Segmentation',
    coreConcept: 'VPC Isolation, Microsegmentation, Egress Filtering & Private Link Services',
    providers: {
      aws: {
        name: 'Amazon Web Services (AWS)',
        badgeColor: '#ff9900',
        service: 'Amazon VPC, Security Groups & Network Firewall',
        mechanism: 'Stateful Security Groups, Stateless Network ACLs (NACLs), AWS Transit Gateway, AWS PrivateLink',
        cli: 'aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values="0.0.0.0/0"',
        bestPractice: 'Never open administrative ports (22, 3389) to 0.0.0.0/0. Use VPC Endpoints (PrivateLink) to access AWS API services without traversing public internet.'
      },
      azure: {
        name: 'Microsoft Azure',
        badgeColor: '#0089d6',
        service: 'Azure Virtual Network (VNet) & Azure Firewall',
        mechanism: 'Network Security Groups (NSGs) with rule priorities, Application Security Groups (ASGs), Azure Private Link',
        cli: 'az network nsg rule list -g <resource-group> --nsg-name <nsg-name> -o table',
        bestPractice: 'Assign explicit priorities (100-4096) to NSG rules. Place subnets behind Azure NAT Gateway or Azure Firewall Premium with IDPS inspection.'
      },
      gcp: {
        name: 'Google Cloud Platform (GCP)',
        badgeColor: '#4285f4',
        service: 'Google Cloud VPC & Cloud Armor',
        mechanism: 'Global VPC, Stateful VPC Firewall Rules with target tags/service accounts, Cloud NAT, Private Service Connect',
        cli: 'gcloud compute firewall-rules list --filter="direction=INGRESS AND allowed.ports=22"',
        bestPractice: 'Apply firewall rules targeting Service Accounts rather than IP addresses or instance tags. Enforce Private Google Access on all subnets.'
      }
    },
    traps: [
      {
        title: 'VPC Scope & Statefulness',
        detail: 'AWS VPCs are strictly regional. GCP VPCs are global resources spanning multiple regions across subnets. AWS Security Groups are stateful (inbound allows corresponding outbound). Azure NSGs are stateful with numeric priority evaluation.'
      }
    ]
  },
  monitoring: {
    domainName: 'Audit Logging & Threat Detection',
    coreConcept: 'Immutable API Audit Trails, SIEM Ingestion & Automated Anomaly Detection',
    providers: {
      aws: {
        name: 'Amazon Web Services (AWS)',
        badgeColor: '#ff9900',
        service: 'AWS CloudTrail, Amazon GuardDuty & Security Hub',
        mechanism: 'Multi-Region Trails, S3 Log File Validation, GuardDuty ML Anomaly Detection, EventBridge Automated Remediation',
        cli: 'aws cloudtrail describe-trails --query "trailList[].{Name:Name,MultiRegion:IsMultiRegionTrail,Validation:LogFileValidationEnabled}"',
        bestPractice: 'Forward all CloudTrail logs to a centralized, dedicated Security Account S3 bucket with Object Lock immutability and KMS CMK encryption.'
      },
      azure: {
        name: 'Microsoft Azure',
        badgeColor: '#0089d6',
        service: 'Azure Monitor, Activity Log & Microsoft Defender for Cloud',
        mechanism: 'Diagnostic Settings streaming to Log Analytics Workspace / Microsoft Sentinel, Defender CSPM and CWPP',
        cli: 'az monitor log-analytics workspace list -o table',
        bestPractice: 'Stream all subscription Activity Logs and resource diagnostic logs to a central Log Analytics Workspace connected to Microsoft Sentinel.'
      },
      gcp: {
        name: 'Google Cloud Platform (GCP)',
        badgeColor: '#4285f4',
        service: 'Google Cloud Audit Logs & Security Command Center (SCC)',
        mechanism: 'Admin Activity & Data Access Logs, Log Sinks streaming to BigQuery/Cloud Storage, SCC Premium Event Threat Detection',
        cli: 'gcloud logging sinks list',
        bestPractice: 'Create an aggregated log sink at the organization root level delivering immutable logs to a locked Cloud Storage bucket or BigQuery analytics dataset.'
      }
    },
    traps: [
      {
        title: 'Data Access Logging Cost & Volume',
        detail: 'In AWS, S3 Data Events are disabled by default due to high volume. In Azure, Storage Read/Write diagnostic logs must be explicitly routed. In GCP, Data Access logs are disabled by default (except BigQuery) to minimize ingestion costs.'
      }
    ]
  },
  architecture: {
    domainName: 'Cloud Architecture & GenAI / LLM Defense',
    coreConcept: 'Defense-in-Depth, Private Network Topologies & Generative AI Model Guardrails',
    providers: {
      aws: {
        name: 'Amazon Web Services (AWS)',
        badgeColor: '#ff9900',
        service: 'Amazon Bedrock, Bedrock Guardrails & KMS CMK',
        mechanism: 'Bedrock PrivateLink interface endpoints, Guardrails (PII filter, prompt injection defense), Model Invocation Audit Logging to CloudWatch/S3',
        cli: 'aws bedrock get-model-invocation-logging-configuration',
        bestPractice: 'Lock model access within private VPC subnets via PrivateLink. Attach Bedrock Guardrails with contextual grounding and PII masking.'
      },
      azure: {
        name: 'Microsoft Azure',
        badgeColor: '#0089d6',
        service: 'Azure OpenAI & Azure AI Content Safety',
        mechanism: 'Private Endpoints, Azure AI Content Safety (Prompt Shields, Groundedness Detection), Customer-Managed Keys (CMK) in Azure Key Vault',
        cli: 'az cognitiveservices account show -n <openai-account> -g <rg>',
        bestPractice: 'Disable public network access on Azure OpenAI resources. Enforce Azure AI Content Safety Prompt Shields against jailbreaking.'
      },
      gcp: {
        name: 'Google Cloud Platform (GCP)',
        badgeColor: '#4285f4',
        service: 'Google Vertex AI & Model Armor',
        mechanism: 'VPC Service Controls (VPC-SC), Vertex AI Model Armor (prompt injection filter, sensitive data masking), CMEK',
        cli: 'gcloud ai models list --region=us-central1',
        bestPractice: 'Enclose Vertex AI resources within a VPC Service Controls perimeter to prevent data exfiltration. Deploy Model Armor inspection templates.'
      }
    },
    traps: [
      {
        title: 'GenAI Vector Database Isolation',
        detail: 'Vector stores (Amazon OpenSearch Serverless, Azure AI Search, GCP Vertex AI Search) contain private embeddings. All three cloud architectures require network encryption in-transit (TLS 1.3), encryption at-rest with CMKs, and network-level PrivateLink/VPC-SC restrictions.'
      }
    ]
  }
}

export default function TopicMultiCloudCrosswalk({ topic, pathId = 'iam' }) {
  const [copiedId, setCopiedId] = useState(null)

  // Determine active crosswalk domain
  let activeDomainKey = 'iam'
  const pLower = (pathId || '').toLowerCase()
  const tLower = ((topic?.id || '') + ' ' + (topic?.title || '')).toLowerCase()

  if (pLower.includes('s3') || tLower.includes('storage') || tLower.includes('bucket') || tLower.includes('kms')) {
    activeDomainKey = 's3'
  } else if (pLower.includes('network') || tLower.includes('vpc') || tLower.includes('firewall') || tLower.includes('perimeter')) {
    activeDomainKey = 'network'
  } else if (pLower.includes('monitor') || pLower.includes('incident') || tLower.includes('trail') || tLower.includes('guardduty') || tLower.includes('log')) {
    activeDomainKey = 'monitoring'
  } else if (pLower.includes('architecture') || tLower.includes('bedrock') || tLower.includes('ai') || tLower.includes('llm') || tLower.includes('tenant')) {
    activeDomainKey = 'architecture'
  }

  const crosswalk = DOMAIN_CROSSWALKS[activeDomainKey] || DOMAIN_CROSSWALKS.iam

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="multi-cloud-crosswalk-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          flexShrink: 0
        }}>
          <Globe size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8' }}>
              Multi-Cloud Architectural Crosswalk
            </span>
            <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
              AWS • Azure • Google Cloud Equivalence
            </span>
          </div>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
            {crosswalk.domainName}
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
            Core Principle: <strong style={{ color: '#cbd5e1' }}>{crosswalk.coreConcept}</strong>. In modern enterprise environments, cloud security engineers frequently secure hybrid or multi-cloud infrastructures.
          </p>
        </div>
      </div>

      {/* 3-Column Provider Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '16px'
      }}>
        {Object.entries(crosswalk.providers).map(([pKey, pData]) => (
          <div
            key={pKey}
            style={{
              background: '#091322',
              border: `1px solid ${pData.badgeColor}33`,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative'
            }}
          >
            {/* Top Provider Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: pData.badgeColor,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pData.badgeColor, display: 'inline-block' }} />
                {pData.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: "'DM Mono', monospace" }}>
                {pKey.toUpperCase()}
              </span>
            </div>

            {/* Service & Mechanism */}
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                {pData.service}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                {pData.mechanism}
              </div>
            </div>

            {/* Verification CLI Command */}
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: "'DM Mono', monospace" }}>
                  VERIFY CLI SYNTAX
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pData.cli, `${pKey}-cli`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '5px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: copiedId === `${pKey}-cli` ? '#4ade80' : '#94a3b8',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === `${pKey}-cli` ? (
                    <>
                      <Check size={11} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={11} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: '10px 12px',
                background: '#040914',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.76rem',
                color: '#38bdf8',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {pData.cli}
              </pre>
            </div>

            {/* Best Practice Callout */}
            <div style={{
              padding: '10px 12px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '8px',
              borderLeft: `3px solid ${pData.badgeColor}`,
              fontSize: '0.78rem',
              color: '#cbd5e1',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: pData.badgeColor }}>Security Standard: </strong>
              {pData.bestPractice}
            </div>
          </div>
        ))}
      </div>

      {/* Architectural Traps & Gotchas */}
      {crosswalk.traps && crosswalk.traps.length > 0 && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
            <AlertTriangle size={16} />
            <span>Cross-Cloud Architectural Traps & Gotchas</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {crosswalk.traps.map((trap, idx) => (
              <div key={idx} style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.6' }}>
                <strong style={{ color: '#f8fafc' }}>{trap.title}: </strong>
                {trap.detail}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
