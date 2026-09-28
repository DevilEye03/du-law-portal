const fs = require('fs');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw.replace(/\r\n/g, '\n').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

function extractDraftingTopic4(unitNum, unitTitle, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cases = [];
  const pyqs = [];

  const caseChunks = html.split(/<div class=["']box case["']/i).slice(1);
  caseChunks.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']box case["']|<\/section>|<footer/i)[0];
    const cnameMatch = inner.match(/<span class=["']cname["']>([\s\S]*?)<\/span>/i);
    const ccitMatch = inner.match(/<span class=["']ccit["']>([\s\S]*?)<\/span>/i);
    const cmetaMatch = inner.match(/<div class=["']cmeta["']>([\s\S]*?)<\/div>/i);

    const name = cnameMatch ? cnameMatch[1].replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
    const citation = ccitMatch ? ccitMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Facts
    let facts = '';
    const factsMatch = inner.match(/<p><b>Facts:?<\/b>([\s\S]*?)<\/p>/i);
    if (factsMatch) facts = cleanHtml(factsMatch[1]);

    // Issue
    let issues = '';
    const issuesMatch = inner.match(/<p><b>Issue:?<\/b>([\s\S]*?)<\/p>/i);
    if (issuesMatch) issues = cleanHtml(issuesMatch[1]);

    // Arguments
    let argumentsText = '';
    const argsMatch = inner.match(/<p><b>Arguments[^<]*:?<\/b>([\s\S]*?)<\/p>/i);
    if (argsMatch) argumentsText = cleanHtml(argsMatch[1]);

    // Ratio / Decision
    let ratio = '';
    const decMatch = inner.match(/<p><b>(?:Held|Decision|Ratio|Held \/ Ratio):?<\/b>([\s\S]*?)<\/p>/i);
    if (decMatch) ratio = cleanHtml(decMatch[1]);

    // Principle
    let principle = '';
    const princMatch = inner.match(/<div class=["']principle["']>([\s\S]*?)<\/div>/i);
    if (princMatch) principle = cleanHtml(princMatch[1]);

    cases.push({
      id: `draft-c-u${unitNum}-${idx + 1}`,
      name,
      citation,
      unitNumber: unitNum,
      unit: unitTitle,
      file: filePath,
      anchorId: `c4-${idx + 1}`,
      facts: facts || 'Refer to the Succession Act dossier for full case analysis.',
      issues: issues || 'Probate and testamentary execution issues.',
      arguments: argumentsText || '',
      ratio: ratio || 'Binding precedent on testamentary capacity and suspicious circumstances.',
      principleEvolved: principle || '',
      examTips: cmetaMatch ? cmetaMatch[1].replace(/<[^>]+>/g, ' · ').trim() : ''
    });
  });

  // PYQs
  const pyqChunks = html.split(/<div class=["']pyq["']/i).slice(1);
  pyqChunks.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']pyq["']|<\/section>|<footer/i)[0];
    const badgeMatch = inner.match(/<span class=["']badge["']>([\s\S]*?)<\/span>/i);
    const qMatch = inner.match(/<span class=["']q["']>([\s\S]*?)<\/span>/i);
    const ansMatch = inner.match(/<div class=["']ans["']>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                     inner.match(/<div class=["']pybody["']>([\s\S]*?)<\/div>/i);

    const year = badgeMatch ? badgeMatch[1].replace(/<[^>]+>/g, '').trim() : 'DU Examination';
    const question = qMatch ? qMatch[1].replace(/<[^>]+>/g, '').trim() : `Question ${idx + 1}`;
    let modelAnswer = ansMatch ? cleanHtml(ansMatch[1]) : '';
    modelAnswer = modelAnswer.replace(/<span class=["']lbl["']>MODEL ANSWER<\/span>/i, '').trim();

    pyqs.push({
      id: `draft-pyq-u${unitNum}-${idx + 1}`,
      number: `Q${idx + 1}`,
      year,
      marks: '20 Marks',
      type: 'Drafting Model',
      unitNumber: unitNum,
      unit: unitTitle,
      file: filePath,
      anchorId: `pyq-u${unitNum}-${idx + 1}`,
      question,
      modelAnswer
    });
  });

  return { cases, pyqs };
}

const t4 = extractDraftingTopic4(4, 'Topic 4: Pleadings under Indian Succession Act, 1925', 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html');
console.log('Topic 4 Cases:', t4.cases.length, 'PYQs:', t4.pyqs.length);
console.log('Sample Case 1:', t4.cases[0].name, 'Facts len:', t4.cases[0].facts.length, 'Ratio len:', t4.cases[0].ratio.length);
console.log('Sample PYQ 1:', t4.pyqs[0].year, 'Answer len:', t4.pyqs[0].modelAnswer.length);
