const fs = require('fs');

const d6 = fs.readFileSync('SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html', 'utf8');
const s7Idx = d6.indexOf('id="s7"');
console.log(d6.slice(s7Idx + 2000, s7Idx + 5000));


