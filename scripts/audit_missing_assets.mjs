import fs from 'fs';
import path from 'path';

function getAllFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        getAllFiles(filePath, exts, fileList);
      }
    } else if (exts.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles('./src', ['.jsx', '.js', '.css']);
const missingAssets = [];

// Look for import ... from '...' or require('...') or url('...') or src="..."
const assetRegex = /(?:src|href|url)\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
const importRegex = /(?:import\s+(?:[\w*\s{},]+from\s+)?|export\s+(?:[\w*\s{},]+from\s+)?|import\()\s*["'`]([^"'`]+)["'`]/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  
  // check imports
  while ((match = importRegex.exec(content)) !== null) {
    const impPath = match[1];
    if (impPath.startsWith('.')) {
      // relative import
      const dir = path.dirname(f);
      const resolvedBase = path.resolve(dir, impPath);
      const candidates = [
        resolvedBase,
        resolvedBase + '.js',
        resolvedBase + '.jsx',
        resolvedBase + '.json',
        resolvedBase + '.css',
        resolvedBase + '.svg',
        path.join(resolvedBase, 'index.js'),
        path.join(resolvedBase, 'index.jsx')
      ];
      const exists = candidates.some(c => fs.existsSync(c));
      if (!exists) {
        missingAssets.push({ file: f, type: 'import', target: impPath });
      }
    }
  }

  // check asset paths (e.g. /assets/..., ./assets/..., public assets)
  while ((match = assetRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('#') || src.startsWith('mailto:') || src.startsWith('javascript:')) {
      continue;
    }
    // check if it's a file in public or src
    if (src.startsWith('/')) {
      // in public folder
      const publicPath = path.resolve('./public', src.slice(1));
      const distPath = path.resolve('./', src.slice(1));
      if (!fs.existsSync(publicPath) && !fs.existsSync(distPath)) {
        // Only flag if it looks like an image or file asset (.png, .jpg, .svg, .json, .pdf)
        if (/\.(png|jpe?g|svg|webp|ico|gif|pdf|json|wasm)$/i.test(src)) {
          missingAssets.push({ file: f, type: 'public_asset', target: src });
        }
      }
    }
  }
});

console.log('Total asset/import checks completed.');
console.log('Missing assets/imports count:', missingAssets.length);
console.log(JSON.stringify(missingAssets, null, 2));
