const fs = require('fs');

function inspectIndUnit(unitNum, file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== INDUSTRIAL UNIT ${unitNum} (${file}) ==================`);
  
  // Find cases: look for box case, casecard, or section with cases
  const caseCards = html.match(/<(?:div|article|section)[^>]*class=["'][^"']*(?:casecard|case-card|box\s+case|case)[^"']*["'][\s\S]*?(?=<(?:div|article|section)[^>]*class=["'][^"']*(?:casecard|case-card|box\s+case|case)[^"']*["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Cases matched: ${caseCards.length}`);
  caseCards.slice(0, 5).forEach((c, idx) => {
    const titleMatch = c.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i) ||
                       c.match(/class=["'](?:tag|ct|cname|ch)["'][^>]*>([\s\S]*?)<\/(?:span|div|h3)>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';
    console.log(`  [Case ${idx + 1}]: ${title.slice(0, 80)}`);
  });

  // Find PYQ / Model Answers section
  const pyqSecIdx = html.search(/(?:Previous[- ]Year Questions|University of Delhi semester questions|Model [Aa]nswer|PYQ Desk|DU Semester Questions)/i);
  if (pyqSecIdx !== -1) {
    console.log(`Found PYQ section at index ${pyqSecIdx}:`);
    console.log(html.slice(pyqSecIdx, pyqSecIdx + 500).replace(/\n/g, ' '));
  }
}

for (let u = 3; u <= 8; u++) {
  const files = {
    3: 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html',
    4: 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html',
    5: 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html',
    6: 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html',
    7: 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html',
    8: 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html'
  };
  inspectIndUnit(u, files[u]);
}
