import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/academy/ProgressBar';
import { getAcademyModules } from '../lib/academy';
import { academyCompletion, isModuleAvailable } from '../lib/academyLogic';
import { api } from '../lib/api';
import type { AcademyModule } from '../types';

export function AcademyDashboardPage() {
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => { void Promise.all([getAcademyModules(), api.get<string[]>('/progress')]).then(([all, progress]) => { setModules(all); setCompleted(progress); }).catch(() => undefined); }, []);
  const completion = useMemo(() => academyCompletion(modules, completed), [modules, completed]);
  const next = modules.find((module) => !completed.includes(module.id) && isModuleAvailable(module, completed));
  const tracks = ['core', 'aws', 'azure', 'gcp'] as const;
  return <div className="space-y-8"><div><p className="eyebrow">Cloud Security Academy</p><h1 className="text-4xl font-bold tracking-tight">Your security learning command center</h1><p className="mt-2 text-slate-400">Complete every core and provider module, then finish the cross-cloud capstone.</p></div><div className="panel"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-400">Academy completion</p><p className="mt-1 text-4xl font-bold">{completion.percentage}%</p></div><span className="status-pill"><i />{completion.completed} of {completion.total} modules complete</span></div><div className="mt-5"><ProgressBar value={completion.percentage} /></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{tracks.map((track) => { const trackModules = modules.filter((module) => module.track === track); const done = trackModules.filter((module) => completed.includes(module.id)).length; return <Link to={`/paths/${track}`} className="stat-card" key={track}><p className="text-sm uppercase tracking-wider text-slate-500">{track}</p><p className="mt-2 text-2xl font-bold">{done}/{trackModules.length}</p><ProgressBar value={trackModules.length ? done / trackModules.length * 100 : 0} label="Progress" /></Link>; })}</div>{next && <div className="panel border-indigo-400/30"><p className="eyebrow">Recommended next</p><h2 className="text-2xl font-semibold">{next.title}</h2><p className="mt-2 text-slate-400">{next.summary}</p><Link to={`/modules/${next.id}`} className="button-primary mt-5">Start module</Link></div>}</div>;
}
