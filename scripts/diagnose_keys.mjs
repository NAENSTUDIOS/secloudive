// scripts/diagnose_keys.mjs
// Step 1 Diagnostic: calls each key individually with a minimal real request
// and reports per-key: valid, invalid, or quota-exceeded, with exact error text.

import fs from 'node:fs'
import path from 'node:path'

const envPath = path.resolve('.env')
let envContent = ''
try {
  envContent = fs.readFileSync(envPath, 'utf-8')
} catch (e) {
  console.error('Could not read .env:', e.message)
}

// Extract all keys from .env
const keysToTest = []
const lines = envContent.split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (trimmed.startsWith('#') || !trimmed.includes('=')) continue
  const [k, ...v] = trimmed.split('=')
  const val = v.join('=').trim()
  if (k.includes('GEMINI') && val) {
    if (k.endsWith('_KEYS') && val.includes(',')) {
      val.split(',').forEach((subKey, idx) => {
        if (subKey.trim()) {
          keysToTest.push({ name: `${k}[${idx}]`, key: subKey.trim() })
        }
      })
    } else {
      keysToTest.push({ name: k, key: val })
    }
  }
}

console.log('------------------------------------------------------------')
console.log('SeCloudive Gemini Keys Diagnostic (Step 1)')
console.log(`Discovered ${keysToTest.length} key entries from .env`)
console.log('------------------------------------------------------------')

const testModels = ['gemini-3.8-flash', 'gemini-3-flash', 'gemini-2.5-flash']

async function listAvailableModels(key) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      console.log('Available models from API:')
      data.models?.slice(0, 10).forEach(m => console.log('  -', m.name))
    } else {
      const err = await res.json().catch(() => ({}))
      console.log('ListModels failed:', res.status, err.error?.message || err)
    }
  } catch (e) {
    console.log('ListModels error:', e.message)
  }
}

async function testKey(name, key) {
  console.log(`\nTesting [${name}] (preview: ${key.slice(0, 8)}...${key.slice(-4)}):`)
  
  for (const model of testModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Respond with the word OK.' }]
        }
      ]
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const status = res.status
      const body = await res.json().catch(() => ({}))

      if (res.ok) {
        const text = body.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        console.log(`  ✓ VALID on model '${model}' (HTTP ${status})`)
        console.log(`    Response: "${text}"`)
        return { name, key, status: 'VALID', model, response: text }
      } else {
        const errMessage = body.error?.message || JSON.stringify(body)
        const errStatus = body.error?.status || `HTTP_${status}`
        if (status === 429) {
          console.log(`  ⚠️ QUOTA_EXCEEDED on '${model}' (HTTP 429): ${errMessage}`)
          return { name, key, status: 'QUOTA_EXCEEDED', error: errMessage }
        } else {
          console.log(`  ✗ FAILED on '${model}' (HTTP ${status} - ${errStatus}): ${errMessage}`)
        }
      }
    } catch (err) {
      console.log(`  ✗ NETWORK_ERROR on '${model}': ${err.message}`)
    }
  }

  return { name, key, status: 'INVALID', error: 'Failed on all tested models' }
}

async function run() {
  if (keysToTest.length > 0) {
    await listAvailableModels(keysToTest[keysToTest.length - 1].key)
  }
  const results = []
  for (const item of keysToTest) {
    const res = await testKey(item.name, item.key)
    results.push(res)
  }

  console.log('\n============================================================')
  console.log('DIAGNOSTIC SUMMARY:')
  console.log('============================================================')
  results.forEach(r => {
    console.log(`${r.name.padEnd(25)} -> ${r.status}`)
    if (r.error) console.log(`   Detail: ${r.error}`)
    if (r.response) console.log(`   Sample: ${r.response}`)
  })
  console.log('============================================================')
}

run()
