import Link from 'next/link';

export const metadata = { title: 'Progress' };

export default function ProgressPage() {
  return (
    <section className="portal-empty">
      <p className="eyebrow">Progress and skills</p>
      <h1>Evidence before percentages.</h1>
      <p className="hero-summary">
        Your skill map will show what you have demonstrated, what needs practice, and why the next
        step is recommended.
      </p>
      <Link className="button button-primary" href="/login">
        Log in securely
      </Link>
    </section>
  );
}
