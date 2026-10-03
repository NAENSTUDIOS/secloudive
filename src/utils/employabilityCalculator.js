/**
 * ============================================================================
 * SeCloudive Master Employability & Career Forecasting Engine
 * Calculates multidimensional job readiness, weekly/monthly sprints,
 * career trajectories, and algorithmically recommends the Next Best Action.
 * ============================================================================
 */

export function calculateComprehensiveEmployability({
  completedLabsCount = 0,
  completedInvestigationsCount = 0,
  architectureReviewedCount = 0,
  threatHuntsCompletedCount = 0,
  interviewsCompletedCount = 0,
  completedProjectsCount = 0,
  rampupLabsCompletedCount = 0,
  totalScore = 0,
  targetRoleId = 'cloud-security-engineer'
}) {
  // 1. Multidimensional Readiness Metrics (0 - 100%)
  const skillReadiness = Math.min(100, Math.round(
    (completedLabsCount * 2.5) + 
    (completedInvestigationsCount * 1.5) + 
    (completedProjectsCount * 8.0) + 
    (rampupLabsCompletedCount * 1.5) + 
    30
  ));

  const internshipReadiness = Math.min(100, Math.round(
    (completedLabsCount * 3.0) + 
    (completedInvestigationsCount * 2.0) + 
    (completedProjectsCount * 5.0) + 
    40
  ));

  const architectureReadiness = Math.min(100, Math.round(
    (architectureReviewedCount * 5.0) + 
    (completedProjectsCount * 10.0) + 
    (completedLabsCount * 1.0) + 
    25
  ));

  const threatHuntingReadiness = Math.min(100, Math.round(
    (threatHuntsCompletedCount * 6.0) + (completedInvestigationsCount * 2.0) + 20
  ));

  const investigationReadiness = Math.min(100, Math.round(
    (completedInvestigationsCount * 4.0) + 35
  ));

  const interviewReadiness = Math.min(100, Math.round(
    (interviewsCompletedCount * 8.0) + (completedLabsCount * 1.0) + 30
  ));

  const cloudSecEngReadiness = Math.min(100, Math.round(
    (skillReadiness * 0.25) +
    (architectureReadiness * 0.25) +
    (investigationReadiness * 0.25) +
    (interviewReadiness * 0.25)
  ));

  const overallJobReadiness = Math.round(
    (skillReadiness + internshipReadiness + architectureReadiness + 
     threatHuntingReadiness + investigationReadiness + interviewReadiness) / 6
  );

  // 2. Next Best Action Recommendation
  let nextBestAction = {
    title: 'Complete First Safe AWS Lab',
    link: '/labs',
    badge: 'PRIORITY 1',
    description: 'Establish hands-on command-line muscle memory with AWS IAM Permission Boundaries.'
  };

  if (completedProjectsCount === 0 && completedLabsCount >= 2) {
    nextBestAction = {
      title: 'Build Verified $0 Capstone Project',
      link: '/projects',
      badge: 'PORTFOLIO PROOF',
      description: 'Deploy production-grade S3/KMS zero-trust architecture with verified $0 teardown.'
    };
  } else if (completedLabsCount >= 3 && completedInvestigationsCount < 3) {
    nextBestAction = {
      title: 'Triage Critical S3 / IAM Incident',
      link: '/investigations',
      badge: 'FORENSIC TRIAGE',
      description: 'Investigate INC-IAM-001 or INC-S3-002 in Athena to master cloud log correlation.'
    };
  } else if (completedInvestigationsCount >= 3 && architectureReviewedCount < 2) {
    nextBestAction = {
      title: 'Review Multi-Tenant SaaS Architecture',
      link: '/architecture-reviews',
      badge: 'ARCH DESIGN',
      description: 'Identify tenant isolation gaps and threat model STRIDE vectors.'
    };
  } else if (architectureReviewedCount >= 2 && interviewsCompletedCount < 2) {
    nextBestAction = {
      title: 'Run Cloud Security Mock Interview',
      link: '/interviews',
      badge: 'INTERVIEW PREP',
      description: 'Practice articulating trade-offs and incident response under technical evaluation.'
    };
  } else if (threatHuntsCompletedCount < 2) {
    nextBestAction = {
      title: 'Launch Proactive Cloud Threat Hunt',
      link: '/live-portal',
      badge: 'THREAT HUNTING',
      description: 'Hunt for living-off-the-cloud TTPs and silent DNS tunneling.'
    };
  }

  // 3. Weekly & Monthly Sprints
  const weeklyPlan = [
    { day: 'Day 1 - 2', task: 'Complete 2 Safe AWS Labs (IAM & S3 Block Public Access)', targetOutput: 'Verified $0 teardown proof & CloudTrail logs' },
    { day: 'Day 3 - 4', task: 'Investigate 1 Critical AWS Incident in Athena', targetOutput: 'Forensic timeline & remediation pull request' },
    { day: 'Day 5', task: 'Conduct 1 Enterprise Architecture Review', targetOutput: 'Threat model document with 3 security recommendations' },
    { day: 'Day 6 - 7', task: 'Run 1 Technical Mock Interview & Export Portfolio Dossier', targetOutput: 'Hiring manager confidence score >= 80%' }
  ];

  const monthlyPlan = [
    { week: 'Week 1', milestone: 'Core AWS Foundations & Zero-Trust IAM Mastery', goals: ['10 Safe Labs', '3 Investigations', '1 Architecture Review'] },
    { week: 'Week 2', milestone: 'Perimeter Defense, VPC Firewalls & Threat Detection', goals: ['VPC Flow Logs Athena', 'GuardDuty Triage', 'Network Reviews'] },
    { week: 'Week 3', milestone: 'Containers (EKS), Serverless & DevSecOps CI/CD', goals: ['EKS Pod Identity Lab', 'GitHub OIDC Audit', 'Checkov Scanner'] },
    { week: 'Week 4', milestone: 'Employability Capstone, Resume Dossier & Interview Defense', goals: ['Full Mock Interview', 'Verified Certificate Export', 'LinkedIn Portfolio Dossier'] }
  ];

  // 4. Career Trajectory Forecast (Illustrative Milestones Only)
  const trajectoryFraming = 'Example trajectory only. Real outcomes depend on your market, location, experience and effort. This is not a guarantee.';
  const careerForecast = [
    {
      horizon: 'Illustrative Milestone: ~30 Days Prep',
      stage: 'Cloud Security Intern Ready',
      compensation: 'Example range: $30 - $45/hr (Internships)',
      focus: 'Ticket triage, basic IAM reviews, S3 bucket remediation.',
      framing: trajectoryFraming
    },
    {
      horizon: 'Illustrative Milestone: ~90 Days Prep',
      stage: 'Associate SOC / Cloud Analyst Ready',
      compensation: 'Example range: $85,000 - $110,000',
      focus: 'GuardDuty alert correlation, Athena queries, incident response.',
      framing: trajectoryFraming
    },
    {
      horizon: 'Illustrative Milestone: ~180 Days Prep',
      stage: 'Production Cloud Security Engineer Ready',
      compensation: 'Example range: $135,000 - $165,000',
      focus: 'Landing zone SCPs, Terraform security modules, architecture reviews.',
      framing: trajectoryFraming
    },
    {
      horizon: 'Illustrative Milestone: ~360 Days Prep',
      stage: 'Senior / Lead Security Architect Ready',
      compensation: 'Example range: $175,000 - $220,000+',
      focus: 'Enterprise zero-trust architecture, threat modeling, board governance.',
      framing: trajectoryFraming
    }
  ];

  return {
    metrics: {
      skillReadiness,
      internshipReadiness,
      jobReadiness: overallJobReadiness,
      architectureReadiness,
      threatHuntingReadiness,
      investigationReadiness,
      interviewReadiness,
      cloudSecEngReadiness
    },
    nextBestAction,
    weeklyPlan,
    monthlyPlan,
    careerForecast,
    trajectoryFraming
  };
}

export default calculateComprehensiveEmployability;
