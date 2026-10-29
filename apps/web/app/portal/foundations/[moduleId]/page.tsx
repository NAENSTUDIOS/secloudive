import Link from 'next/link';
import { notFound } from 'next/navigation';

const modules = {
  'linux-permissions': {
    eyebrow: 'Linux foundation · 20 minutes',
    title: 'Linux permissions: making access intentional',
    summary:
      'Learn the reasoning pattern behind owners, groups, permission bits, and least privilege.',
    objectives: [
      'Explain how owners, groups, and permission bits control access.',
      'Identify access that is broader than the job requires.',
    ],
    concepts: 'Least privilege · EC2 access · IAM policy review',
  },
  'cidr-and-subnets': {
    eyebrow: 'Networking foundation · 25 minutes',
    title: 'CIDR and subnets: reasoning about network boundaries',
    summary: 'Build the network reasoning needed for VPCs, routing, and isolation decisions.',
    objectives: [
      'Explain how a CIDR prefix describes an address range.',
      'Choose a boundary that fits connectivity and isolation needs.',
    ],
    concepts: 'VPC · Subnets · Route tables · Security groups',
  },
} as const;

export function generateStaticParams() {
  return Object.keys(modules).map((moduleId) => ({ moduleId }));
}

export default async function FoundationModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const foundation = modules[moduleId as keyof typeof modules];

  if (!foundation) {
    notFound();
  }

  return (
    <article className="reading-page">
      <Link className="text-link" href="/portal/foundations">
        ← All foundations
      </Link>
      <p className="eyebrow reading-eyebrow">{foundation.eyebrow}</p>
      <h1>{foundation.title}</h1>
      <p className="hero-summary">{foundation.summary}</p>
      <div className="portal-banner">
        <strong>Reading preview</strong>
        <span>Sign in to save notes, complete checks, and sync evidence.</span>
        <Link className="button button-primary" href="/login">
          Log in securely
        </Link>
      </div>
      <section className="reading-section" aria-labelledby="objectives-title">
        <h2 id="objectives-title">By the end, you can</h2>
        <ul className="reading-list">
          {foundation.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>
      <section className="reading-section" aria-labelledby="lesson-title">
        <h2 id="lesson-title">Why this matters</h2>
        <p>
          Security work begins by identifying the actor, the resource, and the action, then deciding
          what access is justified. That reasoning transfers from local systems to AWS identity and
          network controls.
        </p>
        <div className="reading-callout">
          <strong>Practice principle</strong>
          <span>
            Convenience is not evidence that access is necessary. A secure decision explains the
            smallest scope that supports the task.
          </span>
        </div>
      </section>
      <section className="reading-section" aria-labelledby="connections-title">
        <h2 id="connections-title">Connected AWS concepts</h2>
        <p>{foundation.concepts}</p>
      </section>
      <div className="reading-actions">
        <button className="button button-secondary" disabled type="button">
          Save note · sign in required
        </button>
        <button className="button button-primary" disabled type="button">
          Start knowledge check · coming next
        </button>
      </div>
    </article>
  );
}
