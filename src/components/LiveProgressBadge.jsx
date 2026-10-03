import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function LiveProgressBadge() {
  const { 
    completedMasterActivities, 
    totalMasterActivities, 
    masterProgressPercent, 
    masterTotalXP,
    earnedBadges 
  } = useChallenges()

  return (
    <Link
      to="/dashboard"
      className="live-progress-badge"
      title={`Live Security Profile: ${completedMasterActivities}/${totalMasterActivities} tasks complete • ${masterTotalXP} XP • ${earnedBadges.length} Badges. Click to view Dashboard`}
      aria-label={`Live progress: ${masterProgressPercent}% overall (${completedMasterActivities} activities complete) — click to view dashboard`}
    >
      <span className="badge-pulse" aria-hidden="true" />
      <span>
        <strong>{completedMasterActivities}</strong> <span className="badge-text-mobile-hide">activities</span>
      </span>
      <span className="badge-score">{masterProgressPercent}%</span>
    </Link>
  )
}
