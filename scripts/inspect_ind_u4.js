const fs = require('fs');

// Check Industrial Unit 4 cases
const u4 = fs.readFileSync('SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html', 'utf8');
const u4CasesSec = u4.slice(u4.indexOf('id="cases"'), u4.indexOf('id="statutes"'));
console.log('=== INDUSTRIAL UNIT 4 CASES SECTION ===');
console.log(u4CasesSec.slice(0, 1500));

// Check Industrial Unit 4 PYQ section
const u4PyqSec = u4.slice(u4.indexOf('id="pyq"'), u4.indexOf('id="errors"'));
console.log('\n=== INDUSTRIAL UNIT 4 PYQ SECTION ===');
console.log(u4PyqSec.slice(0, 1500));
