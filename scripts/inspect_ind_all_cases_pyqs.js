const fs = require('fs');

const indFiles = [
  { num: 1, title: 'Dispute Settlement under Industrial Relations Code, 2020', file: 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html' },
  { num: 2, title: 'Reference of Industrial Disputes to Adjudicatory Authorities', file: 'SEM 5/Industrial law/IR_Code_Unit2_Reference_Notes.html' },
  { num: 3, title: 'Awards & Settlements — Binding Nature & Enforcement', file: 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html' },
  { num: 4, title: 'Managerial Prerogative & Disciplinary Action (Domestic Inquiry)', file: 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html' },
  { num: 5, title: 'Powers of Adjudicatory Authorities & Doctrine of Proportionality', file: 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html' },
  { num: 6, title: 'Restraints on Managerial Prerogatives (§33 & §33-A IDA)', file: 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html' },
  { num: 7, title: 'Wages — Concepts, Kinds & The Code on Wages, 2019', file: 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html' },
  { num: 8, title: 'The Code on Social Security, 2020', file: 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html' }
];

indFiles.forEach(inf => {
  const html = fs.readFileSync(inf.file, 'utf8');
  console.log(`\n======================================================`);
  console.log(`INDUSTRIAL UNIT ${inf.num}: ${inf.title}`);
  console.log(`======================================================`);

  // Check cases
  const caseMatches = html.match(/<(?:div|article|section)[^>]*class=["'][^"']*(?:casecard|box\s+case|case-card)[^"']*["'][\s\S]*?(?=<(?:div|article|section)[^>]*class=["'][^"']*(?:casecard|box\s+case|case-card)[^"']*["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Found ${caseMatches.length} case elements.`);
  caseMatches.forEach((c, idx) => {
    let name = '';
    const h3 = c.match(/<h3>([\s\S]*?)<\/h3>/i);
    const tag = c.match(/<span class=["']tag["']>([\s\S]*?)<\/span>/i);
    const cname = c.match(/class=["']cname["']>([\s\S]*?)<\/(?:span|div)>/i);
    if (h3) name = h3[1];
    else if (tag) name = tag[1];
    else if (cname) name = cname[1];
    console.log(`  Case ${idx + 1}: ${name.replace(/<[^>]+>/g, '').trim().slice(0, 75)}`);
  });

  // Check PYQs / Model answers
  const pyqs = html.match(/<div class=["']pyq["'][\s\S]*?(?=<div class=["']pyq["']|<\/section>|<footer|$)/gi) || [];
  console.log(`Found ${pyqs.length} div.pyq elements.`);
  if (pyqs.length === 0) {
    // Look for h3 or model answer headings
    const mHeadings = html.match(/<h[2-4][^>]*>(?:Model\s+[Aa]nswer|Question|Q\.\d)[\s\S]*?<\/h[2-4]>/gi) || [];
    console.log(`Found ${mHeadings.length} Model Answer headings:`);
    mHeadings.forEach((m, idx) => console.log(`  MA ${idx + 1}: ${m.replace(/<[^>]+>/g, '').trim().slice(0, 75)}`));
  }
});
