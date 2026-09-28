const fs = require('fs');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

function stripOuterTags(str) {
  if (!str) return '';
  return str.replace(/^\s*<(?:div|p)[^>]*>/i, '').replace(/<\/(?:div|p)>\s*$/i, '').trim();
}

// -------------------------------------------------------------
// DRAFTING PARSERS
// -------------------------------------------------------------
function extractDraftingTopics1to3(unitNum, unitTitle, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cases = [];
  const pyqs = [];

  const caseChunks = html.split(/<div class=["']case["']/i).slice(1);
  caseChunks.forEach((chunk, idx) => {
    const inner = chunk.split(/<div class=["']case["']|<\/section>|<footer/i)[0];
    const cnameMatch = inner.match(/<div class=["']cname["']>([\s\S]*?)<\/div>/i);
    const ccitMatch = inner.match(/<div class=["']ccit["']>([\s\S]*?)<\/div>/i);
    const cmetaMatch = inner.match(/<div class=["']cmeta["']>([\s\S]*?)<\/div>/i);

    let name = cnameMatch ? cnameMatch[1].replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
    name = name.replace(/^\d+\s*·\s*/, '').trim();
    const citation = ccitMatch ? ccitMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    let facts = '';
    const factsMatch = inner.match(/<div class=["']el["']><h5>Facts<\/h5>([\s\S]*?)<\/div>/i);
    if (factsMatch) facts = cleanHtml(factsMatch[1]);

    let issues = '';
    const issuesMatch = inner.match(/<div class=["']el["']><h5>Issues<\/h5>([\s\S]*?)<\/div>/i);
    if (issuesMatch) issues = cleanHtml(issuesMatch[1]);

    let argumentsText = '';
    const argsPlMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Plaintiff[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    const argsDefMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Defendant[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    const argsGenMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    
    if (argsPlMatch || argsDefMatch) {
      argumentsText = (argsPlMatch ? `<h6>Arguments — Plaintiff / Claimant</h6>${cleanHtml(argsPlMatch[1])}` : '') +
                      (argsDefMatch ? `<h6>Arguments — Defendant / Respondent</h6>${cleanHtml(argsDefMatch[1])}` : '');
    } else if (argsGenMatch) {
      argumentsText = cleanHtml(argsGenMatch[1]);
    }

    let ratio = '';
    const decMatch = inner.match(/<div class=["']el["']><h5>Decision<\/h5>([\s\S]*?)<\/div>/i) ||
                     inner.match(/<div class=["']el["']><h5>Held<\/h5>([\s\S]*?)<\/div>/i);
    if (decMatch) ratio = cleanHtml(decMatch[1]);

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
      anchorId: `c${idx + 1}`,
      facts: facts || 'Refer to the dossier for extensive factual history.',
      issues: issues || 'Core questions of law and statutory compliance.',
      arguments: argumentsText || '',
      ratio: ratio || 'Court decision and binding legal reasoning.',
      principleEvolved: principle || '',
      examTips: cmetaMatch ? cmetaMatch[1].replace(/<[^>]+>/g, ' · ').trim() : ''
    });
  });

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
      marks: year.includes('Marks') ? (year.match(/\d+\s*Marks/i)?.[0] || '20 Marks') : '20 Marks',
      type: question.toLowerCase().includes('draft') ? 'Drafting Model' : 'Essay',
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

// -------------------------------------------------------------
// DRAFTING TOPIC 4: div.box.case
// -------------------------------------------------------------
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

    let facts = '';
    const factsMatch = inner.match(/<p><b>Facts:?<\/b>([\s\S]*?)<\/p>/i);
    if (factsMatch) facts = cleanHtml(factsMatch[1]);

    let issues = '';
    const issuesMatch = inner.match(/<p><b>Issue:?<\/b>([\s\S]*?)<\/p>/i);
    if (issuesMatch) issues = cleanHtml(issuesMatch[1]);

    let argumentsText = '';
    const argsMatch = inner.match(/<p><b>Arguments[^<]*:?<\/b>([\s\S]*?)<\/p>/i);
    if (argsMatch) argumentsText = cleanHtml(argsMatch[1]);

    let ratio = '';
    const decMatch = inner.match(/<p><b>(?:Held|Decision|Ratio)[^<]*<\/b>([\s\S]*?)<\/p>/i);
    if (decMatch) ratio = cleanHtml(decMatch[1]);

    let principle = '';
    const princMatch = inner.match(/<p><b>Principle:?<\/b>([\s\S]*?)<\/p>/i) ||
                       inner.match(/<div class=["']principle["']>([\s\S]*?)<\/div>/i);
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

console.log('Testing extraction:');
const d1 = extractDraftingTopics1to3(1, 'Topic 1: Fundamental Rules & Skills of Pleadings', 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html');
const d2 = extractDraftingTopics1to3(2, 'Topic 2: Forms of Pleadings — Civil Plaints & Applications', 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html');
const d3 = extractDraftingTopics1to3(3, 'Topic 3: Matrimonial Pleadings (HMA 1955)', 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html');
const d4 = extractDraftingTopic4(4, 'Topic 4: Pleadings under Indian Succession Act, 1925', 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html');

console.log(`D1: Cases=${d1.cases.length}, PYQs=${d1.pyqs.length}`);
console.log(`D2: Cases=${d2.cases.length}, PYQs=${d2.pyqs.length}`);
console.log(`D3: Cases=${d3.cases.length}, PYQs=${d3.pyqs.length}`);
console.log(`D4: Cases=${d4.cases.length}, PYQs=${d4.pyqs.length}`);
console.log('D4 Case 1 Ratio len:', d4.cases[0].ratio.length, 'Principle len:', d4.cases[0].principleEvolved.length);
