const fs = require('fs');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw.replace(/\r\n/g, '\n').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

function extractIndUnit4(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cases = [];
  const pyqs = [];

  // Cases: div.casecard
  const caseCards = html.split(/<div class=["']casecard["']/i).slice(1);
  caseCards.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']casecard["']|<\/section>|<footer/i)[0];
    const h3Match = inner.match(/<h3>([\s\S]*?)<\/h3>/i);
    const citMatch = inner.match(/<div class=["']cit["']>([\s\S]*?)<\/div>/i);

    let name = h3Match ? h3Match[1].replace(/<span class=["']card-badge["']>[\s\S]*?<\/span>/i, '').replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
    // Remove leading symbols like ⑩ ⑪ etc.
    name = name.replace(/^[\u2460-\u24FF\d]+\s*/, '').trim();
    const citation = citMatch ? citMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Extract by lbl blocks in cb
    let facts = '';
    let issues = '';
    let args = '';
    let ratio = '';
    let principle = '';

    const lblChunks = inner.split(/<div class=["']lbl["']>/i).slice(1);
    lblChunks.forEach(lc => {
      const lblTitleMatch = lc.match(/^([\s\S]*?)<\/div>/i);
      const lblTitle = lblTitleMatch ? lblTitleMatch[1].replace(/<[^>]+>/g, '').trim().toLowerCase() : '';
      const body = lc.replace(/^[\s\S]*?<\/div>/i, '').trim();

      if (lblTitle.includes('fact')) {
        facts = cleanHtml(body);
      } else if (lblTitle.includes('issue')) {
        issues = cleanHtml(body);
      } else if (lblTitle.includes('argument')) {
        args += (args ? '<br>' : '') + `<h6>${lblTitleMatch[1]}</h6>` + cleanHtml(body);
      } else if (lblTitle.includes('ratio') || lblTitle.includes('decision') || lblTitle.includes('holding')) {
        ratio += (ratio ? '<br>' : '') + cleanHtml(body);
      } else if (lblTitle.includes('principle') || lblTitle.includes('doctrine')) {
        principle += (principle ? '<br>' : '') + cleanHtml(body);
      }
    });

    cases.push({
      id: `ind-c-u4-${idx + 1}`,
      name,
      citation,
      unitNumber: 4,
      unit: 'Unit 4: Managerial Prerogative & Disciplinary Action (Domestic Inquiry)',
      file: filePath,
      anchorId: `case-u4-${idx + 1}`,
      facts: facts || 'Refer to Unit 4 dossier for full context.',
      issues: issues || 'Disciplinary inquiry procedure and stay during criminal proceedings.',
      arguments: args || '',
      ratio: ratio || 'Binding precedent on domestic enquiries.',
      principleEvolved: principle || '',
      examTips: citation
    });
  });

  return { cases };
}

const u4Res = extractIndUnit4('SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html');
console.log('Unit 4 Cases count:', u4Res.cases.length);
console.log('Case 1 Name:', u4Res.cases[0].name);
console.log('Case 1 Citation:', u4Res.cases[0].citation);
console.log('Case 1 Facts len:', u4Res.cases[0].facts.length);
console.log('Case 1 Issues len:', u4Res.cases[0].issues.length);
console.log('Case 1 Arguments len:', u4Res.cases[0].arguments.length);
console.log('Case 1 Ratio len:', u4Res.cases[0].ratio.length);
console.log('Case 1 Principle len:', u4Res.cases[0].principleEvolved.length);
