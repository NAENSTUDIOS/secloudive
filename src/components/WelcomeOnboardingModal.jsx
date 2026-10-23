// ==============================================================================
// SeCloudive Dedicated AWS Cloud Security Learning Academy
// Onboarding, Educational Tour, Terms/Cookies, Sign In & Diagnostic Placement
// 100% AWS Cloud Security Curriculum Architecture
// ==============================================================================

import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Cookie,
  UserCheck,
  Brain,
  Award,
  BookOpen,
  Terminal,
  Zap,
  Check,
  X,
  Radio,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Cloud,
  Layers,
  GraduationCap
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import { 
  parseGoogleCredential, 
  generateUniqueUserId, 
  registerUniqueProfile, 
  loginWithUserId 
} from '../services/userSyncManager'
import { playTactileClick } from '../utils/cyberMotionAudio'

// 5-Question AWS Security Placement Diagnostic Test
const AWS_DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1_iam',
    domain: 'AWS Identity & Access Management (IAM)',
    question: 'What is the most secure method for an EC2 workload to call AWS APIs (like DynamoDB or S3)?',
    options: [
      { text: 'Hardcode AWS Access Key ID and Secret Access Key in application config files', correct: false },
      { text: 'Attach an IAM Role with an Instance Profile delivering short-lived STS credentials', correct: true },
      { text: 'Store credentials in a public S3 bucket and fetch via curl', correct: false },
      { text: 'Use AWS Root Account credentials for maximum operational access', correct: false }
    ],
    explanation: 'Attaching an IAM Role with an Instance Profile leverages AWS STS to automatically deliver temporary, rotating credentials to the EC2 metadata service without storing hardcoded secrets.'
  },
  {
    id: 'q2_s3',
    domain: 'AWS S3 & Data Protection',
    question: 'How do you globally prevent any S3 bucket in an AWS account from being made public?',
    options: [
      { text: 'Delete all IAM user groups', correct: false },
      { text: 'Enable S3 Block Public Access at the AWS Account level', correct: true },
      { text: 'Restrict EC2 Security Group inbound rules', correct: false },
      { text: 'Enable S3 Transfer Acceleration', correct: false }
    ],
    explanation: 'S3 Block Public Access at the account level overrides any individual bucket or object ACL, guaranteeing account-wide immunity against public S3 data leaks.'
  },
  {
    id: 'q3_vpc',
    domain: 'AWS VPC & Network Defense',
    question: 'What is the fundamental behavioral difference between an AWS Security Group and a Network ACL (NACL)?',
    options: [
      { text: 'Security Groups are stateless; NACLs are stateful', correct: false },
      { text: 'Security Groups are stateful (return traffic is automatically allowed); NACLs are stateless', correct: true },
      { text: 'NACLs only inspect IPv6 traffic', correct: false },
      { text: 'Security Groups cannot filter outbound traffic', correct: false }
    ],
    explanation: 'Security Groups operate at the instance level and are stateful—allowed inbound traffic automatically permits the outbound response. NACLs operate at the subnet boundary and evaluate rule numbers in order statelessly.'
  },
  {
    id: 'q4_cloudtrail',
    domain: 'AWS Threat Detection & Audit Logging',
    question: 'Which AWS service is the definitive source of truth for recording management and data API calls account-wide?',
    options: [
      { text: 'AWS CloudWatch Synthetics', correct: false },
      { text: 'AWS CloudTrail (Multi-Region Trail with Log File Validation)', correct: true },
      { text: 'Amazon Route 53 Traffic Flow', correct: false },
      { text: 'AWS Auto Scaling policies', correct: false }
    ],
    explanation: 'AWS CloudTrail continuously records all AWS API events, SDK requests, and console logins, making it the bedrock service for security audits, forensic timelines, and SOC analysis.'
  },
  {
    id: 'q5_imdsv2',
    domain: 'AWS EC2 & Metadata Defense',
    question: 'Why does IMDSv2 strictly require a session-oriented PUT request with a token instead of a simple GET request?',
    options: [
      { text: 'IMDSv2 costs less per request', correct: false },
      { text: 'It requires a session token via PUT with a hop limit of 1 to neutralize SSRF credential exfiltration', correct: true },
      { text: 'IMDSv2 permanently disables Linux bash', correct: false },
      { text: 'IMDSv2 automatically encrypts the root EBS volume', correct: false }
    ],
    explanation: 'IMDSv2 requires an initial PUT request with a `X-aws-ec2-metadata-token-ttl-seconds` header to acquire a session token. Web application Server-Side Request Forgery (SSRF) vulnerabilities typically cannot forge arbitrary PUT headers or traverse hop limits.'
  }
]

