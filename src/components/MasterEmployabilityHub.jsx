import { useState } from 'react'
import { 
  Briefcase, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Crosshair, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Award, 
  Compass, 
  Target, 
  FileCheck2,
  BookOpen,
  DollarSign,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function MasterEmployabilityHub() {
  const {
    employabilityMetrics,
    masterIncidents,
    masterArchitectureReviews,
    masterThreatHunts,
    masterSafeLabs,
    masterCaseStudies,
    roleRoadmaps,
    targetCareerRole,
    setTargetCareerRole,
    evaluateWithMentor
  } = useChallenges()

  const [activePlanTab, setActivePlanTab] = useState('weekly') // 'weekly' | 'monthly' | 'forecast'
  const [selectedPersona, setSelectedPersona] = useState('Hiring Manager')
  const [mentorQuestion, setMentorQuestion] = useState('')
  const [mentorFeedback, setMentorFeedback] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const metrics = employabilityMetrics?.metrics || {
    skillReadiness: 45,
    internshipReadiness: 50,
    jobReadiness: 48,
    architectureReadiness: 35,
    threatHuntingReadiness: 30,
    investigationReadiness: 40,
    interviewReadiness: 35,
    cloudSecEngReadiness: 42
  }

  const nextAction = employabilityMetrics?.nextBestAction || {
    title: 'Complete First Safe AWS Lab',
    link: '/labs',
    badge: 'PRIORITY 1',
    description: 'Establish hands-on command-line muscle memory with AWS IAM Permission Boundaries.'
  }

  const handleAskMentor = async (e) => {
    e.preventDefault()
    if (!mentorQuestion.trim() || isEvaluating) return

    setIsEvaluating(true)
    try {
      const evaluation = await evaluateWithMentor({
        type: 'career',
        personaKey: selectedPersona,
        userResponse: mentorQuestion,
        submission: { query: mentorQuestion, currentRole: targetCareerRole },
        scenario: { domain: 'AWS Cloud Security Career Acceleration' }
      })
      setMentorFeedback(evaluation)
    } catch (err) {
      console.error('[MasterEmployabilityHub] Error during mentor evaluation:', err)
    } finally {
      setIsEvaluating(false)
    }
  }

  const readinessCards = [
    { label: 'Overall Job Readiness', value: metrics.jobReadiness, color: '#38bdf8', icon: Briefcase },
    { label: 'Skill Readiness', value: metrics.skillReadiness, color: '#10b981', icon: ShieldCheck },
    { label: 'Internship Readiness', value: metrics.internshipReadiness, color: '#a855f7', icon: Award },
    { label: 'Cloud Sec Engineer', value: metrics.cloudSecEngReadiness, color: '#f59e0b', icon: Cpu },
    { label: 'Architecture Readiness', value: metrics.architectureReadiness, color: '#ec4899', icon: Layers },
    { label: 'Investigation Readiness', value: metrics.investigationReadiness, color: '#6366f1', icon: Crosshair },
    { label: 'Threat Hunting Readiness', value: metrics.threatHuntingReadiness, color: '#14b8a6', icon: Target },
    { label: 'Interview Readiness', value: metrics.interviewReadiness, color: '#f97316', icon: Sparkles },
  ]

  const stages = [
    { name: 'Beginner', level: 1 },
    { name: 'Cloud Learner', level: 2 },
    { name: 'Security Intern', level: 3 },
    { name: 'SOC Analyst', level: 4 },
    { name: 'Cloud Sec Analyst', level: 5 },
    { name: 'Cloud Sec Engineer', level: 6 },
    { name: 'Security Architect', level: 7 },
  ]

  // Calculate current stage index based on jobReadiness
  const currentStageIndex = Math.min(6, Math.floor((metrics.jobReadiness / 100) * 7))

  return (
    <section className="master-employability-hub" style={{
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '16px',
      padding: '28px',
      marginBottom: '32px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-120px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              CAREER TRANSFORMATION ENGINE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/// ZERO TO SECURITY ARCHITECT</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            SeCloudive Employability & Readiness OS
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0', maxWidth: '650px' }}>
            Transforming learners from zero AWS knowledge into interview-ready Cloud Security Engineers and Architects through verifiable telemetry, simulated incidents, and hands-on $0 safe labs.
          </p>
        </div>

        {/* Role Target Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(30, 41, 59, 0.6)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <Compass size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Target Role:</span>
          <select 
            value={targetCareerRole} 
            onChange={(e) => setTargetCareerRole(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {(roleRoadmaps || []).map(r => (
              <option key={r.roleId || r.id} value={r.title || r.role}>
                {r.title || r.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7-Stage Career Pipeline */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '28px',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 600 }}>
          7-Stage Career Progression Pipeline
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '8px',
          alignItems: 'center'
        }}>
          {stages.map((stage, idx) => {
            const isCurrent = idx === currentStageIndex
            const isCompleted = idx < currentStageIndex
            return (
              <div key={stage.name} style={{
                background: isCurrent 
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.25) 100%)' 
                  : isCompleted 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : 'rgba(30, 41, 59, 0.4)',
                border: isCurrent 
                  ? '1px solid #38bdf8' 
                  : isCompleted 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '8px',
                padding: '10px 8px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: isCurrent ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: isCurrent ? '#38bdf8' : isCompleted ? '#10b981' : '#64748b',
                  marginBottom: '4px'
                }}>
                  STAGE {stage.level}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isCurrent ? '#f8fafc' : isCompleted ? '#e2e8f0' : '#94a3b8'
                }}>
                  {stage.name}
                </div>
                {isCurrent && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#38bdf8',
                    boxShadow: '0 0 8px #38bdf8'
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Scale Counters Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '28px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{masterIncidents?.length || 250}+</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>AWS Incidents</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{masterArchitectureReviews?.length || 119}+</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Architecture Reviews</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>{masterThreatHunts?.length || 50}+</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Threat Hunt Missions</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{masterSafeLabs?.length || 112}+</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Safe AWS Labs (Verified $0 Teardown)</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899' }}>{masterCaseStudies?.length || 101}+</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Enterprise Case Studies</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>{roleRoadmaps?.length || 11} Roles</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Complete Roadmaps</div>
        </div>
      </div>

      {/* Multidimensional Employability Readiness Gauges */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#38bdf8" /> Multidimensional Employability Readiness
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Dynamic CIS & Well-Architected weighted metrics</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {readinessCards.map((rc) => {
            const Icon = rc.icon
            return (
              <div key={rc.label} style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '6px', borderRadius: '6px', background: `${rc.color}15` }}>
                      <Icon size={14} color={rc.color} />
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 500 }}>{rc.label}</span>
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: rc.color }}>{rc.value}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${rc.value}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${rc.color} 0%, ${rc.color}dd 100%)`,
                    borderRadius: '3px',
                    transition: 'width 0.4s ease-out'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Next Best Action Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '12px',
        padding: '18px 22px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={22} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{
                background: '#38bdf8',
                color: '#0f172a',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {nextAction.badge || 'RECOMMENDED'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>ALGORITHMIC NEXT BEST ACTION</span>
            </div>
            <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#f8fafc' }}>
              {nextAction.title}
            </h4>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
              {nextAction.description}
            </p>
          </div>
        </div>

        <Link 
          to={nextAction.link || '/investigations'}
          className="button button-primary"
          style={{ padding: '8px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Execute Now <ArrowRight size={15} />
        </Link>
      </div>

      {/* Career Plans & Forecast Tabs */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '28px',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '12px', marginBottom: '16px' }}>
          <button 
            type="button"
            onClick={() => setActivePlanTab('weekly')}
            style={{
              background: activePlanTab === 'weekly' ? 'rgba(56, 189, 248, 0.15)' : 'none',
              border: activePlanTab === 'weekly' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              color: activePlanTab === 'weekly' ? '#38bdf8' : '#94a3b8',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={14} /> Weekly Execution Sprint
          </button>
          <button 
            type="button"
            onClick={() => setActivePlanTab('monthly')}
            style={{
              background: activePlanTab === 'monthly' ? 'rgba(56, 189, 248, 0.15)' : 'none',
              border: activePlanTab === 'monthly' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              color: activePlanTab === 'monthly' ? '#38bdf8' : '#94a3b8',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} /> Monthly Mastery Milestones
          </button>
          <button 
            type="button"
            onClick={() => setActivePlanTab('forecast')}
            style={{
              background: activePlanTab === 'forecast' ? 'rgba(56, 189, 248, 0.15)' : 'none',
              border: activePlanTab === 'forecast' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              color: activePlanTab === 'forecast' ? '#38bdf8' : '#94a3b8',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <DollarSign size={14} /> Career & Compensation Forecast (Example Trajectory)
          </button>
        </div>

        {/* Tab 1: Weekly Plan */}
        {activePlanTab === 'weekly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
            {(employabilityMetrics?.weeklyPlan || []).map((step, idx) => (
              <div key={idx} style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                  {step.day}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '6px' }}>
                  {step.task}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '6px' }}>
                  <strong style={{ color: '#cbd5e1' }}>Output:</strong> {step.targetOutput}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Monthly Plan */}
        {activePlanTab === 'monthly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
            {(employabilityMetrics?.monthlyPlan || []).map((m, idx) => (
              <div key={idx} style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>
                  {m.week}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '6px' }}>
                  {m.milestone}
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  {m.goals.map((goal, gIdx) => (
                    <li key={gIdx} style={{ marginBottom: '3px' }}>{goal}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Career Forecast */}
        {activePlanTab === 'forecast' && (
          <div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '0.8rem',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>Example trajectory only. Real outcomes depend on your market, location, experience and effort. This is not a guarantee.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {(employabilityMetrics?.careerForecast || []).map((f, idx) => (
                <div key={idx} style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>
                    {f.horizon}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}>
                    {f.stage}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
                    {f.compensation}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '6px' }}>
                    {f.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gemini Mentor Coaching Console */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#c084fc" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Gemini Multi-Persona Coaching Console
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Zero generic feedback — get structured confidence scores, missing skills, and improvement plans.
              </span>
            </div>
          </div>

          {/* Persona Picker */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Hiring Manager', 'Security Mentor', 'Architecture Reviewer', 'Threat Hunter', 'Career Coach'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPersona(p)}
                style={{
                  background: selectedPersona === p ? '#a855f7' : 'rgba(30, 41, 59, 0.6)',
                  color: selectedPersona === p ? '#ffffff' : '#94a3b8',
                  border: selectedPersona === p ? '1px solid #c084fc' : '1px solid rgba(148, 163, 184, 0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAskMentor} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <input
            type="text"
            value={mentorQuestion}
            onChange={(e) => setMentorQuestion(e.target.value)}
            placeholder={`Ask the ${selectedPersona}: e.g. "How should I structure my answer when asked about cross-account S3 exfiltration?"`}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isEvaluating || !mentorQuestion.trim()}
            className="button button-primary"
            style={{
              background: '#a855f7',
              borderColor: '#c084fc',
              padding: '8px 18px',
              fontSize: '0.84rem',
              whiteSpace: 'nowrap'
            }}
          >
            {isEvaluating ? 'Evaluating...' : 'Evaluate'}
          </button>
        </form>

        {/* Mentor Output Box */}
        {mentorFeedback && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '10px',
            padding: '16px',
            marginTop: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc' }}>{selectedPersona} Evaluation</span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>/// {mentorFeedback.evaluatorRole || mentorFeedback.persona || 'AI Multi-Persona'}</span>
                {mentorFeedback.overallVerdict && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontFamily: "'DM Mono', monospace",
                    color: '#38bdf8',
                    padding: '2px 6px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {mentorFeedback.overallVerdict}
                  </span>
                )}
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                Confidence: {mentorFeedback.confidenceScore}%
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '12px', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {mentorFeedback.detailedExplanation || mentorFeedback.summary}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>Demonstrated Strengths:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#cbd5e1' }}>
                  {(Array.isArray(mentorFeedback.demonstratedStrengths || mentorFeedback.strengths) 
                    ? (mentorFeedback.demonstratedStrengths || mentorFeedback.strengths)
                    : [(mentorFeedback.demonstratedStrengths || mentorFeedback.strengths || 'Hands-on initiative.')]
                  ).filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <strong style={{ color: '#f87171', display: 'block', marginBottom: '4px' }}>Identified Missing Skills:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#cbd5e1' }}>
                  {(Array.isArray(mentorFeedback.missingSkills) 
                    ? mentorFeedback.missingSkills 
                    : [(mentorFeedback.missingSkills || 'None identified.')]
                  ).filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Next Improvement Actions:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#cbd5e1' }}>
                  {(Array.isArray(mentorFeedback.improvementPlan) 
                    ? mentorFeedback.improvementPlan 
                    : [(mentorFeedback.improvementPlan || 'Review official AWS documentation.')]
                  ).filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
