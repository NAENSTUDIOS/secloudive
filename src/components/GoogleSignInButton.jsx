/**
 * GoogleSignInButton — NAEN Studios / SeCLOUDIVE
 *
 * Premium Google Sign-In button with:
 * - Google's official brand colors & icon
 * - Loading state
 * - Success animation
 * - Renders as the primary CTA on the auth screen
 */

import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

// Google "G" SVG logo (official brand asset)
function GoogleLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function GoogleSignInButton({ onSuccess, onError, compact = false }) {
  const { signIn } = useAuth()
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSuccess = async (credentialResponse) => {
    setStatus('loading')
    try {
      const res = await signIn(credentialResponse.credential)
      if (res?.success || res === true) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
        onSuccess?.(res)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
        onError?.(res?.error || 'Sign-in failed')
      }
    } catch (err) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      onError?.(err?.message || 'Unknown error')
    }
  }

  const handleError = () => {
    setStatus('error')
    setTimeout(() => setStatus('idle'), 3000)
    onError?.('Google sign-in was cancelled or failed')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Official Google Identity Services button */}
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(148,163,184,0.2)',
        transition: 'all 0.2s ease',
        opacity: status === 'loading' ? 0.7 : 1,
      }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="filled_black"
          shape="rectangular"
          size={compact ? 'medium' : 'large'}
          text="signin_with"
          locale="en"
          logo_alignment="left"
        />
      </div>

      {/* Status messages */}
      {status === 'loading' && (
        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #38bdf8', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          Signing you in…
        </div>
      )}
      {status === 'success' && (
        <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '5px' }}>
          ✓ Signed in successfully
        </div>
      )}
      {status === 'error' && (
        <div style={{ fontSize: '12px', color: '#f87171' }}>
          Sign-in failed — please try again
        </div>
      )}
    </div>
  )
}
