// =========================================================================
// SeCloudive - Daily Learning Goal & Streak Tracker Widget
// Gamified daily retention engine for Cloud Security Engineers
// =========================================================================

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Award,
  Calendar,
  Zap,
  Check
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'

const DAILY_TIPS = [
  'Never attach an IAM managed policy containing "iam:PassRole" without an explicit Resource ARN constraint.',
  'Always enable MFA Delete on versioned S3 buckets to prevent ransomware destruction of archive objects.',
  'For multi-account AWS architectures, always centralize CloudTrail and GuardDuty findings into a dedicated Security Tooling account.',
  'When isolating a compromised EC2 instance, remove all security groups and apply an empty isolation SG with 0 ingress and 0 egress.',
  'Enforce TLS 1.2+ on S3 buckets using an explicit Deny statement with the Condition "aws:SecureTransport": "false".',
  'AWS KMS Customer Managed Keys (CMKs) support annual automatic rotation without breaking existing encrypted ciphertexts.',
  'In Incident Response, always snapshot EBS volumes and capture volatile memory BEFORE terminating or rebooting instances.'
]

export default function DailyLearningStreakWidget() {
  const {
    progress,
    activeProfile,
    investigationCompletedCount = 0,
    completedLabStepsCount = 0,
    addMasterXP
  } = useChallenges()

  const userId = activeProfile?.id || 'guest'
  const streakStorageKey = `secloudive_streak_${userId}`

  // Helper to load streak data for current user
  const loadStreakForUser = () => {
    try {
      const saved = localStorage.getItem(streakStorageKey) || (userId === 'guest' ? localStorage.getItem('secloudive_streak_data') : null)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not parse streak data', e)
    }
    return {
      currentStreak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      claimedDates: [],
      missions: {
        incidentDone: false,
        labDone: false,
        advisoryReviewed: false
      }
    }
  }

  // Streak state from localStorage
  const [streakData, setStreakData] = useState(loadStreakForUser)

  // Reload streak whenever active user profile changes
  useEffect(() => {
    setStreakData(loadStreakForUser())
  }, [userId])

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const isBonusClaimed = streakData.claimedDates?.includes(todayStr)

  // Initialize and evaluate today's missions
  useEffect(() => {
    setStreakData(prev => {
      const isNewDay = prev.lastActiveDate !== todayStr
      const updated = {
        ...prev,
        lastActiveDate: todayStr,
        missions: {
          incidentDone: isNewDay ? (investigationCompletedCount > 0) : (prev.missions.incidentDone || investigationCompletedCount > 0),
          labDone: isNewDay ? (completedLabStepsCount > 0) : (prev.missions.labDone || completedLabStepsCount > 0),
          advisoryReviewed: isNewDay ? false : prev.missions.advisoryReviewed
        }
      }
      localStorage.setItem(streakStorageKey, JSON.stringify(updated))
      return updated
    })
  }, [todayStr, investigationCompletedCount, completedLabStepsCount, streakStorageKey])

  // Count completed tasks
  const completedMissionsCount = useMemo(() => {
    let count = 0
    if (streakData.missions.incidentDone) count++
    if (streakData.missions.labDone) count++
    if (streakData.missions.advisoryReviewed) count++
    return count
  }, [streakData.missions])

  const completionPct = Math.round((completedMissionsCount / 3) * 100)

  // Toggle mission
  const toggleMission = (missionKey) => {
    playTactileClick()
    setStreakData(prev => {
      const updated = {
        ...prev,
        missions: {
          ...prev.missions,
          [missionKey]: !prev.missions[missionKey]
        }
      }
      localStorage.setItem(streakStorageKey, JSON.stringify(updated))
      return updated
    })
  }

  // Claim Daily XP Bonus
  const [justClaimed, setJustClaimed] = useState(false)
  const handleClaimBonus = () => {
    if (isBonusClaimed || completedMissionsCount < 3) return
    playTactileClick()
    if (typeof addMasterXP === 'function') {
      addMasterXP(50)
    }
    setJustClaimed(true)
    setStreakData(prev => {
      const updated = {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        claimedDates: [...(prev.claimedDates || []), todayStr]
      }
      localStorage.setItem(streakStorageKey, JSON.stringify(updated))
      return updated
    })
    setTimeout(() => setJustClaimed(false), 3000)
  }

  // Day of week streak indicators
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const currentDayIndex = (new Date().getDay() + 6) % 7 // Monday = 0

  // Daily Tip
  const tipOfTheDay = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length]
  }, [])

  // Loss-aversion countdown to midnight
  const hoursToMidnight = Math.max(1, 23 - new Date().getHours())
  const isStreakAtRisk = completedMissionsCount < 3 && streakData.currentStreak > 0

  return (
    <div className="daily-streak-widget animate-reveal" role="region" aria-label="Daily Learning Goal & Streak Tracker">
      <div className="streak-widget-glow" />

      {/* Loss-Aversion Warning Banner (Duolingo / TryHackMe Retention Science) */}
      {isStreakAtRisk && (
        <div 
          className="streak-risk-banner"
          style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <div>
              <strong style={{ color: '#f87171' }}>Streak at Risk!</strong>
              <span style={{ color: '#cbd5e1', marginLeft: '6px' }}>
                Complete {3 - completedMissionsCount} more mission{3 - completedMissionsCount > 1 ? 's' : ''} to save your <strong>{streakData.currentStreak}-day streak</strong>.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>
            <Calendar size={13} />
            <span>Resets in ~{hoursToMidnight}h</span>
          </div>
        </div>
      )}

      {/* Header with Streak Counter */}
      <div className="streak-widget-header">
        <div className="streak-badge-box">
          <div className="streak-flame-wrapper">
            <Flame size={24} className="streak-flame-icon animate-pulse" />
          </div>
          <div>
            <div className="streak-count-title">
              <span className="streak-number">{streakData.currentStreak}</span>
              <span className="streak-unit">DAY STREAK</span>
              <span 
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginLeft: '6px'
                }}
                title="Active streak gives +15% XP multiplier on all labs"
              >
                1.15x BOOST
              </span>
            </div>
            <div className="streak-subtext" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Discipline score: Top 8% of defenders</span>
              <span style={{ color: '#38bdf8', fontSize: '0.72rem' }}>• 🛡️ 1 Freeze Equipped</span>
            </div>
          </div>
        </div>

        {/* Weekly Day Dots */}
        <div className="streak-week-calendar" aria-label="Weekly streak progression">
          {daysOfWeek.map((day, idx) => {
            const isPastOrToday = idx <= currentDayIndex
            const isToday = idx === currentDayIndex

            return (
              <div 
                key={idx} 
                className={`week-day-dot \${isPastOrToday ? 'active' : ''} \${isToday ? 'today' : ''}`}
                title={`\${day} - \${isPastOrToday ? 'Active' : 'Upcoming'}`}
              >
                <span className="dot-label">{day}</span>
                <span className="dot-indicator">
                  {isPastOrToday ? <Check size={10} /> : <span className="empty-dot" />}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Daily Goal Progress */}
      <div className="streak-goal-body">
        <div className="streak-goal-summary">
          <div className="goal-status-left">
            <Target size={16} className="text-cyan" />
            <span className="goal-label">DAILY MISSIONS:</span>
            <span className="goal-fraction">{completedMissionsCount} of 3 Complete</span>
          </div>
          <span className="goal-pct">{completionPct}%</span>
        </div>

        {/* Progress Bar */}
        <div className="streak-progress-track">
          <div 
            className="streak-progress-fill" 
            style={{ 
              width: `\${completionPct}%`,
              background: completionPct === 100 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #38bdf8, #818cf8)'
            }} 
          />
        </div>

        {/* 3 Interactive Daily Tasks */}
        <div className="daily-tasks-list">
          {/* Task 1 */}
          <div 
            className={`daily-task-item \${streakData.missions.incidentDone ? 'is-done' : ''}`}
            onClick={() => toggleMission('incidentDone')}
            role="checkbox"
            aria-checked={streakData.missions.incidentDone}
            tabIndex={0}
          >
            <div className="task-checkbox">
              {streakData.missions.incidentDone ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
            </div>
            <div className="task-info">
              <span className="task-title">1. Investigate 1 Security Incident</span>
              <span className="task-desc">Triage blast radius & forensic evidence in the Simulator</span>
            </div>
            <Link to="/investigations" className="task-action-link" onClick={e => e.stopPropagation()}>
              Launch &rarr;
            </Link>
          </div>

          {/* Task 2 */}
          <div 
            className={`daily-task-item \${streakData.missions.labDone ? 'is-done' : ''}`}
            onClick={() => toggleMission('labDone')}
            role="checkbox"
            aria-checked={streakData.missions.labDone}
            tabIndex={0}
          >
            <div className="task-checkbox">
              {streakData.missions.labDone ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
            </div>
            <div className="task-info">
              <span className="task-title">2. Complete 1 Real Lab or Launch IaC</span>
              <span className="task-desc">Execute an AWS CLI runbook or copy Terraform sandbox</span>
            </div>
            <Link to="/labs" className="task-action-link" onClick={e => e.stopPropagation()}>
              Run Lab &rarr;
            </Link>
          </div>

          {/* Task 3 */}
          <div 
            className={`daily-task-item \${streakData.missions.advisoryReviewed ? 'is-done' : ''}`}
            onClick={() => toggleMission('advisoryReviewed')}
            role="checkbox"
            aria-checked={streakData.missions.advisoryReviewed}
            tabIndex={0}
          >
            <div className="task-checkbox">
              {streakData.missions.advisoryReviewed ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
            </div>
            <div className="task-info">
              <span className="task-title">3. Review 1 Live AWS Threat Advisory or Cheat Sheet</span>
              <span className="task-desc">Keep your threat intelligence and framework knowledge current</span>
            </div>
            <Link to="/downloads" className="task-action-link" onClick={e => e.stopPropagation()}>
              Study &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Bonus Claim Bar / Daily Tip Footer */}
      <div className="streak-widget-footer">
        {completedMissionsCount === 3 ? (
          <div className="bonus-claim-area">
            {isBonusClaimed ? (
              <div className="bonus-claimed-badge">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>+50 XP Daily Goal Bonus Claimed! Great work today.</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-claim-streak-bonus animate-bounce"
                onClick={handleClaimBonus}
              >
                <Sparkles size={16} />
                <span>{justClaimed ? 'Claimed +50 XP!' : 'Claim +50 XP Daily Bonus!'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="daily-tip-box">
            <span className="tip-badge">
              <Zap size={12} className="text-amber-400" /> SENIOR SEC ENG TIP:
            </span>
            <span className="tip-content">"{tipOfTheDay}"</span>
          </div>
        )}
      </div>
    </div>
  )
}
