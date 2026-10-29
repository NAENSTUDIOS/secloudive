import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Missions' };

const missions = [
  {
    number: '01',
    title: 'Investigate suspicious IAM activity',
    summary:
      'An alert fires on an IAM principal making unusual API calls. Trace the activity, identify the scope of access, and produce a containment recommendation.',
    skills: ['CloudTrail analysis', 'IAM policy review', 'Incident scoping'],
    phase: 'Guided simulation',
  },
  {
    number: '02',
    title: 'Secure a production-style AWS foundation',
    summary:
      'A new AWS account has been provisioned with default settings. Identify the gaps, apply least-privilege controls, and document your decisions.',
    skills: ['Account hardening', 'SCPs', 'Config rules', 'Security Hub'],
    phase: 'Guided simulation',
  },
  {
    number: '03',
    title: 'Respond to a compromised access key',
    summary:
      'A long-lived access key has been exposed in a public repository. Contain the exposure, assess the blast radius, and remediate without disrupting the workload.',
    skills: ['Key rotation', 'CloudTrail forensics', 'Remediation planning'],
    phase: 'Guided simulation',
  },
];

const phases = [
  {
    label: 'Phase 1',
    title: 'Guided simulation',
    description:
      'Step-by-step walkthroughs with hints, explanations, and safe boundaries. No real AWS credentials required.',
  },
  {
    label: 'Phase 2',
    title: 'Open investigation',
    description:
      'The same scenario with less guidance. You decide the approach, document your reasoning, and produce evidence.',
  },
  {
    label: 'Phase 3',
    title: 'Controlled AWS practice',
    description:
      'Temporary credentials, isolated accounts, budget controls, and automatic cleanup. Real work with explicit safety boundaries.',
  },
];

export default function MissionsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="missions-hero-title">
          <p className="eyebrow">Mission map</p>
          <h1 id="missions-hero-title">Realistic AWS security work, introduced safely.</h1>
          <p className="hero-summary">
            Missions move from guided simulation to open investigation to controlled AWS practice.
            Every step produces evidence, not just a completion badge.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/register">
              Start your first mission
            </Link>
          </div>
        </section>

        <section
          className="section-shell section-block muted-section"
          aria-labelledby="missions-list-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Available missions</p>
            <h2 id="missions-list-title">Practice the work security teams do.</h2>
          </div>
          <div className="mission-list" style={{ marginTop: '2rem' }}>
            {missions.map((mission) => (
              <article className="mission-detail-card" key={mission.number}>
                <div className="mission-detail-header">
                  <span className="card-number">{mission.number}</span>
                  <span className="mission-phase-badge">{mission.phase}</span>
                </div>
                <h3>{mission.title}</h3>
                <p>{mission.summary}</p>
                <div className="mission-skills">
                  {mission.skills.map((skill) => (
                    <span className="topic-tag" key={skill}>{skill}</span>
                  ))}
                </div>
                <button className="button button-secondary" disabled type="button">
                  Coming soon · sign in to be notified
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="phases-title">
          <div className="section-heading">
            <p className="eyebrow">How missions progress</p>
            <h2 id="phases-title">From guided to independent to real.</h2>
          </div>
          <div className="card-grid three-columns">
            {phases.map((phase) => (
              <article className="feature-card" key={phase.label}>
                <span className="card-number">{phase.label}</span>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section-shell section-block safety-section"
          aria-labelledby="missions-safety-title"
        >
          <div className="safety-copy">
            <p className="eyebrow">Safe by design</p>
            <h2 id="missions-safety-title">Realism without reckless access.</h2>
            <p>
              Simulation comes first. Advanced practice uses explicit boundaries, temporary
              credentials, budget controls, cleanup, and auditability.
            </p>
          </div>
          <ul className="safety-list">
            <li>Simulation before real credentials</li>
            <li>Temporary, scoped AWS access</li>
            <li>Transparent cost boundaries</li>
            <li>Automatic environment cleanup</li>
          </ul>
        </section>

        <section className="cta-section section-shell" aria-labelledby="missions-cta-title">
          <p className="eyebrow">Ready to investigate</p>
          <h2 id="missions-cta-title">Start with a guided mission and build from there.</h2>
          <Link className="button button-primary" href="/register">
            Create your account
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
