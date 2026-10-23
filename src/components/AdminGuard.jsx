import React from 'react';
import { useChallenges } from '../context/ChallengeContext';
import { ShieldAlert, Lock, ShieldCheck, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { playTactileClick } from '../utils/cyberMotionAudio';

export default function AdminGuard({ children }) {
  const { activeProfile } = useChallenges() || {};
  const navigate = useNavigate();

  // Admin access must come from the active authenticated profile. Local
  // storage flags and client-entered "passkeys" are not authorization.
  const checkAdminStatus = () => {
    const email = (activeProfile?.email || '').trim().toLowerCase();
    if (email === 'naenstudios@gmail.com') return true;
    if (activeProfile?.role === 'admin' || activeProfile?.isAdmin === true) return true;
    return false;
  };

  const isAdmin = checkAdminStatus();

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        backgroundColor: '#020617',
        color: '#94a3b8'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 18px',
            color: '#f59e0b'
          }}>
            <Lock size={28} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '999px',
            padding: '4px 12px',
            color: '#fbbf24',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            <ShieldAlert size={12} />
            <span>EXCLUSIVELY FOR NAENSTUDIOS@GMAIL.COM</span>
          </div>

          <h1 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px' }}>
            Administrator Clearance Required
          </h1>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.55, color: '#94a3b8', margin: '0 0 24px' }}>
            The Security Command Center is restricted to the authenticated NAEN Studios owner account. Sign in with the owner account to continue.
          </p>
          <button
            type="button"
            onClick={() => {
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
            }}
            className="button button-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}
          >
            <LogIn size={16} />
            Sign in as administrator
          </button>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>← Return to Student Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
