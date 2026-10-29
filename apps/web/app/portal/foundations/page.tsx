import Link from 'next/link';

const topics = [
  ['Linux', 'Permissions, processes, logs, and secure administration.', 'linux-permissions'],
  ['Networking', 'IP, routing, DNS, TLS, and cloud network reasoning.', 'cidr-and-subnets'],
  ['Git and GitHub', 'Version control, review, repository security, and collaboration.'],
  ['Python', 'Automation, APIs, JSON, testing, and AWS security utilities.'],
  ['Docker', 'Images, containers, secrets, and secure runtime practices.'],
  ['CI/CD', 'Pipelines, scanning, approvals, and secure delivery.'],
];

export const metadata = { title: 'Foundations Academy' };

export default function FoundationsPortalPage() {
  return (
    <section>
      <p className="eyebrow">Foundation Academy</p>
      <h1>Build the essentials before the incident.</h1>
      <p className="hero-summary">
        Each foundation connects to AWS security skills, practical exercises, and role evidence.
      </p>
      <div className="portal-banner">
        <strong>Sign in to track learning.</strong>
        <span>Content access and progress will be permission-aware.</span>
        <Link className="button button-primary" href="/login">
          Log in securely
        </Link>
      </div>
      <div className="topic-grid">
        {topics.map(([title, description, moduleId]) => (
          <article className="topic-card" key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
            {moduleId ? (
              <Link className="text-link" href={`/portal/foundations/${moduleId}`}>
                Open reading preview →
              </Link>
            ) : (
              <span className="portal-muted">Planned foundation</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
