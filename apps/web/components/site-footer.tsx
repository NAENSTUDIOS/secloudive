import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
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
  );
}
