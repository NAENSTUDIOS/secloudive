// ==============================================================================
// SeCloudive Job Feed API Keys & Auto-Sync Engine Modal
// Empowers users to configure Google Gemini AI, RapidAPI JSearch, and Adzuna keys
// Enables automated scheduled background synchronization without manual daily updates
// ==============================================================================

import { useState, useEffect } from 'react'
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Cpu,
  Lock,
  Clock,
  Radio,
  Zap,
  Check,
  X
} from 'lucide-react'
import { liveJobFeedAggregator } from '../services/liveJobFeedAggregatorService.js'
import { geminiRotator } from '../services/geminiKeyRotator.js'
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio.js'

export default function JobApiKeysManagerModal({ isOpen, onClose, onSyncRequested }) {
  const [config, setConfig] = useState(() => liveJobFeedAggregator.getConfig())
  const [rapidApiKey, setRapidApiKey] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [adzunaAppId, setAdzunaAppId] = useState('')
  const [adzunaAppKey, setAdzunaAppKey] = useState('')
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [autoSyncIntervalHours, setAutoSyncIntervalHours] = useState(12)

  const [testState, setTestState] = useState({
    gemini: 'idle', // 'idle' | 'testing' | 'success' | 'error'
    rapid: 'idle'
  })
  const [testMessage, setTestMessage] = useState({
    gemini: '',
    rapid: ''
  })
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const current = liveJobFeedAggregator.getConfig()
      setConfig(current)
      setRapidApiKey(current.rapidApiKey || '')
      setGeminiApiKey(current.geminiApiKey || '')
      setAdzunaAppId(current.adzunaAppId || '')
      setAdzunaAppKey(current.adzunaAppKey || '')
      setAutoSyncEnabled(current.autoSyncEnabled ?? true)
      setAutoSyncIntervalHours(current.autoSyncIntervalHours || 12)
      setTestState({ gemini: 'idle', rapid: 'idle' })
      setTestMessage({ gemini: '', rapid: '' })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleTestGeminiKey = async () => {
    playTactileClick()
    const key = geminiApiKey.trim()
    if (!key.startsWith('AIzaSy') || key.length < 25) {
      setTestState(prev => ({ ...prev, gemini: 'error' }))
      setTestMessage(prev => ({ ...prev, gemini: 'Invalid Google key format (must start with "AIzaSy")' }))
      return
    }

    setTestState(prev => ({ ...prev, gemini: 'testing' }))
    setTestMessage(prev => ({ ...prev, gemini: '' }))

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Respond with: PING_OK' }] }] })
      })

      if (res.ok) {
        setTestState(prev => ({ ...prev, gemini: 'success' }))
        setTestMessage(prev => ({ ...prev, gemini: '✓ Connected to Google AI Studio!' }))
        playSuccessChime()
      } else {
        const err = await res.json().catch(() => ({}))
        setTestState(prev => ({ ...prev, gemini: 'error' }))
        setTestMessage(prev => ({ ...prev, gemini: `Error (HTTP ${res.status}): ${err?.error?.message || 'Check key permissions'}` }))
      }
    } catch (e) {
      setTestState(prev => ({ ...prev, gemini: 'error' }))
      setTestMessage(prev => ({ ...prev, gemini: `Network error: ${e.message}` }))
    }
  }

  const handleTestRapidApiKey = async () => {
    playTactileClick()
    const key = rapidApiKey.trim()
    if (!key || key.length < 15) {
      setTestState(prev => ({ ...prev, rapid: 'error' }))
      setTestMessage(prev => ({ ...prev, rapid: 'Please enter a valid RapidAPI Key' }))
      return
    }

    setTestState(prev => ({ ...prev, rapid: 'testing' }))
    setTestMessage(prev => ({ ...prev, rapid: '' }))

    try {
      const res = await fetch('https://jsearch.p.rapidapi.com/search?query=cloud+security&page=1&num_pages=1', {
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      })

      if (res.ok) {
        setTestState(prev => ({ ...prev, rapid: 'success' }))
        setTestMessage(prev => ({ ...prev, rapid: '✓ RapidAPI JSearch live feed verified!' }))
        playSuccessChime()
      } else {
        setTestState(prev => ({ ...prev, rapid: 'error' }))
        setTestMessage(prev => ({ ...prev, rapid: `RapidAPI rejected key (HTTP ${res.status})` }))
      }
    } catch (e) {
      setTestState(prev => ({ ...prev, rapid: 'error' }))
      setTestMessage(prev => ({ ...prev, rapid: `Network error: ${e.message}` }))
    }
  }

  const handleSaveAndSync = (e) => {
    if (e) e.preventDefault()
    playTactileClick()

    liveJobFeedAggregator.saveConfig({
      geminiApiKey: geminiApiKey.trim(),
      rapidApiKey: rapidApiKey.trim(),
      adzunaAppId: adzunaAppId.trim(),
      adzunaAppKey: adzunaAppKey.trim(),
      autoSyncEnabled,
      autoSyncIntervalHours: Number(autoSyncIntervalHours) || 12
    })

    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      if (onSyncRequested) onSyncRequested()
      onClose()
    }, 800)
  }

  const handleClearAllKeys = () => {
    if (window.confirm('Clear all stored custom job feed API keys?')) {
      playTactileClick()
      liveJobFeedAggregator.saveConfig({
        geminiApiKey: '',
        rapidApiKey: '',
        adzunaAppId: '',
        adzunaAppKey: ''
      })
      setGeminiApiKey('')
      setRapidApiKey('')
      setAdzunaAppId('')
      setAdzunaAppKey('')
      setTestState({ gemini: 'idle', rapid: 'idle' })
      setTestMessage({ gemini: '', rapid: '' })
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="animate-reveal"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(6, 10, 20, 0.99) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.15)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Key size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  Live Job Feeds &amp; Automated API Keys
                </h2>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10b981',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  Zero Manual Updates Needed
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Connect live job search APIs. The platform automatically refreshes openings across all cloud roles and companies.
              </p>
            </div>
          </div>
          <button
            id="btn-close-job-keys-modal"
            type="button"
            onClick={onClose}
            aria-label="Close API Keys Modal"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSaveAndSync} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Key 1: RapidAPI JSearch */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={16} color="#38bdf8" />
                <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>RapidAPI JSearch Key (Live Google Jobs &amp; LinkedIn)</strong>
              </div>
              <a
                href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.72rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Get Free Key (RapidAPI)</span>
                <ExternalLink size={11} />
              </a>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Aggregates live cloud postings directly from Google Jobs, LinkedIn, Indeed, and ZipRecruiter in real-time.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="input-rapid-api-key"
                type="password"
                value={rapidApiKey}
                onChange={e => setRapidApiKey(e.target.value)}
                placeholder="Enter RapidAPI Key (e.g. 8a3b8c9d...)"
                style={{
                  flex: 1,
                  background: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                id="btn-test-rapid-api"
                type="button"
                onClick={handleTestRapidApiKey}
                disabled={!rapidApiKey.trim() || testState.rapid === 'testing'}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: rapidApiKey.trim() ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                {testState.rapid === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {testMessage.rapid && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: testState.rapid === 'success' ? '#10b981' : '#f87171' }}>
                {testMessage.rapid}
              </div>
            )}
          </div>

          {/* Key 2: Google Gemini AI Key */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#c084fc" />
                <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>Google Gemini AI Key (gemini-3.5-flash-lite)</strong>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.72rem', color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Get Free Key (Google AI Studio)</span>
                <ExternalLink size={11} />
              </a>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Generates instant technical interview questions, candidate match analysis, and synthesizes active hyperscale cloud roles.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="input-gemini-api-key"
                type="password"
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                placeholder="Enter Gemini Key (AIzaSy...)"
                style={{
                  flex: 1,
                  background: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                id="btn-test-gemini-api"
                type="button"
                onClick={handleTestGeminiKey}
                disabled={!geminiApiKey.trim() || testState.gemini === 'testing'}
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  color: '#c084fc',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: geminiApiKey.trim() ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                {testState.gemini === 'testing' ? 'Testing...' : 'Test Gemini'}
              </button>
            </div>
            {testMessage.gemini && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: testState.gemini === 'success' ? '#10b981' : '#f87171' }}>
                {testMessage.gemini}
              </div>
            )}
          </div>

          {/* Key 3: Auto-Sync Scheduler Settings */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#10b981" />
                <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>Automated Background Update Scheduler</strong>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={e => setAutoSyncEnabled(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                />
                <span>Auto-Refresh Enabled</span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>Refresh Interval:</span>
              <select
                value={autoSyncIntervalHours}
                onChange={e => setAutoSyncIntervalHours(Number(e.target.value))}
                style={{
                  background: 'rgba(2, 6, 23, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: '#f8fafc',
                  fontSize: '0.78rem'
                }}
              >
                <option value={6}>Every 6 Hours</option>
                <option value={12}>Every 12 Hours (Recommended)</option>
                <option value={24}>Daily (Every 24 Hours)</option>
              </select>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Last Synchronized: {new Date(config.lastSyncTimestamp || Date.now()).toLocaleString()}
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={handleClearAllKeys}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.76rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset Keys to Base Feeds
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="button button-ghost"
                style={{ fontSize: '0.8rem', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                id="btn-save-job-keys"
                type="submit"
                className="button button-primary"
                style={{
                  fontSize: '0.8rem',
                  padding: '8px 20px',
                  background: saveSuccess ? '#10b981' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  gap: '6px'
                }}
              >
                {saveSuccess ? <Check size={14} /> : <Zap size={14} />}
                <span>{saveSuccess ? 'Saved & Synced!' : 'Save & Sync Live Feeds'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
