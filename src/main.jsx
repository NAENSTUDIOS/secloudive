import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { GOOGLE_CLIENT_ID } from './config/googleAuthConfig'
import './styles/globals.css'
import './styles/enhancements.css'

import { initCrashSupervisor } from './solutions/crashSupervisor.js'

// Initialize the global continuous self-healing crash supervisor
initCrashSupervisor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>
)

