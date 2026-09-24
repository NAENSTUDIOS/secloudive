import { Check } from 'lucide-react'

export default function BadgeCard({ icon, title, copy, earned = true, tone = 'blue' }) {
  return <article className={`badge-card badge-${tone} ${earned ? 'is-earned' : 'is-locked'}`}><div className="badge-art">{icon}<span>{earned && <Check size={10} />}</span></div><div><strong>{title}</strong><p>{copy}</p></div></article>
}
