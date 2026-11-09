import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !user) return;
    setBusy(true); setMessage(''); setError('');
    const result = await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id);
    if (result.error) setError(result.error.message);
    else { await refreshProfile(); setMessage('Profile updated successfully.'); }
    setBusy(false);
  }

  return <section className="mx-auto max-w-3xl space-y-8">
    <div><p className="eyebrow">Account</p><h1 className="text-4xl font-bold tracking-tight">Profile settings</h1><p className="mt-2 text-slate-400">Manage your identity and workspace access.</p></div>
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <div className="panel"><div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-3xl font-bold text-slate-950">{(profile?.full_name ?? user?.email ?? 'S')[0].toUpperCase()}</div><h2 className="mt-5 text-xl font-semibold">{profile?.full_name || 'SecLoudive member'}</h2><p className="mt-1 text-sm text-slate-400">{user?.email}</p><span className="badge mt-5 inline-block">{profile?.role ?? 'user'}</span></div>
      <form onSubmit={submit} className="panel space-y-5"><h2 className="text-xl font-semibold">Personal details</h2><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Email<input value={user?.email ?? ''} disabled /></label>{error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}<button className="button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></form>
    </div>
  </section>;
}
