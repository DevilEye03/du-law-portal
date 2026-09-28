const fs = require('fs');
const path = require('path');

const dirs = ['SEM 5/DRAFTING', 'SEM 5/Industrial law'];

dirs.forEach(dir => {
  console.log(`\n========================================`);
  console.log(`AUDITING: ${dir}`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

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

    // Check rigid min-widths
    const minWidths = content.match(/min-width\s*:\s*(?:[4-9]\d{2}|\d{4,})px/gi);
    if (minWidths) {
      issues.push(`Rigid min-widths found: ${minWidths.join(', ')}`);
    }

    // Check rigid widths in px > 390px
    const wideWidths = content.match(/style="[^"]*?(?:\bwidth\s*:\s*(?:[4-9]\d{2}|\d{4,})px)[^"]*?"/gi);
    if (wideWidths) {
      issues.push(`Inline wide widths found: ${wideWidths.length} instances`);
    }

    // Check tables without wrap
    const tableCount = (content.match(/<table/gi) || []).length;

    // Check SVGs
    const svgsWithoutViewBox = content.match(/<svg\b(?!.*?viewBox).*?>/gi);
    if (svgsWithoutViewBox) {
      issues.push(`SVGs missing viewBox: ${svgsWithoutViewBox.length}`);
    }

    console.log(`${f} (Tables: ${tableCount}): ${issues.length === 0 ? '✅ CLEAN' : '⚠️ ' + issues.join(' | ')}`);
  });
});
