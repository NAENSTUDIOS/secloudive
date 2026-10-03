import { useState } from 'react'
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, ShieldAlert, Terminal, Activity, Eye, Lock, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { playTactileClick } from '../utils/cyberMotionAudio'
import SeCloudiveLogo from './SeCloudiveLogo'

const CONSOLE_MODES = {
  threatModel: {
    id: 'threatModel',
    title: 'secloudive / threat-model',
    badge: 'LIVE',
    lines: [
      { text: '> initializing automated security review...', type: 'muted' },
      { text: '> scanning principal: iam-prod-role', type: 'normal' },
      { text: '✓ trust boundary validated against SCP guardrail', type: 'success' },
      { text: '> evaluating 12 IAM statement actions against Access Analyzer', type: 'normal' },
    ],
    score: '24',
    riskLabel: 'LOW RISK',
    riskClass: 'risk-low',
    footer: '> zero public wildcards detected. recommendation ready_'
  },
  cloudTrail: {
    id: 'cloudTrail',
    title: 'secloudive / cloudtrail-stream',
    badge: 'STREAMING',
    lines: [
      { text: '> VPC Flow Log: ACCEPT 198.51.100.24 10.0.1.50 443 TCP', type: 'muted' },
      { text: '> CloudTrail Event: sts:AssumeRole for ProductionAppProfile', type: 'normal' },
      { text: '⚠ Anomalous IP origin detected outside corporate CIDR', type: 'warning' },
      { text: '> Athena query triggered: SELECT eventTime, eventSource, recipientAccountId', type: 'normal' },
    ],
    score: '88',
    riskLabel: 'HIGH RISK',
    riskClass: 'text-amber',
    footer: '> automated quarantine ticket dispatched to on-call_'
  },
  guardDuty: {
    id: 'guardDuty',
    title: 'secloudive / guardduty-sentry',
    badge: 'CRITICAL',
    lines: [
      { text: '> GuardDuty Finding: UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration', type: 'muted' },
      { text: '> Target Resource: customer-financial-vault (S3 Bucket)', type: 'normal' },
      { text: '✕ BlockPublicAcls drift detected via CloudFormation', type: 'danger' },
      { text: '> Automated Lambda containment: IAM session revoked instantly', type: 'success' },
    ],
    score: '96',
    riskLabel: 'CRITICAL ALERT',
    riskClass: 'text-rose',
    footer: '> containment completed in 420ms with $0 data loss_'
  }
}

