import { useState, useMemo, useEffect } from 'react'
import {
  ArrowRight,
  Building2,
  Database,
  HeartPulse,
  ShoppingCart,
  ShieldAlert,
  ShieldCheck,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  ExternalLink,
  Cpu,
  FileText,
  Download,
  CheckCircle2
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import DynamicTopologyCanvas from '../components/DynamicTopologyCanvas'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import { downloadHardenedTerraformModule } from '../utils/auditExportEngine'

export default function ArchitectureReviews() {
  const { masterArchitectureReviews, progress, submitArchitectureReview } = useChallenges()
  
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeReviewId, setActiveReviewId] = useState(null)
  const [selectedGaps, setSelectedGaps] = useState([])
  const [submittedReviews, setSubmittedReviews] = useState(() => {
    const initial = {}
    if (progress?.architectureScores) {
      Object.entries(progress.architectureScores).forEach(([id, score]) => {
        initial[id] = {
          score,
          selectedGaps: [],
          submittedAt: 'Persisted in Profile'
        }
      })
    }
    return initial
  })
  const [showAttackGraph, setShowAttackGraph] = useState(true)

  useEffect(() => {
    if (progress?.architectureScores) {
      setSubmittedReviews(prev => {
        const merged = { ...prev }
        let changed = false
        Object.entries(progress.architectureScores).forEach(([id, score]) => {
          if (!merged[id]) {
            merged[id] = { score, selectedGaps: [], submittedAt: 'Persisted in Profile' }
            changed = true
          }
        })
        return changed ? merged : prev
      })
    }
  }, [progress?.architectureScores])

  const reviewsPool = masterArchitectureReviews || []

  const industries = ['All', 'SaaS', 'Healthcare', 'Banking', 'E-Commerce', 'Startup', 'Enterprise', 'Education']

  const filteredReviews = useMemo(() => {
    return reviewsPool.filter(r => {
      const matchesIndustry = selectedIndustry === 'All' || r.industry === selectedIndustry
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || 
        r.title?.toLowerCase().includes(q) || 
        r.description?.toLowerCase().includes(q) ||
        r.industry?.toLowerCase().includes(q) ||
        r.threatModel?.stride?.toLowerCase().includes(q)
      return matchesIndustry && matchesSearch
    })
  }, [reviewsPool, selectedIndustry, searchQuery])

  const activeReview = useMemo(() => {
    if (!activeReviewId) return null
    return reviewsPool.find(r => r.id === activeReviewId)
  }, [activeReviewId, reviewsPool])

  const handleToggleGap = (findingCode) => {
    if (submittedReviews[activeReviewId]) return
    setSelectedGaps(prev => 
      prev.includes(findingCode) 
        ? prev.filter(c => c !== findingCode)
        : [...prev, findingCode]
    )
  }

  const handleSubmitReview = () => {
    if (!activeReview || selectedGaps.length === 0) return
    const score = Math.round((selectedGaps.length / Math.max(1, activeReview.findings.length)) * 100)
    setSubmittedReviews(prev => ({
      ...prev,
      [activeReviewId]: {
        score,
        selectedGaps,
        submittedAt: new Date().toISOString()
      }
    }))
    if (submitArchitectureReview) {
      submitArchitectureReview(activeReview, selectedGaps)
    }
  }

  const handleResetReview = () => {
    setSubmittedReviews(prev => {
      const copy = { ...prev }
      delete copy[activeReviewId]
      return copy
    })
    setSelectedGaps([])
  }

  return (
    <main className="page-shell architecture-reviews" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Page Heading */}
      <div className="page-heading" style={{ marginBottom: '24px' }}>
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" /> SIGNATURE MODULE /// 100+ ENTERPRISE ARCHITECTURE REVIEWS
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '8px 0', color: '#f8fafc' }}>
            See the whole <em style={{ color: '#38bdf8', fontStyle: 'normal' }}>system.</em>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '750px', margin: 0 }}>
            Architecture security is where service knowledge becomes engineering judgment.
            Review real-world architectures across 7 industries, identify STRIDE threat vectors, remediate high-risk security gaps, and align to the AWS Well-Architected Security Pillar.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <div className="review-stat" style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '12px 18px',
            textAlign: 'center'
          }}>
            <strong style={{ fontSize: '1.8rem', color: '#38bdf8', display: 'block' }}>{reviewsPool.length}</strong>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Exercises in Bank</span>
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setShowAttackGraph(!showAttackGraph)}
            style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={14} className="text-cyan" />
            <span>{showAttackGraph ? 'Hide Topology Attack Graph' : 'Inspect Dynamic Attack Paths'}</span>
            {showAttackGraph ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── ARCHITECTURE RESILIENCE & CONTINUOUS IMPROVEMENT CALLOUT ── */}
      <DefenderQuoteCallout category="builder" autoCycle={true} cycleIntervalMs={16000} />

      {/* Interactive SVG Attack Topology Canvas */}
      {showAttackGraph && (
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <DynamicTopologyCanvas />
        </div>
      )}

      {/* Search & Industry Filters */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by architecture title, STRIDE model, or technology (e.g. HIPAA, Multi-Tenant, KMS, EKS)..."
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px 10px 40px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            Showing <strong>{filteredReviews.length}</strong> of <strong>{reviewsPool.length}</strong>
          </span>
        </div>

        {/* Industry Pill Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>INDUSTRY:</span>
          {industries.map(ind => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              style={{
                background: selectedIndustry === ind ? '#38bdf8' : 'rgba(30, 41, 59, 0.5)',
                color: selectedIndustry === ind ? '#0f172a' : '#94a3b8',
                border: selectedIndustry === ind ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Architecture Reviews */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {filteredReviews.map(review => {
          const isSubmitted = Boolean(submittedReviews[review.id])
          const savedScore = submittedReviews[review.id]?.score
          const isActive = activeReviewId === review.id

          return (
            <article
              key={review.id}
              style={{
                background: isActive 
                  ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)' 
                  : 'rgba(15, 23, 42, 0.75)',
                border: isActive 
                  ? '1px solid #38bdf8' 
                  : isSubmitted 
                    ? '1px solid rgba(16, 185, 129, 0.4)' 
                    : '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isActive ? '0 10px 30px rgba(56, 189, 248, 0.2)' : 'none'
              }}
            >
              <div>
                {/* Header Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(56, 189, 248, 0.25)'
                  }}>
                    {review.id} /// {review.industry.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#f59e0b',
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Maturity: {review.maturityScore}/5.0
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {review.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  {review.description}
                </p>

                {/* STRIDE & Component Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    STRIDE: {review.threatModel?.stride}
                  </span>
                  {(review.components || []).slice(0, 3).map((comp, cIdx) => (
                    <span key={cIdx} style={{
                      fontSize: '0.7rem',
                      background: 'rgba(148, 163, 184, 0.1)',
                      color: '#cbd5e1',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {comp}
                    </span>
                  ))}
                  {(review.components || []).length > 3 && (
                    <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>
                      +{review.components.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div style={{
                borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: isSubmitted ? '#10b981' : '#94a3b8', fontWeight: 500 }}>
                  {isSubmitted ? `Score: ${savedScore}%` : `${review.findings.length} findings to identify`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setActiveReviewId(null)
                    } else {
                      setActiveReviewId(review.id)
                      setSelectedGaps(submittedReviews[review.id]?.selectedGaps || [])
                    }
                  }}
                  className="button button-ghost"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    borderColor: isActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)',
                    color: isActive ? '#38bdf8' : '#cbd5e1'
                  }}
                >
                  {isActive ? 'Close Workbench' : isSubmitted ? 'Re-inspect' : 'Start Review'}
                  <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>

              {/* Active Review Workbench Accordion */}
              {isActive && (
                <div style={{
                  marginTop: '16px',
                  background: 'rgba(10, 15, 30, 0.95)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '0.84rem'
                }}>
                  {/* Attack Vector & Threat Model */}
                  <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Threat Model Attack Vector
                    </div>
                    <div style={{ color: '#e2e8f0', lineHeight: 1.4 }}>
                      {review.threatModel?.attackVector}
                    </div>
                  </div>

                  {/* Architecture Diagram Requirements */}
                  {review.diagramRequirements && (
                    <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
                      <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                        Architecture Diagram Requirements
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px', color: '#cbd5e1', fontSize: '0.8rem' }}>
                        {review.diagramRequirements.map((req, rIdx) => (
                          <li key={rIdx} style={{ marginBottom: '3px' }}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Findings Selection */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                        SELECT VULNERABLE SECURITY GAPS TO ESCALATE:
                      </span>
                      <strong style={{ color: '#38bdf8', fontSize: '0.8rem' }}>
                        {selectedGaps.length} / {review.findings.length} Selected
                      </strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {review.findings.map(f => {
                        const isSelected = selectedGaps.includes(f.code)
                        return (
                          <div
                            key={f.code}
                            onClick={() => handleToggleGap(f.code)}
                            style={{
                              background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.15)',
                              borderRadius: '6px',
                              padding: '10px 12px',
                              cursor: submittedReviews[review.id] ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px',
                              flexShrink: 0
                            }}>
                              {isSelected ? <Check size={12} color="#0f172a" /> : <ShieldAlert size={12} color="#94a3b8" />}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: f.risk === 'CRITICAL' ? '#f87171' : '#f59e0b',
                                  background: f.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  padding: '1px 5px',
                                  borderRadius: '3px'
                                }}>
                                  {f.risk}
                                </span>
                                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>{f.title}</strong>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                                {f.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Submission Result & Well-Architected Feedback */}
                  {submittedReviews[review.id] && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
                        <CheckCircle2 size={16} /> Review Submitted: {submittedReviews[review.id].score}% Risk Coverage
                      </div>
                      
                      {/* Well-Architected Alignment */}
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>
                        <strong>Well-Architected Alignment:</strong>
                        <div style={{ color: '#f59e0b', marginTop: '2px' }}>
                          • Security: {review.wellArchitectedAlignment?.security}
                        </div>
                        <div style={{ color: '#10b981', marginTop: '2px' }}>
                          • Reliability: {review.wellArchitectedAlignment?.reliability}
                        </div>
                      </div>

                      {/* Recommended Fixes */}
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#38bdf8' }}>Recommended Engineering Fixes:</strong>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                          {(review.recommendations || []).map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => downloadHardenedTerraformModule({ scenarioId: review.id, scenarioTitle: review.title })}
                      className="button button-ghost"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}
                      title="Download auto-remediated Terraform module with Checkov & tfsec GitHub Actions workflow"
                    >
                      <Download size={13} />
                      <span>Download Hardened Terraform</span>
                    </button>
                    {submittedReviews[review.id] ? (
                      <button
                        type="button"
                        onClick={handleResetReview}
                        className="button button-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <RotateCcw size={12} /> Re-review
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={selectedGaps.length === 0}
                        onClick={handleSubmitReview}
                        className="button button-primary"
                        style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                      >
                        Submit Findings ({selectedGaps.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}
