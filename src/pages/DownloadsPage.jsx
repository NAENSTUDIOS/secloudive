import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import {
  Download, Package, Shield, Server, Code2, Database,
  Sparkles, Cpu, BookOpen, FileText, Star, ArrowRight,
  CheckCircle2, Layers, Zap, Lock, Globe, Users, ChevronDown, ChevronUp,
  Mail, FileCode2
} from 'lucide-react'
import downloadsData from '../data/cloudive/downloads.json'
import foundationsData from '../data/cloudive/foundations.json'
import certMapData from '../data/cloudive/certification-map.json'
import homepageContent from '../data/cloudive/homepage-content.json'
import { 
  downloadResourcePack, 
  printEducationalPackPdf, 
  downloadEducationalPackZip 
} from '../utils/resourceGenerator'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { NaenStudiosLogoBadge, OfficialAccreditationSeal } from '../components/CloudGraphics'
import { AWS_SECURITY_CHEAT_SHEETS } from '../data/awsSecurityCheatSheets'
import AwsCheatSheetModal from '../components/AwsCheatSheetModal'

const ROLE_ICONS = {
  freeRoadmap: <Star size={18} />,
  foundationsLinux: <Server size={18} />,
  foundationsPython: <Code2 size={18} />,
  foundationsDocker: <Package size={18} />,
  foundationsKubernetes: <Layers size={18} />,
  foundationsGit: <Zap size={18} />,
  cloudAssociate: <Cpu size={18} />,
  seniorCloud: <Globe size={18} />,
  cloudArchitect: <BookOpen size={18} />,
  devsecops: <Shield size={18} />,
  cloudSecurity: <Lock size={18} />,
  cloudData: <Database size={18} />,
  toolkit: <Users size={18} />,
  fullBundle: <Package size={18} />,
  genai: <Sparkles size={18} />
}

const ROLE_COLORS = {
  freeRoadmap: '#f59e0b',
  foundationsLinux: '#10b981',
  foundationsPython: '#3b82f6',
  foundationsDocker: '#06b6d4',
  foundationsKubernetes: '#8b5cf6',
  foundationsGit: '#f97316',
  cloudAssociate: '#0ea5e9',
  seniorCloud: '#6366f1',
  cloudArchitect: '#14b8a6',
  devsecops: '#ef4444',
  cloudSecurity: '#a855f7',
  cloudData: '#f59e0b',
  toolkit: '#ec4899',
  fullBundle: '#10b981',
  genai: '#38bdf8'
}

const GROUPS = [
  {
    id: 'roadmap',
    label: 'Start Here',
    badge: 'Free Roadmap',
    badgeColor: '#f59e0b',
    ids: ['freeRoadmap']
  },
  {
    id: 'foundations',
    label: 'Engineering Foundations',
    badge: '5 Workbooks',
    badgeColor: '#10b981',
    ids: ['foundationsLinux', 'foundationsPython', 'foundationsDocker', 'foundationsKubernetes', 'foundationsGit']
  },
  {
    id: 'roles',
    label: 'Career Role Packs',
    badge: '6 Packs + Bundle',
    badgeColor: '#38bdf8',
    ids: ['cloudAssociate', 'seniorCloud', 'cloudArchitect', 'devsecops', 'cloudSecurity', 'cloudData', 'toolkit', 'genai', 'fullBundle']
  }
]

