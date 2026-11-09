import { Link } from 'react-router-dom';

export function HomePage() {
  return <section className="grid gap-12 py-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-20">
    <div>
      <p className="eyebrow">Security operations, simplified</p>
      <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">Your security workspace, <span className="text-indigo-300">under control.</span></h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">SecLoudive brings your products, teams, and operational signals into one secure, focused workspace.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/signup" className="button-primary">Create workspace</Link><Link to="/login" className="button-secondary">Sign in with Google</Link></div>
    </div>
    <div className="dashboard-preview"><div className="mb-6 flex items-center justify-between"><span className="text-sm font-semibold">Security overview</span><span className="flex items-center gap-2 text-xs text-emerald-300"><i className="h-2 w-2 rounded-full bg-emerald-300" />All systems operational</span></div><div className="grid grid-cols-2 gap-3"><div className="preview-stat"><span>Threat score</span><strong>12.4</strong><small>↓ 8.2% this week</small></div><div className="preview-stat"><span>Protected assets</span><strong>1,284</strong><small>↑ 14.6% this week</small></div></div><div className="mt-4 h-28 rounded-xl bg-indigo-400/5 p-3"><svg viewBox="0 0 400 90" preserveAspectRatio="none" className="h-full w-full"><polyline points="0,70 60,54 115,65 170,35 220,48 280,20 340,32 400,8" fill="none" stroke="#818cf8" strokeWidth="3" /></svg></div></div>
  </section>;
}
