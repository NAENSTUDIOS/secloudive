import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Flame,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  FileCode2,
  Sparkles,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Share2,
  Play,
  Server,
  Zap,
  BarChart3,
  Workflow,
  Info,
  Download,
  FileText,
  Mail,
  FileDown
} from 'lucide-react'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import MultiCloudProviderFilter from '../components/MultiCloudProviderFilter'

import {
  DUAL_MODE_SCENARIOS,
  TOPOLOGY_NODES_DEFAULT,
  IAC_LINTER_TEMPLATES,
  FINOPS_SECURITY_SCENARIOS,
  COMPUTE_INSTANCES_CATALOG,
  REFERENCE_ARCHITECTURES,
  MULTI_CLOUD_CROSSWALK
} from '../data/cloudiveStudioData'

import DynamicAttackGraph from '../components/DynamicAttackGraph'
import DynamicTopologyCanvas from '../components/DynamicTopologyCanvas'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import {
  generateRemediationAuditPack,
  formatAuditPackMarkdown,
  downloadAuditFile,
  downloadHardenedTerraformModule,
  printAuditDossierPdf
} from '../utils/auditExportEngine'

export default function CloudiveStudio() {
  const [activeTab, setActiveTab] = useState('dualmode') // 'dualmode' | 'topology' | 'iac' | 'finops' | 'blueprints' | 'multicloud'

  // 1. Dual-Mode State
  const [activeScenarioId, setActiveScenarioId] = useState(DUAL_MODE_SCENARIOS[0].id)
  const [dualViewMode, setDualViewMode] = useState('builder') // 'builder' (Cloudive) | 'defender' (SeCloudive)
  const [copiedCodeKey, setCopiedCodeKey] = useState(null)

  // 2. Topology State & Packet Simulator
  const [topologyControls, setTopologyControls] = useState({
    imdsv2: false, // false = IMDSv1 (vulnerable)
    s3BlockPublic: true,
    sgRestricted: false, // false = 0.0.0.0/0
    kmsCustomerKey: false,
    vpcEndpoint: false
  })
  const [activeSimulation, setActiveSimulation] = useState(null) // 'normal' | 'ssrf' | 'exfil' | null
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationLog, setSimulationLog] = useState([])
  const [topologyViewType, setTopologyViewType] = useState('svg-graph') // 'svg-graph' | 'packet-flow'

  // 3. IaC Playground State
  const [activeIacId, setActiveIacId] = useState(IAC_LINTER_TEMPLATES[0].id)
  const [iacRemediatedMap, setIacRemediatedMap] = useState({})
  const [iacScanning, setIacScanning] = useState(false)

  // 4. FinOps & Cryptomining State
  const [activeFinopsId, setActiveFinopsId] = useState(FINOPS_SECURITY_SCENARIOS[0].id)
  const [selectedInstanceId, setSelectedInstanceId] = useState(COMPUTE_INSTANCES_CATALOG[0].id)
  const [customInstanceCount, setCustomInstanceCount] = useState(32)
  const [customHours, setCustomHours] = useState(48)
  const [executedStepsMap, setExecutedStepsMap] = useState({})

  // 5. Reference Architectures State
  const [activeBlueprintId, setActiveBlueprintId] = useState(REFERENCE_ARCHITECTURES[0].id)

  // 6. Multi-Cloud Search State
  const [multiCloudSearch, setMultiCloudSearch] = useState('')
  const [multiCloudCategory, setMultiCloudCategory] = useState('all')

  // Selected Dual-Mode Scenario
  const activeScenario = useMemo(() => {
    return DUAL_MODE_SCENARIOS.find(s => s.id === activeScenarioId) || DUAL_MODE_SCENARIOS[0]
  }, [activeScenarioId])

  // Selected IaC Template
  const activeIac = useMemo(() => {
    return IAC_LINTER_TEMPLATES.find(t => t.id === activeIacId) || IAC_LINTER_TEMPLATES[0]
  }, [activeIacId])

  // Selected FinOps Scenario & Instance
  const activeFinops = useMemo(() => {
    return FINOPS_SECURITY_SCENARIOS.find(f => f.id === activeFinopsId) || FINOPS_SECURITY_SCENARIOS[0]
  }, [activeFinopsId])

  const selectedInstance = useMemo(() => {
    return COMPUTE_INSTANCES_CATALOG.find(i => i.id === selectedInstanceId) || COMPUTE_INSTANCES_CATALOG[0]
  }, [selectedInstanceId])

  // Selected Blueprint
  const activeBlueprint = useMemo(() => {
    return REFERENCE_ARCHITECTURES.find(b => b.id === activeBlueprintId) || REFERENCE_ARCHITECTURES[0]
  }, [activeBlueprintId])

  // Calculate Dynamic FinOps Metrics
  const finopsCalculations = useMemo(() => {
    const hourlyCost = selectedInstance.ratePerHour * customInstanceCount
    const dailyCost = hourlyCost * 24
    const totalIncidentCost = hourlyCost * customHours
    const estimatedCo2Kg = Math.round(customInstanceCount * customHours * 0.45) // ~0.45 kg CO2 per server-hour
    return {
      hourlyCost: hourlyCost.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
      totalIncidentCost: totalIncidentCost.toFixed(2),
      estimatedCo2Kg
    }
  }, [selectedInstance, customInstanceCount, customHours])

  // Calculate Topology Security Score (0 - 100%)
  const topologyScore = useMemo(() => {
    let score = 20
    if (topologyControls.imdsv2) score += 20
    if (topologyControls.s3BlockPublic) score += 20
    if (topologyControls.sgRestricted) score += 20
    if (topologyControls.kmsCustomerKey) score += 10
    if (topologyControls.vpcEndpoint) score += 10
    return score
  }, [topologyControls])

  // Export Custom Topology as Terraform (.tf)
  const handleExportTopologyTerraform = () => {
    const tfCode = `# ==============================================================================
# SECLOUDIVE DYNAMIC ARCHITECTURE TOPOLOGY - CUSTOM TERRAFORM SPECIFICATION
# Generated: ${new Date().toUTCString()}
# Effective Posture Score: ${topologyScore}%
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Environment  = "Production"
      AuditedBy    = "SeCloudive Security Studio"
      PostureScore = "${topologyScore}%"
    }
  }
}

# ------------------------------------------------------------------------------
# 1. EC2 Web Tier & Instance Metadata Service
# ------------------------------------------------------------------------------
resource "aws_instance" "web_tier" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.private_app.id

  # IMDSv2 Security Guardrail: ${topologyControls.imdsv2 ? 'ENFORCED (Immune to SSRF)' : 'VULNERABLE (IMDSv1 Open)'}
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "${topologyControls.imdsv2 ? 'required' : 'optional'}"
    http_put_response_hop_limit = ${topologyControls.imdsv2 ? 1 : 2}
  }

  vpc_security_group_ids = [aws_security_group.app_sg.id]
}

# ------------------------------------------------------------------------------
# 2. S3 Bucket Public Access Block & Encryption
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "data_lake" {
  bucket        = "corp-financial-lake-us-east-1"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.data_lake.id

  block_public_acls       = ${topologyControls.s3BlockPublic}
  block_public_policy     = ${topologyControls.s3BlockPublic}
  ignore_public_acls      = ${topologyControls.s3BlockPublic}
  restrict_public_buckets = ${topologyControls.s3BlockPublic}
}

resource "aws_s3_bucket_server_side_encryption_configuration" "sse" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "${topologyControls.kmsCustomerKey ? 'aws:kms' : 'AES256'}"
      ${topologyControls.kmsCustomerKey ? 'kms_master_key_id = aws_kms_key.customer_cmk.arn' : ''}
    }
    bucket_key_enabled = true
  }
}

${topologyControls.kmsCustomerKey ? `# Customer Managed Key (CMK) with Annual Key Rotation
resource "aws_kms_key" "customer_cmk" {
  description             = "Customer Managed Key for Financial Lake"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}
` : ''}
# ------------------------------------------------------------------------------
# 3. Security Group Isolation
# ------------------------------------------------------------------------------
resource "aws_security_group" "app_sg" {
  name        = "app-service-sg"
  description = "${topologyControls.sgRestricted ? 'Restricted to ALB Ingress Only' : 'Exposed Ingress'}"
  vpc_id      = aws_vpc.main.id

  ${topologyControls.sgRestricted ? `ingress {
    description     = "Allow HTTPS from Public ALB only"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }` : `ingress {
    description = "OVERLY PERMISSIVE: Direct Ingress"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }`}

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

${topologyControls.vpcEndpoint ? `# ------------------------------------------------------------------------------
# 4. Gateway VPC Endpoint for Private S3 Access
# ------------------------------------------------------------------------------
resource "aws_vpc_endpoint" "s3_gateway" {
  vpc_id          = aws_vpc.main.id
  service_name    = "com.amazonaws.us-east-1.s3"
  route_table_ids = [aws_route_table.private.id]
}
` : ''}
`
    const blob = new Blob([tfCode], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `custom_topology_${topologyScore}pct_${Date.now()}.tf`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export FinOps Incident Briefing Markdown
  const handleExportFinopsReport = () => {
    const reportMd = `# SECLOUDIVE FINOPS & CLOUD INCIDENT EXECUTIVE BRIEFING
**Date**: ${new Date().toUTCString()}
**Scenario**: ${activeFinops.title}
**Cloud Service Provider**: AWS
**Instance Family Analyzed**: ${selectedInstance.name} (${selectedInstance.instanceType} - ${selectedInstance.vCpu} vCPU, ${selectedInstance.ramGb} GB RAM)
**Compromised Fleet Size**: ${customInstanceCount} instances
**Uncontained Duration**: ${customHours} hours

---

## 1. Financial & Environmental Impact Metrics:
- **Hourly Burn Rate**: $${finopsCalculations.hourlyCost} / hour
- **Daily Financial Impact**: $${finopsCalculations.dailyCost} / day
- **Total Cumulative Incident Cost**: $${finopsCalculations.totalIncidentCost}
- **Estimated Carbon Footprint**: ${finopsCalculations.estimatedCo2Kg} kg CO2e

## 2. Incident Summary:
${activeFinops.summary}

## 3. Attack Vector & Execution:
${activeFinops.attackVector}

## 4. Remediation Runbook Status:
${activeFinops.runbookSteps.map((s, idx) => `${idx + 1}. [${executedStepsMap[`${activeFinopsId}-${idx + 1}`] ? 'COMPLETED' : 'PENDING'}] ${s.action} - Command: \`${s.cliCommand}\``).join('\n')}

---
*SeCloudive Enterprise Cloud Security & FinOps Governance*
`
    const blob = new Blob([reportMd], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FinOps_Incident_Report_${activeFinopsId}_${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyCode = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
      setCopiedCodeKey(key)
      setTimeout(() => setCopiedCodeKey(null), 2000)
    }
  }

  // Handle IaC Auto-remediation
  const handleToggleRemediate = (id) => {
    setIacScanning(true)
    setTimeout(() => {
      setIacRemediatedMap(prev => ({
        ...prev,
        [id]: !prev[id]
      }))
      setIacScanning(false)
    }, 400)
  }

  // Run Packet / Attack Simulation
  const handleRunSimulation = (type) => {
    setActiveSimulation(type)
    setIsSimulating(true)
    setSimulationLog([])

    const logs = []
    if (type === 'normal') {
      logs.push('1. [00:01s] Client initiates TLS 1.3 HTTPS request to Route 53 DNS...')
      logs.push('2. [00:03s] CloudFront CDN validates SSL and forwards to Public ALB...')
      logs.push('3. [00:05s] ALB inspects AWS WAF rules (Clean: 0 SQLi, 0 XSS tokens)...')
      logs.push('4. [00:07s] ALB dispatches request over private subnet to ECS microservice...')
      logs.push('5. [00:09s] ECS queries Aurora PostgreSQL database. HTTP 200 OK returned.')
    } else if (type === 'ssrf') {
      logs.push('1. [00:01s] Adversary injects SSRF payload targeting internal 169.254.169.254...')
      logs.push('2. [00:03s] Web tier proxy relays request to AWS Instance Metadata Service (IMDS)...')
      if (topologyControls.imdsv2) {
        logs.push('3. [00:05s] 🛡️ IMDSv2 DEFENSE ACTIVE: IMDS requires PUT token header. SSRF request lacked token!')
        logs.push('4. [00:07s] HTTP 401 Unauthorized returned by IMDS. ZERO credentials leaked.')
        logs.push('5. [00:09s] RESULT: Attack successfully thwarted by IMDSv2 session token guardrail.')
      } else {
        logs.push('3. [00:05s] 🚨 IMDSv1 VULNERABILITY: Raw GET request accepted by legacy metadata service!')
        logs.push('4. [00:07s] STS temporary credentials (AccessKeyId, SecretAccessKey, Token) dumped!')
        logs.push('5. [00:09s] CRITICAL BREACH: Adversary assumed EC2 IAM role with s3:* wildcard access.')
      }
    } else if (type === 'exfil') {
      logs.push('1. [00:01s] Compromised process executes AWS CLI `aws s3 cp` on customer data lake...')
      if (topologyControls.vpcEndpoint) {
        logs.push('2. [00:03s] Traffic routed across AWS Gateway VPC Endpoint (private backbone)...')
      } else {
        logs.push('2. [00:03s] Traffic routed over Public Internet via NAT Gateway...')
      }
      if (topologyControls.s3BlockPublic && topologyControls.kmsCustomerKey) {
        logs.push('3. [00:05s] 🛡️ S3 Bucket Policy & KMS Key Policy check initiated...')
        logs.push('4. [00:07s] KMS CMK Denies unauthorized encryption principal. S3 Block Public Access enforces private ACL.')
        logs.push('5. [00:09s] RESULT: Exfiltration halted! Data remains encrypted and confined to corporate tenant.')
      } else {
        logs.push('3. [00:05s] 🚨 LEAKY STORAGE: S3 Bucket allows public read / unauthenticated object export!')
        logs.push('4. [00:07s] Adversary exfiltrated 45,000 customer financial records to drop bucket.')
        logs.push('5. [00:09s] CRITICAL IMPACT: Compliance violation (PCI-DSS & GDPR regulatory breach).')
      }
    }

    setTimeout(() => {
      setSimulationLog(logs)
      setIsSimulating(false)
    }, 600)
  }

  // Handle Runbook Step Execution
  const handleExecuteRunbookStep = (stepNumber) => {
    setExecutedStepsMap(prev => ({
      ...prev,
      [`${activeFinopsId}-${stepNumber}`]: true
    }))
  }

  // Filtered Multi-Cloud Matrix
  const filteredCrosswalk = useMemo(() => {
    let list = MULTI_CLOUD_CROSSWALK
    if (multiCloudCategory !== 'all') {
      list = list.filter(item => item.category === multiCloudCategory)
    }
    if (multiCloudSearch.trim()) {
      const q = multiCloudSearch.toLowerCase()
      list = list.filter(item =>
        item.concept?.toLowerCase().includes(q) ||
        item.aws?.toLowerCase().includes(q) ||
        item.azure?.toLowerCase().includes(q) ||
        item.gcp?.toLowerCase().includes(q) ||
        item.oci?.toLowerCase().includes(q) ||
        item.ibm?.toLowerCase().includes(q) ||
        item.securityAdvice?.toLowerCase().includes(q)
      )
    }
    return list
  }, [multiCloudCategory, multiCloudSearch])

  return (
    <main className="cloudive-studio-shell">
      {/* Brand Identity Distinction Notice */}
      <div className="identity-clarity-banner">
        <ShieldCheck size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
        <span><strong>Platform Clarity Notice:</strong> SeCloudive is an enterprise cloud security training simulator, separate from Cloudive. Designed specifically for Cloud Security Engineers, DevSecOps Leads, and SOC Incident Responders.</span>
      </div>

      {/* Studio Header & Brand Bridge */}
      <div className="studio-hero-card">
        <div className="studio-hero-top">
          <div className="bridge-pill">
            <span className="bridge-tag cloudive">CLOUDIVE BUILDER</span>
            <span className="bridge-divider">⇄</span>
            <span className="bridge-tag secloudive">SECLOUDIVE DEFENDER</span>
          </div>
          <span className="platform-release-tag">
            <Sparkles size={13} /> CLOUD ARCHITECTURE, DEVSECOPS & DEFENSIVE ENGINEERING STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="studio-title">
              Cloudive Architecture & Builder Studio<span>.</span>
            </h1>
            <p className="studio-subtitle">
              Experience the complete DevSecOps lifecycle: How Cloud Solutions Architects design, size, and provision resilient multi-cloud systems with Terraform, and how Cloud Security Engineers audit, threat model, and defend against real-world compromises.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'center' }}>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('secloudive:toggle-notes', {
                  detail: { contextId: 'cloudive-studio' }
                }))
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', borderColor: 'rgba(56,189,248,0.4)', color: '#38bdf8' }}
              title="Open Architecture & Threat Modeling Scratchpad"
            >
              <FileText size={14} /> Architecture Notes
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={() => downloadHardenedTerraformModule({ moduleName: 'secloudive-hardened-production-module' })}
            >
              <Download size={14} /> Download Hardened Module (.zip)
            </button>
            <button
              type="button"
              className="button button-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', borderColor: 'rgba(56,189,248,0.4)', color: '#38bdf8' }}
              onClick={() => {
                const codeToSend = activeScenario?.defender?.hardenedTerraform || activeIac?.remediatedCode || `# Production Architecture Terraform\nprovider "aws" {\n  region = "us-east-1"\n}`
                window.dispatchEvent(new CustomEvent('open-script-dispatch', {
                  detail: {
                    scriptType: 'terraform',
                    title: `Architecture Module: ${activeScenario?.title || 'AWS Infrastructure'}`,
                    description: `Terraform architecture module authored in Cloudive Studio for scenario: ${activeScenario?.title || 'Production Infrastructure'}.`,
                    code: codeToSend
                  }
                }))
              }}
              title="Auto-dispatch this script to NAEN Studios (naenstudios@gmail.com)"
            >
              <Mail size={14} /> Send Script to NAEN Studios
            </button>
          </div>
        </div>

        {/* Motivational Cloud Architect & Builder Quote Callout */}
        <DefenderQuoteCallout 
          category="builder" 
          autoCycle={true} 
          cycleIntervalMs={14000} 
          className="studio-quote-callout"
        />

        {/* Studio Primary Navigation Tabs */}
        <div className="studio-nav-bar" role="tablist">
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'dualmode' ? 'active' : ''}`}
            onClick={() => setActiveTab('dualmode')}
          >
            <Layers size={15} />
            <span>1. Builder vs. Defender Dual-Mode</span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'topology' ? 'active' : ''}`}
            onClick={() => setActiveTab('topology')}
          >
            <Globe size={15} />
            <span>2. Topology & Attack Flow Canvas</span>
            <span className="tab-indicator-badge">{topologyScore}%</span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'iac' ? 'active' : ''}`}
            onClick={() => setActiveTab('iac')}
          >
            <FileCode2 size={15} />
            <span>3. IaC Security Linter & Auto-Fix</span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'finops' ? 'active' : ''}`}
            onClick={() => setActiveTab('finops')}
          >
            <DollarSign size={15} />
            <span>4. FinOps & Cryptomining Detection</span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'blueprints' ? 'active' : ''}`}
            onClick={() => setActiveTab('blueprints')}
          >
            <Workflow size={15} />
            <span>5. Architecture Blueprints Library</span>
          </button>

          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'multicloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('multicloud')}
          >
            <Share2 size={15} />
            <span>6. 5-Cloud Crosswalk (AWS / Azure / GCP / OCI / IBM)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BUILDER VS. DEFENDER DUAL-MODE ENGINE
          ========================================================================= */}
      {activeTab === 'dualmode' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">DUAL-PERSPECTIVE DEVSECOPS ENGINE</span>
              <h2>Builder Mode (Cloudive) vs. Defender Mode (SeCloudive)</h2>
              <p>Switch between the Solutions Architect who designs for uptime, scalability, and speed, and the Security Engineer who designs for containment and least privilege.</p>
            </div>

            {/* Toggle Switch */}
            <div className="dual-mode-switch-box">
              <button
                type="button"
                className={`mode-toggle-btn ${dualViewMode === 'builder' ? 'is-builder-active' : ''}`}
                onClick={() => setDualViewMode('builder')}
              >
                <Code2 size={15} />
                <span>Cloudive: Builder View</span>
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${dualViewMode === 'defender' ? 'is-defender-active' : ''}`}
                onClick={() => setDualViewMode('defender')}
              >
                <ShieldAlert size={15} />
                <span>SeCloudive: Defender View</span>
              </button>
            </div>
          </div>

          {/* Scenario Selector Pills */}
          <div className="scenario-selector-row">
            {DUAL_MODE_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                type="button"
                className={`scenario-pill ${sc.id === activeScenarioId ? 'active' : ''}`}
                onClick={() => setActiveScenarioId(sc.id)}
              >
                <span>{sc.title}</span>
                <span className="level-tag">{sc.level}</span>
              </button>
            ))}
          </div>

          {/* Dual-Mode Split Workspace */}
          <div className={`dual-workspace-card ${dualViewMode}`}>
            <div className="workspace-header-bar">
              <div className="perspective-badge">
                {dualViewMode === 'builder' ? (
                  <>
                    <Code2 size={16} className="text-emerald" />
                    <span>BUILDER PERSPECTIVE: {activeScenario.builder.roleTitle}</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} className="text-rose" />
                    <span>DEFENDER PERSPECTIVE: {activeScenario.defender.roleTitle}</span>
                  </>
                )}
              </div>
              <span className="domain-pill">{activeScenario.domain}</span>
            </div>

            {dualViewMode === 'builder' ? (
              /* BUILDER VIEW (Cloudive) */
              <div className="builder-view-layout">
                <div className="builder-overview">
                  <h3>🎯 Engineering Objective</h3>
                  <p className="lead-paragraph">{activeScenario.builder.objective}</p>

                  <h4 style={{ marginTop: '1.25rem' }}>Architecture Blueprint Highlights:</h4>
                  <ul className="blueprint-checklist">
                    {activeScenario.builder.architectureHighlights.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 style={{ marginTop: '1.25rem' }}>DevOps Deployment Checklist:</h4>
                  <div className="devops-checks-grid">
                    {activeScenario.builder.devopsChecklist.map((chk, idx) => (
                      <div key={idx} className="devops-check-item">
                        <Terminal size={14} style={{ color: '#38bdf8' }} />
                        <span>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terraform Code Box */}
                <div className="builder-code-box">
                  <div className="code-box-header">
                    <span>
                      <FileCode2 size={13} /> main.tf (Production Terraform Blueprint)
                    </span>
                    <button
                      type="button"
                      className="copy-btn-sm"
                      onClick={() => handleCopyCode(activeScenario.builder.terraformCode, 'tf')}
                    >
                      {copiedCodeKey === 'tf' ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedCodeKey === 'tf' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="code-display">
                    <code>{activeScenario.builder.terraformCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              /* DEFENDER VIEW (SeCloudive) */
              <div className="defender-view-layout">
                <div className="threat-intel-box">
                  <div className="threat-badge-row">
                    <span className="stride-tag">STRIDE: {activeScenario.defender.strideCategory}</span>
                  </div>
                  <h3>⚠️ Threat Model & Exploit Vector</h3>
                  <p className="threat-summary">{activeScenario.defender.threatModel}</p>

                  <div className="exploit-callout">
                    <strong>Adversary Attack Path:</strong>
                    <p>{activeScenario.defender.exploitVector}</p>
                  </div>

                  <h4 style={{ marginTop: '1.25rem' }}>Mandatory Security Guardrails:</h4>
                  <ul className="guardrails-list">
                    {activeScenario.defender.guardrails.map((g, idx) => (
                      <li key={idx}>
                        <ShieldCheck size={15} style={{ color: '#f43f5e' }} />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Forensic CloudTrail Telemetry & Remediation Diff */}
                <div className="defender-telemetry-box">
                  <div className="telemetry-header">
                    <span>
                      <Radio size={13} style={{ color: '#f43f5e' }} /> CloudTrail Event Telemetry
                    </span>
                  </div>
                  <pre className="telemetry-display">
                    <code>{activeScenario.defender.cloudTrailTelemetry}</code>
                  </pre>

                  <div className="remediation-header">
                    <span>
                      <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Preventative Terraform Diff
                    </span>
                  </div>
                  <pre className="diff-display">
                    <code>{activeScenario.defender.remediationDiff}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: DYNAMIC BIDIRECTIONAL ATTACK GRAPH & REAL-TIME SIEM STREAM
          ========================================================================= */}
      {activeTab === 'topology' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">DYNAMIC BLAST RADIUS & SIEM SIMULATOR</span>
              <h2>Interactive Attack Graph & SIEM Event Stream</h2>
              <p>Experience real-time adversary kill chains mapped to MITRE ATT&CK. Toggle perimeter guardrails and observe live packet flows, CloudTrail logs, and GuardDuty finding events.</p>
              <div style={{ marginTop: '5px', fontSize: '0.74rem', color: '#f59e0b', fontFamily: 'DM Mono' }}>
                Notice: Illustrative training score, not a certified compliance assessment.
              </div>
            </div>

            {/* Live Posture Gauge */}
            <div className="topology-score-card">
              <span className="score-label">EFFECTIVE POSTURE SCORE</span>
              <div className="score-value-row">
                <span className={`score-number ${topologyScore >= 80 ? 'good' : topologyScore >= 50 ? 'medium' : 'critical'}`}>
                  {topologyScore}%
                </span>
                <span className="score-status">
                  {topologyScore >= 80 ? '✓ Hardened Boundary' : topologyScore >= 50 ? '⚠️ Partially Exposed' : '🚨 Exploitable Path'}
                </span>
              </div>
              <div className="score-bar-track">
                <i style={{ width: `${topologyScore}%` }} className={topologyScore >= 80 ? 'good' : topologyScore >= 50 ? 'medium' : 'critical'} />
              </div>
            </div>
          </div>

          {/* Interactive Toggle Controls Matrix */}
          <div className="topology-controls-bar">
            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={topologyControls.imdsv2}
                onChange={e => setTopologyControls(prev => ({ ...prev, imdsv2: e.target.checked }))}
              />
              <span className="toggle-text">
                <strong>Enforce IMDSv2</strong>
                <small>{topologyControls.imdsv2 ? 'Tokens Required (Immune to SSRF)' : 'IMDSv1 Open (Vulnerable to SSRF)'}</small>
              </span>
            </label>

            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={topologyControls.s3BlockPublic}
                onChange={e => setTopologyControls(prev => ({ ...prev, s3BlockPublic: e.target.checked }))}
              />
              <span className="toggle-text">
                <strong>S3 Block Public Access</strong>
                <small>{topologyControls.s3BlockPublic ? 'All 4 Flags Active (Private)' : 'Public Read ACL Enabled'}</small>
              </span>
            </label>

            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={topologyControls.sgRestricted}
                onChange={e => setTopologyControls(prev => ({ ...prev, sgRestricted: e.target.checked }))}
              />
              <span className="toggle-text">
                <strong>Restricted Security Group</strong>
                <small>{topologyControls.sgRestricted ? 'SG Chained to ALB Only' : '0.0.0.0/0 Direct Ingress'}</small>
              </span>
            </label>

            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={topologyControls.kmsCustomerKey}
                onChange={e => setTopologyControls(prev => ({ ...prev, kmsCustomerKey: e.target.checked }))}
              />
              <span className="toggle-text">
                <strong>KMS Customer Key (CMK)</strong>
                <small>{topologyControls.kmsCustomerKey ? 'Hardware Key + Auto-Rotation' : 'Default AWS Managed Key'}</small>
              </span>
            </label>

            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={topologyControls.vpcEndpoint}
                onChange={e => setTopologyControls(prev => ({ ...prev, vpcEndpoint: e.target.checked }))}
              />
              <span className="toggle-text">
                <strong>S3 Gateway VPC Endpoint</strong>
                <small>{topologyControls.vpcEndpoint ? 'Private AWS Backbone' : 'Public Internet Route'}</small>
              </span>
            </label>
          </div>

          {/* Interactive Topology View Mode Switcher */}
          <div style={{ display: 'flex', gap: '10px', margin: '1.25rem 0', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VISUALIZATION ENGINE:
            </span>
            <button
              type="button"
              className={`button button-sm ${topologyViewType === 'svg-graph' ? 'button-primary' : 'button-ghost'}`}
              onClick={() => setTopologyViewType('svg-graph')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={13} />
              <span>Interactive SVG Attack Topology</span>
            </button>
            <button
              type="button"
              className={`button button-sm ${topologyViewType === 'packet-flow' ? 'button-primary' : 'button-ghost'}`}
              onClick={() => setTopologyViewType('packet-flow')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Radio size={13} />
              <span>Packet Stage Animator & Audit Pack</span>
            </button>
            <button
              type="button"
              className="button button-sm button-ghost"
              onClick={handleExportTopologyTerraform}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)', marginLeft: 'auto' }}
              title="Download Terraform template matching your active security toggles"
            >
              <FileDown size={13} />
              <span>Export Custom Topology as Terraform (.tf)</span>
            </button>
          </div>

          {topologyViewType === 'svg-graph' ? (
            <DynamicTopologyCanvas />
          ) : (
            <DynamicAttackGraph
              topologyControls={topologyControls}
              setTopologyControls={setTopologyControls}
              topologyScore={topologyScore}
              activeIac={activeIac}
            />
          )}
        </section>
      )}

      {/* =========================================================================
          TAB 3: IAC SECURITY LINTER & AUTO-FIX PLAYGROUND
          ========================================================================= */}
      {activeTab === 'iac' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">DEVSECOPS CODE AUDIT ENGINE</span>
              <h2>Infrastructure as Code (IaC) Security Linter</h2>
              <p>Simulates automated Checkov, tfsec, and Trivy static analysis on Terraform code. Inspect security vulnerabilities and apply 1-click remediation diffs.</p>
            </div>

            {/* Template Selector */}
            <div className="iac-template-switch">
              {IAC_LINTER_TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  type="button"
                  className={`tmpl-btn ${tmpl.id === activeIacId ? 'active' : ''}`}
                  onClick={() => setActiveIacId(tmpl.id)}
                >
                  <FileCode2 size={13} />
                  <span>{tmpl.filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Linter Grid Layout */}
          <div className="iac-linter-grid">
            {/* Left: Code Viewer */}
            <div className="iac-code-panel">
              <div className="code-panel-top">
                <div className="file-info">
                  <span className="file-dot" />
                  <strong>{activeIac.filename}</strong>
                  <span className="lang-tag">{activeIac.language}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="button button-sm button-ghost"
                    onClick={() => downloadHardenedTerraformModule({
                      moduleName: `secloudive-${activeIac.id}-hardened`,
                      hardenedTerraformCode: activeIac.remediatedCode
                    })}
                    title="Download this hardened Terraform configuration with verification scripts"
                  >
                    <Download size={13} />
                    <span>Download Module (.zip)</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-remediate-toggle ${iacRemediatedMap[activeIac.id] ? 'is-fixed' : ''}`}
                    onClick={() => handleToggleRemediate(activeIac.id)}
                    disabled={iacScanning}
                  >
                    {iacScanning ? (
                      <RefreshCw size={13} className="spin-icon" />
                    ) : iacRemediatedMap[activeIac.id] ? (
                      <Check size={13} />
                    ) : (
                      <Sparkles size={13} />
                    )}
                    <span>
                      {iacRemediatedMap[activeIac.id] ? 'Revert to Vulnerable' : 'Apply 1-Click Remediation'}
                    </span>
                  </button>
                </div>
              </div>

              <pre className={`iac-code-editor ${iacRemediatedMap[activeIac.id] ? 'remediated' : 'vulnerable'}`}>
                <code>
                  {iacRemediatedMap[activeIac.id] ? activeIac.remediatedCode : activeIac.rawCode}
                </code>
              </pre>
            </div>

            {/* Right: Security Findings */}
            <div className="iac-findings-panel">
              <div className="findings-header">
                <div>
                  <h3 style={{ margin: 0 }}>
                    {iacRemediatedMap[activeIac.id] ? (
                      <span style={{ color: '#10b981' }}>✓ 0 Vulnerabilities Detected</span>
                    ) : (
                      <span style={{ color: '#f43f5e' }}>⚠️ {activeIac.findings.length} Security Policy Violations</span>
                    )}
                  </h3>
                  <small style={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block', marginTop: '3px' }}>
                    Illustrative training score, not a certified compliance assessment.
                  </small>
                </div>
                <span className="scanner-badge">Checkov / CIS-AWS v3.0</span>
              </div>

              {iacRemediatedMap[activeIac.id] ? (
                <div className="remediated-success-card">
                  <CheckCircle2 size={36} style={{ color: '#10b981', marginBottom: '10px' }} />
                  <h4>Infrastructure as Code Clean & Hardened</h4>
                  <p>All CIS Benchmark rules are now satisfied. Pull request ready for automated CI/CD pipeline merge.</p>
                </div>
              ) : (
                <div className="findings-list">
                  {activeIac.findings.map(f => (
                    <div key={f.id} className="finding-card">
                      <div className="finding-top-row">
                        <span className={`finding-sev-tag ${f.severity.toLowerCase()}`}>{f.severity}</span>
                        <span className="finding-rule-id">{f.id} • Line {f.line}</span>
                      </div>
                      <h4 className="finding-title">{f.title}</h4>
                      <p className="finding-impact"><strong>Security Impact:</strong> {f.impact}</p>
                      <span className="cwe-pill">{f.cwe}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: FINOPS & CRYPTOMINING DETECTION LAB
          ========================================================================= */}
      {activeTab === 'finops' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">FINANCIAL SECURITY & BILLING ANOMALY</span>
              <h2>FinOps & Cryptomining Detection Engine</h2>
              <p>How cloud financial intelligence and AWS Billing metrics uncover compromised IAM credentials, rogue GPU fleets, and unauthorized bandwidth exfiltration.</p>
            </div>

            {/* FinOps Scenario Switcher */}
            <div className="finops-switch-pills">
              {FINOPS_SECURITY_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scenario-pill ${sc.id === activeFinopsId ? 'active' : ''}`}
                  onClick={() => setActiveFinopsId(sc.id)}
                >
                  <span>{sc.title.split(':')[0]}</span>
                  <span className="level-tag">{sc.severity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive FinOps Sizing & Calculation Calculator */}
          <div className="finops-calculator-widget">
            <div className="calculator-header">
              <SlidersHorizontal size={15} style={{ color: '#38bdf8' }} />
              <strong>Interactive Cloud Compute Debt & Cost Calculator</strong>
            </div>

            <div className="calculator-grid">
              <div className="calc-input-group">
                <label>Select AWS Instance Family:</label>
                <select
                  value={selectedInstanceId}
                  onChange={e => setSelectedInstanceId(e.target.value)}
                  className="calc-select"
                >
                  {COMPUTE_INSTANCES_CATALOG.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} (${inst.ratePerHour}/hr)
                    </option>
                  ))}
                </select>
                <small className="calc-note">Target: {selectedInstance.useCase}</small>
              </div>

              <div className="calc-input-group">
                <label>Instance Quantity: <strong>{customInstanceCount} Nodes</strong></label>
                <input
                  type="range"
                  min="1"
                  max="64"
                  value={customInstanceCount}
                  onChange={e => setCustomInstanceCount(Number(e.target.value))}
                  className="calc-slider"
                />
                <div className="slider-labels">
                  <span>1 Node</span>
                  <span>32 Nodes</span>
                  <span>64 Nodes</span>
                </div>
              </div>

              <div className="calc-input-group">
                <label>Active Unmonitored Runtime: <strong>{customHours} Hours</strong></label>
                <input
                  type="range"
                  min="1"
                  max="168"
                  value={customHours}
                  onChange={e => setCustomHours(Number(e.target.value))}
                  className="calc-slider"
                />
                <div className="slider-labels">
                  <span>1 Hour</span>
                  <span>72 Hours (3 Days)</span>
                  <span>168 Hours (1 Week)</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Bar */}
            <div className="calc-results-row">
              <div className="calc-metric-box">
                <span className="calc-metric-label">HOURLY BURN RATE</span>
                <span className="calc-metric-val text-amber">${finopsCalculations.hourlyCost} / hr</span>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">24-HOUR DAILY IMPACT</span>
                <span className="calc-metric-val text-rose">${finopsCalculations.dailyCost} / day</span>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">TOTAL UNAPPROVED DEBT</span>
                <span className="calc-metric-val text-rose" style={{ fontSize: '1.4rem' }}>
                  ${finopsCalculations.totalIncidentCost}
                </span>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">ESTIMATED CO2 IMPACT</span>
                <span className="calc-metric-val text-sky">{finopsCalculations.estimatedCo2Kg} kg CO2</span>
              </div>
            </div>

            {/* Export FinOps Report Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '12px 0 6px' }}>
              <button
                type="button"
                className="button button-ghost button-sm"
                onClick={handleExportFinopsReport}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fb923c', borderColor: 'rgba(251, 146, 60, 0.4)' }}
                title="Download Executive Incident Briefing (.md)"
              >
                <FileDown size={13} />
                <span>Export Executive FinOps Briefing (.md)</span>
              </button>
            </div>
          </div>

          {/* Active Incident Context Layout */}
          <div className="finops-scenario-layout">
            {/* Left Column: Telemetry & Billing Chart */}
            <div className="finops-left-col">
              <div className="incident-context-box">
                <div className="incident-badge-row">
                  <span className="badge-risk critical">{activeFinops.severity}</span>
                  <span className="region-tag">Region: {activeFinops.regionAbused}</span>
                </div>
                <h3>{activeFinops.title}</h3>
                <p className="incident-trigger">{activeFinops.trigger}</p>
                <p className="financial-warning"><strong>Economic Impact:</strong> {activeFinops.financialImpact}</p>
              </div>

              {/* Simulated Billing Spike Visualizer */}
              <div className="billing-spike-card">
                <h4>📈 Real-Time Cost & Resource Telemetry</h4>
                <div className="spike-bars-container">
                  {activeFinops.metrics.map(m => (
                    <div key={m.timestamp} className="spike-bar-col">
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${m.alertState === 'CRITICAL SPIKE' ? 'fill-danger' : m.alertState === 'Warning' ? 'fill-warning' : 'fill-normal'}`}
                          style={{ height: `${Math.min(100, (m.costPerHour / 225) * 100)}%` }}
                        />
                      </div>
                      <span className="bar-cost">${m.costPerHour}</span>
                      <span className="bar-time">{m.timestamp}</span>
                      <span className={`bar-status ${m.alertState === 'CRITICAL SPIKE' ? 'text-rose' : ''}`}>
                        {m.instanceCount} Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GuardDuty Finding Card */}
              <div className="guardduty-finding-box">
                <div className="gd-header">
                  <ShieldAlert size={16} style={{ color: '#f43f5e' }} />
                  <span>Amazon GuardDuty Finding: {activeFinops.guardDutyFinding.type}</span>
                </div>
                <p>{activeFinops.guardDutyFinding.description}</p>
              </div>
            </div>

            {/* Right Column: Emergency Runbook */}
            <div className="finops-right-col">
              <div className="runbook-header">
                <Terminal size={16} style={{ color: '#38bdf8' }} />
                <h3>Emergency Incident Containment Runbook</h3>
              </div>

              <div className="runbook-steps-list">
                {activeFinops.containmentRunbook.map(step => {
                  const isExecuted = executedStepsMap[`${activeFinops.id}-${step.step}`]
                  return (
                    <div key={step.step} className={`runbook-step-card ${isExecuted ? 'step-executed' : ''}`}>
                      <div className="step-num-badge">0{step.step}</div>
                      <div className="step-body">
                        <div className="step-title-row">
                          <h4>{step.title}</h4>
                          <button
                            type="button"
                            className={`execute-step-btn ${isExecuted ? 'executed' : ''}`}
                            onClick={() => handleExecuteRunbookStep(step.step)}
                          >
                            {isExecuted ? <Check size={12} /> : <Terminal size={12} />}
                            <span>{isExecuted ? 'CONTAINED ✓' : 'Execute CLI'}</span>
                          </button>
                        </div>
                        <pre className="step-cli-box">
                          <code>{step.command}</code>
                        </pre>
                        <p>{step.explanation}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* FinOps Audit Pack Export Action & Disclaimer */}
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ color: '#f8fafc', fontSize: '0.88rem', display: 'block' }}>FinOps Incident Remediation Dossier</strong>
                  <small style={{ color: '#f59e0b', fontSize: '0.72rem', fontFamily: 'DM Mono' }}>
                    Notice: Illustrative training score, not a certified compliance assessment.
                  </small>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={async () => {
                    const pack = await generateRemediationAuditPack({
                      scenario: {
                        title: activeFinops.title,
                        primaryTechnique: 'T1496: Resource Hijacking (Cryptomining)',
                        mitreTechniques: ['T1496', 'T1059.009', 'T1562.001'],
                        mitreTactics: ['Impact', 'Execution', 'Persistence']
                      },
                      finopsMetrics: finopsCalculations,
                      simulationLogs: Object.keys(executedStepsMap)
                        .filter(k => k.startsWith(activeFinopsId))
                        .map(k => `[EXECUTED] Step: Containment action verified on rogue compute instances.`)
                    })
                    printAuditDossierPdf(pack)
                  }}
                  title="Open and view or save the official NAEN Studios certified FinOps audit dossier PDF"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} /> 📄 View & Save NAEN Audit PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 5: ARCHITECTURE BLUEPRINTS LIBRARY (CLOUDIVE CORE FEATURE)
          ========================================================================= */}
      {activeTab === 'blueprints' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">PRODUCTION-READY CLOUD ARCHITECTURES</span>
              <h2>Enterprise Reference Architectures & Production Blueprints</h2>
              <p>Curated Well-Architected blueprints spanning full-stack microservices, event-driven serverless, enterprise AI data lakes, and zero-trust multi-account landing zones.</p>
            </div>

            {/* Blueprint Selector */}
            <div className="blueprint-selector-pills">
              {REFERENCE_ARCHITECTURES.map(bp => (
                <button
                  key={bp.id}
                  type="button"
                  className={`scenario-pill ${bp.id === activeBlueprintId ? 'active' : ''}`}
                  onClick={() => setActiveBlueprintId(bp.id)}
                >
                  <span>{bp.title.split(' ')[0]} {bp.title.split(' ')[1]}</span>
                  <span className="level-tag">{bp.slaTarget}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint Detail Card */}
          <div className="blueprint-detail-card">
            <div className="blueprint-meta-header">
              <div>
                <span className="domain-pill">{activeBlueprint.category}</span>
                <h3 className="blueprint-headline">{activeBlueprint.title}</h3>
                <p className="blueprint-summary-text">{activeBlueprint.summary}</p>
              </div>

              <div className="blueprint-stats-box">
                <div className="b-stat">
                  <span className="stat-label">TARGET AVAILABILITY SLA</span>
                  <strong className="stat-value text-emerald">{activeBlueprint.slaTarget}</strong>
                </div>
                <div className="b-stat">
                  <span className="stat-label">ESTIMATED MONTHLY COST</span>
                  <strong className="stat-value text-sky">{activeBlueprint.estimatedMonthlyCost}</strong>
                </div>
              </div>
            </div>

            {/* Well-Architected 5-Pillar Score Bar */}
            <div className="well-architected-card">
              <h4>🏛️ AWS Well-Architected 5-Pillar Alignment</h4>
              <div className="pillars-grid">
                {Object.entries(activeBlueprint.wellArchitectedScore).map(([pillar, val]) => (
                  <div key={pillar} className="pillar-item">
                    <div className="pillar-label-row">
                      <span className="pillar-name">
                        {pillar === 'costOptimization' ? 'Cost Optimization' : pillar === 'operationalExcellence' ? 'Operational Excellence' : pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                      </span>
                      <span className="pillar-score">{val}%</span>
                    </div>
                    <div className="pillar-track">
                      <div className="pillar-fill" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagram Flow Map */}
            <div className="diagram-flow-card">
              <span className="diagram-label">
                <Workflow size={14} style={{ color: '#38bdf8' }} /> SYSTEM ARCHITECTURE DATA FLOW:
              </span>
              <div className="flow-path-display">
                <code>{activeBlueprint.diagramFlow}</code>
              </div>
            </div>

            {/* Core Services Pills */}
            <div className="core-services-section">
              <span className="section-label">Integrated Cloud Services:</span>
              <div className="services-chips-row">
                {activeBlueprint.coreServices.map((svc, idx) => (
                  <span key={idx} className="service-chip">
                    <Server size={12} style={{ color: '#38bdf8' }} /> {svc}
                  </span>
                ))}
              </div>
            </div>

            {/* Dual Checklists: DevOps Delivery vs Security Guardrails */}
            <div className="blueprints-dual-checklists">
              <div className="blueprint-check-col devops-col">
                <div className="check-col-head">
                  <Terminal size={15} style={{ color: '#38bdf8' }} />
                  <h4>DevOps & Infrastructure Delivery Checklist</h4>
                </div>
                <ul className="check-items-list">
                  {activeBlueprint.devopsChecklist.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={14} style={{ color: '#38bdf8' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="blueprint-check-col security-col">
                <div className="check-col-head">
                  <ShieldCheck size={15} style={{ color: '#10b981' }} />
                  <h4>Security & CIS Benchmark Hardening</h4>
                </div>
                <ul className="check-items-list">
                  {activeBlueprint.securityChecklist.map((item, idx) => (
                    <li key={idx}>
                      <ShieldCheck size={14} style={{ color: '#10b981' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 6: MULTI-CLOUD SECURITY CROSSWALK MATRIX
          ========================================================================= */}
      {activeTab === 'multicloud' && (
        <section className="studio-panel-container">
          <div className="panel-sub-header">
            <div>
              <span className="eyebrow-accent">ENTERPRISE 5-CLOUD ARCHITECTURE TRANSLATION</span>
              <h2>Multi-Cloud Security Crosswalk Matrix (5 Clouds)</h2>
              <p>Direct comparative mapping of cloud primitives, identity boundaries, network firewalls, and posture tools across AWS, Microsoft Azure, Google Cloud Platform (GCP), Oracle Cloud Infrastructure (OCI), and IBM Cloud.</p>
            </div>

            {/* Search Filter */}
            <div className="multicloud-search-box">
              <input
                type="text"
                placeholder="Search concepts across 5 clouds (e.g. IAM, Firewall, Guardrails, KMS)..."
                value={multiCloudSearch}
                onChange={e => setMultiCloudSearch(e.target.value)}
                className="multicloud-search-input"
              />
            </div>
          </div>

          {/* Global Multi-Cloud Provider Filter */}
          <div style={{ marginBottom: '14px' }}>
            <MultiCloudProviderFilter compact={true} showDetails={false} />
          </div>

          {/* Matrix Category Filter Chips */}
          <div className="category-filter-chips">
            {['all', 'Identity & Access', 'Containers & Kubernetes', 'Serverless Compute', 'Network Security', 'Storage & Encryption', 'Relational Database', 'Key Management & Secrets', 'Threat Detection', 'Post-Mortem & Audit'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${multiCloudCategory === cat ? 'active' : ''}`}
                onClick={() => setMultiCloudCategory(cat)}
              >
                {cat === 'all' ? 'All Domains' : cat}
              </button>
            ))}
          </div>

          {/* Crosswalk Table / Cards */}
          <div className="crosswalk-grid">
            {filteredCrosswalk.map((item, idx) => (
              <div key={idx} className="crosswalk-card">
                <div className="crosswalk-card-header">
                  <span className="category-badge">{item.category}</span>
                  <h3 className="concept-title">{item.concept}</h3>
                </div>

                <div className="cloud-triad-grid">
                  {/* AWS */}
                  <div className="cloud-col aws-col">
                    <div className="cloud-col-head">
                      <span className="cloud-dot aws" />
                      <strong>Amazon Web Services (AWS)</strong>
                    </div>
                    <p className="cloud-service-name">{item.aws}</p>
                  </div>

                  {/* Azure */}
                  <div className="cloud-col azure-col">
                    <div className="cloud-col-head">
                      <span className="cloud-dot azure" />
                      <strong>Microsoft Azure</strong>
                    </div>
                    <p className="cloud-service-name">{item.azure}</p>
                  </div>

                  {/* GCP */}
                  <div className="cloud-col gcp-col">
                    <div className="cloud-col-head">
                      <span className="cloud-dot gcp" />
                      <strong>Google Cloud Platform (GCP)</strong>
                    </div>
                    <p className="cloud-service-name">{item.gcp}</p>
                  </div>

                  {/* OCI */}
                  <div className="cloud-col oci-col">
                    <div className="cloud-col-head">
                      <span className="cloud-dot oci" />
                      <strong>Oracle Cloud Infrastructure (OCI)</strong>
                    </div>
                    <p className="cloud-service-name">{item.oci || 'OCI Equivalent Service'}</p>
                  </div>

                  {/* IBM Cloud */}
                  <div className="cloud-col ibm-col">
                    <div className="cloud-col-head">
                      <span className="cloud-dot ibm" />
                      <strong>IBM Cloud</strong>
                    </div>
                    <p className="cloud-service-name">{item.ibm || 'IBM Cloud Equivalent Service'}</p>
                  </div>
                </div>

                <div className="security-guidance-footer">
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span><strong>SecOps Guidance:</strong> {item.securityAdvice}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Embedded Architecture & Threat Modeling Scratchpad */}
      <LabNotesScratchpad
        contextId="cloudive-studio"
        title="Architecture & Threat Modeling Scratchpad"
      />
    </main>
  )
}
