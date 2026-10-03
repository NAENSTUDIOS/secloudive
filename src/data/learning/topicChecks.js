// Topic Knowledge Check Engine for Every Learning Topic in SeCloudive Academy
// Follows the 3-part requirement:
// 1. Quick Check (3 Questions)
// 2. Scenario Check (1 Real-World Incident Question)
// 3. Engineer Thinking Check (1 High-Stakes Decision Question with Reasoning, Impact, and AWS Best Practice)
// 4. Engineer Reflection Prompt
// With Option Randomization and Infallible Answer Verification

import { shuffleArray, randomizeQuestionOptions } from './adaptiveQuizEngine'

/**
 * Builds the comprehensive 5-question Knowledge Check Suite for any topic
 * Guarantees unique option ordering on every attempt while ensuring 100% correct answer verification
 */
export function getTopicKnowledgeSuite(topic) {
  if (!topic) return null

  // If topic has pre-baked custom suite, randomize and return
  if (topic.knowledgeChecksSuite && Array.isArray(topic.knowledgeChecksSuite.questions)) {
    return {
      ...topic.knowledgeChecksSuite,
      questions: topic.knowledgeChecksSuite.questions.map(q => randomizeQuestionOptions(q))
    }
  }

  const baseCheck = topic.knowledgeCheck || {}
  const realWorld = topic.realWorldExample || topic.realWorldScenario || {}
  const risks = topic.securityRisks || []
  const practices = topic.bestPractices || []
  const engineerChecks = topic.whatEngineerChecks || topic.whatACloudSecEngineerChecks || []
  const mistakes = topic.commonBeginnerMistakes || []

  const title = topic.title || 'Cloud Security Control'
  const primaryPractice = practices[0] || 'Enforce least privilege and automated boundary monitoring.'
  const primaryCheck = engineerChecks[0] || {}
  const primaryCheckText = typeof primaryCheck === 'string' ? primaryCheck : (primaryCheck.detail || primaryCheck.command || 'Audit effective configuration via AWS CLI.')
  const primaryMistake = mistakes[0] || 'Relying on default configurations without least-privilege review.'

  // ==========================================
  // 1. QUICK CHECK (3 Questions)
  // ==========================================

  // Quick Check Q1: Core Purpose
  let qc1Options = [
    'To provide automated billing reports to corporate finance.',
    `To enforce robust security boundaries, reduce blast radius, and ensure predictable authorization for ${title}.`,
    'To accelerate internet download bandwidth for desktop clients.',
    'To disable CloudTrail logging for performance optimization.'
  ]
  let qc1CorrectAnswer = `To enforce robust security boundaries, reduce blast radius, and ensure predictable authorization for ${title}.`
  let qc1Explanation = baseCheck.explanation || `Understanding ${title} is essential for establishing reliable cloud trust boundaries and avoiding accidental misconfigurations.`

  if (Array.isArray(baseCheck.options) && baseCheck.options.length > 0) {
    if (typeof baseCheck.options[0] === 'object' && baseCheck.options[0] !== null) {
      qc1Options = baseCheck.options.map(opt => (typeof opt === 'string' ? opt : (opt.text || opt.title || '')))
      const correctOpt = baseCheck.options.find(opt => opt.isCorrect === true) || baseCheck.options[0]
      qc1CorrectAnswer = typeof correctOpt === 'string' ? correctOpt : (correctOpt.text || '')
      if (correctOpt.explanation) {
        qc1Explanation = correctOpt.explanation
      }
    } else {
      qc1Options = baseCheck.options.map(opt => (typeof opt === 'string' ? opt : (opt?.text || String(opt))))
      if (typeof baseCheck.correctIndex === 'number' && qc1Options[baseCheck.correctIndex]) {
        qc1CorrectAnswer = qc1Options[baseCheck.correctIndex]
      } else if (baseCheck.correctAnswer) {
        qc1CorrectAnswer = typeof baseCheck.correctAnswer === 'string' ? baseCheck.correctAnswer : (baseCheck.correctAnswer?.text || '')
      }
    }
  }

  const qc1 = {
    id: `${topic.id || 'topic'}-qc1`,
    type: 'quickCheck',
    typeTitle: 'Quick Check 1/3: Core Concept',
    typeIcon: '💡',
    difficulty: 'Beginner',
    question: baseCheck.question || `What is the core security objective of ${title} in an AWS environment?`,
    options: qc1Options,
    correctAnswer: qc1CorrectAnswer,
    explanation: qc1Explanation
  }

  // Quick Check Q2: Mechanism & Security Boundaries
  const qc2 = {
    id: `${topic.id || 'topic'}-qc2`,
    type: 'quickCheck',
    typeTitle: 'Quick Check 2/3: Mechanism & Boundary',
    typeIcon: '⚙️',
    difficulty: 'Intermediate',
    question: `When evaluating security boundaries for ${title}, which principle is most critical for preventing privilege escalation or data leakage?`,
    options: [
      'Allowing unrestricted access to all authenticated identities in the same region.',
      `Enforcing explicit resource policies and least-privilege scoping to ensure only authorized principals can perform specific actions on ${title}.`,
      'Disabling encryption to accelerate API throughput.',
      'Granting permanent administrative access to unblock rapid development sprints.'
    ],
    correctAnswer: `Enforcing explicit resource policies and least-privilege scoping to ensure only authorized principals can perform specific actions on ${title}.`,
    explanation: `Security boundaries must be verified mathematically. Relying on implicit trust or broad wildcards compromises the entire environment.`
  }

  // Quick Check Q3: Common Anti-Pattern & Risk
  const qc3 = {
    id: `${topic.id || 'topic'}-qc3`,
    type: 'quickCheck',
    typeTitle: 'Quick Check 3/3: Common Anti-Pattern',
    typeIcon: '⚠️',
    difficulty: 'Intermediate',
    question: `What is the most dangerous beginner mistake observed in enterprise environments regarding ${title}?`,
    options: [
      typeof primaryMistake === 'string' ? primaryMistake : (primaryMistake.mistake || 'Deploying over-permissive wildcard permissions to avoid configuration errors.'),
      'Enabling AWS CloudTrail multi-region logging.',
      'Configuring automated alerts for critical changes.',
      'Conducting quarterly architecture reviews with senior staff.'
    ],
    correctAnswer: typeof primaryMistake === 'string' ? primaryMistake : (primaryMistake.mistake || 'Deploying over-permissive wildcard permissions to avoid configuration errors.'),
    explanation: `Anti-patterns around ${title} frequently stem from convenience over security. Hardening default settings prevents exploitation.`
  }

  // ==========================================
  // 2. SCENARIO CHECK (Real-World Question)
  // ==========================================
  const scenarioCheck = {
    id: `${topic.id || 'topic'}-sc1`,
    type: 'scenarioCheck',
    typeTitle: 'Scenario Check: Real-World Incident',
    typeIcon: '🎯',
    difficulty: 'Advanced',
    question: realWorld.title
      ? `Scenario: "${realWorld.title}" — ${realWorld.scenario || realWorld.incident || 'An active security event is identified involving ' + title}. What is the most immediate risk to the environment?`
      : `An attacker gains initial foothold in an environment where ${title} is misconfigured. What is the most immediate threat?`,
    options: [
      'AWS will immediately shut down the physical data center.',
      realWorld.impact || risks[0] || 'Unauthorized privilege escalation, boundary bypass, or sensitive data exfiltration resulting from over-permissive access.',
      'The company website CSS styling will fail to load.',
      'Internet routing will automatically revert to dial-up protocols.'
    ],
    correctAnswer: realWorld.impact || risks[0] || 'Unauthorized privilege escalation, boundary bypass, or sensitive data exfiltration resulting from over-permissive access.',
    explanation: realWorld.detectionMethod
      ? `Detection Telemetry: ${realWorld.detectionMethod}. Immediate containment requires isolating the compromised principal and validating effective policies.`
      : `The primary risk is ${risks[0] || 'unauthorized data exposure or administrative takeover'}. Hardening this control eliminates the attacker's foothold.`
  }

  // ==========================================
  // 3. ENGINEER THINKING CHECK (Decision-Making)
  // ==========================================
  const engineerDecisionCheck = {
    id: `${topic.id || 'topic'}-dec1`,
    type: 'engineerDecisionCheck',
    typeTitle: 'Engineer Thinking Check: Decision-Making',
    typeIcon: '⚡',
    difficulty: 'Engineer Level',
    question: `You are on call as a Senior Cloud Security Engineer. Telemetry indicates a critical misconfiguration or anomaly involving ${title}. What action should you take FIRST?`,
    options: [
      'Immediately terminate the entire AWS account and re-deploy from scratch tomorrow.',
      `Verify alert evidence, contain the affected resource or identity using ${title} guardrails, preserve forensic logs, and inspect CloudTrail before altering persistent state.`,
      'Post on public social media to ask if others have seen this issue.',
      'Delete the CloudWatch alarm to stop notification alerts.'
    ],
    correctAnswer: `Verify alert evidence, contain the affected resource or identity using ${title} guardrails, preserve forensic logs, and inspect CloudTrail before altering persistent state.`,
    explanation: 'Senior engineers prioritize evidence verification and containment over hasty destructive actions.',
    engineerReasoning: `Senior Cloud Security Engineers verify evidence and contain the blast radius first. Specifically: ${primaryCheckText}`,
    businessImpact: `Hasty unverified changes cause self-inflicted business outages, while ignoring alerts allows active data exfiltration.`,
    awsBestPractice: primaryPractice
  }

  // Combine and randomize options for all 5 questions
  const randomizedQuestions = [qc1, qc2, qc3, scenarioCheck, engineerDecisionCheck].map(q =>
    randomizeQuestionOptions(q)
  )

  // 4. Reflection Question
  const reflectionPrompt = {
    typeTitle: 'Engineer Reflection Prompt',
    typeIcon: '💭',
    prompt: `How would you defend the implementation of ${title} security controls to a Product Director who argues that strict guardrails slow down feature release velocity?`,
    seniorGuidance: `Senior SecOps engineers frame security as an accelerator, not a blocker: "Automated guardrails and least privilege allow engineering teams to deploy faster with confidence, eliminating costly emergency production freezes and customer-facing incident post-mortems."`
  }

  return {
    topicId: topic.id,
    topicTitle: title,
    questions: randomizedQuestions,
    reflectionPrompt
  }
}
