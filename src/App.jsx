import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import SentinelAssistant from './components/SentinelAssistant'
import GlobalCommandPalette from './components/GlobalCommandPalette'
import CertificateModal from './components/CertificateModal'
import UserSyncModal from './components/UserSyncModal'
import WelcomeOnboardingModal from './components/WelcomeOnboardingModal'
import SafeBoundary from './components/SafeBoundary'
import GlobalSecurityEnclave from './components/GlobalSecurityEnclave'
import { ChallengeProvider } from './context/ChallengeContext'
import './styles/platformModals.css'
import './styles/motionGraphics.css'

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    try {
      // 1. Force welcome screen if query param ?welcome=true, ?onboarding=true, or ?reset=true is present
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('welcome') === 'true' || params.get('onboarding') === 'true' || params.get('reset') === 'true') {
          return false
        }
      }

      // 2. Strict Welcome User Gate: Must have explicitly completed strict v5 welcome flow
      const strictCompleted = localStorage.getItem('secloudive_welcome_user_strict_enforced_v5') === 'true'
      const legacyCompleted = localStorage.getItem('secloudive_onboarding_completed_v1') === 'true'

      // Strictly gate: requires verified completion
      return strictCompleted && legacyCompleted
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleCompleted = () => setIsOnboardingCompleted(true)
    window.addEventListener('secloudive-onboarding-completed', handleCompleted)

    // Direct Fullscreen Focus Confirmation (Automatic, Non-intrusive)
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        const existing = document.getElementById('secloudive-fullscreen-indicator')
        if (existing) existing.remove()

        const toast = document.createElement('div')
        toast.id = 'secloudive-fullscreen-indicator'
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999999;
          background: rgba(15, 23, 42, 0.94);
          border: 1px solid rgba(56, 189, 248, 0.45);
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 25px rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 8px 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f8fafc;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          pointer-events: none;
          animation: toastSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `
        toast.innerHTML = `
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
          <span style="color: #38bdf8;">Focus Arena Engaged</span>
          <span style="color: #64748b;">•</span>
          <span style="color: #cbd5e1; font-weight: 600;">Distraction-Free Cloud Security Arena</span>
        `
        document.body.appendChild(toast)

        setTimeout(() => {
          toast.style.animation = 'toastSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          setTimeout(() => toast.remove(), 500)
        }, 3000)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('secloudive-onboarding-completed', handleCompleted)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <BrowserRouter>
      <ChallengeProvider>
        {/* ── GLOBAL ZERO-LEAK SECURITY ENCLAVE: Always armed across gate & application ── */}
        <SafeBoundary name="GlobalSecurityEnclave"><GlobalSecurityEnclave /></SafeBoundary>

        {!isOnboardingCompleted ? (
          /* ── FULL-PAGE GATE: Website does NOT load until user signs in or continues as guest ── */
          <div
            className="onboarding-gate-screen"
            style={{ minHeight: '100vh', width: '100%', background: '#020617' }}
          >
            <SafeBoundary name="WelcomeOnboardingModal">
              <WelcomeOnboardingModal
                isFullPageGate={true}
                onComplete={() => setIsOnboardingCompleted(true)}
              />
            </SafeBoundary>
          </div>
        ) : (
          <>
            {/* ── MAIN APP SHELL: Only rendered AFTER onboarding completes in UHD Auto-Built Layer ── */}
            <div className="app-shell uhd-auto-built-layer">
              <Navbar />
              <SafeBoundary
                name="AppRoutes"
                fallback={
                  <div style={{
                    minHeight: '65vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      maxWidth: '520px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '12px',
                      padding: '28px',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '11px',
                        color: '#38bdf8',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        fontWeight: 700
                      }}>
                        SOC ROUTE DEFENSE RECOVERY
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                        View State Intercepted & Isolated
                      </h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                        This specific route experienced a display interruption. The rest of the platform, your login, and your progress remain fully intact.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => window.location.reload()}
                          className="button button-primary"
                          style={{ padding: '8px 18px', fontSize: '13px' }}
                        >
                          Reload View
                        </button>
                        <a
                          href="/"
                          className="button button-ghost"
                          style={{ padding: '8px 18px', fontSize: '13px' }}
                        >
                          Return to Home
                        </a>
                      </div>
                    </div>
                  </div>
                }
              >
                <AppRoutes />
              </SafeBoundary>
              <Footer />
            </div>

            {/* ── GLOBAL FIXED OVERLAYS: Mounted at root level to ensure proper viewport positioning ── */}
            <SafeBoundary name="SentinelAssistant"><SentinelAssistant /></SafeBoundary>
            <SafeBoundary name="GlobalCommandPalette"><GlobalCommandPalette /></SafeBoundary>
            <SafeBoundary name="CertificateModal"><CertificateModal /></SafeBoundary>
            <SafeBoundary name="UserSyncModal"><UserSyncModal /></SafeBoundary>
            {/* WelcomeOnboardingModal in non-gate mode — for when user manually reopens it from Navbar/Footer */}
            <SafeBoundary name="WelcomeOnboardingModal"><WelcomeOnboardingModal /></SafeBoundary>
          </>
        )}
      </ChallengeProvider>
    </BrowserRouter>
  )
}
