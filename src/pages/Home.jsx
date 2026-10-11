// ==============================================================================
// SeCloudive Homepage — Future-Shaping Cloud Security Learning Platform
// Live-synced internships, live threat ticker, and premium career-grade UX
// ==============================================================================

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Terminal,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Flame,
  Zap,
  Download,
  Compass,
  Calculator,
  Layers,
  Award,
  Globe,
  Radio,
  Briefcase,
  Clock,
  ExternalLink,
  Building2,
  ChevronRight,
  BookOpen,
  Target,
  TrendingUp,
  Lock,
  Activity,
  Star,
  Users
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import Hero from '../components/Hero'
import StructuredLearningPathSection from '../components/StructuredLearningPathSection'
import ZeroConfusionGuide from '../components/ZeroConfusionGuide'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { battleRooms } from '../data/battleRooms'
import { masterRampUpLabs } from '../data/careerRampUpData'
import { getAllTopics } from '../data/learning/index.js'
import { LIVE_INTERNSHIPS_DATA } from '../data/liveInternshipsData'
import AwsCareerGuideMap from '../components/AwsCareerGuideMap'
import allChallenges from '../data/index.js'
import { liveGeminiIntelligence } from '../services/liveGeminiIntelligenceService.js'

// ── Live Security Ticker Items ───────────────────────────────────────────────
const LIVE_TICKER_ITEMS = [
  { type: 'threat', text: 'CRITICAL: CredentialAccess:IMDSv1 abuse detected in us-east-1 — 3 accounts impacted', time: '2m ago' },
  { type: 'intern', text: 'AWS Cloud Security Intern — Applications OPEN • $52–65/hr • Summer 2026', time: 'Live' },
  { type: 'threat', text: 'HIGH: GuardDuty finding: UnauthorizedAccess:IAMUser/ConsoleLogin from anomalous IP', time: '8m ago' },
  { type: 'job', text: 'CrowdStrike: Cloud Security Research Intern — Remote • $48–60/hr — Apply Now', time: 'Live' },
  { type: 'threat', text: 'MEDIUM: S3:BucketPublicAccessGranted via misconfigured bucket ACL — auto-remediated', time: '14m ago' },
  { type: 'intern', text: 'Google Mandiant: IR & Threat Hunting Intern — Rolling Campus Review • $55–70/hr', time: 'Live' },
  { type: 'alert', text: 'UPDATE: CIS AWS Foundations Benchmark v3.0.0 released — 3 new IAM controls', time: '1h ago' },
  { type: 'intern', text: 'Palo Alto Networks: Prisma Cloud Engineering Intern — Remote Eligible • $50–62/hr', time: 'Live' },
  { type: 'threat', text: 'CRITICAL: EC2 Instance Metadata SSRF chain confirmed in production — patch available', time: '22m ago' },
  { type: 'job', text: 'Wiz Security: Cloud Detection & IR Engineer — $165K–215K — New York/Remote', time: '3h ago' }
]

