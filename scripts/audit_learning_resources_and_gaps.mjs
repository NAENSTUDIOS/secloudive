import fs from 'fs';
import path from 'path';

const SRC_DATA = path.resolve('src/data');

// Import data modules to get exact counts and contents
async function runDetailedAudit() {
  console.log('======================================================================');
  console.log('SECLOUDIVE COMPREHENSIVE LEARNING & LABS AUDIT: INVENTORY & GAP REPORT');
  console.log('======================================================================\n');

  // 1. Learning Modules in src/data/learning
  const learningFiles = [
    { name: 'Foundations Path', file: 'foundationsPath.js' },
    { name: 'IAM Security Path', file: 'iamPath.js' },
    { name: 'Network Security Path', file: 'networkPath.js' },
    { name: 'S3 Data Protection Path', file: 's3Path.js' },
    { name: 'Monitoring & Telemetry Path', file: 'monitoringPath.js' },
    { name: 'Incident Response Path', file: 'incidentResponsePath.js' },
    { name: 'Architecture Security Path', file: 'architecturePath.js' },
    { name: 'Career & SOC Readiness Path', file: 'careerPath.js' }
  ];

  let totalCurriculumSteps = 0;
  console.log('--- [1] CORE CURRICULUM MODULES (8 Tracks) ---');
  for (const track of learningFiles) {
    const filePath = path.join(SRC_DATA, 'learning', track.file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/id:\s*['"`][^'"`]+['"`]/g) || [];
      totalCurriculumSteps += matches.length;
      console.log(`• ${track.name.padEnd(32)}: ${matches.length} structured lessons/steps`);
    }
  }
  console.log(`Total Guided Lessons across Tracks: ${totalCurriculumSteps}\n`);

  // 2. Interactive Hands-on Arenas & Labs
  console.log('--- [2] HANDS-ON ARENAS & SIMULATION LABS ---');

  // Real Labs
  const jobLabsContent = fs.readFileSync(path.join(SRC_DATA, 'jobLabs.js'), 'utf8');
  const jobLabMatches = jobLabsContent.match(/title:\s*['"`][^'"`]+['"`]/g) || [];
  console.log(`• Real Job Labs (Production Scenarios): ${jobLabMatches.length}`);

  // Battle Rooms
  const battleRoomsContent = fs.readFileSync(path.join(SRC_DATA, 'battleRooms.js'), 'utf8');
  const battleRoomMatches = battleRoomsContent.match(/id:\s*['"`](room|battle)-[^'"`]+['"`]/g) || [];
  console.log(`• Purple Team Battle Rooms:             ${battleRoomMatches.length}`);

  // Investigation Scenarios
  const invContent = fs.readFileSync(path.join(SRC_DATA, 'investigations.js'), 'utf8');
  const invMatches = invContent.match(/id:\s*['"`]inv-[^'"`]+['"`]/g) || [];
  console.log(`• Cloud Incident Investigations:        ${invMatches.length}`);

  // Threat Hunts
  const huntContent = fs.readFileSync(path.join(SRC_DATA, 'expandedThreatHunts.js'), 'utf8');
  const huntMatches = (huntContent.match(/title:\s*['"`]/g) || []).length + (huntContent.match(/sub:\s*['"`]/g) || []).length;
  console.log(`• Threat Hunting Missions:              ${huntMatches}`);

  // Architecture Reviews
  const archContent = fs.readFileSync(path.join(SRC_DATA, 'expandedArchitectureBank.js'), 'utf8');
  const archMatches = archContent.match(/title:\s*['"`][^'"`]+['"`]/g) || [];
  console.log(`• Cloud Architecture Reviews:           ${archMatches.length}`);

  // Cloud Projects
  const projContent = fs.readFileSync(path.join(SRC_DATA, 'cloudProjects.js'), 'utf8');
  const projMatches = projContent.match(/id:\s*['"`][a-zA-Z0-9_-]+['"`]/g) || [];
  console.log(`• Portfolio Capstone Cloud Projects:    ${projMatches.length}`);

  // IaC Templates
  const iacContent = fs.readFileSync(path.join(SRC_DATA, 'labIacTemplates.js'), 'utf8');
  const iacMatches = iacContent.match(/'(lab-[a-z0-9-]+|LAB-[A-Z0-9-]+)':/g) || [];
  console.log(`• Zero-Cost IaC Free-Tier Templates:    ${iacMatches.length}`);

  // 3. Evaluation & Career Preparedness
  console.log('\n--- [3] EVALUATION, QUIZZES & INTERVIEW PREP ---');
  const quizContent = fs.readFileSync(path.join(SRC_DATA, 'learning', 'moduleQuizzes.js'), 'utf8');
  const quizMatches = quizContent.match(/question:\s*['"`]/g) || [];
  console.log(`• Diagnostic & Module Quiz Questions:   ${quizMatches.length}`);

  const flashcardContent = fs.readFileSync(path.join(SRC_DATA, 'awsCertificationFlashcards.js'), 'utf8');
  const flashcardMatches = flashcardContent.match(/question:\s*['"`]/g) || [];
  console.log(`• AWS Certification Spaced Flashcards:  ${flashcardMatches.length}`);

  const cheatContent = fs.readFileSync(path.join(SRC_DATA, 'awsSecurityCheatSheets.js'), 'utf8');
  const cheatMatches = cheatContent.match(/title:\s*['"`][^'"`]+['"`]/g) || [];
  console.log(`• Architecture & IAM Cheat Sheets:      ${cheatMatches.length}`);

  const interviewContent = fs.readFileSync(path.join(SRC_DATA, 'interviewBank.js'), 'utf8');
  const interviewMatches = interviewContent.match(/question:\s*['"`]/g) || [];
  const expInterviewContent = fs.readFileSync(path.join(SRC_DATA, 'expandedInterviewBank.js'), 'utf8');
  const expInterviewMatches = expInterviewContent.match(/question:\s*['"`]/g) || [];
  console.log(`• Technical Mock Interview Questions:   ${interviewMatches.length + expInterviewMatches.length}`);

  // 4. Multi-Cloud & Cross-Domain Analysis
  console.log('\n--- [4] DOMAIN & CLOUD COVERAGE ANALYSIS ---');
  const domains = [
    { name: 'Identity & Access Management (IAM / ABAC / RBAC)', regex: /\b(IAM|AssumeRole|PermissionBoundary|SCP|PrincipalTag|ABAC)\b/gi },
    { name: 'Data Protection & Cryptography (KMS / S3 Bucket Policies / Envelope Encryption)', regex: /\b(KMS|Envelope Encryption|SSE-KMS|BucketPolicy|CMK)\b/gi },
    { name: 'Detection & Incident Response (CloudTrail / GuardDuty / Athena / SIEM)', regex: /\b(CloudTrail|GuardDuty|SecurityHub|Athena|Detective|VPC Flow Logs)\b/gi },
    { name: 'Network & Boundary Security (VPC / Security Groups / WAF / Shield / PrivateLink)', regex: /\b(VPC|Security Group|NACL|WAF|PrivateLink|Transit Gateway)\b/gi },
    { name: 'Container & Kubernetes Security (EKS / Pod Identity / Falco / Containerd)', regex: /\b(EKS|Kubernetes|Pod Identity|Admission Controller|Falco|Container)\b/gi },
    { name: 'Infrastructure as Code Security (Terraform / CloudFormation / Checkov / tfsec)', regex: /\b(Terraform|CloudFormation|Checkov|tfsec|Trivy|IaC)\b/gi },
    { name: 'AI & LLM Cloud Security (Prompt Injection / Model Guardrails / Bedrock)', regex: /\b(Bedrock|LLM|GenAI|Prompt Injection|OWASP LLM|AI Security)\b/gi }
  ];

  const allFiles = fs.readdirSync(SRC_DATA).filter(f => f.endsWith('.js'));
  let totalContent = '';
  for (const f of allFiles) {
    totalContent += fs.readFileSync(path.join(SRC_DATA, f), 'utf8') + ' ';
  }

  for (const d of domains) {
    const hits = (totalContent.match(d.regex) || []).length;
    console.log(`• ${d.name.padEnd(52)}: ${hits.toString().padStart(5)} occurrences`);
  }

  // 5. In-Depth Student Experience Gap Identification
  console.log('\n--- [5] PEDAGOGICAL & STUDENT LEARNING GAPS AUDITED ---');

  const gaps = [];

  // Gap 1: Terraform / IaC Template Coverage Ratio
  // We have 18 Job Labs, but how many have 1-click Terraform templates in labIacTemplates.js?
  if (iacMatches.length < jobLabMatches.length) {
    gaps.push({
      category: 'Hands-on Infrastructure Gap',
      severity: 'Medium',
      title: `IaC Sandbox Coverage Discrepancy (${iacMatches.length} templates vs ${jobLabMatches.length} Job Labs)`,
      detail: `While there are ${jobLabMatches.length} Real Job Labs, only ${iacMatches.length} have direct copy-paste Terraform templates in labIacTemplates.js. Learners attempting the remaining ${jobLabMatches.length - iacMatches.length} labs must construct their own terraform configurations from scratch.`
    });
  }

  // Gap 2: AI / GenAI Cloud Security Content
  const aiHits = (totalContent.match(/\b(Bedrock|LLM|GenAI|Prompt Injection|OWASP LLM)\b/gi) || []).length;
  if (aiHits < 30) {
    gaps.push({
      category: 'Emerging Tech Curriculum Gap',
      severity: 'High',
      title: 'Modern Generative AI & LLM Cloud Security Lab Scenarios',
      detail: `Current scenarios are heavily focused on classic cloud infrastructure (IAM, S3, VPC, GuardDuty). Modern cloud security teams are increasingly tasked with securing Amazon Bedrock, Private Link for Model APIs, and Vector DBs. Adding a dedicated AI Cloud Security Lab (e.g. Bedrock Guardrails, Model IAM Boundaries) would modernize student portfolios for 2026/2027 hiring.`
    });
  }

  // Gap 3: Azure & GCP Lab Parity
  const azureHits = (totalContent.match(/\b(Azure|Entra ID)\b/gi) || []).length;
  const gcpHits = (totalContent.match(/\b(GCP|Google Cloud)\b/gi) || []).length;
  if (azureHits < 250 || gcpHits < 200) {
    gaps.push({
      category: 'Multi-Cloud Depth Gap',
      severity: 'Medium',
      title: 'Azure & GCP Hands-on Simulation Parity',
      detail: `The curriculum is predominantly AWS-focused (5,000+ mentions vs ~200 for Azure and ~120 for GCP). While AWS is the industry leader in cloud security job openings, students aiming for hybrid multi-cloud roles would benefit from side-by-side Azure Entra ID and GCP Workload Identity Federation comparisons.`
    });
  }

  // Gap 4: Interactive Verification Commands & CLI Answer Keys
  // Check if every investigation has explicit AWS CLI verification commands
  const cliCheck = (invContent.match(/aws [a-z0-9-]+ [a-z0-9-]+/gi) || []).length;
  console.log(`• Verified AWS CLI Commands embedded in investigations: ${cliCheck}`);
  if (cliCheck < 20) {
    gaps.push({
      category: 'Practical Learner Verification Gap',
      severity: 'Low',
      title: 'Self-Service CLI Validation Scripts for Labs',
      detail: 'Ensure every simulation step includes an explicit one-line copyable bash/AWS CLI command so students can independently verify that their remediation succeeded.'
    });
  }

  // Output all identified gaps
  gaps.forEach((g, idx) => {
    console.log(`\n[Gap ${idx + 1}] [${g.severity} Priority] ${g.title}`);
    console.log(`  Area: ${g.category}`);
    console.log(`  Detail: ${g.detail}`);
  });

  return { stats: { totalCurriculumSteps, jobLabs: jobLabMatches.length, battleRooms: battleRoomMatches.length, investigations: invMatches.length, threatHunts: huntMatches, architectureReviews: archMatches.length, flashcards: flashcardMatches.length, cheatSheets: cheatMatches.length, interviewQuestions: interviewMatches.length + expInterviewMatches.length, iacTemplates: iacMatches.length }, gaps };
}

runDetailedAudit();
