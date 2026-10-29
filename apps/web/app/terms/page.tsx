import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Terms' };

const sections = [
  {
    title: 'Who this is for',
    body: 'Secloudive is a learning platform for individuals building AWS security skills. It is not a certification body, an employer, or a staffing agency.',
  },
  {
    title: 'What you can do',
    body: 'You may use Secloudive to learn, practise, and build evidence of your skills. You may share your own portfolio items with reviewers you choose.',
  },
  {
    title: 'What you may not do',
    body: 'You may not attempt to access AWS environments outside the boundaries provided, share credentials, misrepresent your identity, or use the platform to harm others.',
  },
  {
    title: 'Content rights',
    body: 'Secloudive content is original or explicitly licensed. You may not reproduce, redistribute, or sell platform content without written permission.',
  },
  {
    title: 'AWS practice boundaries',
    body: 'Controlled AWS practice uses temporary credentials, isolated accounts, and budget limits. Exceeding boundaries or attempting to access resources outside your session is a violation of these terms.',
  },
  {
    title: 'Account termination',
    body: 'Secloudive may suspend or terminate accounts that violate these terms. You may delete your account at any time from the settings page.',
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="terms-title">
          <p className="eyebrow">Terms</p>
          <h1 id="terms-title">Clear expectations for safe learning.</h1>
          <p className="hero-summary">
            The complete terms of service will be reviewed and published before production access is
            enabled. These are the design commitments that will inform them.
          </p>
        </section>

        <section className="section-shell section-block" aria-labelledby="terms-sections-title">
          <div className="section-heading">
            <p className="eyebrow">Design commitments</p>
            <h2 id="terms-sections-title">What the terms will cover.</h2>
          </div>
          <div className="reading-page" style={{ marginTop: '2rem' }}>
            {sections.map((section) => (
              <div className="reading-section" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
