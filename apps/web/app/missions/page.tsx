import Link from 'next/link';

export const metadata = { title: 'Missions' };

export default function MissionsPage() {
  return (
    <main className="section-shell section-block">
      <p className="eyebrow">Mission map</p>
      <h1>Realistic AWS security work, introduced safely.</h1>
      <p className="hero-summary">
        Missions will move from guided simulation to controlled practical environments, with
        evidence, feedback, cleanup, and transparent safety boundaries.
      </p>
      <Link className="button button-primary" href="/">
        Return home
      </Link>
    </main>
  );
}
