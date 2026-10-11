import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Layers,
  Search,
  Filter,
  GraduationCap,
  Terminal,
  Radio,
  Clock,
  BookOpen,
  Key,
  RefreshCw,
  Cpu,
  Bot,
  AlertCircle
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio.js'
import { liveGeminiIntelligence, GROUNDED_BASE_INTERNSHIPS } from '../services/liveGeminiIntelligenceService.js'
import GeminiKeyManagerModal from '../components/GeminiKeyManagerModal.jsx'
import { LIVE_INTERNSHIPS_DATA } from '../data/liveInternshipsData.js'

export { LIVE_INTERNSHIPS_DATA }

export default function LiveInternshipsPage() {
  const { masterProgressPercent = 0 } = useChallenges() || {}
  const [internships, setInternships] = useState(LIVE_INTERNSHIPS_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [syncMeta, setSyncMeta] = useState(null)
  const [filterRemote, setFilterRemote] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('ALL')
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)

  // AI Resume Matcher Modal State
  const [isMatcherOpen, setIsMatcherOpen] = useState(false)
  const [profileText, setProfileText] = useState('')
  const [targetRole, setTargetRole] = useState('AWS Cloud Security Engineer Intern')
  const [matcherLoading, setMatcherLoading] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  useEffect(() => {
    loadInternships(false)
  }, [])

  const loadInternships = async (forceRefresh = false) => {
    setIsLoading(true)
    try {
      const res = await liveGeminiIntelligence.fetchLiveInternships({ forceRefresh })
      if (res && res.items && res.items.length > 0) {
        setInternships(res.items)
        setSyncMeta({
          source: res.source,
          isLiveAi: res.isLiveAi,
          keyUsed: res.keyUsed,
          timestamp: res.timestamp
        })
      }
    } catch (e) {
      console.warn('Error loading internships from Gemini:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = () => {
    playTactileClick()
    loadInternships(true)
  }

  const handleRunAiMatcher = async (e) => {
    e.preventDefault()
    if (!profileText.trim()) return
    playTactileClick()
    setMatcherLoading(true)
    setMatchResult(null)

    try {
      const res = await liveGeminiIntelligence.analyzeCandidateMatch({
        profileText,
        targetRole
      })
      if (res && res.analysis) {
        setMatchResult(res.analysis)
        playSuccessChime()
      }
    } catch (err) {
      console.warn('Matcher error:', err)
    } finally {
      setMatcherLoading(false)
    }
  }

  const filteredInternships = internships.filter(item => {
    if (filterRemote && !(item.location || '').toLowerCase().includes('remote')) return false
    if (selectedCompany !== 'ALL' && !(item.company || '').includes(selectedCompany)) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchText = `${item.company} ${item.role} ${item.location} ${(item.skills || []).join(' ')}`.toLowerCase()
      return matchText.includes(q)
    }
    return true
  })

  // Dynamic readiness match percentage based on platform progress
  const calculateMatch = (itemIndex) => {
    return Math.min(96, Math.max(45, Math.round(masterProgressPercent * 0.7 + (itemIndex % 3) * 6 + 32)))
  }

  return (
    <main className="live-internships-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>SeCloudive</Link>
        <span>/</span>
        <span style={{ color: '#94a3b8' }}>Live Career Gateway</span>
        <span>/</span>
        <span style={{ color: '#f8fafc', fontWeight: 700 }}>Live AWS Security Internships</span>
      </div>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.1)',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: '#34d399',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>
              <Radio size={12} className="animate-pulse" />
              <span>LIVE APPRENTICESHIP RADAR /// ACTIVE HIRING</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 800
            }}>
              <Sparkles size={12} />
              <span>Google Gemini AI Career Engine Active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Key size={13} color="#38bdf8" />
              <span>Inspect Gemini Keys</span>
            </button>

            <button
              onClick={() => {
                playTactileClick()
                setIsMatcherOpen(true)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
              }}
            >
              <Bot size={13} />
              <span>AI Resume Matcher</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Querying Gemini...' : 'Sync Live Openings'}</span>
            </button>
          </div>
        </div>

        <h1 style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#f8fafc'
        }}>
          Live AWS Cloud Security Internships & Career Radar
        </h1>
        <p style={{
          margin: 0,
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: 1.6,
          maxWidth: '820px'
        }}>
          Real-time opportunities at premier cloud & cybersecurity organizations. Every opening includes verified compensation, target technical prerequisites, and sample AWS interview challenge questions.
        </p>

        {syncMeta && (
          <div style={{
            marginTop: '16px',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span>Source: <strong style={{ color: '#38bdf8' }}>{syncMeta.source}</strong></span>
            <span>•</span>
            <span>AI Model: <strong style={{ color: '#34d399' }}>gemini-3.5-flash-lite</strong></span>
            {syncMeta.keyUsed && (
              <>
                <span>•</span>
                <span>Key: <strong style={{ color: '#a78bfa' }}>{syncMeta.keyUsed}</strong></span>
              </>
            )}
            <span>•</span>
            <span>Last Updated: <strong style={{ color: '#cbd5e1' }}>{new Date(syncMeta.timestamp).toLocaleTimeString()}</strong></span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by company, role (IAM, SOC, DevSecOps), or AWS skill..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.88rem',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterRemote}
              onChange={e => setFilterRemote(e.target.checked)}
              style={{ accentColor: '#38bdf8' }}
            />
            <span>Remote Only</span>
          </label>

          <select
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            style={{
              background: 'rgba(2, 6, 23, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          >
            <option value="ALL">All Companies</option>
            <option value="AWS">Amazon Web Services (AWS)</option>
            <option value="Datadog">Datadog</option>
            <option value="Stripe">Stripe</option>
            <option value="SentinelOne">SentinelOne</option>
          </select>
        </div>
      </div>

      {/* Internships List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredInternships.map((item, idx) => (
          <div
            key={item.id || idx}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Building2 size={16} color="#38bdf8" />
                  <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{item.company}</strong>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#7dd3fc',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {item.location}
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {item.role}
                </h2>
              </div>

              {/* Match Score Badge */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                  Profile Match
                </div>
                <div style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 900 }}>
                  {calculateMatch(idx)}%
                </div>
              </div>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {item.description}
            </p>

            {/* Compensation & Timeline info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="#34d399" />
                <span>Stipend: <strong style={{ color: '#f8fafc' }}>{item.stipend}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#38bdf8" />
                <span>Deadline: <strong style={{ color: '#f8fafc' }}>{item.deadline}</strong></span>
              </div>
              {item.experienceLevel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} color="#a855f7" />
                  <span>Level: <strong style={{ color: '#f8fafc' }}>{item.experienceLevel}</strong></span>
                </div>
              )}
            </div>

            {/* Required Skills Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginRight: '4px' }}>
                Required Skills:
              </span>
              {(item.skills || []).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.74rem',
                    color: '#e2e8f0',
                    fontWeight: 600
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Interview Question Highlight */}
            {item.interviewFocus && (
              <div style={{
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  🎯 Technical Interview Focus Question
                </div>
                <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;{item.interviewFocus}&rdquo;
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Link
                to="/labs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                <BookOpen size={14} />
                <span>Prepare Skills in Enterprise SOP Labs</span>
              </Link>

              <a
                href={item.applyUrl || 'https://aws.amazon.com/careers'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <span>Direct Apply</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* AI Resume Matcher Modal */}
      {isMatcherOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(2, 6, 23, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsMatcherOpen(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '10px',
                padding: '8px',
                color: '#a78bfa'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  AI Candidate Resume-to-Role Matcher
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Powered by Google Gemini (gemini-3.5-flash-lite)
                </p>
              </div>
            </div>

            <form onSubmit={handleRunAiMatcher} style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '6px' }}>
                  Target AWS Security Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '6px' }}>
                  Paste Your Resume Summary, Projects, or Skills
                </label>
                <textarea
                  rows={5}
                  value={profileText}
                  onChange={e => setProfileText(e.target.value)}
                  placeholder="e.g. Computer Science sophomore with hands-on experience in Linux, Python scripting, AWS IAM user management, basic VPC creation, and completed SeCloudive SOP Labs..."
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#f8fafc',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsMatcherOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#94a3b8',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={matcherLoading || !profileText.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: (matcherLoading || !profileText.trim()) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} className={matcherLoading ? 'animate-spin' : ''} />
                  <span>{matcherLoading ? 'Gemini Analyzing...' : 'Analyze Match with Gemini'}</span>
                </button>
              </div>
            </form>

            {/* Match Result Display */}
            {matchResult && (
              <div style={{
                marginTop: '24px',
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>
                      AI Evaluated Role Readiness
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
                      {matchResult.readinessTier}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
                      {matchResult.matchScore}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Candidate Match</div>
                  </div>
                </div>

                {/* Missing Skills */}
                {matchResult.criticalMissingAwsSkills && matchResult.criticalMissingAwsSkills.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.76rem', color: '#f87171', fontWeight: 800, marginBottom: '6px' }}>
                      CRITICAL MISSING AWS SKILLS:
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {matchResult.criticalMissingAwsSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.74rem',
                            color: '#f87171',
                            fontWeight: 700
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Advice */}
                {matchResult.interviewAdvice && (
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    color: '#cbd5e1'
                  }}>
                    <strong style={{ color: '#38bdf8' }}>Hiring Manager Advice: </strong>
                    {matchResult.interviewAdvice}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gemini Key Manager Modal */}
      <GeminiKeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeyUpdated={() => loadInternships(true)}
      />
    </main>
  )
}
