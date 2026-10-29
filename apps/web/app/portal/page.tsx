import Link from 'next/link';

export const metadata = { title: 'Learner dashboard' };

export default function PortalPage() {
  return (
    <section>
      <p className="eyebrow">Learner dashboard</p>
      <h1>Your next useful step.</h1>
      <p className="hero-summary">
        Sign in to see your plan, skill evidence, missions, notes, and privacy-controlled
        recommendations.
      </p>
      <div className="portal-banner">
        <strong>Authentication is required.</strong>
        <span>This preview does not load or invent learner data.</span>
        <Link className="button button-primary" href="/login">
          Log in securely
        </Link>
      </div>
      <div className="portal-grid">
        <article className="portal-card">
          <span className="card-number">01</span>
          <h2>Foundations</h2>
          <p>Build Linux, networking, Python, GitHub, Docker, CI/CD, and cloud fundamentals.</p>
          <Link className="text-link" href="/portal/foundations">
            Explore foundations →
          </Link>
        </article>
        <article className="portal-card">
          <span className="card-number">02</span>
          <h2>Evidence</h2>
          <p>Progress will be based on demonstrated work, not page views or streak length.</p>
          <span className="portal-muted">Available after sign-in</span>
        </article>
        <article className="portal-card">
          <span className="card-number">03</span>
          <h2>AI mentor</h2>
          <p>Context-controlled guidance will help you reason without taking over the work.</p>
          <span className="portal-muted">Available after sign-in</span>
        </article>
      </div>
    </section>
  );
}
