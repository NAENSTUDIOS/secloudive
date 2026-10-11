import { useState } from 'react'
import { ArrowRight, Filter, Search, ShieldCheck, X, RefreshCw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import ChallengeCard from '../components/ChallengeCard'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'

const domains = [
  { key: 'all', label: 'All labs' },
  { key: 'iam', label: 'IAM Security' },
  { key: 's3', label: 'S3 Security' },
  { key: 'network', label: 'Networking' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'architecture', label: 'Architecture' }
]

const difficulties = [
  { key: 'all', label: 'All Levels' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' }
]

export default function Categories() {
  const { challenges = [], investigations, investigationCompletedCount } = useChallenges() || {}
  const [active, setActive] = useState('all')
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleResetFilters = () => {
    playTactileClick()
    setActive('all')
    setSearch('')
    setDifficultyFilter('all')
  }

  const hasActiveFilters = active !== 'all' || search.trim() !== '' || difficultyFilter !== 'all'

  const visible = challenges.filter(item => {
    const matchesDomain = active === 'all' || item.id.startsWith(active)
    const matchesDifficulty = difficultyFilter === 'all' || item.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
    const matchesSearch = `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(search.toLowerCase())
    return matchesDomain && matchesDifficulty && matchesSearch
  })

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <div className="eyebrow">THE CHALLENGE LIBRARY</div>
          <h1>
            Practice with<br />
            <em>real signals.</em>
          </h1>
          <p>Choose a domain, open a lab, and build the instinct to spot what others miss.</p>
        </div>
        <div className="library-stat">
          <strong>{challenges.length}</strong>
          <span>
            total challenges<br />
            across 5 domains
          </span>
        </div>
      </div>

      {/* Flagship Security Investigation Simulator Callout */}
      <div className="signature-callout flagship-callout">
        <div>
          <span>FLAGSHIP SIMULATOR /// 25 PRODUCTION INCIDENT TICKETS</span>
          <strong>Security Investigation Simulator</strong>
          <p>
            Triage raw configurations, CloudTrail telemetry, and network paths. Experience real Cloud Security Analyst thinking across IAM, S3, Networking, Monitoring, and Architecture.
          </p>
        </div>
        <Link to="/investigations" className="button button-primary" onClick={() => playTactileClick()}>
          <ShieldCheck size={16} />
          <span>Launch Simulator ({investigationCompletedCount}/{investigations?.length || 25})</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* AWS Career & Architecture Roadmap Callout */}
      <div 
        style={{
          margin: '0 0 24px 0',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8' }}>
                NAEN STUDIOS • AWS CAREER MAP
              </span>
              <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1px 8px', borderRadius: '999px', fontWeight: 700 }}>
                4 Hiring Tracks Active
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              Targeting an AWS Cloud Security role or internship? Explore the interactive career guide map & STAR resume bullets.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/career"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>AWS Career Guide Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-tabs">
          {domains.map(domain => (
            <button
              key={domain.key}
              className={active === domain.key ? 'active' : ''}
              onClick={() => {
                playTactileClick()
                setActive(domain.key)
              }}
            >
              {domain.label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            aria-label="Search challenges"
            placeholder="Search challenges..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </label>
        <button 
          className={`filter-button ${showFilters ? 'is-active' : ''}`}
          onClick={() => {
            playTactileClick()
            setShowFilters(prev => !prev)
          }}
          style={{
            background: showFilters ? 'rgba(56, 189, 248, 0.15)' : undefined,
            borderColor: showFilters ? 'rgba(56, 189, 248, 0.5)' : undefined,
            color: showFilters ? '#38bdf8' : undefined
          }}
        >
          <Filter size={15} /> Filters {hasActiveFilters && '•'}
        </button>
      </div>

      {/* Expanded Filter Drawer */}
      {showFilters && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>
              DIFFICULTY:
            </span>
            {difficulties.map(diff => (
              <button
                key={diff.key}
                type="button"
                onClick={() => {
                  playTactileClick()
                  setDifficultyFilter(diff.key)
                }}
                style={{
                  background: difficultyFilter === diff.key ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${difficultyFilter === diff.key ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255,255,255,0.08)'}`,
                  color: difficultyFilter === diff.key ? '#38bdf8' : '#94a3b8',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {diff.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={12} /> Reset Filters
            </button>
          )}
        </div>
      )}

      {visible.length > 0 ? (
        <div className="challenge-grid">
          {visible.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px dashed rgba(148, 163, 184, 0.2)',
          borderRadius: '12px'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 16px' }}>
            No challenges matched your filter criteria.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={handleResetFilters}
          >
            <RefreshCw size={14} /> Clear All Filters
          </button>
        </div>
      )}
    </main>
  )
}

