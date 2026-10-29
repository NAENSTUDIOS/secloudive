import Link from 'next/link';

export const metadata = { title: 'Notes' };

export default function NotesPage() {
  return (
    <section className="portal-empty">
      <p className="eyebrow">Notes and organizer</p>
      <h1>Your knowledge, under your control.</h1>
      <p className="hero-summary">
        Notes will support folders, tags, links to missions, exports, and an explicitly separate
        private vault.
      </p>
      <Link className="button button-primary" href="/login">
        Log in securely
      </Link>
    </section>
  );
}
