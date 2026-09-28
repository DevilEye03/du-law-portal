const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

const regex = /"file":\s*"([^"]+)"/g;
const uniqueFiles = new Set();
let m;
while ((m = regex.exec(content)) !== null) {
  uniqueFiles.add(m[1]);
}

console.log('Total unique files in data.js:', uniqueFiles.size);

const missing = [];
for (const f of uniqueFiles) {
  // strip hash if any
  const cleanPath = f.split('#')[0];
  if (!fs.existsSync(cleanPath)) {
    missing.push(f);
  }
}

console.log('Missing files on disk:', missing.length);
if (missing.length > 0) {
  console.log(missing);
}

// Group existing by directory
const byDir = {};
for (const f of uniqueFiles) {
  const dir = f.includes('/') ? f.substring(0, f.lastIndexOf('/')) : '.';
  byDir[dir] = (byDir[dir] || 0) + 1;
}
console.log('Files by directory in data.js:');
console.table(byDir);
