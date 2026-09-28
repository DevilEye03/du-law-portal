const fs = require('fs');

const u8 = fs.readFileSync('SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html', 'utf8');
const pyq1 = u8.search(/id=["']pyq1["']/i);
console.log('pyq1 index:', pyq1);
if (pyq1 !== -1) {
  console.log(u8.slice(pyq1 - 50, pyq1 + 2500));
}
