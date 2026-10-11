import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const targetDir = path.join(process.env.LOCALAPPDATA, 'ms-playwright-go', '1.57.0')
console.log('Target driver directory:', targetDir)

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

// 1. Extract tarball using tar.exe (available on Windows)
const tarball = path.resolve('playwright-core-1.57.0.tgz')
console.log('Extracting tarball:', tarball)
execSync(`tar -xzf "${tarball}" -C "${targetDir}"`, { stdio: 'inherit' })

// Verify targetDir/package/cli.js exists
const cliJsPath = path.join(targetDir, 'package', 'cli.js')
if (!fs.existsSync(cliJsPath)) {
  throw new Error(`cli.js not found at ${cliJsPath}`)
}
console.log('✓ Found cli.js at:', cliJsPath)

// 2. Copy node.exe into targetDir and targetDir/node
const nodeExeSource = process.execPath
console.log('Node.js executable source:', nodeExeSource)

const nodeExeDest = path.join(targetDir, 'node.exe')
fs.copyFileSync(nodeExeSource, nodeExeDest)
console.log('✓ Copied node.exe to:', nodeExeDest)

const nodeSubdir = path.join(targetDir, 'node')
if (!fs.existsSync(nodeSubdir)) {
  fs.mkdirSync(nodeSubdir, { recursive: true })
}
const nodeSubdirDest = path.join(nodeSubdir, 'node.exe')
fs.copyFileSync(nodeExeSource, nodeSubdirDest)
console.log('✓ Copied node.exe to:', nodeSubdirDest)

// 3. Test running the driver CLI
console.log('\nTesting driver version...')
const verOutput = execSync(`"${nodeExeDest}" "${cliJsPath}" --version`, { encoding: 'utf8' }).trim()
console.log('Driver output version:', verOutput)

// 4. Install Chromium browser through playwright-core cli.js
console.log('\nInstalling Chromium browser for Playwright...')
execSync(`"${nodeExeDest}" "${cliJsPath}" install chromium`, { stdio: 'inherit' })
console.log('\n✓ Chromium installation complete!')
