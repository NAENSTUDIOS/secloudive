/*
 * Curated learning metadata for the existing Academy resource surface.
 *
 * URLs intentionally point to first-party documentation or first-party
 * learning platforms. Certification names are references, not claims that an
 * exam is current; verify the provider's current exam guide before booking.
 */

import { jobSimulationLibrary, getRoleSimulation } from './jobSimulationLibrary.js'

const LEVELS = [
  ['Introduction', 'Define the problem, vocabulary, and where the technology fits.'],
  ['Beginner Fundamentals', 'Follow a guided setup and explain the core primitives.'],
  ['Intermediate Concepts', 'Design a small solution and troubleshoot expected failures.'],
  ['Advanced Concepts', 'Compare trade-offs, reliability concerns, and security controls.'],
  ['Real-World Projects', 'Build a portfolio project with tests, documentation, and review evidence.'],
  ['Certification Preparation', 'Map the concepts to the provider objectives and practice questions.'],
  ['Interview Preparation', 'Explain decisions, failure modes, and operational trade-offs aloud.'],
  ['Production Deployment', 'Release safely with least privilege, observability, rollback, and cost controls.'],
  ['Expert Mastery', 'Evaluate new designs, mentor others, and contribute reusable patterns.'],
]

const TRACK_DEFINITIONS = [
  ['cloud-computing', 'Cloud Computing', 'https://www.cncf.io/people/'],
  ['aws', 'AWS', 'https://docs.aws.amazon.com/'],
  ['azure', 'Microsoft Azure', 'https://learn.microsoft.com/azure/'],
  ['google-cloud', 'Google Cloud', 'https://cloud.google.com/docs'],
  ['docker', 'Docker', 'https://docs.docker.com/'],
  ['kubernetes', 'Kubernetes', 'https://kubernetes.io/docs/'],
  ['terraform', 'Terraform', 'https://developer.hashicorp.com/terraform/docs'],
  ['ansible', 'Ansible', 'https://docs.ansible.com/'],
  ['linux', 'Linux', 'https://www.kernel.org/doc/html/latest/'],
  ['networking', 'Networking', 'https://www.rfc-editor.org/'],
  ['git', 'Git', 'https://git-scm.com/doc'],
  ['github', 'GitHub', 'https://docs.github.com/'],
  ['github-actions', 'GitHub Actions', 'https://docs.github.com/actions'],
  ['jenkins', 'Jenkins', 'https://www.jenkins.io/doc/'],
  ['devops', 'DevOps', 'https://dora.dev/'],
  ['devsecops', 'DevSecOps', 'https://owasp.org/www-project-devsecops-guideline/'],
  ['sre', 'Site Reliability Engineering', 'https://sre.google/books/'],
  ['cloud-security', 'Cloud Security', 'https://cloudsecurityalliance.org/research/guidance'],
  ['cyber-security', 'Cybersecurity', 'https://www.nist.gov/cyberframework'],
  ['soc-analyst', 'SOC Analyst', 'https://attack.mitre.org/'],
  ['threat-hunting', 'Threat Hunting', 'https://attack.mitre.org/'],
  ['incident-response', 'Incident Response', 'https://csrc.nist.gov/pubs/sp/800/61/r2/final'],
  ['ethical-hacking', 'Ethical Hacking', 'https://owasp.org/www-project-web-security-testing-guide/'],
  ['web-development', 'Web Development', 'https://developer.mozilla.org/docs/Learn'],
  ['frontend-development', 'Frontend Development', 'https://developer.mozilla.org/docs/Web'],
  ['backend-development', 'Backend Development', 'https://developer.mozilla.org/docs/Learn/Server-side'],
  ['full-stack-development', 'Full Stack Development', 'https://developer.mozilla.org/docs/Learn'],
  ['system-design', 'System Design', 'https://github.com/donnemartin/system-design-primer'],
  ['software-engineering', 'Software Engineering', 'https://sre.google/books/'],
  ['python', 'Python', 'https://docs.python.org/3/'],
  ['javascript', 'JavaScript', 'https://developer.mozilla.org/docs/Web/JavaScript'],
  ['typescript', 'TypeScript', 'https://www.typescriptlang.org/docs/'],
  ['react', 'React', 'https://react.dev/learn'],
  ['node-js', 'Node.js', 'https://nodejs.org/docs/latest/api/'],
  ['artificial-intelligence', 'Artificial Intelligence', 'https://developers.google.com/machine-learning'],
  ['machine-learning', 'Machine Learning', 'https://scikit-learn.org/stable/user_guide.html'],
  ['prompt-engineering', 'Prompt Engineering', 'https://platform.openai.com/docs/guides/prompt-engineering'],
  ['llm-development', 'LLM Development', 'https://huggingface.co/docs'],
  ['rag-systems', 'RAG Systems', 'https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview'],
  ['ai-agents', 'AI Agents', 'https://platform.openai.com/docs/guides/agents'],
  ['data-engineering', 'Data Engineering', 'https://cloud.google.com/learn/what-is-data-engineering'],
  ['data-analytics', 'Data Analytics', 'https://www.ibm.com/topics/data-analytics'],
]

