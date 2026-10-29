import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Secloudive home">
        <span className="brand-mark" aria-hidden="true">S</span>
        Secloudive
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="/#how-it-works">How it works</a>
        <a href="/#foundations">Foundations</a>
        <a href="/#missions">Missions</a>
        <a href="/#safety">Safety</a>
        <Link className="button button-quiet" href="/login">Log in</Link>
      </nav>
    </header>
  );
}
