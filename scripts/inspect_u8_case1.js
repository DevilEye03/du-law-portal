const fs = require('fs');

const u8 = fs.readFileSync('SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html', 'utf8');
const caseStart = u8.indexOf('1. General Manager, B.E.S.T.');
console.log('Case Start Index:', caseStart);
if (caseStart !== -1) {
  console.log(u8.slice(caseStart - 50, caseStart + 1500));
}
