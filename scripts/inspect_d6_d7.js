const fs = require('fs');

function inspectTopic6_7(num, file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== TOPIC ${num} (${file}) ==================`);
  
  // Cards with case titles
  const cards = html.match(/<div class=["']card [^"']*["']>[\s\S]*?<\/div>\s*<\/div>/gi) || [];
  console.log('Cards found:', cards.length);
  cards.forEach((c, idx) => {
    const ct = c.match(/<div class=["']ct["']>([\s\S]*?)<\/div>/i);
    if (ct && (ct[1].includes('v.') || ct[1].includes('vs') || ct[1].includes('SCC') || ct[1].includes('AIR') || ct[1].includes('Q') || ct[1].includes('Model') || ct[1].includes('Question'))) {
      console.log(`  [Card ${idx + 1}]: ${ct[1].replace(/<[^>]+>/g, '').trim().slice(0, 80)}`);
    }
  });

  // Check section around PYQ Desk or Question Bank
  const qBankIdx = html.search(/(?:PYQ Desk|Question Bank|Model Answers)/i);
  if (qBankIdx !== -1) {
    console.log(`  Found QBank at ${qBankIdx}:`);
    console.log(html.slice(qBankIdx, qBankIdx + 1000).replace(/\n/g, ' '));
  }
}

inspectTopic6_7(6, 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html');
inspectTopic6_7(7, 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html');
