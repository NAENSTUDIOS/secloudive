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
const CloudProjects = lazy(() => import('../pages/CloudProjects'))
const BattleRooms = lazy(() => import('../pages/BattleRooms'))
const CareerRampUpDirectory = lazy(() => import('../pages/CareerRampUpDirectory'))
const LearningCenter = lazy(() => import('../pages/LearningCenter'))
const CareerRoadmap = lazy(() => import('../components/CareerRoadmap'))
const TimelineSummary = lazy(() => import('../components/AttackTimeline').then(m => ({ default: m.TimelineSummary })))
const LiveFeedPortalPage = lazy(() => import('../pages/LiveFeedPortalPage'))
const CloudiveStudio = lazy(() => import('../pages/CloudiveStudio'))
const InterviewSimulator = lazy(() => import('../pages/InterviewSimulator'))
const PlatformRoadmapPage = lazy(() => import('../pages/PlatformRoadmapPage'))
// ── Cloudive-extracted pages ──
const DownloadsPage = lazy(() => import('../pages/DownloadsPage'))
const LegalPage = lazy(() => import('../pages/LegalPage'))
const SafeLabCostCalculator = lazy(() => import('../components/SafeLabCostCalculator'))
const VerifyAuditPackPage = lazy(() => import('../pages/VerifyAuditPackPage'))

import ClearanceGateCheckpoint from '../components/ClearanceGateCheckpoint'

function RouteLoadingFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: '#94a3b8', font: "12px 'DM Mono', monospace" }}>
      <div className="pulse-dot" style={{ width: '8px', height: '8px' }} />
      <span>INITIALIZING SOC FIELD ENVIRONMENT /// SECURE DISPATCH...</span>
    </div>
  )
}

function GatedRoute({ featureKey, featureTitle, requiredTier, requiredTierName, description, children }) {
  const { checkFeatureAccess, sandboxMode } = useChallenges() || {}
  const access = checkFeatureAccess ? checkFeatureAccess(featureKey) : { accessible: true }

  if (!sandboxMode && access && !access.accessible) {
    return (
      <ClearanceGateCheckpoint
        featureKey={featureKey}
        featureTitle={featureTitle || access?.requiredTierName || 'Clearance Protected'}
        requiredTierNumber={requiredTier || access?.requiredTier || 1}
        requiredTierName={requiredTierName || access?.requiredTierName || 'Standard Clearance'}
        customDescription={description || access?.description || 'Access tier required.'}
      />
    )
  }

  return children
}

function DashboardRoute() { return <><Dashboard /><OfficialLearningPaths variant="dashboard" /></> }

function ReportRoute() {
  const { threatScenarios = [], progress = {}, internshipReadiness } = useChallenges() || {}
  const completed = threatScenarios.find(scenario => progress?.simulatorScores?.[scenario?.id] !== undefined) || threatScenarios[0] || null
  return (
    <>
      <Report />
      {completed && <TimelineSummary scenario={completed} />}
      <CareerRoadmap readiness={internshipReadiness} compact />
      <OfficialLearningPaths variant="career" />
    </>
  )
}

