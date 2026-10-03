// =========================================================================
// Automated Test: Enforce SIMULATED Notice & Synthetic Identifier Rules
// Hard Requirement: Build fails if any plausible-real AWS account ID or ARN is generated
// =========================================================================

import assert from 'node:assert'
import { UNIFIED_ATTACK_SCENARIOS, SYNTHETIC_CONSTANTS } from '../src/data/simulatedAttackScenarios.js'
import {
  generateRemediationAuditPack,
  createIntegrityEnvelope,
  verifyExportPackage,
  canonicalJsonStringify
} from '../src/utils/auditExportEngine.js'

console.log('------------------------------------------------------------')
console.log('Running Test Suite: Automated Simulated Identifiers Guard')
console.log('------------------------------------------------------------')

const REAL_AWS_ACCOUNT_REGEX = /\b(?!000000000000)\d{12}\b/g
const REAL_AWS_ARN_REGEX = /arn:aws:(?!simulated:)[a-zA-Z0-9_-]+:[a-z0-9-]*:(?!000000000000)\d{12}:[a-zA-Z0-9/_.-]+/g

// Helper to inspect all strings in deeply nested objects
function extractAllStrings(obj, collector = []) {
  if (obj === null || obj === undefined) return collector
  if (typeof obj === 'string') {
    collector.push(obj)
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractAllStrings(item, collector))
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      collector.push(key)
      extractAllStrings(obj[key], collector)
    })
  }
  return collector
}

// ── Test 1: UNIFIED_ATTACK_SCENARIOS telemetry ──────────────────────────
console.log('[Test 1] Inspecting UNIFIED_ATTACK_SCENARIOS structured logs...')

for (const [scenarioKey, scenario] of Object.entries(UNIFIED_ATTACK_SCENARIOS)) {
  console.log(`  Checking scenario: ${scenarioKey} (${scenario.title})`)
  assert.ok(scenario.steps.length > 0, `Scenario ${scenarioKey} must have steps`)

  for (const step of scenario.steps) {
    const log = step.structuredLog
    assert.ok(log, `Step ${step.step} in ${scenarioKey} must have structuredLog`)
    assert.strictEqual(
      log.simulationNotice,
      'SIMULATED - not a real AWS event',
      `Log in ${scenarioKey} step ${step.step} missing required simulationNotice`
    )

    const allStrings = extractAllStrings(log)
    const jsonStr = JSON.stringify(log)

    // Check account IDs
    const matchedRealAccounts = jsonStr.match(REAL_AWS_ACCOUNT_REGEX)
    assert.strictEqual(
      matchedRealAccounts,
      null,
      `Plausible real AWS Account ID detected in ${scenarioKey} step ${step.step}: ${matchedRealAccounts}`
    )

    // Check ARNs
    const matchedRealArns = jsonStr.match(REAL_AWS_ARN_REGEX)
    assert.strictEqual(
      matchedRealArns,
      null,
      `Plausible real AWS ARN detected in ${scenarioKey} step ${step.step}: ${matchedRealArns}`
    )

    // Ensure account ID is strictly 000000000000 if present
    if (log.accountId) {
      assert.strictEqual(log.accountId, '000000000000')
    }
    if (log.recipientAccountId) {
      assert.strictEqual(log.recipientAccountId, '000000000000')
    }
  }
}
console.log('✓ Test 1 Passed: All attack scenarios adhere strictly to fake identifiers.')

// ── Test 2: generateRemediationAuditPack Export Engine ───────────────────
console.log('[Test 2] Generating and validating Audit Pack export payloads...')

const scenariosToTest = [
  { id: 'ssrf-imds', title: 'Capital One SSRF & IMDSv1' },
  { id: 's3-exfil', title: 'S3 Object Exfiltration' },
  { id: 'crypto-miner', title: 'EC2 GPU Cryptomining Hijack' }
]

