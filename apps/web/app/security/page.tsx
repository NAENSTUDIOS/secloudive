import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Security' };

const controls = [
  {
    title: 'Authentication',
    description:
      'Cognito-backed authentication with email verification, password minimums, and Google OAuth. Session tokens are short-lived and server-validated.',
  },
  {
    title: 'Authorisation',
    description:
      'Role-based access control with least-privilege permissions. Every API action is checked against the authenticated session before execution.',
  },
  {
    title: 'Data in transit',
    description:
      'All connections use TLS. HTTP requests are redirected to HTTPS. HSTS is enforced on production domains.',
  },
  {
    title: 'Data at rest',
    description:
      'Database encryption at rest is enabled. Credentials and secrets are stored in environment variables, never in source code.',
  },
  {
    title: 'AWS practice isolation',
    description:
      'Controlled practice environments use dedicated AWS accounts, SCPs, budget alerts, and automatic cleanup. No learner can affect another learner\'s environment.',
  },
  {
    title: 'Dependency management',
    description:
      'Dependencies are pinned and audited. Security advisories are reviewed and patched promptly. The lockfile is committed and verified in CI.',
  },
];

export default function SecurityPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="security-title">
          <p className="eyebrow">Security center</p>
          <h1 id="security-title">Safety is part of the learning design.</h1>
          <p className="hero-summary">
            Simulation comes first. Managed AWS practice uses temporary credentials, isolation,
            budgets, cleanup, and auditability. Security is not an add-on.
          </p>
        </section>

        <section
          className="section-shell section-block muted-section"
          aria-labelledby="controls-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Platform controls</p>
            <h2 id="controls-title">How the platform protects you.</h2>
          </div>
          <div className="card-grid three-columns">
            {controls.map((item, index) => (
              <article className="feature-card" key={item.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="disclosure-title">
          <div className="section-heading">
            <p className="eyebrow">Responsible disclosure</p>
            <h2 id="disclosure-title">Found a vulnerability?</h2>
            <p>
              If you discover a security issue in Secloudive, please report it responsibly. Do not
              exploit the issue or access data that does not belong to you.
            </p>
          </div>
          <div className="reading-callout" style={{ maxWidth: '640px' }}>
            <strong>How to report</strong>
            <span>
              Send a description of the issue, the affected URL or component, and steps to reproduce
              to the security contact listed in the repository. We will acknowledge receipt within
              two business days and keep you informed of progress.
            </span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
