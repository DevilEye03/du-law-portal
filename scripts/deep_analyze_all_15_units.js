const fs = require('fs');

const draftingFiles = [
  { num: 1, title: 'Drafting Rules & Skills', file: 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html' },
  { num: 2, title: 'Forms of Civil Pleadings', file: 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html' },
  { num: 3, title: 'Matrimonial Pleadings', file: 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html' },
  { num: 4, title: 'Succession Act Pleadings', file: 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html' },
  { num: 5, title: 'Criminal Law Pleadings', file: 'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html' },
  { num: 6, title: 'Other Misc Pleadings', file: 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html' },
  { num: 7, title: 'Conveyancing', file: 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html' }
];

const industrialFiles = [
  { num: 1, title: 'Dispute Settlement', file: 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html' },
  { num: 2, title: 'Reference of Disputes', file: 'SEM 5/Industrial law/IR_Code_Unit2_Reference_Notes.html' },
  { num: 3, title: 'Awards and Settlements', file: 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html' },
  { num: 4, title: 'Managerial Prerogative', file: 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html' },
  { num: 5, title: 'Adjudicatory Powers & Proportionality', file: 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html' },
  { num: 6, title: 'Restraints on Managerial Prerogatives', file: 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html' },
  { num: 7, title: 'Wages & Code on Wages', file: 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html' },
  { num: 8, title: 'Code on Social Security', file: 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html' }
];

function analyzeFile(item) {
  const content = fs.readFileSync(item.file, 'utf8');
  console.log(`\n================================================================`);
  console.log(`[Unit ${item.num}] ${item.title} (${item.file}) - Size: ${content.length} bytes`);
  console.log(`================================================================`);

  // Look for sections / headers
  const secHeadings = content.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/gi) || [];
  console.log(`Headings total: ${secHeadings.length}`);
  const interestingH = secHeadings.filter(h => /case|precedent|pyq|question|model answer|problem|past year|exam/i.test(h));
  console.log(`Case/PYQ headings:`, interestingH.map(h => h.replace(/<[^>]+>/g, '').trim()));

  // Look for case containers: div.case, div.box.case, div.casecard, section#cases
  const caseCards = content.match(/<div[^>]+class=["'][^"']*(?:casecard|case-card|box\s+case|case)[^"']*["'][\s\S]*?(?=<div[^>]+class=["'][^"']*(?:casecard|case-card|box\s+case|case)[^"']*["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Case card elements matched: ${caseCards.length}`);

  // Look for pyq containers: div.pyq, div.pyq-card, div.model-ans, div.qa
  const pyqCards = content.match(/<div[^>]+class=["'][^"']*(?:pyq|pyq-card|qa|question)[^"']*["'][\s\S]*?(?=<div[^>]+class=["'][^"']*(?:pyq|pyq-card|qa|question)[^"']*["']|<\/section>|<footer|$)/gi) || [];
  console.log(`PYQ card elements matched: ${pyqCards.length}`);
}

console.log('################### DRAFTING ###################');
draftingFiles.forEach(analyzeFile);

console.log('\n################### INDUSTRIAL LAW ###################');
industrialFiles.forEach(analyzeFile);
