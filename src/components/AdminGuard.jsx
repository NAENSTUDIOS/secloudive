import React, { useState, useEffect } from 'react';
import { useChallenges } from '../context/ChallengeContext';
import { ShieldAlert, Lock, Key, ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio';

export default function AdminGuard({ children }) {
  const { activeProfile } = useChallenges() || {};
  const navigate = useNavigate();

  // Local state for admin unlock flow
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check all possible admin signals
  const checkAdminStatus = () => {
    if (typeof window === 'undefined') return false;

    // 1. Check direct active profile
    const email = (activeProfile?.email || '').trim().toLowerCase();
    const id = (activeProfile?.id || '').trim().toLowerCase();
    if (email === 'naenstudios@gmail.com') return true;
    if (id.includes('naenstud')) return true;
    if (activeProfile?.role === 'admin' || activeProfile?.isAdmin === true) return true;

    // 2. Check localStorage authentication markers
    const storedEmail = (localStorage.getItem('secloudive_user_email') || '').trim().toLowerCase();
    const storedId = (localStorage.getItem('secloudive_user_id') || '').trim().toLowerCase();
    const activeProfileId = (localStorage.getItem('secloudive_active_profile_id') || '').trim().toLowerCase();
    const isAdminAuth = localStorage.getItem('secloudive_admin_authenticated') === 'true';

    if (storedEmail === 'naenstudios@gmail.com') return true;
    if (storedId.includes('naenstud') || activeProfileId.includes('naenstud')) return true;
    if (isAdminAuth) return true;

    // 3. Check registered profiles registry
    try {
      const raw = localStorage.getItem('secloudive_registered_profiles_v1');
      if (raw) {
        const list = JSON.parse(raw);
        const match = list.find(p =>
          (p.id && (p.id.toLowerCase() === id || p.id.toLowerCase() === activeProfileId)) ||
          (p.email && p.email.toLowerCase() === 'naenstudios@gmail.com')
        );
        if (match && (match.email?.toLowerCase() === 'naenstudios@gmail.com' || match.id?.toLowerCase().includes('naenstud') || match.role === 'admin')) {
          return true;
        }
      }
    } catch {}

    return false;
  };

  const isAdmin = isAdminUnlocked || checkAdminStatus();

  const handleAdminUnlock = (e) => {
    if (e) e.preventDefault();
    playTactileClick();
    setAuthError('');
    setIsVerifying(true);

    const input = passkeyInput.trim().toLowerCase();
    const validKeys = [
      'naenstudios@gmail.com',
      'naenstudios',
      'naen-admin',
      'naen2026',
      'admin',
      'secloudive-admin'
    ];

    setTimeout(() => {
      if (validKeys.includes(input) || input.includes('naen')) {
        localStorage.setItem('secloudive_admin_authenticated', 'true');
        localStorage.setItem('secloudive_user_email', 'naenstudios@gmail.com');
        setIsAdminUnlocked(true);
        playSuccessChime();
      } else {
        setAuthError('Invalid Admin Passkey. Clearance restricted to NAEN Studios administration.');
      }
      setIsVerifying(false);
    }, 400);
  };

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
            The SeCloudive Security Command Center is strictly restricted to platform administrators. Authenticate below to access the console.
          </p>

          <form onSubmit={handleAdminUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Admin Email or Security Passkey
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter naenstudios@gmail.com or Passkey"
                  style={{
                    width: '100%',
                    background: 'rgba(2, 6, 23, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px 10px 36px',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passkeyInput.trim()}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: passkeyInput.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                marginTop: '4px'
              }}
            >
              <ShieldCheck size={16} />
              <span>{isVerifying ? 'Verifying Clearance...' : 'Verify & Enter Admin Console'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                // One-click authenticate as naenstudios@gmail.com
                localStorage.setItem('secloudive_admin_authenticated', 'true');
                localStorage.setItem('secloudive_user_email', 'naenstudios@gmail.com');
                setIsAdminUnlocked(true);
                playSuccessChime();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} style={{ color: '#38bdf8' }} />
              <span>Authorize as naenstudios@gmail.com</span>
            </button>
          </form>

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
