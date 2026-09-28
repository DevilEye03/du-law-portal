const fs = require('fs');
const path = require('path');

function inspectMarkup(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n========================================`);
  console.log(`FILE: ${path.basename(file)}`);

  // Classes on div, details, section
  const classMatches = content.match(/class=["']([^"']+)["']/gi) || [];
  const classes = new Set();
  classMatches.forEach(cm => {
    const cls = cm.replace(/class=["']|["']/gi, '').split(/\s+/);
    cls.forEach(c => classes.add(c));
  });

  const caseClasses = [...classes].filter(c => /case|verdict|ruling|precedent/i.test(c));
  const pyqClasses = [...classes].filter(c => /pyq|exam|question|model/i.test(c));
  const revClasses = [...classes].filter(c => /rev|capsule|summary|table|mnemonic|map/i.test(c));

  console.log('Case-related classes:', caseClasses);
  console.log('PYQ-related classes:', pyqClasses);
  console.log('Revision-related classes:', revClasses);

  // Check sample case markup
  const caseSample = content.match(/<(?:div|details|section)[^>]*(?:case|box case)[^>]*>[\s\S]{1,400}/i);
  if (caseSample) {
    console.log('\nSample case snippet:\n', caseSample[0].substring(0, 300));
  }

  // Check sample pyq markup
  const pyqSample = content.match(/<(?:div|details|section)[^>]*(?:pyq|question)[^>]*>[\s\S]{1,400}/i);
  if (pyqSample) {
    console.log('\nSample pyq snippet:\n', pyqSample[0].substring(0, 300));
  }
}

inspectMarkup('SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html');
inspectMarkup('SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html');
inspectMarkup('SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html');
inspectMarkup('SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html');
inspectMarkup('SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html');
