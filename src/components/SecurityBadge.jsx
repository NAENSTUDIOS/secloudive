import { ShieldCheck } from 'lucide-react'
export default function SecurityBadge({ children = 'Security mindset' }) { return <span className="security-badge"><ShieldCheck size={14} /> {children}</span> }
