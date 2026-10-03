import { Link } from 'react-router-dom'
import { ArrowLeft, Radio, Sparkles, ShieldCheck, ExternalLink, Zap } from 'lucide-react'
import LiveFeedPortal, { FeedErrorBoundary } from '../components/LiveFeedPortal'
import DailyAwsSecurityTicker from '../components/DailyAwsSecurityTicker'

export default function LiveFeedPortalPage() {
  return (
    <main className="live-portal-page-shell">
      {/* Breadcrumb Navigation */}
      <div className="portal-breadcrumb-bar">
        <Link to="/dashboard" className="portal-back-link">
          <ArrowLeft size={14} /> Back to SOC Dashboard
        </Link>
        <span className="crumb-separator">/</span>
        <span className="crumb-active">LIVE PORTALS & JOB INTEL</span>
      </div>

      {/* Platform Identity & Independence Banner */}
      <div className="identity-clarity-banner" role="note" aria-label="Platform Identity Notice" style={{ margin: '16px 0 24px' }}>
        <span className="identity-pulse" />
        <strong>PLATFORM IDENTITY:</strong> SeCloudive is an enterprise cloud security training simulator, separate from Cloudive. Live security feeds, advisories, and career intelligence telemetry are curated for hands-on pedagogical skill development.
      </div>

      {/* Page Title & Subtitle */}
      <div className="portal-page-intro">
        <div className="eyebrow-pill">
          <Radio size={12} className="live-pulse" />
          <span>REAL-TIME STREAM /// AUTO-SYNC ACTIVE</span>
        </div>
        <h1 className="portal-page-heading">
          Daily AWS Cloud Security & Live Advisory Portal
        </h1>
        <p className="portal-page-desc">
          Continuously updated AWS cloud security telemetry. Automatically adapts and merges new official AWS bulletins, architecture changes, and verified practice labs.
        </p>
      </div>

      {/* Daily AWS Cloud Security Adaptive Sync (Strictly AWS Cloud) */}
      <DailyAwsSecurityTicker />

      {/* Main Live Feed Portal with Proper Error Boundary */}
      <FeedErrorBoundary>
        <LiveFeedPortal defaultFilter="all" />
      </FeedErrorBoundary>
    </main>
  )
}
