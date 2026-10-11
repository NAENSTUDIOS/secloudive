import React from 'react'
import { AlertTriangle, TrendingDown, RefreshCcw, Target, Zap } from 'lucide-react'

export default function AwsSpecialtyTierGuide() {
  return (
    <section className="aws-specialty-guide-section" style={{
      margin: '40px auto',
      maxWidth: '1200px',
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '16px',
      padding: '24px 32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, #f59e0b, #ef4444)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          padding: '10px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '1px', marginBottom: '2px', fontFamily: "'DM Mono', monospace" }}>
            INDUSTRY SHIFT ALERT
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            AWS is Quietly Dismantling its Specialty Tier: What it Means for You
          </h2>
        </div>
      </div>

      <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '900px' }}>
        The cloud landscape is shifting beneath our feet, and AWS has been quietly overhauling one of its most rigorous credential structures: the Specialty certification tier. Over the past year, we have seen a systematic retirement of highly technical, domain-specific certifications. If you are a cloud security engineer, network specialist, or database administrator, this shift profoundly impacts how you should strategize your career and learning path over the next 24 months.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <TrendingDown size={16} className="text-red" style={{ color: '#ef4444' }} />
            The Timeline of Retirements
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>RETIRED (Apr 2024):</span> Data Analytics – Specialty
            </li>
            <li style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>RETIRED (Apr 2024):</span> Database – Specialty
            </li>
            <li style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>RETIRED (Apr 2024):</span> SAP on AWS – Specialty
            </li>
            <li style={{ fontSize: '0.85rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>UPCOMING (Dec 2026):</span> Advanced Networking – Specialty
            </li>
          </ul>
        </div>

        <div style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <RefreshCcw size={16} className="text-cyan" style={{ color: '#06b6d4' }} />
            Why is AWS Doing This?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#e2e8f0' }}>1. Role-Based Credentials:</strong> Focus is no longer on "knowing a service," but on "doing a job." 
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#e2e8f0' }}>2. The GenAI Pivot:</strong> Training programs prioritize AI/ML (Amazon Bedrock, Q, Trainium) over commoditized infrastructure abstractions.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#e2e8f0' }}>3. Core Consolidation:</strong> Networking is an intrinsic part of being a Solutions Architect or a Cloud Security Engineer, heavily tested in Professional/Associate exams.
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={18} />
          How to Adapt Your Learning Path
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>1. Skip Networking Specialty</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Unless employer mandated, ROI is plummeting. Master core networking via SAP and Security certs instead.</div>
          </div>
          <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>2. Hold the Security Specialty (For Now)</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SCS-C02 remains the gold standard, but expect it to eventually merge into a broader "Cloud Security Engineer" cert.</div>
          </div>
          <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>3. Lean into IAM &amp; Automation</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pivot your time into verifiable portfolio projects: Boto3 automation, Athena threat detection, EventBridge remediation.</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
        <Zap size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
          The Bottom Line: The era of the "hyper-specialized AWS certification" is fading. Stop studying just to pass isolated domain exams. Start building cross-domain, automated architectures.
        </span>
      </div>
    </section>
  )
}
