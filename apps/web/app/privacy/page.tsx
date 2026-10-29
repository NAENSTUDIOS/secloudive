import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Privacy' };

const principles = [
  {
    title: 'Private by default',
    description:
      'Notes, progress, portfolio drafts, and private conversations are not public by default. You choose what to share and with whom.',
  },
  {
    title: 'No surveillance learning',
    description:
      'Secloudive does not track time-on-page, idle time, or behavioural patterns to infer engagement. Progress is based on demonstrated work.',
  },
  {
    title: 'Explicit AI boundaries',
    description:
      'AI features operate within boundaries you control. Private notes are not used as AI context without your explicit opt-in.',
  },
  {
    title: 'Minimal data collection',
    description:
      'Only data necessary to provide the service is collected. Analytics are aggregated and do not identify individual learners without consent.',
  },
  {
    title: 'Transparent sharing',
    description:
      'If a feature shares your data with a third party, it will be clearly labelled before you use it. No silent data sharing.',
  },
  {
    title: 'Right to delete',
    description:
      'You can request deletion of your account and associated data at any time. Deletion is permanent and confirmed.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="privacy-title">
          <p className="eyebrow">Privacy</p>
          <h1 id="privacy-title">Private by default.</h1>
          <p className="hero-summary">
            Secloudive is designed around user-controlled data, clear AI boundaries, and explicit
            sharing. Detailed policy text will be published before accounts open.
          </p>
        </section>

        <section
          className="section-shell section-block muted-section"
          aria-labelledby="principles-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Design principles</p>
            <h2 id="principles-title">How we think about your data.</h2>
          </div>
          <div className="card-grid three-columns">
            {principles.map((item, index) => (
              <article className="feature-card" key={item.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="consent-title">
          <div className="section-heading">
            <p className="eyebrow">Consent model</p>
            <h2 id="consent-title">You decide what is shared.</h2>
          </div>
          <div className="card-grid three-columns">
            <article className="feature-card">
              <span className="card-number">Analytics</span>
              <h3>Off by default</h3>
              <p>Aggregate usage analytics require explicit opt-in during account setup.</p>
            </article>
            <article className="feature-card">
              <span className="card-number">AI memory</span>
              <h3>Off by default</h3>
              <p>
                The AI mentor does not retain context between sessions unless you enable AI memory.
              </p>
            </article>
            <article className="feature-card">
              <span className="card-number">Portfolio</span>
              <h3>Private by default</h3>
              <p>
                Evidence and portfolio items are private until you explicitly share them with a
                reviewer.
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
