const fs = require('fs');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw.replace(/\r\n/g, '\n').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

// Industrial Unit 1 & 2: dl.brief and div.pyq
function extractIndUnit1_2(unitNum, unitTitle, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cases = [];
  const pyqs = [];

  const caseBoxes = html.split(/<div class=["']box case["']/i).slice(1);
  caseBoxes.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']box case["']|<\/section>|<footer/i)[0];
    const tagMatch = inner.match(/<span class=["']tag["']>([\s\S]*?)<\/span>/i);
    const tagText = tagMatch ? tagMatch[1].replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
    
    // Tag text usually: "Case — North Brook Jute Co. Ltd. v. Their Workmen, AIR 1960 SC 879"
    let name = tagText.replace(/^Case\s*[—–-]\s*/i, '').trim();
    let citation = '';
    const citeParts = name.split(/,\s*(AIR\s*\d+|(?:\(\d+\)|\d+)\s*SCC|\d+\s*SCR)/i);
    if (citeParts.length > 1) {
      name = citeParts[0].trim();
      citation = citeParts.slice(1).join('').trim();
    }

    // Extract dl dt dd
    let facts = '';
    let issues = '';
    let ratio = '';
    let args = '';

    const dtMatches = inner.match(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/gi) || [];
    dtMatches.forEach(dtdd => {
      const dt = dtdd.match(/<dt>([\s\S]*?)<\/dt>/i)?.[1]?.replace(/<[^>]+>/g, '')?.trim()?.toLowerCase() || '';
      const dd = dtdd.match(/<dd>([\s\S]*?)<\/dd>/i)?.[1]?.trim() || '';

      if (dt.includes('fact')) facts = cleanHtml(dd);
      else if (dt.includes('issue')) issues = cleanHtml(dd);
      else if (dt.includes('held') || dt.includes('ratio') || dt.includes('decision')) ratio = cleanHtml(dd);
      else if (dt.includes('argument')) args = cleanHtml(dd);
      else if (dt.includes('rule') || dt.includes('principle')) ratio += (ratio ? '<br><br>' : '') + `<strong>Principle:</strong> ` + cleanHtml(dd);
    });

    cases.push({
      id: `ind-c-u${unitNum}-${idx + 1}`,
      name,
      citation,
      unitNumber: unitNum,
      unit: unitTitle,
      file: filePath,
      anchorId: `case-u${unitNum}-${idx + 1}`,
      facts: facts || 'Refer to the Industrial Law dossier for full facts.',
      issues: issues || 'Industrial dispute jurisdiction and statutory construction.',
      arguments: args || '',
      ratio: ratio || 'Binding judicial ruling of the Supreme Court.',
      principleEvolved: 'Key authority on dispute settlement mechanism under IDA/IRC.',
      examTips: 'High-yield landmark authority in DU LL.B. semester examination answers.'
    });
  });

  // PYQs in Unit 1 & 2: div.pyq
  const pyqChunks = html.split(/<div class=["']pyq["']/i).slice(1);
  pyqChunks.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']pyq["']|<\/section>|<footer/i)[0];
    const qMatch = inner.match(/<div class=["']q["']>([\s\S]*?)<\/div>/i);
    const aMatch = inner.match(/<div class=["']a["']>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                   inner.match(/<div class=["']a["']>([\s\S]*?)<\/div>/i);

    const fullQ = qMatch ? qMatch[1] : `Question ${idx + 1}`;
    const srcMatch = fullQ.match(/<span class=["']src["']>([\s\S]*?)<\/span>/i);
    const year = srcMatch ? srcMatch[1].replace(/<[^>]+>/g, '').trim() : 'DU Examination';
    const qText = fullQ.replace(/<span class=["']src["']>[\s\S]*?<\/span>/i, '').replace(/<br\s*\/?>/i, '').trim();

    pyqs.push({
      id: `ind-pyq-u${unitNum}-${idx + 1}`,
      number: `Q${idx + 1}`,
      year,
      marks: year.includes('marks') ? (year.match(/\d+\s*marks/i)?.[0] || '15 Marks') : '15 Marks',
      type: year.includes('problem') ? 'Problem' : 'Essay',
      unitNumber: unitNum,
      unit: unitTitle,
      file: filePath,
      anchorId: `pyq-u${unitNum}-${idx + 1}`,
      question: cleanHtml(qText),
      modelAnswer: aMatch ? cleanHtml(aMatch[1]) : ''
    });
  });

  return { cases, pyqs };
}

const ind1 = extractIndUnit1_2(1, 'Unit 1: Dispute Settlement under Industrial Relations Code, 2020', 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html');
console.log('Ind Unit 1 Cases:', ind1.cases.length, 'PYQs:', ind1.pyqs.length);
console.log('Sample Case 1:', ind1.cases[0].name, 'Facts len:', ind1.cases[0].facts.length, 'Ratio len:', ind1.cases[0].ratio.length);
console.log('Sample PYQ 1:', ind1.pyqs[0].year, 'Answer len:', ind1.pyqs[0].modelAnswer.length);
