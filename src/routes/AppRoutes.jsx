import { lazy, Suspense } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import Home from '../pages/Home'
import { useChallenges } from '../context/ChallengeContext'
import EngineerResponse from '../components/EngineerResponse'

// Code-split route components for rapid initial load and optimal Amplify performance
const Categories = lazy(() => import('../pages/Categories'))
const Challenge = lazy(() => import('../pages/Challenge'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Report = lazy(() => import('../pages/Report'))
const About = lazy(() => import('../pages/About'))
const ArchitectureReviews = lazy(() => import('../pages/ArchitectureReviews'))
const OfficialLearningPaths = lazy(() => import('../components/OfficialLearningPaths'))
const InternshipSimulator = lazy(() => import('../pages/InternshipSimulator'))
const InvestigationSimulator = lazy(() => import('../pages/InvestigationSimulator'))
const RealLabs = lazy(() => import('../pages/RealLabs'))
const JobPlaybookEngine = lazy(() => import('../pages/JobPlaybookEngine'))
const CareerRoadmap = lazy(() => import('../components/CareerRoadmap'))
const TimelineSummary = lazy(() => import('../components/AttackTimeline').then(m => ({ default: m.TimelineSummary })))

function RouteLoadingFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: '#94a3b8', font: "12px 'DM Mono', monospace" }}>
      <div className="pulse-dot" style={{ width: '8px', height: '8px' }} />
      <span>INITIALIZING SOC FIELD ENVIRONMENT /// SECURE DISPATCH...</span>
    </div>
  )
}

function DashboardRoute() { return <><Dashboard /><OfficialLearningPaths variant="dashboard" /></> }
function ReportRoute() { const { threatScenarios, progress, internshipReadiness } = useChallenges(); const completed = threatScenarios.find(scenario => progress.simulatorScores?.[scenario.id] !== undefined) || threatScenarios[0]; return <><Report /><TimelineSummary scenario={completed} /><CareerRoadmap readiness={internshipReadiness} compact /><OfficialLearningPaths variant="career" /></> }
function InvestigationRoute() { const { id } = useParams(); const { challenges } = useChallenges(); const challenge = challenges.find(item => item.id === id) || challenges[0]; return <><Challenge /><EngineerResponse response="Start by preserving evidence, validating the effective permission path, and confirming whether the finding is active or historical." impact={challenge.realWorldImpact} remediation={challenge.remediation} interviewTip="Explain your order of operations: contain the exposure, preserve evidence, determine blast radius, then implement and verify the fix." awsBestPractice="Apply least privilege, explicit resource boundaries, centralized audit logging, and AWS IAM Access Analyzer where applicable." lessonsLearned={challenge.whyThisMatters || "Security is a system property: validate effective permissions before changing state."} /></> }
function ArchitectureRoute() { return <><ArchitectureReviews /><EngineerResponse response="Map the trust boundaries first, then prioritize the finding that creates the widest blast radius across public access, identity, data, and monitoring." impact="Architecture weaknesses compound: one exposed service or shared identity can turn a local misconfiguration into a business-wide incident." remediation="Separate public, application, and data zones; assign critical asset owners; enforce encryption and least privilege; and continuously validate the controls." interviewTip="Recruiters expect you to prioritize risk, explain tradeoffs, and connect a service-level finding to business impact." awsBestPractice="Use the AWS Well-Architected Security Pillar, multi-account guardrails, centralized logging, and defense in depth." lessonsLearned="Architecture reviews prevent compound failure modes: clear trust boundaries and asset ownership eliminate entire classes of vulnerabilities." /></> }
function SimulatorRoute() { return <><InternshipSimulator /><EngineerResponse response="Triage the ticket, select the evidence that changes the risk decision, contain the highest-impact path, and document what remains uncertain." impact="Security tickets affect availability, customer trust, regulatory exposure, and the team's ability to ship safely." remediation="Revoke or restrict the risky access, preserve evidence, assign an owner, and add a preventative guardrail with an alert." interviewTip="Walk interviewers through your reasoning, not just the control: what you would do first, why, and how you would prove the issue is closed." awsBestPractice="Prefer short-lived identities, explicit resource policies, private network boundaries, encryption, and organization-level monitoring." lessonsLearned="In on-call incident operations, containment always precedes cleanup. Never delete an asset until forensic logs and timeline evidence are preserved." /></> }

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investigations" element={<InvestigationSimulator />} />
        <Route path="/investigations/:id" element={<InvestigationSimulator />} />
        <Route path="/labs" element={<RealLabs />} />
        <Route path="/labs/:id" element={<RealLabs />} />
        <Route path="/playbooks" element={<JobPlaybookEngine />} />
        <Route path="/playbooks/:id" element={<JobPlaybookEngine />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/architecture-reviews" element={<ArchitectureRoute />} />
        <Route path="/internship-simulator" element={<SimulatorRoute />} />
        <Route path="/challenge/:id" element={<InvestigationRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/report" element={<ReportRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  )
}


