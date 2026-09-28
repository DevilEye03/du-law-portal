const fs = require('fs');

function checkDraftingTopic(num, file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n================== DRAFTING TOPIC ${num} ==================`);
  
  // Case patterns
  const caseMatches = html.match(/<(?:div|section)[^>]*class=["'][^"']*case[^"']*["'][\s\S]*?(?=<div[^>]*class=["'][^"']*case[^"']*["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Cases matched: ${caseMatches.length}`);
  caseMatches.forEach((c, idx) => {
    const nameMatch = c.match(/class=["']cname["'][^>]*>([\s\S]*?)<\/(?:div|span)>/i) ||
                      c.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i) ||
                      c.match(/<strong>([\s\S]*?)<\/strong>/i);
    const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';
    console.log(`  Case ${idx + 1}: ${name.slice(0, 70)}`);
  });

  // PYQ patterns
  const pyqMatches = html.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/gi) || [];
  console.log(`div.pyq matched: ${pyqMatches.length}`);
  if (pyqMatches.length > 0) {
    pyqMatches.slice(0, 3).forEach((p, idx) => {
      const qText = p.match(/class=["']q["'][^>]*>([\s\S]*?)<\/div>/i) || p.match(/class=["']pyhead["'][^>]*>([\s\S]*?)<\/div>/i);
      console.log(`  PYQ ${idx + 1}: ${(qText ? qText[1].replace(/<[^>]+>/g, '').trim() : '').slice(0, 70)}`);
    });
  } else {
    // Look for other question patterns
    const otherQ = html.match(/<(?:h[2-4]|div)[^>]*>(?:DU|Past|Exam|Question|Model Answer|Q\.)[\s\S]*?<\/(?:h[2-4]|div)>/gi) || [];
    console.log(`Other question matches: ${otherQ.length}`);
    otherQ.slice(0, 3).forEach((q, idx) => console.log(`  Q ${idx + 1}: ${q.replace(/<[^>]+>/g, '').trim().slice(0, 70)}`));
  }
}

checkDraftingTopic(2, 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html');
checkDraftingTopic(3, 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html');
checkDraftingTopic(4, 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html');
checkDraftingTopic(5, 'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html');
checkDraftingTopic(6, 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html');
checkDraftingTopic(7, 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html');
