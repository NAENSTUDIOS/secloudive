import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import LiveProgressBadge from './components/LiveProgressBadge'
import SentinelAssistant from './components/SentinelAssistant'
import GlobalCommandPalette from './components/GlobalCommandPalette'
import CertificateModal from './components/CertificateModal'
import AwsLatencyMonitor from './components/AwsLatencyMonitor'
import UserSyncModal from './components/UserSyncModal'
import AutoScriptDispatchModal from './components/AutoScriptDispatchModal'
import SeasonalClimateOverlay from './components/SeasonalClimateOverlay'
import AwsFlashcardDrillModal from './components/AwsFlashcardDrillModal'
import DiagnosticPlacementModal from './components/DiagnosticPlacementModal'
import GlobalCyberHUD from './components/GlobalCyberHUD'
import LabNotesScratchpad from './components/LabNotesScratchpad'
import PlatformClarityGuideModal from './components/PlatformClarityGuideModal'
import LeaderboardModal from './components/LeaderboardModal'
import ClearanceGateModal from './components/ClearanceGateModal'
import WelcomeOnboardingModal from './components/WelcomeOnboardingModal'
import SafeBoundary from './components/SafeBoundary'
import { ChallengeProvider } from './context/ChallengeContext'
import './styles/platformModals.css'
import './styles/motionGraphics.css'
import './styles/flashcardDrill.css'
import './styles/platformClarityGuide.css'

export default function App() {
  return (
    <BrowserRouter>
      <ChallengeProvider>
        <div className="app-shell">
          <SafeBoundary name="SeasonalClimateOverlay"><SeasonalClimateOverlay /></SafeBoundary>
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
          <SafeBoundary name="ClearanceGateModal"><ClearanceGateModal /></SafeBoundary>
          <SafeBoundary name="LiveProgressBadge"><LiveProgressBadge /></SafeBoundary>
          <SafeBoundary name="SentinelAssistant"><SentinelAssistant /></SafeBoundary>
          <SafeBoundary name="GlobalCommandPalette"><GlobalCommandPalette /></SafeBoundary>
          <SafeBoundary name="CertificateModal"><CertificateModal /></SafeBoundary>
          <SafeBoundary name="AwsLatencyMonitor"><AwsLatencyMonitor /></SafeBoundary>
          <SafeBoundary name="UserSyncModal"><UserSyncModal /></SafeBoundary>
          <SafeBoundary name="WelcomeOnboardingModal"><WelcomeOnboardingModal /></SafeBoundary>
          <SafeBoundary name="AutoScriptDispatchModal"><AutoScriptDispatchModal /></SafeBoundary>
          <SafeBoundary name="AwsFlashcardDrillModal"><AwsFlashcardDrillModal /></SafeBoundary>
          <SafeBoundary name="DiagnosticPlacementModal"><DiagnosticPlacementModal /></SafeBoundary>
          <SafeBoundary name="GlobalCyberHUD"><GlobalCyberHUD /></SafeBoundary>
          <SafeBoundary name="PlatformClarityGuideModal"><PlatformClarityGuideModal /></SafeBoundary>
          <SafeBoundary name="LeaderboardModal"><LeaderboardModal /></SafeBoundary>
          <SafeBoundary name="LabNotesScratchpad">
            <LabNotesScratchpad
              contextId="universal"
              contextTitle="Universal Cloud Security Scratchpad"
              contextType="Global Notes & Engineering Observations"
            />
          </SafeBoundary>
        </div>
      </ChallengeProvider>
    </BrowserRouter>
  )
}
