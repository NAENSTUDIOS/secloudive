import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QuizCard } from '../components/academy/QuizCard';
import { getAcademyModule } from '../lib/academy';
import { api } from '../lib/api';
import type { ModuleDetail } from '../types';

export function ModulePage() {
  const { moduleId = '' } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [error, setError] = useState('');
  const [passed, setPassed] = useState(false);
  useEffect(() => { void getAcademyModule(moduleId).then(setModule).catch((reason) => setError(reason instanceof Error ? reason.message : 'Module unavailable.')); }, [moduleId]);
  async function complete() { try { await api.post(`/progress/${moduleId}`, {}); navigate('/dashboard'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save progress.'); } }
  if (error) return <p className="error">{error}</p>;
  if (!module) return <p className="text-slate-400">Loading module…</p>;
  return <article className="mx-auto max-w-4xl space-y-8"><div><span className="badge">{module.track} · {module.level}</span><h1 className="mt-4 text-4xl font-bold">{module.title}</h1><p className="mt-3 text-slate-400">{module.summary}</p></div><div className="panel"><div className="prose prose-invert max-w-none">{module.body.split('\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div><div className="panel"><h2 className="text-xl font-semibold">Key concepts</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">{module.keyConcepts.map((concept) => <li key={concept}>{concept}</li>)}</ul></div>{module.quiz.length > 0 && <QuizCard questions={module.quiz} onPass={(score) => setPassed(score >= 70)} />}{module.labId && <Link to={`/labs/${module.labId}`} className="button-secondary">Open hands-on lab</Link>}<button className="button-primary w-full" disabled={!passed} onClick={() => void complete()}>Mark module complete</button></article>;
}
