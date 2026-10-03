// ==============================================================================
// SeCloudive Definitive 5-Cloud Enterprise Security Crosswalk & Resource Bank
// Covers: AWS • Microsoft Azure • Google Cloud Platform • Oracle Cloud • IBM Cloud
// ==============================================================================

export const CLOUD_PROVIDERS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    shortName: 'AWS',
    brandColor: '#ff9900',
    accentColor: '#f59e0b',
    iconEmoji: '🟧',
    cliName: 'aws',
    cliDocUrl: 'https://awscli.amazonaws.com/',
    consoleName: 'AWS Management Console',
    wafName: 'AWS Well-Architected Framework (Security Pillar)',
    certKey: 'AWS Certified Security - Specialty (SCS-C02)',
    marketShare: '31% Enterprise Cloud'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    shortName: 'Azure',
    brandColor: '#008ad7',
    accentColor: '#0ea5e9',
    iconEmoji: '🟦',
    cliName: 'az',
    cliDocUrl: 'https://learn.microsoft.com/cli/azure/',
    consoleName: 'Azure Portal & Entra Admin Center',
    wafName: 'Microsoft Azure Well-Architected Framework (Security)',
    certKey: 'Microsoft Certified: Azure Security Engineer Associate (AZ-500)',
    marketShare: '25% Enterprise Cloud'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    shortName: 'Google Cloud',
    brandColor: '#4285f4',
    accentColor: '#3b82f6',
    iconEmoji: '🌐',
    cliName: 'gcloud',
    cliDocUrl: 'https://cloud.google.com/sdk/gcloud',
    consoleName: 'Google Cloud Console',
    wafName: 'Google Cloud Architecture Framework (Security & Privacy)',
    certKey: 'Google Cloud Professional Cloud Security Engineer',
    marketShare: '11% Enterprise Cloud'
  },
  {
    id: 'oci',
    name: 'Oracle Cloud Infrastructure',
    shortName: 'Oracle Cloud',
    brandColor: '#c74634',
    accentColor: '#f43f5e',
    iconEmoji: '🔴',
    cliName: 'oci',
    cliDocUrl: 'https://docs.oracle.com/en-us/iaas/Content/API/Concepts/cliconcepts.htm',
    consoleName: 'OCI Console',
    wafName: 'OCI Architecture Center: Security Architecture',
    certKey: 'Oracle Cloud Infrastructure 2024 Certified Security Professional (1Z0-1104-24)',
    marketShare: 'Enterprise Databases & GenAI High Performance'
  },
  {
    id: 'ibm',
    name: 'IBM Cloud',
    shortName: 'IBM Cloud',
    brandColor: '#0f62fe',
    accentColor: '#6366f1',
    iconEmoji: '🔷',
    cliName: 'ibmcloud',
    cliDocUrl: 'https://cloud.ibm.com/docs/cli',
    consoleName: 'IBM Cloud Console',
    wafName: 'IBM Cloud Framework for Financial Services',
    certKey: 'IBM Cloud Security Engineer Specialty',
    marketShare: 'Regulated Finance, Healthcare & Government'
  }
]

