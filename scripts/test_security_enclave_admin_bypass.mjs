// Verification test for admin exemption and clean user modal in GlobalSecurityEnclave
import fs from 'fs'
import path from 'path'

console.log('--- TESTING GLOBAL SECURITY ENCLAVE ADMIN EXEMPTION & CLEAN UI ---')

const enclaveFilePath = path.resolve('src/components/GlobalSecurityEnclave.jsx')
const enclaveCode = fs.readFileSync(enclaveFilePath, 'utf-8')

// 1. Verify admin email exemption logic exists
if (!enclaveCode.includes('naenstudios@gmail.com')) {
  throw new Error('Admin email naenstudios@gmail.com must be explicitly checked in GlobalSecurityEnclave')
}

if (!enclaveCode.includes('isAdminUser')) {
  throw new Error('isAdminUser variable must be defined in GlobalSecurityEnclave')
}

// 2. Verify admin returns null (fully disables enclave for admin)
if (!enclaveCode.includes('if (isAdminUser) {\n    return null\n  }') && !enclaveCode.includes('if (isAdminUser) return null')) {
  throw new Error('GlobalSecurityEnclave must return null when user is admin')
}

// 3. Verify event listeners are skipped for admin
if (!enclaveCode.includes('if (isAdminUser) return') && !enclaveCode.includes('if (!isAdminUser)')) {
  throw new Error('GlobalSecurityEnclave must skip registering or executing event listeners for admin')
}

// 4. Verify raw incident telemetry box is removed from learner UI
if (enclaveCode.includes('INCIDENT BYPASS DISPATCHED TO ADMINISTRATOR')) {
  throw new Error('Learner modal should NOT contain raw "INCIDENT BYPASS DISPATCHED TO ADMINISTRATOR" text box')
}

if (enclaveCode.includes('<div><strong>Incident ID:</strong>')) {
  throw new Error('Learner modal should NOT display raw "Incident ID:" to regular users')
}

if (enclaveCode.includes('<div><strong>Learner:</strong>')) {
  throw new Error('Learner modal should NOT display raw "Learner:" to regular users')
}

// 5. Verify telemetry is still dispatched to admin in background
if (!enclaveCode.includes("forwardedTo: 'naenstudios@gmail.com'")) {
  throw new Error('Telemetry incident payload must still designate forwardedTo: naenstudios@gmail.com')
}

if (!enclaveCode.includes('secloudive_admin_screenshot_incidents')) {
  throw new Error('Telemetry incidents must be stored in localStorage for Admin Dashboard')
}

console.log('✓ All 5 Security Enclave Admin Exemption & Clean User UI tests PASSED!')
