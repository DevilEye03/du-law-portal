const fs = require('fs');
const path = require('path');

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n========================================`);
  console.log(`File: ${path.basename(filePath)}`);
  
  // Headings
  const h2s = [...content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H2s (first 6):', h2s.slice(0, 6));

  // Cases
  const casesMatch = content.match(/class="(?:case|box case)"/gi);
  const caseH3 = content.match(/<h[23][^>]*>[^<]*case\b/gi);
  console.log('Case markers:', { divCases: casesMatch ? casesMatch.length : 0, caseHeadings: caseH3 ? caseH3.length : 0 });

  // PYQs
  const pyqMatch = content.match(/pyq|past year|previous year|exam question|problem/gi);
  console.log('PYQ keyword mentions:', pyqMatch ? pyqMatch.length : 0);

  // Tables
  const tables = content.match(/<table/gi);
  console.log('Tables count:', tables ? tables.length : 0);

  // SVGs
  const svgs = content.match(/<svg/gi);
  console.log('SVGs count:', svgs ? svgs.length : 0);
}

analyzeFile('SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html');
analyzeFile('SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html');
analyzeFile('SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes (1).html');
analyzeFile('SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html');
analyzeFile('SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html');
