const fs = require('fs');

const u8 = fs.readFileSync('SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html', 'utf8');
const partJ = u8.search(/id=["']partJ["']/i);
console.log('partJ index:', partJ);
if (partJ !== -1) {
  console.log(u8.slice(partJ, partJ + 2500));
}
