// Path 3: Network Security
export const networkPath = {
  id: 'network',
  title: 'Network Security (Amazon VPC)',
  shortTitle: 'Network Security',
  icon: 'Network',
  accentColor: '#a78bfa',
  badge: 'Domain 03',
  level: 'Beginner to Advanced',
  estimatedTime: '2 hrs 45 mins',
  description: 'Design and defend isolated cloud networks. Master VPC CIDR planning, public vs. private vs. isolated subnets, stateful Security Groups vs. stateless NACLs, Transit Gateway hubs, and zero-bastion private networking via AWS PrivateLink and SSM Session Manager.',
  whyItMatters: 'A compromised application cannot exfiltrate data or reach your internal database if strict network boundaries, private endpoints, and stateful micro-segmentation block all unauthorized ingress and egress traffic.',
  topics: [
    {
      id: 'vpc-basics',
      title: 'VPC Basics, CIDRs & Routing',
      pathId: 'network',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Core Networking',
      summary: 'Understand Amazon Virtual Private Cloud (VPC) fundamentals: RFC 1918 CIDR blocks, route tables, default gateways, and connecting VPCs via Peering vs. Transit Gateway.',
      overview: `An Amazon Virtual Private Cloud (VPC) is a logically isolated virtual network dedicated to your AWS account. It closely resembles a traditional physical network that you\'d operate in your own data center, with the benefits of using AWS\'s scalable infrastructure.

**Core VPC Components**:
1. **CIDR Block (Classless Inter-Domain Routing)**: Defines the range of private IPv4 addresses (RFC 1918) for the VPC (e.g., \`10.0.0.0/16\` providing 65,536 IP addresses).
2. **Subnets**: Subdivisions of the VPC assigned to specific Availability Zones (AZs).
3. **Route Tables**: Sets of rules (called routes) that determine where network traffic from your subnet or gateway is directed. Every VPC has a default Route Table containing a local route (\`10.0.0.0/16 -> local\`) that allows all subnets within the VPC to communicate with each other.
4. **Internet Gateway (IGW)**: A horizontally scaled, redundant VPC component that enables communication between your VPC and the internet.
5. **Connecting Multiple VPCs**:
   - **VPC Peering**: Direct point-to-point connection between two VPCs. Non-transitive (if A peers with B, and B peers with C, A CANNOT talk to C through B).
   - **AWS Transit Gateway (TGW)**: A central cloud router hub that connects hundreds of VPCs and on-premises networks in a hub-and-spoke topology with transitive routing and centralized inspection.`,
      whyItMatters: 'Network topology dictates your blast radius. Proper CIDR planning prevents IP overlap with corporate on-premises networks, and segmented route tables prevent private databases from accidentally routing directly to the public internet.',
      securityRisks: [
        'Overlapping CIDR blocks making future site-to-site VPN or Transit Gateway peering impossible.',
        'Accidentally adding a `0.0.0.0/0 -> igw` route to a private subnet\'s route table, instantly exposing private instances to internet scans.',
        'Sprawling point-to-point VPC peering connections creating an unmanageable and un-auditable network mesh.',
        'Default VPC usage in production: the default VPC has all subnets public with an attached Internet Gateway.'
      ],
      bestPractices: [
        'Never use the default VPC for production workloads; delete or strictly quarantine default VPCs.',
        'Adopt standard RFC 1918 CIDR blocks (e.g., `10.x.0.0/16` or `172.16.x.0/16`) carefully coordinated with corporate IT.',
        'Use separate Route Tables for Public, Private, and Isolated subnets.',
        'Centralize multi-VPC and hybrid-cloud routing through AWS Transit Gateway with dedicated security inspection VPCs.'
      ],
      keyTakeaways: [
        'VPC CIDRs cannot overlap if you plan to connect them via Peering, Transit Gateway, or VPN.',
        'Every VPC has a default local route that cannot be deleted; all subnets in a VPC can reach each other by default.',
        'VPC Peering is non-transitive; Transit Gateway is transitive and acts as a central cloud router.',
        'Delete the default VPC in all regions to prevent accidental shadow deployments.'
      ],
      diagram: `
+---------------------------------------------------------------------------------+
|                               AWS VPC (10.0.0.0/16)                             |
|                                                                                 |
|   +--------------------------+                 +----------------------------+   |
|   |   Public Subnet (AZ-A)   |                 |   Private Subnet (AZ-A)    |   |
|   |      10.0.1.0/24         |                 |       10.0.10.0/24         |   |
|   |                          |                 |                            |   |
|   |  +--------------------+  |                 |  +----------------------+  |   |
|   |  | Public Load Balancer| |                 |  | Application EC2 / ECS|  |   |
|   |  +--------------------+  |                 |  +----------------------+  |   |
|   |            |             |                 |             |              |   |
|   +------------|-------------+                 +-------------|--------------+   |
|                v                                             v                  |
|       +-----------------+                           +------------------+        |
|       | Public Route    |                           | Private Route    |        |
|       | 0.0.0.0/0 -> IGW|                           | 0.0.0.0/0 -> NAT |        |
|       +-----------------+                           +------------------+        |
|                |                                             |                  |
+----------------|---------------------------------------------|------------------+
                 v                                             v
         +---------------+                             +---------------+
         |InternetGateway|                             |  NAT Gateway  |
         +---------------+                             +---------------+
                 |                                             |
                 +===================[ INTERNET ]==============+
`,
      realWorldScenario: {
        title: 'The Default VPC Production Disaster',
        incident: 'A development team deployed a production PostgreSQL database into the default VPC of an AWS region to meet a deadline. Because the default VPC assigns public IP addresses and attaches directly to an Internet Gateway, the database received a public IPv4 address. Within 72 hours, automated port 5432 scanners brute-forced the default database password and wiped the tables.',
        impact: 'Loss of 3 weeks of customer order transactions and public embarrassment.',
        detectionMethod: 'GuardDuty Recon:EC2/Portscan and UnauthorizedAccess:EC2/TorIP findings alerted the security team.'
      },
      commonBeginnerMistakes: [
        'Deploying production workloads into the Default VPC instead of creating a custom, properly segmented VPC.',
        'Assuming that removing an Internet Gateway from a route table immediately disconnects active connections.',
        'Attempting to peer VPCs with overlapping CIDR ranges (e.g., both using `10.0.0.0/16`).',
        'Confusing VPC Peering with Transit Gateway.'
      ],
      whatACloudSecEngineerChecks: [
        'Check for presence of active resources in Default VPCs: `aws ec2 describe-instances --filters "Name=vpc-id,Values=<default-vpc-id>"`.',
        'Verify route tables to confirm private subnets do NOT have routes to `igw-*`: `aws ec2 describe-route-tables`.',
        'Check Transit Gateway route tables for cross-environment traffic leakage (e.g., Dev to Prod).',
        'Audit Flow Logs: verify VPC Flow Logs are enabled on all production VPCs.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Audit Route Tables for Accidental Internet Gateway Exposure',
        code: `# Find all route tables that route 0.0.0.0/0 directly to an Internet Gateway (Public Route Tables)
aws ec2 describe-route-tables \\
    --query "RouteTables[*].{RouteTableId:RouteTableId,VpcId:VpcId,PublicRoutes:Routes[?DestinationCidrBlock=='0.0.0.0/0' && starts_with(GatewayId, 'igw-')]}" \\
    --output table`
      },
      interviewQuestions: [
        {
          question: 'What is the difference between VPC Peering and AWS Transit Gateway, and when would you choose one over the other?',
          interviewerRationale: 'Assesses cloud network architecture, scalability limits, and enterprise connectivity design.',
          modelAnswer: 'VPC Peering provides direct, encrypted, 1-to-1 connections between two VPCs using AWS private backbone networking with zero bandwidth bottleneck and no hourly charge (only inter-AZ data transfer fees). However, peering is non-transitive, creating an N*(N-1)/2 mesh complexity that is unmanageable across dozens of VPCs. AWS Transit Gateway acts as a central cloud router (hub-and-spoke) supporting transitive routing between thousands of VPCs, VPNs, and Direct Connect links. You choose VPC Peering for simple, high-bandwidth 1-to-1 relationships between 2-3 VPCs; you choose Transit Gateway for enterprise multi-VPC architectures requiring centralized routing, inspection firewalls, and hybrid on-premises connectivity.'
        },
        {
          question: 'What happens if you need to peer two VPCs that both have the CIDR block 10.0.0.0/16?',
          interviewerRationale: 'Tests core IP routing knowledge and whether the candidate understands AWS network constraints.',
          modelAnswer: 'AWS strictly prohibits establishing a VPC Peering connection between VPCs with matching or overlapping CIDR blocks. To connect workloads between them without redesigning IP spaces, you must use PrivateLink (publishing services as endpoint services) which uses private NAT, or deploy a Transit Gateway with Private NAT Gateways performing bidirectional Network Address Translation (NAT) to remap the IP addresses.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Amazon VPC Fundamentals and Architecture',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Amazon VPC User Guide and Core Concepts',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Well-Architected Framework: Reliability and Networking Best Practices',
          url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/networking.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'VPC A is peered with VPC B. VPC B is peered with VPC C. Can an EC2 instance in VPC A send packets to an EC2 instance in VPC C through VPC B?',
        options: [
          { id: 'a', text: 'Yes, because VPC peering is transitive by default in AWS.', isCorrect: false, explanation: 'VPC Peering is strictly non-transitive.' },
          { id: 'b', text: 'No, because VPC peering connections do not support transitive routing; a direct peering connection between A and C, or an AWS Transit Gateway, is required.', isCorrect: true, explanation: 'Correct! VPC Peering does not allow traffic to transit through an intermediate VPC.' },
          { id: 'c', text: 'Yes, provided both instances have public IP addresses.', isCorrect: false, explanation: 'Public IP traffic routes over the internet, not through the peering connection.' },
          { id: 'd', text: 'Yes, if you configure a NAT Gateway inside VPC B.', isCorrect: false, explanation: 'NAT Gateways cannot route peering traffic between peer VPCs.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-net-01',
        title: 'Investigation: Route Table Misconfiguration Exposing Private Database',
        url: '/investigations',
        description: 'Triage an incident where a private subnet route table was modified to route directly to an IGW.'
      }
    },
    {
      id: 'subnets',
      title: 'Subnets (Public, Private & Isolated)',
      pathId: 'network',
      level: 'Beginner',
      estimatedTime: '18 min read • 5 min check',
      badge: 'Segmentation',
      summary: 'Design 3-tier enterprise subnet architectures: Public (DMZ), Private (App), and Isolated (Database). Understand Multi-AZ resilience and reserved AWS IP addresses.',
      overview: `A **Subnet** is a range of IP addresses within a VPC mapped to a single specific Availability Zone (AZ). Subnets cannot span multiple AZs, which is why Multi-AZ fault tolerance requires creating subnets across at least two distinct AZs (e.g., us-east-1a and us-east-1b).

**The 5 Reserved IP Addresses in Every AWS Subnet**:
In every AWS subnet, the first 4 and last 1 IP addresses are reserved and cannot be assigned to instances:
- \`10.0.1.0\`: Network address.
- \`10.0.1.1\`: Reserved by AWS for the VPC router.
- \`10.0.1.2\`: Reserved by AWS for DNS (AmazonProvidedDNS).
- \`10.0.1.3\`: Reserved by AWS for future use.
- \`10.0.1.255\`: Network broadcast address (AWS does not support broadcast, but reserves it).
*(A /24 subnet has 256 total addresses, but only 251 usable).*

**The 3-Tier Enterprise Subnet Design**:
1. **Public Subnet (Tier 1 - DMZ)**:
   - Route table has a route \`0.0.0.0/0 -> igw-xxxx\`.
   - Hosts public-facing Application Load Balancers (ALBs) and NAT Gateways.
   - NO backend applications or databases should EVER live here.
2. **Private Subnet with Egress (Tier 2 - Application)**:
   - Route table has a route \`0.0.0.0/0 -> nat-xxxx\`.
   - Backend EC2, ECS tasks, and Kubernetes nodes live here.
   - Can reach the internet for software updates and API calls, but the internet CANNOT initiate incoming connections.
3. **Isolated / Database Subnet (Tier 3 - Data)**:
   - Route table has **NO** route to an IGW or NAT Gateway (\`0.0.0.0/0\` does not exist).
   - Only has the local VPC route (\`10.0.0.0/16 -> local\`) and routes to VPC Endpoints.
   - Hosts RDS, Aurora, ElastiCache, and internal HSMs. Completely unreachable from the internet.`,
      whyItMatters: 'Placing databases in truly isolated subnets guarantees that even if a NAT gateway is misconfigured or compromised, an attacker cannot open an outbound reverse shell from the database layer to exfiltrate data.',
      securityRisks: [
        'Deploying databases into public subnets with "Auto-assign public IP" enabled.',
        'Running out of IP addresses in a small subnet (/28 has only 11 usable IPs), crashing auto-scaling groups.',
        'Deploying all subnets in a single Availability Zone, causing a total outage during an AZ hardware failure.',
        'Connecting database subnets to NAT Gateways when they should be completely isolated.'
      ],
      bestPractices: [
        'Deploy workloads across a minimum of 2 Availability Zones (preferably 3) for high availability.',
        'Enforce 3 distinct subnet tiers: Public, Private with NAT, and Isolated Database.',
        'Size subnets appropriately: use /20 or /22 for application tiers to avoid IP exhaustion during container scale-outs.',
        'Disable "Auto-assign public IPv4 address" on all private and database subnets.'
      ],
      keyTakeaways: [
        'AWS reserves 5 IP addresses in every subnet (.0, .1, .2, .3, and .255).',
        'Subnets reside in exactly ONE Availability Zone; deploy in at least 2 AZs for Multi-AZ.',
        'Public subnets route to an IGW; Private subnets route to a NAT Gateway; Isolated subnets have no internet route.',
        'Never place production databases in subnets with an internet route.'
      ],
      diagram: `
+---------------------------------------------------------------------------------------------------+
|                                      3-TIER SUBNET ARCHITECTURE                                   |
|                                                                                                   |
|  [ Availability Zone A ]                                    [ Availability Zone B ]               |
|  +-------------------------------------+                    +----------------------------------+  |
|  | Tier 1: Public Subnet (10.0.1.0/24) |                    | Tier 1: Public Subnet (10.0.2.0) |  |
|  | - Internet-Facing ALB               |                    | - Internet-Facing ALB            |  |
|  | - NAT Gateway AZ-A                  |                    | - NAT Gateway AZ-B               |  |
|  | Route: 0.0.0.0/0 -> IGW             |                    | Route: 0.0.0.0/0 -> IGW          |  |
|  +-------------------------------------+                    +----------------------------------+  |
|                     |                                                         |                   |
|                     v                                                         v                   |
|  +-------------------------------------+                    +----------------------------------+  |
|  | Tier 2: Private Subnet (10.0.11.0)  |                    | Tier 2: Private Subnet (10.0.12) |  |
|  | - App EC2 / ECS / EKS Pods          |                    | - App EC2 / ECS / EKS Pods       |  |
|  | Route: 0.0.0.0/0 -> NAT-GW-A        |                    | Route: 0.0.0.0/0 -> NAT-GW-B     |  |
|  +-------------------------------------+                    +----------------------------------+  |
|                     |                                                         |                   |
|                     v                                                         v                   |
|  +-------------------------------------+                    +----------------------------------+  |
|  | Tier 3: Isolated Subnet (10.0.21.0) |                    | Tier 3: Isolated Subnet (10.0.22)|  |
|  | - Aurora / RDS Database (Primary)   |                    | - Aurora / RDS (Standby Replica) |  |
|  | Route: Local VPC Only (NO NAT/IGW)  |                    | Route: Local VPC Only (NO NAT)   |  |
|  +-------------------------------------+                    +----------------------------------+  |
+---------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Database Reverse-Shell Exfiltration',
        incident: 'An internal database cluster was deployed into a "private" subnet that had an outbound route to a NAT Gateway. An attacker exploited a SQL injection flaw in a stored procedure to execute OS commands. Because outbound internet access via NAT was active, the script opened a reverse shell to an attacker-controlled command-and-control (C2) server in Eastern Europe and streamed 80GB of customer financial records.',
        impact: 'Exfiltration of sensitive customer data that would have been physically impossible had the database lived in an Isolated Subnet.',
        detectionMethod: 'GuardDuty Backdoor:EC2/C&CActivity.B!DNS finding alerted on unusual outbound DNS tunneling from the database instance.'
      },
      commonBeginnerMistakes: [
        'Creating subnets with `/28` CIDR blocks (16 IPs minus 5 reserved = only 11 usable IPs), quickly causing deployment failures.',
        'Putting NAT Gateways in private subnets (NAT Gateways must be in Public Subnets with an Elastic IP to function!).',
        'Believing that private subnets are isolated from each other (all subnets in a VPC can communicate via the default local route unless blocked by Security Groups or NACLs).',
        'Not configuring Route 53 private hosted zones for internal DNS.'
      ],
      whatACloudSecEngineerChecks: [
        'Audit subnets for "MapPublicIpOnLaunch" flag: `aws ec2 describe-subnets --query "Subnets[*].{ID:SubnetId,AutoPublicIP:MapPublicIpOnLaunch}"`.',
        'Verify database subnet route tables have zero entries for `0.0.0.0/0`.',
        'Check available IP address headroom in subnets: check `AvailableIpAddressCount` via CLI.',
        'Verify Multi-AZ distribution: ensure each tier spans at least 2 distinct Availability Zone IDs.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Check Subnet IP Headroom and Public IP Assignment',
        code: `# Inspect all subnets for remaining usable IP addresses and auto-assign public IP status
aws ec2 describe-subnets \\
    --query "Subnets[*].{SubnetId:SubnetId,CIDR:CidrBlock,AZ:AvailabilityZone,AvailableIPs:AvailableIpAddressCount,PublicIpOnLaunch:MapPublicIpOnLaunch}" \\
    --output table`
      },
      interviewQuestions: [
        {
          question: 'How many usable IP addresses are available in an AWS subnet with a /28 CIDR block, and why?',
          interviewerRationale: 'Tests whether the candidate knows fundamental AWS networking constraints and reserved IPs.',
          modelAnswer: 'A /28 CIDR block has 16 total IP addresses (2^(32-28) = 16). However, AWS reserves 5 IP addresses in every subnet: the network address (.0), the VPC router (.1), the AmazonProvidedDNS server (.2), a future use reservation (.3), and the network broadcast address (.255 or the last address). Therefore, 16 - 5 = 11 usable IP addresses.'
        },
        {
          question: 'What is the architectural distinction between a Private Subnet and an Isolated Subnet?',
          interviewerRationale: 'Evaluates network segmentation rigor and data protection design.',
          modelAnswer: 'A Private Subnet has an outbound default route (0.0.0.0/0) pointing to a NAT Gateway or egress firewall in a public subnet. Instances in private subnets cannot be reached directly from the internet, but they CAN initiate outbound connections to the internet (e.g. for yum updates or external API calls). An Isolated Subnet (or Database Subnet) has NO outbound route to the internet whatsoever (no IGW, no NAT Gateway). Instances in isolated subnets can only communicate with other subnets in the VPC or via VPC Endpoints, preventing reverse-shell attacks and data exfiltration.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Subnet Design and Routing Patterns',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Subnets in Amazon VPC',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Reference: Designing a Multi-Tier Secure VPC Architecture',
          url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/secure-vpc-architecture-design/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Where must a NAT Gateway be deployed in order for instances in private subnets to access the internet?',
        options: [
          { id: 'a', text: 'In the private subnet alongside the application instances.', isCorrect: false, explanation: 'A NAT Gateway in a private subnet has no route to the internet and cannot function.' },
          { id: 'b', text: 'In a public subnet that has a route table entry pointing 0.0.0.0/0 to an Internet Gateway, with an Elastic IP attached.', isCorrect: true, explanation: 'Correct! The NAT Gateway must reside in a public subnet with an EIP to translate private traffic onto the public internet.' },
          { id: 'c', text: 'Directly inside the AWS Transit Gateway.', isCorrect: false, explanation: 'Transit Gateways route packets; they do not host NAT Gateways directly.' },
          { id: 'd', text: 'In an isolated database subnet.', isCorrect: false, explanation: 'Isolated subnets have no internet routes.' }
        ]
      },
      bridgeToLabs: {
        type: 'Lab',
        id: 'lab-05',
        title: 'Real Lab: Building a 3-Tier Multi-AZ VPC Architecture',
        url: '/labs',
        description: 'Provision public, private, and isolated database subnets across multiple availability zones.'
      }
    },
    {
      id: 'security-groups',
      title: 'Security Groups (Stateful Microsegmentation)',
      pathId: 'network',
      level: 'Intermediate',
      estimatedTime: '22 min read • 6 min check',
      badge: 'Microsegmentation',
      summary: 'Master virtual firewalls at the ENI level. Understand stateful connection tracking, return traffic handling, rule limits, and Security Group referencing to eliminate static IP dependencies.',
      overview: `A **Security Group** acts as a virtual firewall for your EC2 instances, Lambda functions, RDS databases, and Elastic Network Interfaces (ENIs) to control incoming and outgoing traffic.

**Core Security Group Characteristics**:
1. **Stateful**: If you send an outbound request from your instance, the response traffic for that request is allowed to flow in automatically, regardless of inbound security group rules. Similarly, responses to allowed inbound traffic are allowed to flow out automatically.
2. **Allow Rules Only**: You cannot write a "Deny" rule in a Security Group. By default, all inbound traffic is blocked until explicitly allowed.
3. **Applied at the ENI Level**: Security Groups are evaluated at the hypervisor Elastic Network Interface (ENI) layer before traffic reaches the operating system.
4. **Security Group Referencing (Chaining)**:
   - Instead of whitelisting static IP addresses (e.g. \`10.0.1.45/32\`), you can set the Source of an inbound rule to **another Security Group ID** (e.g. \`sg-0a1b2c3d4e5f\` for the ALB).
   - This ensures that ONLY instances that belong to that specific Security Group can communicate with your backend, regardless of how many instances auto-scale or what their IP addresses are!`,
      whyItMatters: 'Security Group referencing is the cornerstone of cloud microsegmentation. It enables zero-trust network boundaries where databases only accept connections from verified application security groups, rendering IP spoofing and port scanning impossible.',
      securityRisks: [
        'Opening port 22 (SSH) or port 3389 (RDP) to the entire world (`0.0.0.0/0`).',
        'Overly broad inbound rules permitting all traffic from the entire VPC CIDR block instead of specific tiers.',
        'Leaving default security groups with permissive inbound/outbound rules.',
        'Hardcoding private IPs in rules that break during auto-scaling events or server replacement.'
      ],
      bestPractices: [
        'Never allow SSH (22) or RDP (3389) from `0.0.0.0/0`; use AWS Systems Manager Session Manager instead.',
        'Always reference source Security Groups between tiers (ALB -> App Tier -> Database Tier).',
        'Restrict default outbound rules (remove `0.0.0.0/0 All Traffic`) on sensitive database and processing nodes.',
        'Continuously audit and remove unused security groups to prevent rule sprawl.'
      ],
      keyTakeaways: [
        'Security Groups are STATEFUL: return traffic is automatically permitted.',
        'Security Groups support ALLOW rules only — no explicit denies.',
        'Always use Security Group Referencing (source = sg-xxxx) between tiers instead of IP ranges.',
        'Evaluate rules at the virtual network interface (ENI), stopping traffic before it touches the OS.'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                    SECURITY GROUP CHAINING FLOW                                 |
|                                                                                                 |
|   [ Internet Client ]                                                                           |
|            |                                                                                    |
|            v (Port 443 HTTPS)                                                                   |
|   +---------------------------------------+                                                     |
|   | Public Load Balancer                  |                                                     |
|   | Security Group: sg-alb                |                                                     |
|   | Inbound: 0.0.0.0/0 : 443 (HTTPS)      |                                                     |
|   | Outbound: sg-app : 8080               |                                                     |
|   +---------------------------------------+                                                     |
|            |                                                                                    |
|            v (Port 8080)                                                                        |
|   +---------------------------------------+                                                     |
|   | Application Backend (EC2 / ECS)       |                                                     |
|   | Security Group: sg-app                |                                                     |
|   | Inbound: sg-alb : 8080 (ONLY from ALB)| <--- [Direct internet traffic blocked!]             |
|   | Outbound: sg-db : 5432                |                                                     |
|   +---------------------------------------+                                                     |
|            |                                                                                    |
|            v (Port 5432 PostgreSQL)                                                             |
|   +---------------------------------------+                                                     |
|   | Database Tier (RDS PostgreSQL)        |                                                     |
|   | Security Group: sg-db                 |                                                     |
|   | Inbound: sg-app : 5432 (ONLY from App)| <--- [ALB or other VPC instances blocked!]          |
|   | Outbound: None (Strictly Isolated)    |                                                     |
|   +---------------------------------------+                                                     |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Open SSH Brute-Force Botnet',
        incident: 'A developer needed to troubleshoot a production server and created an inbound security group rule: `Type: SSH, Port: 22, Source: 0.0.0.0/0`. Within 15 minutes, automated internet scanning bots detected port 22 open, initiated a dictionary attack, compromised a weak local account password, and installed an IRC botnet agent for distributed denial of service (DDoS) participation.',
        impact: 'AWS Trust & Safety flagged the account for malicious outbound attacks; instances were isolated by AWS.',
        detectionMethod: 'GuardDuty UnauthorizedAccess:EC2/SSHBruteForce alert triggered on 12,000 failed SSH attempts in 10 minutes.'
      },
      commonBeginnerMistakes: [
        'Believing you must add an outbound rule to allow return traffic for an inbound request (Security Groups are stateful; return traffic is automatic!).',
        'Whitelisting private IP addresses of EC2 instances instead of referencing the application security group.',
        'Trying to write a "Deny" rule in a Security Group (Deny rules can only be implemented in NACLs or firewalls).',
        'Leaving default outbound `0.0.0.0/0` on database instances, enabling exfiltration if compromised.'
      ],
      whatACloudSecEngineerChecks: [
        'Audit all security groups for unrestricted inbound access: `aws ec2 describe-security-groups --filters "Name=ip-permission.cidr,Values=0.0.0.0/0"`.',
        'Verify AWS Config rule `vpc-sg-open-only-to-authorized-ports` and `restricted-ssh`.',
        'Confirm database security groups ONLY reference application security groups as sources.',
        'Check for orphan security groups with zero attached network interfaces.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Terraform: Microsegmented Security Group Referencing Application Tier',
        code: `resource "aws_security_group" "database_sg" {
  name        = "production-database-sg"
  description = "Allow inbound PostgreSQL traffic ONLY from the application tier security group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL connection from trusted app cluster"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id] # Referencing SG ID, NOT IP!
  }

  egress {
    description = "No outbound traffic permitted"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
  }
}`
      },
      interviewQuestions: [
        {
          question: 'What does it mean that Security Groups are "stateful", and what are the operational implications for inbound and outbound rules?',
          interviewerRationale: 'A fundamental cloud networking question that tests understanding of stateful packet inspection vs packet filtering.',
          modelAnswer: 'Being stateful means the security group tracks connection state. When inbound traffic matches an allow rule, the return response traffic is automatically allowed outbound, regardless of whether outbound rules exist. Conversely, if an instance initiates an outbound connection that is permitted, the return response traffic is automatically allowed back in. This simplifies rule management because you do not need to configure complex ephemeral port ranges for return traffic as you must with stateless firewalls like NACLs.'
        },
        {
          question: 'Why is Security Group Referencing (nesting) considered vastly superior to CIDR whitelisting in dynamic cloud environments?',
          interviewerRationale: 'Evaluates microsegmentation best practices and understanding of cloud elasticity.',
          modelAnswer: 'In cloud environments, instances scale dynamically up and down, and replacing instances assigns new private IP addresses. If rules rely on CIDR blocks, engineers must either whitelist broad subnet ranges (violating least privilege) or constantly update IP lists (causing brittleness). With Security Group Referencing, the source of an ingress rule is defined as another Security Group ID. AWS dynamically tracks which ENIs are associated with that group and permits traffic only from those ENIs, providing exact zero-trust microsegmentation that scales automatically with zero maintenance.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Security Group Best Practices and Microsegmentation',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Control Traffic to Resources Using Security Groups',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: How to Use Security Group Referencing to Enforce Least Privilege',
          url: 'https://aws.amazon.com/blogs/security/how-to-use-security-group-referencing-in-amazon-vpc/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An application server in a private subnet initiates an outbound HTTPS connection to an external API (port 443). The security group allows outbound port 443 to 0.0.0.0/0, but has NO inbound rules configured. Will the API response reach the server?',
        options: [
          { id: 'a', text: 'No, because the security group must have an inbound rule allowing the external API IP address.', isCorrect: false, explanation: 'Stateful tracking permits return traffic automatically.' },
          { id: 'b', text: 'Yes, because Security Groups are stateful; return traffic for an established outbound connection is automatically permitted.', isCorrect: true, explanation: 'Correct! The stateful connection tracker automatically allows response packets through.' },
          { id: 'c', text: 'Only if a Network Access Control List (NACL) rule explicitly permits port 443 inbound.', isCorrect: false, explanation: 'NACLs require ephemeral ports for return traffic, but the question asks about SG statefulness.' },
          { id: 'd', text: 'No, unless AWS Shield Advanced is active.', isCorrect: false, explanation: 'AWS Shield is for DDoS protection, not SG state tracking.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-net-02',
        title: 'Investigation: Permissive 0.0.0.0/0 Security Group Ingress',
        url: '/investigations',
        description: 'Triage an incident where a security group rule exposed internal administrative ports to the public internet.'
      }
    },
    {
      id: 'nacls',
      title: 'Network Access Control Lists (NACLs)',
      pathId: 'network',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Subnet Boundary',
      summary: 'Master stateless subnet firewalls. Learn numbered rule evaluation order, ephemeral port ranges (1024-65535), and how NACLs provide defense-in-depth and rapid IP blacklisting.',
      overview: `A **Network Access Control List (NACL)** is an optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more **subnets**.

**Key Differences Between Security Groups and NACLs**:
- **Operating Scope**: Security Groups operate at the instance/ENI level; NACLs operate at the subnet boundary.
- **Statefulness**: Security Groups are **Stateful**; NACLs are **Stateless**. This means for NACLs, if you allow inbound traffic on port 443, you MUST also explicitly allow the return outbound traffic on ephemeral ports!
- **Rule Order**: NACLs process rules in numerical order (lowest number first, e.g., 100, 200, 300). As soon as a rule matches traffic, it is immediately applied and evaluation stops.
- **Deny Rules**: NACLs natively support explicit **DENY** rules. This makes them ideal for quickly blocking malicious IP addresses or compromised CIDRs during an active DDoS or brute-force incident.
- **The Asterisk (*) Rule**: Every NACL has a default catch-all rule marked with an asterisk (\`*\`) at the end that denies all traffic if no numbered rule matches.

**The Ephemeral Port Requirement**:
When a client connects to an HTTPS server (port 443), the client chooses a temporary source port from the **ephemeral port range** (typically \`1024-65535\`). Because NACLs are stateless, an outbound rule for ports 1024-65535 must be configured on the server\'s subnet to allow return responses!`,
      whyItMatters: 'NACLs provide a second line of defense outside Security Groups. If a developer accidentally opens a Security Group to `0.0.0.0/0`, a properly configured subnet NACL can still block unauthorized protocols or blacklisted IPs at the perimeter.',
      securityRisks: [
        'Blocking return traffic accidentally by forgetting to allow outbound ephemeral ports (1024-65535).',
        'Placing a Deny rule with a higher number than an Allow rule (e.g., Allow 100 before Deny 200), rendering the deny completely useless.',
        'Over-complicating NACL rules instead of using Security Groups for application-level filtering.',
        'Exceeding the soft limit of 20 rules per NACL, resulting in performance degradation and management chaos.'
      ],
      bestPractices: [
        'Use Security Groups as your primary firewall; use NACLs for broad subnet boundaries and emergency IP blocking.',
        'Leave number gaps between rules (e.g., 100, 110, 120) so new rules can be inserted without renumbering.',
        'Always ensure outbound ephemeral ports (TCP 1024-65535) are allowed on subnets hosting servers that respond to client requests.',
        'Use AWS Network Firewall or AWS WAF for deep packet inspection and layer 7 filtering.'
      ],
      keyTakeaways: [
        'NACLs are STATELESS: you must configure both inbound and outbound rules separately.',
        'Rules are evaluated in strict numerical order; lowest number takes precedence.',
        'NACLs support explicit DENY rules (ideal for emergency IP blacklisting).',
        'Every subnet must be associated with exactly one NACL (defaults to Default NACL if unassigned).'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                 STATEFUL SG VS STATELESS NACL EVALUATION                        |
|                                                                                                 |
|   [ Inbound Packet (Port 443) ]                                                                 |
|                 |                                                                               |
|                 v                                                                               |
|   +---------------------------------------+                                                     |
|   | 1. Subnet Perimeter (NACL) - Stateless|  Rule 100: Allow Inbound TCP 443                    |
|   +---------------------------------------+                                                     |
|                 |                                                                               |
|                 v                                                                               |
|   +---------------------------------------+                                                     |
|   | 2. Instance ENI (Security Group)      |  Inbound: Allow TCP 443                             |
|   |    Stateful Connection Tracker        |  (State tracked: return path registered!)           |
|   +---------------------------------------+                                                     |
|                 |                                                                               |
|                 v                                                                               |
|          [ EC2 Application ]                                                                    |
|                 |                                                                               |
|                 v                                                                               |
|   [ Outbound Response Packet ]                                                                  |
|                 |                                                                               |
|                 v                                                                               |
|   +---------------------------------------+                                                     |
|   | 3. Instance ENI (Security Group)      |  AUTOMATICALLY PERMITTED (Stateful return!)         |
|   +---------------------------------------+                                                     |
|                 |                                                                               |
|                 v                                                                               |
|   +---------------------------------------+                                                     |
|   | 4. Subnet Perimeter (NACL) - Stateless|  MUST have rule: Outbound TCP 1024-65535 (Ephemeral)|
|   +---------------------------------------+  (Otherwise packet is DROPPED here!)                |
|                 |                                                                               |
|                 v                                                                               |
|         [ Client Receives Response ]                                                            |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Stateless Ephemeral Port Blackout',
        incident: 'A network administrator replaced the default VPC NACL with a custom NACL to lock down a public web subnet. They added rule 100 allowing inbound port 80 and 443, and rule 100 allowing outbound port 80 and 443. Immediately, all external users reported that the website was down. The servers received SYN requests, but responses were blocked by the NACL because the outbound rule did not allow ephemeral ports (1024-65535).',
        impact: '3-hour unexpected production downtime during peak business hours.',
        detectionMethod: 'VPC Flow Logs showed REJECT on outbound packets with source port 443 and destination port in 30,000-50,000 range.'
      },
      commonBeginnerMistakes: [
        'Forgetting that NACLs are stateless, blocking return web traffic by omitting outbound ephemeral ports.',
        'Creating a Deny rule as rule 500 when rule 100 allows 0.0.0.0/0 (rule 100 matches first and the deny is ignored!).',
        'Trying to assign a NACL to an individual EC2 instance (NACLs only attach to entire subnets).',
        'Managing hundreds of micro-rules in NACLs instead of using Security Groups.'
      ],
      whatACloudSecEngineerChecks: [
        'Inspect NACL associations: `aws ec2 describe-network-acls`.',
        'Verify rule order: confirm any Deny rules have lower numbers than broad Allow rules.',
        'Check outbound rules on server subnets to ensure ephemeral ports (1024-65535) are permitted.',
        'Analyze VPC Flow Logs for unexpected `REJECT` records at the subnet layer.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Emergency Blacklist Malicious Attacker IP via NACL Rule 50',
        code: `# Block an active malicious attacker IP address at the subnet perimeter before it reaches EC2
aws ec2 create-network-acl-entry \\
    --network-acl-id acl-0123456789abcdef0 \\
    --rule-number 50 \\
    --protocol -1 \\
    --rule-action deny \\
    --ingress \\
    --cidr-block 198.51.100.45/32`
      },
      interviewQuestions: [
        {
          question: 'Why does an HTTPS web server subnet require outbound NACL rules for ports 1024-65535, even though the server only listens on port 443?',
          interviewerRationale: 'Evaluates deep understanding of TCP/IP client-server handshakes and stateless firewall processing.',
          modelAnswer: 'NACLs are stateless, meaning each packet direction (inbound and outbound) is evaluated independently with no memory of the connection. When a client browser connects to an HTTPS server, it connects to destination port 443 from a dynamically assigned ephemeral source port (ranging from 1024 to 65535). When the server replies, the source port is 443 and the destination port is the client\'s ephemeral port. If the subnet\'s outbound NACL does not explicitly permit TCP traffic to ports 1024-65535, the response packets will be dropped at the subnet boundary, breaking the connection.'
        },
        {
          question: 'In an active DDoS or brute-force attack from a specific IP, would you block the IP using a Security Group or a NACL, and why?',
          interviewerRationale: 'Tests tactical incident response capability and knowledge of AWS firewall mechanics.',
          modelAnswer: 'You should block the IP using a Network ACL. Security Groups do not support "Deny" rules; they only support "Allow" rules, meaning you cannot explicitly block an individual IP inside a Security Group if a broader rule (like 0.0.0.0/0) exists. In contrast, NACLs support explicit DENY rules evaluated in numerical order. By inserting a low-numbered rule (e.g. Rule 10: Deny 198.51.100.45/32), the traffic is discarded immediately at the subnet perimeter, shielding both the instances and the security group connection tracker.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Network Access Control Lists and VPC Filtering',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Network ACLs in Amazon VPC',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Networking Guide: Ephemeral Ports and Troubleshooting Subnet Traffic',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#nacl-ephemeral-ports',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'A subnet NACL has Rule 100: Allow All Traffic (0.0.0.0/0). An engineer adds Rule 200: Deny IP 203.0.113.5/32. Will traffic from 203.0.113.5 be blocked?',
        options: [
          { id: 'a', text: 'Yes, because Deny rules always take precedence over Allow rules in AWS.', isCorrect: false, explanation: 'In NACLs, rules are evaluated by numerical order, NOT by effect type.' },
          { id: 'b', text: 'No, because Rule 100 has a lower number than Rule 200 and matches first; the packet is allowed and Rule 200 is never evaluated.', isCorrect: true, explanation: 'Correct! NACL rules are evaluated lowest number first. Rule 100 matches all traffic, so Rule 200 is never reached.' },
          { id: 'c', text: 'Yes, provided the IP is listed in AWS GuardDuty.', isCorrect: false, explanation: 'GuardDuty generates alerts; it does not automatically reorder NACL rules.' },
          { id: 'd', text: 'No, because NACLs do not support IPv4 addresses.', isCorrect: false, explanation: 'NACLs fully support IPv4 CIDR blocks.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-net-03',
        title: 'Investigation: Stateless NACL Ephemeral Port Packet Drop',
        url: '/investigations',
        description: 'Diagnose why a new subnet configuration dropped outbound application responses using VPC Flow Logs.'
      }
    },
    {
      id: 'load-balancers',
      title: 'Elastic Load Balancers & TLS Termination',
      pathId: 'network',
      level: 'Intermediate',
      estimatedTime: '22 min read • 6 min check',
      badge: 'Edge Defense',
      summary: 'Architect perimeter defenses with Application Load Balancers (ALB) and Network Load Balancers (NLB). Implement TLS 1.3 offloading with AWS Certificate Manager (ACM), AWS WAF, and security group isolation.',
      overview: `Elastic Load Balancing (ELB) distributes incoming application traffic across multiple targets (EC2 instances, containers, IP addresses, Lambda functions) in multiple Availability Zones.

**The 3 Modern ELB Types**:
1. **Application Load Balancer (ALB)**:
   - Operates at **Layer 7** (Application layer).
   - Inspects HTTP/HTTPS headers, paths, query parameters, and cookies.
   - Integrates natively with **AWS WAF (Web Application Firewall)** to block SQL injection, cross-site scripting (XSS), and bot attacks.
   - Supports advanced routing rules, redirecting HTTP to HTTPS automatically, and user authentication via OIDC/Cognito.
2. **Network Load Balancer (NLB)**:
   - Operates at **Layer 4** (Transport layer - TCP, UDP, TLS).
   - Capable of handling millions of requests per second with ultra-low latency.
   - Supports static Elastic IP addresses and client IP preservation.
3. **Gateway Load Balancer (GWLB)**:
   - Operates at **Layer 3/4** to deploy, scale, and manage third-party virtual security appliances (e.g., Palo Alto, Fortinet, Check Point) transparently.

**Perimeter Security Best Practices with ALB**:
- **TLS Termination**: Offload TLS encryption to the ALB using certificates provisioned and rotated automatically by **AWS Certificate Manager (ACM)**.
- **Security Policy (Cipher Suites)**: Enforce modern TLS security policies (e.g., \`ELBSecurityPolicy-TLS13-1-2-2021-06\`) to disable deprecated SSL 3.0, TLS 1.0, and TLS 1.1 protocols.
- **AWS WAF Integration**: Attach WAF WebACLs directly to the ALB to inspect payloads before they touch application servers.`,
      whyItMatters: 'Terminating TLS at the load balancer shields backend compute nodes from CPU-intensive cryptographic handshakes and centralizes security inspection, certificate renewal, and DDoS mitigation.',
      securityRisks: [
        'Using outdated TLS security policies allowing weak ciphers and downgrade attacks.',
        'Exposing backend application instances directly to the internet instead of shielding them behind an internal ALB.',
        'Failing to attach AWS WAF to public ALBs, leaving web applications vulnerable to automated OWASP Top 10 exploits.',
        'Allowing direct HTTP traffic without an automated redirect to HTTPS (Port 80 -> 443).'
      ],
      bestPractices: [
        'Attach AWS WAF to all internet-facing Application Load Balancers.',
        'Configure port 80 HTTP listeners to return a `301 Moved Permanently` redirect to port 443 HTTPS.',
        'Use ACM certificates with automated DNS validation and renewal.',
        'Ensure backend EC2/container security groups accept traffic ONLY from the ALB\'s security group.'
      ],
      keyTakeaways: [
        'ALB operates at Layer 7 (HTTP/HTTPS); NLB operates at Layer 4 (TCP/UDP).',
        'Terminate TLS at the ALB using free auto-renewing ACM certificates.',
        'Enforce TLS 1.2/1.3 security policies to block deprecated and insecure ciphers.',
        'Always pair internet-facing ALBs with AWS WAF for OWASP Top 10 protection.'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                 SECURE LOAD BALANCER ARCHITECTURE                               |
|                                                                                                 |
|   [ Internet User ]                                                                             |
|          |                                                                                      |
|          v (HTTPS Port 443)                                                                     |
|   +-----------------------------------------------------------------------------------------+   |
|   | AWS Shield (DDoS) + AWS WAF (OWASP Top 10, Rate Limiting, Bot Control)                  |   |
|   +-----------------------------------------------------------------------------------------+   |
|          | (Inspected Clean Traffic)                                                            |
|          v                                                                                      |
|   +-----------------------------------------------------------------------------------------+   |
|   | Internet-Facing Application Load Balancer (ALB) - Public Subnet                         |   |
|   | - ACM Managed TLS Certificate (Auto-renewed)                                            |   |
|   | - Security Policy: TLS 1.3 / 1.2 Only (Weak ciphers disabled)                           |   |
|   | - Port 80 HTTP -> 301 Redirect to 443 HTTPS                                             |   |
|   +-----------------------------------------------------------------------------------------+   |
|          |                                                                                      |
|          v (Internal Routed Traffic)                                                            |
|   +-----------------------------------------------------------------------------------------+   |
|   | Private Subnet (No Public IP)                                                           |   |
|   | App Server Security Group Ingress: ONLY from ALB Security Group                         |   |
|   | [ Container / EC2 ]   [ Container / EC2 ]   [ Container / EC2 ]                         |   |
|   +-----------------------------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The SQL Injection Data Breach',
        incident: 'A retail eCommerce company deployed an ALB in front of a Python web application without attaching AWS WAF. An attacker identified an unescaped SQL parameter in a search endpoint, exploited SQL injection, and extracted 350,000 customer hashed passwords and home addresses in 4 hours.',
        impact: 'Breach notification costs, mandatory PCI-DSS compliance penalty, and $850k in forensic response fees.',
        detectionMethod: 'Security audit flagged anomalous database outbound response size; WAF was absent from ALB.'
      },
      commonBeginnerMistakes: [
        'Allowing backend web servers to have public IPs in addition to the ALB (bypassing the load balancer!).',
        'Selecting the default "ELBSecurityPolicy-2016-08" which supports ancient, insecure TLS 1.0 ciphers.',
        'Forgetting to configure a health check path, causing healthy instances to be deregistered.',
        'Deploying an ALB in only one Availability Zone (ALB requires subnets in at least two AZs).'
      ],
      whatACloudSecEngineerChecks: [
        'Verify SSL/TLS Security Policy: `aws elbv2 describe-listeners --load-balancer-arn <ARN>` (Check `SslPolicy`).',
        'Verify AWS WAF association: `aws wafv2 get-web-acl-for-resource --resource-arn <ALB-ARN>`.',
        'Confirm HTTP (80) listener contains an explicit Redirect action to HTTPS (443).',
        'Confirm backend targets are in private subnets with security groups restricted to the ALB.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Terraform: ALB HTTP-to-HTTPS Automatic Redirect Listener',
        code: `resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.public_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}`
      },
      interviewQuestions: [
        {
          question: 'What are the security advantages of terminating TLS at an Application Load Balancer rather than directly on individual EC2 instances?',
          interviewerRationale: 'Evaluates architectural design, certificate management overhead, and attack surface reduction.',
          modelAnswer: 'Terminating TLS at the ALB provides several key advantages: 1) Centralized Certificate Management: Certificates from AWS Certificate Manager (ACM) are free and auto-renew without requiring SSH access or cron jobs on individual servers. 2) Security Policy Control: Administrators can enforce modern TLS 1.3/1.2 cipher suites in one place across all instances. 3) WAF & DDoS Inspection: The ALB can decrypt traffic and hand it directly to AWS WAF and AWS Shield for deep packet and HTTP header inspection. 4) Compute Offloading: Backend instances do not waste CPU cycles on cryptographic handshakes and can scale more efficiently. 5) Architecture Isolation: Backend instances remain in private subnets with no public IPs.'
        },
        {
          question: 'When would you architect a Network Load Balancer (NLB) instead of an Application Load Balancer (ALB)?',
          interviewerRationale: 'Tests understanding of Layer 4 vs Layer 7 tradeoffs, static IP requirements, and extreme performance.',
          modelAnswer: 'Choose an NLB when: 1) You require extreme performance (millions of requests/sec with microsecond latency), 2) You need static or Elastic IP addresses for customer firewall whitelisting, 3) The application uses non-HTTP protocols (e.g. raw TCP, UDP, gaming protocols, MQTT, or VoIP), 4) You require client IP preservation without relying on X-Forwarded-For headers, or 5) You are integrating with AWS PrivateLink to expose services privately across VPCs.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Elastic Load Balancing and Application Security',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Application Load Balancers Overview',
          url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Guide: SSL/TLS Security Policies for Application Load Balancers',
          url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which component attached to an Application Load Balancer inspects HTTP request payloads for SQL injection and cross-site scripting (XSS) patterns before routing to backend servers?',
        options: [
          { id: 'a', text: 'Amazon Inspector', isCorrect: false, explanation: 'Amazon Inspector scans container images and EC2 instances for software vulnerabilities.' },
          { id: 'b', text: 'AWS WAF (Web Application Firewall)', isCorrect: true, explanation: 'Correct! AWS WAF inspects HTTP/S traffic at Layer 7 and blocks OWASP Top 10 exploits.' },
          { id: 'c', text: 'AWS Network Firewall', isCorrect: false, explanation: 'AWS Network Firewall operates primarily at Layer 3/4 for VPC-wide ingress/egress filtering.' },
          { id: 'd', text: 'Amazon Macie', isCorrect: false, explanation: 'Amazon Macie is for S3 sensitive data discovery.' }
        ]
      },
      bridgeToLabs: {
        type: 'Lab',
        id: 'lab-06',
        title: 'Real Lab: Configuring an ALB with AWS WAF and HTTPS Enforcement',
        url: '/labs',
        description: 'Deploy an Application Load Balancer with automated HTTP-to-HTTPS redirect and WAF rate-limiting rules.'
      }
    },
    {
      id: 'internet-gateway',
      title: 'Internet Gateway, NAT Gateway & Egress Control',
      pathId: 'network',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Perimeter Routing',
      summary: 'Differentiate Internet Gateways (IGW), NAT Gateways, and Egress-Only Internet Gateways (IPv6). Learn how to prevent public IP exposure while enabling secure outbound connectivity.',
      overview: `Managing ingress (inbound) and egress (outbound) traffic is central to network perimeter defense.

**Internet Gateway (IGW)**:
- A horizontally scaled, redundant, highly available VPC component that enables communication between instances in your VPC and the internet.
- Performs 1-to-1 Network Address Translation (NAT) between private IPv4 addresses and public IPv4 addresses assigned to instances.
- **Crucial Security Rule**: Simply having an IGW attached to a VPC does NOT expose an instance. For an instance to be reachable from the internet, it must satisfy THREE conditions:
  1. The subnet\'s route table must route \`0.0.0.0/0\` to the IGW.
  2. The instance must possess a public or Elastic IPv4 address.
  3. Security groups and NACLs must permit the inbound traffic.

**NAT Gateway**:
- A managed service that enables instances in a private subnet to connect to the internet or other AWS services, while preventing the internet from initiating a connection with those instances.
- Must be deployed in a **Public Subnet** and allocated an Elastic IP.
- Private subnets point their default route (\`0.0.0.0/0\`) to the NAT Gateway ID.
- Highly available within a single AZ; for Multi-AZ resilience, deploy one NAT Gateway per Availability Zone.

**Egress-Only Internet Gateway (IPv6)**:
- IPv6 addresses are globally unique and public by design (no private NAT exists in IPv6).
- An Egress-Only Internet Gateway allows IPv6 traffic from your VPC out to the internet, while completely blocking the internet from initiating inbound IPv6 connections to your instances.`,
      whyItMatters: 'Compromised servers attempt to "phone home" to attacker command-and-control servers or download malware toolkits. Understanding egress gateways is essential for restricting outbound traffic paths.',
      securityRisks: [
        'Deploying application servers into public subnets with direct IGW routes instead of using NAT Gateways.',
        'Single point of failure: routing all private subnets across multiple AZs to a single NAT Gateway in one AZ.',
        'Unrestricted outbound internet access allowing data exfiltration and malware downloads.',
        'Deploying IPv6 subnets without an Egress-Only Internet Gateway, leaving IPv6 endpoints directly exposed.'
      ],
      bestPractices: [
        'Deploy one NAT Gateway per Availability Zone to prevent cross-AZ failure dependencies.',
        'Place application and database instances in private subnets with zero public IP addresses.',
        'Use AWS Network Firewall or DNS Firewall to inspect and filter outbound domain requests (FQDN filtering).',
        'Use Egress-Only Internet Gateways for all IPv6 workloads requiring outbound connectivity.'
      ],
      keyTakeaways: [
        'An Internet Gateway enables TWO-WAY communication; a NAT Gateway enables OUTBOUND-ONLY communication.',
        'NAT Gateways must reside in a PUBLIC subnet with an Elastic IP.',
        'Deploy one NAT Gateway per AZ for production fault tolerance.',
        'Egress-Only Internet Gateways provide NAT-like outbound-only protection for IPv6 traffic.'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                 IGW VS NAT GATEWAY TRAFFIC FLOW                                 |
|                                                                                                 |
|                          [ INTERNET ]                                                           |
|                            ^      |                                                             |
|                            |      | (Inbound connection initiated)                              |
|                            v      v                                                             |
|             +----------------------------+                                                      |
|             |   Internet Gateway (IGW)   |                                                      |
|             +----------------------------+                                                      |
|                 |                    |                                                          |
|  (Inbound/Out)  |                    | (Outbound Response Only)                                 |
|                 v                    v                                                          |
|       +-------------------+    +----------------------+                                         |
|       | Public ALB / DMZ  |    | NAT Gateway (with EIP|                                         |
|       | Public Subnet     |    | Public Subnet        |                                         |
|       +-------------------+    +----------------------+                                         |
|                 |                    ^                                                          |
|                 |                    | (Outbound traffic initiated: yum update, API call)       |
|                 |                    |                                                          |
|                 v                    |                                                          |
|       +-----------------------------------------------+                                         |
|       | Private Application EC2 / Containers          |                                         |
|       | Private Subnet (NO Public IP)                 |                                         |
|       | Route: 0.0.0.0/0 -> nat-0a1b2c3d4e5f          |                                         |
|       +-----------------------------------------------+                                         |
|       [ Inbound connections from internet CANNOT reach here! ]                                  |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Multi-AZ Single NAT Gateway Outage',
        incident: 'A fintech startup deployed an application across three Availability Zones for high availability, but routed all private subnets to a single NAT Gateway located in Availability Zone A to save $65/month. AWS experienced a localized power disruption affecting AZ A. While compute instances in AZ B and C were unaffected, all their outbound payment processing API calls failed because their shared NAT gateway in AZ A was down.',
        impact: 'Total payment processing outage for 4 hours despite having Multi-AZ application servers.',
        detectionMethod: 'CloudWatch alarm on failed HTTPS calls from application servers in AZ B and C.'
      },
      commonBeginnerMistakes: [
        'Believing that placing a server in a private subnet prevents it from downloading malware (if a NAT Gateway exists, outbound connections succeed).',
        'Deploying a NAT Gateway in a private subnet, preventing it from ever reaching the internet.',
        'Configuring only one NAT Gateway for a Multi-AZ cluster, creating a single point of failure.',
        'Not budgeting for NAT Gateway hourly and data processing fees ($0.045/hr + $0.045/GB).'
      ],
      whatACloudSecEngineerChecks: [
        'Verify NAT Gateway placement: confirm each NAT Gateway is in a public subnet with an assigned Elastic IP.',
        'Verify high availability: confirm there is one NAT Gateway per Availability Zone for production workloads.',
        'Audit route tables to confirm private subnets point to the local AZ\'s NAT Gateway.',
        'Monitor NAT Gateway packet drop metrics (`ErrorPortAllocation`, `PacketsDropCount`).'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: List All NAT Gateways, Subnets, and Attached Elastic IPs',
        code: `# Inspect NAT Gateways across all VPCs for subnet placement and state
aws ec2 describe-nat-gateways \\
    --filter "Name=state,Values=available" \\
    --query "NatGateways[*].{NatGatewayId:NatGatewayId,VpcId:VpcId,SubnetId:SubnetId,PublicIP:NatGatewayAddresses[0].PublicIp}" \\
    --output table`
      },
      interviewQuestions: [
        {
          question: 'What is the architectural difference between an Internet Gateway and a NAT Gateway in AWS?',
          interviewerRationale: 'Tests foundational cloud networking, routing rules, and directional traffic flow understanding.',
          modelAnswer: 'An Internet Gateway (IGW) provides bidirectional 1-to-1 NAT translation. It allows resources in a public subnet with public IPs to initiate outbound connections to the internet, AND allows external internet clients to initiate inbound connections to those resources (subject to security group and NACL rules). A NAT Gateway provides unidirectional (outbound-only) NAT translation. It allows resources in a private subnet (with only private IPs) to initiate outbound connections to the internet, but completely blocks the internet from initiating inbound connections to those private resources.'
        },
        {
          question: 'How do you design high-availability NAT connectivity for a VPC spanning three Availability Zones?',
          interviewerRationale: 'Evaluates resilience, fault domain isolation, and disaster recovery planning.',
          modelAnswer: 'Deploy three independent NAT Gateways — exactly one in each public subnet of each Availability Zone (AZ A, AZ B, AZ C). Configure the route table of the private subnet in AZ A to route 0.0.0.0/0 to NAT Gateway A; configure private subnet B to route to NAT Gateway B; and private subnet C to route to NAT Gateway C. This guarantees that an outage or failure in AZ A does not disrupt internet egress for workloads in AZ B or C, maintaining independent fault domain isolation.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Egress Management with NAT Gateways and Firewalls',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: NAT Gateways in Amazon VPC',
          url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Architecture Blog: Architecting Highly Available NAT Gateways',
          url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/architecting-highly-available-and-scalable-nat-gateways/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An enterprise wants to allow instances in private IPv6 subnets to initiate outbound connections to external IPv6 websites, while preventing any internet entity from connecting in. What component should be deployed?',
        options: [
          { id: 'a', text: 'A standard IPv4 NAT Gateway.', isCorrect: false, explanation: 'NAT Gateways only support IPv4 traffic.' },
          { id: 'b', text: 'An Egress-Only Internet Gateway attached to the VPC.', isCorrect: true, explanation: 'Correct! Egress-Only Internet Gateways provide outbound-only connectivity for IPv6 traffic.' },
          { id: 'c', text: 'An AWS Transit Gateway with full mesh peering.', isCorrect: false, explanation: 'Transit Gateways connect VPCs; they do not perform IPv6 egress protection.' },
          { id: 'd', text: 'Disable IPv6 across the entire VPC.', isCorrect: false, explanation: 'Disabling IPv6 prevents using the protocol entirely rather than securing egress.' }
        ]
      },
      bridgeToLabs: {
        type: 'Lab',
        id: 'lab-07',
        title: 'Real Lab: Multi-AZ NAT Gateway Architecture & Egress Hardening',
        url: '/labs',
        description: 'Deploy redundant NAT gateways across multiple AZs and test failover resilience.'
      }
    },
    {
      id: 'private-networking',
      title: 'Private Networking (VPC Endpoints & Zero Bastion)',
      pathId: 'network',
      level: 'Advanced',
      estimatedTime: '25 min read • 7 min check',
      badge: 'Zero Trust Network',
      summary: 'Eliminate internet exposure entirely. Master Gateway Endpoints vs. Interface Endpoints (AWS PrivateLink), AWS Network Firewall, and replace public SSH bastion hosts with AWS Systems Manager Session Manager.',
      overview: `The gold standard of cloud security is **zero public exposure**: private workloads should communicate with AWS services, SaaS platforms, and internal systems without traffic ever traversing the public internet.

**Two Types of VPC Endpoints**:
1. **Gateway Endpoints (Free & High Throughput)**:
   - Available ONLY for **Amazon S3** and **Amazon DynamoDB**.
   - Configured as an entry in your subnet\'s Route Table (e.g., \`pl-63a5400a (com.amazonaws.us-east-1.s3) -> vpce-xxxx\`).
   - Does not use private IP addresses or network interfaces.
   - Zero hourly charges and zero data transfer costs.
2. **Interface Endpoints (AWS PrivateLink)**:
   - Available for almost all AWS services (Secrets Manager, KMS, CloudWatch, ECR, SQS, STS) and third-party SaaS partners.
   - Deploys an Elastic Network Interface (ENI) with a **private IP address** directly inside your private subnet.
   - Uses private DNS so SDKs connect to \`secretsmanager.us-east-1.amazonaws.com\` resolving directly to the private ENI IP.
   - Supports Endpoint Policies to restrict which IAM roles or actions can use the endpoint.

**Eliminating the Bastion Host with AWS Systems Manager (SSM) Session Manager**:
Historically, engineers deployed "Jump Boxes" or "Bastion Hosts" with public IP addresses and open port 22 (SSH) to manage private instances.
- **The Modern Standard**: Use **AWS Systems Manager Session Manager**.
- Instances need **NO public IP address, NO open inbound ports (port 22 closed), and NO SSH keys!**
- The SSM Agent on the instance initiates an outbound TLS connection to the Systems Manager VPC Endpoint.
- Administrators authenticate via IAM and MFA to open encrypted browser or CLI shells with complete keystroke logging to CloudWatch and S3.`,
      whyItMatters: 'Using VPC Endpoints eliminates NAT gateway data transfer costs and keeps sensitive database queries and API tokens entirely within the AWS private backbone. Eliminating bastion hosts removes the #1 target for automated SSH credential scanners.',
      securityRisks: [
        'Routing sensitive S3 or KMS traffic through public NAT gateways where credentials could be intercepted or billed heavily.',
        'Maintaining public SSH bastion hosts vulnerable to brute-force attacks and unpatched OpenSSH zero-days.',
        'Sharing private SSH keys across team members without non-repudiation or audit trails.',
        'Interface endpoints without Endpoint Policies allowing compromised instances to exfiltrate data to rogue external AWS accounts.'
      ],
      bestPractices: [
        'Deploy S3 and DynamoDB Gateway Endpoints on all private and isolated route tables immediately.',
        'Use Interface Endpoints (PrivateLink) for KMS, Secrets Manager, and ECR in isolated subnets.',
        'Enforce VPC Endpoint Policies to prevent data exfiltration to unauthorized AWS accounts.',
        'Completely decommission public bastion hosts in favor of AWS Systems Manager Session Manager.'
      ],
      keyTakeaways: [
        'Gateway Endpoints (S3 & DynamoDB) are free and route table based; Interface Endpoints use private ENIs.',
        'AWS PrivateLink keeps traffic within the AWS private network backbone without touching the public internet.',
        'VPC Endpoint Policies restrict what can be done through the endpoint (preventing exfiltration).',
        'AWS Systems Manager Session Manager eliminates the need for open port 22, public IPs, and SSH key management.'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                 ZERO BASTION & PRIVATELINK ARCHITECTURE                         |
|                                                                                                 |
|   [ Security Engineer Laptop ]                                                                  |
|               |                                                                                 |
|               v (Authenticated via AWS SSO + Hardware MFA)                                      |
|   +-------------------------------------------------------------+                               |
|   | AWS Systems Manager (SSM) Control Plane                     |                               |
|   +-------------------------------------------------------------+                               |
|               |                                                                                 |
|               v (Secure Private Tunnel over AWS Backbone)                                       |
|   +-----------------------------------------------------------------------------------------+   |
|   | Private Isolated Subnet (NO Public IP, NO Internet Gateway, NO Open Inbound Ports!)    |   |
|   |                                                                                         |   |
|   |  +--------------------+    +-----------------------+    +----------------------------+  |   |
|   |  | Private SSM        |    | Private KMS Endpoint  |    | Private S3 Gateway         |  |   |
|   |  | Interface Endpoint |    | Interface Endpoint    |    | Endpoint (Route Table)     |  |   |
|   |  | (vpce-ssm)         |    | (vpce-kms)            |    | (vpce-s3)                  |  |   |
|   |  +--------------------+    +-----------------------+    +----------------------------+  |   |
|   |            ^                           ^                              ^                 |   |
|   |            |                           |                              |                 |   |
|   |  +-----------------------------------------------------------------------------------+  |   |
|   |  | Private Production Workload Instance (EC2 / Container)                            |  |   |
|   |  | - Port 22 Closed (SSH disabled)                                                   |  |   |
|   |  | - SSM Agent running locally                                                       |  |   |
|   |  | - All S3 / KMS / SSM calls resolve to 10.0.x.x private IPs                        |  |   |
|   |  +-----------------------------------------------------------------------------------+  |   |
|   +-----------------------------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Compromised Bastion Host Pivot',
        incident: 'A healthcare firm maintained a public Linux bastion host on port 22 for developer access. A contractor\'s compromised SSH private key was used by an attacker to log in. From the bastion, the attacker pivoted internally to unencrypted staging databases. The security team subsequently decommissioned all bastion hosts and implemented AWS Systems Manager Session Manager with mandatory MFA.',
        impact: 'Attacker gained temporary foothold; forced comprehensive infrastructure redesign.',
        detectionMethod: 'GuardDuty UnauthorizedAccess:EC2/TorIP detected SSH session to the bastion host from an anonymized exit node.'
      },
      commonBeginnerMistakes: [
        'Believing you need to open port 22 inbound for AWS Systems Manager Session Manager to function (SSM requires ZERO inbound ports!).',
        'Paying thousands in NAT Gateway data transfer fees for S3 traffic because they forgot to enable the free S3 Gateway Endpoint.',
        'Not enabling Private DNS on Interface Endpoints, requiring manual application URL reconfigurations.',
        'Leaving VPC Endpoints open without Endpoint Policies that restrict access to your corporate Organization.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify Gateway Endpoints exist in all VPC route tables: `aws ec2 describe-vpc-endpoints --filters "Name=vpc-endpoint-type,Values=Gateway"`.',
        'Audit all EC2 instances to confirm ZERO instances have port 22 open to `0.0.0.0/0`.',
        'Verify SSM Session Manager logging is enabled and piped to an encrypted CloudWatch Log Group.',
        'Inspect VPC Endpoint Policies to verify they restrict access to approved AWS account IDs or Organizations.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: VPC Endpoint Policy Preventing S3 Exfiltration to Rogue Accounts',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccessOnlyToCompanyOwnedBuckets",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::corporate-*",
        "arn:aws:s3:::corporate-*/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:PrincipalOrgID": "o-enterprise12345"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'How does AWS Systems Manager Session Manager eliminate the security risks associated with traditional SSH bastion hosts?',
          interviewerRationale: 'Evaluates zero-trust architecture, identity-centric access control, and modern operational hygiene.',
          modelAnswer: 'SSM Session Manager completely re-architects remote instance management: 1) Zero Inbound Ports: Instances require no open inbound ports (port 22 is completely closed) and no public IPv4 addresses; the SSM agent initiates outbound TLS connections to the SSM endpoint. 2) No SSH Key Sprawl: Eliminates the risks of lost, stolen, or shared SSH private keys; authentication is managed via IAM and corporate SSO with mandatory MFA. 3) Full Auditability & Keystroke Logging: Every command executed in the session can be streamed and stored immutably in Amazon S3 or CloudWatch Logs with non-repudiation. 4) Fine-Grained Access Control: Access can be restricted down to specific tags, commands, and session lengths via IAM policies.'
        },
        {
          question: 'How can a compromised EC2 instance use an S3 Gateway Endpoint to exfiltrate data to an attacker\'s external AWS account, and how do you prevent it?',
          interviewerRationale: 'An advanced cloud penetration testing and DLP question that tests VPC Endpoint Policy mastery.',
          modelAnswer: 'By default, a VPC Gateway Endpoint attaches a default policy granting `Effect: Allow, Principal: "*", Action: "*", Resource: "*"`. If an attacker compromises an instance in your VPC, they can use the gateway endpoint to upload your sensitive data directly to their OWN personal S3 bucket in another AWS account, bypassing network perimeter inspection. To prevent this, replace the default endpoint policy with a restrictive VPC Endpoint Policy that only permits actions against S3 buckets owned by your specific AWS account or corporate AWS Organization (using `aws:PrincipalOrgID` or explicit resource ARNs).'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: AWS PrivateLink and VPC Endpoint Security Architecture',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Gateway and Interface VPC Endpoints',
          url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: Replace Bastion Hosts with AWS Systems Manager Session Manager',
          url: 'https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An enterprise wants to completely close port 22 on all internal EC2 instances while allowing engineers to access Linux terminals securely with MFA and command auditing. What is the recommended AWS architecture?',
        options: [
          { id: 'a', text: 'Change the SSH port from 22 to 2222 on all instances.', isCorrect: false, explanation: 'Port obfuscation does not provide security or eliminate key sprawl.' },
          { id: 'b', text: 'Deploy an AWS Systems Manager (SSM) Session Manager configuration with VPC Interface Endpoints, closing all inbound ports and routing sessions through IAM SSO.', isCorrect: true, explanation: 'Correct! SSM Session Manager requires zero open inbound ports and integrates with IAM and CloudWatch.' },
          { id: 'c', text: 'Deploy a multi-region Bastion Host cluster with public IPs in each AZ.', isCorrect: false, explanation: 'Public bastion hosts increase attack surface and risk.' },
          { id: 'd', text: 'Install a commercial VPN server on an EC2 instance in the public subnet.', isCorrect: false, explanation: 'VPN servers require public IP exposure, patching, and credential management.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-net-04',
        title: 'Investigation: Data Exfiltration via Unrestricted VPC Endpoint',
        url: '/investigations',
        description: 'Analyze an incident where sensitive data was uploaded to an external S3 bucket via a default VPC endpoint.'
      }
    }
  ]
}
