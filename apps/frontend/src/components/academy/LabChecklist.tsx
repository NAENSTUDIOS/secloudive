import { useEffect, useState } from 'react';

export function LabChecklist({ labId, steps, teardown }: { labId: string; steps: string[]; teardown: string[] }) {
  const key = `secloudive-lab-${labId}`;
  const [checked, setChecked] = useState<boolean[]>(() => JSON.parse(localStorage.getItem(key) ?? '[]'));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(checked)); }, [checked, key]);
  function reset() { setChecked([]); localStorage.removeItem(key); }
  return <div className="grid gap-6 lg:grid-cols-2"><div className="panel"><h2 className="text-xl font-semibold">Lab steps</h2><div className="mt-5 space-y-3">{steps.map((step, index) => <label className="check-row" key={step}><input type="checkbox" checked={Boolean(checked[index])} onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} /><span>{step}</span></label>)}</div></div><div className="panel"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Teardown checklist</h2><button className="text-xs text-indigo-300" onClick={reset}>Reset checklist</button></div><div className="mt-5 space-y-3 text-sm text-slate-300">{teardown.map((item) => <p key={item}>✓ {item}</p>)}</div></div></div>;
}
