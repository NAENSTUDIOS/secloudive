import Link from 'next/link';

export const metadata = { title: 'Jobs and internships' };

const opportunityTypes = [
  'Internships',
  'Entry-level roles',
  'Apprenticeships',
  'Fellowships',
  'Volunteer experience',
  'Contract work',
];

const plannedFeatures = [
  {
    title: 'One trusted feed',
    description:
      'Listings will be normalized from approved APIs, RSS feeds, and employer career feeds with source attribution and freshness timestamps.',
  },
  {
    title: 'Evidence-aware matching',
    description:
      'Optional matching will use the skills and evidence you choose to share. Private notes and unrelated activity will never be exposed.',
  },
  {
    title: 'A private application tracker',
    description:
      'Save opportunities and track your own stages without giving employers access to your applications by default.',
  },
];

export default function JobsPage() {
  return (
    <section>
      <p className="eyebrow">Career opportunities</p>
      <h1>Find the next place to practice.</h1>
      <p className="hero-summary">
        A privacy-first hub for remote and global security internships, entry-level roles,
        apprenticeships, fellowships, volunteer experience, and contract work.
      </p>
      <div className="portal-banner">
        <strong>Live listings are being connected safely.</strong>
        <span>
          Secloudive will use approved feeds and verified employer submissions, not unlicensed
          scraping or invented listings.
        </span>
        <Link className="button button-primary" href="/register">
          Join the early access list
        </Link>
      </div>
      <div className="jobs-controls" aria-label="Opportunity search preview">
        <label>
          Search
          <input disabled placeholder="Role, skill, or organization" type="search" />
        </label>
        <label>
          Work mode
          <select disabled defaultValue="remote">
            <option value="remote">Remote first</option>
          </select>
        </label>
        <button className="button button-secondary" disabled type="button">
          Save alert · sign in required
        </button>
      </div>
      <div className="jobs-layout">
        <aside className="jobs-filter-card">
          <h2>Explore by type</h2>
          <ul>
            {opportunityTypes.map((type) => (
              <li key={type}>
                <span>{type}</span>
                <span className="portal-muted">Coming soon</span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="jobs-results">
          <div className="jobs-results-heading">
            <div>
              <p className="eyebrow">Opportunity stream</p>
              <h2>Source-backed listings only</h2>
            </div>
            <span className="portal-muted">No live feed connected yet</span>
          </div>
          <div className="jobs-empty">
            <span className="card-number">01</span>
            <h2>Your search will stay honest.</h2>
            <p>
              Once approved providers are connected, every listing will show its source, original
              listing ID, last verification time, expiry status, and a direct application link.
            </p>
            <Link className="text-link" href="/privacy">
              Read how opportunity data will be handled →
            </Link>
          </div>
        </div>
      </div>
      <div className="portal-grid jobs-feature-grid">
        {plannedFeatures.map((feature, index) => (
          <article className="portal-card" key={feature.title}>
            <span className="card-number">0{index + 2}</span>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
      <div className="reading-callout jobs-safety-callout">
        <strong>Safety promise</strong>
        <span>
          Secloudive will never ask for application passwords, charge learners to apply, expose a
          private profile without consent, or present an unverified employer as trusted.
        </span>
      </div>
    </section>
  );
}
