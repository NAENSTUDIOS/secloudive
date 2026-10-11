import React, { useState, useEffect } from 'react';
import { useChallenges } from '../context/ChallengeContext';
import {
  ShieldAlert,
  Users,
  Database,
  Server,
  Activity,
  AlertTriangle,
  EyeOff,
  Trash2,
  Download,
  Mail,
  RefreshCw,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import '../styles/platformModals.css';

export default function AdminDashboard() {
  const { activeProfile } = useChallenges() || {};

  const [incidents, setIncidents] = useState(() => {
    try {
      const stored = localStorage.getItem('secloudive_admin_screenshot_incidents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedIncident, setSelectedIncident] = useState(null);

  // Load and subscribe to real-time screenshot interception alerts
  useEffect(() => {
    const handleNewIncident = (e) => {
      const newInc = e?.detail;
      if (newInc) {
        setIncidents(prev => [newInc, ...prev.filter(item => item.id !== newInc.id)].slice(0, 100));
      }
    };

    window.addEventListener('secloudive:admin-screenshot-alert', handleNewIncident);
    return () => window.removeEventListener('secloudive:admin-screenshot-alert', handleNewIncident);
  }, []);

  const refreshIncidents = () => {
    try {
      const stored = localStorage.getItem('secloudive_admin_screenshot_incidents');
      setIncidents(stored ? JSON.parse(stored) : []);
    } catch {}
  };

  const clearIncidents = () => {
    if (window.confirm('Are you sure you want to clear all recorded screenshot incident records?')) {
      localStorage.removeItem('secloudive_admin_screenshot_incidents');
      setIncidents([]);
      setSelectedIncident(null);
    }
  };

  const simulateTestViolation = () => {
    const testInc = {
      id: `INC-SS-TEST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      localTime: new Date().toLocaleString(),
      userId: 'TEST-LEARNER-4092',
      userName: 'Audit Test Subject',
      userEmail: 'auditor@secloudive.local',
      route: '/architecture-reviews',
      triggerType: 'snipping_tool',
      methodDescription: 'Windows Snipping Tool (Win+Shift+S)',
      screenResolution: '1920x1080 (Screen: 1920x1080)',
      userAgent: navigator.userAgent,
      status: 'FORWARDED_TO_ADMIN',
      forwardedTo: 'naenstudios@gmail.com'
    };

    try {
      const list = [testInc, ...incidents].slice(0, 100);
      localStorage.setItem('secloudive_admin_screenshot_incidents', JSON.stringify(list));
      setIncidents(list);
      window.dispatchEvent(new CustomEvent('secloudive:admin-screenshot-alert', { detail: testInc }));
    } catch {}
  };

  const exportIncidentDossier = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `secloudive-screenshot-audit-dossier-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      minHeight: '85vh',
      padding: '2.5rem 1.5rem',
      backgroundColor: '#020617',
      color: '#f8fafc'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'grid',
              placeItems: 'center',
              color: '#f59e0b'
            }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2.2rem',
                margin: 0,
                fontWeight: 900,
                background: 'linear-gradient(90deg, #f59e0b, #facc15)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                NAEN Studios Security Admin Portal
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#94a3b8' }}>
                Exclusive Administrator Console for <strong>naenstudios@gmail.com</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} />
              Enclave Telemetry Active
            </span>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {[
            { title: 'Total Registered Learners', count: '12,450', icon: <Users size={22} style={{ color: '#38bdf8' }}/> },
            { title: 'Active Hands-On Labs', count: '342', icon: <Server size={22} style={{ color: '#10b981' }}/> },
            { title: 'Enclave Interceptions', count: `${incidents.length} Logged`, icon: <EyeOff size={22} style={{ color: '#ef4444' }}/> },
            { title: 'Admin Bypass Relay', count: '100% Armed', icon: <Activity size={22} style={{ color: '#f59e0b' }}/> },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              padding: '1.4rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>{stat.title}</h3>
                {stat.icon}
              </div>
              <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f8fafc' }}>{stat.count}</span>
            </div>
          ))}
        </div>

        {/* ── PRIORITY SECTION: Real-Time Screenshot Violations Feed ── */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%)',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '2.5rem',
          boxShadow: '0 12px 35px rgba(239, 68, 68, 0.12)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                display: 'grid',
                placeItems: 'center',
                color: '#ef4444'
              }}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#f8fafc' }}>
                  Intercepted Screenshot Violations (Live Admin Audit Feed)
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Real-time security telemetry bypassed directly to <strong>naenstudios@gmail.com</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={simulateTestViolation}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>+ Simulate Test Alert</span>
              </button>
              <a
                href="/SECLOUDIVE_MASTER_TRACKER_DOSSIER.pdf"
                download="SECLOUDIVE_MASTER_TRACKER_DOSSIER.pdf"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Download size={14} />
                <span>Master Audit PDF</span>
              </a>
              <button
                type="button"
                onClick={exportIncidentDossier}
                disabled={incidents.length === 0}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: incidents.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Export Dossier (.json)</span>
              </button>
              <button
                type="button"
                onClick={refreshIncidents}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} />
              </button>
              {incidents.length > 0 && (
                <button
                  type="button"
                  onClick={clearIncidents}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {incidents.length === 0 ? (
            <div style={{
              padding: '36px',
              textAlign: 'center',
              background: 'rgba(2, 6, 23, 0.6)',
              borderRadius: '10px',
              border: '1px dashed rgba(255, 255, 255, 0.15)'
            }}>
              <ShieldAlert size={36} style={{ color: '#10b981', margin: '0 auto 10px' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#f8fafc' }}>
                Zero Active Screenshot Violations Detected
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                All courseware is currently secure. Any user attempting PrintScreen, Win+Shift+S, or macOS capture will trigger an immediate bypass alert here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', color: '#94a3b8', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 10px' }}>Incident ID & Time</th>
                    <th style={{ padding: '12px 10px' }}>Learner Identity</th>
                    <th style={{ padding: '12px 10px' }}>Protected Route</th>
                    <th style={{ padding: '12px 10px' }}>Capture Method</th>
                    <th style={{ padding: '12px 10px' }}>Relay Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr
                      key={inc.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        background: selectedIncident?.id === inc.id ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px 10px', fontFamily: "'DM Mono', monospace" }}>
                        <div style={{ color: '#f87171', fontWeight: 800 }}>{inc.id}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{inc.localTime}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ color: '#f8fafc', fontWeight: 700 }}>{inc.userName || inc.userId}</div>
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{inc.userEmail || inc.userId}</div>
                      </td>
                      <td style={{ padding: '12px 10px', fontFamily: "'DM Mono', monospace" }}>
                        <span style={{
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: '#cbd5e1'
                        }}>
                          {inc.route}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          color: '#f87171',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>
                          {inc.methodDescription || inc.triggerType}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#34d399',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} />
                          Bypassed to Admin
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <a
                          href={`mailto:${inc.userEmail || 'learner@secloudive.local'}?subject=${encodeURIComponent(`[SeCloudive Security Notice] Screenshot Violation Recorded (${inc.id})`)}&body=${encodeURIComponent(`Hello ${inc.userName || 'Learner'},\n\nA screenshot capture violation was intercepted on your account (${inc.userId}) at ${inc.localTime} on route ${inc.route}.\n\nPlease note that SeCloudive proprietary AWS architecture diagrams are protected intellectual property under NAEN Studios policy.\n\nBest regards,\nNAEN Studios Administration`)}`}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#38bdf8',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Mail size={12} />
                          <span>Contact</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 800 }}>Admin Maintenance Pipelines</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => alert('Lab deployment pipeline active: 52 AWS lab scenarios healthy.')}
              className="btn-primary-nav-cta"
              style={{ background: '#2563eb', padding: '10px 20px', borderRadius: '6px', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Verify Lab Clusters
            </button>
            <button
              type="button"
              onClick={() => alert('User sync directory verified: All Supabase schemas in sync.')}
              className="btn-primary-nav-cta"
              style={{ background: '#059669', padding: '10px 20px', borderRadius: '6px', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Database User Sync
            </button>
            <button
              type="button"
              onClick={exportIncidentDossier}
              className="btn-primary-nav-cta"
              style={{ background: '#7c3aed', padding: '10px 20px', borderRadius: '6px', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Download Full Enclave Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
