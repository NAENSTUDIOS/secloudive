import { Link } from 'react-router-dom';
import type { AcademyModule } from '../../types';

export function ModuleCard({ module, status, unmet }: { module: AcademyModule; status: 'completed' | 'available' | 'locked'; unmet?: string[] }) {
  return <article className={`module-card ${status === 'locked' ? 'module-card-locked' : ''}`}>
    <div className="flex items-start justify-between gap-3"><span className="badge">{module.level}</span><span className={`module-status status-${status}`}>{status}</span></div>
    <h2 className="mt-4 text-lg font-semibold">{module.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{module.summary}</p>
    <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{module.estimatedMinutes} min</span>{status === 'locked' ? <span>Requires: {unmet?.join(', ') || 'prerequisites'}</span> : <Link to={`/modules/${module.id}`} className="text-indigo-300">{status === 'completed' ? 'Review module' : 'Start module'} →</Link>}</div>
  </article>;
}
