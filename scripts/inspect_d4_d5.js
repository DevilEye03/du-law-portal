const fs = require('fs');

// Check Drafting Topic 4 cases
const d4 = fs.readFileSync('SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html', 'utf8');
const d4Cases = d4.match(/<div class=["']box case["'][\s\S]*?(?=<div class=["']box case["']|<\/section>|<footer|$)/gi) || [];
console.log('=== DRAFTING TOPIC 4 CASES ===');
console.log('Count:', d4Cases.length);
if (d4Cases.length > 0) {
  console.log('Sample Topic 4 Case HTML:');
  console.log(d4Cases[0].slice(0, 1500));
}

// Check Drafting Topic 5 cases and questions
const d5 = fs.readFileSync('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html', 'utf8');
console.log('\n=== DRAFTING TOPIC 5 QUESTIONS ===');
const d5QSec = d5.indexOf('DU Semester Questions + Best Model Answers');
if (d5QSec !== -1) {
  console.log(d5.slice(d5QSec, d5QSec + 2000));
}
