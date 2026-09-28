const fs = require('fs');

function verifyUnits3_5_6_7(uNum, file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== UNIT ${uNum} (${file}) ==================`);
  
  // Section cases
  const casesSecIdx = html.indexOf('id="cases"');
  if (casesSecIdx !== -1) {
    const afterCases = html.slice(casesSecIdx, html.indexOf('</section>', casesSecIdx));
    const caseCards = afterCases.match(/<div class=["']casecard["']/gi) || [];
    console.log(`Cases section has ${caseCards.length} casecards.`);
  }

  // Section pyq
  const pyqSecIdx = html.indexOf('id="pyq"');
  if (pyqSecIdx !== -1) {
    const afterPyq = html.slice(pyqSecIdx, html.indexOf('</section>', pyqSecIdx));
    const pyqCards = afterPyq.match(/<div class=["']casecard["']/gi) || [];
    console.log(`PYQ section has ${pyqCards.length} casecards.`);
    const headings = afterPyq.match(/<h[2-4][^>]*>[\s\S]*?<\/h[2-4]>/gi) || [];
    console.log(`PYQ section headings:`, headings.map(h => h.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')));
  }
}

verifyUnits3_5_6_7(3, 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html');
verifyUnits3_5_6_7(5, 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html');
verifyUnits3_5_6_7(6, 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html');
verifyUnits3_5_6_7(7, 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html');
