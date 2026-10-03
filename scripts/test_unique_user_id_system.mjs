// =========================================================================
// SeCloudive Test Suite: Unique User ID, Data Isolation & Guest Mode
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
global.window = {
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {}
}
global.CustomEvent = class CustomEvent {
  constructor(name, detail) {
    this.name = name
    this.detail = detail
  }
}

// Import our UserSyncManager services
const {
  validateUserIdFormat,
  isUserIdAvailable,
  generateUniqueUserId,
  getAllProfiles,
  getActiveProfile,
  registerUniqueProfile,
  loginWithUserId,
  switchToGuestMode,
  saveProfileProgress,
  loadProfileProgress,
  getProfileStorageKey,
  deleteProfile,
  GUEST_PROFILE_ID,
  PROFILES_REGISTRY_KEY,
  ACTIVE_PROFILE_KEY
} = await import('../src/services/userSyncManager.js')

console.log('============================================================')
console.log('SECLOUDIVE TEST: UNIQUE USER ID, DATA ISOLATION & GUEST MODE')
console.log('============================================================')

// Test 1: User ID validation rules
console.log('\n[TEST 1] User ID Format Validation')
assert.strictEqual(validateUserIdFormat('').valid, false, 'Empty ID must be rejected')
assert.strictEqual(validateUserIdFormat('ab').valid, false, 'Less than 3 chars must be rejected')
assert.strictEqual(validateUserIdFormat('user!name').valid, false, 'Special chars must be rejected')
assert.strictEqual(validateUserIdFormat('guest').valid, false, '"guest" is reserved and must be rejected')
assert.strictEqual(validateUserIdFormat('SEC-USER-001').valid, true, 'Valid ID with hyphen accepted')
assert.strictEqual(validateUserIdFormat('dev_sec_99').valid, true, 'Valid ID with underscore accepted')
console.log('✓ PASS: User ID format rules enforced (3-32 alphanumeric/hyphen/underscore, guest prohibited).')

// Test 2: Guest Mode Default
console.log('\n[TEST 2] Default Session Runs in Guest Mode')
store.clear()
const initialProfile = getActiveProfile()
assert.strictEqual(initialProfile.id, GUEST_PROFILE_ID, 'Default active profile must be guest')
assert.strictEqual(initialProfile.isGuest, true, 'isGuest flag must be true')
console.log(`✓ PASS: Initial unauthenticated state correctly runs in Guest Mode (id: "${initialProfile.id}").`)

// Test 3: Unique User ID Generation
console.log('\n[TEST 3] Auto-generate Unique User IDs')
const generatedId1 = generateUniqueUserId('SEC-ENG')
const generatedId2 = generateUniqueUserId('SEC-ENG')
assert.ok(generatedId1.startsWith('SEC-ENG-'), 'Generated ID matches prefix')
assert.notStrictEqual(generatedId1, generatedId2, 'Subsequent generated IDs must be unique')
console.log(`✓ PASS: Generated unique IDs successfully: "${generatedId1}", "${generatedId2}".`)

// Test 4: Register User 1 & Uniqueness Constraint
console.log('\n[TEST 4] Register User 1 & Enforce No Duplicates')
const reg1 = registerUniqueProfile({
  userId: 'SEC-ALICE-100',
  name: 'Alice Security',
  role: 'Cloud Security Engineer'
})
assert.strictEqual(reg1.success, true, 'Alice registered successfully')
assert.strictEqual(getActiveProfile().id, 'SEC-ALICE-100', 'Active profile is now Alice')

// Try to register duplicate ID "SEC-ALICE-100" or case-insensitive "sec-alice-100"
const duplicateReg = registerUniqueProfile({
  userId: 'sec-alice-100',
  name: 'Imposter Alice',
  role: 'Attacker'
})
assert.strictEqual(duplicateReg.success, false, 'Duplicate User ID must be strictly blocked')
assert.ok(duplicateReg.error.includes('already claimed'), 'Error explicitly informs user ID is taken')
console.log('✓ PASS: Duplicate User ID registration strictly blocked: Everyone cannot have the same ID.')

// Test 5: Register User 2
console.log('\n[TEST 5] Register User 2 with Different Unique ID')
const reg2 = registerUniqueProfile({
  userId: 'SEC-BOB-200',
  name: 'Bob Operator',
  role: 'SOC Analyst'
})
assert.strictEqual(reg2.success, true, 'Bob registered successfully with unique ID')
assert.strictEqual(getActiveProfile().id, 'SEC-BOB-200', 'Active profile is now Bob')

const allProfiles = getAllProfiles()
assert.strictEqual(allProfiles.length, 2, 'Exactly 2 profiles in registry')
console.log(`✓ PASS: Multiple distinct profiles saved: ${allProfiles.map(p => p.id).join(', ')}.`)

// Test 6: Strict Data Isolation between Users
console.log('\n[TEST 6] Strict Data Isolation Between User IDs')
// Save progress for Alice
saveProfileProgress('SEC-ALICE-100', {
  completed: { 'iam-01': true, 's3-02': true },
  investigationScores: { 'inv-01': 95 }
})

// Save progress for Bob
saveProfileProgress('SEC-BOB-200', {
  completed: { 'network-01': true },
  investigationScores: { 'inv-02': 88 }
})

