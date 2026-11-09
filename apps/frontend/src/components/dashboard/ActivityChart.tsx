type ActivityChartProps = { values: number[] };

export function ActivityChart({ values }: ActivityChartProps) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - (value / max) * 78}`).join(' ');
  return <div className="relative h-56 w-full">
    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-600"><span>High</span><span>Medium</span><span>Low</span></div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-1.5rem)] overflow-visible">
      <defs><linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".35" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,100 ${points} 100,100`} fill="url(#activity-fill)" />
      <polyline points={points} fill="none" stroke="#818cf8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="absolute inset-x-6 bottom-0 flex justify-between text-xs text-slate-600"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
  </div>;
}
