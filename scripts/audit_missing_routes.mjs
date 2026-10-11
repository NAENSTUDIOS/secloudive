import fs from 'fs';
import path from 'path';

const registeredRoutes = [
  '/', '/learning', '/learning/:pathId', '/learning/:pathId/:topicId',
  '/ramp-up', '/rampup', '/career-rampup', '/career-ramp-up', '/career', '/careers', '/aws-career',
  '/categories', '/roadmap', '/exploration-roadmap', '/dashboard',
  '/profile', '/user-profile', '/student-profile', '/admin',
  '/live-internships', '/internships', '/jobs', '/aws-jobs', '/cloud-jobs',
  '/threat-intel', '/threats', '/cves', '/cve-radar',
  '/about', '/legal', '/downloads', '/cost-calculator', '/zero-cost-labs',
  '/labs', '/labs/:id', '/playbooks', '/playbooks/:id',
  '/projects', '/projects/:id', '/battle-rooms', '/battle-rooms/:id',
  '/investigations', '/investigations/:id', '/challenge/:id',
  '/architecture-reviews', '/live-portal',
  '/internship-simulator', '/interview-simulator', '/interview', '/hiring-simulator',
  '/cloudive-studio', '/builder-studio', '/report', '/verify-pack', '/verify-audit-pack', '/verify'
];

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

const files = getAllFiles('./src', ['.jsx', '.js']);
const foundPaths = new Map();

const linkRegex = /(?:to=[\"'\`]|navigate\(\s*[\"'\`]|href=[\"'\`])(\/[^\"\'\`\s\?\#]*)/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    let p = match[1];
    if (p.startsWith('//') || p.startsWith('/assets') || p.startsWith('/favicon') || p.startsWith('/vite.svg') || p.startsWith('/api') || p.startsWith('/data')) continue;
    if (!foundPaths.has(p)) foundPaths.set(p, []);
    foundPaths.get(p).push(f);
  }
});

console.log('Total internal root-relative links found:', foundPaths.size);

const missing = [];
for (const [p, sources] of foundPaths.entries()) {
  const matched = registeredRoutes.some(r => {
    if (r === p) return true;
    if (r.includes(':')) {
      const rRegex = new RegExp('^' + r.replace(/:[^\/]+/g, '[^\\/]+') + '$');
      return rRegex.test(p);
    }
    return false;
  });
  if (!matched) {
    missing.push({ path: p, sources: sources.map(s => path.basename(s)) });
  }
}

console.log('Missing or unrouted paths count:', missing.length);
console.log(JSON.stringify(missing, null, 2));
