// ==============================================================================
// SeCloudive Homepage - Structured Learning Redesign
// Pure Clarity, Zero Confusion, 4-Tier Progressive Career Journey
// ==============================================================================

import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Zap, 
  Download, 
  Compass, 
  Calculator, 
  Layers,
  Award,
  Globe
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import Hero from '../components/Hero'
import StructuredLearningPathSection from '../components/StructuredLearningPathSection'
import ZeroConfusionGuide from '../components/ZeroConfusionGuide'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { battleRooms } from '../data/battleRooms'
import { masterRampUpLabs } from '../data/careerRampUpData'
import { getAllTopics } from '../data/learning/index.js'
import allChallenges from '../data/index.js'

export default function Home() {
  const { 
    completedMasterActivities, 
    totalMasterActivities, 
    masterProgressPercent, 
    masterTotalXP,
    battleRoomsSolvedCount,
    rampupLabsCompletedCount,
    learningTopicsCompletedCount,
    completedCount
  } = useChallenges()

  // Strictly dynamic denominators (Zero fixed/hardcoded metrics)
  const totalBattleRooms = battleRooms?.length || 10
  const totalSafeLabs = masterRampUpLabs?.length || 20
  const totalAcademyTopics = getAllTopics()?.length || 52
  const totalChallengesCount = allChallenges?.length || 15

  return (
    <main className="landing-page">
      {/* ── 01: Hero Section ── */}
      <Hero />

      {/* ── 02: Synchronized Live Security Journey Progress Strip ── */}
      <section className="live-journey-banner" aria-label="Synchronized Security Training Progress">
        <div className="live-journey-inner">
          <div className="live-journey-status">
            <span className="live-dot" style={{ position: 'relative', display: 'inline-block' }} />
            <div>
              <div className="live-journey-heading">
                <span>Live SOC Readiness Profile</span>
                <span className="live-journey-pct">{masterProgressPercent}%</span>
              </div>
              <p className="live-journey-sub">
                {completedMasterActivities === 0 
                  ? 'Your structured cloud security path awaits — start Tier 1 below'
                  : `${completedMasterActivities} of ${totalMasterActivities} master challenges completed • ${masterTotalXP} Total XP Earned`}
              </p>
            </div>
          </div>
          
          <div className="live-journey-track">
            <div className="live-journey-fill" style={{ width: `${masterProgressPercent}%` }} />
          </div>

          <div className="live-journey-actions">
            <div className="live-journey-metrics">
              <span className="live-metric-chip"><strong>{battleRoomsSolvedCount}</strong> / {totalBattleRooms} Battle Rooms</span>
              <span className="live-metric-chip"><strong>{rampupLabsCompletedCount}</strong> / {totalSafeLabs} Safe Labs</span>
              <span className="live-metric-chip"><strong>{learningTopicsCompletedCount}</strong> / {totalAcademyTopics} Academy</span>
              <span className="live-metric-chip"><strong>{completedCount}</strong> / {totalChallengesCount} Incidents</span>
            </div>
            <Link to="/dashboard" className="btn-resume-journey" onClick={() => playTactileClick()}>
              {completedMasterActivities > 0 ? 'Resume Training' : 'View SOC Dashboard'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 03: The Centerpiece — 4-Tier Structured Learning Roadmap ── */}
      <StructuredLearningPathSection />

      {/* ── 04: The 3-Pillar Learning Engine (Why This Works) ── */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6, 10, 20, 0.5)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-kicker" style={{ textAlign: 'center', marginBottom: '8px' }}>
            PEDAGOGICAL ARCHITECTURE <span>///</span> THE 3-PILLAR LOOP
          </div>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px', letterSpacing: '-0.6px' }}>
            How Real Cloud Security Judgment Is Built
          </h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 40px', fontSize: '15px', lineHeight: 1.6 }}>
            Most courses give you 50 hours of slide decks you forget in a week. SeCloudive enforces an active 3-stage loop that mirrors production engineering.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Pillar 1 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderTop: '3px solid #38bdf8',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🧠</span>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>PILLAR 01</span>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#f8fafc', fontWeight: 800 }}>Mental Models & Theory</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px', lineHeight: 1.6 }}>
                Understand effective permission evaluation, blast radius containment, and trust boundaries before opening the console. Zero walls of text.
              </p>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', marginTop: 'auto' }}>
                {totalAcademyTopics} Concise Academy Modules
              </span>
            </div>

            {/* Pillar 2 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderTop: '3px solid #10b981',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>PILLAR 02</span>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#f8fafc', fontWeight: 800 }}>$0 AWS Free-Tier Safe Labs</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px', lineHeight: 1.6 }}>
                Every lab is engineered for $0.00 spend with copyable Terraform, automatic $0.01 billing alarms, and instant teardown scripts.
              </p>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34d399', marginTop: 'auto' }}>
                {totalSafeLabs} Zero-Cost Production Labs
              </span>
            </div>

            {/* Pillar 3 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderTop: '3px solid #ef4444',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>⚔️</span>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f87171', fontWeight: 700 }}>PILLAR 03</span>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#f8fafc', fontWeight: 800 }}>Purple Team Battle Rooms</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px', lineHeight: 1.6 }}>
                Exploit SSRF metadata theft, Kubernetes token theft, and Tor S3 leaks. Capture flags to unlock Hack The Box style post-mortems and Terraform fixes.
              </p>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f87171', marginTop: 'auto' }}>
                {totalBattleRooms} In-Browser Interactive Rooms
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05: Zero Confusion Platform Guide ── */}
      <ZeroConfusionGuide embeddedIn="home" />

      {/* ── 06: Zero-Cost Safety Guarantee Strip ── */}
      <section className="section" id="zero-cost" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-kicker">FINANCIAL PROTECTION HARNESS</div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>
            Learn Cloud Security for <span style={{ color: '#10b981' }}>$0.00</span> with Zero Billing Fear
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
            We guarantee every lab stays strictly within the AWS Free Tier. You receive automated CloudWatch $0.01 billing alarms, 
            instant teardown bash scripts, and LocalStack emulation guides so you never receive an accidental bill.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {[
              { label: '$0.01 Budget Tripwires', color: '#10b981' },
              { label: 'One-Click Teardown Scripts', color: '#38bdf8' },
              { label: 'Free Tier Whitelist Only', color: '#a855f7' },
              { label: 'LocalStack Emulation', color: '#f59e0b' }
            ].map((tag) => (
              <span key={tag.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: `${tag.color}12`, border: `1px solid ${tag.color}30`,
                color: tag.color, borderRadius: '20px', padding: '5px 14px',
                fontSize: '0.8rem', fontWeight: 700
              }}>
                <CheckCircle2 size={13} /> {tag.label}
              </span>
            ))}
          </div>
          <Link 
            to="/cost-calculator" 
            className="button button-primary"
            onClick={() => playTactileClick()}
            style={{ background: 'linear-gradient(135deg, #059669, #0284c7)' }}
          >
            <Calculator size={16} /> Open Free-Tier Cost Calculator & Tripwire Script
          </Link>
        </div>
      </section>

      {/* ── 07: Enterprise Standards Alignment ── */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(9, 14, 26, 0.4)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-kicker">INDUSTRY BENCHMARKS & CERTIFICATIONS</div>
          <h3 style={{ fontSize: '18px', color: '#cbd5e1', fontWeight: 700, margin: '0 0 20px' }}>
            Directly aligned with real cloud security hiring standards:
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { name: 'AWS Certified Security - Specialty', tag: 'SCS-C02' },
              { name: 'NIST SP 800-53 Rev. 5', tag: 'AU-2 / SC-13' },
              { name: 'CIS AWS Foundations Benchmark', tag: 'v3.0.0' },
              { name: 'MITRE ATT&CK Cloud Matrix', tag: 'Enterprise Cloud' }
            ].map(item => (
              <div key={item.name} style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} className="text-cyan" />
                <span style={{ fontSize: '12.5px', color: '#f1f5f9', fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '4px' }}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08: Bottom Action CTA ── */}
      <section className="landing-cta" style={{ margin: '40px 24px', borderRadius: '16px' }}>
        <div className="cta-grid">
          <div>
            <div className="section-kicker">ZERO FLUFF /// 100% HANDS-ON CLOUD SECURITY</div>
            <h2>Ready to start Tier 1?<br /><span>Begin your structured journey now.</span></h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link 
              className="button button-primary" 
              to="/learning/foundations/linux-fundamentals" 
              onClick={() => playTactileClick()}
              style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', fontWeight: 800 }}
            >
              ▶ Start Tier 1: Core Toolbox <ArrowRight size={17} />
            </Link>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                playTactileClick()
                window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
              }}
              style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}
            >
              ⚡ 2-Min Tier Placement Test
            </button>
            <Link 
              className="button button-ghost" 
              to="/battle-rooms"
              onClick={() => playTactileClick()}
            >
              Battle Rooms (CTF)
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
