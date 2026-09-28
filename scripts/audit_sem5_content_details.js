const fs = require('fs');

const dFiles = [
  { num: 1, file: 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html' },
  { num: 2, file: 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html' },
  { num: 3, file: 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html' },
  { num: 4, file: 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html' },
  { num: 5, file: 'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html' },
  { num: 6, file: 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html' },
  { num: 7, file: 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html' }
];

const iFiles = [
  { num: 1, file: 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html' },
  { num: 2, file: 'SEM 5/Industrial law/IR_Code_Unit2_Reference_Notes.html' },
  { num: 3, file: 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html' },
  { num: 4, file: 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html' },
  { num: 5, file: 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html' },
  { num: 6, file: 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html' },
  { num: 7, file: 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html' },
  { num: 8, file: 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html' }
];

console.log('=== DRAFTING NOTES ANALYSIS ===');
dFiles.forEach(df => {
  const content = fs.readFileSync(df.file, 'utf8');
  const caseMatches = content.match(/<div class=["']case["'][\s\S]*?(?=<div class=["']case["']|<\/section>|<footer|$)/gi) || [];
  const pyqMatches = content.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Topic ${df.num} (${df.file}): Cases = ${caseMatches.length}, PYQs = ${pyqMatches.length}`);
});

console.log('\n=== INDUSTRIAL LAW NOTES ANALYSIS ===');
iFiles.forEach(ifile => {
  const content = fs.readFileSync(ifile.file, 'utf8');
  // Check both <div class="case"> and <div class="box case">
  const caseDivMatches = content.match(/<div class=["'][^"']*case[^"']*["'][\s\S]*?(?=<div class=["'][^"']*case[^"']*["']|<\/section>|<footer|$)/gi) || [];
  const pyqMatches = content.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Unit ${ifile.num} (${ifile.file}): Case divs = ${caseDivMatches.length}, PYQs = ${pyqMatches.length}`);
});
