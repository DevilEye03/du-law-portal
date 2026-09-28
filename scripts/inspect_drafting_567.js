const fs = require('fs');

function inspectSection5(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== ${file} ==================`);
  
  // Find sections or blocks around questions
  const qSec = html.indexOf('DU Semester Questions');
  if (qSec !== -1) {
    console.log('--- FOUND DU Semester Questions Section ---');
    console.log(html.slice(qSec, qSec + 2500));
  }

  // Find cases in Topic 5: search for "Case law for item", "vs", "v."
  const caseMatches = html.match(/<div[^>]*class=["'][^"']*(?:case|box|card)[^"']*["'][\s\S]*?<\/div>/gi) || [];
  console.log('Class box/case/card matches:', caseMatches.length);
  caseMatches.slice(0, 5).forEach((c, idx) => console.log(`  [${idx+1}]: ${c.slice(0, 200).replace(/\n/g, ' ')}`));
}

inspectSection5('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html');
inspectSection5('SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html');
inspectSection5('SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html');
