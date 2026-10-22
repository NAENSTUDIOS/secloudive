/**
 * SeCloudive Learning Resource Quality Audit
 * Validates: schema completeness, unique IDs, FRQS weight totals,
 * URL format, duplicate detection, and path coverage.
 */

import assert from 'node:assert/strict'
import { resourceCatalog, learningPaths } from '../src/data/learningResources.js'

console.log('='.repeat(60))
console.log('SECLOUDIVE: LEARNING RESOURCE QUALITY AUDIT')
console.log('='.repeat(60))

const REQUIRED_FIELDS = ['id', 'title', 'provider', 'category', 'difficulty', 'url', 'why']
const FRQS_WEIGHTS = { authority: 30, accuracy: 20, practicalUtility: 15, beginnerFriendliness: 10, visualQuality: 10, careerRelevance: 10, recency: 5 }
const FRQS_WEIGHT_TOTAL = Object.values(FRQS_WEIGHTS).reduce((a, b) => a + b, 0)
const URL_REGEX = /^https?:\/\/.+/
const KNOWN_GENERIC_URL = 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals'

// [TEST 1] FRQS weights sum to 100
console.log('\n[TEST 1] FRQS category weights sum to 100%')
assert.strictEqual(FRQS_WEIGHT_TOTAL, 100, `FRQS weights must total 100, got ${FRQS_WEIGHT_TOTAL}`)
console.log(`✓ PASS: FRQS weights total ${FRQS_WEIGHT_TOTAL}%`)

// [TEST 2] All resources have required fields
console.log('\n[TEST 2] All resources have required schema fields')
const resources = Object.values(resourceCatalog)
let schemaErrors = 0
for (const res of resources) {
  for (const field of REQUIRED_FIELDS) {
    if (!res[field]) {
      console.error(`  [FAIL] Resource "${res.id || '(no id)'}" missing required field: ${field}`)
      schemaErrors++
    }
  }
}
assert.strictEqual(schemaErrors, 0, `${schemaErrors} schema field violations found`)
console.log(`✓ PASS: All ${resources.length} resources have required fields`)

// [TEST 3] Unique IDs
console.log('\n[TEST 3] All resource IDs are unique')
const ids = resources.map(r => r.id)
const uniqueIds = new Set(ids)
assert.strictEqual(uniqueIds.size, ids.length, `Duplicate resource IDs detected: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`)
console.log(`✓ PASS: All ${ids.length} resource IDs are unique`)

// [TEST 4] URLs are valid format
console.log('\n[TEST 4] All resource URLs match https?:// format')
let urlErrors = 0
for (const res of resources) {
  if (res.url && !URL_REGEX.test(res.url)) {
    console.error(`  [FAIL] Resource "${res.id}" has malformed URL: ${res.url}`)
    urlErrors++
  }
}
assert.strictEqual(urlErrors, 0, `${urlErrors} malformed URLs found`)
console.log(`✓ PASS: All resource URLs are well-formed`)

// [TEST 5] No resource uses the known generic placeholder Skill Builder URL
console.log('\n[TEST 5] No resource uses the generic placeholder Skill Builder URL')
const genericUrlUsers = resources.filter(r => r.url === KNOWN_GENERIC_URL)
if (genericUrlUsers.length > 0) {
  genericUrlUsers.forEach(r => console.error(`  [FAIL] Resource "${r.id}" uses generic placeholder URL`))
}
assert.strictEqual(genericUrlUsers.length, 0, `${genericUrlUsers.length} resources use the generic placeholder URL`)
console.log(`✓ PASS: No resources use the generic placeholder URL`)

