import Link from 'next/link';

const foundations = ['Linux', 'Networking', 'Python', 'Git and GitHub', 'Docker', 'CI/CD'];

const missions = [
  'Investigate suspicious IAM activity',
  'Secure a production-style AWS foundation',
  'Respond to a compromised access key',
];

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Secloudive home">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          Secloudive
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#foundations">Foundations</a>
          <a href="#missions">Missions</a>
          <a href="#safety">Safety</a>
          <a className="button button-quiet" href="/login">
            Log in
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">AWS security, learned through real work</p>
            <h1 id="hero-title">Build the judgment to secure cloud systems.</h1>
            <p className="hero-summary">
              Secloudive combines technical foundations, guided practice, realistic security
              missions, and evidence-based feedback into one learning path.
            </p>
            <div className="action-row">
              <a className="button button-primary" href="/register">
                Start your journey
              </a>
              <a className="button button-secondary" href="#missions">
                Explore missions
              </a>
            </div>
            <p className="microcopy">
              Start with safe simulation. Progress toward controlled AWS practice.
            </p>
          </div>
          <div className="hero-panel" aria-label="Secloudive learning loop">
            <span className="panel-label">The learning loop</span>
            <ol className="learning-loop">
              <li>
                <strong>Learn</strong>
                <span>Understand the system</span>
              </li>
              <li>
                <strong>Practice</strong>
                <span>Apply the concept safely</span>
              </li>
              <li>
                <strong>Investigate</strong>
                <span>Reason with incomplete evidence</span>
              </li>
              <li>
                <strong>Prove</strong>
                <span>Build trustworthy evidence</span>
              </li>
            </ol>
          </div>
        </section>

        <section
          className="section-shell section-block"
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Designed for durable skill</p>
            <h2 id="how-title">From foundations to professional decisions.</h2>
            <p>Every step connects to a skill, a practical outcome, and a next action.</p>
          </div>
          <div className="card-grid three-columns">
            <article className="feature-card">
              <span className="card-number">01</span>
              <h3>Build the foundation</h3>
              <p>
                Learn Linux, networking, Python, GitHub, containers, CI/CD, and cloud fundamentals
                inside the platform.
              </p>
            </article>
            <article className="feature-card">
              <span className="card-number">02</span>
              <h3>Work through uncertainty</h3>
              <p>
                Investigate realistic AWS security situations with guided hints instead of
                memorizing a script.
              </p>
            </article>
            <article className="feature-card">
              <span className="card-number">03</span>
              <h3>Earn evidence</h3>
              <p>
                Turn decisions, reports, and remediation plans into private, reviewable portfolio
                artifacts.
              </p>
            </article>
          </div>
        </section>

        <section
          className="section-shell section-block muted-section"
          id="foundations"
          aria-labelledby="foundations-title"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Foundation Academy</p>
              <h2 id="foundations-title">No missing prerequisites.</h2>
            </div>
            <p>
              Diagnostic-based paths meet learners where they are, then connect every foundation to
              AWS security work.
            </p>
          </div>
          <div className="tag-list" aria-label="Foundation topics">
            {foundations.map((foundation) => (
              <span className="topic-tag" key={foundation}>
                {foundation}
              </span>
            ))}
          </div>
          <a className="text-link" href="/foundations">
            Explore the foundations <span aria-hidden="true">→</span>
          </a>
        </section>

        <section
          className="section-shell section-block"
          id="missions"
          aria-labelledby="missions-title"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Mission map</p>
              <h2 id="missions-title">Practice the work security teams do.</h2>
            </div>
            <p>
              Start guided, then move toward open-ended investigations with evidence, feedback, and
              safe boundaries.
            </p>
          </div>
          <div className="mission-list">
            {missions.map((mission, index) => (
              <Link className="mission-card" href="/missions" key={mission}>
                <span>0{index + 1}</span>
                <strong>{mission}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="section-shell section-block safety-section"
          id="safety"
          aria-labelledby="safety-title"
        >
          <div className="safety-copy">
            <p className="eyebrow">Safe by design</p>
            <h2 id="safety-title">Realism without reckless access.</h2>
            <p>
              Simulation comes first. Advanced practice uses explicit boundaries, temporary
              credentials, budget controls, cleanup, and auditability.
            </p>
          </div>
          <ul className="safety-list">
            <li>Private by default</li>
            <li>Temporary access</li>
            <li>Transparent AWS costs</li>
            <li>Progress based on evidence</li>
          </ul>
        </section>

        <section className="cta-section section-shell" aria-labelledby="cta-title">
          <p className="eyebrow">Start with the right next step</p>
          <h2 id="cta-title">Your path should reflect your current skills and your ambition.</h2>
          <a className="button button-primary" href="/register">
            Create your account
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            Secloudive
          </Link>
          <p>Practical AWS security learning through foundations, missions, and evidence.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/accessibility">Accessibility</a>
          <a href="/security">Security</a>
        </nav>
      </footer>
    </>
  );
}
