const fs = require('fs');
const path = require('path');

const otherFiles = [
  'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html',
  'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html',
  'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html',
  'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html'
];

otherFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n=== ${path.basename(f)} ===`);
  const vMatches = [...content.matchAll(/(?:<em>|<cite>|<strong>|\b)([A-Z][a-zA-Z\s.,'&()-]{2,40}\s+v\.\s+[A-Z][a-zA-Z\s.,'&()-]{2,40})(?:<\/em>|<\/cite>|<\/strong>|[,;\s])/g)].map(m => m[1].trim());
  const unique = [...new Set(vMatches)].filter(n => n.length > 8 && !n.includes('\n'));
  console.log('Unique cases referenced:', unique.slice(0, 8));
});
