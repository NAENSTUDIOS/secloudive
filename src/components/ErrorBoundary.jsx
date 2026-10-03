import React from 'react'
import { 
  AlertTriangle, 
  RotateCcw, 
  Home, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react'
import { reportCrashToSupervisor } from '../solutions/crashSupervisor.js'
import { executeSelfHealingAction } from '../solutions/aiCrashHealer.js'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      aiDiagnosis: null,
      isDiagnosing: false,
      autoHealCountdown: 8,
      autoHealCancelled: false,
      loopDetected: false
    }
    this.countdownTimer = null
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SeCloudive SOC Runtime] Intercepted Exception:', error, errorInfo)
    
    this.setState({ 
      errorInfo, 
      isDiagnosing: true 
    })

    // Route to global Crash Supervisor & AI Healer
    reportCrashToSupervisor(error, errorInfo, 'Root ErrorBoundary')
      .then(result => {
        this.setState({
          aiDiagnosis: result,
          isDiagnosing: false,
          loopDetected: result.isThrashing,
          autoHealCancelled: !result.autoReloadAllowed
        })
        if (result.autoReloadAllowed) {
          this.startAutoHealCountdown(result)
        }
      })
      .catch(() => {
        this.setState({ isDiagnosing: false })
      })
  }

  componentWillUnmount() {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
  }

  startAutoHealCountdown = (diagnosis) => {
    if (this.state.loopDetected || this.state.autoHealCancelled) return
    // Only auto-countdown for safe reload actions
    if (diagnosis?.recommendedAction === 'SAFE_RELOAD' || diagnosis?.recommendedAction === 'RESET_TRANSIENT_STATE') {
      this.countdownTimer = setInterval(() => {
        this.setState(prev => {
          if (prev.autoHealCancelled) {
            clearInterval(this.countdownTimer)
            return null
          }
          if (prev.autoHealCountdown <= 1) {
            clearInterval(this.countdownTimer)
            executeSelfHealingAction(diagnosis?.recommendedAction || 'SAFE_RELOAD')
            return { autoHealCountdown: 0 }
          }
          return { autoHealCountdown: prev.autoHealCountdown - 1 }
        })
      }, 1000)
    }
  }

  handleCancelCountdown = () => {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
    this.setState({ autoHealCancelled: true })
  }

  handleTriggerAutoHeal = () => {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
    executeSelfHealingAction(this.state.aiDiagnosis?.recommendedAction || 'SAFE_RELOAD')
  }

  render() {
    if (this.state.hasError) {
      const { error, aiDiagnosis, isDiagnosing, autoHealCountdown, autoHealCancelled } = this.state

      return (
        <div style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          color: '#f8fafc',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Header Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            display: 'grid',
            placeItems: 'center',
            color: '#ef4444',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'
          }}>
            <AlertTriangle size={32} />
          </div>

          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#f87171',
            letterSpacing: '1.5px',
            marginBottom: '6px',
            fontWeight: 700
          }}>
            SOC TELEMETRY INTERRUPTION /// CLIENT EXCEPTION INTERCEPTED
          </div>

          <h2 style={{ fontSize: '26px', margin: '0 0 8px', letterSpacing: '-0.5px', fontWeight: 800 }}>
            Security Simulation Safety Interception
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', maxWidth: '600px' }}>
            The safety boundary intercepted an unexpected execution state. Your progress in localStorage remains completely intact.
          </p>

          {/* Gemini AI Autonomous Diagnosis Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '20px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '6px' }}>
                  <Sparkles size={16} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    Gemini AI Autonomous Error Diagnosis
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Real-time root cause analysis & automatic remediation protocol
                  </div>
                </div>
              </div>

              {aiDiagnosis ? (
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ShieldCheck size={12} />
                  Confidence: {aiDiagnosis.confidenceScore}%
                </span>
              ) : isDiagnosing ? (
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}>
                  Analyzing with Gemini...
                </span>
              ) : null}
            </div>

            {aiDiagnosis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Identified Root Cause
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600 }}>
                    {aiDiagnosis.rootCause}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                    <strong>Technical Origin:</strong> {aiDiagnosis.whyItHappened}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                      Recommended Auto-Heal Action
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6ee7b7', fontWeight: 600 }}>
                      {aiDiagnosis.actionLabel || 'Safe State Reconcile & Reload'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(56, 189, 248, 0.06)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                      Architectural Prevention Tip
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {aiDiagnosis.preventionTip}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                <Activity size={20} color="#38bdf8" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 8px' }} />
                AI SRE is analyzing exception telemetry and preparing automatic state recovery...
              </div>
            )}
          </div>

          {/* Raw Error Details (Collapsible) */}
          {error && (
            <div style={{
              width: '100%',
              background: '#090d16',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'left',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              color: '#f87171',
              overflowX: 'auto',
              marginBottom: '20px',
            }}>
              <strong>Exception:</strong> {error.toString()}
            </div>
          )}

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <button
              type="button"
              onClick={this.handleTriggerAutoHeal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                color: '#020617',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
              }}
            >
              <Zap size={16} />
              <span>{aiDiagnosis?.actionLabel || 'Auto-Heal & Recover Simulation'}</span>
              {!autoHealCancelled && autoHealCountdown > 0 && (
                <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                  ({autoHealCountdown}s)
                </span>
              )}
            </button>

            {!autoHealCancelled && autoHealCountdown > 0 && (
              <button
                type="button"
                onClick={this.handleCancelCountdown}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  color: '#94a3b8',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel Auto-Timer
              </button>
            )}

            <button
              type="button"
              onClick={() => { window.location.href = '/' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Home size={15} /> Return to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
