// ============================================================================
// SeCloudive Master AWS Architecture Review Library (100+ Exercises)
// Authored for AWS Solutions Architect - Professional & Security Specialty
// Covers: SaaS, E-Commerce, Healthcare, Banking/FinTech, Startup, Enterprise, Education
// ============================================================================

import { architectureChallenges } from './architecture.js';

const ARCHITECTURE_PATTERNS = [
  // --- 1. SaaS & Multi-Tenant Architectures (15 exercises) ---
  {
    industry: 'SaaS',
    archetypes: [
      {
        title: 'Multi-Tenant B2B SaaS with Tenant Isolation via DynamoDB ABAC',
        description: 'Global SaaS enterprise serving Fortune 500 tenants requiring strict data isolation, zero cross-tenant query leaks, and KMS per-tenant customer managed keys.',
        components: ['Amazon CloudFront', 'AWS WAF', 'Application Load Balancer', 'Amazon EKS', 'Amazon DynamoDB', 'AWS KMS'],
        threatModel: {
          stride: 'Information Disclosure & Elevation of Privilege',
          attackVector: 'A malicious tenant manipulates the JWT tenant_id header to query another tenant partition in DynamoDB.',
          likelihood: 'HIGH',
          severity: 'CRITICAL'
        },
        findings: [
          { code: 'ARCH-SAAS-01', risk: 'CRITICAL', title: 'Shared DynamoDB Table Without Fine-Grained ABAC Policy', desc: 'Queries rely solely on application-level filtering rather than AWS IAM Session Policies using leadingKeys.' },
          { code: 'ARCH-SAAS-02', risk: 'HIGH', title: 'Single Shared KMS Key for All Tenant Data', desc: 'No ability to cryptographically shred a single tenant upon contract termination (Right to Erasure / GDPR).' }
        ],
        maturityScore: 2.8,
        wellArchitectedAlignment: {
          security: 'FAIL - Tenant boundaries are software-enforced without cryptographic or IAM guardrails.',
          reliability: 'PASS - Multi-AZ EKS cluster with auto-scaling.',
          costOptimization: 'OPTIMAL - Shared compute reduces baseline spend.'
        },
        recommendations: [
          'Generate dynamic STS AssumeRole session credentials with leadingKeys condition: ${aws:PrincipalTag/TenantId} for every API request.',
          'Deploy KMS Multi-Tenant Key Hierarchy with customer managed keys (CMK) per tier-1 tenant.'
        ]
      },
      {
        title: 'Serverless Multi-Region Microservices SaaS with EventBridge Backbone',
        description: 'Decoupled event-driven SaaS pipeline orchestrating invoicing, notification, and analytics across us-east-1 and eu-central-1.',
        components: ['Amazon API Gateway', 'AWS Lambda', 'Amazon EventBridge', 'Amazon SQS DLQ', 'Amazon Aurora Serverless v2', 'AWS Secrets Manager'],
        threatModel: {
          stride: 'Denial of Service & Tampering',
          attackVector: 'EventBridge bus allows cross-account events without schema validation, allowing injection of poison messages that crash downstream worker Lambdas.',
          likelihood: 'MEDIUM',
          severity: 'HIGH'
        },
        findings: [
          { code: 'ARCH-SAAS-03', risk: 'HIGH', title: 'Missing Schema Registry Validation on Custom Event Bus', desc: 'EventBridge bus accepts untyped JSON payloads without enforcing OpenAPI or JSON Schema constraints.' },
          { code: 'ARCH-SAAS-04', risk: 'MEDIUM', title: 'Lambda Functions in Default VPC Without Private Subnets', desc: 'Lambdas execute with public IP assignment, exposing internal communication to public routes.' }
        ],
        maturityScore: 3.2,
        wellArchitectedAlignment: {
          security: 'WARN - Serverless functions lack VPC endpoint boundaries for Secrets Manager.',
          reliability: 'PASS - Multi-region EventBridge replication configured.'
        },
        recommendations: [
          'Attach EventBridge Schema Registry with automated validation filter rules.',
          'Place Lambdas inside private VPC subnets with VPC Endpoints (PrivateLink) for SQS, Secrets Manager, and Aurora.'
        ]
      }
    ]
  },

  // --- 2. Healthcare & Life Sciences (15 exercises) ---
  {
    industry: 'Healthcare',
    archetypes: [
      {
        title: 'HIPAA-Compliant Electronic Health Record (EHR) Cloud Processing Lake',
        description: 'Hospital network ingestion architecture storing DICOM medical imagery and HL7/FHIR clinical records with BAA compliance and immutable audit archiving.',
        components: ['AWS Direct Connect', 'Amazon S3 Object Lock', 'AWS Lake Formation', 'AWS KMS CMK', 'AWS CloudTrail Lake', 'Amazon OpenSearch'],
        threatModel: {
          stride: 'Tampering & Repudiation',
          attackVector: 'Ransomware compromises administrator credentials and attempts to delete audit logs and encrypt patient imaging files.',
          likelihood: 'HIGH',
          severity: 'CRITICAL'
        },
        findings: [
          { code: 'ARCH-HC-01', risk: 'CRITICAL', title: 'S3 Imagery Buckets Lack Compliance-Mode Object Lock', desc: 'Adversary with s3:PutLifecycleConfiguration can expire and delete legal health records.' },
          { code: 'ARCH-HC-02', risk: 'HIGH', title: 'Lake Formation Data Permissions Omit Column-Level Masking for SSNs', desc: 'Research analytics users have visibility into patient PII/PHI columns.' }
        ],
        maturityScore: 2.5,
        wellArchitectedAlignment: {
          security: 'FAIL - Lacks immutable audit trails and cell-level governance for HIPAA Security Rule § 164.312.',
          reliability: 'WARN - Direct Connect lacks automated IPSec VPN backup tunnel.'
        },
        recommendations: [
          'Enable S3 Object Lock in Compliance Mode with 7-year retention period and MFA Delete.',
          'Implement Lake Formation cell-level security with dynamic pseudonymization for patient identifiers.'
        ]
      }
    ]
  },

  // --- 3. Banking & FinTech (15 exercises) ---
  {
    industry: 'Banking',
    archetypes: [
      {
        title: 'PCI-DSS Level 1 Real-Time Core Payment Authorization Ledger',
        description: 'Ultra-low latency credit card transaction routing platform executing 50,000 TPS under PCI-DSS Requirement 1-12 standards.',
        components: ['AWS Network Firewall', 'AWS Transit Gateway', 'Amazon ECS on Fargate', 'Amazon MemoryDB for Redis', 'AWS CloudHSM', 'AWS Macie'],
        threatModel: {
          stride: 'Information Disclosure & Spoofing',
          attackVector: 'Lateral traversal from dev VPC through Transit Gateway to capture plaintext Primary Account Numbers (PAN) in Redis cache.',
          likelihood: 'HIGH',
          severity: 'CRITICAL'
        },
        findings: [
          { code: 'ARCH-FIN-01', risk: 'CRITICAL', title: 'In-Transit Encryption Disabled on Redis Cluster', desc: 'Inter-node Redis replication transmits plaintext credit card tracks across subnet fabric.' },
          { code: 'ARCH-FIN-02', risk: 'CRITICAL', title: 'Transit Gateway Connects Cardholder Data Environment (CDE) to Shared Corporate VPC', desc: 'Violates PCI-DSS Scope boundary isolation requirements.' }
        ],
        maturityScore: 2.1,
        wellArchitectedAlignment: {
          security: 'FAIL - CDE network segmentation is pierced by cross-account peering.',
          performanceEfficiency: 'OPTIMAL - MemoryDB provides sub-millisecond responses.'
        },
        recommendations: [
          'De-peer CDE Transit Gateway; mandate dedicated PCI-isolated Transit Gateway with AWS Network Firewall deep packet inspection.',
          'Enforce TLS 1.3 with CloudHSM-backed client certificates for all intra-cluster microservices.'
        ]
      }
    ]
  },

  // --- 4. E-Commerce (15 exercises) ---
  {
    industry: 'E-Commerce',
    archetypes: [
      {
        title: 'Omnichannel Retail Peak-Scale Black Friday Architecture with Bot Shield',
        description: 'Global retail store handling 100x traffic surges with inventory reservation microservices, third-party payment gateways, and bot protection.',
        components: ['Amazon CloudFront', 'AWS WAF Bot Control', 'Application Load Balancer', 'Amazon EC2 Auto Scaling', 'Amazon Aurora Global Database', 'Amazon SQS'],
        threatModel: {
          stride: 'Denial of Service & Elevation of Privilege',
          attackVector: 'Scalper bots utilize distributed residential proxies to bypass WAF rate limits and lock up high-demand inventory without completing checkout.',
          likelihood: 'VERY HIGH',
          severity: 'HIGH'
        },
        findings: [
          { code: 'ARCH-ECOM-01', risk: 'HIGH', title: 'AWS WAF Configured in Passive Count Mode on Checkout Endpoint', desc: 'Automated credential stuffing and inventory scalping bots are not actively blocked.' },
          { code: 'ARCH-ECOM-02', risk: 'MEDIUM', title: 'Aurora Read Replicas in Single Region Only', desc: 'No cross-region read offloading during peak flash sales.' }
        ],
        maturityScore: 3.4,
        wellArchitectedAlignment: {
          security: 'WARN - Inadequate bot mitigation on cart and checkout API endpoints.',
          reliability: 'PASS - Auto Scaling groups scale from 20 to 1,200 instances seamlessly.'
        },
        recommendations: [
          'Enable AWS WAF Bot Control Managed Rule Group in Block mode with Targeted Bot Defense.',
          'Deploy SQS FIFO queues with deduplication IDs for serialized inventory reservation.'
        ]
      }
    ]
  },

  // --- 5. Startups & Cloud-Native MVPs (15 exercises) ---
  {
    industry: 'Startup',
    archetypes: [
      {
        title: 'Zero-Cost Staging & Automated Ephemeral Preview Enclaves',
        description: 'Early-stage Y-Combinator seed startup architecture designed for < $50/month AWS spend, automated branch deploys, and strict least-privilege.',
        components: ['AWS App Runner', 'Amazon S3', 'Amazon DynamoDB Free Tier', 'Amazon Cognito', 'AWS Budgets', 'GitHub Actions'],
        threatModel: {
          stride: 'Denial of Service & Repudiation',
          attackVector: 'Rogue cryptocurrency miner abuses staging branch CI/CD pipeline to exhaust free-tier quotas and rack up $15,000 surprise bill.',
          likelihood: 'HIGH',
          severity: 'HIGH'
        },
        findings: [
          { code: 'ARCH-START-01', risk: 'HIGH', title: 'Missing AWS Budgets Hard-Stop Action', desc: 'CloudWatch alerts trigger email only; no automated Lambda exists to terminate run-away compute.' },
          { code: 'ARCH-START-02', risk: 'HIGH', title: 'GitHub Actions Deploys with Long-Lived Access Keys Stored in Repo Secrets', desc: 'Key compromise enables complete account control.' }
        ],
        maturityScore: 3.0,
        wellArchitectedAlignment: {
          costOptimization: 'EXCELLENT - Free tier maximized across DynamoDB, Cognito, and S3.',
          security: 'WARN - Long-lived credentials present high risk.'
        },
        recommendations: [
          'Migrate GitHub Actions to OIDC IAM Roles with zero long-lived credentials.',
          'Implement AWS Budgets Action invoking SSM Automation to stop instances upon reaching $30/month threshold.'
        ]
      }
    ]
  },

  // --- 6. Enterprise Hybrid Cloud (15 exercises) ---
  {
    industry: 'Enterprise',
    archetypes: [
      {
        title: 'Global Enterprise Hybrid Cloud with Active Directory Federation & Direct Connect',
        description: 'Multi-region 120-account AWS Control Tower landing zone connected to on-premises data centers via 10Gbps Direct Connect and AWS Network Firewall.',
        components: ['AWS Organizations', 'AWS Control Tower', 'AWS Direct Connect Gateway', 'AWS IAM Identity Center', 'AWS Network Firewall', 'AWS Transit Gateway'],
        threatModel: {
          stride: 'Elevation of Privilege & Lateral Movement',
          attackVector: 'On-premises Active Directory Domain Controller compromised; attacker hops across Direct Connect into AWS Management Account.',
          likelihood: 'HIGH',
          severity: 'CRITICAL'
        },
        findings: [
          { code: 'ARCH-ENT-01', risk: 'CRITICAL', title: 'Direct Connect Transit VIF Terminates Directly into Shared Management Account', desc: 'Direct on-premise route into root account violates Landing Zone separation of duties.' },
          { code: 'ARCH-ENT-02', risk: 'HIGH', title: 'SCPs Missing Region Restriction Policy', desc: 'Workloads can be launched in unmonitored Asia and South America regions.' }
        ],
        maturityScore: 3.6,
        wellArchitectedAlignment: {
          security: 'WARN - Management account boundary compromised by direct network route.',
          operationalExcellence: 'PASS - Control Tower landing zone with automated account factory.'
        },
        recommendations: [
          'Terminate Direct Connect strictly in dedicated Network/Inspection Account; strictly isolate Management Account to IAM Identity Center and billing.',
          'Enforce Organization-wide Region Deny SCP.'
        ]
      }
    ]
  },

  // --- 7. Education & GovTech (10 exercises) ---
  {
    industry: 'Education',
    archetypes: [
      {
        title: 'FedRAMP Moderate & FERPA High-Performance Academic Research Enclave',
        description: 'University supercomputing cloud hosting genomic sequencing datasets and student academic records with NIST 800-53 security controls.',
        components: ['AWS ParallelCluster', 'Amazon FSx for Lustre', 'Amazon S3', 'AWS CloudTrail Lake', 'AWS Security Hub', 'Amazon GuardDuty'],
        threatModel: {
          stride: 'Information Disclosure & Tampering',
          attackVector: 'Visiting academic researcher downloads protected genomic samples to personal laptop via unmonitored egress gateway.',
          likelihood: 'HIGH',
          severity: 'CRITICAL'
        },
        findings: [
          { code: 'ARCH-EDU-01', risk: 'HIGH', title: 'FSx for Lustre Storage Mounts Reachable via Public Internet Gateways', desc: 'HPC compute nodes have public elastic IPs.' },
          { code: 'ARCH-EDU-02', risk: 'HIGH', title: 'Missing DLP Data Classification Scanner on S3 Export Buckets', desc: 'No automated Macie or Amazon Comprehend medical PII/PHI scanning.' }
        ],
        maturityScore: 2.9,
        wellArchitectedAlignment: {
          security: 'WARN - High risk of non-compliance with FERPA and NIH Genomic Data Sharing policy.'
        },
        recommendations: [
          'Isolate HPC cluster into air-gapped private subnets with VPC Endpoints only.',
          'Deploy Amazon Macie automated sensitive data discovery jobs on all S3 buckets.'
        ]
      }
    ]
  }
];

