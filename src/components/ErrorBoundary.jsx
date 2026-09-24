import React from 'react'
import { AlertTriangle, RotateCcw, Home, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('SeCloudive SOC Runtime Caught Error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          color: '#f8fafc',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'grid',
            placeItems: 'center',
            color: '#ef4444',
            marginBottom: '20px',
          }}>
            <AlertTriangle size={32} />
          </div>

          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#ef4444',
            letterSpacing: '1.5px',
            marginBottom: '8px',
          }}>
            SOC TELEMETRY INTERRUPTION /// CLIENT EXCEPTION CAUGHT
          </div>

          <h2 style={{ fontSize: '28px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Security Simulation Encountered an Exception
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            The application intercepted a client-side execution interruption. Your progress data in localStorage is completely safe.
          </p>

          {this.state.error && (
            <div style={{
              width: '100%',
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'left',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              color: '#f87171',
              overflowX: 'auto',
              marginBottom: '24px',
            }}>
              <strong>Error:</strong> {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#0ea5e9',
                color: '#020617',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} /> Reload Application
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <Home size={16} /> Return to Home
            </a>
            <a
              href="/labs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <Terminal size={16} /> Jump to Real Labs
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
