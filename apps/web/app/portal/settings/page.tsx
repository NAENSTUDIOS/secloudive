import Link from 'next/link';

export const metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <section className="portal-empty">
      <p className="eyebrow">Privacy and settings</p>
      <h1>Control your account and data.</h1>
      <p className="hero-summary">
        Privacy preferences, AI memory, sessions, exports, and account deletion will be managed here
        after authentication is connected.
      </p>
      <Link className="button button-primary" href="/login">
        Log in securely
      </Link>
    </section>
  );
}