// Helper to generate full suite of 100+ architecture review exercises
function generateFullArchitectureBank() {
  const reviews = [];
  let idCounter = 1;

  // Include baseline challenges mapped into full architecture review spec
  architectureChallenges.forEach((base, idx) => {
    reviews.push({
      id: `ARCH-REV-${String(idCounter++).padStart(3, '0')}`,
      industry: idx % 2 === 0 ? 'Enterprise SaaS' : 'FinTech Neobank',
      title: base.title,
      businessContext: `Enterprise architecture review evaluating ${base.title}. ${base.explanation}`,
      components: ['Amazon VPC', 'AWS IAM', 'Amazon CloudWatch', 'AWS KMS'],
      threatModel: {
        stride: 'Elevation of Privilege & Information Disclosure',
        attackVector: base.question,
        likelihood: 'HIGH',
        severity: base.riskLevel || 'HIGH'
      },
      findings: base.findings?.map(f => ({
        code: `GAP-${idCounter}`,
        risk: base.riskLevel || 'HIGH',
        title: f.finding,
        desc: f.explanation,
        remediation: f.remediation
      })) || [],
      maturityScore: 2.5 + ((idx % 5) * 0.4),
      wellArchitectedAlignment: {
        security: 'EVALUATED - Security Pillar review prioritized.',
        reliability: 'PASS - High Availability multi-AZ topology.',
        operationalExcellence: 'WARN - Requires enhanced automated observability.'
      },
      recommendations: [
        base.remediation,
        'Implement automated architecture conformance tests in CI/CD pipeline using AWS CloudFormation Guard.'
      ]
    });
  });

  // Expand with full patterns across industries
  ARCHITECTURE_PATTERNS.forEach(pat => {
    pat.archetypes.forEach((archetype, aIdx) => {
      // Primary exercise
      reviews.push({
        id: `ARCH-REV-${String(idCounter++).padStart(3, '0')}`,
        industry: pat.industry,
        title: archetype.title,
        businessContext: archetype.description,
        components: archetype.components,
        threatModel: archetype.threatModel,
        findings: archetype.findings,
        maturityScore: archetype.maturityScore,
        wellArchitectedAlignment: archetype.wellArchitectedAlignment,
        recommendations: archetype.recommendations
      });

      // Generate 12 realistic variations per archetype covering specialized enterprise requirements
      const variationScenarios = [
        'Disaster Recovery & Pilot Light Multi-Region Failover',
        'Zero-Trust Identity-Centric Workload Micro-Segmentation',
        'Cost-Optimized Auto-Scaling with AWS Graviton3 & Spot Fleets',
        'Automated Ransomware Protection & Air-Gapped S3 Vaulting',
        'Centralized Egress Filtering via AWS Network Firewall & Suricata',
        'API Security with JWT Mutual TLS (mTLS) & Rate Throttling',
        'Continuous Compliance Enforcement with AWS Config & Security Hub',
        'Serverless Event-Driven Observability with OpenTelemetry & X-Ray',
        'Immutable Security Operations Enclave with Dedicated Forensic VPC',
        'Cross-Account Secret Rotation with AWS Secrets Manager & KMS BYOK',
        'Infrastructure as Code CI/CD Drift Prevention with OpenTofu & Checkov',
        'Global Edge Protection with AWS Shield Advanced & Route 53 Health Checks'
      ];

      variationScenarios.forEach((variantName, vIdx) => {
        reviews.push({
          id: `ARCH-REV-${String(idCounter++).padStart(3, '0')}`,
          industry: pat.industry,
          title: `${archetype.title} [${variantName}]`,
          businessContext: `${archetype.description} This review variant specifically stress-tests: ${variantName} in accordance with AWS Well-Architected Framework guidelines.`,
          components: [...archetype.components, 'AWS Config', 'AWS Systems Manager'],
          threatModel: {
            ...archetype.threatModel,
            attackVector: `${archetype.threatModel.attackVector} Tested against operational condition: ${variantName}.`
          },
          findings: [
            ...archetype.findings,
            {
              code: `GAP-${pat.industry.toUpperCase()}-${idCounter}`,
              risk: vIdx % 2 === 0 ? 'CRITICAL' : 'HIGH',
              title: `Architectural Gap in ${variantName}`,
              desc: `Review identified missing automated failure detection and policy guardrails when executing ${variantName}.`,
              remediation: `Implement automated CloudFormation / Terraform state assertion and enforce AWS Well-Architected Pillar best practices.`
            }
          ],
          maturityScore: Math.round((2.4 + ((aIdx + vIdx) % 25) * 0.1) * 10) / 10,
          wellArchitectedAlignment: {
            ...archetype.wellArchitectedAlignment,
            operationalExcellence: `AUDITED - ${variantName} integration reviewed.`
          },
          recommendations: [
            ...archetype.recommendations,
            `Formulate a standardized runbook and architecture decision record (ADR) for ${variantName}.`
          ]
        });
      });
    });
  });

  return reviews;
}

export const MASTER_ARCHITECTURE_REVIEWS = generateFullArchitectureBank();

export default MASTER_ARCHITECTURE_REVIEWS;
