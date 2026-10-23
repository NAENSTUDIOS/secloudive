import { useState } from 'react'
import { 
  FolderGit2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Terminal, 
  Layers,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import { printResumePdf } from '../utils/resumePdfExporter'
import {
  isGuestUser,
  savePortfolioArtifact
} from '../services/supabaseProgressService'
import { createPortfolioEvidenceDraft, validatePortfolioEvidence } from '../utils/portfolioEvidenceContracts'

export default function PortfolioEvidenceCard() {
  const { masterCareerProfile, activeProfile } = useChallenges()
  const [copied, setCopied] = useState(false)
  const [saveState, setSaveState] = useState('idle')

  if (!masterCareerProfile) return null

  const {
    currentTier,
    targetCareerRole,
    thinkingScore,
    overallReadinessScore,
    metrics,
    portfolioEvidence
  } = masterCareerProfile

  const handleCopyPortfolio = () => {
    const summaryText = `[SeCloudive Professional Cloud Security Portfolio]
Current Verified Level: ${currentTier.title} (${currentTier.badge})
Target Role: ${targetCareerRole}
Career Readiness Score: ${overallReadinessScore}/100
Security Thinking Score: ${thinkingScore}/100

Verified Projects & Milestones:
• ${metrics.completedLabsCount} Enterprise SOP CloudShell Labs Mastered
• ${metrics.investigationCompletedCount} Security Incident Investigations Triage & Containment
• ${metrics.architectureReviewedCount} AWS Well-Architected Security Reviews
• ${metrics.simulatorCompletedCount} SOC On-Call Incident Rotations Defended

Demonstrated Core Competencies:
${portfolioEvidence.demonstratedSkills.map(s => `- ${s.name} (${s.level}) [${s.verified ? 'Verified' : 'Developing'}]`).join('\n')}

Verified by SeCloudive Cloud Security Career Operating System.`

    navigator.clipboard?.writeText(summaryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleSaveEvidence = async () => {
    const userId = activeProfile?.id
    if (!userId || isGuestUser(userId)) {
      setSaveState('guest')
      return
    }

    const evidence = createPortfolioEvidenceDraft({
      artifactType: 'career_readiness_dossier',
      title: `${targetCareerRole} verified evidence dossier`,
      summary: `Verified SeCloudive progress for ${targetCareerRole}, including labs, investigations, architecture reviews, and simulator work.`,
      skills: portfolioEvidence.demonstratedSkills,
      roleMappings: [targetCareerRole],
      sourceActivityId: `career-profile:${targetCareerRole}`,
      validationResults: [{
        validator: 'SeCloudive career profile',
        status: 'passed',
        verifiedAt: new Date().toISOString()
      }],
      documentation: [{
        type: 'resume_pdf',
        title: 'NAEN Studios portfolio evidence dossier'
      }],
      verificationId: `SECL-${Date.now().toString(36).toUpperCase()}`
    })

    const validation = validatePortfolioEvidence(evidence)
    if (!validation.complete) {
      setSaveState('invalid')
      return
    }

    setSaveState('saving')
    const saved = await savePortfolioArtifact(userId, evidence)
    setSaveState(saved ? 'saved' : 'error')
  }

  return (
    <section className="portfolio-evidence-panel" aria-label="Professional Cloud Security Portfolio Tracker">
      <div className="portfolio-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: '#38bdf8' }} />
            <span>Portfolio Tracker • Verified Evidence Dossier</span>
          </div>
          <h2>
            Technical Evidence & Hiring Manager Dossier
          </h2>
          <p>
            Cryptographically tracked evidence generated directly from completed investigations, hands-on SOP labs, architecture reviews, and on-call tickets.
          </p>
        </div>

        <div className="portfolio-header-actions">
          <button 
            type="button" 
            className="button button-ghost button-copy-dossier"
            onClick={() => printResumePdf(masterCareerProfile)}
            title="Open and view or save the official NAEN Studios certified portfolio evidence dossier PDF"
            style={{ borderColor: 'rgba(56,189,248,0.4)', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={14} />
            <span>📄 View & Save NAEN PDF</span>
          </button>
          <button
            type="button"
            className="button button-ghost button-copy-dossier"
            onClick={handleSaveEvidence}
            disabled={saveState === 'saving'}
            title="Save this validated evidence dossier to your private cloud portfolio"
          >
            <ShieldCheck size={14} />
            <span>
              {saveState === 'saving' ? 'Saving Evidence…'
                : saveState === 'saved' ? 'Evidence Saved'
                  : saveState === 'guest' ? 'Sign In to Save'
                    : saveState === 'error' ? 'Retry Cloud Save'
                      : saveState === 'invalid' ? 'Evidence Needs Review'
                        : 'Save to Cloud Portfolio'}
            </span>
          </button>
          <button 
            type="button" 
            className="button button-ghost button-copy-dossier"
            onClick={handleCopyPortfolio}
          >
            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Dossier!' : 'Copy Summary for Resume'}</span>
          </button>
          <Link to="/projects" className="button button-primary">
            <FolderGit2 size={15} /> All $0 Projects
          </Link>
        </div>
      </div>

      {/* 3 Core Stats Cards */}
      <div className="portfolio-stats-grid">
        <div className="portfolio-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-wrapper text-cyan">
              <Terminal size={18} />
            </span>
            <span className="stat-tag">PRACTICE PROOF</span>
          </div>
          <strong className="stat-huge-number">{portfolioEvidence.verifiedProjectsCount}</strong>
          <span className="stat-label">Total Verified Milestones</span>
          <p className="stat-subtext">
            {metrics.completedLabsCount} Labs • {metrics.investigationCompletedCount} Investigations • {metrics.architectureReviewedCount} Architecture Reviews
          </p>
        </div>

        <div className="portfolio-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-wrapper text-purple">
              <ShieldCheck size={18} />
            </span>
            <span className="stat-tag">DOMAIN MASTERY</span>
          </div>
          <strong className="stat-huge-number">{portfolioEvidence.demonstratedSkills.length}</strong>
          <span className="stat-label">Enterprise Skills Demonstrated</span>
          <p className="stat-subtext">
            IAM, S3/KMS, VPC Isolation, CloudTrail Forensics & Terraform IaC
          </p>
        </div>

        <div className="portfolio-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-wrapper text-emerald">
              <Award size={18} />
            </span>
            <span className="stat-tag">EMPLOYABILITY</span>
          </div>
          <strong className="stat-huge-number text-emerald">{overallReadinessScore}%</strong>
          <span className="stat-label">Engineer Career Readiness</span>
          <p className="stat-subtext">
            Benchmarked against Fortune 500 {targetCareerRole} standards
          </p>
        </div>
      </div>

      {/* Demonstrated Competency Matrix & Verified Dossiers */}
      <div className="portfolio-detail-split">
        {/* Left: Demonstrated Skills Matrix */}
        <div className="skills-matrix-card">
          <div className="card-subhead">
            <Sparkles size={14} className="text-cyan" />
            <h3>Demonstrated Core Competencies</h3>
          </div>
          <div className="skills-matrix-list">
            {portfolioEvidence.demonstratedSkills.map((skill, idx) => (
              <div key={idx} className="skill-matrix-item">
                <div className="skill-name-col">
                  {skill.verified ? (
                    <CheckCircle2 size={16} className="text-emerald" />
                  ) : (
                    <span className="developing-dot" />
                  )}
                  <strong>{skill.name}</strong>
                </div>
                <div className="skill-badge-col">
                  <span className={`competency-pill level-${skill.level.toLowerCase()}`}>
                    {skill.level}
                  </span>
                  <span className={`verified-badge ${skill.verified ? 'badge-verified' : 'badge-developing'}`}>
                    {skill.verified ? 'Verified Proof' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical Evidence Dossiers */}
        <div className="dossiers-card">
          <div className="card-subhead">
            <FileText size={14} className="text-purple" />
            <h3>Verified Engineering Artifacts</h3>
          </div>
          <div className="dossiers-list">
            {portfolioEvidence.verifiedDossiers.map((dossier, idx) => (
              <div key={idx} className="dossier-item">
                <div className="dossier-icon">
                  <FileText size={18} className="text-cyan" />
                </div>
                <div className="dossier-meta">
                  <strong className="dossier-title">{dossier.title}</strong>
                  <div className="dossier-tags">
                    <span className="dossier-type-tag">{dossier.type}</span>
                    <span className="dossier-date-tag">{dossier.date}</span>
                  </div>
                </div>
                <Link to="/report" className="dossier-view-link" title="View in Security Thinking Report">
                  <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="portfolio-resume-tip">
            <span className="tip-title">💡 Recruiter Tip:</span>
            <p>
              Link this evidence directly in your resume bullets using the STAR method: 
              "Contained compromised IAM credentials and public S3 bucket ACLs within 15 minutes, maintaining 100% compliance across production AWS environments."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
