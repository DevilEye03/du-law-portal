const fs = require('fs');

const u8 = fs.readFileSync('SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html', 'utf8');
const caseHeadings = u8.match(/<h[2-4][^>]*>[\s\S]*?<\/h[2-4]>/gi) || [];
console.log('Unit 8 Headings count:', caseHeadings.length);
caseHeadings.filter(h => /case|v\.|vs|judg/i.test(h)).forEach((h, idx) => {
  console.log(`  [${idx+1}]: ${h.replace(/<[^>]+>/g, '').trim()}`);
});

// Search for B.E.S.T. Undertaking
const bestIdx = u8.indexOf('B.E.S.T.');
console.log('B.E.S.T. index:', bestIdx);
if (bestIdx !== -1) {
  console.log('Surrounding HTML (800 chars):');
  console.log(u8.slice(Math.max(0, bestIdx - 200), bestIdx + 800));
}