// Dynamic Time-of-Day Salutation & Encouragement Generator
export function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      period: 'morning',
      salutation: 'Good Morning ☀️',
      headline: 'Rise & Engineer: Today Is Your Day to Master AWS Cloud Defense',
      subtext: 'Start your morning with purposeful momentum. Master AWS Zero-Trust architectures, configure IAM boundary guardrails, and elevate your technical authority.',
      badgeText: 'MORNING DEFENSE SESSION',
      badgeColor: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.2)'
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      period: 'afternoon',
      salutation: 'Good Afternoon 🌤️',
      headline: 'Power Up Your Afternoon With High-Impact Cloud Mastery',
      subtext: 'Turn your afternoon focus into tangible engineering authority. Investigate live SOC threats, test defenses in realistic AWS environments, and prepare for senior roles.',
      badgeText: 'AFTERNOON POWER DRIVE',
      badgeColor: '#38bdf8',
      accentGlow: 'rgba(56, 189, 248, 0.2)'
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      period: 'evening',
      salutation: 'Good Evening 🌆',
      headline: 'Elevate Your Security Architecture Horizons Tonight',
      subtext: 'An exceptional evening to expand your capabilities. Dissect enterprise AWS attack paths, audit CloudTrail forensics, and build deep architectural confidence.',
      badgeText: 'EVENING ARCHITECT DRILL',
      badgeColor: '#818cf8',
      accentGlow: 'rgba(129, 140, 248, 0.2)'
    }
  } else {
    return {
      period: 'night',
      salutation: 'Good Night 🌙',
      headline: 'Deep Night Focus: Forge Unbreakable Cloud Security Defenses',
      subtext: 'Nighttime is when true architectural mastery is forged in quiet focus. Master AWS threat detection, dissect incident vectors, and sharpen your defensive instincts.',
      badgeText: 'NIGHT STUDY SESSION',
      badgeColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.2)'
    }
  }
}

