import { Shield, FileText, Scale, Globe, Eye, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import legalContent from '../data/cloudive/legal-content.json'

const SECTIONS = [
  { key: 'terms', icon: <FileText size={20} />, color: '#38bdf8' },
  { key: 'disclaimer', icon: <Shield size={20} />, color: '#f59e0b' },
  { key: 'license', icon: <Scale size={20} />, color: '#10b981' },
  { key: 'refunds', icon: <CheckCircle2 size={20} />, color: '#a855f7' },
  { key: 'accessibility', icon: <Eye size={20} />, color: '#06b6d4' }
]

export default function LegalPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0' }}>

      {/* Hero */}
      <section style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '72px 24px 56px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(56,189,248,0.05) 0%, transparent 100%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(56,189,248,0.1)',
          border: '1px solid rgba(56,189,248,0.25)',
          borderRadius: '20px',
          padding: '4px 14px',
          fontSize: '0.68rem',
          fontWeight: 800,
          color: '#38bdf8',
          letterSpacing: '0.1em',
          marginBottom: '18px'
        }}>
          <Globe size={11} />
          LEGAL & POLICIES
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#f1f5f9' }}>
          SeCloudive Legal & Policies
        </h1>
        <p style={{ maxWidth: '520px', margin: '0 auto', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
          SeCloudive is an independent, free educational security training platform — not affiliated with Amazon Web Services, Inc.
          All content is original educational material under open terms.
        </p>
      </section>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '56px 24px' }}>

        {/* Quick Summary Banner */}
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <CheckCircle2 size={22} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#10b981', marginBottom: '6px', fontSize: '0.95rem' }}>
              The Short Version
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <li style={{ fontSize: '0.83rem', color: '#94a3b8' }}>Everything on SeCloudive is <strong style={{ color: '#e2e8f0' }}>free</strong> — no paywall, no email gate, no checkout</li>
              <li style={{ fontSize: '0.83rem', color: '#94a3b8' }}>SeCloudive is <strong style={{ color: '#e2e8f0' }}>not affiliated</strong> with Amazon Web Services, Inc.</li>
              <li style={{ fontSize: '0.83rem', color: '#94a3b8' }}>Content is original and provided for <strong style={{ color: '#e2e8f0' }}>personal & educational use</strong></li>
              <li style={{ fontSize: '0.83rem', color: '#94a3b8' }}>No commercial resale or scraping of curriculum permitted</li>
              <li style={{ fontSize: '0.83rem', color: '#94a3b8' }}>All attack simulations are strictly <strong style={{ color: '#e2e8f0' }}>isolated sandbox environments</strong></li>
            </ul>
          </div>
        </div>

        {/* Legal Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
          {SECTIONS.map(({ key, icon, color }) => {
            const section = legalContent[key]
            if (!section || !section.published) return null
            return (
              <div key={key} style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `3px solid ${color}`,
                borderRadius: '10px',
                padding: '22px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#e2e8f0' }}>{section.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569' }}>Updated: {section.lastUpdated}</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>
                  {section.summary}
                </p>
              </div>
            )
          })}
        </div>

        {/* AWS Trademark Notice */}
        <div style={{
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '32px'
        }}>
          <div style={{ fontWeight: 800, color: '#f59e0b', marginBottom: '8px', fontSize: '0.88rem' }}>
            AWS Trademark & Affiliation Disclaimer
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            "Amazon Web Services", "AWS", and all related service names are trademarks of Amazon.com, Inc. or its affiliates.
            SeCloudive is an independent educational platform and is not affiliated with, sponsored by, or endorsed by Amazon Web Services, Inc.
            All references to AWS services are for educational purposes under Nominative Fair Use doctrine.
            All content is original educational material synthesised from publicly available technical documentation.
          </p>
        </div>

        {/* Contact */}
        <div style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '10px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '8px' }}>Questions or Legal Inquiries?</div>
          <p style={{ margin: '0 0 14px', color: '#94a3b8', fontSize: '0.85rem' }}>
            SeCloudive is developed by <strong>NAEN Studios</strong>. For any licensing questions, academic partnership, or platform inquiries, please contact our official team:
          </p>
          <div style={{ marginBottom: '16px' }}>
            <a 
              href="mailto:naenstudios@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56,189,248,0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              naenstudios@gmail.com
            </a>
          </div>
          <Link to="/about" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'none'
          }}>
            Learn more on the About page <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </main>
  )
}
