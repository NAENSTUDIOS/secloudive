import { Link } from 'react-router-dom';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { SectionHeading } from '../components/dashboard/SectionHeading';
import { StatCard } from '../components/dashboard/StatCard';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { SecurityResource } from '../types';
import { useEffect, useState } from 'react';

const findings = [
  { severity: 'High', title: 'Public storage policy detected', asset: 'storage-prod-01', tone: 'high' },
  { severity: 'Medium', title: 'MFA is not enforced for administrators', asset: 'identity-control', tone: 'medium' },
  { severity: 'Low', title: 'Logging retention is below baseline', asset: 'audit-stream', tone: 'low' },
];

const paths = [
  { title: 'Cloud Security Foundations', detail: 'Identity, networking, data protection, and shared responsibility.', progress: 68, lessons: 24 },
  { title: 'Kubernetes Security', detail: 'Cluster hardening, workload isolation, secrets, and supply chain security.', progress: 34, lessons: 31 },
  { title: 'Cloud Incident Response', detail: 'Detect, contain, investigate, and recover from cloud incidents.', progress: 12, lessons: 18 },
];

export function SecurityCenterPage() {
  const { profile } = useAuth();
  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div><p className="eyebrow">Cloud security center</p><h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Build safer cloud systems, one control at a time.</h1><p className="mt-3 max-w-2xl text-slate-400">Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}. Review your posture, resolve findings, and continue your security path.</p></div>
      <Link to="/learning" className="button-primary">Continue learning <span className="ml-2">→</span></Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Security posture" value="82%" change="+6.4%" tone="indigo" icon={<span>✦</span>} />
      <StatCard label="Open findings" value="14" change="-18.2%" tone="violet" icon={<span>⌁</span>} />
      <StatCard label="Protected assets" value="1,284" change="+14.6%" tone="cyan" icon={<span>◈</span>} />
      <StatCard label="Controls passing" value="94/108" change="+4" tone="emerald" icon={<span>✓</span>} />
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <div className="panel"><SectionHeading eyebrow="Posture trend" title="Security posture over time" action={<span className="status-pill"><i />Live signals</span>} /><ActivityChart values={[52, 56, 55, 63, 68, 75, 82]} /><div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-400"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400" />Overall posture</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />Target baseline: 80%</span></div></div>
      <div className="panel"><SectionHeading title="Control coverage" /><div className="space-y-5">{[['Identity & access', 92], ['Data protection', 84], ['Network security', 78], ['Monitoring', 88]].map(([label, value]) => <div key={label as string}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">{label}</span><strong>{value}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" style={{ width: `${value}%` }} /></div></div>)}</div></div>
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <div className="panel"><SectionHeading title="Priority findings" action={<span className="text-sm text-indigo-300">14 total</span>} /><div className="space-y-3">{findings.map((finding) => <div className="finding-row" key={finding.title}><span className={`severity severity-${finding.tone}`}>{finding.severity}</span><div className="min-w-0 flex-1"><strong className="block truncate">{finding.title}</strong><span className="text-xs text-slate-500">{finding.asset}</span></div><button className="button-secondary px-3 py-2 text-xs">Review</button></div>)}</div></div>
      <div className="panel"><SectionHeading title="Continue your path" action={<Link to="/learning" className="text-sm text-indigo-300">Explore paths</Link>} /><div className="space-y-4">{paths.slice(0, 2).map((path) => <div key={path.title}><div className="flex justify-between gap-3"><strong className="text-sm">{path.title}</strong><span className="text-xs text-indigo-300">{path.progress}%</span></div><p className="mt-1 text-xs text-slate-500">{path.lessons} lessons · {path.detail}</p><div className="mt-3 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-indigo-400" style={{ width: `${path.progress}%` }} /></div></div>)}</div></div>
    </div>
  </div>;
}

export function LearningPathsPage() {
  const [resources, setResources] = useState<SecurityResource[]>([]);
  useEffect(() => { if (supabase) void supabase.from('security_resources').select('*').eq('published', true).order('updated_at', { ascending: false }).then(({ data }) => { if (data) setResources(data as SecurityResource[]); }); }, []);
  return <div className="space-y-8"><div><p className="eyebrow">Learn by doing</p><h1 className="text-4xl font-bold tracking-tight">Cloud security paths</h1><p className="mt-2 max-w-2xl text-slate-400">Original, hands-on paths built around the controls and decisions security teams make every day.</p></div><div className="grid gap-5 lg:grid-cols-3">{paths.map((path, index) => <article className="path-card" key={path.title}><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300">0{index + 1}</span><span className="badge">{index === 0 ? 'In progress' : 'Available'}</span></div><h2 className="mt-6 text-xl font-semibold">{path.title}</h2><p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{path.detail}</p><div className="mt-6 flex justify-between text-xs text-slate-500"><span>{path.lessons} lessons</span><span>{path.progress}% complete</span></div><div className="mt-2 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" style={{ width: `${path.progress}%` }} /></div><button className="button-secondary mt-6 w-full">{index === 0 ? 'Resume path' : 'Start path'}</button></article>)}</div>{resources.length > 0 && <div><SectionHeading eyebrow="Published catalog" title="Latest security resources" /><div className="grid gap-4 md:grid-cols-2">{resources.map((resource) => <article className="panel" key={resource.id}><div className="flex justify-between gap-3"><span className="badge">{resource.resource_type}</span><span className="text-xs text-slate-500">{resource.duration_minutes} min</span></div><h2 className="mt-4 text-lg font-semibold">{resource.title}</h2><p className="mt-2 text-sm text-slate-400">{resource.summary}</p><button className="button-secondary mt-5">Open resource</button></article>)}</div></div>}</div>;
}