for (const sc of scenariosToTest) {
  const pack = await generateRemediationAuditPack({
    scenario: sc,
    topologyScore: 90,
    topologyControls: { imdsv2: true, s3BlockPublic: true, kmsCustomerKey: true, sgRestricted: true },
    learnerId: 'SIM-TEST-ANALYST'
  })

  assert.strictEqual(
    pack.simulationNotice,
    'SIMULATED - not a real AWS event',
    'Pack payload must include simulationNotice at root'
  )
  assert.strictEqual(
    pack.meta.simulatedAccountId,
    '000000000000',
    'Pack metadata must use 000000000000 account ID'
  )

  const jsonStr = JSON.stringify(pack)
  const realAccounts = jsonStr.match(REAL_AWS_ACCOUNT_REGEX)
  assert.strictEqual(
    realAccounts,
    null,
    `Plausible real AWS Account ID found in audit pack for ${sc.id}: ${realAccounts}`
  )

  const realArns = jsonStr.match(REAL_AWS_ARN_REGEX)
  assert.strictEqual(
    realArns,
    null,
    `Plausible real AWS ARN found in audit pack for ${sc.id}: ${realArns}`
  )
}
console.log('✓ Test 2 Passed: Audit Pack export outputs use strictly synthetic identifiers.')

// ── Test 3: Integrity Envelope & Verification Engine ────────────────────
console.log('[Test 3] Testing HMAC-SHA256 integrity envelope & verification...')

const testPayload = {
  scenario: 'SIM-SSRF-001',
  score: 95,
  simulatedAccount: '000000000000',
  simulatedArn: 'arn:aws:simulated:iam::000000000000:role/SIM-AppRole'
}

const envelope = await createIntegrityEnvelope(testPayload, 'remediation_audit_pack')
assert.strictEqual(envelope.integrityEnvelope.status, 'Integrity-checked')
assert.strictEqual(envelope.integrityEnvelope.simulationNotice, 'SIMULATED - not a real AWS event. Educational verification only.')
assert.ok(envelope.integrityEnvelope.hmacDigest.length === 64, 'HMAC-SHA256 must be 64-char hex string')

const verification = await verifyExportPackage(envelope)
assert.strictEqual(verification.isValid, true, 'Original envelope must verify as valid')
assert.strictEqual(verification.status, 'Integrity-checked')

// Test Tampering Detection
const tampered = JSON.parse(JSON.stringify(envelope))
tampered.payload.score = 100 // Altered data
const tamperedVerification = await verifyExportPackage(tampered)
assert.strictEqual(tamperedVerification.isValid, false, 'Tampered payload must fail verification')
assert.strictEqual(tamperedVerification.status, 'Integrity Check Failed')
console.log('✓ Test 3 Passed: HMAC-SHA256 integrity verification detects tampering accurately.')

// ── Test 4: Intentionally Inject Malformed Identifier to Prove Rejection ─
console.log('[Test 4] Validating that test asserts and fails on plausible-real account IDs...')

const malformedPayload = {
  account: '123456789012', // Real-looking 12-digit AWS account
  arn: 'arn:aws:iam::123456789012:role/Admin'
}
const malformedJson = JSON.stringify(malformedPayload)
const detectedAccounts = malformedJson.match(REAL_AWS_ACCOUNT_REGEX)
assert.ok(detectedAccounts && detectedAccounts.includes('123456789012'), 'Test detector must identify non-zero 12-digit accounts')

const detectedArns = malformedJson.match(REAL_AWS_ARN_REGEX)
assert.ok(detectedArns && detectedArns.length > 0, 'Test detector must identify plausible real ARNs')

console.log('✓ Test 4 Passed: Negative test confirmed — real account IDs and ARNs are strictly caught.')

console.log('------------------------------------------------------------')
console.log('ALL TESTS PASSED: 100% Compliance with Simulation Guardrails')
console.log('------------------------------------------------------------')