// ------------------------------------------------------------------------------
// Comprehensive 5-Cloud Security Crosswalk Matrix (14 Core Dimensions)
// ------------------------------------------------------------------------------
export const MULTI_CLOUD_CROSSWALK_5CLOUDS = [
  {
    id: 'crosswalk-identity-rbac',
    category: 'Identity & Access',
    concept: 'Identity & Access Management (RBAC & Principals)',
    aws: {
      service: 'AWS IAM',
      resource: 'Users, User Groups, IAM Roles, IAM Policies (JSON)',
      cli: 'aws iam get-account-authorization-details',
      bestPractice: 'Enforce MFA on all human users, eliminate long-lived IAM user access keys, and implement IAM Access Analyzer.'
    },
    azure: {
      service: 'Microsoft Entra ID (formerly Azure AD) & Azure RBAC',
      resource: 'Entra Users, Security Groups, App Registrations, Role Definitions & Assignments',
      cli: 'az role assignment list --all',
      bestPractice: 'Enforce Entra Privileged Identity Management (PIM) for just-in-time elevation, and apply Conditional Access policies.'
    },
    gcp: {
      service: 'Google Cloud IAM',
      resource: 'Google Accounts, Google Groups, Service Accounts, Predefined & Custom Roles',
      cli: 'gcloud projects get-iam-policy $PROJECT_ID',
      bestPractice: 'Enforce Policy Intelligence recommendations, use Service Account Impersonation, and restrict Service Account Key creation.'
    },
    oci: {
      service: 'OCI Identity & Access Management (OCI IAM)',
      resource: 'Tenancies, Compartments, Domains, Users, Groups, Policies (DSL Syntax)',
      cli: 'oci iam policy list --compartment-id $COMPARTMENT_OCID',
      bestPractice: 'Segregate all resources into dedicated Compartments, write least-privilege policy statements (`allow group X to manage Y in compartment Z`).'
    },
    ibm: {
      service: 'IBM Cloud IAM',
      resource: 'Users, Access Groups, Service IDs, Access Policies & Dynamic Rules',
      cli: 'ibmcloud iam access-groups',
      bestPractice: 'Assign access via Access Groups rather than individual users; enforce Context-Based Restrictions (CBR) on administrative roles.'
    }
  },
  {
    id: 'crosswalk-workload-identity',
    category: 'Identity & Access',
    concept: 'Workload & Instance Identity (Zero Static Keys)',
    aws: {
      service: 'IAM Roles for EC2 / IAM Roles for Service Accounts (IRSA)',
      resource: 'Instance Profile + STS AssumeRole credentials via IMDSv2',
      cli: 'aws sts assume-role --role-arn arn:aws:iam::123456789012:role/app-worker --role-session-name test',
      bestPractice: 'Require IMDSv2 (token-based metadata) with hop-limit 1 to prevent SSRF credential theft.'
    },
    azure: {
      service: 'Azure Managed Identities for Azure Resources',
      resource: 'System-Assigned & User-Assigned Managed Identity',
      cli: 'az vm identity assign --name app-vm --resource-group rg-prod',
      bestPractice: 'Use System-Assigned identities for standalone services so Azure handles lifecycle cleanup upon VM deletion.'
    },
    gcp: {
      service: 'Workload Identity Federation & Attached Service Accounts',
      resource: 'Service Accounts attached to Compute Engine / GKE Workload Identity',
      cli: 'gcloud compute instances set-service-account app-vm --service-account=sa-app@proj.iam.gserviceaccount.com',
      bestPractice: 'Enable GKE Workload Identity to bind Kubernetes ServiceAccounts to GCP Service Accounts without storing JSON keys.'
    },
    oci: {
      service: 'OCI Instance Principals & Dynamic Groups',
      resource: 'Dynamic Groups matching instance OCIDs + IAM Policies',
      cli: 'oci iam dynamic-group create --name "DynGrp-AppNodes" --matching-rule "instance.compartment.id = \'ocid1...\'"',
      bestPractice: 'Authorize instances to invoke OCI API services directly via X.509 certificates generated on the instance metadata endpoint.'
    },
    ibm: {
      service: 'IBM Cloud Trusted Profiles & Compute Resource Identity',
      resource: 'Trusted Profiles with Compute Resource Claim Rules (CRN)',
      cli: 'ibmcloud iam trusted-profiles',
      bestPractice: 'Bind VPC Virtual Server Instances to Trusted Profiles so containers fetch short-lived IAM tokens without API keys.'
    }
  },
  {
    id: 'crosswalk-org-guardrails',
    category: 'Governance & Boundaries',
    concept: 'Organization Boundary & Parent Guardrails',
    aws: {
      service: 'AWS Organizations Service Control Policies (SCPs)',
      resource: 'Root, Organizational Units (OUs), SCP Policy Documents (Deny-All)',
      cli: 'aws organizations list-policies --filter SERVICE_CONTROL_POLICY',
      bestPractice: 'Attach SCPs at OU roots to deny unapproved regions, disable root credentials, and block CloudTrail tampering.'
    },
    azure: {
      service: 'Azure Management Groups & Azure Policy',
      resource: 'Root Management Group, Policy Definitions & Initiatives (`Deny` / `Modify`)',
      cli: 'az policy assignment list',
      bestPractice: 'Assign Azure Security Benchmark initiatives at the root Management Group with automated remediation tasks.'
    },
    gcp: {
      service: 'Google Cloud Organization Policy Service',
      resource: 'Organization Node, Folders, Organization Policy Constraints',
      cli: 'gcloud resource-manager org-policies list --organization=$ORG_ID',
      bestPractice: 'Enforce constraints like `constraints/compute.vmExternalIpAccess` (no public IPs) and `constraints/gcp.resourceLocations`.'
    },
    oci: {
      service: 'OCI Compartment Quotas & Security Zones',
      resource: 'Root Tenancy, Compartment Trees, Security Zone Maximum-Security Recipes',
      cli: 'oci limits quota list --compartment-id $TENANCY_OCID',
      bestPractice: 'Enclose sensitive databases inside OCI Security Zones where security recipes strictly prohibit public IP creation or unencrypted storage.'
    },
    ibm: {
      service: 'IBM Cloud Enterprise Policies & Context-Based Restrictions (CBR)',
      resource: 'Enterprise Hierarchy, Context-Based Restrictions Network Zones',
      cli: 'ibmcloud enterprise list',
      bestPractice: 'Establish CBR rules that restrict API and console management strictly to corporate VPN and zscaler egress IPs.'
    }
  },
  {
    id: 'crosswalk-object-storage',
    category: 'Storage & Encryption',
    concept: 'Object Storage & Public Access Isolation',
    aws: {
      service: 'Amazon S3',
      resource: 'Buckets, Bucket Policies, S3 Block Public Access, S3 Access Points',
      cli: 'aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
      bestPractice: 'Enable S3 Block Public Access at the account level; enforce KMS CMK encryption with `aws:SecureTransport` (HTTPS) bucket policy.'
    },
    azure: {
      service: 'Azure Blob Storage',
      resource: 'Storage Accounts, Blob Containers, Private Endpoints, Shared Access Signatures',
      cli: 'az storage account update --name $ACCT --resource-group $RG --allow-blob-public-access false',
      bestPractice: 'Disable `allowBlobPublicAccess`, require Minimum TLS 1.2, and enforce Customer-Managed Keys (CMK) via Key Vault.'
    },
    gcp: {
      service: 'Google Cloud Storage (GCS)',
      resource: 'Buckets, Objects, Uniform Bucket-Level Access, CMEK Keyring',
      cli: 'gcloud storage buckets update gs://$BUCKET --uniform-bucket-level-access',
      bestPractice: 'Enforce Uniform Bucket-Level Access (disables legacy ACLs); apply Public Access Prevention (`enforced`).'
    },
    oci: {
      service: 'OCI Object Storage',
      resource: 'Buckets, Namespaces, Pre-Authenticated Requests (PAR), Retention Rules',
      cli: 'oci os bucket update --bucket-name $BUCKET --public-access-type NoPublicAccess',
      bestPractice: 'Keep bucket public access type as `NoPublicAccess`; avoid long-lived Pre-Authenticated Requests (PARs).'
    },
    ibm: {
      service: 'IBM Cloud Object Storage (COS)',
      resource: 'Service Instances, Buckets, Key Protect Integration, Immutable WORM policies',
      cli: 'ibmcloud cos bucket-update-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
      bestPractice: 'Enforce Public Access Block; integrate Key Protect Customer Managed Key with automated cryptographic erasure.'
    }
  },
  {
    id: 'crosswalk-object-immutability',
    category: 'Storage & Encryption',
    concept: 'Immutable Storage & Ransomware Defense (WORM)',
    aws: {
      service: 'Amazon S3 Object Lock',
      resource: 'Compliance Mode / Governance Mode (Retention Days / Legal Hold)',
      cli: 'aws s3api put-object-lock-configuration --bucket $BUCKET --object-lock-configuration \'{"ObjectLockEnabled":"Enabled","Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Days":365}}}\'',
      bestPractice: 'Use Compliance Mode for SOC audit trails so not even the root user can overwrite or delete security records.'
    },
    azure: {
      service: 'Azure Immutable Blob Storage',
      resource: 'Time-Based Retention Policies & Legal Holds',
      cli: 'az storage container immutability-policy create --account-name $ACCT --container-name audit-logs --period 365',
      bestPractice: 'Lock the immutability policy to transition it to write-once-read-many (WORM) regulatory compliance.'
    },
    gcp: {
      service: 'Cloud Storage Bucket Retention Policy',
      resource: 'Retention Period (Seconds) with Bucket Lock',
      cli: 'gcloud storage buckets update gs://$BUCKET --retention-period=365d && gcloud storage buckets update gs://$BUCKET --lock-retention-policy',
      bestPractice: 'Lock the retention policy; once locked, no identity—including project owners—can reduce the duration or delete the bucket.'
    },
    oci: {
      service: 'OCI Object Storage Retention Rules',
      resource: 'Duration-based Retention Rules & Indefinite Legal Holds',
      cli: 'oci os retention-rule create --bucket-name $BUCKET --display-name "WORM-Compliance" --time-amount 365 --time-unit DAYS',
      bestPractice: 'Lock retention rules to guarantee unalterable financial and security log retention.'
    },
    ibm: {
      service: 'IBM COS Immutable Object Storage',
      resource: 'Retention Policies (Compliance / Governance Mode) with Legal Holds',
      cli: 'ibmcloud cos retention-policy-set --bucket $BUCKET --default-period 365 --period-type days',
      bestPractice: 'Enforce SEC 17a-4 and CFTC compliant immutable retention for centralized enterprise audit trails.'
    }
  },
  {
    id: 'crosswalk-networking-firewalls',
    category: 'Network Security',
    concept: 'Virtual Firewall & Traffic Segmentation',
    aws: {
      service: 'VPC Security Groups & Network ACLs',
      resource: 'Stateful Security Groups (Inbound/Outbound Rules) & Stateless NACLs',
      cli: 'aws ec2 authorize-security-group-ingress --group-id sg-12345 --protocol tcp --port 443 --cidr 10.0.0.0/16',
      bestPractice: 'Chain security groups by Source Group ID instead of CIDR; block all administrative inbound traffic (22/3389) from 0.0.0.0/0.'
    },
    azure: {
      service: 'Azure Network Security Groups (NSGs) & Application Security Groups (ASGs)',
      resource: 'Priority-ordered Security Rules (100–4096), ASG Membership',
      cli: 'az network nsg rule create -g $RG --nsg-name $NSG -n AllowHTTPSInbound --priority 200 --access Allow --protocol Tcp --destination-port-ranges 443',
      bestPractice: 'Group workloads with Application Security Groups (ASGs) to avoid managing brittle IP lists in security rules.'
    },
    gcp: {
      service: 'Google Cloud VPC Firewall Rules & Hierarchical Firewalls',
      resource: 'Direction (INGRESS/EGRESS), Action (ALLOW/DENY), Priority, Network Tags, Service Account Targeting',
      cli: 'gcloud compute firewall-rules create allow-internal-app --network=vpc-prod --allow=tcp:8080 --source-ranges=10.0.0.0/16',
      bestPractice: 'Target firewall rules by Service Account rather than Network Tags, because network tags can be modified by instance admins.'
    },
    oci: {
      service: 'OCI Network Security Groups (NSGs) & Security Lists',
      resource: 'Stateful/Stateless Security Rules matching VCN VNICs',
      cli: 'oci network security-group-rule add --network-security-group-id $NSG_OCID --direction INGRESS --protocol 6 --tcp-options \'{"destinationPortRange":{"min":443,"max":443}}\'',
      bestPractice: 'Prefer NSGs over VCN-wide Security Lists for granular, per-workload micro-segmentation.'
    },
    ibm: {
      service: 'IBM Cloud VPC Security Groups & Network ACLs',
      resource: 'Inbound/Outbound Rules attached to VPC Virtual Network Interfaces (VNIs)',
      cli: 'ibmcloud is security-group-rule-add $SG_ID inbound tcp --port-min 443 --port-max 443 --remote 10.0.0.0/16',
      bestPractice: 'Enforce default-deny inbound and outbound policies; whitelist only explicit application dependencies.'
    }
  },
  {
    id: 'crosswalk-private-endpoints',
    category: 'Network Security',
    concept: 'Private Cloud Backbone Access (Zero Public IP Transit)',
    aws: {
      service: 'AWS PrivateLink & VPC Endpoints',
      resource: 'Interface Endpoints (NLB + ENI) & Gateway Endpoints (S3/DynamoDB Route Table)',
      cli: 'aws ec2 create-vpc-endpoint --vpc-id vpc-12345 --service-name com.amazonaws.us-east-1.s3 --vpc-endpoint-type Gateway',
      bestPractice: 'Attach restrictive VPC Endpoint Policies to verify requests originate from authorized corporate AWS accounts only.'
    },
    azure: {
      service: 'Azure Private Link & Private Endpoints',
      resource: 'Private Endpoint (NIC in VNet) + Private DNS Zone',
      cli: 'az network private-endpoint create -g $RG -n pe-blob --vnet-name $VNET --subnet $SUBNET --private-connection-resource-id $STORAGE_ID --group-id blob --connection-name conn-blob',
      bestPractice: 'Combine Private Endpoints with `selected networks only` firewall on the PaaS service to deny public DNS resolution.'
    },
    gcp: {
      service: 'Google Cloud Private Service Connect (PSC) & Private Google Access',
      resource: 'PSC Endpoint (Internal IP forwarding rule) & Subnet `private-ip-google-access`',
      cli: 'gcloud compute networks subnets update $SUBNET --region=$REGION --enable-private-ip-google-access',
      bestPractice: 'Enable Private Google Access across all database and application subnets to eliminate the need for NAT Gateways for GCP API calls.'
    },
    oci: {
      service: 'OCI Service Gateway & Private Endpoints',
      resource: 'Service Gateway routing `All <Region> Services in Oracle Services Network`',
      cli: 'oci network service-gateway create --compartment-id $COMP_OCID --vcn-id $VCN_OCID --service-id $SRV_ID',
      bestPractice: 'Route Object Storage and Vault traffic through a Service Gateway without routing packets through an Internet Gateway.'
    },
    ibm: {
      service: 'IBM Cloud Virtual Private Endpoints (VPE)',
      resource: 'VPE Gateways allocated within VPC subnets with Reserved IPs',
      cli: 'ibmcloud is endpoint-gateways',
      bestPractice: 'Deploy VPEs for Cloud Object Storage and Key Protect to keep all traffic contained strictly within IBM Cloud private transit.'
    }
  },
  {
    id: 'crosswalk-waf-ddos',
    category: 'Perimeter Defense',
    concept: 'Web Application Firewall & DDoS Shield',
    aws: {
      service: 'AWS WAFv2 & AWS Shield Advanced',
      resource: 'WebACLs, Rule Groups (AWSManagedRulesCommonRuleSet), Rate Limiting Rules',
      cli: 'aws wafv2 list-web-acls --scope REGIONAL',
      bestPractice: 'Deploy rate-limiting rules (e.g. 2,000 requests per 5 minutes per IP) and attach Bot Control rulesets.'
    },
    azure: {
      service: 'Azure Web Application Firewall (WAF) & Azure DDoS Protection',
      resource: 'WAF Policies (OWASP CRS 3.2), Application Gateway / Front Door WAF',
      cli: 'az network application-gateway waf-policy create -g $RG -n waf-policy',
      bestPractice: 'Run WAF in `Detection` mode for 14 days to benchmark false positives, then shift to `Prevention` mode.'
    },
    gcp: {
      service: 'Google Cloud Armor & DDoS Mitigation',
      resource: 'Security Policies, Adaptive Protection (ML Anomaly Detection), Preconfigured WAF Rules',
      cli: 'gcloud compute security-policies list',
      bestPractice: 'Enable Cloud Armor Adaptive Protection to automatically generate defense rules against Layer 7 DDoS surges.'
    },
    oci: {
      service: 'OCI Web Application Firewall (WAF)',
      resource: 'WAF Policies, Protection Rules (ModSecurity Rules), Rate Limiting',
      cli: 'oci waas waas-policy list --compartment-id $COMP_OCID',
      bestPractice: 'Enforce protection rules across HTTP ingress with automated blocking for cross-site scripting and SQL injection.'
    },
    ibm: {
      service: 'IBM Cloud Internet Services (CIS) WAF & DDoS Protection',
      resource: 'Edge Security, OWASP Core Rulesets, Rate Limiting & SSL Termination',
      cli: 'ibmcloud cis',
      bestPractice: 'Route all domain traffic through IBM CIS proxy mode to shield origin VPC load balancers from volumetric attacks.'
    }
  },
  {
    id: 'crosswalk-kms-hsm',
    category: 'Key Management & Secrets',
    concept: 'Cryptographic Key Management (HSM Envelope Encryption)',
    aws: {
      service: 'AWS Key Management Service (KMS) & AWS CloudHSM',
      resource: 'Customer Managed Keys (CMKs), Key Policies, Grants, Multi-Region Keys',
      cli: 'aws kms create-key --description "Prod Data CMK" --origin AWS_KMS',
      bestPractice: 'Enable automated annual key rotation on all CMKs; restrict `kms:Decrypt` via conditions in the key policy.'
    },
    azure: {
      service: 'Azure Key Vault (Keys) & Azure Dedicated HSM',
      resource: 'Key Vaults, Hardware-Protected RSA/EC Keys, Key Rotation Policies',
      cli: 'az keyvault key create --vault-name $VAULT --name ProdDataKey --protection hsm',
      bestPractice: 'Enable Purge Protection and Soft Delete (90-day retention) to prevent ransomware from permanently destroying keys.'
    },
    gcp: {
      service: 'Google Cloud Key Management Service (Cloud KMS) & Cloud HSM',
      resource: 'Keyrings, CryptoKeys, CMEK (Customer-Managed Encryption Keys)',
      cli: 'gcloud kms keys create prod-key --keyring=prod-ring --location=global --purpose=encryption',
      bestPractice: 'Configure automatic key rotation schedule (e.g. 90 days); grant `roles/cloudkms.cryptoKeyEncrypterDecrypter` only to service agents.'
    },
    oci: {
      service: 'OCI Vault & Key Management',
      resource: 'Vaults (Virtual Private / Default), Master Encryption Keys, Key Versions',
      cli: 'oci kms management key create --vault-id $VAULT_OCID --compartment-id $COMP_OCID --display-name "Prod-MEK" --key-shape \'{"algorithm":"AES","length":32}\'',
      bestPractice: 'Assign dedicated Master Encryption Keys per data classification level; backup vault metadata regularly.'
    },
    ibm: {
      service: 'IBM Key Protect & Hyper Protect Crypto Services (FIPS 140-2 Level 4)',
      resource: 'Root Keys, Standard Keys, Key Rings, Envelope Encryption',
      cli: 'ibmcloud kp key create "Prod-Root-Key" -m',
      bestPractice: 'Utilize Keep-Your-Own-Key (KYOK) architecture backed by IBM z15 crypto hardware for financial compliance.'
    }
  },
  {
    id: 'crosswalk-secrets-vaulting',
    category: 'Key Management & Secrets',
    concept: 'Dynamic Secrets Vaulting & Automated Rotation',
    aws: {
      service: 'AWS Secrets Manager',
      resource: 'Secrets, Secret Versions, Automated Lambda Rotation Templates',
      cli: 'aws secretsmanager create-secret --name prod/db/aurora --secret-string \'{"username":"dbadmin","password":"$PASSWORD"}\'',
      bestPractice: 'Configure automated 30-day credential rotation via built-in Lambda rotation templates.'
    },
    azure: {
      service: 'Azure Key Vault (Secrets)',
      resource: 'Vault Secrets, Secret Versions, Event Grid Expiration Notifications',
      cli: 'az keyvault secret set --vault-name $VAULT --name DbPassword --value "$PASSWORD"',
      bestPractice: 'Configure expiration dates on all secrets and trigger automated Event Grid functions to rotate credentials before expiry.'
    },
    gcp: {
      service: 'Google Cloud Secret Manager',
      resource: 'Secrets, Secret Versions, Automatic Replication, Secret Rotation Schedules',
      cli: 'gcloud secrets create db-password --data-file=password.txt',
      bestPractice: 'Bind secrets to Cloud Pub/Sub topics to notify microservices when a new secret version is deployed.'
    },
    oci: {
      service: 'OCI Vault (Secrets)',
      resource: 'Secrets, Secret Content (Base64), Secret Rules (Expiry & Reuse)',
      cli: 'oci vault secret create-base64 --vault-id $VAULT_OCID --compartment-id $COMP_OCID --secret-name "db-creds" --secret-content-stage CURRENT',
      bestPractice: 'Enforce secret reuse rules to prevent operators from rolling back to compromised previous passwords.'
    },
    ibm: {
      service: 'IBM Cloud Secrets Manager',
      resource: 'Arbitrary Secrets, IAM Credentials, Certificates, Auto-Rotation Policies',
      cli: 'ibmcloud sm secret create',
      bestPractice: 'Automate Let\'s Encrypt and private TLS certificate issuance and renewal via IBM Secrets Manager.'
    }
  },
  {
    id: 'crosswalk-audit-logging',
    category: 'Audit & Compliance',
    concept: 'Control Plane & Data Plane Immutable Audit Logging',
    aws: {
      service: 'AWS CloudTrail',
      resource: 'Multi-Region Trails, Management Events, Data Events (S3/Lambda), CloudTrail Lake',
      cli: 'aws cloudtrail describe-trails',
      bestPractice: 'Enable Log File Validation (SHA-256 digests) and deliver logs to a centralized S3 bucket with Object Lock enabled.'
    },
    azure: {
      service: 'Azure Activity Log & Diagnostic Settings',
      resource: 'Tenant Activity Log, Resource Diagnostic Settings, Log Analytics Workspace',
      cli: 'az monitor log-analytics workspace list',
      bestPractice: 'Route diagnostic logs across 100% of resources to an immutable, locked Log Analytics workspace.'
    },
    gcp: {
      service: 'Google Cloud Audit Logs & Log Sinks',
      resource: 'Admin Activity, Data Access, System Event, Policy Denied Logs, Centralized Log Sink',
      cli: 'gcloud logging sinks list',
      bestPractice: 'Enable Data Access audit logs for sensitive APIs (Cloud Storage, BigQuery) and aggregate logs into an immutable BigQuery dataset.'
    },
    oci: {
      service: 'OCI Audit Service & Logging Service',
      resource: 'Tenancy Audit Events (automatically stored for 365 days), Service Logs, Flow Logs',
      cli: 'oci audit event list --compartment-id $TENANCY_OCID',
      bestPractice: 'Stream OCI audit events to OCI Streaming (Kafka-compatible) for real-time SIEM ingestion.'
    },
    ibm: {
      service: 'IBM Cloud Activity Tracker',
      resource: 'Service Instances, Hosted Event Routing, LogDNA Integration',
      cli: 'ibmcloud at service-instances',
      bestPractice: 'Route audit events to encrypted Object Storage buckets with legal hold retention.'
    }
  },
  {
    id: 'crosswalk-threat-detection',
    category: 'SecOps & Detection',
    concept: 'Autonomous Machine Learning Threat Detection',
    aws: {
      service: 'Amazon GuardDuty',
      resource: 'Detector, Finding Types (Recon, Trojan, Exfiltration, CryptoCurrency), Malicious IP Callbacks',
      cli: 'aws guardduty list-detectors',
      bestPractice: 'Enable S3 Protection, EKS Protection, RDS Protection, and Lambda Protection add-ons inside GuardDuty.'
    },
    azure: {
      service: 'Microsoft Defender for Cloud',
      resource: 'Defender Plans (Servers, Storage, Containers, SQL), Security Alerts, Regulatory Compliance Dashboard',
      cli: 'az security alert list',
      bestPractice: 'Enable Defender for Storage (malware scanning & sensitive data threat detection) across all storage accounts.'
    },
    gcp: {
      service: 'Google Cloud Security Command Center (SCC) Premium',
      resource: 'Event Threat Detection, Container Threat Detection, Virtual Machine Threat Detection, Security Health Analytics',
      cli: 'gcloud scc findings list $ORG_ID',
      bestPractice: 'Turn on VM Threat Detection to detect in-memory malware and cryptocurrency mining without host agent overhead.'
    },
    oci: {
      service: 'OCI Cloud Guard & Threat Intelligence',
      resource: 'Detector Recipes (Configuration & Activity), Responder Recipes (Automated Remediation), Threat Feeds',
      cli: 'oci cloud-guard target list --compartment-id $COMP_OCID',
      bestPractice: 'Enable automated Responder recipes (e.g. automatically disable compromised IAM user or make public bucket private).'
    },
    ibm: {
      service: 'IBM Cloud Security and Compliance Center (SCC) & Workload Protection',
      resource: 'Posture Management, Workload Protection (Sysdig-based runtime agent), Threat Detection Rules',
      cli: 'ibmcloud scc posture profile list',
      bestPractice: 'Continuous validation against PCI-DSS and NIST SP 800-53 controls with automated drift alerts.'
    }
  },
  {
    id: 'crosswalk-siem-soar',
    category: 'SecOps & Detection',
    concept: 'Enterprise SIEM & Automated Incident Response',
    aws: {
      service: 'Amazon Security Lake / Amazon OpenSearch Service',
      resource: 'OCSF (Open Cybersecurity Schema Framework) Parquet Tables, EventBridge Rules, Step Functions',
      cli: 'aws securitylake get-data-lake-organization-configuration',
      bestPractice: 'Standardize telemetry on OCSF format for vendor-neutral query performance in Amazon Athena.'
    },
    azure: {
      service: 'Microsoft Sentinel (Cloud-Native SIEM & SOAR)',
      resource: 'Data Connectors, Analytic Rules (KQL), Playbooks (Logic Apps Automation)',
      cli: 'az sentinel alert-rule list --resource-group $RG --workspace-name $WORKSPACE',
      bestPractice: 'Author KQL incident detection rules for multi-stage attack hunting and automate containment with Logic App playbooks.'
    },
    gcp: {
      service: 'Google Chronicle Security Operations (Chronicle SIEM & SOAR)',
      resource: 'Unified Data Model (UDM), YARA-L Rules, Automated SOAR Playbooks',
      cli: 'gcloud scc notifications list $ORG_ID',
      bestPractice: 'Write YARA-L detection rules querying petabytes of normalized historical telemetry with sub-second latency.'
    },
    oci: {
      service: 'OCI Logging Analytics & OCI Functions SOAR',
      resource: 'Log Groups, Log Parsers, Saved Searches, Event Rules triggering OCI Functions',
      cli: 'oci log-analytics upload list --namespace-name $NS',
      bestPractice: 'Stream Cloud Guard problems to OCI Events service to trigger automated Python containment functions.'
    },
    ibm: {
      service: 'IBM Security QRadar SIEM on Cloud & QRadar SOAR',
      resource: 'Log Sources, Normalized Event Records, Offenses, QRadar SOAR Playbooks',
      cli: 'ibmcloud qradar',
      bestPractice: 'Correlate network flow logs and identity logs to calculate incident risk scores and trigger automated quarantine.'
    }
  },
  {
    id: 'crosswalk-iac-terraform',
    category: 'DevSecOps & Automation',
    concept: 'Infrastructure as Code (Terraform Multi-Cloud Hardening)',
    aws: {
      service: 'Terraform AWS Provider (`hashicorp/aws`)',
      resource: '`aws_vpc`, `aws_security_group`, `aws_s3_bucket`, `aws_iam_role`',
      cli: 'terraform init && terraform plan',
      bestPractice: 'Scan with tfsec/Checkov to enforce zero wildcards, encryption at rest, and private subnets before `terraform apply`.'
    },
    azure: {
      service: 'Terraform AzureRM Provider (`hashicorp/azurerm`)',
      resource: '`azurerm_virtual_network`, `azurerm_network_security_group`, `azurerm_storage_account`',
      cli: 'terraform init && terraform plan',
      bestPractice: 'Pin provider version, set `features {}`, and enforce `allow_nested_items_to_be_public = false`.'
    },
    gcp: {
      service: 'Terraform Google Provider (`hashicorp/google`)',
      resource: '`google_compute_network`, `google_compute_firewall`, `google_storage_bucket`',
      cli: 'terraform init && terraform plan',
      bestPractice: 'Enforce `uniform_bucket_level_access = true` and `auto_create_subnetworks = false` for custom VPC design.'
    },
    oci: {
      service: 'Terraform OCI Provider (`oracle/oci`)',
      resource: '`oci_core_vcn`, `oci_core_network_security_group`, `oci_objectstorage_bucket`',
      cli: 'terraform init && terraform plan',
      bestPractice: 'Parametrize compartment OCIDs, set `public_access_type = "NoPublicAccess"`, and enable KMS key encryption.'
    },
    ibm: {
      service: 'Terraform IBM Cloud Provider (`IBM-Cloud/ibm`)',
      resource: '`ibm_is_vpc`, `ibm_is_security_group`, `ibm_cos_bucket`',
      cli: 'terraform init && terraform plan',
      bestPractice: 'Configure `hard_quota` on COS buckets and bind Key Protect root key CRNs explicitly.'
    }
  }
]

