// =========================================================================
// SeCloudive Test Suite: Multi-Method Authentication & Login Verification
// =========================================================================

import assert from 'node:assert'

// Minimal mock localStorage for Node.js testing
const store = new Map()
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
}

// Minimal window & CustomEvent mock
const dispatchedEvents = []
global.window = {
  dispatchEvent: (e) => {
    dispatchedEvents.push(e)
    return true
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { origin: 'http://localhost:5173' }
}
global.CustomEvent = class CustomEvent {
  constructor(name, detail) {
    this.name = name
    this.detail = detail
  }
}

// Import services
const {
  validateUserIdFormat,
  isUserIdAvailable,
  generateUniqueUserId,
  getAllProfiles,
  getActiveProfile,
  registerUniqueProfile,
  loginWithUserId,
  loginWithUserIdAsync,
  switchToGuestMode,
  saveProfileProgress,
  loadProfileProgress,
  signInWithGoogleAccount,
  parseGoogleCredential,
  deterministicGoogleUserId,
  GUEST_PROFILE_ID
} = await import('../src/services/userSyncManager.js')

console.log('============================================================')
console.log('SECLOUDIVE AUTH TEST: MULTI-METHOD LOGIN VERIFICATION')
console.log('============================================================')

// Test 1: Guest Mode Default
console.log('\n[TEST 1] Initial Guest Session State')
store.clear()
const initialGuest = getActiveProfile()
assert.strictEqual(initialGuest.id, GUEST_PROFILE_ID, 'Active profile must be guest')
assert.strictEqual(initialGuest.isGuest, true, 'isGuest must be true')
console.log('✓ PASS: Guest Mode active by default for unauthenticated sessions.')

// Test 2: Google Sign In Flow (Deterministic 1-to-1 Mapping)
console.log('\n[TEST 2] Google OAuth Login & Deterministic ID Binding')
const googleUser = {
  sub: '109849201928471029384',
  email: 'nasir.engineer@gmail.com',
  name: 'Nasir Cloud Defender',
  picture: 'https://lh3.googleusercontent.com/avatar=s96-c'
}

const gglResult1 = signInWithGoogleAccount(googleUser)
assert.strictEqual(gglResult1.success, true, 'Google sign in succeeded')
assert.strictEqual(gglResult1.isNew, true, 'First sign in registers profile')
const boundId = gglResult1.profile.id
assert.ok(boundId.startsWith('SEC-'), 'User ID starts with SEC- prefix')
assert.strictEqual(getActiveProfile().id, boundId, 'Active profile switched to Google ID')

// Re-login with same Google user: must yield exact same ID without duplicating
const gglResult2 = signInWithGoogleAccount(googleUser)
assert.strictEqual(gglResult2.success, true, 'Repeat Google sign in succeeded')
assert.strictEqual(gglResult2.isNew, false, 'Existing user detected')
assert.strictEqual(gglResult2.profile.id, boundId, 'Must map to exact same single User ID')
assert.strictEqual(getAllProfiles().length, 1, 'Exactly one profile created')
console.log(`✓ PASS: Google user permanently bound to single deterministic User ID ("${boundId}").`)

// Test 3: Unique User ID Login & Case-Insensitive Matching
console.log('\n[TEST 3] Unique User ID Login')
// Switch to guest first
switchToGuestMode()
assert.strictEqual(getActiveProfile().id, GUEST_PROFILE_ID, 'Switched to guest')

// Login with lower-case variant of boundId
const loginRes = loginWithUserId(boundId.toLowerCase())
assert.strictEqual(loginRes.success, true, 'Login with User ID succeeded')
assert.strictEqual(getActiveProfile().id, boundId, 'Active profile restored to bound ID')
console.log(`✓ PASS: Unique User ID login works with case-insensitive normalization.`)

// Test 4: Unknown User ID Login Handled Gracefully
console.log('\n[TEST 4] Unknown User ID Error Handling & Claim Suggestion')
const unknownRes = loginWithUserId('SEC-NONEXISTENT-9999')
assert.strictEqual(unknownRes.success, false, 'Unknown User ID rejected')
assert.strictEqual(unknownRes.notFound, true, 'notFound flag set for UI claim trigger')
assert.strictEqual(unknownRes.requestedId, 'SEC-NONEXISTENT-9999', 'Requested ID preserved')
console.log(`✓ PASS: Unknown User ID cleanly flagged with claim suggestion: "${unknownRes.error}".`)

// Test 5: Register New Unique User ID & Migrate Guest Progress
console.log('\n[TEST 5] Register New Unique User ID with Guest Data Migration')
switchToGuestMode()
// Perform simulated lab in guest sandbox
saveProfileProgress(GUEST_PROFILE_ID, {
  completed: { 'lab-s3-guardduty': true },
  investigationScores: { 'inv-01': 95 }
})

const regRes = registerUniqueProfile({
  userId: 'SEC-ALEX-7788',
  name: 'Alex Carter',
  role: 'DevSecOps Specialist',
  migrateGuestData: true
})
assert.strictEqual(regRes.success, true, 'Registered successfully')
assert.strictEqual(getActiveProfile().id, 'SEC-ALEX-7788', 'Active profile is now Alex')

// Verify guest data was migrated to Alex's isolated store
const alexProgress = loadProfileProgress('SEC-ALEX-7788')
assert.strictEqual(alexProgress.completed['lab-s3-guardduty'], true, 'Guest completed lab migrated')
assert.strictEqual(alexProgress.investigationScores['inv-01'], 95, 'Guest score migrated')
console.log('✓ PASS: Guest session progress seamlessly migrated into newly registered Unique User ID.')

// Test 6: Asynchronous Cloud Lookup Function Exists and Runs Cleanly
console.log('\n[TEST 6] Asynchronous User ID Cloud Lookup Function')
const asyncRes = await loginWithUserIdAsync('SEC-ALEX-7788')
assert.strictEqual(asyncRes.success, true, 'Async login found local user')
assert.strictEqual(asyncRes.profile.id, 'SEC-ALEX-7788', 'Async login activated profile')

const asyncUnknown = await loginWithUserIdAsync('SEC-DEFINITELY-MISSING-404')
assert.strictEqual(asyncUnknown.success, false, 'Missing user rejected by async resolver')
assert.strictEqual(asyncUnknown.notFound, true, 'notFound flag preserved')
console.log('✓ PASS: loginWithUserIdAsync operates seamlessly with cloud fallback.')

console.log('\n============================================================')
console.log('ALL LOGIN METHOD TESTS PASSED (100% SUCCESS)')
console.log('============================================================')