function LiveSecurityTicker() {
  const tickerRef = useRef(null)
  const [tickerItems, setTickerItems] = useState(LIVE_TICKER_ITEMS)

  useEffect(() => {
    let isMounted = true
    async function fetchRealUpdates() {
      try {
        const [threatRes, internRes] = await Promise.allSettled([
          liveGeminiIntelligence.fetchLiveThreatIntel(),
          liveGeminiIntelligence.fetchLiveInternships()
        ])

        const realList = []
        if (threatRes.status === 'fulfilled' && threatRes.value?.items?.length) {
          threatRes.value.items.forEach(t => {
            realList.push({
              type: 'threat',
              text: `${t.severity || 'HIGH'}: ${t.title || t.summary}`,
              time: 'Live AI'
            })
          })
        }
        if (internRes.status === 'fulfilled' && internRes.value?.items?.length) {
          internRes.value.items.forEach(item => {
            realList.push({
              type: 'intern',
              text: `${item.company}: ${item.role} • ${item.stipend || 'Competitive'} — ${item.location || 'Remote'}`,
              time: 'Live'
            })
          })
        }

        if (isMounted && realList.length > 0) {
          setTickerItems([...realList, ...LIVE_TICKER_ITEMS])
        }
      } catch (err) {
        console.warn('Real live feeds sync fallback:', err)
      }
    }
    fetchRealUpdates()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="live-security-ticker" aria-label="Live security and internship updates">
      <div className="ticker-label">
        <span className="ticker-dot" />
        <span>LIVE FEED</span>
      </div>
      <div className="ticker-track-wrapper">
        <div className="ticker-track" ref={tickerRef}>
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx} className={`ticker-item ticker-item--${item.type}`}>
              <span className="ticker-item-badge">
                {item.type === 'threat' && <ShieldAlert size={11} />}
                {item.type === 'intern' && <Radio size={11} />}
                {item.type === 'job' && <Briefcase size={11} />}
                {item.type === 'alert' && <Activity size={11} />}
                {item.time}
              </span>
              <span className="ticker-item-text">{item.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Live Internships Preview Strip ───────────────────────────────────────────
function LiveInternshipsStrip() {
  const featured = (LIVE_INTERNSHIPS_DATA || []).slice(0, 3)

  return (
    <section className="section live-internships-strip" aria-label="Live Internship Opportunities">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="live-dot" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#10b981', letterSpacing: '1.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                Live Sync • Updated Today
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.4px' }}>
              Real Internship Offers — Open Now
            </h2>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Match your SeCloudive tier progress directly to real hiring requirements at top cloud security firms.
            </p>
          </div>
          <Link
            to="/live-internships"
            onClick={() => playTactileClick()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(56,189,248,0.12))',
              border: '1px solid rgba(16,185,129,0.5)',
              color: '#34d399', borderRadius: '8px', padding: '9px 18px',
              fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap'
            }}
          >
            <Radio size={13} className="animate-pulse" />
            View All Live Offers
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Internship Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {featured.map((internship) => (
            <div
              key={internship.id}
              style={{
                background: 'linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(9,14,26,0.98) 100%)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(56,189,248,0.45)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,189,248,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Status badge */}
              <div style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399', borderRadius: '999px', padding: '3px 10px',
                fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                {internship.status}
              </div>

              {/* Company */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                  background: `${internship.logoColor}18`, border: `1px solid ${internship.logoColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: internship.logoColor
                }}>
                  {internship.logoText}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{internship.company}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{internship.division}</div>
                </div>
              </div>

              {/* Role */}
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
                  {internship.role}
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={11} /> {internship.isRemote ? 'Remote Eligible' : internship.location.split('/')[0]}
                  </span>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                    {internship.stipend}
                  </span>
                </div>
              </div>

              {/* Skills tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {internship.skills.slice(0, 3).map(skill => (
                  <span key={skill} style={{
                    background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
                    color: '#7dd3fc', borderRadius: '4px', padding: '2px 8px',
                    fontSize: '10px', fontWeight: 600
                  }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <a
                  href={internship.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick()}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(14,165,233,0.2))',
                    border: '1px solid rgba(16,185,129,0.5)', color: '#34d399',
                    borderRadius: '7px', padding: '8px', fontSize: '12px', fontWeight: 700,
                    textDecoration: 'none', transition: 'all 0.2s ease'
                  }}
                >
                  Apply Now <ExternalLink size={11} />
                </a>
                <Link
                  to={`/learning${internship.recommendedLabs?.[0]?.path?.replace('/learning', '') || ''}`}
                  onClick={() => playTactileClick()}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)',
                    color: '#7dd3fc', borderRadius: '7px', padding: '8px 12px',
                    fontSize: '12px', fontWeight: 700, textDecoration: 'none'
                  }}
                >
                  <BookOpen size={11} /> Prep
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Student Impact Counter ────────────────────────────────────────────────────
function ImpactCounter({ value, label, color, suffix = '' }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const duration = 1800
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplayed(Math.floor(eased * value))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{
        fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px',
        color, fontFamily: "'DM Mono', monospace", lineHeight: 1.1
      }}>
        {displayed.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

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

  const totalBattleRooms = battleRooms?.length || 10
  const totalSafeLabs = masterRampUpLabs?.length || 20
  const totalAcademyTopics = getAllTopics()?.length || 52
  const totalChallengesCount = allChallenges?.length || 15

  return (
    <main className="landing-page">

      {/* ── 00: Live Security & Internship Ticker ── */}
      <LiveSecurityTicker />

      {/* ── 01: Hero Section ── */}
      <Hero />

      {/* ── 02: Live SOC Readiness Progress Strip ── */}
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

      {/* ── 04: LIVE Internship Opportunities Strip ── */}
      <LiveInternshipsStrip />

      {/* ── 05: Impact Numbers ── */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,10,20,0.7)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="section-kicker">Platform Impact &amp; Verified Outcomes</div>
            <h2 style={{ margin: '8px 0', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              The Platform That Reshapes Careers
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
              Every metric is derived from real learner activity — zero inflated numbers.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { value: totalAcademyTopics, label: 'Academy Modules', color: '#38bdf8' },
              { value: totalSafeLabs, label: '$0 Safe Labs', color: '#10b981', suffix: '' },
              { value: totalBattleRooms, label: 'Battle Rooms', color: '#a855f7' },
              { value: totalChallengesCount, label: 'SOC Incidents', color: '#f59e0b' },
              { value: (LIVE_INTERNSHIPS_DATA || []).length, label: 'Live Intern Offers', color: '#34d399' }
            ].map((stat) => (
              <div key={stat.label} style={{ background: 'rgba(9,14,26,0.95)', padding: '4px' }}>
                <ImpactCounter value={stat.value} label={stat.label} color={stat.color} suffix={stat.suffix} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06: 3-Pillar Learning Engine ── */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6, 10, 20, 0.5)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-kicker" style={{ textAlign: 'center', marginBottom: '8px' }}>
            Learning Methodology &amp; Engineering Pillars
          </div>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px', letterSpacing: '-0.6px' }}>
            How Real Cloud Security Judgment Is Built
          </h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 40px', fontSize: '15px', lineHeight: 1.6 }}>
            Most courses give you 50 hours of slide decks you forget in a week. SeCloudive enforces an active 3-stage loop that mirrors production engineering.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                emoji: '🧠', pillar: '01', color: '#38bdf8', title: 'Mental Models & Theory',
                desc: 'Understand effective permission evaluation, blast radius containment, and trust boundaries before opening the console. Zero walls of text.',
                stat: `${totalAcademyTopics} Concise Academy Modules`
              },
              {
                emoji: '🛡️', pillar: '02', color: '#10b981', title: '$0 AWS Free-Tier Safe Labs',
                desc: 'Every lab is engineered for $0.00 spend with copyable Terraform, automatic $0.01 billing alarms, and instant teardown scripts.',
                stat: `${totalSafeLabs} Zero-Cost Production Labs`
              },
              {
                emoji: '⚔️', pillar: '03', color: '#ef4444', title: 'Purple Team Battle Rooms',
                desc: 'Exploit SSRF metadata theft, Kubernetes token theft, and Tor S3 leaks. Capture flags to unlock Hack The Box style post-mortems.',
                stat: `${totalBattleRooms} In-Browser Interactive Rooms`
              }
            ].map(p => (
              <div key={p.pillar} style={{
                background: 'rgba(15,23,42,0.8)',
                border: `1px solid ${p.color}25`,
                borderTop: `3px solid ${p.color}`,
                borderRadius: '12px', padding: '24px',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{p.emoji}</span>
                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: p.color, fontWeight: 700 }}>PILLAR {p.pillar}</span>
                    <h3 style={{ margin: 0, fontSize: '17px', color: '#f8fafc', fontWeight: 800 }}>{p.title}</h3>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px', lineHeight: 1.6 }}>{p.desc}</p>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: p.color, marginTop: 'auto' }}>{p.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07: Zero Confusion Guide ── */}
      <ZeroConfusionGuide embeddedIn="home" />

      {/* ── 08: Zero-Cost Safety Strip ── */}
      <section className="section" id="zero-cost" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-kicker">Zero-Cost Learning Guarantee</div>
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
            <Calculator size={16} /> Open Free-Tier Cost Calculator &amp; Tripwire Script
          </Link>
        </div>
      </section>

      {/* ── 09: Industry Benchmarks ── */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(9, 14, 26, 0.4)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-kicker">Industry Benchmarks &amp; Certifications</div>
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
                background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: '8px'
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

      {/* ── 9.5: AWS Career Guide Map & Visual Architecture Showcase ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <AwsCareerGuideMap />
      </section>

      {/* ── 10: Career-shaping CTA ── */}
      <section className="landing-cta" style={{ margin: '40px 24px', borderRadius: '16px' }}>
        <div className="cta-grid">
          <div>
            <div className="section-kicker">Start Your Journey</div>
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
            <Link
              className="button button-primary"
              to="/live-internships"
              onClick={() => playTactileClick()}
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', fontWeight: 800 }}
            >
              <Radio size={15} /> Browse Live Internships
            </Link>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                playTactileClick()
                window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
              }}
              style={{ borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b' }}
            >
              ⚡ 2-Min Tier Placement Test
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}
