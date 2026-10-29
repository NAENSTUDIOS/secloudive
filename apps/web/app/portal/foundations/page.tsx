import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Foundations Academy' };

const topics = [
  {
    title: 'Linux',
    description: 'Permissions, processes, logs, and secure administration.',
    moduleId: 'linux-permissions',
  },
  {
    title: 'Networking',
    description: 'IP, routing, DNS, TLS, and cloud network reasoning.',
    moduleId: 'cidr-and-subnets',
  },
  {
    title: 'Python',
    description: 'Automation, APIs, JSON, testing, and AWS security utilities.',
    moduleId: 'python-basics',
  },
  {
    title: 'Git and GitHub',
    description: 'Version control, review, repository security, and collaboration.',
    moduleId: 'git-github-fundamentals',
  },
  {
    title: 'Docker',
    description: 'Images, containers, secrets, and secure runtime practices.',
    moduleId: 'docker-containers',
  },
  {
    title: 'CI/CD',
    description: 'Pipelines, scanning, approvals, and secure delivery.',
    moduleId: 'cicd-pipelines',
  },
];

export default function FoundationsPortalPage() {
  return (
    <section>
      <p className="eyebrow">Foundation Academy</p>
      <h1>Build the essentials before the incident.</h1>
      <p className="hero-summary">
        Each foundation connects to AWS security skills, practical exercises, and role evidence.
      </p>
      <div className="portal-banner">
        <strong>Reading previews are open.</strong>
        <span>Sign in to track progress, save notes, and complete knowledge checks.</span>
        <Link className="button button-primary" href="/login">
          Log in securely
        </Link>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => (
          <article className="topic-card" key={topic.title}>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <Link className="text-link" href={`/portal/foundations/${topic.moduleId}`}>
              Open reading preview →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