// Verify Alice's data
const aliceProgress = loadProfileProgress('SEC-ALICE-100')
assert.strictEqual(aliceProgress.completed['iam-01'], true, "Alice has iam-01")
assert.strictEqual(aliceProgress.completed['network-01'], undefined, "Alice DOES NOT have Bob's network-01")

// Verify Bob's data
const bobProgress = loadProfileProgress('SEC-BOB-200')
assert.strictEqual(bobProgress.completed['network-01'], true, "Bob has network-01")
assert.strictEqual(bobProgress.completed['iam-01'], undefined, "Bob DOES NOT have Alice's iam-01")

// Check exact storage keys
assert.strictEqual(getProfileStorageKey('SEC-ALICE-100'), 'secloudive_user_SEC-ALICE-100_progress_v2')
assert.strictEqual(getProfileStorageKey('SEC-BOB-200'), 'secloudive_user_SEC-BOB-200_progress_v2')
console.log("✓ PASS: Complete data isolation verified: User A's progress never leaks into User B's account.")

// Test 7: Guest Mode Fallback
console.log('\n[TEST 7] Switch to Guest Mode & Isolation')
switchToGuestMode()
const currentGuest = getActiveProfile()
assert.strictEqual(currentGuest.id, GUEST_PROFILE_ID, 'Active profile is guest')
assert.strictEqual(currentGuest.isGuest, true, 'Guest flag is true')

// Guest works in guest sandbox
saveProfileProgress(GUEST_PROFILE_ID, {
  completed: { 'guest-sample-lab': true }
})
const guestData = loadProfileProgress(GUEST_PROFILE_ID)
assert.strictEqual(guestData.completed['guest-sample-lab'], true, 'Guest data in sandbox')

// Guest data does not contaminate registered users
const aliceCheck = loadProfileProgress('SEC-ALICE-100')
assert.strictEqual(aliceCheck.completed['guest-sample-lab'], undefined, 'Guest data does not leak to Alice')
console.log('✓ PASS: Guest Mode runs in an isolated sandbox without polluting registered users.')

// Test 8: Login with User ID
console.log('\n[TEST 8] Login with Existing User ID')
const loginAlice = loginWithUserId('sec-alice-100') // case-insensitive login
assert.strictEqual(loginAlice.success, true, 'Alice logged in')
assert.strictEqual(getActiveProfile().id, 'SEC-ALICE-100', 'Active profile restored to Alice')

const invalidLogin = loginWithUserId('SEC-UNKNOWN-USER')
assert.strictEqual(invalidLogin.success, false, 'Non-existent user rejected')
console.log('✓ PASS: User ID login and active switching works with validation.')

// Import Google Auth sync functions
const {
  signInWithGoogleAccount,
  linkGoogleAccountToProfile,
  findProfileByGoogleAccount
} = await import('../src/services/userSyncManager.js')

// Test 9: Google Authentication Single User ID Bijective Sync
console.log('\n[TEST 9] Google Authentication Strict Single User ID Sync')
const googleUser1 = {
  sub: 'google-sub-99887766',
  email: 'carol.defender@gmail.com',
  name: 'Carol Defender'
}

// 1. Initial Google Sign In creates single deterministic ID
const gglSignIn1 = signInWithGoogleAccount(googleUser1)
assert.strictEqual(gglSignIn1.success, true, 'Google sign-in succeeded')
assert.strictEqual(gglSignIn1.isNew, true, 'First sign in registers user')
const assignedId = gglSignIn1.profile.id
assert.ok(assignedId.startsWith('SEC-'), 'Assigned valid single User ID')
assert.strictEqual(getActiveProfile().id, assignedId, 'Active profile is the assigned Google ID')

const profilesCountAfterGgl = getAllProfiles().length

// 2. Second sign in with same Google account MUST return the EXACT SAME single ID
const gglSignIn2 = signInWithGoogleAccount(googleUser1)
assert.strictEqual(gglSignIn2.success, true, 'Repeat Google sign-in succeeded')
assert.strictEqual(gglSignIn2.isNew, false, 'Repeat sign in detects existing account')
assert.strictEqual(gglSignIn2.profile.id, assignedId, 'Must resolve to the EXACT SAME single User ID')
assert.strictEqual(getAllProfiles().length, profilesCountAfterGgl, 'No duplicate profiles created')
console.log(`✓ PASS: Google account strictly maps to single User ID ("${assignedId}"). Repeat sign-in does not fragment or duplicate profiles.`)

// Test 10: Strict 1-to-1 Mapping Prevents Two Profiles Claiming the Same Google Account
console.log('\n[TEST 10] Strict 1-to-1 Mapping Prevents Profile Duplication Across Accounts')
const linkAttemptToOtherProfile = linkGoogleAccountToProfile('SEC-ALICE-100', googleUser1)
assert.strictEqual(linkAttemptToOtherProfile.success, false, 'Cannot bind already-claimed Google account to another User ID')
assert.ok(linkAttemptToOtherProfile.error.includes('ONLY ONE User ID'), 'Error states only one user ID can be synced')
console.log('✓ PASS: Cross-profile binding strictly blocked: One Google account cannot be attached to multiple User IDs.')

console.log('\n============================================================')
console.log('ALL UNIQUE USER ID, ISOLATION & GOOGLE SYNC TESTS PASSED (100% SUCCESS)')
console.log('============================================================')