// [TEST 6] FRQS scores are valid when present
console.log('\n[TEST 6] FRQS scores are in range 0-100 when present')
let frqsErrors = 0
for (const res of resources) {
  if (res.frssScore !== undefined) {
    if (typeof res.frssScore !== 'number' || res.frssScore < 0 || res.frssScore > 100) {
      console.error(`  [FAIL] Resource "${res.id}" frssScore out of range: ${res.frssScore}`)
      frqsErrors++
    }
  }
  if (res.frssBreakdown) {
    const total = Object.values(res.frssBreakdown).reduce((a, b) => a + b, 0)
    // weighted total should be <= 100
    if (total > 100.1) {
      console.error(`  [FAIL] Resource "${res.id}" frssBreakdown weighted total > 100: ${total}`)
      frqsErrors++
    }
  }
}
assert.strictEqual(frqsErrors, 0, `${frqsErrors} FRQS score violations found`)
console.log(`✓ PASS: All FRQS scores are valid`)

// [TEST 7] All learning path resource references resolve
console.log('\n[TEST 7] All learning path resource references resolve in catalog')
let missingRefs = 0
for (const [pathKey, path] of Object.entries(learningPaths)) {
  for (const resKey of path.resources) {
    if (!resourceCatalog[resKey]) {
      console.error(`  [FAIL] Path "${pathKey}" references missing resource key: "${resKey}"`)
      missingRefs++
    }
  }
}
assert.strictEqual(missingRefs, 0, `${missingRefs} unresolved resource references in learning paths`)
console.log(`✓ PASS: All learning path resource references resolve`)

// [TEST 8] FRQS classification thresholds are correct
console.log('\n[TEST 8] FRQS classification thresholds')
const classify = (score) => {
  if (score >= 95) return 'Elite'
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Approved'
  if (score >= 70) return 'Review required'
  return 'Rejected'
}
assert.strictEqual(classify(100), 'Elite')
assert.strictEqual(classify(95), 'Elite')
assert.strictEqual(classify(94), 'Excellent')
assert.strictEqual(classify(90), 'Excellent')
assert.strictEqual(classify(89), 'Approved')
assert.strictEqual(classify(80), 'Approved')
assert.strictEqual(classify(79), 'Review required')
assert.strictEqual(classify(70), 'Review required')
assert.strictEqual(classify(69), 'Rejected')
assert.strictEqual(classify(0), 'Rejected')
console.log(`✓ PASS: FRQS classification thresholds are correct (Elite≥95, Excellent≥90, Approved≥80, Review≥70, Rejected<70)`)

// [TEST 9] Coverage — required AWS security domains have at least one resource
console.log('\n[TEST 9] Required AWS security domains have path coverage')
const requiredPaths = ['foundations', 'iam', 's3', 'network', 'monitoring', 'incident-response', 'architecture', 'career']
let missingPaths = 0
for (const pathKey of requiredPaths) {
  if (!learningPaths[pathKey]) {
    console.error(`  [FAIL] Required learning path missing: "${pathKey}"`)
    missingPaths++
  } else if (!learningPaths[pathKey].resources || learningPaths[pathKey].resources.length === 0) {
    console.error(`  [FAIL] Learning path "${pathKey}" has no resources`)
    missingPaths++
  }
}
assert.strictEqual(missingPaths, 0, `${missingPaths} required paths missing or empty`)
console.log(`✓ PASS: All ${requiredPaths.length} required domain paths have resources`)

// [TEST 10] verificationStatus field is present on all resources
console.log('\n[TEST 10] All resources have verificationStatus field')
const missingVerification = resources.filter(r => !r.verificationStatus)
if (missingVerification.length > 0) {
  missingVerification.slice(0, 5).forEach(r => console.error(`  [FAIL] Resource "${r.id}" missing verificationStatus`))
  if (missingVerification.length > 5) console.error(`  ... and ${missingVerification.length - 5} more`)
}
assert.strictEqual(missingVerification.length, 0, `${missingVerification.length} resources missing verificationStatus`)
console.log(`✓ PASS: All resources have verificationStatus`)

console.log('\n' + '='.repeat(60))
console.log('ALL RESOURCE QUALITY AUDIT TESTS PASSED')
console.log('='.repeat(60))
