const fs = require('fs');
const path = require('path');

// Helper to clean HTML text while keeping readable paragraphs/lists
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
// DRAFTING TOPIC 1, 2, 3: div.case and div.pyq parser
// -------------------------------------------------------------
function extractDraftingTopics1to3(unitNum, unitTitle, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cases = [];
  const pyqs = [];

  // Parse cases: split by <div class="case"
  const caseChunks = html.split(/<div class=["']case["']/i).slice(1);
  caseChunks.forEach((chunk, idx) => {
    // End chunk at next case or section/footer
    const inner = chunk.split(/<div class=["']case["']|<\/section>|<footer/i)[0];
    
    // Name & Citation
    const cnameMatch = inner.match(/<div class=["']cname["']>([\s\S]*?)<\/div>/i);
    const ccitMatch = inner.match(/<div class=["']ccit["']>([\s\S]*?)<\/div>/i);
    const cmetaMatch = inner.match(/<div class=["']cmeta["']>([\s\S]*?)<\/div>/i);

    let name = cnameMatch ? cnameMatch[1].replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
    // Remove leading numbering like "1 · "
    name = name.replace(/^\d+\s*·\s*/, '').trim();
    const citation = ccitMatch ? ccitMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Facts
    let facts = '';
    const factsMatch = inner.match(/<div class=["']el["']><h5>Facts<\/h5>([\s\S]*?)<\/div>/i);
    if (factsMatch) facts = cleanHtml(factsMatch[1]);

    // Issues
    let issues = '';
    const issuesMatch = inner.match(/<div class=["']el["']><h5>Issues<\/h5>([\s\S]*?)<\/div>/i);
    if (issuesMatch) issues = cleanHtml(issuesMatch[1]);

    // Arguments
    let argumentsText = '';
    const argsPlMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Plaintiff[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    const argsDefMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Defendant[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    const argsGenMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*<\/h5>([\s\S]*?)<\/div>/i);
    
    if (argsPlMatch || argsDefMatch) {
      argumentsText = (argsPlMatch ? `<h6>Arguments — Plaintiff</h6>${cleanHtml(argsPlMatch[1])}` : '') +
                      (argsDefMatch ? `<h6>Arguments — Defendant</h6>${cleanHtml(argsDefMatch[1])}` : '');
    } else if (argsGenMatch) {
      argumentsText = cleanHtml(argsGenMatch[1]);
    }

    // Decision / Ratio
    let ratio = '';
    const decMatch = inner.match(/<div class=["']el["']><h5>Decision<\/h5>([\s\S]*?)<\/div>/i) ||
                     inner.match(/<div class=["']el["']><h5>Held<\/h5>([\s\S]*?)<\/div>/i);
    if (decMatch) ratio = cleanHtml(decMatch[1]);

    // Principle Evolved
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

  // Parse PYQs
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
    // Remove "MODEL ANSWER" label if duplicated
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

const t1 = extractDraftingTopics1to3(1, 'Topic 1: Fundamental Rules & Skills of Pleadings', 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html');
console.log('Topic 1 Cases:', t1.cases.length, 'PYQs:', t1.pyqs.length);
console.log('Sample Case 1 Facts length:', t1.cases[0].facts.length, 'Ratio length:', t1.cases[0].ratio.length);
console.log('Sample PYQ 1 Model Answer length:', t1.pyqs[0].modelAnswer.length);
