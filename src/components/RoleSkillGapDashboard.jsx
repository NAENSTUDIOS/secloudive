import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Award,
  ChevronRight,
  ExternalLink,
  Target,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Compass,
  Cpu,
  Clock,
  Send
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import {
  EXPANDED_SECURITY_ROLES,
  VERIFIED_MARKET_SOURCES,
  calculateRoleSimilarity
} from '../data/roleMarketData'
import { resumeCoachService } from '../services/intelligenceEngine'

export default function RoleSkillGapDashboard({ initialRole = 'cloud-security-engineer', onClose = null }) {
  const {
    progress,
    completedCount,
    architectureReviewedCount,
    completedLabsCount,
    investigationCompletedCount,
    totalScore,
    masterCareerProfile
  } = useChallenges()

  // Primary Selected Role
  const [selectedRoleId, setSelectedRoleId] = useState(initialRole)

  // Secondary Role for Side-by-Side Comparison
  const [compareRoleId, setCompareRoleId] = useState('soc-analyst')

  // Active View Tab: 'gap' | 'compare' | 'salary' | 'forecast' | 'sources'
  const [activeTab, setActiveTab] = useState('gap')

  // AI Advisor State
  const [aiAdvice, setAiAdvice] = useState(null)
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)

  // Find Role Objects
  const primaryRole = useMemo(() => {
    return EXPANDED_SECURITY_ROLES.find(r => r.id === selectedRoleId) || EXPANDED_SECURITY_ROLES[0]
  }, [selectedRoleId])

  const compareRole = useMemo(() => {
    return EXPANDED_SECURITY_ROLES.find(r => r.id === compareRoleId) || EXPANDED_SECURITY_ROLES[1]
  }, [compareRoleId])

  // Calculate Similarity Score
  const similarityScore = useMemo(() => {
    return calculateRoleSimilarity(primaryRole.id, compareRole.id)
  }, [primaryRole.id, compareRole.id])

  // Derive User's Domain Skills based on live platform telemetry
  const userDomainScores = useMemo(() => {
    const learningTopics = progress?.learningTopicsCompleted || []
    const invCount = investigationCompletedCount || 0
    const archCount = architectureReviewedCount || 0
    const labCount = completedLabsCount || 0

    return {
      identity: Math.min(100, 30 + (learningTopics.length * 6) + (invCount * 3)),
      data: Math.min(100, 30 + (invCount * 5) + (completedCount * 4)),
      network: Math.min(100, 25 + (archCount * 12) + (labCount * 4)),
      monitoring: Math.min(100, 35 + (invCount * 4) + (learningTopics.length * 4)),
      incidentResponse: Math.min(100, 20 + (invCount * 5) + (labCount * 6)),
      architecture: Math.min(100, 20 + (archCount * 18)),
      devsecops: Math.min(100, 20 + (labCount * 8)),
      threatHunting: Math.min(100, 25 + (invCount * 3) + (completedCount * 3)),
      compliance: Math.min(100, 30 + (archCount * 10) + (learningTopics.length * 3))
    }
  }, [progress, investigationCompletedCount, architectureReviewedCount, completedLabsCount, completedCount])

  // Calculate Overall Role Readiness %
  const roleReadinessPercent = useMemo(() => {
    const requirements = primaryRole.domainRequirements
    let totalEarned = 0
    let totalReq = 0

    Object.keys(requirements).forEach(domain => {
      const req = requirements[domain]
      const user = userDomainScores[domain] || 20
      totalReq += req
      totalEarned += Math.min(req, user)
    })

    return Math.round((totalEarned / totalReq) * 100)
  }, [primaryRole, userDomainScores])

  // Categorize 9 Domains into Ready, Developing, Missing
  const categorizedDomains = useMemo(() => {
    const list = []
    const domainLabels = {
      identity: 'Identity & Access (IAM/ABAC)',
      data: 'Data Security & Encryption (S3/KMS)',
      network: 'Network & Perimeter (VPC/WAF)',
      monitoring: 'Monitoring & Telemetry (CloudTrail/GuardDuty)',
      incidentResponse: 'Incident Response & Containment',
      architecture: 'Cloud Security Architecture',
      devsecops: 'DevSecOps & CI/CD Security',
      threatHunting: 'Threat Hunting & Log Forensics',
      compliance: 'Compliance & Governance (CIS/SOC2)'
    }

    Object.keys(primaryRole.domainRequirements).forEach(key => {
      const required = primaryRole.domainRequirements[key]
      const current = userDomainScores[key] || 25
      const gap = Math.max(0, required - current)

      let status = 'ready' // 'ready' | 'developing' | 'learning-required' | 'major-gap'
      let statusBadge = '🟢 Ready'
      if (current >= required) {
        status = 'ready'
        statusBadge = '🟢 Ready'
      } else if (current >= required * 0.75) {
        status = 'developing'
        statusBadge = '🟡 Developing'
      } else if (current >= required * 0.5) {
        status = 'learning-required'
        statusBadge = '🟠 Learning Required'
      } else {
        status = 'major-gap'
        statusBadge = '🔴 Major Gap'
      }

      list.push({
        id: key,
        label: domainLabels[key] || key,
        required,
        current,
        gap,
        status,
        statusBadge
      })
    })

    return list.sort((a, b) => b.gap - a.gap)
  }, [primaryRole, userDomainScores])

  // Handle AI Career Advisor generation
  const handleGenerateAdvisor = async () => {
    setIsGeneratingAdvice(true)
    try {
      const topGaps = categorizedDomains.filter(d => d.gap > 0).slice(0, 3).map(d => d.label)
      const advice = await resumeCoachService.generateResumeBullets({
        role: primaryRole.title,
        completedLabsCount,
        architectureReviewedCount,
        investigationCompletedCount
      })
      setAiAdvice({
        topGaps,
        advice: advice.bullets || [
          `Focus on ${topGaps[0] || 'Security Architecture'} by completing hands-on SOP labs.`,
          `Practice multi-account SCP containment scenarios in the Architecture Review Center.`,
          `Review MITRE ATT&CK Cloud technique T1552.005 in the Incident Simulator.`
        ]
      })
    } catch {
      setAiAdvice({
        topGaps: ['Security Architecture', 'IAM Boundaries'],
        advice: [
          `Prioritize completing the 3-Tier Multi-AZ Architecture Review to close your architecture gap.`,
          `Run the IAM Privilege Escalation SOP lab to demonstrate least-privilege enforcement.`
        ]
      })
    } finally {
      setIsGeneratingAdvice(false)
    }
  }

  return (
    <div className="role-skillgap-dashboard-container animate-fade-in" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.9) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(16px)',
      color: '#f8fafc',
      margin: '20px 0'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Compass size={13} />
            <span>Role-Based Career Intelligence & Skill Gap Radar</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
            Cloud Security Career & Market Outlook Terminal
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', maxWidth: '680px' }}>
            Analyze exact skill gaps separating you from your target cloud security role. Review salary ranges, market demand, side-by-side role comparisons, and 3-year career forecasts backed by verified sources.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(51, 65, 85, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Role Picker Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Target Role:</span>
          <select
            value={selectedRoleId}
            onChange={e => setSelectedRoleId(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #38bdf8',
              borderRadius: '8px',
              color: '#f8fafc',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {EXPANDED_SECURITY_ROLES.map(role => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.demandScore} Demand)
              </option>
            ))}
          </select>
        </div>

        {/* Readiness Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Readiness:</span>
          <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>{roleReadinessPercent}%</strong>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Market Growth:</span>
          <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{primaryRole.demandGrowth}</strong>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'gap', label: '9-Category Skill Gap', icon: Target },
          { id: 'compare', label: 'Side-by-Side Role Compare', icon: Layers },
          { id: 'salary', label: 'Salary & Demand Analytics', icon: DollarSign },
          { id: 'forecast', label: '3-Year Career Forecast', icon: TrendingUp },
          { id: 'sources', label: 'Verified Sources & Transparency', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: '8px',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 9-CATEGORY SKILL GAP RADAR */}
      {/* ============================================================== */}
      {activeTab === 'gap' && (
        <div>
          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Role</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {primaryRole.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '4px' }}>
                {primaryRole.overview}
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Average Base Salary</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {primaryRole.salary.globalAverage} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/yr</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '4px' }}>
                Senior range: {primaryRole.salary.senior}
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Hiring Readiness</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
                {roleReadinessPercent}% Match
              </div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '4px' }}>
                {categorizedDomains.filter(d => d.status === 'ready').length} of 9 domains ready
              </div>
            </div>
          </div>

          {/* 9 Domains Progress Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {categorizedDomains.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${item.gap === 0 ? 'rgba(16, 185, 129, 0.3)' : item.gap < 20 ? 'rgba(251, 146, 60, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: '8px',
                  padding: '12px 18px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{item.label}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{item.statusBadge}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    Current: <strong style={{ color: '#38bdf8' }}>{item.current}%</strong> / Required: <strong style={{ color: '#f8fafc' }}>{item.required}%</strong>
                  </div>
                </div>

                {/* Progress Bar with Target Marker */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.current}%`,
                      background: item.gap === 0 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      borderRadius: '4px',
                      transition: 'width 0.4s'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Career Coach Guidance */}
          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#38bdf8' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Gemini Career Coach: Personalized Action Plan
                </h4>
              </div>

              <button
                type="button"
                onClick={handleGenerateAdvisor}
                disabled={isGeneratingAdvice}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  cursor: isGeneratingAdvice ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw size={12} className={isGeneratingAdvice ? 'animate-spin' : ''} />
                <span>{isGeneratingAdvice ? 'Analyzing Skill Matrix...' : 'Generate Weekly Action Plan'}</span>
              </button>
            </div>

            {aiAdvice ? (
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>
                  Based on your completed labs and telemetry, here is your high-impact path to close gaps for <strong style={{ color: '#f8fafc' }}>{primaryRole.title}</strong>:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {aiAdvice.advice.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Click "Generate Weekly Action Plan" to have the Gemini Intelligence Gateway formulate tailored lab recommendations based on your primary gaps.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SIDE-BY-SIDE ROLE COMPARISON */}
      {/* ============================================================== */}
      {activeTab === 'compare' && (
        <div>
          {/* Role Comparison Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Compare With: </span>
              <select
                value={compareRoleId}
                onChange={e => setCompareRoleId(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #a78bfa',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                {EXPANDED_SECURITY_ROLES.filter(r => r.id !== primaryRole.id).map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            {/* Similarity Callout */}
            <div style={{ background: 'rgba(167, 139, 250, 0.15)', border: '1px solid rgba(167, 139, 250, 0.4)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem', color: '#c084fc' }}>
              <strong>Role Overlap: {similarityScore}%</strong> — If preparing for {primaryRole.title}, you are already {similarityScore}% aligned with {compareRole.title}.
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Primary Role Card */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '10px', padding: '18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>ROLE A (PRIMARY TARGET)</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0', color: '#f8fafc' }}>{primaryRole.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 14px 0' }}>{primaryRole.overview}</p>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Salary Spectrum</div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                  Entry: {primaryRole.salary.entry} → Senior: {primaryRole.salary.senior}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Key Responsibilities</div>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {primaryRole.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Primary AWS Services</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {primaryRole.awsServices.map(s => (
                    <span key={s} style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Compare Role Card */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(167, 139, 250, 0.4)', borderRadius: '10px', padding: '18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>ROLE B (COMPARISON)</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0', color: '#f8fafc' }}>{compareRole.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 14px 0' }}>{compareRole.overview}</p>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Salary Spectrum</div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                  Entry: {compareRole.salary.entry} → Senior: {compareRole.salary.senior}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Key Responsibilities</div>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {compareRole.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Primary AWS Services</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {compareRole.awsServices.map(s => (
                    <span key={s} style={{ fontSize: '0.72rem', background: 'rgba(167, 139, 250, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#c084fc' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SALARY & DEMAND ANALYTICS */}
      {/* ============================================================== */}
      {activeTab === 'salary' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Entry-Level Range</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {primaryRole.salary.entry}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Associate / 0-2 yrs</div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Mid-Level Range</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {primaryRole.salary.mid}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Independent / 3-5 yrs</div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Senior & Lead Range</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
                {primaryRole.salary.senior}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Tech Lead / 6+ yrs</div>
            </div>
          </div>

          {/* Skill Demand Breakdown */}
          <div style={{ background: 'rgba(2, 6, 23, 0.7)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', color: '#f8fafc' }}>
              Top Requested Skills for {primaryRole.title}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Must-Know Core Skills
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {primaryRole.topSkills.mustKnow.map(s => (
                    <div key={s} style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '6px', color: '#6ee7b7' }}>
                      ✓ {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  High-Value Differentiators
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {primaryRole.topSkills.niceToHave.map(s => (
                    <div key={s} style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '6px', color: '#7dd3fc' }}>
                      ★ {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Emerging 2026+ Technologies
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {primaryRole.topSkills.emerging.map(s => (
                    <div key={s} style={{ fontSize: '0.8rem', background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)', padding: '6px 12px', borderRadius: '6px', color: '#fdba74' }}>
                      ⚡ {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: 3-YEAR CAREER FORECAST (BLOOMBERG STYLE) */}
      {/* ============================================================== */}
      {activeTab === 'forecast' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px 0', color: '#f8fafc' }}>
              36-Month Career Trajectory: {primaryRole.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Estimated compensation milestones, expected deliverables, and career promotions from entry to lead architect.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {primaryRole.careerForecast.map((point, idx) => (
              <div
                key={point.horizon}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${idx === 0 ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ minWidth: '90px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>TIMELINE</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: idx === 0 ? '#38bdf8' : '#f8fafc' }}>
                    {point.horizon}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>TARGET TITLE</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{point.role}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{point.milestone}</div>
                </div>

                <div style={{ minWidth: '120px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>EST. COMP</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>{point.salary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: VERIFIED SOURCES & TRANSPARENCY */}
      {/* ============================================================== */}
      {activeTab === 'sources' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px 0', color: '#f8fafc' }}>
              Source Verification & Live Feed Grounding
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Every market statistic, salary band, and skill recommendation is linked to official AWS security channels, government advisories, and industry research.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {VERIFIED_MARKET_SOURCES.map(source => (
              <div
                key={source.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>
                    {source.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    ✓ {source.status} ({source.confidenceScore})
                  </span>
                </div>

                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}>
                  {source.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                  {source.keyTrend}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Checked {source.lastChecked}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>View Publication</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span>SeCloudive is an enterprise cloud security training simulator, separate from Cloudive.</span>
        <span style={{ fontStyle: 'italic' }}>Illustrative training score, not a certified compliance assessment.</span>
      </div>
    </div>
  )
}
