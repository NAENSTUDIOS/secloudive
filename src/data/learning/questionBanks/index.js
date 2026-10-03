// Central Question Banks Registry for SeCloudive Academy
// 6 Core Technical Domains • 30 High-Yield Questions each • Total 180 Questions
// Standardized on Beginner, Intermediate, Advanced, and Engineer Level classifications

import { iamQuestionBank } from './iamBank'
import { s3QuestionBank } from './s3Bank'
import { networkQuestionBank } from './networkBank'
import { monitoringQuestionBank } from './monitoringBank'
import { architectureQuestionBank } from './architectureBank'
import { incidentResponseQuestionBank } from './incidentResponseBank'

export {
  iamQuestionBank,
  s3QuestionBank,
  networkQuestionBank,
  monitoringQuestionBank,
  architectureQuestionBank,
  incidentResponseQuestionBank
}

export const questionBanksByPath = {
  iam: {
    pathId: 'iam',
    domainName: 'Identity & Access Management',
    bank: iamQuestionBank,
    badgeId: 'iam-defender'
  },
  s3: {
    pathId: 's3',
    domainName: 'Data Security (S3)',
    bank: s3QuestionBank,
    badgeId: 's3-guardian'
  },
  network: {
    pathId: 'network',
    domainName: 'Network Security',
    bank: networkQuestionBank,
    badgeId: 'network-protector'
  },
  monitoring: {
    pathId: 'monitoring',
    domainName: 'Monitoring & Logging',
    bank: monitoringQuestionBank,
    badgeId: 'monitoring-specialist'
  },
  architecture: {
    pathId: 'architecture',
    domainName: 'Security Architecture',
    bank: architectureQuestionBank,
    badgeId: 'architecture-reviewer'
  },
  'incident-response': {
    pathId: 'incident-response',
    domainName: 'Incident Response',
    bank: incidentResponseQuestionBank,
    badgeId: 'incident-commander'
  }
}

export function getQuestionBankForPath(pathId) {
  const normalized = (pathId || '').toLowerCase()
  if (normalized.includes('iam') || normalized.includes('identity')) return iamQuestionBank
  if (normalized.includes('s3') || normalized.includes('data')) return s3QuestionBank
  if (normalized.includes('net')) return networkQuestionBank
  if (normalized.includes('mon') || normalized.includes('log')) return monitoringQuestionBank
  if (normalized.includes('arch')) return architectureQuestionBank
  if (normalized.includes('inc') || normalized.includes('resp')) return incidentResponseQuestionBank
  return questionBanksByPath[normalized]?.bank || iamQuestionBank
}
