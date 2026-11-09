import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAcademyResources, getScenarios } from '../lib/academy';
import { scenarioReducer, initialScenarioState } from '../lib/academyLogic';
import { api } from '../lib/api';
import type { AcademyResource, Scenario } from '../types';

type ScenarioChoice = { label: string; points: number; feedback: string; nextStepId: string | null };
type ScenarioStep = { text: string; choices: ScenarioChoice[] };
type ScenarioDetail = { id: string; title: string; intro: string; startStepId: string; steps: Record<string, ScenarioStep> };

export function ResourcesPage() {
  const [resources, setResources] = useState<AcademyResource[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { void getAcademyResources().then(setResources).catch(() => undefined); }, []);
  const filtered = resources.filter((resource) => `${resource.title} ${resource.summary} ${resource.provider}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-8"><div><p className="eyebrow">Approved library</p><h1 className="text-4xl font-bold">Security resources</h1><p className="mt-2 text-slate-400">Curated, free-first resources reviewed for cloud-security learners.</p></div><input placeholder="Search resources…" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="grid gap-4 lg:grid-cols-2">{filtered.map((resource) => <article className="panel" key={resource.id}><div className="flex justify-between gap-3"><span className="badge">{resource.type}</span>{resource.isFree && <span className="status-pill">Free</span>}</div><h2 className="mt-4 text-xl font-semibold">{resource.title}</h2><p className="mt-2 text-sm text-slate-400">{resource.summary}</p><a className="button-secondary mt-5" href={resource.url} target="_blank" rel="noopener noreferrer">Open resource ↗</a></article>)}</div></div>;
}

export function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  useEffect(() => { void getScenarios().then(setScenarios).catch(() => undefined); }, []);
  return <div className="space-y-8"><div><p className="eyebrow">Practice decisions</p><h1 className="text-4xl font-bold">Security scenarios</h1><p className="mt-2 text-slate-400">Choose a role-play incident and practice making high-stakes cloud decisions.</p></div><div className="grid gap-4 lg:grid-cols-2">{scenarios.map((scenario) => <article className="panel" key={scenario.id}><span className="badge">{scenario.role}</span><h2 className="mt-4 text-xl font-semibold">{scenario.title}</h2><p className="mt-2 text-sm text-slate-400">{scenario.summary}</p><div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{scenario.level} · {scenario.durationMinutes} min</span><Link to={`/scenarios/${scenario.id}`} className="text-indigo-300">Start scenario →</Link></div></article>)}</div></div>;
}

export function ScenarioPlayerPage() {
  const { scenarioId = '' } = useParams();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [state, dispatch] = useState(initialScenarioState);
  useEffect(() => { void api.get<ScenarioDetail>(`/scenarios/${scenarioId}`).then(setScenario).catch(() => undefined); }, [scenarioId]);
  if (!scenario) return <p className="text-slate-400">Loading scenario…</p>;
  const step = Object.values(scenario.steps)[state.currentStep];
  if (!step) return <p className="error">This scenario is unavailable.</p>;
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="eyebrow">Role-play scenario</p><h1 className="text-4xl font-bold">{scenario.title}</h1><p className="mt-3 text-slate-400">{scenario.intro}</p></div><div className="panel"><p className="text-lg leading-8">{step.text}</p><div className="mt-6 grid gap-3">{step.choices.map((choice) => <button className="choice text-left" key={choice.label} onClick={() => dispatch((current) => scenarioReducer(current, { type: 'answer', questionId: String(state.currentStep), answer: choice.label }))}>{choice.label}</button>)}</div><p className="mt-5 text-sm text-indigo-300" aria-live="polite">Step {state.currentStep + 1} · {state.status}</p></div></div>;
}

export function PrivacyPage() {
  return <article className="prose prose-invert mx-auto max-w-3xl"><p className="eyebrow">Trust center</p><h1>Privacy at SecLoudive</h1><p>We store your Google ID, name, email, module progress, and scenario scores only to operate the Cloud Security Academy.</p><p>We do not sell learner data. To delete your account and progress, use Account settings or contact the academy administrator.</p></article>;
}

export function LivePage() { return <div className="panel mx-auto max-w-2xl text-center"><p className="eyebrow">Live role-play</p><h1 className="text-4xl font-bold">Collaborative rooms are coming soon.</h1><p className="mt-3 text-slate-400">The live Socket.IO experience will connect only when this page is opened.</p><span className="status-pill mt-6 inline-flex">Offline · Coming soon</span></div>; }
