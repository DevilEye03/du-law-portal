const fs = require('fs');

const u8 = fs.readFileSync('SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html', 'utf8');
const pyqStart = u8.indexOf('Previous-year questions & model answers');
console.log('PYQ Start Index:', pyqStart);
if (pyqStart !== -1) {
  console.log(u8.slice(pyqStart, pyqStart + 2500));
}