export default function Hero() {
  const [activeConsole, setActiveConsole] = useState('threatModel')
  const currentMode = CONSOLE_MODES[activeConsole]

  const switchMode = (modeKey) => {
    playTactileClick()
    setActiveConsole(modeKey)
  }

  return (
    <section className="hero landing-hero cyber-ambient-grid">
      <div className="hero-copy stagger-in stagger-1">
        <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <SeCloudiveLogo size={12} variant="cyan" glow={false} />
          </span>
          <span className="pulse-dot" /> STRUCTURED CLOUD SECURITY PATHWAY /// ZERO TO HIRE
        </div>
        <h1>
          Master Cloud Security. <em>From Zero to Hire.</em>
        </h1>
        <p>
          A crystal-clear, 4-tier engineering roadmap from zero to enterprise architect. Build Linux foundations, deploy with Docker and Terraform, scale with Kubernetes and CI/CD, then master multi-cloud architecture — all with live combat labs and $0 safe practice environments.
        </p>
        <div className="hero-actions" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <a 
            className="button button-primary button-cyber-shimmer motion-button" 
            href="#structured-path" 
            onClick={(e) => {
              playTactileClick()
              const el = document.getElementById('structured-path')
              if (el) {
                e.preventDefault()
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
            style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', 
              boxShadow: '0 8px 25px rgba(2, 132, 199, 0.45)',
              fontWeight: 800
            }}
          >
            ▶ Explore Structured Path <ArrowRight size={17} />
          </a>
          <button
            type="button"
            className="button button-ghost motion-button"
            onClick={() => {
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
            }}
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}
            title="Take 2-Minute Diagnostic Placement to fast-track to Tier 2 or 3"
          >
            ⚡ 2-Min Placement Test
          </button>
          <button
            type="button"
            className="button button-ghost motion-button"
            onClick={() => {
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-platform-guide'))
            }}
            style={{ borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.06)' }}
            title="New to SeCloudive? Open 30-Sec Compass (Alt+H)"
          >
            <Compass size={15} /> 🎯 Where to Start Guide
          </button>
        </div>

        {/* Clear Trust & Value Guarantees */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', fontSize: '0.78rem', color: '#94a3b8' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#10b981' }}>✓</span> Beginner Friendly (Zero Prereqs)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#38bdf8' }}>✓</span> $0 Free-Tier Safe Labs
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#ef4444' }}>✓</span> Live Combat CTF Battle Rooms
          </span>
        </div>
      </div>

      <div className="hero-visual stagger-in stagger-2">
        <div className="signal-orb"><span /><span /><span /></div>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        {/* Interactive Holographic Console */}
        <div className="hero-console cyber-glass-panel motion-card" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
          {/* Console Header Tabs */}
          <div className="console-top" style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                type="button"
                onClick={() => switchMode('threatModel')}
                style={{
                  background: activeConsole === 'threatModel' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeConsole === 'threatModel' ? '#38bdf8' : '#64748b',
                  fontSize: '0.62rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 5px'
                }}
              >
                THREAT-MODEL
              </button>
              <button
                type="button"
                onClick={() => switchMode('cloudTrail')}
                style={{
                  background: activeConsole === 'cloudTrail' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeConsole === 'cloudTrail' ? '#f59e0b' : '#64748b',
                  fontSize: '0.62rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 5px'
                }}
              >
                CLOUDTRAIL
              </button>
              <button
                type="button"
                onClick={() => switchMode('guardDuty')}
                style={{
                  background: activeConsole === 'guardDuty' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeConsole === 'guardDuty' ? '#f43f5e' : '#64748b',
                  fontSize: '0.62rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 5px'
                }}
              >
                GUARDDUTY
              </button>
            </div>
            <span className={`console-live ${activeConsole === 'guardDuty' ? 'text-rose' : activeConsole === 'cloudTrail' ? 'text-amber' : ''}`} style={{ fontSize: '0.65rem' }}>
              {currentMode.badge}
            </span>
          </div>

          {/* Console Body */}
          <div className="console-body" style={{ minHeight: '190px' }}>
            {currentMode.lines.map((ln, idx) => (
              <div 
                key={idx} 
                className={`console-line ${ln.type === 'muted' ? 'muted' : ln.type === 'success' ? 'success' : ln.type === 'warning' ? 'text-amber' : ln.type === 'danger' ? 'text-rose' : ''}`}
                style={{ fontSize: '0.72rem', lineHeight: 1.6 }}
              >
                {ln.text}
              </div>
            ))}

            <div className="risk-row" style={{ margin: '14px 0', padding: '10px 0' }}>
              <span>RISK SCORE</span>
              <strong>{currentMode.score} <small>/ 100</small></strong>
              <span className={currentMode.riskClass}>{currentMode.riskLabel}</span>
            </div>

            <div className="console-line muted" style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {currentMode.footer}
            </div>
          </div>
        </div>

        {/* Floating Verified Posture Card */}
        <div className="shield-float cyber-glass-panel motion-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <ShieldCheck size={28} className="beacon-pulse-emerald" />
          <span>
            Security Posture
            <br />
            <b style={{ color: '#34d399' }}>Protected</b>
          </span>
        </div>

        <div className="hero-note" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#38bdf8" /> judgment over memorization
        </div>
      </div>
    </section>
  )
}
