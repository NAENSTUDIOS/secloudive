import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';

export const metadata: Metadata = { title: 'Foundation Academy' };

const topics = [
  {
    title: 'Linux',
    description:
      'Permissions, processes, logs, file systems, and secure administration. The operating layer beneath every cloud workload.',
    awsLink: 'EC2, Systems Manager, CloudWatch Logs',
    moduleId: 'linux-permissions',
    available: true,
  },
  {
    title: 'Networking',
    description:
      'IP addressing, routing, DNS, TLS, and cloud network reasoning. Required for VPC design and incident investigation.',
    awsLink: 'VPC, Route 53, CloudFront, Security Groups',
    moduleId: 'cidr-and-subnets',
    available: true,
  },
  {
    title: 'Python',
    description:
      'Automation, APIs, JSON parsing, testing, and AWS security utilities. The scripting language of cloud security work.',
    awsLink: 'Boto3, Lambda, Security Hub automation',
    available: false,
  },
  {
    title: 'Git and GitHub',
    description:
      'Version control, code review, repository security, secrets scanning, and safe collaboration practices.',
    awsLink: 'CodeCommit, CodePipeline, IAM for CI/CD',
    available: false,
  },
  {
    title: 'Docker',
    description:
      'Images, containers, secrets management, runtime security, and container scanning before deployment.',
    awsLink: 'ECR, ECS, Fargate, Inspector',
    available: false,
  },
  {
    title: 'CI/CD',
    description:
      'Pipelines, scanning gates, approval workflows, and secure delivery practices that prevent supply chain incidents.',
    awsLink: 'CodeBuild, CodeDeploy, CodePipeline',
    available: false,
  },
];

export default function FoundationsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="section-shell section-block" aria-labelledby="foundations-hero-title">
          <p className="eyebrow">Foundation Academy</p>
          <h1 id="foundations-hero-title">Build the essentials before the incident.</h1>
          <p className="hero-summary">
            Every foundation connects to AWS security skills, practical exercises, and role
            evidence. Diagnostic-based paths meet you where you are.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/register">
              Start your path
            </Link>
            <Link className="button button-secondary" href="/portal/foundations">
              Browse in portal
            </Link>
          </div>
        </section>

        <section
          className="section-shell section-block muted-section"
          aria-labelledby="diagnostic-title"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Diagnostic placement</p>
              <h2 id="diagnostic-title">No missing prerequisites.</h2>
            </div>
            <p>
              A short diagnostic maps your current level across each domain. Your path starts at the
              right step, not the beginning of a list.
            </p>
          </div>
          <div className="card-grid three-columns">
            {topics.map((topic, index) => (
              <article className="feature-card" key={topic.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <p className="microcopy">AWS connections: {topic.awsLink}</p>
                {topic.available && topic.moduleId ? (
                  <Link className="text-link" href={`/portal/foundations/${topic.moduleId}`}>
                    Read preview →
                  </Link>
                ) : (
                  <span className="portal-muted">Planned foundation</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="approach-title">
          <div className="section-heading">
            <p className="eyebrow">How foundations work</p>
            <h2 id="approach-title">Every concept connects to a real security decision.</h2>
          </div>
          <div className="card-grid three-columns">
            <article className="feature-card">
              <span className="card-number">01</span>
              <h3>Diagnostic first</h3>
              <p>
                A short assessment identifies gaps without making you repeat what you already know.
              </p>
            </article>
            <article className="feature-card">
              <span className="card-number">02</span>
              <h3>Concept to AWS</h3>
              <p>
                Each lesson ends with a direct connection to an AWS service, control, or security
                decision.
              </p>
            </article>
            <article className="feature-card">
              <span className="card-number">03</span>
              <h3>Evidence, not completion</h3>
              <p>
                Progress is based on demonstrated understanding, not page views or time spent.
              </p>
            </article>
          </div>
        </section>

        <section className="cta-section section-shell" aria-labelledby="foundations-cta-title">
          <p className="eyebrow">Start with the right foundation</p>
          <h2 id="foundations-cta-title">
            Your path should reflect your current skills and your ambition.
          </h2>
          <Link className="button button-primary" href="/register">
            Create your account
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
