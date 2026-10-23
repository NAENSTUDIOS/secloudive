/*
 * Sandbox-safe job simulation primitives.
 *
 * These scenarios model responsibilities without connecting to production
 * accounts or asking learners to use real credentials. Existing job labs,
 * incident banks, playbooks, and interviews remain the detailed content
 * sources; this file supplies their shared learning contract.
 */

const roleTemplates = {
  'cloud-engineer': {
    title: 'Junior Cloud Engineer',
    managerRequest: 'Production website is down. Investigate and communicate the next safe action.',
    tasks: ['Confirm environment and change scope', 'Trace the request path', 'Inspect logs and health signals', 'Document evidence before remediation'],
    ticket: { title: 'Create a secure production VPC', severity: 'SEV-3', acceptance: ['Private application subnets', 'Restricted ingress', 'Evidence-backed network diagram'] },
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    managerRequest: 'The deployment failed after the last merge. Find the cause and restore a safe release path.',
    tasks: ['Inspect pipeline stages and artifacts', 'Reproduce the failing check locally', 'Propose a reversible fix', 'Report deployment risk and rollback steps'],
    ticket: { title: 'Implement a tested CI/CD workflow', severity: 'SEV-3', acceptance: ['Build and test gates', 'Protected deployment environment', 'Rollback instructions'] },
  },
  'security-analyst': {
    title: 'SOC Analyst',
    managerRequest: 'Review a suspicious cloud alert, establish scope, and escalate with defensible evidence.',
    tasks: ['Validate the alert and timeline', 'Correlate identity, network, and audit events', 'Recommend containment without destroying evidence', 'Write an incident report'],
    ticket: { title: 'Investigate suspicious login activity', severity: 'SEV-2', acceptance: ['Evidence timeline', 'Risk classification', 'Escalation and containment plan'] },
  },
  'ai-engineer': {
    title: 'AI Engineer',
    managerRequest: 'The assistant is returning inconsistent answers. Improve quality without hiding uncertainty.',
    tasks: ['Define an evaluation set', 'Inspect retrieval and prompt traces', 'Measure quality and failure modes', 'Document a safe release decision'],
    ticket: { title: 'Improve an AI assistant evaluation workflow', severity: 'SEV-3', acceptance: ['Reproducible test set', 'Grounded responses', 'Known limitations and rollback plan'] },
  },
  sre: {
    title: 'Site Reliability Engineer',
    managerRequest: 'Service latency has increased. Investigate the user impact and recommend the smallest safe mitigation.',
    tasks: ['Quantify the symptom and affected users', 'Compare metrics, logs, and traces', 'Protect the error budget', 'Write a follow-up reliability action'],
    ticket: { title: 'Analyze a service latency increase', severity: 'SEV-2', acceptance: ['Impact statement', 'Hypothesis log', 'Mitigation and follow-up measure'] },
  },
  'linux-administrator': {
    title: 'Linux Administrator',
    managerRequest: 'A shared application host is failing health checks. Restore service and preserve useful evidence.',
    tasks: ['Check service, disk, memory, and permissions', 'Review recent changes and logs', 'Apply a reversible fix', 'Record the runbook update'],
    ticket: { title: 'Troubleshoot a Linux application host', severity: 'SEV-3', acceptance: ['Root-cause hypothesis', 'Safe command transcript', 'Verification and prevention steps'] },
  },
}

const dayInTheLife = [
  { time: '08:00', activity: 'Receive ticket and confirm priority, owner, and environment.' },
  { time: '09:00', activity: 'Join standup; state yesterday’s evidence, today’s plan, and blockers.' },
  { time: '10:00', activity: 'Investigate the scenario in the sandbox and keep an evidence timeline.' },
  { time: '11:00', activity: 'Update the ticket with impact, hypothesis, and next checkpoint.' },
  { time: '13:00', activity: 'Implement or simulate a reviewed change with rollback criteria.' },
  { time: '15:00', activity: 'Handle a production-style complication and re-evaluate risk.' },
  { time: '17:00', activity: 'Present the outcome, remaining risk, and follow-up work to a manager.' },
]

const incidents = [
  { id: 'sim-sev1-outage', severity: 'SEV-1', title: 'Customer-facing website unavailable', response: ['Declare incident', 'Assign incident commander', 'Capture timeline', 'Communicate at a fixed cadence'], safeBoundary: 'Use generated telemetry only; never connect to a live service.' },
  { id: 'sim-sev2-iam', severity: 'SEV-2', title: 'IAM permission change exposes a sensitive workflow', response: ['Validate scope', 'Preserve audit evidence', 'Contain in the simulator', 'Open a remediation task'], safeBoundary: 'Use synthetic identities and account identifiers.' },
  { id: 'sim-sev3-pipeline', severity: 'SEV-3', title: 'Pipeline failure blocks a release', response: ['Inspect the failing stage', 'Reproduce safely', 'Review the change', 'Document rollback and prevention'], safeBoundary: 'Run local or fixture-based pipelines only.' },
  { id: 'sim-sev4-auth', severity: 'SEV-4', title: 'Intermittent user authentication failure', response: ['Measure affected requests', 'Correlate logs', 'Create a minimal reproduction', 'Communicate a customer-safe workaround'], safeBoundary: 'Use local fixtures and test accounts.' },
]

export const jobSimulationLibrary = {
  roles: roleTemplates,
  dayInTheLife,
  incidents,
}

export function getRoleSimulation(roleId = 'cloud-engineer') {
  return roleTemplates[roleId] || roleTemplates['cloud-engineer']
}

