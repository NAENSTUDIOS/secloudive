import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LabChecklist } from '../components/academy/LabChecklist';
import { getLab } from '../lib/academy';
import type { Lab } from '../types';

export function LabPage() {
  const { labId = '' } = useParams();
  const [lab, setLab] = useState<Lab | null>(null);
  useEffect(() => { void getLab(labId).then(setLab).catch(() => undefined); }, [labId]);
  if (!lab) return <p className="text-slate-400">Loading lab…</p>;
  return <div className="space-y-8"><div><p className="eyebrow">Hands-on lab · {lab.provider}</p><h1 className="text-4xl font-bold">{lab.title}</h1><p className="mt-3 text-slate-400">Use {lab.emulator} locally. {lab.costWarning}</p></div><LabChecklist labId={lab.id} steps={lab.steps} teardown={lab.teardown} /></div>;
}
