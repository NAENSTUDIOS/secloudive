import type { AcademyPath, AcademyResource, Lab, ModuleDetail, Scenario } from '../types';

export const mockPaths: AcademyPath[] = [
  {
    id: 'path-cloud-foundations',
    slug: 'cloud-security-foundations',
    track: 'core',
    level: 'Beginner',
    title: 'Cloud Security Foundations',
    description: 'Identity, networking, data protection, and shared responsibility.',
    moduleIds: ['module-identity', 'module-networking', 'module-data-protection'],
    published: true,
  },
  {
    id: 'path-aws-security',
    slug: 'aws-security',
    track: 'aws',
    level: 'Intermediate',
    title: 'AWS Security Engineering',
    description: 'Build practical controls for identity, workloads, and cloud visibility.',
    moduleIds: ['module-identity', 'module-aws-logging'],
    published: true,
  },
];

export const mockModules: ModuleDetail[] = [
  {
    id: 'module-identity',
    track: 'core',
    level: 'Beginner',
    title: 'Identity and access fundamentals',
    summary: 'Apply least privilege and strong authentication.',
    estimatedMinutes: 35,
    prerequisites: [],
    body: 'Identity is the control plane for every cloud workload.',
    keyConcepts: ['least privilege', 'MFA', 'role-based access'],
    quiz: [
      { question: 'What does least privilege mean?', options: ['All users are admins', 'Only required access is granted', 'Access is never reviewed'], answerIndex: 1, explanation: 'Grant only the permissions needed for the task.' },
    ],
    resourceIds: ['resource-iam-guide'],
    labId: 'lab-iam-review',
  },
  {
    id: 'module-networking',
    track: 'core',
    level: 'Beginner',
    title: 'Secure cloud networking',
    summary: 'Segment networks and reduce unintended exposure.',
    estimatedMinutes: 40,
    prerequisites: ['module-identity'],
    body: 'Network boundaries make trust assumptions explicit.',
    keyConcepts: ['segmentation', 'egress', 'private endpoints'],
    quiz: [],
    resourceIds: ['resource-networking-guide'],
    labId: null,
  },
  {
    id: 'module-data-protection',
    track: 'core',
    level: 'Beginner',
    title: 'Protecting cloud data',
    summary: 'Use encryption, classification, and safe retention defaults.',
    estimatedMinutes: 30,
    prerequisites: ['module-networking'],
    body: 'Data protection combines technical and operational controls.',
    keyConcepts: ['encryption', 'classification', 'retention'],
    quiz: [],
    resourceIds: ['resource-data-guide'],
    labId: null,
  },
  {
    id: 'module-aws-logging',
    track: 'aws',
    level: 'Intermediate',
    title: 'AWS audit visibility',
    summary: 'Centralize and protect audit events.',
    estimatedMinutes: 45,
    prerequisites: ['module-identity'],
    body: 'Useful audit trails are complete, centralized, and tamper resistant.',
    keyConcepts: ['CloudTrail', 'central logging', 'alerting'],
    quiz: [],
    resourceIds: ['resource-aws-logging'],
    labId: null,
  },
];

export const mockScenarios: Scenario[] = [
  { id: 'scenario-public-bucket', title: 'Investigate a public bucket', role: 'Cloud security analyst', level: 'Beginner', summary: 'Triage an exposed object store and contain the incident.', durationMinutes: 20 },
  { id: 'scenario-compromised-role', title: 'Respond to a compromised role', role: 'Incident responder', level: 'Intermediate', summary: 'Identify suspicious role activity and preserve evidence.', durationMinutes: 30 },
];

export const mockLabs: Lab[] = [
  { id: 'lab-iam-review', provider: 'SeCloudive emulator', title: 'Review IAM permissions', emulator: 'cloud-security-sandbox', steps: ['List identities and roles', 'Identify excessive permissions', 'Recommend a least-privilege policy'], teardown: ['Delete temporary policies', 'Remove test identities'], costWarning: 'This emulator is free; verify billing before using a real cloud account.' },
];

export const mockResources: AcademyResource[] = [
  { id: 'resource-iam-guide', title: 'IAM least-privilege guide', url: '/resources/iam-least-privilege', provider: 'SeCloudive', track: 'core', level: 'Beginner', type: 'doc', isFree: true, summary: 'A practical guide to reviewing access.' },
  { id: 'resource-networking-guide', title: 'Cloud network segmentation', url: '/resources/network-segmentation', provider: 'SeCloudive', track: 'core', level: 'Beginner', type: 'course', isFree: true, summary: 'Learn to design safer network boundaries.' },
  { id: 'resource-data-guide', title: 'Cloud data protection', url: '/resources/data-protection', provider: 'SeCloudive', track: 'core', level: 'Beginner', type: 'doc', isFree: true, summary: 'Encryption and retention essentials.' },
  { id: 'resource-aws-logging', title: 'AWS audit logging', url: '/resources/aws-audit-logging', provider: 'SeCloudive', track: 'aws', level: 'Intermediate', type: 'lab', isFree: true, summary: 'Build a centralized audit trail.' },
];

export const academyMocks = { paths: mockPaths, modules: mockModules, scenarios: mockScenarios, labs: mockLabs, resources: mockResources };
