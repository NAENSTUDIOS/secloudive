import fs from 'fs'
import path from 'path'
import ts from 'typescript'

const srcDir = path.resolve('src')
let errorsFound = 0
let filesChecked = 0

function checkFile(filePath) {
  const ext = path.extname(filePath)
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) return

  const code = fs.readFileSync(filePath, 'utf8')
  filesChecked++
  
  const isJsx = ext.endsWith('x') || ext === '.js'
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    isJsx ? ts.ScriptKind.JSX : ts.ScriptKind.JS
  )

  const diagnostics = sourceFile.parseDiagnostics || []
  if (diagnostics.length > 0) {
    errorsFound++
    console.error(`\n❌ PARSE ERROR in ${filePath}:`)
    for (const diag of diagnostics) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start || 0)
      console.error(`   Line ${line + 1}:${character + 1} - ${diag.messageText}`)
    }
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        walk(fullPath)
      }
    } else {
      checkFile(fullPath)
    }
  }
}

console.log(`Starting TypeScript/JSX syntax verification of all files in ${srcDir}...`)
walk(srcDir)
console.log(`\n========================================`)
console.log(`Checked ${filesChecked} files in src/.`)
if (errorsFound === 0) {
  console.log(`✅ ZERO PARSE OR SYNTAX ERRORS FOUND ACROSS ALL SOURCE FILES!`)
} else {
  console.log(`❌ Found syntax errors in ${errorsFound} files!`)
  process.exit(1)
}
