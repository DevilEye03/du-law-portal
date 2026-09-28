const fs = require('fs');

function inspectQuestionsInFile(uNum, file, secId) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== INDUSTRIAL UNIT ${uNum} (${file}) ==================`);
  const secIdx = html.indexOf(`id=\"${secId}\"`);
  if (secIdx !== -1) {
    const secHtml = html.slice(secIdx, secIdx + 15000);
    // Find all question/model answer headings
    const matches = secHtml.match(/<h[2-4][^>]*>[\s\S]*?<\/h[2-4]>/gi) || [];
    console.log(`Headings in #${secId}:`);
    matches.forEach(m => console.log('  ' + m.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')));
  }
}

inspectQuestionsInFile(3, 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html', 'questions');
inspectQuestionsInFile(4, 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html', 'pyq');
inspectQuestionsInFile(5, 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html', 'pyq');
inspectQuestionsInFile(6, 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html', 'pyq');
inspectQuestionsInFile(7, 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html', 'questions');
