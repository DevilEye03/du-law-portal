const fs = require('fs');

function inspectDrafting(file) {
  console.log(`\n========================================`);
  console.log(`FILE: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all headings
  const headings = content.match(/<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/gi) || [];
  console.log(`Headings in ${file}:`);
  headings.forEach((h, i) => {
    const text = h.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (text.length > 0) {
      console.log(`  [${i+1}] ${text}`);
    }
  });
}

inspectDrafting('SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html');
inspectDrafting('SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html');
inspectDrafting('SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html');
inspectDrafting('SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html');
