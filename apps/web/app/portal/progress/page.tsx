import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Progress' };

const domains = [
  { label: 'Linux', domain: 'linux', available: true, moduleId: 'linux-permissions' },
  { label: 'Networking', domain: 'networking', available: true, moduleId: 'cidr-and-subnets' },
  { label: 'Python', domain: 'python', available: false },
  { label: 'Git and GitHub', domain: 'git_github', available: false },
  { label: 'Docker', domain: 'docker', available: false },
  { label: 'CI/CD', domain: 'ci_cd', available: false },
];

export default function ProgressPage() {
  return (
    <section>
      <p className="eyebrow">Progress and skills</p>
      <h1>Evidence before percentages.</h1>
      <p className="hero-summary">
        Your skill map shows what you have demonstrated, what needs practice, and why the next step
        is recommended. Progress is based on knowledge checks and mission evidence, not page views.
      </p>

      <div className="progress-skill-map">
        <div className="progress-map-header">
          <h2>Foundation skill map</h2>
          <span className="portal-muted">Levels update after knowledge checks</span>
        </div>
        <div className="topic-grid">
          {domains.map((d) => (
            <article className="topic-card progress-domain-card" key={d.domain}>
              <div className="progress-domain-header">
                <h3>{d.label}</h3>
                <span className="progress-level-badge progress-level-not-started">
                  Not started
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '0%' }} />
              </div>
              <p className="microcopy">0 of 1 modules completed</p>
              {d.available && d.moduleId ? (
                <Link className="text-link" href={`/portal/foundations/${d.moduleId}`}>
                  Start module →
                </Link>
              ) : (
                <span className="portal-muted">Coming soon</span>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="progress-evidence-section">
        <h2>Evidence items</h2>
        <p className="hero-summary">
          Completed knowledge checks, mission reports, and reviewed work will appear here as
          private, exportable evidence of your skills.
        </p>
        <div className="portal-banner">
          <strong>No evidence yet.</strong>
          <span>Complete a knowledge check or mission to create your first evidence item.</span>
          <Link className="button button-primary" href="/portal/foundations">
            Start a foundation
          </Link>
        </div>
      </div>
    </section>
  );
}
