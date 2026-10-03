import { ArrowRight, Clock3, LockKeyhole, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { playTactileClick } from '../utils/cyberMotionAudio'

export default function ChallengeCard({ challenge }) {
  const locked = challenge.status === 'locked'
  return (
    <div className={`challenge-card cyber-glass-panel motion-card ${locked ? 'is-locked' : ''}`}>
      <div className="challenge-card-head">
        <span className={`difficulty difficulty-${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span className="challenge-points">
          <Star size={13} /> {challenge.points} XP
        </span>
      </div>
      <div className="challenge-type">{challenge.type}</div>
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      <div className="challenge-card-foot">
        <span>
          <Clock3 size={14} /> {challenge.time}
        </span>
        {locked ? (
          <span className="locked-label">
            <LockKeyhole size={14} /> Locked
          </span>
        ) : (
          <Link 
            to={`/challenge/${challenge.id}`} 
            onClick={() => playTactileClick()}
            className="motion-button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#38bdf8', fontWeight: 700 }}
          >
            Open lab <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  )
}
