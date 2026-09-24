import { useState } from 'react'
import { ArrowRight, Filter, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import ChallengeCard from '../components/ChallengeCard'
import { useChallenges } from '../context/ChallengeContext'

const domains = [
  { key: 'all', label: 'All labs' },
  { key: 'iam', label: 'IAM Security' },
  { key: 's3', label: 'S3 Security' },
  { key: 'network', label: 'Networking' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'architecture', label: 'Architecture' }
]

export default function Categories() {
  const { challenges, investigations, investigationCompletedCount } = useChallenges()
  const [active, setActive] = useState('all')
  const [search, setSearch] = useState('')

  const visible = challenges.filter(
    item =>
      (active === 'all' || item.id.startsWith(active)) &&
      `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(search.toLowerCase())
  )

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
        <Link to="/investigations" className="button button-primary">
          <ShieldCheck size={16} />
          <span>Launch Simulator ({investigationCompletedCount}/{investigations?.length || 25})</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="filter-bar">
        <div className="filter-tabs">
          {domains.map(domain => (
            <button
              key={domain.key}
              className={active === domain.key ? 'active' : ''}
              onClick={() => setActive(domain.key)}
            >
              {domain.label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            aria-label="Search challenges"
            placeholder="Search challenges"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
        <button className="filter-button">
          <Filter size={15} /> Filters
        </button>
      </div>

      <div className="challenge-grid">
        {visible.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </main>
  )
}

