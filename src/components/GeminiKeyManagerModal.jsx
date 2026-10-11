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
  Zap,
  Lock,
  Layers,
  Check,
  X
} from 'lucide-react'
import { geminiRotator } from '../services/geminiKeyRotator.js'
import { liveGeminiIntelligence } from '../services/liveGeminiIntelligenceService.js'
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio.js'

export default function GeminiKeyManagerModal({ isOpen, onClose, onKeyUpdated }) {
  const [customKey, setCustomKey] = useState('')
  const [poolStatus, setPoolStatus] = useState(() => geminiRotator.getPoolStatus())
  const [testStatus, setTestStatus] = useState('idle') // 'idle' | 'testing' | 'success' | 'error'
  const [testResult, setTestResult] = useState(null)
  const [storedKeyPreview, setStoredKeyPreview] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setPoolStatus(geminiRotator.getPoolStatus())
      try {
        const k = localStorage.getItem('secloudive_user_gemini_key')
        if (k) {
          setStoredKeyPreview(`${k.slice(0, 8)}...${k.slice(-4)}`)
        } else {
          setStoredKeyPreview(null)
        }
      } catch {}
      setTestStatus('idle')
      setTestResult(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleTestAndSave = async (e) => {
    e.preventDefault()
    playTactileClick()
    const trimmed = customKey.trim()

    if (!trimmed.startsWith('AIzaSy') || trimmed.length < 25) {
      setTestStatus('error')
      setTestResult({
        error: 'Invalid Google AI Studio key format. A valid key starts with "AIzaSy" and is at least 25 characters.'
      })
      return
    }

    setTestStatus('testing')
    setTestResult(null)

    try {
      const startTime = Date.now()
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${trimmed}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Verify Gemini API connectivity for SeCloudive AWS platform. Respond with: OK' }] }]
        })
      })

      const latency = Date.now() - startTime

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        setTestStatus('error')
        setTestResult({
          error: `Google API rejected the key (HTTP ${res.status}): ${errJson?.error?.message || 'Check your key permissions.'}`
        })
        return
      }

      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      // Save valid key
      liveGeminiIntelligence.saveUserCustomKey(trimmed)
      setStoredKeyPreview(`${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`)
      setPoolStatus(geminiRotator.getPoolStatus())
      setTestStatus('success')
      setTestResult({
        message: 'Key successfully validated with Google Generative Language API!',
        latency: `${latency}ms`,
        model: 'gemini-3.5-flash-lite'
      })
      playSuccessChime()
      setCustomKey('')
      if (onKeyUpdated) onKeyUpdated()
    } catch (networkErr) {
      setTestStatus('error')
      setTestResult({
        error: `Network error connecting to Google API: ${networkErr.message}`
      })
    }
  }

  const handleRemoveCustomKey = () => {
    playTactileClick()
    liveGeminiIntelligence.removeUserCustomKey()
    setStoredKeyPreview(null)
    setPoolStatus(geminiRotator.getPoolStatus())
    setTestStatus('idle')
    setTestResult(null)
    if (onKeyUpdated) onKeyUpdated()
  }

  const handleRunPingTestOnPool = async () => {
    playTactileClick()
    setTestStatus('testing')
    setTestResult(null)

    const startTime = Date.now()
    const res = await geminiRotator.executeChat({
      prompt: 'Ping test from SeCloudive platform. Respond with: SECLOUDIVE_GEMINI_ONLINE',
      systemInstruction: 'Respond concisely.'
    })
    const latency = Date.now() - startTime

    if (res && res.success) {
      setTestStatus('success')
      setTestResult({
        message: `Platform Gemini Pool responded successfully!`,
        latency: `${latency}ms`,
        model: res.modelUsed,
        keyUsed: res.keyUsed
      })
      playSuccessChime()
      setPoolStatus(geminiRotator.getPoolStatus())
    } else {
      setTestStatus('error')
      setTestResult({
        error: 'All platform pool keys are currently cooling down. Please add your personal Google AI Studio key below for instant priority access.'
      })
    }
  }

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.15)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '6px',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
          aria-label="Close Gemini Key Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            padding: '8px',
            color: '#38bdf8'
          }}>
            <Key size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Gemini AI Integration & Live API Key Telemetry
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Authentic real-time intelligence powering live threat intel, internship radar, and security feeds
            </p>
          </div>
        </div>

        {/* Active Engine Health Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          margin: '20px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: poolStatus.hasKeys ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
              <strong style={{ fontSize: '0.9rem', color: poolStatus.hasKeys ? '#34d399' : '#fbbf24' }}>
                {poolStatus.hasKeys ? 'Online & Verified' : 'Grounded Base'}
              </strong>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Model</div>
            <div style={{ fontSize: '0.86rem', color: '#f8fafc', fontWeight: 700, marginTop: '4px' }}>
              gemini-3.5-flash-lite
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Rotation Pool</div>
            <div style={{ fontSize: '0.86rem', color: '#38bdf8', fontWeight: 700, marginTop: '4px' }}>
              {poolStatus.totalKeys} Slot{poolStatus.totalKeys === 1 ? '' : 's'} Active
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Throughput Cap</div>
            <div style={{ fontSize: '0.86rem', color: '#a78bfa', fontWeight: 700, marginTop: '4px' }}>
              {poolStatus.poolRpm} RPM / {poolStatus.poolRpd} RPD
            </div>
          </div>
        </div>

        {/* Ping Test Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleRunPingTestOnPool}
            disabled={testStatus === 'testing'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: testStatus === 'testing' ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={testStatus === 'testing' ? 'animate-spin' : ''} />
            {testStatus === 'testing' ? 'Querying Google Generative Language API...' : 'Ping Live Gemini API Endpoint'}
          </button>
        </div>

        {/* Test Result Message Box */}
        {testResult && (
          <div style={{
            background: testStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${testStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: testStatus === 'success' ? '#34d399' : '#f87171'
          }}>
            {testStatus === 'success' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                  <CheckCircle2 size={16} />
                  <span>{testResult.message}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Latency: <strong>{testResult.latency}</strong> • Model: <strong>{testResult.model}</strong> {testResult.keyUsed && `• Key: ${testResult.keyUsed}`}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                <span>{testResult.error}</span>
              </div>
            )}
          </div>
        )}

        {/* Personal User Key Section */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
              Custom Personal Gemini Key (Optional)
            </h3>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#38bdf8',
                fontSize: '0.78rem',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Get Free Key from Google AI Studio <ExternalLink size={12} />
            </a>
          </div>

          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
            SeCloudive provides a pre-configured multi-key rotation pool. If you prefer your own personal quota or want 100% guarantee of uninterrupted live feeds, you can supply your personal Google AI Studio key below. It stays strictly in your browser&apos;s local storage.
          </p>

          {storedKeyPreview ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>Active Personal Key</div>
                <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontFamily: 'monospace', marginTop: '2px' }}>{storedKeyPreview}</div>
              </div>
              <button
                onClick={handleRemoveCustomKey}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Remove & Revert to Pool
              </button>
            </div>
          ) : (
            <form onSubmit={handleTestAndSave} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="submit"
                disabled={testStatus === 'testing' || !customKey.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: (testStatus === 'testing' || !customKey.trim()) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {testStatus === 'testing' ? 'Validating...' : 'Validate & Save'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '8px 20px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Close Telemetry Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
