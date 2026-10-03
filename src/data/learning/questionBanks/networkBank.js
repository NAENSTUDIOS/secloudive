// Network Security Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const networkQuestionBank = [
  {
    id: 'net-q01',
    difficulty: 'Beginner',
    category: 'VPC Architecture',
    topicId: 'vpc-fundamentals',
    topicTitle: 'VPC Architecture',
    question: 'What distinguishes a public subnet from a private subnet in an AWS Virtual Private Cloud (VPC)?',
    options: [
      'A public subnet has a route table entry pointing to an Internet Gateway (IGW) for 0.0.0.0/0, whereas a private subnet does not.',
      'A public subnet automatically decrypts all incoming traffic from the internet.',
      'A public subnet is physically located in a public colocation facility rather than an AWS datacenter.',
      'A public subnet uses 10.0.0.0/8 private IP addressing, while private subnets use public IPv4 addresses.'
    ],
    correctAnswer: 'A public subnet has a route table entry pointing to an Internet Gateway (IGW) for 0.0.0.0/0, whereas a private subnet does not.',
    explanation: 'Subnet publicity in AWS is determined exclusively by its route table. If the route table routes 0.0.0.0/0 to an attached Internet Gateway (igw-xxxx), the subnet is public. Private subnets route outbound traffic through a NAT Gateway or have no internet route.',
    engineerReasoning: 'Understanding routing fundamentals prevents engineers from accidentally deploying internal databases into public subnets with direct internet exposure.',
    businessImpact: 'Databases placed in public subnets with inadvertent 0.0.0.0/0 security group rules are scanned by bots and compromised within minutes.',
    awsBestPractice: 'Maintain strict subnet segregation: public subnets solely for ALBs and NAT Gateways; internal subnets for application runtimes and databases.'
  },
  {
    id: 'net-q02',
    difficulty: 'Beginner',
    category: 'Security Controls',
    topicId: 'security-groups-vs-nacls',
    topicTitle: 'Security Groups vs NACLs',
    question: 'How do Security Groups differ fundamentally from Network Access Control Lists (NACLs) regarding connection state?',
    options: [
      'Security Groups are stateless and evaluate rules in numerical order; NACLs are stateful and allow return traffic automatically.',
      'Security Groups are stateful (return traffic is automatically allowed regardless of outbound rules); NACLs are stateless (return traffic must be explicitly allowed).',
      'Both Security Groups and NACLs are stateful, but Security Groups operate at the VPC border.',
      'Security Groups only inspect UDP packets, whereas NACLs inspect TCP packets.'
    ],
    correctAnswer: 'Security Groups are stateful (return traffic is automatically allowed regardless of outbound rules); NACLs are stateless (return traffic must be explicitly allowed).',
    explanation: 'Security Groups track connection state: if inbound traffic is allowed on port 443, the outbound response is permitted automatically. NACLs are stateless; inbound and outbound traffic must both be explicitly permitted across the client ephemeral port range (1024-65535).',
    engineerReasoning: 'Statefulness simplifies host-level firewalling. When configuring NACLs, forgetting to permit outbound ephemeral return ports immediately breaks outbound client communication.',
    businessImpact: 'Misunderstanding statefulness causes engineers to misconfigure NACLs, resulting in widespread production network blackouts.',
    awsBestPractice: 'Use Security Groups as the primary granular firewall for workloads. Reserve NACLs for broad subnet-wide IP blocking and emergency boundary containment.'
  },
  {
    id: 'net-q03',
    difficulty: 'Beginner',
    category: 'Egress Management',
    topicId: 'egress-management',
    topicTitle: 'Egress Traffic Management',
    question: 'What is the purpose of placing a NAT Gateway in a public subnet for EC2 instances located in a private subnet?',
    options: [
      'To allow internet users to initiate direct SSH connections to the private instances.',
      'To enable private instances to initiate outbound connections to the internet (e.g. for software updates) while preventing unsolicited inbound internet connections.',
      'To provide hardware-accelerated SSL termination for inbound web requests.',
      'To convert private IPv4 addresses directly into IPv6 addresses without DNS.'
    ],
    correctAnswer: 'To enable private instances to initiate outbound connections to the internet (e.g. for software updates) while preventing unsolicited inbound internet connections.',
    explanation: 'NAT (Network Address Translation) Gateways enable one-way outbound connectivity: private instances can download patches or reach public APIs, but internet hosts cannot initiate any connection back to them.',
    engineerReasoning: 'NAT Gateways enforce asymmetric perimeter defense, protecting internal compute from automated internet port scanners.',
    businessImpact: 'Prevents direct remote code execution by attackers scanning public IP ranges for unpatched vulnerabilities.',
    awsBestPractice: 'Deploy redundant NAT Gateways across multiple Availability Zones to ensure high availability for outbound traffic.'
  },
  {
    id: 'net-q04',
    difficulty: 'Beginner',
    category: 'VPC Peering',
    topicId: 'transit-gateway-peering',
    topicTitle: 'Transit Gateway & Peering',
    question: 'Which condition MUST be satisfied before two VPCs can establish an active AWS VPC Peering connection?',
    options: [
      'Both VPCs must have identical CIDR address blocks.',
      'The VPCs must not have overlapping IPv4 CIDR blocks.',
      'Both VPCs must be owned by the exact same AWS account.',
      'Both VPCs must reside in the us-east-1 region.'
    ],
    correctAnswer: 'The VPCs must not have overlapping IPv4 CIDR blocks.',
    explanation: 'AWS VPC Peering does not support Network Address Translation (NAT) across the peering link. If CIDR ranges overlap (e.g., both use 10.0.0.0/16), routing is ambiguous and AWS rejects the peering configuration.',
    engineerReasoning: 'IP address management (IPAM) and avoiding CIDR collisions across enterprise accounts is a foundational prerequisite for enterprise networking.',
    businessImpact: 'CIDR overlaps require expensive and disruptive VPC teardown or complex PrivateLink proxy refactoring.',
    awsBestPractice: 'Allocate non-overlapping RFC 1918 CIDR blocks systematically across organizational accounts using AWS IPAM.'
  },
  {
    id: 'net-q05',
    difficulty: 'Beginner',
    category: 'Network Monitoring',
    topicId: 'vpc-flow-logs',
    topicTitle: 'VPC Flow Logs',
    question: 'Which of the following information is recorded in standard AWS VPC Flow Logs?',
    options: [
      'The HTTP payload body and encrypted SSL cookies.',
      'Source IP, destination IP, source port, destination port, protocol, packet count, byte count, and action (ACCEPT/REJECT).',
      'The operating system username running the network socket.',
      'The SQL queries sent to RDS database endpoints.'
    ],
    correctAnswer: 'Source IP, destination IP, source port, destination port, protocol, packet count, byte count, and action (ACCEPT/REJECT).',
    explanation: 'VPC Flow Logs capture Layer 3 and Layer 4 IP traffic metadata (5-tuple), showing who communicated with whom, volume, and whether security controls allowed or denied it. Flow logs do not capture Layer 7 payload contents.',
    engineerReasoning: 'Flow logs provide the primary network telemetry for identifying port scans, lateral movement, beaconing, and unauthorized egress.',
    businessImpact: 'Without flow logs, forensic investigators cannot prove whether sensitive data left an EC2 instance during a breach.',
    awsBestPractice: 'Publish VPC Flow Logs with 1-minute aggregation intervals to an S3 security lake and enable CloudWatch metric alarms for anomalous spikes in REJECTs.'
  },
  {
    id: 'net-q06',
    difficulty: 'Beginner',
    category: 'Perimeter Defense',
    topicId: 'waf-shield-ddos',
    topicTitle: 'AWS WAF & Shield',
    question: 'At which layer of the OSI model does AWS WAF (Web Application Firewall) operate?',
    options: [
      'Layer 3 (Network Layer - IP routing).',
      'Layer 4 (Transport Layer - TCP/UDP ports).',
      'Layer 7 (Application Layer - HTTP/HTTPS requests).',
      'Layer 2 (Data Link Layer - MAC addresses).'
    ],
    correctAnswer: 'Layer 7 (Application Layer - HTTP/HTTPS requests).',
    explanation: 'AWS WAF inspects Layer 7 HTTP/HTTPS traffic, analyzing query strings, headers, cookies, HTTP verbs, and request payloads against SQL injection (SQLi), Cross-Site Scripting (XSS), and rate limiting rules.',
    engineerReasoning: 'Network firewalls and Security Groups protect ports 80 and 443, but cannot distinguish between a legitimate web user and an SQL injection attack in the HTTP body. WAF provides Layer 7 inspection.',
    businessImpact: 'Prevents database exfiltration via web application vulnerabilities without modifying backend code.',
    awsBestPractice: 'Attach AWS Managed Rules for Core Rule Set (CRS) and SQLi database protections to CloudFront or Application Load Balancers.'
  },
  {
    id: 'net-q07',
    difficulty: 'Intermediate',
    category: 'Private Connectivity',
    topicId: 'vpc-endpoints-privatelink',
    topicTitle: 'VPC Endpoints & PrivateLink',
    question: 'How does an S3 Gateway VPC Endpoint differ from an S3 Interface VPC Endpoint (powered by AWS PrivateLink)?',
    options: [
      'Gateway Endpoints modify VPC route tables to route S3 traffic across AWS internal backbones at no hourly cost; Interface Endpoints deploy Elastic Network Interfaces (ENIs) with private IPs and incur hourly/data fees.',
      'Gateway Endpoints cost $50/month per AZ, whereas Interface Endpoints are always free.',
      'Gateway Endpoints allow internet access, whereas Interface Endpoints block internet traffic.',
      'Gateway Endpoints only support DynamoDB, while Interface Endpoints only support EC2.'
    ],
    correctAnswer: 'Gateway Endpoints modify VPC route tables to route S3 traffic across AWS internal backbones at no hourly cost; Interface Endpoints deploy Elastic Network Interfaces (ENIs) with private IPs and incur hourly/data fees.',
    explanation: 'Gateway Endpoints use prefix lists in route tables for S3 and DynamoDB without deploying ENIs and have zero hourly cost. Interface Endpoints place dedicated ENIs in subnets, allowing access from on-premises networks over Direct Connect/VPN as well as cross-region access.',
    engineerReasoning: 'Gateway Endpoints are the default choice for in-VPC S3 traffic. Interface Endpoints are essential when on-premises data centers need private access to AWS S3 without traversing the public internet.',
    businessImpact: 'Using Gateway Endpoints saves thousands in NAT Gateway data processing fees while hardening data transfers against internet interception.',
    awsBestPractice: 'Deploy S3 Gateway Endpoints in every VPC route table and attach endpoint policies restricting access to trusted corporate accounts.'
  },
  {
    id: 'net-q08',
    difficulty: 'Intermediate',
    category: 'Security Group Design',
    topicId: 'security-groups-vs-nacls',
    topicTitle: 'Security Groups vs NACLs',
    question: 'A security architect requires that application instances only accept traffic from the Application Load Balancer (ALB). What is the AWS best practice for configuring the application instance Security Group?',
    options: [
      'Allow inbound port 80/443 from CIDR 0.0.0.0/0.',
      'Reference the Security Group ID of the ALB as the Source in the instance Security Group inbound rule.',
      'Hardcode the private IP addresses of the ALB nodes in the instance Security Group.',
      'Open port 22 to the public internet so administrators can verify connections.'
    ],
    correctAnswer: 'Reference the Security Group ID of the ALB as the Source in the instance Security Group inbound rule.',
    explanation: 'Security Groups can reference other Security Groups as the source or destination. This dynamically trusts any interface associated with the ALB Security Group, adapting automatically as ALB nodes scale or change IP addresses.',
    engineerReasoning: 'Hardcoding IPs fails because ALBs scale dynamically. Referencing the ALB Security Group creates a resilient, least-privilege trust boundary.',
    businessImpact: 'Prevents external attackers from bypassing the ALB (and any WAF protections) by attempting direct connections to backend instances.',
    awsBestPractice: 'Chain Security Groups across architectural tiers: Client -> ALB SG -> App SG -> Database SG.'
  },
  {
    id: 'net-q09',
    difficulty: 'Intermediate',
    category: 'Network ACLs',
    topicId: 'security-groups-vs-nacls',
    topicTitle: 'Security Groups vs NACLs',
    question: 'A malicious IP address `198.51.100.27` is actively probing your web tier. What is the fastest AWS network control to block this specific IP at the subnet perimeter?',
    options: [
      'Add an Explicit Deny rule in the instance Security Group.',
      'Create an inbound DENY rule for `198.51.100.27/32` in the subnet Network ACL with a rule number lower than the default allow rule.',
      'Recreate the VPC with a different IP range.',
      'Reboot all EC2 instances in the Availability Zone.'
    ],
    correctAnswer: 'Create an inbound DENY rule for `198.51.100.27/32` in the subnet Network ACL with a rule number lower than the default allow rule.',
    explanation: 'Security Groups do NOT support explicit DENY rules (they are allow-only). Network ACLs support both ALLOW and DENY rules evaluated in ascending numerical order. Inserting a low-numbered DENY rule immediately drops matching packets before they reach any instance.',
    engineerReasoning: 'NACLs provide rapid, subnet-level packet filtering for known malicious IPs during incident response.',
    businessImpact: 'Stops automated volumetric scanning and DDoS probes before compute resources spend CPU cycles processing them.',
    awsBestPractice: 'Keep rule numbers spaced by 10 or 100 (e.g. rule 10, rule 20) so emergency deny rules can be inserted without renumbering existing rules.'
  },
  {
    id: 'net-q10',
    difficulty: 'Intermediate',
    category: 'VPC Routing',
    topicId: 'vpc-fundamentals',
    topicTitle: 'VPC Architecture',
    question: 'In a VPC route table, you have the following routes: `10.0.0.0/16 -> local`, `10.0.4.0/24 -> pcx-12345 (VPC Peering)`, and `0.0.0.0/0 -> igw-67890`. An outbound packet is addressed to `10.0.4.55`. Where is the packet routed?',
    options: [
      'To `igw-67890` because the internet gateway is evaluated first.',
      'To `local` because local routes always take precedence over peering connections.',
      'To `pcx-12345` because AWS VPC routing uses Longest Prefix Match (most specific CIDR mask).',
      'The packet is dropped as ambiguous.'
    ],
    correctAnswer: 'To `pcx-12345` because AWS VPC routing uses Longest Prefix Match (most specific CIDR mask).',
    explanation: 'AWS route tables strictly enforce Longest Prefix Match routing. A /24 mask is more specific than a /16 or /0, so traffic for 10.0.4.55 matches `10.0.4.0/24` and routes across the peering link `pcx-12345`.',
    engineerReasoning: 'Longest prefix match allows security engineers to route specific subnets through firewall appliances while allowing broader ranges to route locally or out an IGW.',
    businessImpact: 'Misunderstanding prefix matching leads to unexpected routing bypasses where sensitive traffic misses inline inspection appliances.',
    awsBestPractice: 'Regularly audit VPC route tables using Network Access Analyzer to verify that expected traffic flows adhere to security architecture specifications.'
  },
  {
    id: 'net-q11',
    difficulty: 'Intermediate',
    category: 'VPC Endpoint Policies',
    topicId: 'vpc-endpoints-privatelink',
    topicTitle: 'VPC Endpoints & PrivateLink',
    question: 'How does an AWS VPC Endpoint Policy enhance data exfiltration protection beyond standard routing?',
    options: [
      'It encrypts packets using quantum cryptography.',
      'It allows security teams to attach an IAM resource policy to the VPC endpoint restricting which specific S3 buckets or principals can be accessed through the endpoint.',
      'It disables DNS resolution for unauthorized domain names.',
      'It forces all internet traffic through a Tor exit node.'
    ],
    correctAnswer: 'It allows security teams to attach an IAM resource policy to the VPC endpoint restricting which specific S3 buckets or principals can be accessed through the endpoint.',
    explanation: 'By default, an S3 VPC endpoint allows access to ANY S3 bucket in any AWS account. An Endpoint Policy acts as a guardrail, restricting requests traversing the endpoint to only corporate-owned buckets (`arn:aws:s3:::my-corp-bucket/*`), blocking data exfiltration to personal buckets.',
    engineerReasoning: 'VPC endpoint policies close the classic cloud exfiltration vector where compromised EC2 instances upload corporate secrets to an attacker-controlled external AWS bucket.',
    businessImpact: 'Directly mitigates multi-gigabyte data theft by malicious insiders or compromised compute instances.',
    awsBestPractice: 'Attach endpoint policies with `Condition: { StringEquals: { "aws:PrincipalAccount": "YOUR_ORG_ACCOUNT_ID" } }` to prevent rogue bucket uploads.'
  },
  {
    id: 'net-q12',
    difficulty: 'Intermediate',
    category: 'DNS Security',
    topicId: 'dns-security-route53',
    topicTitle: 'DNS Security & Route 53',
    question: 'Which AWS service provides automated protection against DNS-based data exfiltration and blocks lookups to known malware command-and-control (C2) domains from within a VPC?',
    options: [
      'Amazon GuardDuty Malware Protection.',
      'Amazon Route 53 Resolver DNS Firewall.',
      'AWS Direct Connect Gateway.',
      'AWS Systems Manager Run Command.'
    ],
    correctAnswer: 'Amazon Route 53 Resolver DNS Firewall.',
    explanation: 'Route 53 Resolver DNS Firewall allows security teams to deploy rule groups that inspect all outbound DNS queries made by VPC resources, blocking resolution to malicious domains, newly registered domains, or DNS tunneling domains.',
    engineerReasoning: 'DNS is often left unrestricted by egress firewalls. Attackers encode stolen data into DNS query subdomains (e.g. `data.attacker.com`). DNS Firewall detects and stops this tunneling.',
    businessImpact: 'Prevents covert data exfiltration channels and command-and-control communication before malware can establish persistence.',
    awsBestPractice: 'Subscribe to AWS Managed Threat Intelligence domain lists for DNS Firewall and enable alert logging to CloudWatch.'
  },
  {
    id: 'net-q13',
    difficulty: 'Intermediate',
    category: 'Egress Filtering',
    topicId: 'egress-management',
    topicTitle: 'Egress Traffic Management',
    question: 'A compliance standard requires that private backend instances can only communicate outbound with three specific authorized third-party APIs via HTTPS domain names. Why is a standard NAT Gateway alone INSUFFICIENT to meet this requirement?',
    options: [
      'NAT Gateways only operate on IPv6 networks.',
      'NAT Gateways operate at Layer 4 (IP/port) and cannot inspect Layer 7 domain names or SNI headers to enforce domain whitelisting.',
      'NAT Gateways automatically block port 443.',
      'NAT Gateways do not support outbound routing.'
    ],
    correctAnswer: 'NAT Gateways operate at Layer 4 (IP/port) and cannot inspect Layer 7 domain names or SNI headers to enforce domain whitelisting.',
    explanation: 'A NAT Gateway performs network address translation at Layer 3/4. It cannot read the TLS Server Name Indication (SNI) or HTTP Host header. To restrict egress to specific domains (FQDNs), you need a Layer 7 proxy or AWS Network Firewall with Suricata stateful domain rules.',
    engineerReasoning: 'Modern cloud architectures replace open NAT egress with explicit Layer 7 forward proxies or AWS Network Firewall to stop attackers from downloading staging toolkits.',
    businessImpact: 'Meets strict regulatory standards (PCI-DSS 1.3, HIPAA) requiring restricted egress filtering for sensitive processing environments.',
    awsBestPractice: 'Route private subnet egress through AWS Network Firewall configured with stateful domain list filtering.'
  },
  {
    id: 'net-q14',
    difficulty: 'Intermediate',
    category: 'Hub-and-Spoke Topology',
    topicId: 'transit-gateway-peering',
    topicTitle: 'Transit Gateway & Peering',
    question: 'Why do large enterprise cloud environments prefer AWS Transit Gateway (TGW) over full-mesh VPC Peering as their network scales past 50 VPCs?',
    options: [
      'VPC Peering requires an exponential number of point-to-point connections (n*(n-1)/2) which becomes unmanageable; Transit Gateway provides a centralized hub-and-spoke model with unified route management.',
      'Transit Gateway is completely free, while VPC Peering costs $1000 per connection.',
      'VPC Peering does not support TCP traffic.',
      'Transit Gateway eliminates the need for IAM authentication.'
    ],
    correctAnswer: 'VPC Peering requires an exponential number of point-to-point connections (n*(n-1)/2) which becomes unmanageable; Transit Gateway provides a centralized hub-and-spoke model with unified route management.',
    explanation: 'Connecting 50 VPCs via peering requires 1,225 individual peering connections and route table entries. AWS Transit Gateway acts as a regional cloud virtual router, scaling to thousands of VPCs with centralized route domains and security inspection.',
    engineerReasoning: 'Centralized hubs allow security teams to insert centralized inspection VPCs where all inter-VPC and internet-bound traffic passes through deep packet inspection firewalls.',
    businessImpact: 'Drastically reduces operational complexity, human configuration error, and blind spots across enterprise cloud networks.',
    awsBestPractice: 'Use AWS Transit Gateway with separate route tables for Development, Production, and Shared Services to enforce network isolation.'
  },
  {
    id: 'net-q15',
    difficulty: 'Advanced',
    category: 'Traffic Inspection Architecture',
    topicId: 'network-firewall-inspection',
    topicTitle: 'AWS Network Firewall & Inspection',
    question: 'When implementing AWS Network Firewall in a centralized inspection VPC with AWS Transit Gateway, which configuration is required to inspect inter-VPC traffic without losing the original client IP address?',
    options: [
      'Enable Proxy Protocol v2 on the Internet Gateway.',
      'Configure Transit Gateway route tables to steer inter-VPC traffic to the Inspection VPC attachment, route through the Network Firewall VPC endpoints, and disable Source NAT on the firewall.',
      'Configure all EC2 instances with public IP addresses.',
      'Deploy an API Gateway in front of every private subnet.'
    ],
    correctAnswer: 'Configure Transit Gateway route tables to steer inter-VPC traffic to the Inspection VPC attachment, route through the Network Firewall VPC endpoints, and disable Source NAT on the firewall.',
    explanation: 'By using dedicated TGW route tables and VPC routing through the Network Firewall Gateway Load Balancer Endpoints (GWLBe) without SNAT, packets retain their original client and destination IP addresses, ensuring complete visibility in flow logs and security appliances.',
    engineerReasoning: 'Preserving the original client IP is critical for forensic attribution and SIEM correlation during security incidents.',
    businessImpact: 'Prevents security appliances from masking threat actors behind a single NAT IP, accelerating incident triage.',
    awsBestPractice: 'Separate TGW attachments across dedicated inspection subnets per Availability Zone to prevent cross-AZ data transfer fees.'
  },
  {
    id: 'net-q16',
    difficulty: 'Advanced',
    category: 'DDoS Protection',
    topicId: 'waf-shield-ddos',
    topicTitle: 'AWS WAF & Shield',
    question: 'What additional capabilities does AWS Shield Advanced provide beyond the baseline AWS Shield Standard included automatically for all AWS customers?',
    options: [
      'Automated deletion of attacked EC2 instances.',
      '24/7 access to the AWS Shield Response Team (SRT), proactive engagement, DDoS cost protection (service credit for scaling charges during an attack), and advanced Layer 7 metric dashboards.',
      'Exclusive support for IPv6 routing.',
      'Free Amazon Aurora database hosting.'
    ],
    correctAnswer: '24/7 access to the AWS Shield Response Team (SRT), proactive engagement, DDoS cost protection (service credit for scaling charges during an attack), and advanced Layer 7 metric dashboards.',
    explanation: 'Shield Standard provides automated SYN flood and reflection attack mitigation at Layer 3/4. Shield Advanced adds dedicated SRT support, financial reimbursement for auto-scaled resource bills incurred during attacks, and proactive health-check mitigations.',
    engineerReasoning: 'DDoS attacks often cause economic denial of service (EDoS) where autoscaling groups scale to maximum capacity, running up tens of thousands in compute bills. Shield Advanced financially covers these scaling costs.',
    businessImpact: 'Protects enterprise operational budgets and critical digital revenue streams from extortionate DDoS campaigns.',
    awsBestPractice: 'Authorize the AWS Shield Response Team (SRT) to configure WAF rules on your behalf during active high-severity DDoS events.'
  },
  {
    id: 'net-q17',
    difficulty: 'Advanced',
    category: 'VPC Flow Log Analysis',
    topicId: 'vpc-flow-logs',
    topicTitle: 'VPC Flow Logs',
    question: 'In a VPC Flow Log entry: `2 123456789012 eni-0123456789abcdef0 10.0.1.15 198.51.100.4 49152 443 6 15 8400 1620000000 1620000060 ACCEPT OK`, what does the protocol number `6` and action `ACCEPT` signify?',
    options: [
      'Protocol 6 is UDP; the traffic was accepted by the Internet Gateway.',
      'Protocol 6 is TCP; the traffic matched an allowed security rule and was permitted by Security Groups and NACLs.',
      'Protocol 6 is ICMP (Ping); the traffic was rejected by the operating system.',
      'Protocol 6 indicates IPv6 encapsulation.'
    ],
    correctAnswer: 'Protocol 6 is TCP; the traffic matched an allowed security rule and was permitted by Security Groups and NACLs.',
    explanation: 'In IANA protocol numbers, 6 represents TCP (1 is ICMP, 17 is UDP). ACCEPT indicates that both the Security Group and Network ACL permitted the connection.',
    engineerReasoning: 'Rapidly decoding IANA protocol numbers (6=TCP, 17=UDP, 1=ICMP) and flow fields is essential for real-time packet triage in AWS Athena or SIEM consoles.',
    businessImpact: 'Enables security engineers to determine in seconds whether anomalous traffic successfully breached security boundaries or was dropped.',
    awsBestPractice: 'Use Athena partition projection on VPC Flow Logs partitioned by date and AWS account to run sub-second threat queries.'
  },
  {
    id: 'net-q18',
    difficulty: 'Advanced',
    category: 'Gateway Load Balancer',
    topicId: 'network-firewall-inspection',
    topicTitle: 'AWS Network Firewall & Inspection',
    question: 'How does an AWS Gateway Load Balancer (GWLB) seamlessly route traffic to third-party virtual firewall appliances without requiring complex proxy configuration?',
    options: [
      'It encapsulates original IP packets using the GENEVE protocol on UDP port 6081 and presents them as a bump-in-the-wire appliance.',
      'It decrypts all SSL traffic using AWS KMS and sends raw plaintext over Telnet.',
      'It assigns public elastic IPs to every firewall instance.',
      'It converts TCP connections into WebSocket streams.'
    ],
    correctAnswer: 'It encapsulates original IP packets using the GENEVE protocol on UDP port 6081 and presents them as a bump-in-the-wire appliance.',
    explanation: 'GWLB uses GENEVE (Generic Network Virtualization Encapsulation) over UDP port 6081. This preserves all original packet headers (source, destination, ports, payload) while routing packets transparently through inline security appliances.',
    engineerReasoning: 'GENEVE encapsulation eliminates the need for source-NATing on virtual appliances, maintaining end-to-end packet fidelity for threat hunting.',
    businessImpact: 'Enables enterprises to bring existing enterprise firewall investments (Palo Alto, Fortinet, Check Point) into AWS without re-architecting networking.',
    awsBestPractice: 'Deploy GWLB endpoints across multiple AZs and configure appliance auto-scaling based on GWLB packet metrics.'
  },
  {
    id: 'net-q19',
    difficulty: 'Advanced',
    category: 'Edge Security',
    topicId: 'edge-security-cloudfront',
    topicTitle: 'Edge Security & CloudFront',
    question: 'What is the most secure method to ensure that an Amazon S3 bucket only accepts requests originating from an Amazon CloudFront distribution, blocking direct internet access?',
    options: [
      'Configure S3 Block Public Access to Off.',
      'Deploy CloudFront Origin Access Control (OAC) and configure an S3 bucket policy with `Principal: "cloudfront.amazonaws.com"` and `Condition: { StringEquals: { "aws:SourceArn": "arn:aws:cloudfront::123456789012:distribution/DIST_ID" } }`.',
      'Rely on legacy Origin Access Identity (OAI) without bucket policies.',
      'Make the S3 bucket public and protect it with a secret URL.'
    ],
    correctAnswer: 'Deploy CloudFront Origin Access Control (OAC) and configure an S3 bucket policy with `Principal: "cloudfront.amazonaws.com"` and `Condition: { StringEquals: { "aws:SourceArn": "arn:aws:cloudfront::123456789012:distribution/DIST_ID" } }`.',
    explanation: 'Origin Access Control (OAC) is the modern AWS standard, supporting all S3 buckets in all regions, SSE-KMS encryption, and dynamic PUT/DELETE methods. Restricting by `aws:SourceArn` guarantees that ONLY your specific distribution can read from the bucket.',
    engineerReasoning: 'Legacy OAI does not support KMS encryption or granular condition keys. OAC cryptographically signs requests with SigV4 from CloudFront to S3.',
    businessImpact: 'Prevents attackers from bypassing CloudFront edge caching, WAF rules, and geographic rate limits by hitting direct S3 URLs.',
    awsBestPractice: 'Migrate legacy OAI configurations to OAC and enforce strict `aws:SourceArn` scoping on all S3 origin bucket policies.'
  },
  {
    id: 'net-q20',
    difficulty: 'Advanced',
    category: 'Network Segmentation',
    topicId: 'vpc-fundamentals',
    topicTitle: 'VPC Architecture',
    question: 'A financial institution mandates zero internet connectivity for database clusters. Which VPC architecture pattern satisfies this requirement while still allowing database backups to S3 and administrative patching via Systems Manager?',
    options: [
      'Deploy databases in public subnets with disabled public IPs.',
      'Deploy databases in isolated private subnets with NO internet gateway or NAT route, using VPC Gateway Endpoints for S3 and VPC Interface Endpoints (PrivateLink) for Systems Manager.',
      'Attach a NAT Gateway and rely on software firewalls.',
      'Route all database traffic through a public EC2 bastion host.'
    ],
    correctAnswer: 'Deploy databases in isolated private subnets with NO internet gateway or NAT route, using VPC Gateway Endpoints for S3 and VPC Interface Endpoints (PrivateLink) for Systems Manager.',
    explanation: 'Isolated subnets have zero route to 0.0.0.0/0. By deploying VPC Endpoints for S3 (Gateway) and SSM (Interface: `ssm`, `ssmmessages`, `ec2messages`), instances access AWS services over private backbones with zero internet exposure.',
    engineerReasoning: 'Complete absence of default routes provides mathematical certainty that instances cannot communicate with public internet hosts.',
    businessImpact: 'Meets highest-tier regulatory air-gap standards for PCI-DSS Tier 1 and defense-grade environments.',
    awsBestPractice: 'Use AWS Systems Manager Session Manager via PrivateLink to eliminate SSH bastion hosts and public management interfaces entirely.'
  },
  {
    id: 'net-q21',
    difficulty: 'Advanced',
    category: 'VPC Peering Security',
    topicId: 'transit-gateway-peering',
    topicTitle: 'Transit Gateway & Peering',
    question: 'VPC A is peered with VPC B. VPC B is peered with VPC C. Why can an EC2 instance in VPC A NOT communicate with an EC2 instance in VPC C through VPC B?',
    options: [
      'VPC Peering does not support transitive routing; traffic cannot hop through an intermediary VPC.',
      'VPC C must be deleted and recreated.',
      'Security Groups automatically block traffic after one hop.',
      'AWS disables peering across different availability zones.'
    ],
    correctAnswer: 'VPC Peering does not support transitive routing; traffic cannot hop through an intermediary VPC.',
    explanation: 'AWS VPC Peering is strictly non-transitive. If VPC A needs to communicate with VPC C, an explicit peering connection between A and C must be created, or both must connect to an AWS Transit Gateway.',
    engineerReasoning: 'Non-transitivity prevents accidental perimeter bridging where a development VPC accidentally routes into production through a shared management VPC.',
    businessImpact: 'Prevents security boundary violations; forces deliberate architectural design for multi-VPC communication.',
    awsBestPractice: 'Use AWS Transit Gateway with route tables when transitive multi-VPC communication or central inspection is required.'
  },
  {
    id: 'net-q22',
    difficulty: 'Advanced',
    category: 'WAF Rule Optimization',
    topicId: 'waf-shield-ddos',
    topicTitle: 'AWS WAF & Shield',
    question: 'An attacker launches a distributed HTTP POST credential stuffing attack against `/api/v1/auth/login`. Requests originate from thousands of unique residential proxy IPs, staying below standard IP rate limits. Which AWS WAF feature is specifically designed to stop this?',
    options: [
      'AWS Shield Standard.',
      'AWS WAF Fraud Control - Account Takeover Prevention (ATP) with credential stuffing inspection and client challenge tokens.',
      'Disabling HTTPS on the Load Balancer.',
      'Network ACL rule 100.'
    ],
    correctAnswer: 'AWS WAF Fraud Control - Account Takeover Prevention (ATP) with credential stuffing inspection and client challenge tokens.',
    explanation: 'WAF ATP inspects login requests, correlates credentials against compromised credential databases, evaluates client behavior via JavaScript challenges (Silent Challenge/CAPTCHA), and blocks automated credential stuffing regardless of source IP rotation.',
    engineerReasoning: 'Traditional IP rate limiting fails against botnets using millions of residential rotating proxies. WAF ATP evaluates client telemetry and token validity.',
    businessImpact: 'Prevents customer account takeovers, fraudulent financial transfers, and reputational damage from credential stuffing.',
    awsBestPractice: 'Enable AWS WAF ATP on all public authentication endpoints and configure CAPTCHA/Challenge actions for suspicious client sessions.'
  },
  {
    id: 'net-q23',
    difficulty: 'Engineer Level',
    category: 'VPC Traffic Mirroring',
    topicId: 'network-security-monitoring',
    topicTitle: 'Network Security Monitoring',
    question: 'A cloud security team needs to perform deep packet inspection (DPI) and Zeek/Suricata IDS analysis on production EC2 traffic without installing third-party agent software on the instances. Which AWS feature provides this capability natively?',
    options: [
      'VPC Flow Logs.',
      'VPC Traffic Mirroring, which copies raw Layer 2-7 inbound and outbound packet streams from Elastic Network Interfaces (ENIs) to a target NLB or packet analyzer.',
      'AWS CloudTrail Insights.',
      'Amazon Inspector Agent.'
    ],
    correctAnswer: 'VPC Traffic Mirroring, which copies raw Layer 2-7 inbound and outbound packet streams from Elastic Network Interfaces (ENIs) to a target NLB or packet analyzer.',
    explanation: 'VPC Traffic Mirroring captures actual raw network packets (including full payloads) directly from the hypervisor ENI and encapsulates them in VXLAN (UDP port 4789) to a destination monitoring cluster, out-of-band and agentless.',
    engineerReasoning: 'Allows out-of-band threat hunting and forensic capture without consuming EC2 CPU cycles or introducing agent instability.',
    businessImpact: 'Enables real-time detection of zero-day exploits, payload signatures, and ransomware communications with zero disruption to production workloads.',
    awsBestPractice: 'Filter mirrored traffic with Traffic Mirror Filters to exclude high-volume trusted traffic (like internal database replication) to manage monitoring infrastructure costs.'
  },
  {
    id: 'net-q24',
    difficulty: 'Engineer Level',
    category: 'Network Access Analyzer',
    topicId: 'network-hardening-auditing',
    topicTitle: 'Network Hardening & Auditing',
    question: 'How does AWS Network Access Analyzer differ from traditional packet-based network testing tools like ping, traceroute, or nmap?',
    options: [
      'It sends automated SYN flood packets across your live production network.',
      'It uses automated mathematical reasoning (formal verification) based on VPC configurations, route tables, security groups, and NACLs to prove whether network paths exist without sending any actual packets.',
      'It runs only inside on-premises Cisco routers.',
      'It tests application passwords for weak dictionary words.'
    ],
    correctAnswer: 'It uses automated mathematical reasoning (formal verification) based on VPC configurations, route tables, security groups, and NACLs to prove whether network paths exist without sending any actual packets.',
    explanation: 'Network Access Analyzer leverages Zelkova and automated mathematical theorem proving. It analyzes network definitions to mathematically prove whether an EC2 instance in a private subnet can potentially reach the internet, even if no traffic is currently flowing.',
    engineerReasoning: 'Passive scanning only detects active connections. Formal verification proves whether an architectural pathway is possible under any scenario.',
    businessImpact: 'Identifies unintended perimeter exposures and compliance gaps before attackers discover them, preventing security audits failures.',
    awsBestPractice: 'Run Network Access Scopes continuously in CI/CD deployment pipelines to block infrastructure changes that violate segmentation guardrails.'
  },
  {
    id: 'net-q25',
    difficulty: 'Engineer Level',
    category: 'Cross-Account Transit Gateway Security',
    topicId: 'transit-gateway-peering',
    topicTitle: 'Transit Gateway & Peering',
    question: 'In an AWS Organization with 200 accounts, how should an enterprise share a central AWS Transit Gateway with spoke accounts while preventing unauthorized spoke accounts from attaching their VPCs?',
    options: [
      'Send AWS root login credentials via encrypted email.',
      'Share the Transit Gateway using AWS Resource Access Manager (RAM) targeted strictly to specific AWS Organization Organizational Units (OUs), and enable "Auto-accept shared attachments" only after verifying association policies.',
      'Open the Transit Gateway with a 0.0.0.0/0 route.',
      'Attach all VPCs to the default Internet Gateway.'
    ],
    correctAnswer: 'Share the Transit Gateway using AWS Resource Access Manager (RAM) targeted strictly to specific AWS Organization Organizational Units (OUs), and enable "Auto-accept shared attachments" only after verifying association policies.',
    explanation: 'AWS RAM allows fine-grained resource sharing scoped to AWS Organizations OUs. Disabling indiscriminate auto-accept ensures that the central networking team audits spoke VPC route tables before approving attachment.',
    engineerReasoning: 'Prevents rogue or compromised sandbox AWS accounts from attaching to the enterprise transit backbone and gaining lateral access to production systems.',
    businessImpact: 'Enforces corporate boundary controls and prevents unmanaged AWS accounts from bridging corporate networks.',
    awsBestPractice: 'Use AWS RAM with AWS Organizations integration and maintain strict Service Control Policies (SCPs) restricting who can create transit gateway attachments.'
  },
  {
    id: 'net-q26',
    difficulty: 'Engineer Level',
    category: 'Egress TLS Inspection',
    topicId: 'network-firewall-inspection',
    topicTitle: 'AWS Network Firewall & Inspection',
    question: 'An attacker uses an encrypted HTTPS connection to an external command-and-control server. To inspect the decrypted payload of this outbound HTTPS traffic at the perimeter, what architecture does AWS Network Firewall support?',
    options: [
      'AWS Network Firewall does not support outbound decryption under any circumstances.',
      'AWS Network Firewall TLS Inspection configurations, utilizing customer-managed CA certificates imported into AWS Certificate Manager (ACM) to perform forward proxy TLS decryption and re-encryption.',
      'Placing the EC2 private key in an S3 public bucket.',
      'Disabling TLS 1.3 across all operating systems.'
    ],
    correctAnswer: 'AWS Network Firewall TLS Inspection configurations, utilizing customer-managed CA certificates imported into AWS Certificate Manager (ACM) to perform forward proxy TLS decryption and re-encryption.',
    explanation: 'AWS Network Firewall supports outbound TLS inspection. By installing a corporate private CA certificate on internal workloads and configuring the firewall TLS inspection policy with ACM, the firewall intercepts outbound TLS sessions, decrypts payloads for Suricata rule inspection, and re-encrypts outbound to the internet.',
    engineerReasoning: 'Over 90% of malicious traffic and data exfiltration uses HTTPS. Without TLS inspection, firewalls are blind to HTTP payload exploits and exfiltration contents.',
    businessImpact: 'Detects encrypted data exfiltration, malware payloads, and malicious script downloads that easily bypass standard port and domain filters.',
    awsBestPractice: 'Define strict TLS inspection scopes to decrypt untrusted outbound traffic while bypassing financial/healthcare domains to preserve user privacy.'
  },
  {
    id: 'net-q27',
    difficulty: 'Engineer Level',
    category: 'Route 53 Resolver Architecture',
    topicId: 'dns-security-route53',
    topicTitle: 'DNS Security & Route 53',
    question: 'How do Route 53 Resolver Inbound and Outbound Endpoints enable secure hybrid cloud DNS resolution between on-premises data centers and AWS VPCs?',
    options: [
      'Inbound endpoints allow on-premises DNS servers to resolve private AWS Route 53 zones; Outbound endpoints allow VPC resources to forward queries for on-premises domains to corporate DNS resolvers via Direct Connect or VPN.',
      'Inbound endpoints expose private AWS zones to the public internet; Outbound endpoints route all DNS to Google 8.8.8.8.',
      'They encrypt DNS using unauthenticated HTTP.',
      'They replace all on-premises Active Directory controllers with AWS IAM.'
    ],
    correctAnswer: 'Inbound endpoints allow on-premises DNS servers to resolve private AWS Route 53 zones; Outbound endpoints allow VPC resources to forward queries for on-premises domains to corporate DNS resolvers via Direct Connect or VPN.',
    explanation: 'Route 53 Resolver Inbound Endpoints provide IP interfaces in the VPC for on-premises resolvers to query private hosted zones. Outbound Endpoints use conditional forwarding rules to route queries for `corp.internal` to on-premises DNS servers over private links.',
    engineerReasoning: 'Eliminates the anti-pattern of running fragile EC2 BIND/Unbound DNS forwarder clusters, replacing them with a managed, highly-available service.',
    businessImpact: 'Prevents split-brain DNS failures and enables seamless, secure communication during multi-year enterprise cloud migrations.',
    awsBestPractice: 'Deploy Resolver endpoints across at least two Availability Zones with dedicated resolver subnets.'
  },
  {
    id: 'net-q28',
    difficulty: 'Engineer Level',
    category: 'Zero Trust Microsegmentation',
    topicId: 'security-groups-vs-nacls',
    topicTitle: 'Security Groups vs NACLs',
    question: 'In a microservices architecture hosted on Amazon EKS, how should security engineers enforce network segmentation between different pods running on the same Kubernetes worker node?',
    options: [
      'By rebooting the worker node after every pod creation.',
      'By using Kubernetes Network Policies implemented via the Amazon VPC CNI plugin (or Calico/Cilium) to enforce pod-level ingress and egress rules at the Linux eBPF/iptables layer.',
      'By relying solely on VPC Network ACLs.',
      'By placing each individual pod in its own separate AWS VPC.'
    ],
    correctAnswer: 'By using Kubernetes Network Policies implemented via the Amazon VPC CNI plugin (or Calico/Cilium) to enforce pod-level ingress and egress rules at the Linux eBPF/iptables layer.',
    explanation: 'VPC Security Groups operate at the ENI level (the node or pod-ENI). Kubernetes Network Policies provide pod-to-pod microsegmentation based on namespace and pod labels, blocking lateral movement between workloads sharing the same node.',
    engineerReasoning: 'VPC firewalls cannot inspect container-to-container traffic inside the same host. In-cluster network policies enforce zero-trust microsegmentation.',
    businessImpact: 'Stops a compromised frontend container from pivoting laterally to internal backend services on the same Kubernetes cluster.',
    awsBestPractice: 'Enable Amazon VPC CNI Network Policy support to enforce native Kubernetes NetworkPolicies without third-party overlay networking overhead.'
  },
  {
    id: 'net-q29',
    difficulty: 'Engineer Level',
    category: 'Advanced VPC Endpoint Policy Scoping',
    topicId: 'vpc-endpoints-privatelink',
    topicTitle: 'VPC Endpoints & PrivateLink',
    question: 'Which AWS IAM condition key in an S3 VPC Endpoint policy guarantees that requests traversing the endpoint can ONLY access S3 buckets that belong to your AWS Organization, even if new buckets are created tomorrow?',
    options: [
      '`aws:SourceIp`',
      '`s3:ResourceAccount` or `aws:ResourceOrgID`',
      '`aws:RequestedRegion`',
      '`ec2:InstanceType`'
    ],
    correctAnswer: '`s3:ResourceAccount` or `aws:ResourceOrgID`',
    explanation: 'Using `Condition: { StringEquals: { "aws:ResourceOrgID": "o-xxxxxxxxxx" } }` in the VPC endpoint policy ensures that ANY bucket within the organization is permitted, while any bucket outside the organization is blocked, eliminating manual bucket ARN maintenance.',
    engineerReasoning: 'Hardcoding bucket ARNs breaks when teams spin up ephemeral buckets. Org-scoped condition keys enforce dynamic, maintenance-free perimeter boundaries.',
    businessImpact: 'Permanently stops data exfiltration to external AWS accounts while maintaining complete agility for internal development teams.',
    awsBestPractice: 'Enforce `aws:ResourceOrgID` on all VPC endpoints and combine it with Service Control Policies (SCPs) preventing endpoint policy tampering.'
  },
  {
    id: 'net-q30',
    difficulty: 'Engineer Level',
    category: 'MTLS and Zero Trust Perimeter',
    topicId: 'edge-security-cloudfront',
    topicTitle: 'Edge Security & CloudFront',
    question: 'How does mutual TLS (mTLS) termination at an AWS Application Load Balancer or CloudFront distribution provide cryptographic zero-trust identity verification for IoT devices or B2B API clients?',
    options: [
      'It forces all clients to enter an SMS MFA code.',
      'The server cryptographically validates the client’s X.509 digital certificate against a trusted Certificate Authority (CA) trust store before completing the TLS handshake, establishing verified client identity before application processing.',
      'It replaces HTTPS with FTP.',
      'It encrypts the client’s hard drive remotely.'
    ],
    correctAnswer: 'The server cryptographically validates the client’s X.509 digital certificate against a trusted Certificate Authority (CA) trust store before completing the TLS handshake, establishing verified client identity before application processing.',
    explanation: 'Standard TLS only validates the server identity. mTLS requires both client and server to authenticate each other via certificates. The load balancer validates the client cert against an S3-hosted trust store, dropping unauthenticated connections at the edge.',
    engineerReasoning: 'Eliminates reliance on vulnerable API keys or bearer tokens that can be intercepted or forged.',
    businessImpact: 'Prevents credential impersonation in mission-critical B2B integrations, banking APIs, and medical device telemetry streams.',
    awsBestPractice: 'Offload mTLS verification to the ALB trust store and pass validated client certificate attributes (Subject, SAN) to backend microservices in HTTP request headers.'
  }
]
