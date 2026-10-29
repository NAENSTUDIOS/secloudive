import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Accessibility' };

const commitments = [
  {
    title: 'Keyboard navigation',
    description:
      'Every interactive element is reachable and operable by keyboard. Focus indicators are visible and meet contrast requirements.',
  },
  {
    title: 'Screen reader support',
    description:
      'Semantic HTML, ARIA labels, and landmark regions are used throughout. Dynamic content changes are announced appropriately.',
  },
  {
    title: 'Colour contrast',
    description:
      'Text and interactive elements meet WCAG 2.2 AA contrast ratios. Colour is never the only means of conveying information.',
  },
  {
    title: 'Reduced motion',
    description:
      'Animations and transitions respect the prefers-reduced-motion media query. No content relies on motion to be understood.',
  },
  {
    title: 'Readable typography',
    description:
      'Text can be resized up to 200% without loss of content or functionality. Line length and spacing support readability.',
  },
  {
    title: 'Practical alternatives',
    description:
      'Where a practical exercise requires a specific interaction model, an accessible alternative will be provided.',
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="a11y-title">
          <p className="eyebrow">Accessibility</p>
          <h1 id="a11y-title">Learning should be accessible to more people.</h1>
          <p className="hero-summary">
            Secloudive targets WCAG 2.2 AA conformance. Accessibility is treated as a design
            requirement, not an afterthought.
          </p>
        </section>

        <section
          className="section-shell section-block muted-section"
          aria-labelledby="commitments-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Our commitments</p>
            <h2 id="commitments-title">What we are building toward.</h2>
          </div>
          <div className="card-grid three-columns">
            {commitments.map((item, index) => (
              <article className="feature-card" key={item.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="feedback-title">
          <div className="section-heading">
            <p className="eyebrow">Feedback</p>
            <h2 id="feedback-title">Found a barrier? Tell us.</h2>
            <p>
              If you encounter an accessibility issue, we want to know. Accessibility feedback is
              treated as a high-priority issue.
            </p>
          </div>
          <div className="reading-callout" style={{ maxWidth: '640px' }}>
            <strong>How to report an issue</strong>
            <span>
              Use the security contact on the{' '}
              <Link className="text-link" href="/security">
                Security page
              </Link>{' '}
              to report accessibility barriers. Include the page URL and a description of the
              problem.
            </span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
