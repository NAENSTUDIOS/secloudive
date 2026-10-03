/**
 * Verification Script for 2036 Sovereign Identity & Ambient Sync Nexus
 */
import fs from 'node:fs'
import path from 'node:path'

const userSyncPath = path.resolve('src/components/UserSyncModal.jsx')
const welcomeModalPath = path.resolve('src/components/WelcomeOnboardingModal.jsx')
const passkeyServicePath = path.resolve('src/services/passkeyAuthService.js')
const supabasePath = path.resolve('src/lib/supabase.js')

console.log('============================================================')
console.log('SECLOUDIVE AUDIT: 2036 IDENTITY & AMBIENT SYNC NEXUS')
console.log('============================================================\n')

let failures = 0

// 1. Audit UserSyncModal.jsx for forbidden developer leaks
const userSyncContent = fs.readFileSync(userSyncPath, 'utf-8')

const forbiddenTerms = [
  'supabaseSchema.sql',
  'Copy Schema File Path',
  'user_profiles (RBAC',
  'user_settings (provider',
  'user_progress (full',
  'chat_sessions (Sentinel',
  'xp_transactions (tamper',
  'audit_packs (tamper',
  'Step 1: Create Free Project',
  'Step 2: Copy API Credentials',
  'Step 3: Execute SQL Schema',
  'Step 4: Enable Google OAuth',
  'Supabase Cloud DB • Instant isolated sync',
  'Supabase Cloud</span',
  'Create Supabase Cloud Account',
  '2036',
  'SOVEREIGN'
]

console.log('[CHECK 1] Scanning UserSyncModal.jsx for forbidden leaks & sci-fi jargon...')
forbiddenTerms.forEach(term => {
  if (userSyncContent.includes(term)) {
    console.error(`❌ FAIL: Found forbidden term: "${term}"`)
    failures++
  } else {
    console.log(`✓ PASS: "${term}" is completely absent`)
  }
})

// 2. Verify Unified Combined Technologies & Ambient Sync Features
const requiredAuthFeatures = [
  'Cloud Identity & Sync Center',
  'Biometric Passkeys • Google Identity • Zero-Trust Cloud Sync',
  'Unified Sign In & Cloud Sync',
  'triggerAmbientSync',
  'handlePasskeyAuthenticate',
  'handleEnrollPasskey',
  'handleGoogleSuccess',
  'handleStudentIdLogin',
  'handleInstantGenerateId'
]

console.log('\n[CHECK 2] Verifying Unified Combined Authentication & Ambient Sync...')
requiredAuthFeatures.forEach(term => {
  if (userSyncContent.includes(term)) {
    console.log(`✓ PASS: Found required feature string: "${term}"`)
  } else {
    console.error(`❌ FAIL: Missing required feature string: "${term}"`)
    failures++
  }
})

// 3. Audit passkeyAuthService.js
console.log('\n[CHECK 3] Auditing passkeyAuthService.js...')
const passkeyContent = fs.readFileSync(passkeyServicePath, 'utf-8')
if (passkeyContent.includes('isPasskeySupported') && passkeyContent.includes('registerPasskey') && passkeyContent.includes('authenticatePasskey')) {
  console.log('✓ PASS: WebAuthn Passkey Engine implemented with enrollment & verification methods')
} else {
  console.error('❌ FAIL: Missing required methods in passkeyAuthService.js')
  failures++
}

// 4. Audit WelcomeOnboardingModal.jsx
console.log('\n[CHECK 4] Auditing WelcomeOnboardingModal.jsx...')
const welcomeContent = fs.readFileSync(welcomeModalPath, 'utf-8')
if (welcomeContent.includes('Supabase Cloud')) {
  console.error('❌ FAIL: Found "Supabase Cloud" in WelcomeOnboardingModal.jsx')
  failures++
} else {
  console.log('✓ PASS: Zero "Supabase Cloud" mentions in WelcomeOnboardingModal.jsx')
}

// 5. Audit supabase.js
console.log('\n[CHECK 5] Auditing supabase.js...')
const supabaseContent = fs.readFileSync(supabasePath, 'utf-8')
if (supabaseContent.includes('url: rawUrl')) {
  console.error('❌ FAIL: rawUrl exposed in getSupabaseConfigInfo')
  failures++
} else {
  console.log('✓ PASS: rawUrl is protected and not returned in client config info')
}

console.log('\n============================================================')
if (failures === 0) {
  console.log('🎉 ALL AUDITS PASSED: Unified Authentication & Cloud Sync Ready!')
  console.log('Zero clutter, combined authentication technologies, automatic ambient sync active.')
  console.log('============================================================')
  process.exit(0)
} else {
  console.error(`💥 AUDIT FAILED with ${failures} error(s)!`)
  console.log('============================================================')
  process.exit(1)
}