// ------------------------------------------------------------------------------
// Multi-Cloud Lab Runbooks Template Bank: Side-by-Side Commands
// ------------------------------------------------------------------------------
export const MULTI_CLOUD_LAB_COMMANDS = {
  'iam-least-privilege': {
    title: 'Audit & Enforce Principle of Least Privilege',
    aws: {
      cli: 'aws iam list-attached-user-policies --user-name dev-contractor',
      remediate: 'aws iam detach-user-policy --user-name dev-contractor --policy-arn arn:aws:iam::aws:policy/AdministratorAccess && aws iam attach-user-policy --user-name dev-contractor --policy-arn arn:aws:iam::123456789012:policy/DevSecOpsRestrictedAccess',
      verify: 'aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:user/dev-contractor --action-names iam:CreateUser'
    },
    azure: {
      cli: 'az role assignment list --assignee contractor@contoso.com --output table',
      remediate: 'az role assignment delete --assignee contractor@contoso.com --role "Owner" && az role assignment create --assignee contractor@contoso.com --role "Reader" --scope "/subscriptions/$SUB_ID/resourceGroups/rg-dev"',
      verify: 'az role assignment list --assignee contractor@contoso.com --query "[].roleDefinitionName"'
    },
    gcp: {
      cli: 'gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:contractor@gmail.com"',
      remediate: 'gcloud projects remove-iam-policy-binding $PROJECT_ID --member="user:contractor@gmail.com" --role="roles/owner" && gcloud projects add-iam-policy-binding $PROJECT_ID --member="user:contractor@gmail.com" --role="roles/viewer"',
      verify: 'gcloud asset search-all-iam-policies --scope="projects/$PROJECT_ID" --query="policy:contractor@gmail.com"'
    },
    oci: {
      cli: 'oci iam policy list --compartment-id $COMPARTMENT_OCID --output table',
      remediate: 'oci iam policy update --policy-id $POLICY_OCID --statements \'["ALLOW GROUP ContractorGroup to read all-resources in compartment DevCompartment"]\'',
      verify: 'oci iam policy get --policy-id $POLICY_OCID'
    },
    ibm: {
      cli: 'ibmcloud iam user-policies contractor@acme.com',
      remediate: 'ibmcloud iam user-policy-delete contractor@acme.com $ADMIN_POLICY_ID -f && ibmcloud iam user-policy-create contractor@acme.com --roles Viewer --service-name is',
      verify: 'ibmcloud iam user-policies contractor@acme.com'
    }
  },
  'storage-lockdown': {
    title: 'Storage Bucket Public Access Quarantine & Encryption',
    aws: {
      cli: 'aws s3api get-public-access-block --bucket corp-data-lake-prod',
      remediate: 'aws s3api put-public-access-block --bucket corp-data-lake-prod --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
      verify: 'aws s3api get-bucket-policy-status --bucket corp-data-lake-prod'
    },
    azure: {
      cli: 'az storage account show -n corpfinrecords -g rg-prod --query "allowBlobPublicAccess"',
      remediate: 'az storage account update -n corpfinrecords -g rg-prod --allow-blob-public-access false --min-tls-version TLS1_2',
      verify: 'az storage account show -n corpfinrecords -g rg-prod --query "{PublicAccess:allowBlobPublicAccess,TLS:minimumTlsVersion}"'
    },
    gcp: {
      cli: 'gcloud storage buckets describe gs://corp-datalake-prod --format="get(uniformBucketLevelAccess.enabled)"',
      remediate: 'gcloud storage buckets update gs://corp-datalake-prod --uniform-bucket-level-access',
      verify: 'gcloud storage buckets describe gs://corp-datalake-prod --format="json(iamConfiguration)"'
    },
    oci: {
      cli: 'oci os bucket get --bucket-name corp-backup-vault --fields publicAccessType',
      remediate: 'oci os bucket update --bucket-name corp-backup-vault --public-access-type NoPublicAccess',
      verify: 'oci os bucket get --bucket-name corp-backup-vault --fields publicAccessType'
    },
    ibm: {
      cli: 'ibmcloud cos bucket-get-public-access-block --bucket corp-audit-archive',
      remediate: 'ibmcloud cos bucket-update-public-access-block --bucket corp-audit-archive --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
      verify: 'ibmcloud cos bucket-get-public-access-block --bucket corp-audit-archive'
    }
  },
  'network-perimeter-quarantine': {
    title: 'Emergency Inbound Perimeter Lockdown (Block 0.0.0.0/0 Management)',
    aws: {
      cli: 'aws ec2 describe-security-groups --group-ids sg-web-tier --query "SecurityGroups[].IpPermissions[?ToPort==`22`]"',
      remediate: 'aws ec2 revoke-security-group-ingress --group-id sg-web-tier --protocol tcp --port 22 --cidr 0.0.0.0/0',
      verify: 'aws ec2 describe-security-groups --group-ids sg-web-tier --query "SecurityGroups[].IpPermissions"'
    },
    azure: {
      cli: 'az network nsg rule list -g rg-prod --nsg-name nsg-web --query "[?destinationPortRange==\'22\']"',
      remediate: 'az network nsg rule delete -g rg-prod --nsg-name nsg-web -n AllowSSHInboundInternet',
      verify: 'az network nsg rule list -g rg-prod --nsg-name nsg-web -o table'
    },
    gcp: {
      cli: 'gcloud compute firewall-rules list --filter="allowed[].ports:22 AND sourceRanges:0.0.0.0/0"',
      remediate: 'gcloud compute firewall-rules delete default-allow-ssh --quiet',
      verify: 'gcloud compute firewall-rules list --filter="direction:INGRESS AND sourceRanges:0.0.0.0/0"'
    },
    oci: {
      cli: 'oci network security-group-rule list --network-security-group-id $NSG_OCID --direction INGRESS',
      remediate: 'oci network security-group-rule remove --network-security-group-id $NSG_OCID --security-rule-ids \'["$RULE_OCID"]\'',
      verify: 'oci network security-group-rule list --network-security-group-id $NSG_OCID'
    },
    ibm: {
      cli: 'ibmcloud is security-group-rules sg-web-tier',
      remediate: 'ibmcloud is security-group-rule-delete sg-web-tier $RULE_ID -f',
      verify: 'ibmcloud is security-group-rules sg-web-tier'
    }
  }
}

