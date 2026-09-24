/**
 * Real-world historical incident grounding, MITRE ATT&CK Cloud Matrix alignment,
 * interactive AWS CLI terminal commands, and containment order-of-operations protocols
 * for all 25 SeCloudive Security Investigations.
 */

export const investigationDetails = {
  'inv-iam-01': {
    realWorldCase: 'Modeled after CI/CD Pipeline Identity Escalation & Shadow Admin vectors (CircleCI & SolarWinds Cloud Supply Chain)',
    mitre: {
      tactic: 'Privilege Escalation',
      techniqueId: 'T1098.001',
      techniqueName: 'Account Manipulation: Additional Cloud Credentials (iam:PassRole)'
    },
    terminalCommands: [
      {
        cmd: 'aws iam get-role-policy --role-name dev-deployer --policy-name AllowComputeCreation',
        desc: 'Inspect deployer IAM permissions for wildcard PassRole',
        output: JSON.stringify({
          RoleName: 'dev-deployer',
          PolicyName: 'AllowComputeCreation',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AllowComputeCreation',
                Effect: 'Allow',
                Action: ['lambda:CreateFunction', 'lambda:UpdateFunctionCode', 'iam:PassRole'],
                Resource: '*'
              }
            ]
          }
        }, null, 2)
      },
      {
        cmd: 'aws lambda get-function-configuration --function-name payment-sync-worker',
        desc: 'Query execution role bound to suspicious Lambda function',
        output: JSON.stringify({
          FunctionName: 'payment-sync-worker',
          Runtime: 'nodejs20.x',
          Role: 'arn:aws:iam::123456789012:role/AccountAdministrator',
          Handler: 'index.handler',
          State: 'Active',
          LastModified: '2026-09-24T14:22:10.000+0000'
        }, null, 2)
      },
      {
        cmd: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateFunction',
        desc: 'Correlate CloudTrail API event for function creation',
        output: JSON.stringify({
          Events: [
            {
              EventId: 'ct-iam-01-f89a2b',
              EventName: 'CreateFunction',
              EventTime: '2026-09-24T14:22:10Z',
              EventSource: 'lambda.amazonaws.com',
              Username: 'dev-deployer/jordan',
              Resources: [{ ResourceType: 'AWS::Lambda::Function', ResourceName: 'payment-sync-worker' }]
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'An untracked Lambda function was created with AccountAdministrator. What is your minute-0 tactical containment order of operations?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Attach an explicit DenyAll inline policy to the dev-deployer role and execute AWS STS revoke-older-sessions to freeze active tokens immediately.',
          isOptimal: true,
          reasoning: 'Optimal order of operations: Freezes existing compromised sessions instantly without destroying CloudTrail audit attribution.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Delete the dev-deployer IAM role from the AWS console immediately.',
          isOptimal: false,
          reasoning: 'Suboptimal: Deleting the role leaves previously issued temporary STS credentials valid until expiration (up to 1 hour) and breaks audit logs.'
        },
        {
          id: 'opt-3',
          label: 'Option C: Trigger an emergency redeploy of the payment service to overwrite the code.',
          isOptimal: false,
          reasoning: 'Ineffective: Redeploying application code does not address the underlying wildcard PassRole privilege escalation in IAM.'
        }
      ]
    }
  },

  'inv-iam-02': {
    realWorldCase: 'Modeled after the Imperva AWS Snapshot API Key Leak & Stale Root Credentials Abuse',
    mitre: {
      tactic: 'Initial Access',
      techniqueId: 'T1078.004',
      techniqueName: 'Valid Accounts: Cloud Root Accounts'
    },
    terminalCommands: [
      {
        cmd: 'aws iam get-credential-report',
        desc: 'Generate and parse account credential health report',
        output: JSON.stringify({
          user: '<root_account>',
          arn: 'arn:aws:iam::123456789012:root',
          access_key_1_active: 'true',
          access_key_1_last_rotated: '2025-05-30T10:15:00Z',
          access_key_1_last_used_date: '2026-09-24T08:12:00Z',
          mfa_active: 'false'
        }, null, 2)
      },
      {
        cmd: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=root',
        desc: 'Review all recent API calls initiated by the root user',
        output: JSON.stringify({
          Events: [
            {
              EventId: 'ct-root-login-091',
              EventName: 'ConsoleLogin',
              EventTime: '2026-09-24T08:12:00Z',
              SourceIPAddress: '198.51.100.44',
              AdditionalEventData: { MFAUsed: 'No' },
              ResponseElements: { ConsoleLogin: 'Success' }
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Root login detected from an unrecognized IP address without MFA. What is your immediate containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Deactivate and delete all root access keys immediately, reset root password, and enforce hardware FIDO2 MFA.',
          isOptimal: true,
          reasoning: 'Optimal: Root access keys must never exist in production; hardware MFA cuts off unauthorized web console sessions.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Apply an IAM policy denying AdministratorAccess to the root user.',
          isOptimal: false,
          reasoning: 'Fatal flaw: IAM policies cannot deny permissions to the AWS account root user. Root bypasses all account-level IAM policies.'
        }
      ]
    }
  },

  'inv-iam-03': {
    realWorldCase: 'Modeled after the Confused Deputy Vulnerability in Multi-Tenant SaaS integrations (Splunk/Datadog role assumption flaws)',
    mitre: {
      tactic: 'Privilege Escalation',
      techniqueId: 'T1548',
      techniqueName: 'Abuse Elevation Control Mechanism: Confused Deputy'
    },
    terminalCommands: [
      {
        cmd: 'aws iam get-role --role-name VendorSecurityAuditRole',
        desc: 'Inspect vendor cross-account role trust policy for ExternalId condition',
        output: JSON.stringify({
          Role: {
            RoleName: 'VendorSecurityAuditRole',
            Arn: 'arn:aws:iam::123456789012:role/VendorSecurityAuditRole',
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: { AWS: 'arn:aws:iam::999888777666:root' },
                  Action: 'sts:AssumeRole'
                }
              ]
            }
          }
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Vendor cross-account role is being assumed by an unauthorized third party. What is your containment step?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Update trust policy to require a cryptographically unique sts:ExternalId condition shared only with the legitimate vendor tenant.',
          isOptimal: true,
          reasoning: 'Optimal: The ExternalId condition is AWS standard protection against the Confused Deputy problem.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Switch the role from sts:AssumeRole to an IAM user with a permanent access key.',
          isOptimal: false,
          reasoning: 'Bad practice: Cross-account federation should always use roles, not long-lived static credentials.'
        }
      ]
    }
  },

  'inv-iam-04': {
    realWorldCase: 'Modeled after Rhino Security Labs IAM Default Policy Versioning Escalation vectors',
    mitre: {
      tactic: 'Privilege Escalation',
      techniqueId: 'T1098',
      techniqueName: 'Account Manipulation: Default Policy Version Overwrite'
    },
    terminalCommands: [
      {
        cmd: 'aws iam list-policy-versions --policy-arn arn:aws:iam::123456789012:policy/Tier1SupportPolicy',
        desc: 'List all policy versions to find the unauthorized default',
        output: JSON.stringify({
          Versions: [
            { VersionId: 'v1', IsDefaultVersion: false, CreateDate: '2025-01-15T09:00:00Z' },
            { VersionId: 'v2', IsDefaultVersion: true, CreateDate: '2026-09-24T11:00:00Z' }
          ]
        }, null, 2)
      },
      {
        cmd: 'aws iam get-policy-version --policy-arn arn:aws:iam::123456789012:policy/Tier1SupportPolicy --version-id v2',
        desc: 'Examine statements inside newly activated policy version',
        output: JSON.stringify({
          PolicyVersion: {
            Document: {
              Version: '2012-10-17',
              Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }]
            }
          }
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'A tier-1 role promoted itself to AdministratorAccess via CreatePolicyVersion. What is your containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Set default version back to v1, delete v2, and remove iam:SetDefaultPolicyVersion from the role policy.',
          isOptimal: true,
          reasoning: 'Optimal: Immediately drops the effective permissions back to least privilege and eliminates the escalation vector.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Delete the entire policy from the AWS account.',
          isOptimal: false,
          reasoning: 'Risk: Deleting the policy will disrupt legitimate tier-1 support operations.'
        }
      ]
    }
  },

  'inv-iam-05': {
    realWorldCase: 'Modeled after the Uber 2016 AWS S3 GitHub Key Leak & Codecov Supply Chain Credential Theft',
    mitre: {
      tactic: 'Credential Access',
      techniqueId: 'T1552.001',
      techniqueName: 'Unsecured Credentials: Credentials in Source Code'
    },
    terminalCommands: [
      {
        cmd: 'aws iam list-access-keys --user-name cicd-automation-bot',
        desc: 'Audit access keys associated with the leaked CI/CD user',
        output: JSON.stringify({
          AccessKeyMetadata: [
            { UserName: 'cicd-automation-bot', AccessKeyId: 'AKIAIOSFODNN7EXAMPLE', Status: 'Active', CreateDate: '2024-03-01T12:00:00Z' }
          ]
        }, null, 2)
      },
      {
        cmd: 'aws iam update-access-key --user-name cicd-automation-bot --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
        desc: 'Execute immediate containment by disabling leaked access key',
        output: JSON.stringify({ Status: 'SUCCESS', Message: 'Access key AKIAIOSFODNN7EXAMPLE set to Inactive' }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'AWS access keys found exposed in a public GitHub repository. What is the immediate containment order?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Immediately set the access key to Inactive, review CloudTrail for calls made in the last 24h, and migrate CI/CD to GitHub Actions OIDC role assumption.',
          isOptimal: true,
          reasoning: 'Optimal: Inactivating cuts off adversary access immediately while allowing forensics, then removes static credentials permanently with OIDC.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Commit a git revert to remove the key from the repository and keep using it.',
          isOptimal: false,
          reasoning: 'Critical error: Public git history retains commits permanently; automated scanners clone leaked keys in under 60 seconds.'
        }
      ]
    }
  },

  'inv-s3-01': {
    realWorldCase: 'Modeled after the Dow Jones & Booz Allen Hamilton Public S3 Bucket PII Exposures',
    mitre: {
      tactic: 'Exfiltration',
      techniqueId: 'T1530',
      techniqueName: 'Data from Cloud Storage: S3 Public Exposure'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-public-access-block --bucket customer-loan-documents-prod',
        desc: 'Check S3 Block Public Access configuration',
        output: JSON.stringify({
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false
          }
        }, null, 2)
      },
      {
        cmd: 'aws s3api get-bucket-policy --bucket customer-loan-documents-prod',
        desc: 'Inspect S3 bucket policy statements for wildcard principal',
        output: JSON.stringify({
          Statement: [
            {
              Sid: 'PublicReadGetObject',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::customer-loan-documents-prod/*'
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Loan documents containing customer SSNs are openly readable on the public internet. What is your minute-0 containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Execute aws s3api put-public-access-block to enable all 4 S3 Block Public Access flags immediately.',
          isOptimal: true,
          reasoning: 'Optimal: S3 Block Public Access acts as a centralized override circuit breaker, instantly terminating all public reads.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Delete the bucket to protect customer privacy.',
          isOptimal: false,
          reasoning: 'Catastrophic error: Deleting the bucket causes permanent business data loss and prevents forensic incident investigation.'
        }
      ]
    }
  },

  'inv-s3-02': {
    realWorldCase: 'Modeled after Targeted Cloud Ransomware Purging Unversioned S3 Backups & Snapshots',
    mitre: {
      tactic: 'Impact',
      techniqueId: 'T1485',
      techniqueName: 'Data Destruction: S3 Object Deletion without WORM'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-bucket-versioning --bucket ehr-compliance-archive',
        desc: 'Check if object versioning is enabled on the archive bucket',
        output: JSON.stringify({ Status: 'Suspended' }, null, 2)
      },
      {
        cmd: 'aws s3api get-object-lock-configuration --bucket ehr-compliance-archive',
        desc: 'Verify if S3 Object Lock (WORM) retention is configured',
        output: 'An error occurred (ObjectLockConfigurationNotFoundError) when calling the GetObjectLockConfiguration operation: Object Lock configuration does not exist'
      }
    ],
    containmentProtocol: {
      scenario: 'Ransomware threat actor has compromised an admin role and is attempting to delete audit logs. How do you protect the archive?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Enable S3 Versioning, configure S3 Object Lock in Compliance Mode with Retention Period, and enable MFA Delete.',
          isOptimal: true,
          reasoning: 'Optimal: Compliance mode prevents even root from deleting objects during the retention window, defeating ransomware.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Change the bucket name so the attacker cannot find it.',
          isOptimal: false,
          reasoning: 'Ineffective: S3 bucket names cannot be changed; you would have to copy and delete, which increases data loss risk.'
        }
      ]
    }
  },

  'inv-s3-03': {
    realWorldCase: 'Modeled after Healthcare Cloud Breaches Violating HIPAA Encryption & CMK Separation',
    mitre: {
      tactic: 'Defense Evasion',
      techniqueId: 'T1532',
      techniqueName: 'Data Encrypted with Default Provider Keys without Auditable CMK'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-bucket-encryption --bucket genomic-patient-records',
        desc: 'Query default encryption algorithm and KMS key configuration',
        output: JSON.stringify({
          ServerSideEncryptionConfiguration: {
            Rules: [
              {
                ApplyServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256'
                }
              }
            ]
          }
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Patient genomic sequences found stored with default SSE-S3 instead of Customer Managed KMS. What is the remediation?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Deploy an AWS KMS Customer Managed Key (CMK) with annual rotation, update bucket default encryption to aws:kms, and execute S3 Batch Operations to re-encrypt existing objects.',
          isOptimal: true,
          reasoning: 'Optimal: CMK gives audit control in CloudTrail and enforces separation of duties as mandated by HIPAA.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Leave as AES256 because S3 automatically encrypts at rest anyway.',
          isOptimal: false,
          reasoning: 'Non-compliant: SSE-S3 uses AWS-owned keys with no access log visibility or separate key policy access control.'
        }
      ]
    }
  },

  'inv-s3-04': {
    realWorldCase: 'Modeled after Legacy S3 ACL Infiltration in Shared Multi-Tenant Attachments',
    mitre: {
      tactic: 'Initial Access',
      techniqueId: 'T1530',
      techniqueName: 'Data from Cloud Storage: ACL Global Permission'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-bucket-ownership-controls --bucket support-ticket-attachments',
        desc: 'Check S3 Object Ownership settings',
        output: JSON.stringify({
          OwnershipControls: {
            Rules: [{ ObjectOwnership: 'ObjectWriter' }]
          }
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Legacy object ACLs grant global read access on sub-prefixes despite a secure bucket policy. What is the fix?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Set S3 Object Ownership to BucketOwnerEnforced to disable all ACLs and rely exclusively on IAM/Bucket Policies.',
          isOptimal: true,
          reasoning: 'Optimal: BucketOwnerEnforced disables ACLs across all existing and new objects in the bucket permanently.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Run a script to delete the public objects one by one.',
          isOptimal: false,
          reasoning: 'Incomplete: Future uploads with public ACLs will re-introduce the vulnerability.'
        }
      ]
    }
  },

  'inv-s3-05': {
    realWorldCase: 'Modeled after Cleartext Telehealth HTTP Consultation Eavesdropping & Packet Capture',
    mitre: {
      tactic: 'Collection',
      techniqueId: 'T1040',
      techniqueName: 'Network Sniffing: Cleartext S3 HTTP API Traffic'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-bucket-policy --bucket telehealth-video-transcripts',
        desc: 'Inspect bucket policy for explicit aws:SecureTransport deny statement',
        output: JSON.stringify({
          Statement: [
            {
              Sid: 'AllowConsultationAccess',
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::123456789012:role/telehealth-worker' },
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::telehealth-video-transcripts/*'
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Cleartext HTTP traffic observed transmitting clinical audio transcripts to S3. How do you enforce encryption in transit?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Add a bucket policy statement with Effect: Deny where aws:SecureTransport is false.',
          isOptimal: true,
          reasoning: 'Optimal: The aws:SecureTransport condition strictly rejects all non-HTTPS API calls at the S3 API boundary.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Block port 80 at the workstation firewall only.',
          isOptimal: false,
          reasoning: 'Insufficient: Does not enforce transport security at the cloud storage endpoint boundary.'
        }
      ]
    }
  },

  'inv-net-01': {
    realWorldCase: 'Modeled after Payment Processor PCI-DSS Failures Routing Private Database to Internet Gateway',
    mitre: {
      tactic: 'Lateral Movement',
      techniqueId: 'T1599',
      techniqueName: 'Network Boundary Bridging: IGW Route on Private DB Subnet'
    },
    terminalCommands: [
      {
        cmd: 'aws ec2 describe-route-tables --route-table-ids rtb-payment-private',
        desc: 'Dump route table entries to inspect default route target',
        output: JSON.stringify({
          RouteTables: [
            {
              RouteTableId: 'rtb-payment-private',
              Routes: [
                { DestinationCidrBlock: '10.0.0.0/16', GatewayId: 'local', State: 'active' },
                { DestinationCidrBlock: '0.0.0.0/0', GatewayId: 'igw-main-prod', State: 'active' }
              ]
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Payment ledger database subnet route table contains a default route to an Internet Gateway. What is your containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Immediately delete route 0.0.0.0/0 -> igw-main-prod and route outbound traffic through a NAT Gateway in a public subnet.',
          isOptimal: true,
          reasoning: 'Optimal: Restores isolation so the database subnet cannot accept inbound internet connections.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Terminate the Internet Gateway igw-main-prod for the entire VPC.',
          isOptimal: false,
          reasoning: 'High collateral damage: Deleting the IGW takes down all customer-facing web services in the public subnets.'
        }
      ]
    }
  },

  'inv-net-02': {
    realWorldCase: 'Modeled after Enterprise ERP Global SSH/RDP Exposure Leading to Automated Brute Force & Ransomware Ingress',
    mitre: {
      tactic: 'Initial Access',
      techniqueId: 'T1190',
      techniqueName: 'Exploit Public-Facing Application: Remote Management Ports Open to World'
    },
    terminalCommands: [
      {
        cmd: 'aws ec2 describe-security-groups --group-ids sg-0a1b2c3d4e5f67890',
        desc: 'Query ingress rules on bastion management security group',
        output: JSON.stringify({
          SecurityGroups: [
            {
              GroupId: 'sg-0a1b2c3d4e5f67890',
              GroupName: 'sg-bastion-mgmt',
              IpPermissions: [
                { FromPort: 22, ToPort: 22, IpProtocol: 'tcp', IpRanges: [{ CidrIp: '0.0.0.0/0' }] },
                { FromPort: 3389, ToPort: 3389, IpProtocol: 'tcp', IpRanges: [{ CidrIp: '0.0.0.0/0' }] }
              ]
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'EC2 instances under active SSH brute-force attack from hundreds of international IPs. What is your containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Revoke ingress rules for 22 and 3389 from 0.0.0.0/0, terminate bastion instances, and deploy AWS Systems Manager Session Manager.',
          isOptimal: true,
          reasoning: 'Optimal: SSM Session Manager eliminates open inbound ports completely by using outbound HTTPS tunnels via AWS endpoint.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Change the SSH port on the servers from 22 to 2222.',
          isOptimal: false,
          reasoning: 'Security by obscurity: Automated port scanners detect open SSH services on non-standard ports within seconds.'
        }
      ]
    }
  },

  'inv-net-03': {
    realWorldCase: 'Modeled after Lateral Movement in Flat VPC Networks Lacking Security Group Chaining',
    mitre: {
      tactic: 'Lateral Movement',
      techniqueId: 'T1021.002',
      techniqueName: 'Remote Services: Flat Database CIDR Ingress'
    },
    terminalCommands: [
      {
        cmd: 'aws ec2 describe-security-groups --group-ids sg-aurora-db',
        desc: 'Inspect database ingress sources',
        output: JSON.stringify({
          SecurityGroups: [
            {
              GroupId: 'sg-aurora-db',
              IpPermissions: [
                { FromPort: 5432, ToPort: 5432, IpProtocol: 'tcp', IpRanges: [{ CidrIp: '10.0.0.0/16' }] }
              ]
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Staging instance compromised and attempting lateral port 5432 scans against production database. What is your containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Replace the 10.0.0.0/16 CIDR rule with a security group reference (sg-app-tier) and isolate the compromised instance.',
          isOptimal: true,
          reasoning: 'Optimal: Security group chaining ensures only instances explicitly possessing the app security group can talk to port 5432.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Change database master password and restart the database.',
          isOptimal: false,
          reasoning: 'Ineffective: Network path remains open; restarting database causes customer downtime.'
        }
      ]
    }
  },

  'inv-net-04': {
    realWorldCase: 'Modeled after Dev-to-Prod Cross-VPC Peering Sprawl Traversal',
    mitre: {
      tactic: 'Lateral Movement',
      techniqueId: 'T1599',
      techniqueName: 'Network Peering Boundary Traversal'
    },
    terminalCommands: [
      {
        cmd: 'aws ec2 describe-vpc-peering-connections --vpc-peering-connection-ids pcx-dev-prod',
        desc: 'Inspect cross-environment VPC peering connection',
        output: JSON.stringify({
          VpcPeeringConnections: [
            {
              VpcPeeringConnectionId: 'pcx-dev-prod',
              Status: { Code: 'active' },
              RequesterVpcInfo: { VpcId: 'vpc-dev-sandbox', CidrBlock: '10.100.0.0/16' },
              AccepterVpcInfo: { VpcId: 'vpc-prod-main', CidrBlock: '10.0.0.0/16' }
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'A developer laptop or dev instance has direct network reachability to production internal endpoints via peering. What is the containment?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Delete the dev-to-prod VPC peering connection pcx-dev-prod immediately and remove the routes from the production route table.',
          isOptimal: true,
          reasoning: 'Optimal: Strict separation of environments is a foundational principle; non-production should never have uninspected network paths to production.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Ask developers not to ping production IP addresses.',
          isOptimal: false,
          reasoning: 'Relying on honor systems violates Zero Trust architecture.'
        }
      ]
    }
  },

  'inv-net-05': {
    realWorldCase: 'Modeled after Accidental Public IPv4 Exposure on Microservices Subnets Expanding Attack Surface',
    mitre: {
      tactic: 'Discovery',
      techniqueId: 'T1046',
      techniqueName: 'Network Service Discovery: Unintended Public IP Assignment'
    },
    terminalCommands: [
      {
        cmd: 'aws ec2 describe-subnets --subnet-ids subnet-microservices-internal',
        desc: 'Check subnet public IP auto-assignment attribute',
        output: JSON.stringify({
          Subnets: [
            {
              SubnetId: 'subnet-microservices-internal',
              MapPublicIpOnLaunch: true,
              AvailableIpAddressCount: 245
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Internal microservice instances are receiving public IPs automatically upon autoscaling. What is your containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Execute aws ec2 modify-subnet-attribute to disable MapPublicIpOnLaunch on internal subnets.',
          isOptimal: true,
          reasoning: 'Optimal: Prevents any newly launched instances from receiving public IP addresses.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Wait until the next sprint deployment window.',
          isOptimal: false,
          reasoning: 'Leaves internal microservices exposed on the internet to port scanning and automated exploit bots.'
        }
      ]
    }
  },

  'inv-mon-01': {
    realWorldCase: 'Modeled after Targeted APT Intrusions Disabling CloudTrail via StopLogging (Cloud Evasion Tactics)',
    mitre: {
      tactic: 'Defense Evasion',
      techniqueId: 'T1562.008',
      techniqueName: 'Impair Defenses: Disable CloudTrail Audit Logging'
    },
    terminalCommands: [
      {
        cmd: 'aws cloudtrail get-trail-status --name organization-audit-trail',
        desc: 'Verify if CloudTrail is actively recording events',
        output: JSON.stringify({
          IsLogging: false,
          LatestDeliveryTime: '2026-09-24T10:00:00Z',
          StartLoggingTime: '2025-01-01T00:00:00Z',
          StopLoggingTime: '2026-09-24T10:05:00Z'
        }, null, 2)
      },
      {
        cmd: 'aws cloudtrail start-logging --name organization-audit-trail',
        desc: 'Emergency command to re-enable CloudTrail logging',
        output: JSON.stringify({ Status: 'SUCCESS', Message: 'Logging resumed on organization-audit-trail' }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'CloudTrail trail was stopped 4 hours ago and rogue IAM users were created. What is your immediate containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Execute aws cloudtrail start-logging immediately, deploy an AWS Organizations SCP preventing cloudtrail:StopLogging, and isolate rogue IAM users.',
          isOptimal: true,
          reasoning: 'Optimal: Restores telemetry visibility immediately and applies an immutable SCP guardrail that account admins cannot disable.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Delete the trail and create a new one with a different name.',
          isOptimal: false,
          reasoning: 'Bad practice: Deleting the trail can orphan historic event logs and further disrupt audit correlation.'
        }
      ]
    }
  },

  'inv-mon-02': {
    realWorldCase: 'Modeled after the 2019 Capital One Breach Exfiltrating Millions of Records Without S3 Data Events Monitored',
    mitre: {
      tactic: 'Exfiltration',
      techniqueId: 'T1537',
      techniqueName: 'Transfer Data to Cloud Account: Unlogged S3 Sync'
    },
    terminalCommands: [
      {
        cmd: 'aws cloudtrail get-event-selectors --trail-name prod-mgmt-trail',
        desc: 'Audit event selectors to verify if S3 Data Events are configured',
        output: JSON.stringify({
          TrailARN: 'arn:aws:cloudtrail:us-east-1:123456789012:trail/prod-mgmt-trail',
          EventSelectors: [
            {
              ReadWriteType: 'All',
              IncludeManagementEvents: true,
              DataResources: []
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'GuardDuty flags anomalous S3 egress volume, but CloudTrail has no record of which specific files were read. What is the fix?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Configure CloudTrail Data Events for arn:aws:s3:::customer-kyc-scans/* and enable S3 Server Access Logging immediately.',
          isOptimal: true,
          reasoning: 'Optimal: Enables object-level GetObject and PutObject telemetry required to prove which records were accessed.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Turn off S3 bucket encryption to see the files.',
          isOptimal: false,
          reasoning: 'Absurd action: Weakens security posture and does nothing to generate audit telemetry.'
        }
      ]
    }
  },

  'inv-mon-03': {
    realWorldCase: 'Modeled after Local Account Compromise Tampering with Colocated CloudTrail S3 Bucket Evidence',
    mitre: {
      tactic: 'Defense Evasion',
      techniqueId: 'T1070',
      techniqueName: 'Indicator Removal: S3 Audit Log Bucket Deletion'
    },
    terminalCommands: [
      {
        cmd: 'aws s3api get-bucket-policy --bucket security-cloudtrail-logs-123456789012',
        desc: 'Inspect audit bucket policy for delete restrictions',
        output: JSON.stringify({
          Statement: [
            {
              Sid: 'AllowCloudTrailWrites',
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Action: 's3:PutObject',
              Resource: 'arn:aws:s3:::security-cloudtrail-logs-123456789012/*'
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'CloudTrail audit logs are stored in the same account being monitored, and an admin can delete them. What is the architecture fix?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Centralize CloudTrail logs into a dedicated, isolated Log Archive AWS account with Object Lock and SCP denying s3:Delete* to all principals.',
          isOptimal: true,
          reasoning: 'Optimal AWS Multi-Account Best Practice: Prevents a compromised workload account from tampering with its own audit logs.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Keep logs in the same account but hide the bucket.',
          isOptimal: false,
          reasoning: 'Security through obscurity fails; root and admin credentials list all buckets in the account.'
        }
      ]
    }
  },

  'inv-mon-04': {
    realWorldCase: 'Modeled after 90-Day Silent Cloud Intrusions Due to Passive Logging Without Metric Alarms',
    mitre: {
      tactic: 'Defense Evasion',
      techniqueId: 'T1562',
      techniqueName: 'Impair Defenses: Absence of Proactive Security Hub / CloudWatch Alarms'
    },
    terminalCommands: [
      {
        cmd: 'aws logs describe-metric-filters --log-group-name /aws/cloudtrail/prod',
        desc: 'List active metric filters on the CloudTrail log group',
        output: JSON.stringify({ MetricFilters: [] }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Logs are stored in CloudWatch but no alerts fire when root logs in or security groups are modified. What is the immediate fix?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Deploy CIS AWS Foundations Benchmark metric filters for RootUsage, UnauthorizedAPICalls, and SecurityGroupChanges mapped to CloudWatch alarms with PagerDuty/SNS routing.',
          isOptimal: true,
          reasoning: 'Optimal: Automates real-time detection for high-severity security events rather than waiting for post-breach audits.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Hire an analyst to manually refresh CloudTrail console 24/7.',
          isOptimal: false,
          reasoning: 'Unscalable and error-prone; automated alerting is the cloud security standard.'
        }
      ]
    }
  },

  'inv-mon-05': {
    realWorldCase: 'Modeled after Attackers Deploying Workloads in Unmonitored Secondary AWS Regions to Evade Detection',
    mitre: {
      tactic: 'Defense Evasion',
      techniqueId: 'T1535',
      techniqueName: 'Unused/Unsupported Cloud Regions: Secondary Region Workload Deployment'
    },
    terminalCommands: [
      {
        cmd: 'aws guardduty list-detectors --region us-east-1',
        desc: 'Verify GuardDuty detector status in primary region',
        output: JSON.stringify({ DetectorIds: ['d-useast1-active-detector'] }, null, 2)
      },
      {
        cmd: 'aws guardduty list-detectors --region eu-west-1',
        desc: 'Verify GuardDuty detector status in secondary region',
        output: JSON.stringify({ DetectorIds: [] }, null, 2)
      },
      {
        cmd: 'aws ec2 describe-instances --region eu-west-1',
        desc: 'Inspect running compute instances in secondary region',
        output: JSON.stringify({
          Reservations: [
            {
              Instances: [
                { InstanceId: 'i-0987654321fedcba0', InstanceType: 'g4dn.metal', State: { Name: 'running' } }
              ]
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Crypto-mining GPU instances running in eu-west-1 where GuardDuty is disabled. What is the containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Terminate rogue EC2 instances in eu-west-1, enable GuardDuty in all commercial regions via AWS Organizations delegated admin, and deploy an SCP restricting regions to approved list.',
          isOptimal: true,
          reasoning: 'Optimal: Shuts down unauthorized compute, activates detection across all regions, and restricts account usage to approved regions.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Stop the instances and leave GuardDuty disabled in eu-west-1 to save money.',
          isOptimal: false,
          reasoning: 'Leaves the regional blind spot active; attackers will simply restart or launch in another unmonitored region.'
        }
      ]
    }
  },

  'inv-arc-01': {
    realWorldCase: 'Modeled after Early-Stage Startup Monolith Compromises (Public DB + Flat Security Group)',
    mitre: {
      tactic: 'Initial Access',
      techniqueId: 'T1190',
      techniqueName: 'Exploit Public-Facing Application: Direct DB Subnet Exposure'
    },
    terminalCommands: [
      {
        cmd: 'aws rds describe-db-subnets --db-subnet-group-name db-subnets-main',
        desc: 'Inspect subnets assigned to RDS database cluster',
        output: JSON.stringify({
          Subnets: [
            { SubnetIdentifier: 'subnet-public-web-a', SubnetAvailabilityZone: { Name: 'us-east-1a' } }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Production customer credit card database is running in a public subnet with direct internet routing. How do you migrate it safely?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Take an RDS snapshot, restore to a new DB Subnet Group restricted to private subnets with no IGW route, and enforce security group chaining from web tier.',
          isOptimal: true,
          reasoning: 'Optimal: Re-architects database into private tier without direct internet access while preserving data integrity.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Delete the public subnet while the database is running inside it.',
          isOptimal: false,
          reasoning: 'AWS prevents deleting subnets with active ENIs; attempting to force delete disrupts live database connections.'
        }
      ]
    }
  },

  'inv-arc-02': {
    realWorldCase: 'Modeled after Multi-Tenant SaaS Isolation Failures via Wildcard DynamoDB IAM Policies',
    mitre: {
      tactic: 'Privilege Escalation',
      techniqueId: 'T1078.004',
      techniqueName: 'Valid Accounts: Cross-Tenant Cloud Account Delegation'
    },
    terminalCommands: [
      {
        cmd: 'aws iam get-role-policy --role-name TenantDataWorkerRole --policy-name DynamoDBAccess',
        desc: 'Inspect DynamoDB policy for tenant partitioning conditions',
        output: JSON.stringify({
          Statement: [
            {
              Effect: 'Allow',
              Action: ['dynamodb:GetItem', 'dynamodb:Query'],
              Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/TenantData'
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Tenant A was able to read Tenant B records by passing a modified tenantID parameter. What is the architecture fix?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Enforce dynamodb:LeadingKeys condition matching the validated JWT tenant claim or adopt AWS STS dynamic session tagging with tenant policy variables.',
          isOptimal: true,
          reasoning: 'Optimal: DynamoDB LeadingKeys cryptographically restricts the IAM session to only query partition keys matching the authenticated tenant.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Ask the frontend React app to validate the tenantID.',
          isOptimal: false,
          reasoning: 'Frontend validation is easily bypassed with curl or Postman; security must be enforced in the authorization boundary.'
        }
      ]
    }
  },

  'inv-arc-03': {
    realWorldCase: 'Modeled after Public Serverless Function URL Floods ($14,000 DDoS Billing Spike)',
    mitre: {
      tactic: 'Impact',
      techniqueId: 'T1498',
      techniqueName: 'Network Denial of Service: Unthrottled Lambda Function URL'
    },
    terminalCommands: [
      {
        cmd: 'aws lambda get-function-url-config --function-name public-user-registration',
        desc: 'Inspect Lambda function URL authentication and CORS settings',
        output: JSON.stringify({
          FunctionUrl: 'https://a1b2c3d4e5.lambda-url.us-east-1.on.aws/',
          AuthType: 'NONE',
          Cors: { AllowOrigins: ['*'] }
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Public function URL under heavy HTTP flood causing 4M invocations and massive AWS billing spike. What is the immediate containment?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Set Lambda reserved concurrency to an emergency cap (e.g. 50), place AWS CloudFront + AWS WAF with rate-based rules in front, and restrict direct URL access.',
          isOptimal: true,
          reasoning: 'Optimal: Caps concurrency immediately to stop runaway AWS billing, and routes traffic through WAF rate-limiting.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Increase AWS account concurrency limit to handle the load.',
          isOptimal: false,
          reasoning: 'Exacerbates the financial denial of service attack by allowing millions more unauthorized invocations.'
        }
      ]
    }
  },

  'inv-arc-04': {
    realWorldCase: 'Modeled after the Tesla Kubernetes Dashboard Cryptomining Breach (IMDSv1 & Admin Node Instance Profile)',
    mitre: {
      tactic: 'Privilege Escalation',
      techniqueId: 'T1552.005',
      techniqueName: 'Cloud Instance Metadata API / Over-Privileged Worker Nodes'
    },
    terminalCommands: [
      {
        cmd: 'aws eks describe-cluster --name prod-microservices-eks',
        desc: 'Check EKS control plane API endpoint network exposure',
        output: JSON.stringify({
          cluster: {
            name: 'prod-microservices-eks',
            resourcesVpcConfig: {
              endpointPublicAccess: true,
              publicAccessCidrs: ['0.0.0.0/0']
            }
          }
        }, null, 2)
      },
      {
        cmd: 'aws iam list-attached-role-policies --role-name eks-worker-node-instance-role',
        desc: 'Audit IAM policies attached to EKS worker node EC2 profile',
        output: JSON.stringify({
          AttachedPolicies: [
            { PolicyName: 'AdministratorAccess', PolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess' }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Attacker compromised a pod and retrieved full AdministratorAccess keys from http://169.254.169.254. What is the containment action?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Detach AdministratorAccess from worker nodes, enforce IMDSv2 with hop-limit=1, adopt IAM Roles for Service Accounts (IRSA), and restrict EKS control plane to private/VPN CIDRs.',
          isOptimal: true,
          reasoning: 'Optimal: IRSA grants least privilege per pod, IMDSv2 hop-limit=1 stops pod metadata theft, and private control plane blocks public access.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Kill the compromised pod and leave the node instance profile as AdministratorAccess.',
          isOptimal: false,
          reasoning: 'Any other pod scheduled on the cluster can immediately re-steal AdministratorAccess via the metadata service.'
        }
      ]
    }
  },

  'inv-arc-05': {
    realWorldCase: 'Modeled after Catastrophic Single-Account Takeover Purging Primary DB and Colocated Backup Vault',
    mitre: {
      tactic: 'Impact',
      techniqueId: 'T1485',
      techniqueName: 'Data Destruction: Single-Account Backup Vault Purge'
    },
    terminalCommands: [
      {
        cmd: 'aws backup list-backup-vaults',
        desc: 'List AWS Backup vaults and check cross-account replication',
        output: JSON.stringify({
          BackupVaultList: [
            {
              BackupVaultName: 'DefaultVault',
              BackupVaultArn: 'arn:aws:backup:us-east-1:123456789012:backup-vault:DefaultVault',
              NumberOfRecoveryPoints: 142
            }
          ]
        }, null, 2)
      }
    ],
    containmentProtocol: {
      scenario: 'Compromised admin keys used to initiate deletion of all production RDS databases and local backup vaults. How do you design disaster recovery?',
      options: [
        {
          id: 'opt-1',
          label: 'Option A: Configure AWS Backup cross-account copying to an isolated Disaster Recovery account with AWS Backup Vault Lock in Compliance Mode.',
          isOptimal: true,
          reasoning: 'Optimal: Vault Lock in compliance mode prevents anyone (even root in the workload account) from deleting backups during retention period.'
        },
        {
          id: 'opt-2',
          label: 'Option B: Keep backups in the same account but assign them a secret tag.',
          isOptimal: false,
          reasoning: 'Compromised admin credentials have full DeleteBackup and DeleteSnapshot permissions regardless of tags.'
        }
      ]
    }
  }
}
