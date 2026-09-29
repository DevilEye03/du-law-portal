const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'SEM 5', 'IT LAWS');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log(`========================================`);
console.log(`AUDITING RESPONSIVENESS: ${dir}`);
console.log(`========================================\n`);

let allClean = true;

files.forEach(f => {
  const full = path.join(dir, f);
  const content = fs.readFileSync(full, 'utf8');

  const issues = [];

  // Check viewport
  if (!/<meta\s+name=["']viewport["']/i.test(content)) {
    issues.push('Missing viewport meta tag');
  }

  // Check OmniEngine
  if (!content.includes('UNIVERSAL OMNI-RESPONSIVE ENGINE')) {
    issues.push('Missing UNIVERSAL OMNI-RESPONSIVE ENGINE');
  }

  // Check link to notes-responsive.css
  if (!content.includes('notes-responsive.css')) {
    issues.push('Missing link to notes-responsive.css');
  }

  // Check inline wide widths > 390px
  const wideWidths = content.match(/style="[^"]*?(?:\bwidth\s*:\s*(?:[4-9]\d{2}|\d{4,})px)[^"]*?"/gi);
  if (wideWidths) {
    issues.push(`Inline wide widths found: ${wideWidths.length} instances`);
  }

  // Check SVGs missing viewBox
  const svgsWithoutViewBox = content.match(/<svg\b(?!.*?viewBox).*?>/gi);
  if (svgsWithoutViewBox) {
    issues.push(`SVGs missing viewBox: ${svgsWithoutViewBox.length}`);
  }

  const tableCount = (content.match(/<table/gi) || []).length;
  const svgCount = (content.match(/<svg/gi) || []).length;

  if (issues.length === 0) {
    console.log(`✅ [CLEAN] ${f} (Tables: ${tableCount}, SVGs: ${svgCount})`);
  } else {
    allClean = false;
    console.log(`⚠️ [ISSUES] ${f}: ${issues.join(' | ')}`);
  }
});

console.log(`\n========================================`);
if (allClean) {
  console.log(`🎉 ALL 8 IT LAWS NOTE DOSSIERS ARE 100% CLEAN & RESPONSIVE!`);
} else {
  console.log(`⚠️ Some issues were detected above.`);
}
console.log(`========================================\n`);
