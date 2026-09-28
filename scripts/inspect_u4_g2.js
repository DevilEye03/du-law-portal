const fs = require('fs');

const u4 = fs.readFileSync('SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html', 'utf8');
const g2Idx = u4.indexOf('G.2 Model answer');
const g3Idx = u4.indexOf('G.3 Model answer');
const g4Idx = u4.indexOf('G.4 Model answer');
const g5Idx = u4.indexOf('G.5');
const g6Idx = u4.indexOf('G.6 Ten predicted');

console.log('G.2 snippet:');
console.log(u4.slice(g2Idx, g2Idx + 1500));
