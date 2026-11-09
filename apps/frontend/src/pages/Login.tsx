import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiBaseUrl } from '../lib/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { error: authError } = await authService.login(email, password);
      if (authError) {
        setError(authError.message);
        return;
      }
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? '/dashboard', { replace: true });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="mx-auto max-w-md">
    <p className="eyebrow">Secure access</p>
    <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
    <p className="mt-3 text-slate-400">Sign in to your private SecLoudive workspace.</p>
    <form onSubmit={submit} className="panel mt-8 space-y-4">
      <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <p className="error">{error}</p>}
      <button className="button-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
      <div className="flex items-center gap-3 text-xs text-slate-600"><span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" /></div>
      <button type="button" className="button-secondary w-full" onClick={() => { window.location.href = `${apiBaseUrl}/auth/google`; }}>Continue with Google</button>
    </form>
    <div className="mt-6 flex justify-between text-sm text-slate-400">
      <Link to="/forgot-password">Forgot password?</Link>
      <Link to="/signup">Create account</Link>
    </div>
  </section>;
}
