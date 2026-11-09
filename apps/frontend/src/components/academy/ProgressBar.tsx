export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return <div>{label && <div className="mb-2 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}%</span></div>}<div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div></div>;
}
