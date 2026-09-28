const fs = require('fs');

function inspectHeadings(file) {
  console.log(`\n========================================`);
  console.log(`FILE: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  
  // Find any headings or classes with 'pyq', 'question', 'exam', 'case'
  const hTags = content.match(/<(?:h[1-5]|div|section)[^>]*?(?:pyq|question|problem|exam|case)[^>]*>[\s\S]*?<\/(?:h[1-5]|div|section)>/gi) || [];
  console.log(`Matches with keywords in tag: ${hTags.length}`);
  hTags.slice(0, 5).forEach((h, i) => console.log(` [${i+1}] ${h.slice(0, 150).replace(/\n/g, ' ')}`));

  // Also search for "Question", "PYQ", "Model Answer" in headings
  const headings = content.match(/<h[2-4][^>]*>[^<]*(?:Question|PYQ|Past|Exam|Marks|Case|Brief)[^<]*<\/h[2-4]>/gi) || [];
  console.log(`Headings with text match: ${headings.length}`);
  headings.slice(0, 8).forEach((h, i) => console.log(` [H${i+1}] ${h}`));
}

inspectHeadings('SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html');
inspectHeadings('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html');
inspectHeadings('SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html');
inspectHeadings('SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html');
inspectHeadings('SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html');
inspectHeadings('SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html');
inspectHeadings('SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html');