// ------------------------------------------------------------------------------
// Multi-Cloud CLI & Console Navigation Cross-Cloud Translator
// ------------------------------------------------------------------------------
export function getMultiCloudCliForStep(step = {}, lab = {}) {
  const awsCmd = step.cliCommand || '# Command not specified'
  const stepTitle = (step.title || '').toLowerCase()
  const stepInstr = (step.instructions || '').toLowerCase()
  const labTitle = (lab.title || '').toLowerCase()
  const fullContext = `${stepTitle} ${stepInstr} ${labTitle} ${awsCmd}`.toLowerCase()

  // Match predefined scenarios if available
  if (fullContext.includes('least-privilege') || fullContext.includes('contractor') || (fullContext.includes('iam') && fullContext.includes('policy'))) {
    const sc = MULTI_CLOUD_LAB_COMMANDS['iam-least-privilege']
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : sc.aws.cli, verify: sc.aws.verify },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: sc.azure.remediate, verify: sc.azure.verify },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: sc.gcp.remediate, verify: sc.gcp.verify },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: sc.oci.remediate, verify: sc.oci.verify },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: sc.ibm.remediate, verify: sc.ibm.verify }
    }
  }

  if (fullContext.includes('s3') || fullContext.includes('bucket') || fullContext.includes('storage') || fullContext.includes('public-access')) {
    const sc = MULTI_CLOUD_LAB_COMMANDS['storage-lockdown']
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : sc.aws.cli, verify: sc.aws.verify },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: sc.azure.remediate, verify: sc.azure.verify },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: sc.gcp.remediate, verify: sc.gcp.verify },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: sc.oci.remediate, verify: sc.oci.verify },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: sc.ibm.remediate, verify: sc.ibm.verify }
    }
  }

  if (fullContext.includes('security-group') || fullContext.includes('port 22') || fullContext.includes('ssh') || fullContext.includes('firewall') || fullContext.includes('perimeter') || fullContext.includes('ingress')) {
    const sc = MULTI_CLOUD_LAB_COMMANDS['network-perimeter-quarantine']
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : sc.aws.cli, verify: sc.aws.verify },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: sc.azure.remediate, verify: sc.azure.verify },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: sc.gcp.remediate, verify: sc.gcp.verify },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: sc.oci.remediate, verify: sc.oci.verify },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: sc.ibm.remediate, verify: sc.ibm.verify }
    }
  }

  // KMS / Encryption
  if (fullContext.includes('kms') || fullContext.includes('encrypt') || fullContext.includes('key')) {
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : 'aws kms enable-key-rotation --key-id $KEY_ID', verify: 'aws kms get-key-rotation-status --key-id $KEY_ID' },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: 'az keyvault key set-attributes --vault-name $VAULT --name AppKey --enabled true', verify: 'az keyvault key show --vault-name $VAULT --name AppKey' },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: 'gcloud kms keys update app-key --keyring=app-ring --location=global --rotation-period=2592000s', verify: 'gcloud kms keys describe app-key --keyring=app-ring --location=global' },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: 'oci kms management key update --key-id $KEY_OCID --endpoint $MGMT_ENDPOINT', verify: 'oci kms management key get --key-id $KEY_OCID --endpoint $MGMT_ENDPOINT' },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: 'ibmcloud kp key wrap $ROOT_KEY_ID --plaintext "base64-data"', verify: 'ibmcloud kp keys' }
    }
  }

  // CloudTrail / Audit Logging
  if (fullContext.includes('trail') || fullContext.includes('audit') || fullContext.includes('logging')) {
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : 'aws cloudtrail update-trail --name sec-trail --enable-log-file-validation', verify: 'aws cloudtrail describe-trails' },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: 'az monitor diagnostic-settings create --name LogAnalyticsExport --resource $RESOURCE_ID --workspace $WS_ID', verify: 'az monitor diagnostic-settings list --resource $RESOURCE_ID' },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: 'gcloud logging sinks create central-audit-sink storage.googleapis.com/$LOG_BUCKET --log-filter="logName:cloudaudit.googleapis.com"', verify: 'gcloud logging sinks describe central-audit-sink' },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: 'oci audit configuration update --compartment-id $TENANCY_OCID --retention-period-days 365', verify: 'oci audit configuration get --compartment-id $TENANCY_OCID' },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: 'ibmcloud at service-instances', verify: 'ibmcloud at endpoint list' }
    }
  }

  // GuardDuty / Threat Detection
  if (fullContext.includes('guardduty') || fullContext.includes('threat') || fullContext.includes('alert') || fullContext.includes('security hub')) {
    return {
      aws: { provider: 'aws', cliTool: 'aws', label: 'AWS CLI', command: awsCmd.startsWith('aws') ? awsCmd : 'aws guardduty list-findings --detector-id $DETECTOR_ID', verify: 'aws guardduty get-findings --detector-id $DETECTOR_ID --finding-ids $FINDING_ID' },
      azure: { provider: 'azure', cliTool: 'az', label: 'Azure CLI', command: 'az security alert list --query "[?status==\'Active\']"', verify: 'az security alert show -g $RG -l $LOCATION --name $ALERT_ID' },
      gcp: { provider: 'gcp', cliTool: 'gcloud', label: 'gcloud CLI', command: 'gcloud scc findings list $ORG_ID --filter="state=\"ACTIVE\""', verify: 'gcloud scc findings describe $FINDING_PATH' },
      oci: { provider: 'oci', cliTool: 'oci', label: 'OCI CLI', command: 'oci cloud-guard problem list --compartment-id $COMP_OCID --lifecycle-detail-filter OPEN', verify: 'oci cloud-guard problem get --problem-id $PROBLEM_OCID' },
      ibm: { provider: 'ibm', cliTool: 'ibmcloud', label: 'IBM Cloud CLI', command: 'ibmcloud scc posture finding list', verify: 'ibmcloud scc posture scan list' }
    }
  }

  // Default universal fallback preserving the AWS command and generating equivalent commands
  return {
    aws: {
      provider: 'aws',
      cliTool: 'aws',
      label: 'AWS CLI',
      command: awsCmd,
      verify: 'aws sts get-caller-identity'
    },
    azure: {
      provider: 'azure',
      cliTool: 'az',
      label: 'Azure CLI',
      command: `# Azure CLI Equivalent (${step.title || 'Task'})\n# Review resource group state:\naz group show --name rg-secloudive-prod\n# Execute remediation:\naz resource list --query "[].{Name:name, Type:type, Status:provisioningState}" -o table`,
      verify: 'az account show'
    },
    gcp: {
      provider: 'gcp',
      cliTool: 'gcloud',
      label: 'gcloud CLI',
      command: `# Google Cloud CLI Equivalent (${step.title || 'Task'})\n# Verify project configuration:\ngcloud config list project\n# Execute security assessment:\ngcloud asset search-all-resources --scope="projects/$PROJECT_ID"`,
      verify: 'gcloud auth list'
    },
    oci: {
      provider: 'oci',
      cliTool: 'oci',
      label: 'OCI CLI',
      command: `# Oracle Cloud CLI Equivalent (${step.title || 'Task'})\n# Verify tenancy compartment context:\noci iam compartment list --all\n# Execute compartment resource audit:\noci search resource structured-search --query-text "query all resources where compartmentId = '$COMP_OCID'"`,
      verify: 'oci iam user get --user-id $USER_OCID'
    },
    ibm: {
      provider: 'ibm',
      cliTool: 'ibmcloud',
      label: 'IBM Cloud CLI',
      command: `# IBM Cloud CLI Equivalent (${step.title || 'Task'})\n# Verify targeting & resource group:\nibmcloud target\n# Query active resources in resource group:\nibmcloud resource service-instances`,
      verify: 'ibmcloud account show'
    }
  }
}

export function getMultiCloudConsoleForStep(step = {}, lab = {}) {
  const awsConsole = step.consolePath || 'AWS Management Console'
  return {
    aws: awsConsole,
    azure: 'Azure Portal > Search Resources / Resource Groups > Security Center / Defender for Cloud',
    gcp: 'Google Cloud Console > Navigation Menu > Security > Security Command Center & IAM',
    oci: 'Oracle Cloud Console > Governance & Administration > Identity & Security',
    ibm: 'IBM Cloud Console > Manage > Access (IAM) & Security and Compliance Center'
  }
}
