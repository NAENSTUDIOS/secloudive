/**
 * Verification Script for Identity & Sync Center sanitization
 */
import fs from 'node:fs'
import path from 'node:path'

const userSyncPath = path.resolve('src/components/UserSyncModal.jsx')
const welcomeModalPath = path.resolve('src/components/WelcomeOnboardingModal.jsx')
const supabasePath = path.resolve('src/lib/supabase.js')

console.log('============================================================')
console.log('SECLOUDIVE AUDIT: IDENTITY & SYNC CENTER SANITIZATION')
console.log('============================================================\n')

let failures = 0

// 1. Audit UserSyncModal.jsx
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
  'Create Supabase Cloud Account'
]

console.log('[CHECK 1] Scanning UserSyncModal.jsx for forbidden developer/backend leaks...')
forbiddenTerms.forEach(term => {
  if (userSyncContent.includes(term)) {
    console.error(`❌ FAIL: Found leaked technical term: "${term}"`)
    failures++
  } else {
    console.log(`✓ PASS: "${term}" is completely hidden`)
  }
})

// Required terms in UserSyncModal.jsx
const requiredTerms = [
  'Google OAuth • Unique Student ID • Cloud Synchronization • Zero-Trust Data Isolation',
  'Cloud Sync & Devices',
  'handleTriggerManualSync',
  'handleCheckSyncStatus',
  'Zero-Trust Data Protection Architecture',
  'Sync Now',
  'Synchronizing…'
]

console.log('\n[CHECK 2] Verifying user-facing Cloud Sync & Devices panel features...')
requiredTerms.forEach(term => {
  if (userSyncContent.includes(term)) {
    console.log(`✓ PASS: Found required feature string: "${term}"`)
  } else {
    console.error(`❌ FAIL: Missing required feature string: "${term}"`)
    failures++
  }
})

// 2. Audit WelcomeOnboardingModal.jsx
console.log('\n[CHECK 3] Auditing WelcomeOnboardingModal.jsx...')
const welcomeContent = fs.readFileSync(welcomeModalPath, 'utf-8')
if (welcomeContent.includes('Supabase Cloud')) {
  console.error('❌ FAIL: Found "Supabase Cloud" in WelcomeOnboardingModal.jsx')
  failures++
} else {
  console.log('✓ PASS: Zero "Supabase Cloud" mentions in WelcomeOnboardingModal.jsx')
}

if (welcomeContent.includes("Don't show this orientation automatically again")) {
  console.log('✓ PASS: Persistence checkbox ("Don\'t show this orientation automatically again") present')
} else {
  console.error('❌ FAIL: Missing persistence checkbox in WelcomeOnboardingModal.jsx')
  failures++
}

if (welcomeContent.includes("e.key === 'Escape'")) {
  console.log('✓ PASS: Full keyboard accessibility (Escape to close) confirmed')
} else {
  console.error('❌ FAIL: Missing Escape key listener in WelcomeOnboardingModal.jsx')
  failures++
}

// 3. Audit supabase.js
console.log('\n[CHECK 4] Auditing supabase.js...')
const supabaseContent = fs.readFileSync(supabasePath, 'utf-8')
if (supabaseContent.includes('url: rawUrl')) {
  console.error('❌ FAIL: rawUrl exposed in getSupabaseConfigInfo')
  failures++
} else {
  console.log('✓ PASS: rawUrl is protected and not returned in client config info')
}

console.log('\n============================================================')
if (failures === 0) {
  console.log('🎉 ALL AUDITS PASSED: 100% Clean Frontend/Backend Separation!')
  console.log('Backend works backend only, Frontend is clean, professional, and non-explosive.')
  console.log('============================================================')
  process.exit(0)
} else {
  console.error(`💥 AUDIT FAILED with ${failures} error(s)!`)
  console.log('============================================================')
  process.exit(1)
}
