import React from 'react';
import { useChallenges } from '../context/ChallengeContext';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const { activeProfile } = useChallenges() || {};
  const navigate = useNavigate();

  // Check if the user's email is exactly naenstudios@gmail.com
  const isAdmin = activeProfile?.email === 'naenstudios@gmail.com';

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        color: '#94a3b8',
        backgroundColor: '#020617'
      }}>
        <ShieldAlert size={64} style={{ color: '#ef4444', marginBottom: '1.5rem' }} />
        <h1 style={{ color: '#f8fafc', fontSize: '2rem', marginBottom: '1rem' }}>Restricted Access</h1>
        <p style={{ maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem' }}>
          This area is restricted to platform administrators only. You do not have the required permissions to view this content.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.35) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.55)',
            color: '#38bdf8',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.5) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.35) 100%)';
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return children;
}
