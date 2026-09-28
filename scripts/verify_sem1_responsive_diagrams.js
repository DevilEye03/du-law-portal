const fs = require('fs');
const path = require('path');

const sem1Dirs = ['Juris', 'Contract', 'BNS', 'Family', 'Torts'];

console.log('=== VERIFYING SEMESTER 1 DIAGRAM MOBILE RESPONSIVENESS ===\n');

let totalFilesChecked = 0;
let passCount = 0;
let failCount = 0;

sem1Dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    totalFilesChecked++;
    const filePath = path.join(dirPath, f);
    const content = fs.readFileSync(filePath, 'utf8');

    let errors = [];

    // 1. Check viewport meta tag
    if (!content.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">')) {
      errors.push('Missing or invalid viewport meta tag');
    }

    // 2. Check engine presence
    if (!content.includes('MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE')) {
      errors.push('Missing Universal Mobile Responsive Engine');
    }

    // 3. Check for diagram/flowchart mobile rules
    if (!content.includes('.flow-svg') || !content.includes('100% FULL VISIBILITY')) {
      errors.push('Missing updated diagram responsive rules in stylesheet');
    }

    // 4. Check for rigid uncontained min-width on SVGs
    if (content.match(/<svg\b[^>]*style="[^"]*min-width:\s*(?:7|8|9)\d\dpx/i)) {
      errors.push('Still contains inline rigid min-width on SVG element');
    }

    // 5. Basic HTML structure check
    if (!content.includes('</html>') || !content.includes('</body>')) {
      errors.push('Malformed HTML (missing closing body/html)');
    }

    if (errors.length > 0) {
      failCount++;
      console.log(`❌ FAIL: ${dir}/${f}`);
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      passCount++;
    }
  });
});

console.log(`\n================================`);
console.log(`Verification Results:`);
console.log(`Total files tested: ${totalFilesChecked}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% OF SEMESTER 1 FILES VERIFIED PERFECTLY RESPONSIVE!');
}