function InvestigationRoute() {
  const { id } = useParams()
  const { challenges = [] } = useChallenges() || {}
  const challenge = (challenges || []).find(item => item?.id === id) || challenges[0] || {
    realWorldImpact: 'Validating permission paths, trust boundaries, and blast radius.',
    remediation: 'Implement least privilege and explicit access boundaries.',
    whyThisMatters: 'Security is a system property: validate effective permissions before changing state.'
  }
  return (
    <>
      <Challenge />
      <EngineerResponse
        response="Start by preserving evidence, validating the effective permission path, and confirming whether the finding is active or historical."
        impact={challenge.realWorldImpact || 'Investigating security blast radius.'}
        remediation={challenge.remediation || 'Enforce explicit resource guardrails.'}
        interviewTip="Explain your order of operations: contain the exposure, preserve evidence, determine blast radius, then implement and verify the fix."
        awsBestPractice="Apply least privilege, explicit resource boundaries, centralized audit logging, and AWS IAM Access Analyzer where applicable."
        lessonsLearned={challenge.whyThisMatters || "Security is a system property: validate effective permissions before changing state."}
      />
    </>
  )
}
function ArchitectureRoute() { return <><ArchitectureReviews /><EngineerResponse response="Map the trust boundaries first, then prioritize the finding that creates the widest blast radius across public access, identity, data, and monitoring." impact="Architecture weaknesses compound: one exposed service or shared identity can turn a local misconfiguration into a business-wide incident." remediation="Separate public, application, and data zones; assign critical asset owners; enforce encryption and least privilege; and continuously validate the controls." interviewTip="Recruiters expect you to prioritize risk, explain tradeoffs, and connect a service-level finding to business impact." awsBestPractice="Use the AWS Well-Architected Security Pillar, multi-account guardrails, centralized logging, and defense in depth." lessonsLearned="Architecture reviews prevent compound failure modes: clear trust boundaries and asset ownership eliminate entire classes of vulnerabilities." /></> }
function SimulatorRoute() { return <><InternshipSimulator /><EngineerResponse response="Triage the ticket, select the evidence that changes the risk decision, contain the highest-impact path, and document what remains uncertain." impact="Security tickets affect availability, customer trust, regulatory exposure, and the team's ability to ship safely." remediation="Revoke or restrict the risky access, preserve evidence, assign an owner, and add a preventative guardrail with an alert." interviewTip="Walk interviewers through your reasoning, not just the control: what you would do first, why, and how you would prove the issue is closed." awsBestPractice="Prefer short-lived identities, explicit resource policies, private network boundaries, encryption, and organization-level monitoring." lessonsLearned="In on-call incident operations, containment always precedes cleanup. Never delete an asset until forensic logs and timeline evidence are preserved." /></> }

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Tier 1 / Open Foundation Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<LearningCenter />} />
        <Route path="/learning/:pathId" element={<LearningCenter />} />
        <Route path="/learning/:pathId/:topicId" element={<LearningCenter />} />
        <Route path="/ramp-up" element={<CareerRampUpDirectory />} />
        <Route path="/rampup" element={<CareerRampUpDirectory />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/roadmap" element={<PlatformRoadmapPage />} />
        <Route path="/exploration-roadmap" element={<PlatformRoadmapPage />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/cost-calculator" element={<SafeLabCostCalculator />} />
        <Route path="/zero-cost-labs" element={<SafeLabCostCalculator />} />

        {/* Tier 2 Gated: Deployment Layer (Labs, Playbooks, Projects) */}
        <Route path="/labs" element={
          <GatedRoute featureKey="labs" featureTitle="Hands-On Cloud Labs" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <RealLabs />
          </GatedRoute>
        } />
        <Route path="/labs/:id" element={
          <GatedRoute featureKey="labs" featureTitle="Hands-On Cloud Labs" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <RealLabs />
          </GatedRoute>
        } />
        <Route path="/playbooks" element={
          <GatedRoute featureKey="playbooks" featureTitle="Job Playbook Engine" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <JobPlaybookEngine />
          </GatedRoute>
        } />
        <Route path="/playbooks/:id" element={
          <GatedRoute featureKey="playbooks" featureTitle="Job Playbook Engine" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <JobPlaybookEngine />
          </GatedRoute>
        } />
        <Route path="/projects" element={
          <GatedRoute featureKey="projects" featureTitle="Production Cloud Projects" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <CloudProjects />
          </GatedRoute>
        } />
        <Route path="/projects/:id" element={
          <GatedRoute featureKey="projects" featureTitle="Production Cloud Projects" requiredTier={2} requiredTierName="Tier 2 (The Deployment Layer)">
            <CloudProjects />
          </GatedRoute>
        } />

        {/* Tier 3 Gated: Scaling Layer (Battle Rooms & Investigations) */}
        <Route path="/battle-rooms" element={
          <GatedRoute featureKey="battle-rooms" featureTitle="Live-Fire Threat Battle Rooms" requiredTier={3} requiredTierName="Tier 3 (The Scaling Layer)">
            <BattleRooms />
          </GatedRoute>
        } />
        <Route path="/battle-rooms/:id" element={
          <GatedRoute featureKey="battle-rooms" featureTitle="Live-Fire Threat Battle Rooms" requiredTier={3} requiredTierName="Tier 3 (The Scaling Layer)">
            <BattleRooms />
          </GatedRoute>
        } />
        <Route path="/investigations" element={
          <GatedRoute featureKey="investigations" featureTitle="SOC Threat Investigation Simulator" requiredTier={3} requiredTierName="Tier 3 (The Scaling Layer)">
            <InvestigationSimulator />
          </GatedRoute>
        } />
        <Route path="/investigations/:id" element={
          <GatedRoute featureKey="investigations" featureTitle="SOC Threat Investigation Simulator" requiredTier={3} requiredTierName="Tier 3 (The Scaling Layer)">
            <InvestigationSimulator />
          </GatedRoute>
        } />
        <Route path="/challenge/:id" element={
          <GatedRoute featureKey="investigations" featureTitle="SOC Threat Investigation Simulator" requiredTier={3} requiredTierName="Tier 3 (The Scaling Layer)">
            <InvestigationRoute />
          </GatedRoute>
        } />

        {/* Tier 4 Gated: Architecture Layer (Well-Architected Reviews & Live Threat Portal) */}
        <Route path="/architecture-reviews" element={
          <GatedRoute featureKey="architecture-reviews" featureTitle="Multi-Cloud Architecture Reviews" requiredTier={4} requiredTierName="Tier 4 (The Architecture Layer)">
            <ArchitectureRoute />
          </GatedRoute>
        } />
        <Route path="/live-portal" element={
          <GatedRoute featureKey="live-portal" featureTitle="Enterprise Live Threat Portal" requiredTier={4} requiredTierName="Tier 4 (The Architecture Layer)">
            <LiveFeedPortalPage />
          </GatedRoute>
        } />

        {/* Tier 5 Gated: Full Command Deck / Capstone (Internship, Interview, Studio, Verified Dossier) */}
        <Route path="/internship-simulator" element={
          <GatedRoute featureKey="internship-simulator" featureTitle="SOC On-Call Internship Simulator" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <SimulatorRoute />
          </GatedRoute>
        } />
        <Route path="/interview-simulator" element={
          <GatedRoute featureKey="interview-simulator" featureTitle="Cloud Security Technical Interview Simulator" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <InterviewSimulator />
          </GatedRoute>
        } />
        <Route path="/interview" element={
          <GatedRoute featureKey="interview-simulator" featureTitle="Cloud Security Technical Interview Simulator" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <InterviewSimulator />
          </GatedRoute>
        } />
        <Route path="/hiring-simulator" element={
          <GatedRoute featureKey="interview-simulator" featureTitle="Cloud Security Technical Interview Simulator" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <InterviewSimulator />
          </GatedRoute>
        } />
        <Route path="/cloudive-studio" element={
          <GatedRoute featureKey="cloudive-studio" featureTitle="Cloudive Studio & IaC Auto-Fixer" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <CloudiveStudio />
          </GatedRoute>
        } />
        <Route path="/builder-studio" element={
          <GatedRoute featureKey="cloudive-studio" featureTitle="Cloudive Studio & IaC Auto-Fixer" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <CloudiveStudio />
          </GatedRoute>
        } />
        <Route path="/report" element={
          <GatedRoute featureKey="report" featureTitle="Cryptographic Audit Report & Verified Credential" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <ReportRoute />
          </GatedRoute>
        } />
        <Route path="/verify-pack" element={
          <GatedRoute featureKey="verify-pack" featureTitle="Cryptographic Audit Dossier Verifier" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <VerifyAuditPackPage />
          </GatedRoute>
        } />
        <Route path="/verify" element={
          <GatedRoute featureKey="verify-pack" featureTitle="Cryptographic Audit Dossier Verifier" requiredTier={5} requiredTierName="Tier 4 Cleared (Full Command Deck Access)">
            <VerifyAuditPackPage />
          </GatedRoute>
        } />

        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  )
}


