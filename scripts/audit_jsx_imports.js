import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAllFiles(dir, exts = ['.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

function stripStringLiterals(code) {
  // Replace template strings, double quotes, and single quotes with placeholders
  return code
    .replace(/`(?:\\[\s\S]|[^\\`])*`/g, '""')
    .replace(/"(?:\\[\s\S]|[^\\"])*"/g, '""')
    .replace(/'(?:\\[\s\S]|[^\\'])*'/g, "''")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

const srcDir = path.join(__dirname, '..', 'src');
const files = getAllFiles(srcDir);
console.log(`Auditing ${files.length} JSX component files in ${srcDir}...`);

let totalErrors = 0;

files.forEach(file => {
  const rawContent = fs.readFileSync(file, 'utf8');
  
  // Find all imports (default, named, and namespace)
  const importedIdentifiers = new Set();
  const importRegex = /import\s+(?:([A-Za-z0-9_$]+)\s*,?\s*)?(?:\{([^}]+)\})?(?:\*\s+as\s+([A-Za-z0-9_$]+))?\s+from/g;
  let match;
  while ((match = importRegex.exec(rawContent)) !== null) {
    if (match[1]) importedIdentifiers.add(match[1].trim());
    if (match[2]) {
      match[2].split(',').forEach(item => {
        const parts = item.trim().split(/\s+as\s+/);
        const name = parts[parts.length - 1].trim();
        if (name) importedIdentifiers.add(name);
      });
    }
    if (match[3]) {
      importedIdentifiers.add(match[3].trim());
    }
  }

  // Find all locally declared functions / consts / components
  const localDeclarations = new Set();
  const declRegex = /(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)/g;
  while ((match = declRegex.exec(rawContent)) !== null) {
    localDeclarations.add(match[1]);
  }

  // Standard React builtins
  const reactGlobals = new Set(['React', 'Fragment']);

  // Strip string literals and comments so XML strings don't trigger false positives
  const strippedCode = stripStringLiterals(rawContent);

  // Find all JSX tags: <Tag ... or <Tag>
  const jsxTagRegex = /<([A-Z][a-zA-Z0-9_]*)/g;
  const missingInFile = new Set();

  while ((match = jsxTagRegex.exec(strippedCode)) !== null) {
    const tag = match[1];
    if (!importedIdentifiers.has(tag) && !localDeclarations.has(tag) && !reactGlobals.has(tag)) {
      missingInFile.add(tag);
    }
  }

  if (missingInFile.size > 0) {
    console.error(`\n[ERROR] Missing JSX definitions in ${path.relative(srcDir, file)}:`);
    missingInFile.forEach(tag => console.error(`  - <${tag} /> is not imported or declared!`));
    totalErrors += missingInFile.size;
  }
});

if (totalErrors === 0) {
  console.log('\n[PASS] ALL JSX FILES AUDITED CLEANLY: 0 missing JSX components or icons across the entire project!');
} else {
  console.error(`\n[FAIL] Found ${totalErrors} missing JSX imports in component files.`);
  process.exit(1);
}
