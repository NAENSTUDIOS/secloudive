import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Notes' };

const features = [
  {
    title: 'Linked to content',
    description: 'Notes attach to a foundation module or mission so you can find them in context.',
  },
  {
    title: 'Tags and folders',
    description: 'Organise notes with tags and folders. Search across all your notes at once.',
  },
  {
    title: 'Private vault',
    description:
      'A separate private vault keeps your most sensitive notes isolated from shared evidence.',
  },
  {
    title: 'Export any time',
    description: 'Export your notes as Markdown or plain text. Your knowledge stays yours.',
  },
];

export default function NotesPage() {
  return (
    <section>
      <p className="eyebrow">Notes and organiser</p>
      <h1>Your knowledge, under your control.</h1>
      <p className="hero-summary">
        Notes connect to foundations and missions, support tags and folders, and include a private
        vault that is never shared without your explicit consent.
      </p>

      <div className="notes-preview-shell">
        <div className="notes-sidebar-preview">
          <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Folders</p>
          {['All notes', 'Linux', 'Networking', 'Private vault'].map((folder) => (
            <div className="notes-folder-item portal-muted" key={folder}>{folder}</div>
          ))}
        </div>
        <div className="notes-content-preview">
          <div className="portal-banner">
            <strong>Notes are coming soon.</strong>
            <span>
              Complete a foundation module to create your first linked note.
            </span>
            <Link className="button button-primary" href="/portal/foundations">
              Go to foundations
            </Link>
          </div>
        </div>
      </div>

      <div className="card-grid three-columns" style={{ marginTop: '2rem' }}>
        {features.map((f) => (
          <article className="feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
