import Link from 'next/link';

export const metadata = { title: 'Foundations' };

export default function FoundationsPage() {
  return (
    <main className="section-shell section-block">
      <p className="eyebrow">Foundation Academy</p>
      <h1>Build the essentials before the incident.</h1>
      <p className="hero-summary">
        Linux, networking, Python, GitHub, Docker, CI/CD, cloud, and security foundations will live
        inside Secloudive and connect directly to practical missions.
      </p>
      <Link className="button button-primary" href="/">
        Return home
      </Link>
    </main>
  );
}
