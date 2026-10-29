import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="section-shell section-block">
      <p className="eyebrow">404</p>
      <h1>That page is not available.</h1>
      <p className="hero-summary">The link may be outdated or the page may have moved.</p>
      <Link className="button button-primary" href="/">
        Return home
      </Link>
    </main>
  );
}
