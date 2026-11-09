import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (password.length < 8 || password !== confirmation) {
      setError(password.length < 8 ? 'Use at least 8 characters.' : 'Passwords do not match.');
      return;
    }
    try {
      const result = await authService.updatePassword(password);
      if (result.error) setError(result.error.message);
      else {
        setMessage('Password updated. You can now sign in with your new password.');
        window.setTimeout(() => navigate('/login'), 1200);
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to update your password.');
    }
  }

  return <section className="mx-auto max-w-md">
    <p className="eyebrow">Account recovery</p>
    <h1 className="text-4xl font-bold">Choose a new password.</h1>
    <form onSubmit={submit} className="panel mt-8 space-y-4">
      <label>New password<input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <label>Confirm password<input type="password" minLength={8} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required /></label>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <button className="button-primary w-full">Update password</button>
    </form>
    <Link to="/login" className="mt-6 block text-sm text-slate-400">Back to login</Link>
  </section>;
}
