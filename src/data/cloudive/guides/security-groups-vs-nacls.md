---
title: "AWS VPC Security: Security Groups vs. Network ACLs (NACLs) Architecture Guide"
description: "Master stateful vs. stateless packet filtering, rule evaluation precedence, ephemeral port dynamics, and systematic troubleshooting workflows in Amazon VPC."
publishDate: "2026-03-10"
targetRole: "cloud-security-engineer"
targetRoleTitle: "Cloud Security Engineer"
readingTime: "10 min read"
canonicalUrl: "https://cloudive.com/guides/security-groups-vs-nacls"
---

In Amazon Virtual Private Cloud (Amazon VPC), packet filtering occurs at two distinct structural layers: **Security Groups** (which operate at the Elastic Network Interface / instance level) and **Network Access Control Lists (NACLs)** (which operate at the subnet boundary).

Failing to grasp the core differences between stateful and stateless inspection is the single most common cause of silent network connectivity timeouts, asymmetric routing drops, and security audit violations.

---

## 1. Structural Comparison Matrix

| Property | Security Groups (SG) | Network ACLs (NACL) |
| :--- | :--- | :--- |
| **Operating Layer** | Virtual Network Interface (ENI) | Subnet Boundary Level |
| **State Tracking** | **Stateful** (Return traffic is automatically permitted) | **Stateless** (Inbound & Outbound evaluated independently) |
| **Rule Types** | **ALLOW rules only** (Implicit deny all other traffic) | **ALLOW and DENY rules** |
| **Rule Order** | Evaluates **ALL** rules before deciding | Evaluates rules in **strict numerical order** (lowest number first) |
| **Ephemeral Ports** | Handled automatically via conntrack table | **Must manually allow ephemeral ports (1024–65535)** |
| **Scope of Impact** | Only instances associated with that SG | Every single resource located within that subnet |

---

## 2. Stateful vs. Stateless Deep Dive

### Security Groups: Stateful Connection Tracking
When an inbound packet matches an ALLOW rule on a Security Group (for example, incoming TCP port 443 from `0.0.0.0/0`), the Linux kernel hypervisor connection tracking table (`conntrack`) records the active TCP 5-tuple:
`[Source IP, Source Port, Destination IP, Destination Port, Protocol]`.

When the server replies with SYN-ACK or application payload data, the outbound reply is **automatically allowed**, regardless of what outbound rules are configured on the Security Group.

```
Client (Port 52140)  ───[ Inbound TCP 443 Allowed ]───►  EC2 (Port 443)
Client (Port 52140)  ◄──[ Automatically Allowed ]───────  EC2 (Port 443)
```

### Network ACLs: Stateless Packet Dissection
Network ACLs do not maintain a connection tracking table. Every single packet is evaluated on its own merits as it crosses the subnet line.

If an external client connects to an EC2 instance on TCP port 443:
1. The **Inbound Rule** of the NACL must explicitly ALLOW traffic on port 443.
2. When the EC2 server sends the response packet back to the client, the destination port is no longer 443 — it is the client's temporary random port (the **ephemeral port**, usually between 1024 and 65535).
3. If the **Outbound Rule** of the NACL does not explicitly ALLOW TCP ports 1024–65535 to destination `0.0.0.0/0`, the return packet is dropped silently!

```
[Inbound NACL Rule 100]  ALLOW TCP 443 from 0.0.0.0/0   --> PACKET ADMITTED
[Outbound NACL Rule ???] MUST ALLOW TCP 1024-65535 to 0.0.0.0/0 --> OR CONNECTION HANGS!
```

---

## 3. Rule Precedence and Evaluation Mechanics

### Security Groups: Cumulative Union
Security Groups evaluate all rules cumulatively. If Security Group A allows port 80 from CIDR `10.0.0.0/16` and Security Group B allows port 80 from `192.168.0.0/16`, attaching both Security Groups to an instance grants the union: port 80 is accepted from both subnets. There is no concept of rule numbering.

### Network ACLs: Sequential Priority
NACL rules are processed in strict numerical sequence from lowest to highest. Once a packet matches a rule, evaluation ceases immediately:

```
Rule 100: ALLOW TCP Port 80 from 10.0.0.0/16
Rule 200: DENY  TCP Port 80 from 10.0.1.0/24  <-- DEAD RULE! Never evaluated for 10.0.1.0/24!
Rule *  : DENY  ALL Traffic (Default Fallthrough)
```

In the example above, an IP in `10.0.1.0/24` will be allowed because Rule 100 matches before Rule 200 is reached. **Always order specific DENY rules BEFORE broad ALLOW rules.**

---

## 4. Systematic 4-Step Network Triage Workflow

When an engineer reports: *"My EC2 instance cannot connect to the internet"* or *"My API request times out after 30 seconds"*, use this ordered checklist:

```
[Step 1: Check VPC Route Table]
  └─ Does the subnet have a route to an Internet Gateway (0.0.0.0/0 -> igw-xxx)?
     If private subnet, does it point to a NAT Gateway (0.0.0.0/0 -> nat-xxx)?

[Step 2: Check Security Group Inbound & Outbound]
  └─ Is the target listening port allowed inbound from the client CIDR?
  └─ Is the outbound rule intact? (Default is allow 0.0.0.0/0 all traffic).

[Step 3: Check Subnet Network ACL]
  └─ Inbound: Is the service port allowed?
  └─ Outbound: ARE EPHEMERAL PORTS (1024-65535) ALLOWED OUTBOUND? (Most common bug).

[Step 4: Check VPC Flow Logs]
  └─ Query CloudWatch Insights:
     filter (action = "REJECT") | stats count(*) by srcAddr, dstAddr, dstPort
```

---

## 5. Defense-in-Depth Architecture: When to Use Which

- **Use Security Groups as the primary application firewall:** Manage least-privilege access between application tiers (e.g., allow App Security Group to access Database Security Group on port 5432).
- **Use Network ACLs for coarse-grained perimeter quarantine:** Instantly block malicious IP addresses or compromised CIDR blocks identified by threat detection systems (GuardDuty) without modifying individual instance security groups.
