import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import type { LearningPath, SecurityResource } from '../types';
import { useAuth } from '../context/AuthContext';

const emptyForm = { title: '', slug: '', summary: '', category: 'cloud-security', resource_type: 'lesson', level: 'foundation', duration_minutes: '15', content: '', published: false };

export function AdminResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<SecurityResource[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [pathId, setPathId] = useState('');
  const [editing, setEditing] = useState<SecurityResource | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    if (!supabase) return;
    const [resourceResult, pathResult] = await Promise.all([
      supabase.from('security_resources').select('*').order('updated_at', { ascending: false }),
      supabase.from('learning_paths').select('*').order('title'),
    ]);
    if (resourceResult.error) setError(resourceResult.error.message); else setResources((resourceResult.data ?? []) as SecurityResource[]);
    if (pathResult.data) setPaths(pathResult.data as LearningPath[]);
  }
  useEffect(() => { void load(); }, []);

  function start(resource?: SecurityResource) {
    setEditing(resource ?? null);
    setPathId(resource?.path_id ?? '');
    setForm(resource ? { title: resource.title, slug: resource.slug, summary: resource.summary, category: resource.category, resource_type: resource.resource_type, level: resource.level, duration_minutes: String(resource.duration_minutes), content: JSON.stringify(resource.content, null, 2), published: resource.published } : emptyForm);
    setError(''); setMessage('');
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setError(''); setMessage('');
    let content: SecurityResource['content'];
    try { content = form.content.trim() ? JSON.parse(form.content) : []; if (!Array.isArray(content)) throw new Error('Content must be a JSON array.'); } catch (parseError) { setError(parseError instanceof Error ? parseError.message : 'Content must be valid JSON.'); return; }
    if (!user) { setError('Your session has expired. Sign in again.'); return; }
    const payload = { ...form, duration_minutes: Number(form.duration_minutes), content, path_id: pathId || null, created_by: user.id };
    delete (payload as Partial<typeof payload>).content;
    const request = editing ? supabase.from('security_resources').update({ ...payload, content }).eq('id', editing.id) : supabase.from('security_resources').insert({ ...payload, content });
    const result = await request;
    if (result.error) setError(result.error.message); else { setMessage(editing ? 'Resource updated.' : 'Resource created.'); start(); await load(); }
  }

  async function remove(id: string) {
    if (!supabase || !window.confirm('Delete this resource?')) return;
    const result = await supabase.from('security_resources').delete().eq('id', id);
    if (result.error) setError(result.error.message); else await load();
  }

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Admin publishing</p><h1 className="text-4xl font-bold tracking-tight">Security resources</h1><p className="mt-2 text-slate-400">Create, edit, publish, and retire cloud-security learning content.</p></div><button className="button-primary" onClick={() => start()}>Add resource</button></div>
    {error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{resources.map((resource) => <article className="panel" key={resource.id}><div className="flex items-start justify-between gap-4"><div><span className="badge">{resource.resource_type}</span><h2 className="mt-3 text-xl font-semibold">{resource.title}</h2><p className="mt-2 text-sm text-slate-400">{resource.summary}</p></div><span className={resource.published ? 'status-pill' : 'badge'}>{resource.published ? 'Published' : 'Draft'}</span></div><div className="mt-5 flex gap-2"><button className="button-secondary" onClick={() => start(resource)}>Edit</button><button className="button-danger" onClick={() => void remove(resource.id)}>Delete</button></div></article>)}</div>
    {editing !== null || form.title ? <div className="modal-backdrop"><form onSubmit={submit} className="panel max-h-[90vh] w-full max-w-3xl space-y-4 overflow-y-auto"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editing ? 'Edit resource' : 'New resource'}</h2><button type="button" className="text-2xl text-slate-400" onClick={() => start()}>×</button></div><div className="grid gap-4 sm:grid-cols-2"><label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="iam-least-privilege" required /></label><label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label><label>Learning path<select value={pathId} onChange={(event) => setPathId(event.target.value)}><option value="">Unassigned</option>{paths.map((path) => <option value={path.id} key={path.id}>{path.title}</option>)}</select></label><label>Type<select value={form.resource_type} onChange={(event) => setForm({ ...form, resource_type: event.target.value })}><option value="lesson">Lesson</option><option value="lab">Hands-on lab</option><option value="assessment">Assessment</option><option value="reference">Reference</option></select></label><label>Level<select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}><option value="foundation">Foundation</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Duration (minutes)<input type="number" min="1" value={form.duration_minutes} onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })} required /></label></div><label>Summary<textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label><label>Content JSON<textarea className="min-h-48 font-mono text-xs" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder={'[{"heading":"Objective","body":"Learn how to..."}]'} /></label><label className="flex items-center gap-3"><input className="h-4 w-4" type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />Publish immediately</label><button className="button-primary w-full">{editing ? 'Save resource' : 'Create resource'}</button></form></div> : null}
  </div>;
}
