import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/Toast';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { SectionHeading } from '../components/dashboard/SectionHeading';
import { StatCard } from '../components/dashboard/StatCard';
import type { Activity, Product } from '../types';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    if (!supabase || !user) return;
    void Promise.all([
      supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
      supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([productResult, activityResult]) => {
      if (productResult.data) setProducts(productResult.data as Product[]);
      if (activityResult.data) setActivities(activityResult.data as Activity[]);
    });
  }, [user]);
  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Command center</p><h1 className="text-4xl font-bold tracking-tight">Good to see you, {profile?.full_name?.split(' ')[0] ?? 'there'}.</h1><p className="mt-2 text-slate-400">Here is what is happening in your workspace.</p></div><span className="status-pill"><i />Workspace secure</span></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total products" value={String(products.length)} change="+12.5%" tone="indigo" icon={<span>◈</span>} /><StatCard label="Activity events" value={String(activities.length)} change="+8.2%" tone="cyan" icon={<span>⌁</span>} /><StatCard label="Security score" value="98.6%" change="+2.4%" tone="violet" icon={<span>✦</span>} /><StatCard label="System status" value="Healthy" tone="emerald" icon={<span>✓</span>} /></div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]"><div className="panel"><SectionHeading eyebrow="Last 7 days" title="Workspace activity" action={<span className="text-xs text-slate-500">Live data</span>} /><ActivityChart values={[22, 38, 31, 54, 46, 70, 63]} /></div><div className="panel"><SectionHeading title="Security posture" /><div className="mx-auto grid h-40 w-40 place-items-center rounded-full" style={{ background: 'conic-gradient(#818cf8 0 82%, #1e293b 82% 100%)' }}><div className="grid h-32 w-32 place-items-center rounded-full bg-[#0d1226]"><strong className="text-3xl">82%</strong></div></div><p className="mt-5 text-center text-sm text-slate-400">Your workspace is well protected. Keep reviewing activity weekly.</p></div></div>
    <div className="grid gap-6 lg:grid-cols-2"><div className="panel"><SectionHeading title="Recent products" action={<Link to="/products" className="text-sm text-indigo-300">View all</Link>} />{products.length ? <div className="space-y-3">{products.map((product) => <div className="list-row" key={product.id}><div><strong>{product.name}</strong><p>{product.description || 'No description'}</p></div><span className="font-semibold text-indigo-300">${product.price.toFixed(2)}</span></div>)}</div> : <EmptyState title="No products yet" message="Create your first product to populate the dashboard." />}</div><div className="panel"><SectionHeading title="Recent activity" />{activities.length ? <div className="space-y-3">{activities.map((activity) => <div className="list-row" key={activity.id}><div><strong>{activity.action}</strong><p>{activity.entity_type}</p></div><time>{new Date(activity.created_at).toLocaleDateString()}</time></div>)}</div> : <EmptyState title="No activity yet" message="Your product actions will appear here." />}</div></div>
  </div>;
}
