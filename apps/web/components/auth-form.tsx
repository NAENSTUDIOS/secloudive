'use client';

import { FormEvent, useState } from 'react';

type AuthMode = 'login' | 'register' | 'recovery';

const copy: Record<
  AuthMode,
  { eyebrow: string; title: string; description: string; submit: string }
> = {
  login: {
    eyebrow: 'Account access',
    title: 'Welcome back.',
    description: 'Sign in securely to continue your learning journey.',
    submit: 'Continue securely',
  },
  register: {
    eyebrow: 'Start learning',
    title: 'Build your AWS security path.',
    description: 'Create an account to receive a foundation-aware learning plan.',
    submit: 'Create account',
  },
  recovery: {
    eyebrow: 'Account recovery',
    title: 'Reset your password.',
    description: 'Enter your email and we will explain the next safe recovery step.',
    submit: 'Send recovery email',
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const content = copy[mode];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const name = String(form.get('name') ?? '').trim();
    const termsAccepted = form.get('terms') === 'on';

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (mode === 'register' && name.length < 2) {
      setError('Enter your name.');
      return;
    }

    if (mode !== 'recovery' && password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }

    if (mode === 'register' && !termsAccepted) {
      setError('Accept the Terms and Privacy information to create an account.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 id="auth-title">{content.title}</h1>
        <p className="auth-description">{content.description}</p>

        {submitted ? (
          <div className="notice notice-success" role="status">
            <strong>Request recorded for this design preview.</strong>
            <p>
              The secure identity backend is not connected yet, so no credentials or personal data
              were sent.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <label>
                Name
                <input autoComplete="name" minLength={2} name="name" placeholder="Your name" required type="text" />
              </label>
            )}
            <label>
              Email address
              <input
                autoComplete="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>
            {mode !== 'recovery' && (
              <label>
                Password
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={12}
                  name="password"
                  required
                  type="password"
                />
                <span className="field-help">
                  At least 12 characters. Never reuse an important password.
                </span>
              </label>
            )}
            {mode === 'register' && (
              <label className="checkbox-row">
                <input name="terms" required type="checkbox" />
                <span>
                  I agree to the <a href="/terms">Terms</a> and acknowledge the{' '}
                  <a href="/privacy">Privacy information</a>.
                </span>
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-primary button-full" type="submit">
              {content.submit}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>or</span>
        </div>
        {mode !== 'recovery' && (
          <button className="button button-secondary button-full" disabled type="button">
            Continue with Google <span className="button-note">coming next</span>
          </button>
        )}
        <p className="auth-footer">
          {mode === 'login' ? (
            <>
              <a href="/recovery">Forgot your password?</a> ·{' '}
              <a href="/register">Create an account</a>
            </>
          ) : mode === 'register' ? (
            <>
              Already have an account? <a href="/login">Log in</a>
            </>
          ) : (
            <a href="/login">Return to login</a>
          )}
        </p>
      </section>
    </main>
  );
}
