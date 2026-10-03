import { useState, useEffect, useRef } from 'react'
import {
  Award,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Lock,
  Layers,
  Calendar,
  Share2
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import { issueCertificate, updateStudentName } from '../services/supabaseProgressService'
import { OfficialAccreditationSeal, DocumentWatermark } from './CloudGraphics'
import QRCode from 'qrcode'

export default function CertificateModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('secloudive_student_name') || 'Cloud Security Engineer'
  })
  const [isEditingName, setIsEditingName] = useState(false)

  const {
    masterTotalXP = 0,
    masterProgressPercent = 0,
    completedMasterActivities = 0,
    totalMasterActivities = 100,
    solvedThreatRoomsCount = 0,
    completedLabsCount = 0,
    investigationCompletedCount = 0,
    targetCareerRole = 'Cloud Security Engineer'
  } = useChallenges()

  const auth = useAuth()

  // Credential Hash generated from persistent attributes
  const credentialId = `NAEN-SEC-2026-${(masterTotalXP * 7 + 1042).toString(16).toUpperCase().padStart(8, '0')}`
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Generate Dynamic QR Code URL pointing to public verification page
  useEffect(() => {
    const verifyUrl = `${window.location.origin}/report?cert=${credentialId}`
    QRCode.toDataURL(verifyUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err))
  }, [credentialId])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-certificate', handleOpen)
    return () => window.removeEventListener('open-certificate', handleOpen)
  }, [])

  // Sync certificate to Supabase cloud registry when viewed
  useEffect(() => {
    if (isOpen && auth?.supabaseUserId) {
      issueCertificate({
        userId: auth.supabaseUserId,
        certType: 'mastery',
        certTitle: 'AWS Cloud Security & DevSecOps Mastery',
        studentName,
        tier: 4,
        credentialId
      }).catch(err => console.warn('[CertificateModal] Cloud cert registration notice:', err))
    }
  }, [isOpen, auth?.supabaseUserId, studentName, credentialId])

  const handleSaveName = (name) => {
    setStudentName(name)
    localStorage.setItem('secloudive_student_name', name)
    setIsEditingName(false)
    if (auth?.supabaseUserId) {
      updateStudentName(auth.supabaseUserId, name)
    }
  }

  const handleCopyLink = () => {
    const verifyUrl = `${window.location.origin}/report?cert=${credentialId}`
    navigator.clipboard.writeText(verifyUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  // LinkedIn Certification link
  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=AWS+Cloud+Security+%26+DevSecOps+Mastery&organizationName=NAEN+Studios&issueYear=2026&issueMonth=1&certId=${credentialId}&certUrl=${encodeURIComponent(window.location.origin)}`

  if (!isOpen) return null

  return (
    <div className="cert-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="cert-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Certificate of Cloud Security Mastery"
      >
        {/* Top Control Bar */}
        <div className="cert-modal-controls no-print">
          <div className="cert-controls-left">
            <span className="cert-badge-pill">
              <Award size={14} className="text-amber" /> Verifiable NAEN Studios Credential
            </span>
          </div>
          <div className="cert-controls-right">
            <button 
              className="btn-cert-action"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>
            <button 
              className="btn-cert-action"
              onClick={handleCopyLink}
              title="Copy Verification Link"
            >
              {copiedLink ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
              <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
            </button>
            <a 
              href={linkedInCertUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cert-action btn-cert-linkedin"
              title="Add to LinkedIn Profile"
            >
              <Share2 size={15} />
              <span>Add to LinkedIn</span>
            </a>
            <button 
              className="btn-cert-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Certificate"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="cert-canvas-container">
          <div className="cert-canvas" id="printable-certificate" style={{ position: 'relative', overflow: 'hidden' }}>
            <DocumentWatermark text="NAEN STUDIOS • naenstudios@gmail.com • SECLOUDIVE PLATFORM" />
            {/* Guilloche border accents */}
            <div className="cert-border-outer" style={{ position: 'relative', zIndex: 1 }}>
              <div className="cert-border-inner">
                {/* Corner Ornaments */}
                <div className="cert-corner tl" />
                <div className="cert-corner tr" />
                <div className="cert-corner bl" />
                <div className="cert-corner br" />

                {/* Header Logo & Authority */}
                <div className="cert-header">
                  <div className="cert-brand-mark">
                    <ShieldCheck size={36} className="cert-shield-icon" />
                  </div>
                  <div className="cert-org-title">SECLOUDIVE ACADEMY & ADVERSARIAL SIMULATOR</div>
                  <div className="cert-issuer-tag">OFFICIALLY ISSUED BY NAEN STUDIOS (naenstudios@gmail.com)</div>
                </div>

                {/* Certificate Main Title */}
                <div className="cert-main-title">
                  CERTIFICATE OF CLOUD MASTERY
                  <div className="cert-sub-title">AWS ZERO-TRUST ARCHITECTURE & DEVSECOPS EXCELLENCE</div>
                </div>

                <div className="cert-divider-line" />

                {/* Recipient Presentation */}
                <div className="cert-presentation">
                  <p className="cert-intro-text">THIS CERTIFIES THAT</p>
                  
                  {isEditingName ? (
                    <div className="cert-name-edit-box no-print">
                      <input 
                        type="text"
                        defaultValue={studentName}
                        autoFocus
                        className="cert-name-input"
                        onBlur={(e) => handleSaveName(e.target.value.trim() || 'Cloud Security Engineer')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName(e.target.value.trim() || 'Cloud Security Engineer')
                          if (e.key === 'Escape') setIsEditingName(false)
                        }}
                      />
                      <button 
                        className="btn-save-name"
                        onClick={(e) => handleSaveName(e.target.previousSibling.value.trim() || 'Cloud Security Engineer')}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="cert-recipient-name"
                      onClick={() => setIsEditingName(true)}
                      title="Click to change candidate name"
                    >
                      <span>{studentName}</span>
                      <span className="cert-edit-hint no-print">(Click to edit)</span>
                    </div>
                  )}

                  <p className="cert-description">
                    has successfully demonstrated professional competency in designing resilient AWS architectures, 
                    executing real SOC standard operating procedures (SOPs), conducting multi-vector threat investigations, 
                    and neutralizing adversarial attacks in accordance with the AWS Well-Architected Framework and CIS Benchmarks.
                  </p>
                </div>

                {/* Verification Metrics Grid */}
                <div className="cert-metrics-grid">
                  <div className="cert-metric-card">
                    <span className="cert-metric-value">{masterTotalXP.toLocaleString()} XP</span>
                    <span className="cert-metric-label">Master XP Earned</span>
                  </div>
                  <div className="cert-metric-card">
                    <span className="cert-metric-value">{masterProgressPercent}%</span>
                    <span className="cert-metric-label">Curriculum Mastery</span>
                  </div>
                  <div className="cert-metric-card">
                    <span className="cert-metric-value">{completedMasterActivities} Tasks</span>
                    <span className="cert-metric-label">Verified SOPs & Labs</span>
                  </div>
                  <div className="cert-metric-card">
                    <span className="cert-metric-value">{solvedThreatRoomsCount} Rooms</span>
                    <span className="cert-metric-label">Adversarial Threat Cleared</span>
                  </div>
                </div>

                {/* Footer Signatures & Official Gold Seal */}
                <div className="cert-footer">
                  <div className="cert-signature-block">
                    <div className="cert-sig-line">
                      <span className="cert-sig-script">NAEN Studios Engineering Board</span>
                    </div>
                    <div className="cert-sig-title">Curriculum Director & Lead Architect</div>
                    <div className="cert-sig-org">NAEN Studios • naenstudios@gmail.com</div>
                  </div>

                  {/* Embossed Gold Seal & Scannable Verification QR Code */}
                  <div className="cert-seal-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <OfficialAccreditationSeal size={90} />
                    {qrCodeDataUrl && (
                      <div className="cert-qr-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <img 
                          src={qrCodeDataUrl} 
                          alt={`QR Verification for ${credentialId}`} 
                          style={{ width: '74px', height: '74px', borderRadius: '6px', background: '#ffffff', padding: '3px', border: '1px solid rgba(0,0,0,0.15)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                        />
                        <span style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em', fontWeight: 600 }}>
                          Scan to Verify
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="cert-signature-block cert-sig-right">
                    <div className="cert-id-tag">
                      <strong>CREDENTIAL ID:</strong> {credentialId}
                    </div>
                    <div className="cert-date-tag">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      <strong>ISSUED:</strong> {issueDate}
                    </div>
                    <div className="cert-verify-link">
                      Verification: secloudive.naenstudios.io/verify
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Tip */}
        <div className="cert-modal-tip no-print">
          <Sparkles size={14} className="text-amber" />
          <span>
            <strong>Official Recruiter Tip:</strong> You can download this credential as a high-resolution PDF 
            via the Print button (choose <em>"Save as PDF"</em>, Landscape orientation). 
            Inquiries: <a href="mailto:naenstudios@gmail.com" style={{ color: '#38bdf8' }}>naenstudios@gmail.com</a>
          </span>
        </div>
      </div>
    </div>
  )
}
