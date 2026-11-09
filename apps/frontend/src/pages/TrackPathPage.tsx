import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleCard } from '../components/academy/ModuleCard';
import { getPathModules } from '../lib/academy';
import { isModuleAvailable, unmetPrerequisites } from '../lib/academyLogic';
import { api } from '../lib/api';
import type { AcademyModule } from '../types';

export function TrackPathPage() {
  const { track = 'core' } = useParams();
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => { void Promise.all([getPathModules(track), api.get<string[]>('/progress')]).then(([items, progress]) => { setModules(items); setCompleted(progress); }).catch(() => undefined); }, [track]);
  const levels = ['Beginner', 'Intermediate', 'Advanced'] as const;
  return <div className="space-y-8"><div><p className="eyebrow">Learning path</p><h1 className="text-4xl font-bold capitalize">{track} security track</h1><p className="mt-2 text-slate-400">Prerequisites unlock each module in sequence.</p></div>{levels.map((level) => <section key={level}><h2 className="mb-4 text-2xl font-semibold">{level}</h2><div className="grid gap-4 lg:grid-cols-2">{modules.filter((module) => module.level === level).map((module) => { const status = completed.includes(module.id) ? 'completed' : isModuleAvailable(module, completed) ? 'available' : 'locked'; return <ModuleCard module={module} status={status} unmet={unmetPrerequisites(module, completed)} key={module.id} />; })}</div></section>)}</div>;
}
