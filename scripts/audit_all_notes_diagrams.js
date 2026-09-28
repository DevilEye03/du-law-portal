const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING'
];

let totalFiles = 0;
let filesWithSvg = 0;
let filesWithTables = 0;
let filesWithFlow = 0;

allDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    totalFiles++;
    const content = fs.readFileSync(path.join(dirPath, f), 'utf8');
    if (content.includes('<svg')) filesWithSvg++;
    if (content.includes('<table')) filesWithTables++;
    if (/class=["'][^"']*\bflow\b[^"']*["']/i.test(content)) filesWithFlow++;
  });
});

console.log(`Total HTML notes files across workspace: ${totalFiles}`);
console.log(`Files with SVGs: ${filesWithSvg}`);
console.log(`Files with Tables: ${filesWithTables}`);
console.log(`Files with Flowcharts: ${filesWithFlow}`);