const CERTIFICATIONS = {
  aws: ['AWS Certified Cloud Practitioner', 'AWS Certified Solutions Architect - Associate', 'AWS Certified Security - Specialty'],
  azure: ['AZ-900', 'AZ-104', 'AZ-305', 'AZ-500'],
  'google-cloud': ['Associate Cloud Engineer', 'Professional Cloud Architect'],
  kubernetes: ['CKA', 'CKAD', 'CKS'],
  terraform: ['HashiCorp Certified: Terraform Associate'],
  'cyber-security': ['CompTIA Security+', 'CompTIA CySA+', 'CISSP'],
  'cloud-security': ['CCSP', 'AWS Certified Security - Specialty', 'AZ-500'],
  'soc-analyst': ['CompTIA CySA+', 'GIAC Certified Incident Handler'],
  'data-analytics': ['Google Data Analytics Certificate'],
}

const CAREER_ROADMAPS = {
  'cloud-engineer': ['Cloud foundations', 'Networking and identity', 'Infrastructure automation', 'Observability and operations', 'Portfolio architecture review'],
  'devops-engineer': ['Git and delivery fundamentals', 'CI/CD implementation', 'Containers and orchestration', 'Release engineering', 'Operational metrics'],
  'devsecops-engineer': ['Secure development lifecycle', 'Dependency and IaC scanning', 'Identity and secrets management', 'Policy-as-code', 'Security automation'],
  'platform-engineer': ['Developer experience fundamentals', 'Reusable platform interfaces', 'Golden paths', 'Self-service guardrails', 'Platform reliability'],
  'site-reliability-engineer': ['Service ownership', 'SLIs, SLOs, and error budgets', 'Observability', 'Incident response', 'Reliability architecture'],
  'cloud-security-engineer': ['Cloud identity and network controls', 'Detection engineering', 'Threat modeling', 'Incident response', 'Security architecture'],
  'soc-analyst': ['Alert triage', 'Evidence handling', 'Threat intelligence', 'Incident escalation', 'Detection improvement'],
  'security-engineer': ['Application security', 'Cloud security controls', 'Automation', 'Security reviews', 'Risk communication'],
  'software-engineer': ['Programming fundamentals', 'Testing and design', 'Data and APIs', 'Distributed systems', 'Production ownership'],
  'full-stack-developer': ['Web fundamentals', 'Frontend and backend services', 'Persistence and APIs', 'Testing and delivery', 'Production operations'],
  'ai-engineer': ['Python and data foundations', 'Model and prompt evaluation', 'Retrieval and tool use', 'Responsible deployment', 'AI system operations'],
  'machine-learning-engineer': ['Statistics and data preparation', 'Model development', 'Evaluation and experiment tracking', 'Serving and monitoring', 'ML platform design'],
  'solutions-architect': ['Requirements discovery', 'Architecture principles', 'Security and reliability', 'Cost and trade-offs', 'Architecture communication'],
}

const INDUSTRY_SOURCES = [
  { title: 'Structured industry course or lab provider', url: 'https://www.pluralsight.com/', tier: 'industry' },
  { title: 'Technical books and production references', url: 'https://www.oreilly.com/', tier: 'industry' },
]

const COMMUNITY_SOURCES = [
  { title: 'Community implementation examples', url: 'https://github.com/', tier: 'community' },
  { title: 'Roadmap and community discussions', url: 'https://roadmap.sh/', tier: 'community' },
]

const PROJECTS = {
  'cloud-computing': ['Cost-aware multi-tier architecture', 'Cloud service comparison runbook'],
  aws: ['Static site with private storage and CDN', 'Multi-account security baseline'],
  azure: ['Hub-and-spoke network with policy controls', 'Entra identity governance lab'],
  'google-cloud': ['Secure container deployment', 'Cloud operations dashboard'],
  docker: ['Hardened non-root image', 'Image scanning and promotion pipeline'],
  kubernetes: ['Progressive deployment with rollback', 'Network policy and observability lab'],
  terraform: ['Reusable multi-environment module', 'Policy-checked infrastructure plan'],
  networking: ['Packet-flow troubleshooting lab', 'Redundant private service network'],
  devops: ['Build-test-release pipeline', 'Deployment metrics dashboard'],
  devsecops: ['SAST, dependency, and IaC gates', 'Signed artifact promotion'],
  'cloud-security': ['Cloud control validation pack', 'Detection and response runbook'],
  'cyber-security': ['Threat model and control assessment', 'Vulnerability remediation report'],
  'incident-response': ['Tabletop exercise with evidence timeline', 'Containment automation in a sandbox'],
  python: ['CLI automation tool with tests', 'API client with retries and structured logging'],
  javascript: ['Accessible progressive web interface', 'Typed API integration'],
  typescript: ['Type-safe service boundary', 'Schema-validated event consumer'],
  react: ['Accessible dashboard with loading states', 'Component test and performance budget'],
  'system-design': ['Design a multi-tenant notification service', 'Capacity and failure-mode review'],
  'machine-learning': ['Reproducible training pipeline', 'Model evaluation and drift report'],
  'rag-systems': ['Document ingestion and cited retrieval', 'Evaluation set and hallucination checks'],
}

