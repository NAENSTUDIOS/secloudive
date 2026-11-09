import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

type Mode = 'login' | 'signup' | 'forgot';

export function AuthPage({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const result = await authService.login(email, password);
        if (result.error) setError(result.error.message);
        else navigate((location.state as { from?: string } | null)?.from ?? '/dashboard');
      } else if (mode === 'signup') {
        const result = await authService.register(email, password, name);
        if (result.error) setError(result.error.message);
        else setMessage('Account created. Check your email to confirm your address.');
      } else {
        const result = await authService.sendPasswordReset(email);
        if (result.error) setError(result.error.message);
        else setMessage('If an account exists, a recovery link has been sent.');
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password';
  return <section className="mx-auto max-w-md">
    <div className="mb-8">
      <p className="eyebrow">Secure access</p>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-400">Your workspace is private by default and protected by Supabase Auth.</p>
    </div>
    <form onSubmit={submit} className="panel space-y-4">
      {mode === 'signup' && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>}
      <label>Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      {mode !== 'forgot' && <label>Password<input type="password" minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <button className="button-primary w-full" disabled={busy}>{busy ? 'Working…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}</button>
    </form>
    <div className="mt-6 flex justify-between text-sm text-slate-400">
      {mode === 'login' ? <><Link to="/forgot-password">Forgot password?</Link><Link to="/signup">Create account</Link></> : <Link to="/login">Back to login</Link>}
    </div>
  </section>;
}
