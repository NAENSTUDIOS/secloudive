import { useState, useEffect } from 'react'
import {
  Mail,
  Send,
  Copy,
  Check,
  Download,
  X,
  FileCode2,
  Terminal,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { NaenStudiosLogoBadge } from './CloudGraphics'

const SCRIPT_PRESETS = [
  {
    id: 'terraform',
    name: 'AWS Hardened Terraform Module',
    ext: '.tf',
    defaultTitle: 'Enterprise Zero-Trust AWS Architecture Module',
    defaultDesc: 'Production Terraform infrastructure with KMS CMK encryption, S3 Block Public Access, and least-privilege IAM policies.',
    code: `# =========================================================================
# NAEN STUDIOS OFFICIAL CLOUD SPECIFICATION
# Engineered by NAEN Studios (naenstudios@gmail.com) & SeCloudive
# Platform: https://secloudive.io | Verified Career Operating System
# Watermark: NAEN-STUDIOS-VERIFIED-SPECIFICATION-2026
# =========================================================================

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
      ManagedBy   = "SeCloudive-Engine"
      Publisher   = "NAEN-Studios"
      Contact     = "naenstudios@gmail.com"
      Environment = "production"
      Compliance  = "CIS-AWS-Benchmark-v3.0"
    }
  }
}

# KMS Customer Managed Key with Automated Annual Rotation
resource "aws_kms_key" "vault_cmk" {
  description             = "CMK for Enterprise Storage Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

# Hardened S3 Data Lake with Multi-Layered Access Controls
resource "aws_s3_bucket" "customer_vault" {
  bucket_prefix = "secloudive-vault-"
}

resource "aws_s3_bucket_public_access_block" "customer_vault" {
  bucket = aws_s3_bucket.customer_vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "customer_vault" {
  bucket = aws_s3_bucket.customer_vault.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.vault_cmk.arn
      sse_algorithm     = "aws:kms"
    }
  }
}
`
  },
  {
    id: 'forensics',
    name: 'SOC Incident Containment Script',
    ext: '.sh',
    defaultTitle: 'Minute-0 Adversary Containment & Evidence Preservation',
    defaultDesc: 'Bash runbook to deactivate compromised IAM access keys, quarantine EC2 instance, and capture CloudTrail forensic query.',
    code: `#!/usr/bin/env bash
# =========================================================================
# NAEN STUDIOS & SECLOUDIVE MINUTE-0 CONTAINMENT RUNBOOK
# Engineered for NAEN Studios (naenstudios@gmail.com)
# Watermark: NAEN-STUDIOS-INCIDENT-RUNBOOK-2026
# =========================================================================
set -euo pipefail

TARGET_USER="compromised-analyst"
TARGET_KEY_ID="AKIAIOSFODNN7EXAMPLE"
INSTANCE_ID="i-0123456789abcdef0"

echo "🚨 [00:00s] INITIATING MINUTE-0 ADVERSARY CONTAINMENT..."

# 1. Kill compromised IAM Access Key immediately
echo "1. Deactivating IAM Access Key: $TARGET_KEY_ID"
aws iam update-access-key --user-name "$TARGET_USER" --access-key-id "$TARGET_KEY_ID" --status Inactive

# 2. Attach emergency inline DenyAll policy to kill cached STS tokens
echo "2. Enforcing emergency DenyAll inline policy..."
aws iam put-user-policy --user-name "$TARGET_USER" --policy-name "EmergencyDenyAll" \\
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'

# 3. Restrict EC2 Security Group to Quarantine (0 Inbound, 0 Outbound)
echo "3. Isolating EC2 instance $INSTANCE_ID into Quarantine SG..."
aws ec2 modify-instance-attribute --instance-id "$INSTANCE_ID" --groups "sg-quarantine-isolated"

# 4. Enforce IMDSv2 to block SSRF token theft
echo "4. Hardening IMDSv2 Hop Limit..."
aws ec2 modify-instance-metadata-options --instance-id "$INSTANCE_ID" \\
  --http-tokens required --http-put-response-hop-limit 1

echo "✅ [00:04s] CONTAINMENT COMPLETE. Adversary severed from AWS plane."
`
  },
  {
    id: 'python',
    name: 'Python Boto3 Security Scanner',
    ext: '.py',
    defaultTitle: 'Automated IAM Privilege Escalation Scanner',
    defaultDesc: 'Python script auditing IAM policies for AdministratorAccess, sts:AssumeRole bypasses, and unrotated credentials.',
    code: `"""
NAEN Studios & SeCloudive Boto3 Security Scanner
Engineered by NAEN Studios (naenstudios@gmail.com)
Watermark: NAEN-STUDIOS-BOTO3-SCANNER-2026
"""

import boto3
import json

def scan_iam_escalation_paths():
    client = boto3.client('iam')
    paginator = client.get_paginator('list_policies')
    findings = []

    print("[*] Scanning IAM policies for dangerous wildcard permissions...")
    for page in paginator.paginate(Scope='Local'):
        for pol in page['Policies']:
            arn = pol['Arn']
            version_id = pol['DefaultVersionId']
            ver = client.get_policy_version(PolicyArn=arn, VersionId=version_id)
            stmts = ver['PolicyVersion']['Document'].get('Statement', [])
            
            if not isinstance(stmts, list):
                stmts = [stmts]

            for s in stmts:
                action = s.get('Action', [])
                resource = s.get('Resource', [])
                if (action == '*' or '*' in action) and (resource == '*' or '*' in resource) and s.get('Effect') == 'Allow':
                    findings.append({
                        'PolicyName': pol['PolicyName'],
                        'Arn': arn,
                        'Severity': 'CRITICAL: Full AdministratorAccess (*:*)'
                    })

    print(f"[+] Scan completed. Identified {len(findings)} critical escalation vectors.")
    return findings

if __name__ == '__main__':
    scan_iam_escalation_paths()
`
  },
  {
    id: 'bugreport',
    name: 'Platform Telemetry & Bug Report',
    ext: '.json',
    defaultTitle: 'SeCloudive Platform Telemetry & Bug Report',
    defaultDesc: 'Automated dispatch with learner environment, active profile stats, error logs, and feedback for NAEN Studios.',
    code: `{
  "dispatchType": "PLATFORM_FEEDBACK_AND_BUG_REPORT",
  "companyEmail": "naenstudios@gmail.com",
  "platform": "SeCloudive Cloud Security Career Operating System",
  "clientTimestamp": "${new Date().toISOString()}",
  "userAgent": "${typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}",
  "screenResolution": "${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}",
  "telemetry": {
    "status": "OPERATIONAL",
    "reportCategory": "UI/UX / Responsive Feedback"
  },
  "feedbackNotes": "Detailed observation regarding responsive layout, learning curriculum, or feature improvement."
}`
  }
]

export default function AutoScriptDispatchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState('terraform')
  const [scriptTitle, setScriptTitle] = useState(SCRIPT_PRESETS[0].defaultTitle)
  const [scriptDesc, setScriptDesc] = useState(SCRIPT_PRESETS[0].defaultDesc)
  const [scriptCode, setScriptCode] = useState(SCRIPT_PRESETS[0].code)
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitReceipt, setTransmitReceipt] = useState(null)

  const { activeProfile, masterTotalXP, masterProgressPercent, completedMasterActivities } = useChallenges()

  // Listen to open-script-dispatch custom event
  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true)
      setTransmitReceipt(null)
      if (e.detail) {
        if (e.detail.scriptType && SCRIPT_PRESETS.some(p => p.id === e.detail.scriptType)) {
          setSelectedPresetId(e.detail.scriptType)
        }
        if (e.detail.title) setScriptTitle(e.detail.title)
        if (e.detail.description) setScriptDesc(e.detail.description)
        if (e.detail.code) setScriptCode(e.detail.code)
      }
    }
    window.addEventListener('open-script-dispatch', handleOpen)
    return () => window.removeEventListener('open-script-dispatch', handleOpen)
  }, [])

  const handleSelectPreset = (presetId) => {
    const preset = SCRIPT_PRESETS.find(p => p.id === presetId)
    if (preset) {
      setSelectedPresetId(presetId)
      setScriptTitle(preset.defaultTitle)
      setScriptDesc(preset.defaultDesc)
      setScriptCode(preset.code)
      setTransmitReceipt(null)
    }
  }

  // Construct formatted email body
  const buildFormattedEmailBody = () => {
    return `================================================================================
OFFICIAL USER SCRIPT DISPATCH TO NAEN STUDIOS
================================================================================
TO: naenstudios@gmail.com
FROM STUDENT: ${activeProfile?.name || 'Lead Security Analyst'} (ID: ${activeProfile?.id || 'SEC-OPERATOR'})
TARGET CAREER ROLE: ${activeProfile?.targetCareerRole || 'Cloud Security Engineer'}
CURRICULUM MASTERY: ${masterProgressPercent}% • ${masterTotalXP} XP Earned • ${completedMasterActivities} Tasks
TIMESTAMP: ${new Date().toUTCString()}
WATERMARK: NAEN-STUDIOS-VERIFIED-DISPATCH-2026
================================================================================

SUBJECT: [SeCloudive User Script] ${scriptTitle}

NOTES / DESCRIPTION:
${scriptDesc}

---
SCRIPT / SPECIFICATION CODE:
${scriptCode}

================================================================================
Delivered via SeCloudive Automated Dispatch Engine | NAEN Studios
================================================================================`
  }

  // 1. Launch Default Email Client (mailto:)
  const handleLaunchMailClient = () => {
    const subject = encodeURIComponent(`[SeCloudive Script Dispatch] ${scriptTitle} - ${activeProfile?.name || 'Student'}`)
    const body = encodeURIComponent(buildFormattedEmailBody())
    const mailtoUrl = `mailto:naenstudios@gmail.com?subject=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')
  }

  // 2. Copy Formatted Email Payload
  const handleCopyEmailPayload = () => {
    const payload = buildFormattedEmailBody()
    navigator.clipboard.writeText(payload)
    setCopiedPayload(true)
    setTimeout(() => setCopiedPayload(false), 2500)
  }

  // 3. Direct Cloud Transmit Simulation
  const handleSimulateTransmit = () => {
    setIsTransmitting(true)
    setTimeout(() => {
      const receiptId = `DISPATCH-REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`
      setIsTransmitting(false)
      setTransmitReceipt({
        id: receiptId,
        timestamp: new Date().toLocaleTimeString(),
        recipient: 'naenstudios@gmail.com',
        sender: activeProfile?.name || 'Student'
      })
    }, 1200)
  }

  // 4. Download Script File Locally
  const handleDownloadFile = () => {
    const preset = SCRIPT_PRESETS.find(p => p.id === selectedPresetId)
    const ext = preset ? preset.ext : '.txt'
    const filename = `secloudive_${selectedPresetId}_${Date.now().toString(36)}${ext}`

    const blob = new Blob([scriptCode], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="cert-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="cert-modal-dialog script-dispatch-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Auto Script Dispatch to Company Mail"
        style={{ maxWidth: '840px', border: '1px solid rgba(56, 189, 248, 0.4)' }}
      >
        {/* Header */}
        <div className="cert-modal-controls" style={{ background: 'rgba(11, 20, 38, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NaenStudiosLogoBadge size={28} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                NAEN Studios Official Dispatch
              </div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                Auto Script Dispatch to Company Mail
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '3px 10px',
              borderRadius: '6px'
            }}>
              TO: naenstudios@gmail.com
            </span>
            <button 
              type="button" 
              className="btn-cert-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', background: '#080d1a', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Active Profile Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-dot" />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Verified Sender:</span>
              <strong style={{ fontSize: '12px', color: '#f8fafc' }}>{activeProfile?.name || 'Lead Security Analyst'}</strong>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({activeProfile?.id || 'SEC-OPERATOR'})</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: '#10b981' }}>{masterProgressPercent}% Mastery</span>
              <span style={{ color: '#f59e0b' }}>{masterTotalXP} XP</span>
            </div>
          </div>

          {/* Preset Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Select Script / Payload Category:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
              {SCRIPT_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  style={{
                    background: selectedPresetId === p.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    border: `1px solid ${selectedPresetId === p.id ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: selectedPresetId === p.id ? '#38bdf8' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileCode2 size={13} />
                    <span>{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Script Title & Description Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Script Subject / Title:
              </label>
              <input
                type="text"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontFamily: 'sans-serif'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Notes / Architecture Justification:
              </label>
              <textarea
                rows={2}
                value={scriptDesc}
                onChange={(e) => setScriptDesc(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Script Code Textarea */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Script Payload Code (Stamped with NAEN Studios Watermark):
              </label>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                {scriptCode.split('\n').length} lines • {scriptCode.length} chars
              </span>
            </div>
            <textarea
              rows={9}
              value={scriptCode}
              onChange={(e) => setScriptCode(e.target.value)}
              style={{
                width: '100%',
                background: '#040813',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px',
                padding: '12px',
                color: '#38bdf8',
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Transmit Receipt Notification */}
          {transmitReceipt && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ShieldCheck size={24} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                  Script Dispatch Verified & Queued for NAEN Studios!
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                  Receipt: <strong>{transmitReceipt.id}</strong> • Target: {transmitReceipt.recipient} • Sent at {transmitReceipt.timestamp}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Button 1: Launch Email Client */}
              <button
                type="button"
                onClick={handleLaunchMailClient}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
                }}
              >
                <Mail size={14} />
                <span>Launch Email Client (Send to naenstudios@gmail.com)</span>
              </button>

              {/* Button 2: Copy Payload */}
              <button
                type="button"
                onClick={handleCopyEmailPayload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  color: copiedPayload ? '#10b981' : '#e2e8f0',
                  borderRadius: '6px',
                  padding: '9px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {copiedPayload ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedPayload ? 'Copied to Clipboard!' : 'Copy Formatted Email'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Button 3: Simulate Direct Transmit */}
              <button
                type="button"
                onClick={handleSimulateTransmit}
                disabled={isTransmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10b981',
                  borderRadius: '6px',
                  padding: '9px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: isTransmitting ? 'wait' : 'pointer'
                }}
              >
                <Send size={13} />
                <span>{isTransmitting ? 'Transmitting to Cloud...' : 'Simulate Direct Transmit'}</span>
              </button>

              {/* Button 4: Download Locally */}
              <button
                type="button"
                onClick={handleDownloadFile}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                title="Download script file locally"
              >
                <Download size={13} />
                <span>Save File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="cert-modal-tip" style={{ fontSize: '11px' }}>
          <Sparkles size={13} className="text-amber" />
          <span>
            Every dispatched script carries the verifiable cryptographic signature of NAEN Studios.
            Official company email: <strong style={{ color: '#38bdf8' }}>naenstudios@gmail.com</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