function buildTrack([id, title, officialDocs]) {
  const projects = PROJECTS[id] || [`${title} guided lab`, `${title} portfolio capstone`]
  const roleId = id.includes('security') || id.includes('soc') || id.includes('incident') || id.includes('threat') ? 'security-analyst'
    : id.includes('sre') ? 'sre'
      : id.includes('devops') || id.includes('github-actions') || id === 'jenkins' ? 'devops-engineer'
        : id.includes('ai') || id.includes('machine-learning') || id.includes('rag') || id.includes('llm') || id.includes('prompt') ? 'ai-engineer'
          : id === 'linux' ? 'linux-administrator'
            : 'cloud-engineer'
  const role = getRoleSimulation(roleId)
  const readingMaterials = ['Beginner guide', 'Intermediate guide', 'Advanced guide', 'Expert guide', 'Production guide', 'Troubleshooting guide', 'Architecture guide', 'Security guide', 'Best practices guide', 'Mistakes to avoid guide']
  const objectives = [
    `Explain the core concepts and vocabulary of ${title}.`,
    `Build and troubleshoot a small ${title} solution in a safe environment.`,
    `Evaluate security, reliability, cost, and operational trade-offs.`,
    `Communicate a design and support it with evidence.`,
  ]
  const projectPortfolio = {
    beginner: projects[0],
    intermediate: `${title} guided implementation`,
    advanced: projects[1],
    production: `${title} production readiness review`,
    portfolio: `${title} evidence-backed portfolio dossier`,
    interview: `${title} architecture interview exercise`,
    startup: `${title} lean startup reference architecture`,
  }
  const beginnerResources = [{ title: `${title} fundamentals`, url: officialDocs, tier: 'official' }]
  const intermediateResources = [{ title: `${title} implementation guidance`, url: officialDocs, tier: 'official' }]
  const advancedResources = [{ title: `${title} architecture and operations reference`, url: officialDocs, tier: 'official' }]
  return {
    id,
    title,
    overview: `A progressive ${title} journey from first principles to production decision-making.`,
    learningObjectives: objectives,
    prerequisites: ['Basic computer literacy', 'A safe local or sandbox environment'],
    difficulty: 'Progressive: beginner to expert',
    estimatedHours: '20-40 hours, depending on prior experience',
    levelFramework: LEVELS.map(([name, outcome], index) => ({ level: index, name, outcome })),
    officialDocumentation: [{ title: `${title} official documentation`, url: officialDocs, tier: 'official' }],
    officialLearningPlatforms: [{ title: `${title} official learning`, url: officialDocs, tier: 'official' }],
    freeResources: [{ title: 'Official documentation and reference guides', url: officialDocs, tier: 'official' }],
    beginnerResources,
    intermediateResources,
    advancedResources,
    paidResources: INDUSTRY_SOURCES,
    bestYouTubeChannels: [{ title: 'Provider and maintainer technical talks', url: officialDocs, tier: 'official' }],
    bestBooks: [{ title: 'Official guides and production references', url: officialDocs, tier: 'official' }],
    bestArticles: [{ title: 'Official technical articles and release notes', url: officialDocs, tier: 'official' }],
    industryResources: INDUSTRY_SOURCES,
    communityResources: COMMUNITY_SOURCES,
    advancedReferences: [{ title: `${title} standards and reference material`, url: officialDocs, tier: 'official' }],
    expertResources: [{ title: `${title} maintainer and architecture references`, url: officialDocs, tier: 'official' }],
    practiceExercises: ['Explain the concept without notes', 'Diagnose a deliberately introduced failure', 'Compare two implementation choices'],
    readingMaterials,
    learningSlides: [`${title} module briefing`, `${title} architecture review`, `${title} incident debrief`],
    visualDiagrams: ['Concept map', 'Architecture diagram', 'Process and evidence flow'],
    guidedPractice: ['Follow the worked example', 'Repeat with one changed constraint', 'Explain the decision in your own words'],
    simulations: ['Sandbox walkthrough', 'Timed troubleshooting exercise', 'Manager review checkpoint'],
    caseStudies: ['Architecture review', 'Downtime analysis', 'Security and reliability trade-off review'],
    teamActivities: ['Standup update', 'Peer review of evidence', 'Incident handoff and presentation'],
    realWorldScenarios: [role.managerRequest, ...role.tasks],
    rolePlay: role,
    dayInTheLife: jobSimulationLibrary.dayInTheLife,
    jobTickets: [role.ticket],
    productionIncidents: jobSimulationLibrary.incidents,
    troubleshootingGuide: ['State the symptom and user impact', 'List evidence before changing anything', 'Test the smallest reversible hypothesis', 'Verify recovery and record follow-up work'],
    productionDeployments: [{ title: `${title} production change review`, stages: ['plan', 'test', 'approve', 'release', 'observe', 'rollback or close'], safeBoundary: 'Simulation only; deployment steps must use local fixtures or an explicitly isolated sandbox.' }],
    documentationTasks: ['Write an operator runbook', 'Record assumptions and evidence', 'Add a rollback and verification section'],
    presentationTasks: ['Give a five-minute incident update', 'Defend one architecture trade-off', 'Present remaining risk to a manager'],
    interviewPrep: {
      beginner: ['Define the core terms and a safe first check.'],
      associate: ['Troubleshoot the common failure path and explain your evidence.'],
      professional: ['Compare designs under reliability, security, and cost constraints.'],
      senior: ['Lead the incident, communicate uncertainty, and prioritize follow-up work.'],
      principal: ['Set the operating model, guardrails, and measurable success criteria.'],
    },
    careerPreparation: ['Export a project brief', 'Attach evidence and a verification result', 'Practice a structured STAR explanation'],
    jobReadinessEvidence: ['Knowledge check', 'Completed lab', 'Reviewed project', 'Interview response', 'Incident report', 'Documentation artifact', 'Presentation'],
    handsOnLabs: projects.map((title, index) => ({ title, level: index === 0 ? 'beginner' : 'advanced', safeBoundary: 'Use local tooling, a simulator, or a sandbox; no platform provisions cloud resources.' })),
    assessments: ['Topic knowledge check', 'Module quiz', 'Portfolio review checklist'],
    projects,
    projectPortfolio,
    certifications: CERTIFICATIONS[id] || [],
    interviewQuestions: [`Explain the core trade-offs in a ${title} design.`, `Describe a failure mode and how you would detect and recover from it.`],
    careerPaths: [`${title} practitioner`, `${title} engineer`, `${title} architect`],
    careerRoadmaps: CAREER_ROADMAPS,
    productionUseCases: ['Secure automation', 'Observable services', 'Repeatable operational workflows'],
    salaryInsights: { status: 'not included', reason: 'Compensation varies by geography, level, employer, and time; verify current market data independently.' },
    continuousLearningPlan: ['Review official release notes', 'Rebuild one project quarterly', 'Record decisions and post-incident lessons'],
    outputSections: [
      'Topic Overview',
      'Learning Roadmap',
      'Beginner Resources',
      'Intermediate Resources',
      'Advanced Resources',
      'Official Documentation',
      'Hands-On Labs',
      'Projects',
      'Certifications',
      'Interview Questions',
      'Career Opportunities',
      'Production Use Cases',
      'Expert Level Resources',
      'Community Resources',
      'Continuous Learning Plan',
    ],
  }
}

export const learningResourceLibrary = Object.fromEntries(
  TRACK_DEFINITIONS.map(definition => [definition[0], buildTrack(definition)])
)

export const learningResourcePathMap = {
  foundations: ['cloud-computing', 'linux', 'networking', 'docker', 'terraform', 'python'],
  iam: ['aws', 'azure', 'google-cloud', 'cloud-security'],
  s3: ['aws', 'azure', 'google-cloud', 'cloud-security'],
  network: ['networking', 'aws', 'azure', 'google-cloud', 'terraform'],
  monitoring: ['sre', 'cloud-security', 'soc-analyst', 'threat-hunting'],
  'incident-response': ['incident-response', 'cyber-security', 'ethical-hacking'],
  architecture: ['system-design', 'cloud-computing', 'devops', 'cloud-security'],
  career: ['software-engineering', 'devops', 'cloud-security', 'python'],
}

export function getLearningTrackBlueprint(pathId) {
  const trackIds = learningResourcePathMap[pathId] || []
  return trackIds.map(id => learningResourceLibrary[id]).filter(Boolean)
}

export function getLearningTrack(trackId) {
  return learningResourceLibrary[trackId] || null
}

export { LEVELS }
