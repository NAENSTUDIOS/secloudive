import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const { data, error: authError } = await authService.register(email, password, name);
      if (authError) {
        setError(authError.message);
        return;
      }
      if (data.session) navigate('/dashboard', { replace: true });
      else setMessage('Account created. Check your email to confirm your address.');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to create your account.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="mx-auto max-w-md">
    <p className="eyebrow">Secure access</p>
    <h1 className="text-4xl font-bold tracking-tight">Create your account</h1>
    <p className="mt-3 text-slate-400">Start building your private security workspace.</p>
    <form onSubmit={submit} className="panel mt-8 space-y-4">
      <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <button className="button-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
    <Link to="/login" className="mt-6 block text-sm text-slate-400">Already have an account? Log in</Link>
  </section>;
}