function DownloadCard({ item, isDownloaded, onDownload }) {
  const [downloadingZip, setDownloadingZip] = useState(false)
  const color = ROLE_COLORS[item.id] || '#38bdf8'
  const icon = ROLE_ICONS[item.id] || <FileText size={18} />

  const handleDownloadPdf = () => {
    playTactileClick()
    onDownload(item.id)
    printEducationalPackPdf(item)
  }

  const handleDownloadZip = async () => {
    playTactileClick()
    setDownloadingZip(true)
    onDownload(item.id)
    try {
      await downloadEducationalPackZip(item)
    } catch (err) {
      console.error('Code module download error:', err)
    } finally {
      setDownloadingZip(false)
    }
  }

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: `1px solid ${isDownloaded ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.06)'}`,
        borderLeft: `3px solid ${isDownloaded ? '#10b981' : color}`,
        borderRadius: '10px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        transition: 'all 0.2s',
        cursor: 'default'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isDownloaded ? '#10b981' : color
        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDownloaded ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.06)'
        e.currentTarget.style.borderLeft = `3px solid ${isDownloaded ? '#10b981' : color}`
        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        minWidth: '40px',
        borderRadius: '9px',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
            {item.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.67rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>
              {item.format}
            </span>
            <span style={{ fontSize: '0.67rem', color: '#64748b' }}>{item.size}</span>
          </div>
        </div>
        <p style={{ margin: '5px 0 10px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} /> NAEN Studios Verified
            </span>
            <span style={{ fontSize: '0.68rem', color: '#475569' }}>Verified: {item.lastChecked}</span>
            {isDownloaded && (
              <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <CheckCircle2 size={12} /> Saved to Progress
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(2, 132, 199, 0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
              title="Open and view or save the official NAEN Studios PDF document"
            >
              <FileText size={13} />
              <span>{isDownloaded ? 'View NAEN PDF Again' : '📄 View & Save NAEN PDF'}</span>
            </button>

            {item.id !== 'freeRoadmap' && item.id !== 'toolkit' && (
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: downloadingZip ? 'wait' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#38bdf8'
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                }}
                title="Download official raw Terraform and shell script modules as a .zip"
              >
                <FileCode2 size={12} />
                <span>{downloadingZip ? 'Packaging...' : 'Official Code (.zip)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GroupSection({ group, allItems, downloadedPacks, onDownload }) {
  const [open, setOpen] = useState(true)
  const items = allItems.filter(d => group.ids.includes(d.id))

  return (
    <div style={{ marginBottom: '36px' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '14px 18px',
          cursor: 'pointer',
          color: '#e2e8f0',
          marginBottom: open ? '16px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#e2e8f0' }}>{group.label}</span>
          <span style={{
            fontSize: '0.67rem',
            fontWeight: 700,
            color: group.badgeColor,
            background: `${group.badgeColor}18`,
            border: `1px solid ${group.badgeColor}40`,
            borderRadius: '20px',
            padding: '2px 10px'
          }}>
            {group.badge}
          </span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: '#64748b' }} /> : <ChevronDown size={16} style={{ color: '#64748b' }} />}
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(item => (
            <DownloadCard 
              key={item.id} 
              item={item} 
              isDownloaded={downloadedPacks?.includes(item.id)} 
              onDownload={onDownload} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CertMapSection() {
  const { examPaths, downloadGuide } = certMapData
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      borderRadius: '14px',
      padding: '28px',
      marginBottom: '40px'
    }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '6px' }}>
          CERTIFICATION PATHWAY MAP
        </div>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#e2e8f0' }}>
          {certMapData.header.title}
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          {certMapData.header.subtitle}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        {examPaths.map((path, i) => (
          <div key={i} style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '9px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {path.tier}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
              {path.exam}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a855f7', marginBottom: '6px', fontWeight: 600 }}>
              → {path.targetRole}
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
              {path.description}
            </p>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#475569', fontStyle: 'italic' }}>
        {certMapData.verificationNotice}
      </div>
    </div>
  )
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null)
  const { faq } = homepageContent
  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '8px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#e2e8f0' }}>
          Everything You Need to Know
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '800px', margin: '0 auto' }}>
        {faq.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${openIdx === i ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'border-color 0.2s'
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: 'transparent',
                border: 'none',
                padding: '16px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#e2e8f0'
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.4 }}>{item.question}</span>
              {openIdx === i
                ? <ChevronUp size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                : <ChevronDown size={16} style={{ color: '#64748b', flexShrink: 0 }} />}
            </button>
            {openIdx === i && (
              <div style={{ padding: '0 18px 16px', fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.7 }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DownloadsPage() {
  const { diveLevels } = homepageContent
  const publishedDownloads = downloadsData.filter(d => d.published !== false)
  const { recordDownload, downloadedPacks, downloadedPacksCount } = useChallenges()
  const [selectedCheatSheet, setSelectedCheatSheet] = useState(null)

  return (
    <main style={{ minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(56,189,248,0.07) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 24px 64px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#f59e0b',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={12} />
            PRODUCED BY NAEN STUDIOS · naenstudios@gmail.com
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#10b981',
            letterSpacing: '0.08em'
          }}>
            <CheckCircle2 size={12} />
            100% FREE · NO PAYWALL · VERIFIED SPECIFICATION
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56,189,248,0.12)',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#38bdf8',
            letterSpacing: '0.05em'
          }}>
            <span className="nav-progress-dot" aria-hidden="true" />
            <span>{downloadedPacksCount} of {publishedDownloads.length} Career Packs Saved</span>
          </div>
        </div>
        <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1, color: '#f1f5f9' }}>
          Free AWS Career Packs
          <br />
          <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Direct Download • NAEN Studios
          </span>
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto 16px', fontSize: '1.02rem', color: '#94a3b8', lineHeight: 1.7 }}>
          {homepageContent.hero.subtitle}
        </p>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 28px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          borderRadius: '10px',
          padding: '10px 18px',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'left'
        }}>
          <FileText size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span>
            <strong style={{ color: '#38bdf8' }}>Official NAEN Studios Delivery:</strong> All 15 workbooks, roadmaps, and dossiers are rendered as clear, print-ready PDF documents (no unexpected VS Code association). Official Terraform and bash scripts remain downloadable via <em>Official Code (.zip)</em>.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#downloads"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '11px 22px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'opacity 0.15s'
            }}
          >
            <Download size={16} />
            Browse All Downloads
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-script-dispatch'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(56,189,248,0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.35)',
              borderRadius: '8px',
              padding: '11px 22px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Mail size={16} />
            Auto Script to NAEN Studios
          </button>
          <Link
            to="/ramp-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '11px 22px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            Explore 6 Career Tracks
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

        {/* 4 Depth Levels of Mastery */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '8px' }}>
              {diveLevels.kicker}
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.7rem', fontWeight: 800, color: '#e2e8f0' }}>
              {diveLevels.title}
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{diveLevels.description}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: '14px' }}>
            {diveLevels.levels.map((level, i) => {
              const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']
              const color = colors[i]
              return (
                <div key={i} style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${color}25`,
                  borderTop: `3px solid ${color}`,
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{ fontSize: '0.67rem', fontWeight: 800, color, letterSpacing: '0.08em', marginBottom: '6px' }}>
                    {level.depth}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '8px', lineHeight: 1.3 }}>
                    {level.title}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {level.desc}
                  </p>
                  <span style={{
                    fontSize: '0.63rem',
                    fontWeight: 700,
                    color,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    borderRadius: '4px',
                    padding: '2px 8px'
                  }}>
                    {level.badge}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Certification Map */}
        <CertMapSection />

        {/* AWS Security Cheat Sheets & Interview Study Guides Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.1em', marginBottom: '8px' }}>
              PRINTABLE AWS STUDY GUIDES & INTERVIEW CHEAT SHEETS
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.7rem', fontWeight: 800, color: '#e2e8f0' }}>
              AWS Security High-Yield Cheat Sheets
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
              Format-perfect printable references covering IAM condition keys, incident response runbooks, and CloudTrail threat signatures.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {AWS_SECURITY_CHEAT_SHEETS.map(sheet => (
              <div 
                key={sheet.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderTop: '3px solid #10b981',
                  borderRadius: '12px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: sheet.badgeColor || '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '999px', padding: '2px 8px' }}>
                      {sheet.badge}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: "'DM Mono', monospace" }}>
                      {sheet.category}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.35 }}>
                    {sheet.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {sheet.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playTactileClick()
                    setSelectedCheatSheet(sheet)
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={14} />
                  <span>📄 View, Print & PDF Export</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedCheatSheet && (
          <AwsCheatSheetModal 
            cheatSheet={selectedCheatSheet} 
            onClose={() => setSelectedCheatSheet(null)} 
          />
        )}

        {/* Downloads */}
        <div id="downloads">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '8px' }}>
              DIRECT DOWNLOAD LIBRARY
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.7rem', fontWeight: 800, color: '#e2e8f0' }}>
              {publishedDownloads.length} Free Resources
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
              Every pack below is yours. Direct download, no forms, no checkout, no paywall.
            </p>
          </div>
          {GROUPS.map(group => (
            <GroupSection 
              key={group.id} 
              group={group} 
              allItems={publishedDownloads}
              downloadedPacks={downloadedPacks}
              onDownload={recordDownload}
            />
          ))}
        </div>

        {/* Featured Module (from homepage-content.json) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2,132,199,0.12) 0%, rgba(99,102,241,0.12) 100%)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '14px',
          padding: '32px',
          marginBottom: '48px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(56,189,248,0.12)',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '4px',
              padding: '2px 8px',
              letterSpacing: '0.08em'
            }}>
              {homepageContent.freeSample.badge}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{homepageContent.freeSample.title}</span>
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 800, color: '#e2e8f0' }}>
            {homepageContent.freeSample.heading}
          </h3>
          <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {homepageContent.freeSample.description}
          </p>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '10px', fontSize: '0.88rem' }}>
            {homepageContent.freeSample.moduleTitle}
            <span style={{ marginLeft: '8px', fontSize: '0.65rem', color: '#64748b' }}>
              {homepageContent.freeSample.version} · {homepageContent.freeSample.lastUpdated}
            </span>
          </div>
          <ul style={{ margin: '0 0 18px', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {homepageContent.freeSample.topics.map((t, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#e2e8f0', marginBottom: '8px' }}>What's inside each pack:</div>
            {homepageContent.freeSample.whatsInsideEachPack.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
                <CheckCircle2 size={13} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={async () => {
              const sampleItem = downloadsData.find(d => d.id === 'foundationsLinux') || downloadsData[1]
              recordDownload(sampleItem.id)
              await downloadResourcePack(sampleItem)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '11px 22px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Download size={15} />
            Download Featured Module (Free Pack)
          </button>
        </div>

        {/* FAQ */}
        <FaqSection />

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px'
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.4rem', fontWeight: 800, color: '#e2e8f0' }}>
            Ready to start learning?
          </h2>
          <p style={{ margin: '0 0 22px', color: '#94a3b8', fontSize: '0.9rem' }}>
            Continue with hands-on labs, guided career tracks, and NAEN AI by your side.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ramp-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff',
              borderRadius: '8px', padding: '11px 22px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none'
            }}>
              Explore 6 Career Tracks <ArrowRight size={15} />
            </Link>
            <Link to="/labs" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'rgba(255,255,255,0.05)', color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '11px 22px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none'
            }}>
              Real Labs
            </Link>
            <Link to="/cost-calculator" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'rgba(16,185,129,0.1)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '8px', padding: '11px 22px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none'
            }}>
              $0 Safe Lab Calculator
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
