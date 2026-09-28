const fs = require('fs');

const d5 = fs.readFileSync('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html', 'utf8');
const caseCards = d5.match(/<div class=["']card (?:red|orange|violet|green|blue|gold)["']>[\s\S]*?<\/div>\s*<\/div>/gi) || [];
console.log('Topic 5 Card blocks:', caseCards.length);
caseCards.forEach((c, idx) => {
  const ct = c.match(/<div class=["']ct["']>([\s\S]*?)<\/div>/i);
  if (ct && (ct[1].includes('v.') || ct[1].includes('vs') || ct[1].includes('SCC') || ct[1].includes('AIR'))) {
    console.log(`[Case ${idx + 1}]: ${ct[1].replace(/<[^>]+>/g, '').trim()}`);
  }
});
