// ==============================================================================
// SeCloudive Topic AWS Job & Interview Readiness Engine
// Transforms academic theory into recruiter-vetted interview answers
// and production verification commands for AWS Security roles.
// ==============================================================================

import { useState } from 'react'
import { 
  Briefcase, 
  Award, 
  Terminal, 
  Copy, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Lightbulb, 
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopicJobReadinessCard({ topic, pathId = 'iam' }) {
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedStar, setCopiedStar] = useState(false)

  // Generate or extract tailored interview question
  const interviewQ = topic?.interviewQuestions?.[0]?.question || 
    `In an enterprise AWS production environment, how do you audit and enforce least privilege for ${topic?.title || 'this service'}?`

  // Tailored STAR answer
  const starAnswer = {
    situation: `During an AWS security audit of an enterprise multi-account environment, our team discovered configuration drift and broad wildcards in ${topic?.title || 'cloud resources'}.`,
    action: `I audited the active policies using the AWS CLI and IAM Access Analyzer, replaced root and static credentials with short-lived STS tokens and permission boundaries, and enforced strict condition keys (aws:PrincipalOrgID, aws:SecureTransport).`,
    result: `Eliminated 100% of untrusted cross-account access paths, established zero-spend automated drift alerting, and verified compliance against CIS AWS Foundations Benchmark v3.0.`
  }

  // Verification CLI command
  const cliVerify = topic?.whatACloudSecEngineerChecks?.[0]?.command || 
    topic?.codeSnippet?.code?.split('\n')[0] || 
    `aws iam get-account-authorization-details --output json | jq '.RoleDetailList[0]'`

  const certDomain = pathId === 'iam' 
    ? 'AWS Certified Security – Specialty (SCS-C02) • Domain 3: Identity & Access Management'
    : pathId === 's3' 
    ? 'AWS Certified Security – Specialty (SCS-C02) • Domain 4: Data Protection'
    : pathId === 'network'
    ? 'AWS Certified Security – Specialty (SCS-C02) • Domain 5: Management & Security Governance'
    : 'AWS Certified Security – Specialty (SCS-C02) • Domain 1: Threat Detection & Incident Response'

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(cliVerify)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  const handleCopyStar = () => {
    const fullText = `Situation: ${starAnswer.situation}\nAction: ${starAnswer.action}\nResult: ${starAnswer.result}`
    navigator.clipboard?.writeText(fullText)
    setCopiedStar(true)
    setTimeout(() => setCopiedStar(false), 2000)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 32, 58, 0.98) 100%)',
      border: '1px solid rgba(255, 153, 0, 0.35)',
      borderRadius: '12px',
      padding: '22px',
      marginBottom: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 153, 0, 0.08)'
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '10px',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ff9900 0%, #f59e0b 100%)',
              color: '#0f172a',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.8px'
            }}>
              AWS JOB &amp; INTERN READINESS
            </span>
            <span style={{ fontSize: '11px', color: '#ffb347', fontFamily: "'DM Mono', monospace" }}>
              • Recruiter &amp; Hiring Manager Vetted
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Interview Defense &amp; Production Verification</span>
          </h3>
        </div>

        <span style={{
          fontSize: '11px',
          background: 'rgba(255, 153, 0, 0.12)',
          border: '1px solid rgba(255, 153, 0, 0.3)',
          color: '#ffb347',
          padding: '4px 10px',
          borderRadius: '6px',
          fontFamily: "'DM Mono', monospace",
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Award size={13} />
          {certDomain}
        </span>
      </div>

      {/* ── Real Interview Question ── */}
      <div style={{
        background: 'rgba(2, 6, 23, 0.6)',
        borderLeft: '4px solid #ff9900',
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#ff9900', fontFamily: "'DM Mono', monospace", marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={14} />
          COMMON AWS TECHNICAL SCREENING QUESTION:
        </div>
        <div style={{ fontSize: '13.5px', color: '#f8fafc', fontWeight: 600, fontStyle: 'italic' }}>
          "{interviewQ}"
        </div>
      </div>

      {/* ── STAR Methodology Answer Blueprint ── */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={14} />
            RECOMMENDED STAR METHOD INTERVIEW RESPONSE
          </div>
          <button
            type="button"
            onClick={handleCopyStar}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: copiedStar ? '#10b981' : '#cbd5e1',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copiedStar ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedStar ? 'Copied STAR Response' : 'Copy Full STAR Answer'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6 }}>
          <div>
            <strong style={{ color: '#f59e0b' }}>Situation &amp; Task: </strong>
            <span>{starAnswer.situation}</span>
          </div>
          <div>
            <strong style={{ color: '#38bdf8' }}>Action Taken: </strong>
            <span>{starAnswer.action}</span>
          </div>
          <div>
            <strong style={{ color: '#10b981' }}>Quantifiable Result: </strong>
            <span>{starAnswer.result}</span>
          </div>
        </div>
      </div>

      {/* ── Production CLI Audit Command ── */}
      <div style={{
        background: '#091322',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          background: 'rgba(56, 189, 248, 0.08)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: "'DM Mono', monospace", color: '#7dd3fc' }}>
            <Terminal size={13} />
            <span>PRODUCTION AUDIT COMMAND (RUN IN AWS CLI)</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCmd}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: copiedCmd ? '#10b981' : '#94a3b8',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copiedCmd ? <Check size={11} /> : <Copy size={11} />}
            <span>{copiedCmd ? 'Copied Command' : 'Copy'}</span>
          </button>
        </div>
        <pre style={{
          margin: 0,
          padding: '12px 16px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '11.5px',
          color: '#38bdf8',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {cliVerify}
        </pre>
      </div>
    </div>
  )
}
