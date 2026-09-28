const fs = require('fs');

function inspectFile(filePath) {
  console.log(`\n========================================`);
  console.log(`INSPECTING: ${filePath}`);
  console.log(`========================================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find case containers
  const caseMatches = content.match(/<div class=["']case["'][\s\S]*?(?=<div class=["']case["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Found ${caseMatches.length} case blocks via boundary split.`);
  if (caseMatches.length > 0) {
    console.log(`--- First Case Sample (first 800 chars) ---`);
    console.log(caseMatches[0].slice(0, 800));
  }

  // Find PYQ blocks
  const pyqMatches = content.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Found ${pyqMatches.length} pyq blocks via div.pyq`);
  if (pyqMatches.length > 0) {
    console.log(`--- First PYQ Sample (first 800 chars) ---`);
    console.log(pyqMatches[0].slice(0, 800));
  } else {
    // Check if there are other PYQ patterns (h3, h4, etc.)
    const hMatches = content.match(/<h[2-4][^>]*>[^<]*(?:PYQ|Question|Exam|Model Answer)[^<]*<\/h[2-4]>/gi) || [];
    console.log(`Found ${hMatches.length} PYQ-related headings:`, hMatches.slice(0, 5));
  }
}

inspectFile('SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html');
inspectFile('SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html');

const d1 = fs.readFileSync('SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html', 'utf8');
const pyq1Match = d1.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/i);
if (pyq1Match) {
  console.log('--- DRAFTING PYQ 1 FULL HTML ---');
  console.log(pyq1Match[0].slice(0, 2000));
}




