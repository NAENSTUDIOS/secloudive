import fs from 'fs';

const content = fs.readFileSync('./src/data/learning/foundationsPath.js', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.match(/^\s*id:\s*'[a-z0-9-]+',/)) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
