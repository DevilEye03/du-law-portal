const fs = require('fs');

const d5 = fs.readFileSync('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html', 'utf8');
const qSec = d5.indexOf('DU Semester Questions + Best Model Answers');
const qSecEnd = d5.indexOf('Where Criminal Pleadings Go Wrong');
const qHtml = d5.slice(qSec, qSecEnd !== -1 ? qSecEnd : qSec + 10000);

console.log('=== DRAFTING TOPIC 5 QUESTIONS SECTION ===');
const cards = qHtml.match(/<div class=["']card (?:blue|green|orange|violet|gold|red)["']>[\s\S]*?<\/div>\s*(?=<div class=["']card|<\/section>|$)/gi) || [];
console.log('Found question cards:', cards.length);
cards.forEach((c, idx) => {
  const ctMatch = c.match(/<div class=["']ct["']>([\s\S]*?)<\/div>/i);
  console.log(`[Q Card ${idx + 1}]: ${ctMatch ? ctMatch[1].replace(/<[^>]+>/g, '').trim() : ''}`);
});