export default function WelcomeOnboardingModal({ isFullPageGate = false, onComplete = null } = {}) {
  const greeting = getTimeOfDayGreeting()
  const hasEverCompleted = (() => {
    try {
      const strictCompleted = localStorage.getItem('secloudive_welcome_user_strict_enforced_v5') === 'true'
      const legacyCompleted = localStorage.getItem('secloudive_onboarding_completed_v1') === 'true'
      return strictCompleted && legacyCompleted
    } catch {
      return false
    }
  })()

  const [isOpen, setIsOpen] = useState(isFullPageGate || !hasEverCompleted)
  const [isMandatory, setIsMandatory] = useState(isFullPageGate || !hasEverCompleted)

  // 6 Steps: 'welcome' -> 'explains' -> 'terms_cookies' -> 'login' -> 'diagnostic_test' -> 'ready'
  const [currentStep, setCurrentStep] = useState('welcome')

  // Terms & Cookies state
  const [termsAgreed, setTermsAgreed] = useState(true)
  const [cookiesAgreed, setCookiesAgreed] = useState(true)

  // Auth fields (for Step 4)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentName, setStudentName] = useState('')
  const [authError, setAuthError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Diagnostic Test state (for Step 5)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [testCompleted, setTestCompleted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [recommendedTier, setRecommendedTier] = useState('Tier 1: Linux & AWS Security Foundations')

  const {
    activeProfile,
    loginWithGoogle,
    switchToGuestMode,
    registerUniqueProfile
  } = useChallenges() || {}
  const auth = useAuth()

  // Initial gate check
  useEffect(() => {
    const strictCompleted = localStorage.getItem('secloudive_welcome_user_strict_enforced_v5') === 'true'
    const legacyCompleted = localStorage.getItem('secloudive_onboarding_completed_v1') === 'true'
    const hasCompleted = strictCompleted && legacyCompleted
    if (!hasCompleted || isFullPageGate) {
      setIsOpen(true)
      setIsMandatory(true)
    }
  }, [isFullPageGate])

  // Listen for manual trigger from navbar or command palette
  useEffect(() => {
    const handleOpen = (e) => {
      const targetStep = e?.detail?.step || 'welcome'
      setCurrentStep(targetStep)
      setAuthError(null)
      setIsMandatory(false)
      setIsOpen(true)
      playTactileClick()
    }
    window.addEventListener('open-welcome-modal', handleOpen)
    return () => window.removeEventListener('open-welcome-modal', handleOpen)
  }, [])

  // Persist completion and close modal
  const handleFinalLaunch = () => {
    playTactileClick()
    try {
      sessionStorage.setItem('secloudive_session_unlocked_v1', 'true')
      localStorage.setItem('secloudive_welcome_user_strict_enforced_v5', 'true')
      localStorage.setItem('secloudive_welcome_dismissed', 'true')
      localStorage.setItem('secloudive_onboarding_completed_v1', 'true')
      localStorage.setItem('secloudive_terms_accepted_v1', 'true')
      localStorage.setItem('secloudive_cookies_accepted_v1', 'true')
      localStorage.setItem('secloudive_terms_accepted_at', new Date().toISOString())
      localStorage.setItem('secloudive_diagnostic_score', testScore.toString())
      localStorage.setItem('secloudive_diagnostic_tier', recommendedTier)
    } catch {}

    onComplete?.()
    window.dispatchEvent(new CustomEvent('secloudive-onboarding-completed'))
    setIsOpen(false)
  }

  // Handle Question Answer Selection
  const handleSelectAnswer = (qIdx, optionIdx) => {
    playTactileClick()
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optionIdx
    }))
  }

  // Complete Diagnostic Quiz
  const handleFinishDiagnostic = () => {
    playTactileClick()
    let score = 0
    AWS_DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const selectedOptionIdx = selectedAnswers[idx]
      if (selectedOptionIdx !== undefined && q.options[selectedOptionIdx]?.correct) {
        score += 1
      }
    })
    setTestScore(score)
    setTestCompleted(true)

    // Recommended Path logic
    if (score <= 3) {
      setRecommendedTier('Tier 1: Linux & AWS Security Foundations')
    } else {
      setRecommendedTier('Tier 2 & 3: Advanced AWS Defense, Hands-On Labs & Capstone Projects')
    }
  }

  // Handle Google Login inside Onboarding Gate
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsProcessing(true)
    setAuthError(null)
    playTactileClick()

    try {
      if (!credentialResponse?.credential) {
        setAuthError('Google did not return a valid credential. Please try again or use email sign in.')
        return
      }

      if (auth?.signInWithGoogle) {
        const res = await auth.signInWithGoogle(credentialResponse.credential)
        if (res?.success) {
          handleFinalLaunch()
          return
        }
        setAuthError(res?.error || 'Google sign in could not be completed. Please try again.')
        return
      }

      const decoded = parseGoogleCredential(credentialResponse.credential)
      if (decoded && loginWithGoogle) {
        const res = loginWithGoogle(decoded)
        if (res?.success) {
          handleFinalLaunch()
          return
        }
      }
      setAuthError('Google sign in is unavailable right now. Please use email sign in or continue as guest.')
    } catch (err) {
      setAuthError(err?.message || 'Google sign in could not be completed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Email Auth inside Onboarding Gate
  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setIsProcessing(true)
    playTactileClick()

    try {
      if (!email.trim() || !password) {
        setAuthError('Please enter email and password.')
        setIsProcessing(false)
        return
      }

      if (authMode === 'login') {
        if (auth?.signInWithEmail) {
          const res = await auth.signInWithEmail(email.trim(), password)
          if (res?.success) {
            handleFinalLaunch()
            return
          }
          setAuthError(res?.error || 'Email sign in failed. Check your credentials and try again.')
          return
        }
        setAuthError('Email sign in is unavailable right now. Please use Google sign in or continue as guest.')
      } else {
        if (password.length < 6) {
          setAuthError('Use a password with at least 6 characters.')
          return
        }

        if (auth?.signUpWithEmail) {
          const res = await auth.signUpWithEmail(email.trim(), password, {
            name: studentName.trim() || email.split('@')[0],
            role: 'Aspiring AWS Cloud Security Engineer'
          })
          if (res?.success) {
            handleFinalLaunch()
            return
          }
          setAuthError(res?.error || 'Account creation failed. Please try again.')
          return
        }

        const autoId = `SEC-STU-${Math.floor(1000 + Math.random() * 9000)}`
        const regRes = registerUniqueProfile({
          userId: autoId,
          email: email.trim(),
          name: studentName.trim() || email.split('@')[0],
          role: 'Aspiring AWS Cloud Security Engineer',
          migrateGuestData: true
        })
        if (regRes?.success) {
          handleFinalLaunch()
        } else {
          setAuthError(regRes?.error || 'Account creation failed. Please try again.')
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Immediate Guest Access Launch
  const handleContinueAsGuest = () => {
    playTactileClick()
    if (switchToGuestMode) switchToGuestMode()
    handleFinalLaunch()
  }

  if (!isOpen) return null

  return (
    <div
      className="welcome-onboarding-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="welcome-onboarding-card"
        style={{
          width: '100%',
          maxWidth: '860px',
          background: 'linear-gradient(180deg, #0b1329 0%, #030712 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '18px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          position: 'relative'
        }}
      >
        {/* Top Glowing AWS Accent Line */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #ff9900 0%, #f59e0b 50%, #38bdf8 100%)',
          boxShadow: '0 0 15px rgba(255, 153, 0, 0.6)'
        }} />

        {/* Modal Header */}
        <div className="welcome-header-compact" style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.85)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
              border: '1px solid rgba(255, 153, 0, 0.5)',
              display: 'grid',
              placeItems: 'center',
              color: '#ff9900'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  SeCloudive • AWS Cloud Security Academy
                </h2>
                <span style={{
                  background: 'rgba(255, 153, 0, 0.15)',
                  border: '1px solid rgba(255, 153, 0, 0.4)',
                  color: '#fbbf24',
                  borderRadius: '9999px',
                  padding: '1px 7px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  AWS CLOUD SECURITY ACADEMY
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
                The Complete Educational Pipeline from Linux Foundations to Enterprise AWS Defense
              </p>
            </div>
          </div>

          {/* Step Breadcrumb Indicators & Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['welcome', 'explains', 'terms_cookies', 'login', 'diagnostic_test', 'ready'].map((s, idx) => (
              <div
                key={s}
                style={{
                  width: currentStep === s ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  background: currentStep === s ? '#ff9900' : 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
            {!isMandatory && (
              <button
                type="button"
                onClick={() => { playTactileClick(); setIsOpen(false); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'grid',
                  placeItems: 'center',
                  marginLeft: '8px'
                }}
                title="Close Orientation Modal"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="welcome-onboarding-scroll welcome-body-compact" style={{ padding: 'clamp(14px, 1.8vh, 20px)', flex: 1, minHeight: 0 }}>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 1: TIME-OF-DAY SALUTATION, ENCOURAGEMENT & ACCESS GATE        */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'welcome' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Dynamic Time-of-Day Salutation & Encouragement Card */}
              <div className="welcome-greeting-banner" style={{
                background: `linear-gradient(135deg, ${greeting.accentGlow} 0%, rgba(15, 23, 42, 0.92) 100%)`,
                border: `1.5px solid ${greeting.badgeColor}66`,
                borderRadius: '14px',
                padding: '12px 18px',
                textAlign: 'center',
                boxShadow: `0 8px 25px ${greeting.accentGlow}`
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: `${greeting.badgeColor}22`,
                  border: `1px solid ${greeting.badgeColor}55`,
                  color: greeting.badgeColor,
                  borderRadius: '9999px',
                  padding: '2px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  marginBottom: '4px'
                }}>
                  <Sparkles size={12} />
                  <span>{greeting.badgeText} • CLOUD SECURITY LEARNING</span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: greeting.badgeColor, marginBottom: '2px' }}>
                  {greeting.salutation}
                </div>

                <h1 className="welcome-greeting-headline" style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.4px',
                  margin: '2px 0 4px',
                  lineHeight: 1.25
                }}>
                  {greeting.headline}
                </h1>
                <p className="welcome-greeting-subtext" style={{
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  maxWidth: '700px',
                  margin: '0 auto 6px',
                  lineHeight: 1.45
                }}>
                  {greeting.subtext}
                </p>

                {/* Motivational Learning Callout */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  color: '#94a3b8'
                }}>
                  <span style={{ color: '#38bdf8' }}>💡 <strong>Encouragement:</strong></span>
                  <span>Mastery in cloud security is built brick by brick. Every lab completed unlocks genuine architectural authority.</span>
                </div>
              </div>

              {/* ── THE STRICT ENTRY ACCESS GATE: Login or Guest ── */}
              <div className="welcome-gate-enclave" style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '14px',
                padding: '16px 18px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#ff9900', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    GET STARTED
                  </span>
                  <h3 style={{ margin: '2px 0 4px', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    Choose how you want to begin learning
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                    Choose an account or continue as a guest. Your learning workspace will open immediately.
                  </p>
                </div>

                {authError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    {authError}
                  </div>
                )}

                {/* Authenticated Profile Quick Resume (if returning user already signed in) */}
                {activeProfile && !activeProfile.isGuest && activeProfile.id !== 'guest' && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.45)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                          Welcome back, {activeProfile.name}!
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Active Student: <code>{activeProfile.id}</code> ({activeProfile.email || 'Cloud Security Student'})
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleFinalLaunch}
                      style={{
                        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                      }}
                    >
                      <span>Continue learning</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* 3 Access Options Grid: Google, Email, and Guest */}
                <div className="welcome-options-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  {/* Option 1: Google 1-Click */}
                  <div className="welcome-option-card" style={{
                    background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(2, 6, 23, 0.7) 100%)',
                    border: '1px solid rgba(255, 153, 0, 0.35)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Sparkles size={15} style={{ color: '#ff9900' }} />
                        <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>Google 1-Click Access</strong>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.35 }}>
                        Instant verification. Auto-creates permanent Student ID & backs up progress to cloud.
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setAuthError('Google sign in could not be completed.')}
                        theme="filled_blue"
                        shape="pill"
                        text="continue_with"
                        size="medium"
                      />
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '6px' }}>
                      ✓ Your learning workspace opens immediately
                    </div>
                  </div>

                  {/* Option 2: Email & Password */}
                  <div className="welcome-option-card" style={{
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>Email & Password</strong>
                        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '4px', padding: '2px' }}>
                          <button
                            type="button"
                            onClick={() => setAuthMode('login')}
                            style={{
                              background: authMode === 'login' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                              color: authMode === 'login' ? '#38bdf8' : '#94a3b8',
                              border: 'none',
                              padding: '2px 5px',
                              borderRadius: '3px',
                              fontSize: '0.66rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            onClick={() => setAuthMode('register')}
                            style={{
                              background: authMode === 'register' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                              color: authMode === 'register' ? '#38bdf8' : '#94a3b8',
                              border: 'none',
                              padding: '2px 5px',
                              borderRadius: '3px',
                              fontSize: '0.66rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Register
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {authMode === 'register' && (
                          <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Student Full Name"
                            style={{
                              padding: '6px 8px',
                              background: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '6px',
                              color: '#f8fafc',
                              fontSize: '0.76rem'
                            }}
                          />
                        )}
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="learner@university.edu"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.76rem'
                          }}
                        />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password (min 6 chars)"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.76rem'
                          }}
                        />
                        <button
                          type="submit"
                          disabled={isProcessing}
                          style={{
                            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '7px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isProcessing ? 'Authenticating...' : (authMode === 'login' ? 'Sign In & Continue' : 'Register & Continue')}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Option 3: Continue as Guest */}
                  <div className="welcome-option-card" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 6, 23, 0.7) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                        <UserCheck size={15} style={{ color: '#10b981' }} />
                        <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>Continue as Guest</strong>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.35 }}>
                        Instant sandbox access. Zero credentials required. Local browser persistence enabled.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleContinueAsGuest}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                      }}
                    >
                      <span>▶ Continue as Guest</span>
                      <ArrowRight size={14} />
                    </button>

                    <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '6px' }}>
                      ✓ Opens your learning workspace immediately
                    </div>
                  </div>
                </div>

                {/* Secondary Discovery Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    onClick={() => { playTactileClick(); setCurrentStep('diagnostic_test'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff9900',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Brain size={14} />
                    <span>Take 5-Question Placement Diagnostic Test →</span>
                  </button>

                  <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>

                  <button
                    type="button"
                    onClick={() => { playTactileClick(); setCurrentStep('explains'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <BookOpen size={14} />
                    <span>Explore 6-Stage AWS Roadmap Tour →</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Academy Pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ color: '#ff9900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={18} />
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>Linux to Cloud Defense</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Zero prerequisites needed. Begin with Linux file permissions, user namespaces, and bash pipelines before configuring AWS IAM and VPC architectures.
                  </p>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} />
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>$0-Safe Real Labs</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Execute hands-on security audits, bucket lock enforcements, and Athena CloudTrail incident forensics in a safe simulator with zero surprise AWS cloud bills.
                  </p>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} />
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>Verified Internships</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Graduate with cryptographic certificate proofs, senior interview STAR answers, and direct eligibility for verified AWS Cloud Security internships.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 2: EXPLAINS (THE 6-STAGE AWS CURRICULUM PIPELINE)             */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'explains' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  How SeCloudive Works: The 6-Stage AWS Defender Pipeline
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Every student progresses through a structured, highly educational roadmap designed by senior AWS security architects. Nothing is wasted; every module directly builds your technical authority.
                </p>
              </div>

              {/* The 6 Stages Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    stage: 'Stage 1',
                    title: 'AWS & Linux Foundations (Tier 1)',
                    desc: 'Master Linux kernel permissions, chmod/chown, bash automation, and core AWS cloud identity models.',
                    color: '#10b981',
                    icon: '🟢'
                  },
                  {
                    stage: 'Stage 2',
                    title: 'AWS Core Defense & Hardening (Tier 2)',
                    desc: 'Engineer Zero-Trust IAM policies, block S3 public leaks, enforce KMS envelope encryption, and isolate VPC networks.',
                    color: '#38bdf8',
                    icon: '🔵'
                  },
                  {
                    stage: 'Stage 3',
                    title: 'Threat Detection & Forensic IR (Tier 3)',
                    desc: 'Deploy Amazon GuardDuty, AWS Security Hub, multi-region CloudTrail, and investigate compromised credentials via Athena SQL.',
                    color: '#ec4899',
                    icon: '🟣'
                  },
                  {
                    stage: 'Stage 4',
                    title: 'Hands-On $0-Cost Safe AWS Labs',
                    desc: 'Apply your theory in simulated terminal environments. Test attack vectors and remediate vulnerabilities with zero credit card risk.',
                    color: '#f59e0b',
                    icon: '🟡'
                  },
                  {
                    stage: 'Stage 5',
                    title: 'Production AWS Capstone Projects',
                    desc: 'Build enterprise-ready Terraform architectures (Multi-tier secure VPCs, EKS cluster hardening, and CI/CD DevSecOps).',
                    color: '#8b5cf6',
                    icon: '🔴'
                  },
                  {
                    stage: 'Stage 6',
                    title: 'Live Internships & Senior Interview Coaching',
                    desc: 'Tackle real employer sprint backlogs, simulate technical senior engineer interviews, and unlock verified internship recommendations.',
                    color: '#ff9900',
                    icon: '🏆'
                  }
                ].map(item => (
                  <div
                    key={item.stage}
                    style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: `1px solid rgba(255, 255, 255, 0.08)`,
                      borderLeft: `4px solid ${item.color}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                        <strong style={{ fontSize: '0.86rem', color: '#f8fafc' }}>{item.stage}: {item.title}</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { playTactileClick(); setCurrentStep('welcome'); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  ← Back to Welcome
                </button>
                <button
                  type="button"
                  onClick={() => { playTactileClick(); setCurrentStep('terms_cookies'); }}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <span>Ethical Terms & Privacy</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 3: ACCEPT TERMS AND COOKIES                                   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'terms_cookies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  Ethical AWS Defense Terms & Progress Storage Agreement
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Because SeCloudive simulates authentic enterprise AWS security environments, every student must commit to responsible defense and agree to progress persistence.
                </p>
              </div>

              {/* Code of Conduct & Terms */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} style={{ color: '#38bdf8' }} />
                  <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>1. Defensive Security Pledge</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  All AWS attack vectors, IMDSv2 inspection, and CloudTrail queries taught on SeCloudive are intended strictly for educational defense, defensive engineering, and authorized testing. You pledge never to use these skills against unauthorized third-party infrastructure.
                </p>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Cookie size={20} style={{ color: '#f59e0b' }} />
                  <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>2. Progress Storage & Cookie Consent</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  SeCloudive uses secure local storage and privacy-friendly session cookies to track your lab progress, save your diagnostic scores, preserve your notes, and synchronize your XP with the cloud. No third-party ad tracking is ever used.
                </p>
              </div>

              {/* Agreement Checkboxes */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: '#f8fafc' }}>
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#ff9900' }}
                  />
                  <span>I agree to the <strong>Ethical Defender Code of Conduct</strong> and <strong>Terms of Service</strong>.</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: '#f8fafc' }}>
                  <input
                    type="checkbox"
                    checked={cookiesAgreed}
                    onChange={(e) => setCookiesAgreed(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#ff9900' }}
                  />
                  <span>I accept <strong>Progress Storage & Learning Cookies</strong> to auto-save my certificates and XP.</span>
                </label>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { playTactileClick(); setCurrentStep('explains'); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  ← Back to Curriculum
                </button>
                <button
                  type="button"
                  disabled={!termsAgreed || !cookiesAgreed}
                  onClick={() => { playTactileClick(); setCurrentStep('login'); }}
                  style={{
                    background: (!termsAgreed || !cookiesAgreed) ? '#475569' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: (!termsAgreed || !cookiesAgreed) ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: (!termsAgreed || !cookiesAgreed) ? 'none' : '0 4px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <span>Accept & Continue to Student Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 4: LOGIN (SIDE-BY-SIDE GOOGLE & EMAIL)                         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  Student Sign In & Cloud Sync
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  One Account = One Permanent Student ID. Choose Google 1-click or Email & Password.
                </p>
              </div>

              {authError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#f87171',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  {authError}
                </div>
              )}

              {/* Side-by-side Dual Authentication */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '18px',
                alignItems: 'stretch'
              }}>
                {/* Left: Google One-Click */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)',
                  border: '1px solid rgba(255, 153, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <Sparkles size={18} style={{ color: '#ff9900' }} />
                      <strong style={{ fontSize: '0.96rem', color: '#f8fafc' }}>Google 1-Click Access</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px' }}>
                      Instant verification. Automatically assigns your permanent Student ID and connects cloud progress.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 16px' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setAuthError('Google sign in could not be completed.')}
                        theme="filled_blue"
                        shape="pill"
                        text="continue_with"
                        size="large"
                      />
                      {auth?.signInWithGoogleOAuth && (
                        <button
                          type="button"
                          onClick={() => auth.signInWithGoogleOAuth(window.location.origin)}
                          style={{ marginTop: '8px', background: 'transparent', border: 0, color: '#7dd3fc', fontSize: '0.72rem', cursor: 'pointer' }}
                        >
                          Use secure browser redirect instead
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>✓ 1 Account = 1 Permanent Student ID</span>
                      <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>✓ Zero passwords to remember</span>
                      <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>✓ Automatic cloud progress backup</span>
                    </div>
                  </div>
                </div>

                {/* Right: Email & Password */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '0.96rem', color: '#f8fafc' }}>Email & Password</strong>
                      <div style={{ display: 'flex', background: 'rgba(2, 6, 23, 0.7)', borderRadius: '6px', padding: '2px' }}>
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          style={{
                            background: authMode === 'login' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                            color: authMode === 'login' ? '#38bdf8' : '#94a3b8',
                            border: 'none',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode('register')}
                          style={{
                            background: authMode === 'register' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                            color: authMode === 'register' ? '#38bdf8' : '#94a3b8',
                            border: 'none',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {authMode === 'register' && (
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Student Full Name (e.g. Alex Rivera)"
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(2, 6, 23, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.8rem'
                          }}
                        />
                      )}
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        style={{
                          padding: '8px 10px',
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.8rem'
                        }}
                      />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min 6 characters)"
                        style={{
                          padding: '8px 10px',
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.8rem'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={isProcessing}
                        style={{
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '9px 14px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isProcessing ? 'Processing...' : (authMode === 'login' ? 'Sign In with Email' : 'Register & Auto-Generate ID')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Guest / Skip Option */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => { playTactileClick(); setCurrentStep('terms_cookies'); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  ← Back to Terms
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick()
                    if (switchToGuestMode) switchToGuestMode()
                    setCurrentStep('diagnostic_test')
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Continue in Guest Mode & Take Diagnostic Test →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 5: DIAGNOSTIC TEST (AWS SECURITY PLACEMENT ASSESSMENT)         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'diagnostic_test' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Brain size={20} style={{ color: '#ff9900' }} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                    AWS Security Diagnostic Placement (5 Questions)
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Whether you are a beginner or experienced cloud practitioner, this quick assessment benchmarks your baseline and customizes your learning tier.
                </p>
              </div>

              {!testCompleted ? (
                /* Questions Flow */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Question Card */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#ff9900', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        Question {currentQuestionIdx + 1} of {AWS_DIAGNOSTIC_QUESTIONS.length} • {AWS_DIAGNOSTIC_QUESTIONS[currentQuestionIdx].domain}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 16px', fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5 }}>
                      {AWS_DIAGNOSTIC_QUESTIONS[currentQuestionIdx].question}
                    </h4>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {AWS_DIAGNOSTIC_QUESTIONS[currentQuestionIdx].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === optIdx
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(currentQuestionIdx, optIdx)}
                            style={{
                              textAlign: 'left',
                              background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 6, 23, 0.6)',
                              border: `1.5px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                              borderRadius: '8px',
                              padding: '12px 16px',
                              color: isSelected ? '#ffffff' : '#cbd5e1',
                              fontSize: '0.84rem',
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `1.5px solid ${isSelected ? '#38bdf8' : '#64748b'}`,
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '0.7rem',
                              color: isSelected ? '#38bdf8' : '#64748b'
                            }}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Question Stepper Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={currentQuestionIdx === 0}
                      onClick={() => { playTactileClick(); setCurrentQuestionIdx(idx => Math.max(0, idx - 1)); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: currentQuestionIdx === 0 ? '#475569' : '#94a3b8',
                        cursor: currentQuestionIdx === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      ← Previous Question
                    </button>

                    {currentQuestionIdx < AWS_DIAGNOSTIC_QUESTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => { playTactileClick(); setCurrentQuestionIdx(idx => idx + 1); }}
                        style={{
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinishDiagnostic}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        Calculate My AWS Placement →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Diagnostic Results Summary */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399', marginBottom: '4px' }}>
                      {testScore} / {AWS_DIAGNOSTIC_QUESTIONS.length}
                    </div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                      {testScore >= 4 ? 'Advanced Candidate Baseline Verified!' : 'Strong Foundation Ready for Acceleration!'}
                    </h4>
                    <p style={{ margin: '0 auto', fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '600px' }}>
                      Your diagnostic baseline earned you <strong>+150 Starter XP</strong> and unlocked your personalized AWS Cloud Security curriculum.
                    </p>
                  </div>

                  {/* Recommendation Pill */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 153, 0, 0.4)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 153, 0, 0.15)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#ff9900',
                      flexShrink: 0
                    }}>
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#ff9900', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>
                        Recommended Starting Path
                      </span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                        {recommendedTier}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { playTactileClick(); setCurrentStep('ready'); }}
                      style={{
                        background: 'linear-gradient(135deg, #ff9900 0%, #d97706 100%)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(255, 153, 0, 0.4)'
                      }}
                    >
                      <span>Proceed to Launch →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* STEP 6: READY & LAUNCH                                              */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 'ready' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)',
                border: '2px solid #ff9900',
                display: 'grid',
                placeItems: 'center',
                color: '#ff9900',
                margin: '0 auto'
              }}>
                <Zap size={32} />
              </div>

              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>
                  You Are Ready to Shape Your Future as an AWS Security Engineer
                </h3>
                <p style={{ margin: '0 auto', fontSize: '0.88rem', color: '#94a3b8', maxWidth: '620px', lineHeight: 1.6 }}>
                  Your orientation sequence is complete. You have direct access to <strong>52+ structured AWS security topics</strong>, <strong>$0-safe real labs</strong>, <strong>live internship offers</strong>, and the <strong>NAEN AI floating copilot</strong>.
                </p>
              </div>

              {/* Ready Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Starter Bonus</span>
                  <strong style={{ fontSize: '1.2rem', color: '#ff9900', fontWeight: 900 }}>+150 XP</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Curriculum Tier</span>
                  <strong style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800 }}>Tier 1 & Beyond</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Platform Focus</span>
                  <strong style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800 }}>100% Dedicated AWS</strong>
                </div>
              </div>

              {/* Final Big Launch Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleFinalLaunch}
                  style={{
                    background: 'linear-gradient(135deg, #ff9900 0%, #ea580c 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '16px 36px',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    letterSpacing: '0.4px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 30px rgba(255, 153, 0, 0.5)'
                  }}
                >
                  <Sparkles size={18} />
                  <span>Launch My AWS Security Journey</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
