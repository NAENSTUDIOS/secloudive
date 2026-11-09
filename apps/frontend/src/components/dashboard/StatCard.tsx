import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  icon: ReactNode;
  tone?: 'indigo' | 'cyan' | 'violet' | 'emerald';
};

const tones = {
  indigo: 'bg-indigo-400/10 text-indigo-300 ring-indigo-400/20',
  cyan: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/20',
  violet: 'bg-violet-400/10 text-violet-300 ring-violet-400/20',
  emerald: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
};

export function StatCard({ label, value, change, icon, tone = 'indigo' }: StatCardProps) {
  return <article className="stat-card">
    <div className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${tones[tone]}`}>{icon}</div>
    <div className="mt-5 flex items-end justify-between gap-3">
      <div><p className="text-sm text-slate-400">{label}</p><p className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</p></div>
      {change && <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">{change}</span>}
    </div>
  </article>;
}
