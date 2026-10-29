import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { FoundationModule } from '@secloudive/content-schema';

const contentRoot = path.join(process.cwd(), '..', '..', 'content', 'foundations');

const moduleFiles: Record<string, string> = {
  'linux-permissions': path.join(contentRoot, 'linux', 'linux-permissions.json'),
  'cidr-and-subnets': path.join(contentRoot, 'networking', 'cidr-and-subnets.json'),
};

export function generateStaticParams() {
  return Object.keys(moduleFiles).map((moduleId) => ({ moduleId }));
}

async function loadModule(moduleId: string): Promise<FoundationModule | null> {
  const filePath = moduleFiles[moduleId];
  if (!filePath) return null;
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as FoundationModule;
  } catch {
    return null;
  }
}

export default async function FoundationModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = await loadModule(moduleId);

  if (!module) notFound();

  const domainLabel = module.domain.charAt(0).toUpperCase() + module.domain.slice(1);
  const eyebrow = `${domainLabel} foundation · ${module.estimatedMinutes} minutes`;

  return (
    <article className="reading-page">
      <Link className="text-link" href="/portal/foundations">
        ← All foundations
      </Link>
      <p className="eyebrow reading-eyebrow">{eyebrow}</p>
      <h1>{module.title}</h1>

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
          {module.learningObjectives.map((obj) => (
            <li key={obj.id}>{obj.statement}</li>
          ))}
        </ul>
      </section>

      {module.body.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <section className="reading-section" key={index} aria-labelledby={`block-${index}`}>
              <h2 id={`block-${index}`}>{block.value}</h2>
            </section>
          );
        }
        if (block.type === 'callout') {
          return (
            <div className="reading-callout" key={index}>
              <strong>Practice principle</strong>
              <span>{block.value}</span>
            </div>
          );
        }
        return (
          <section className="reading-section" key={index}>
            <p>{block.value}</p>
          </section>
        );
      })}

      {module.relatedAwsConcepts.length > 0 && (
        <section className="reading-section" aria-labelledby="connections-title">
          <h2 id="connections-title">Connected AWS concepts</h2>
          <div className="tag-list">
            {module.relatedAwsConcepts.map((concept) => (
              <span className="topic-tag" key={concept}>{concept}</span>
            ))}
          </div>
        </section>
      )}

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
