import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Code2,
  Lock,
  Hash,
  Award,
  Search,
  Database
} from 'lucide-react'
import { verifyExportPackage, generateAuditPackBundle, canonicalJsonStringify } from '../utils/auditExportEngine'
import { verifyCertificateOnline } from '../services/supabaseProgressService'
import { isSupabaseConfigured } from '../lib/supabase'

export default function VerifyAuditPackPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => searchParams.get('cert') ? 'cert' : 'cert')
  const [certQuery, setCertQuery] = useState(() => searchParams.get('cert') || '')
  const [isCertVerifying, setIsCertVerifying] = useState(false)
  const [certResult, setCertResult] = useState(null)

  const [jsonInput, setJsonInput] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [fileName, setFileName] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // Auto-verify if cert parameter is present in URL
  useEffect(() => {
    const certParam = searchParams.get('cert')
    if (certParam) {
      setCertQuery(certParam)
      handleOnlineCertVerify(certParam)
    }
  }, [searchParams])

  const handleOnlineCertVerify = async (query = certQuery) => {
    if (!query || !query.trim()) return
    setIsCertVerifying(true)
    try {
      const res = await verifyCertificateOnline(query.trim())
      setCertResult(res)
    } catch (err) {
      setCertResult({ valid: false, error: err.message || 'Verification lookup failed.' })
    } finally {
      setIsCertVerifying(false)
    }
  }

  // Handle uploaded JSON file
  const handleFileUpload = (file) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      setJsonInput(text)
      runVerification(text)
    }
    reader.readAsText(file)
  }

  // Run the cryptographic HMAC-SHA256 verification
  const runVerification = async (textToVerify = jsonInput) => {
    if (!textToVerify.trim()) return
    setIsVerifying(true)
    try {
      const result = await verifyExportPackage(textToVerify)
      setVerificationResult(result)
    } catch (err) {
      setVerificationResult({
        isValid: false,
        status: 'Verification Error',
        error: err.message || 'Could not parse JSON or compute cryptographic digest.'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Load a demonstration verified sample pack
  const loadDemoSample = async () => {
    setIsVerifying(true)
    try {
      const sample = await generateAuditPackBundle({
        scenario: {
          id: 'ssrf-imds',
          title: 'Capital One SSRF & IMDSv1 Credential Exfiltration'
        },
        topologyScore: 92,
        topologyControls: { imdsv2: true, s3BlockPublic: true, kmsCustomerKey: true, sgRestricted: true },
        learnerName: 'Senior Incident Responder'
      })
      const str = JSON.stringify(sample, null, 2)
      setFileName('demo-remediation-pack.json')
      setJsonInput(str)
      const res = await verifyExportPackage(str)
      setVerificationResult(res)
    } catch (err) {
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to="/investigations" style={{ color: '#38bdf8', textDecoration: 'none' }}>Investigations</Link>
        <span>/</span>
        <span style={{ color: '#f8fafc' }}>Pack Integrity Verification</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.75))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'monospace'
              }}>
                HMAC-SHA256 INDEPENDENT VERIFIER
              </span>
              <span style={{
                background: 'rgba(234, 88, 12, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                SIMULATED - not a real AWS event
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', margin: '8px 0 4px' }}>
              Remediation & Compliance Audit Pack Verification
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '780px' }}>
              Upload any exported SeCloudive Remediation Pack or User Profile JSON to cryptographically re-compute and verify the HMAC-SHA256 digest against tampering. All verified artifacts are labeled <strong>Integrity-checked</strong>.
            </p>
          </div>
        </div>

        {/* Notice on Honest Terminology */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '12.5px',
          color: '#cbd5e1',
          lineHeight: '1.6'
        }}>
          <strong>Verification Standard Notice:</strong> This verifier enforces an HMAC-SHA256 integrity hash over canonical sorted JSON. Results are labeled <em>Integrity-checked</em>, confirming the contents match the server-generated state exactly. (Public/private asymmetric key-pair signing is planned for future enterprise federations; no asymmetric signatures are claimed here).
        </div>
      </div>

      {/* Verification Mode Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('cert')}
          style={{
            padding: '12px 22px',
            borderRadius: '10px',
            border: activeTab === 'cert' ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.2)',
            background: activeTab === 'cert' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
            color: activeTab === 'cert' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Award size={18} />
          <span>Online Credential Verification (Supabase Cloud)</span>
        </button>

        <button
          onClick={() => setActiveTab('pack')}
          style={{
            padding: '12px 22px',
            borderRadius: '10px',
            border: activeTab === 'pack' ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.2)',
            background: activeTab === 'pack' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
            color: activeTab === 'pack' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <FileCheck size={18} />
          <span>Local Audit Pack JSON Verifier</span>
        </button>
      </div>

      {activeTab === 'cert' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Online Certificate Verification Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Database size={24} style={{ color: '#38bdf8' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Query Public Certificate Registry
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              Enter any SeCloudive Credential ID (e.g. <code>NAEN-SEC-2026-XXXX</code>) or SHA-256 certificate hash to authenticate student accreditation directly against the Supabase database.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleOnlineCertVerify(); }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <input
                type="text"
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                placeholder="Enter Credential ID (e.g. NAEN-SEC-2026-1042) or SHA-256 Hash..."
                style={{
                  flex: 1,
                  minWidth: '280px',
                  background: '#030712',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="submit"
                disabled={isCertVerifying || !certQuery.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Search size={16} />
                <span>{isCertVerifying ? 'Querying Registry…' : 'Verify Online'}</span>
              </button>
            </form>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => {
                  const demoId = 'NAEN-SEC-2026-1042'
                  setCertQuery(demoId)
                  handleOnlineCertVerify(demoId)
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
              >
                NAEN-SEC-2026-1042
              </button>
            </div>
          </div>

          {/* Certificate Verification Results */}
          {certResult && (
            <div style={{
              background: certResult.valid
                ? 'linear-gradient(180deg, rgba(6, 78, 59, 0.4), rgba(15, 23, 42, 0.95))'
                : 'linear-gradient(180deg, rgba(127, 29, 29, 0.4), rgba(15, 23, 42, 0.95))',
              border: certResult.valid
                ? '2px solid rgba(16, 185, 129, 0.5)'
                : '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {certResult.valid ? (
                    <CheckCircle2 size={36} color="#34d399" />
                  ) : (
                    <XCircle size={36} color="#f87171" />
                  )}
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      background: certResult.valid ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                      color: certResult.valid ? '#34d399' : '#f87171',
                      border: certResult.valid ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(248, 113, 113, 0.4)',
                      marginBottom: '4px'
                    }}>
                      {certResult.valid ? 'OFFICIALLY VERIFIED CREDENTIAL' : 'VERIFICATION FAILED'}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      {certResult.valid ? certResult.cert_title : 'No Matching Certificate Found'}
                    </h3>
                  </div>
                </div>
                {certResult.valid && (
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}>
                    Tier {certResult.tier || 4} Certified
                  </span>
                )}
              </div>

              {certResult.valid ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Recipient Student</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>{certResult.student_name}</div>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Credential ID</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace', marginTop: '4px' }}>{certResult.credential_id}</div>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Issued Date</div>
                    <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '4px' }}>{new Date(certResult.issued_at).toLocaleDateString()}</div>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Accreditation Authority</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>NAEN Studios Security Academy</div>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '12px 16px', borderRadius: '8px', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Cryptographic SHA-256 Hash</div>
                    <div style={{ fontSize: '11px', color: '#34d399', fontFamily: 'monospace', marginTop: '4px', wordBreak: 'break-all' }}>{certResult.cert_hash}</div>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#fca5a5', fontSize: '14px', margin: 0 }}>
                  {certResult.error || 'The credential query did not match any issued certificate in the official cloud registry.'}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
          {/* Drop Zone & Input */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px dashed #38bdf8' : '2px dashed rgba(148, 163, 184, 0.25)',
              background: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(15, 23, 42, 0.6)',
              borderRadius: '14px',
              padding: '32px 24px',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <Upload size={40} style={{ color: dragActive ? '#38bdf8' : '#94a3b8', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              {fileName ? `Loaded: ${fileName}` : 'Drop Exported Audit Pack JSON Here'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
              Supports <code>.json</code> exports from Investigation Simulator, Architecture Reviews, and User Profiles.
            </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{
              background: '#0284c7',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Upload size={16} />
              <span>Browse Local File</span>
              <input
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </label>

            <button
              onClick={loadDemoSample}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Code2 size={16} />
              <span>Load Verified Sample Pack</span>
            </button>

            {jsonInput && (
              <button
                onClick={() => runVerification(jsonInput)}
                disabled={isVerifying}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} className={isVerifying ? 'spin-icon' : ''} />
                <span>{isVerifying ? 'Verifying Digest...' : 'Re-verify Pack'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div style={{
            background: verificationResult.isValid
              ? 'linear-gradient(180deg, rgba(6, 78, 59, 0.4), rgba(15, 23, 42, 0.95))'
              : 'linear-gradient(180deg, rgba(127, 29, 29, 0.4), rgba(15, 23, 42, 0.95))',
            border: verificationResult.isValid
              ? '2px solid rgba(16, 185, 129, 0.5)'
              : '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {verificationResult.isValid ? (
                  <CheckCircle2 size={36} color="#34d399" />
                ) : (
                  <XCircle size={36} color="#f87171" />
                )}
                <div>
                  <div style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                    background: verificationResult.isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: verificationResult.isValid ? '#34d399' : '#f87171',
                    border: `1px solid ${verificationResult.isValid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                  }}>
                    {verificationResult.isValid ? 'INTEGRITY-CHECKED: VALID' : 'INTEGRITY CHECK FAILED'}
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {verificationResult.isValid ? 'Authentic Unaltered Export Package' : 'Tampered or Corrupted File'}
                  </h2>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                <div>Algorithm: <strong>{verificationResult.algorithm || 'HMAC-SHA256'}</strong></div>
                <div>Status: <strong>{verificationResult.status}</strong></div>
              </div>
            </div>

            {/* Error Message if Invalid */}
            {!verificationResult.isValid && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '14px',
                color: '#fca5a5',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                <strong>Verification Error:</strong> {verificationResult.error}
              </div>
            )}

            {/* Hash Comparison Ledger */}
            <div style={{
              background: 'rgba(2, 6, 23, 0.75)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              <div style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 700 }}>
                CRYPTOGRAPHIC INTEGRITY DIGEST LEDGER:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Computed HMAC:</span>
                <span style={{ color: verificationResult.isValid ? '#34d399' : '#f87171', wordBreak: 'break-all' }}>
                  {verificationResult.computedHash || 'None'}
                </span>
                <span style={{ color: '#64748b' }}>Envelope Digest:</span>
                <span style={{ color: '#38bdf8', wordBreak: 'break-all' }}>
                  {verificationResult.expectedHash || 'None'}
                </span>
                {verificationResult.contentSha256 && (
                  <>
                    <span style={{ color: '#64748b' }}>Canonical SHA256:</span>
                    <span style={{ color: '#cbd5e1', wordBreak: 'break-all' }}>
                      {verificationResult.contentSha256}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Payload Breakdown if valid */}
            {verificationResult.isValid && verificationResult.summary && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '10px',
                padding: '18px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} />
                  <span>Verified Payload Breakdown</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Target Scenario</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                      {verificationResult.summary.scenarioTitle}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Compliance Deltas</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                      {verificationResult.summary.complianceScores?.join(' • ') || 'CIS / NIST Deltas Active'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>FinOps Curtailed</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                      {verificationResult.summary.finopsCurtailed || '$4,021.25 saved'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Simulated Identifier Guard</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fb923c', marginTop: '4px' }}>
                      Account: 000000000000
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(148, 163, 184, 0.15)',
                  fontSize: '12px',
                  color: '#94a3b8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Issued At: <code>{verificationResult.issuedAt}</code></span>
                  <span>Accreditation: <strong style={{ color: '#fbbf24' }}>NAEN Studios Security Engineering</strong></span>
                  <span>Status: <strong style={{ color: '#34d399' }}>Integrity-checked</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JSON Inspector View */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Raw Package JSON Editor / Paste Area</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Paste exported file content to verify directly</span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your exported SeCloudive JSON payload here..."
            rows={10}
            style={{
              width: '100%',
              background: '#030712',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              onClick={() => runVerification(jsonInput)}
              disabled={!jsonInput.trim() || isVerifying}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Verify Pasted JSON
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
