#!/usr/bin/env node
/**
 * DU Law Notes Portal — Semester 2 Auto-Ingestion Engine
 * Ingests Public International Law (LB-205) and Property Law (LB-204)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'js', 'data.js');

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePropertyUnit(filePath, relFilePath, unitNumber, explicitTitle) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
  const unitTitle = explicitTitle || rawTitle.replace(/\s*[|—–-].*$/i, '').replace(/^Topic\s*\d+\s*[–—:-]\s*/i, '').trim();

  const cases = [];
  const pyqs = [];
  let caseIdx = 1;

  // Pattern 1: <div class="case" ...> ... <h3>CASE X — Name</h3> ... <div class="cite">...</div>
  const caseBlocks = [...content.matchAll(/<div\s+class="(?:case|box case)"[^>]*id="?([^"\s>]*)"?[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<div class="(?:case|box case)"|<h2|<footer|$))/gi)];

  for (const cb of caseBlocks) {
    const anchorId = cb[1];
    const body = cb[2];
    const h3Match = body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    let title = h3Match ? stripHtml(h3Match[1]) : '';
    title = title.replace(/^CASE\s*\d+\s*[—–-]\s*/i, '').replace(/^[0-9.]+\s*/, '').trim();
    if (!title) continue;

    const citeMatch = body.match(/<div class="cite"[^>]*>([\s\S]*?)<\/div>/i) ||
                      body.match(/<span class="cite"[^>]*>([\s\S]*?)<\/span>/i);
    const cite = citeMatch ? stripHtml(citeMatch[1]) : 'DU Prescribed Landmark Case';

    const factsMatch = body.match(/<h4>(?:<span[^>]*>[^<]*<\/span>)?\s*(?:Background &amp; Facts|Facts|Material facts)<\/h4>([\s\S]*?)(?=<h4>|<div class="vs"|<div class="box"|$)/i);
    const issuesMatch = body.match(/<h4>(?:<span[^>]*>[^<]*<\/span>)?\s*(?:Issues?|Questions)<\/h4>([\s\S]*?)(?=<h4>|<div class="vs"|<div class="box"|$)/i);
    const argsMatch = body.match(/(?:<h4>(?:<span[^>]*>[^<]*<\/span>)?\s*(?:Arguments|Submissions)<\/h4>|<div class="vs">)([\s\S]*?)(?=<h4>|<div class="box"|$)/i);
    const decisionMatch = body.match(/<h4>(?:<span[^>]*>[^<]*<\/span>)?\s*(?:Decision &amp; Reasoning|Decision|Holding|Judgment)<\/h4>([\s\S]*?)(?=<h4>|<div class="box"|$)/i);
    const principlesMatch = body.match(/<h4>(?:<span[^>]*>[^<]*<\/span>)?\s*(?:Principles evolved|Principles?|Significance)<\/h4>([\s\S]*?)(?=<h4>|<div class="foot"|$)/i);

    cases.push({
      id: `prop-c-u${unitNumber}-${caseIdx++}`,
      name: title,
      citation: cite,
      unitNumber: unitNumber,
      unit: `Topic ${unitNumber}: ${unitTitle}`,
      file: relFilePath,
      anchorId: anchorId || `case-${caseIdx}`,
      facts: factsMatch ? stripHtml(factsMatch[1]) : `Material facts as recorded in DU Case Material for Topic ${unitNumber}.`,
      issues: issuesMatch ? stripHtml(issuesMatch[1]) : 'Core legal question on property transfer, statutory compliance, or title.',
      arguments: argsMatch ? stripHtml(argsMatch[1]) : 'Submissions of appellant and respondent on Transfer of Property Act provisions.',
      ratio: decisionMatch ? stripHtml(decisionMatch[1]) : (principlesMatch ? stripHtml(principlesMatch[1]) : 'Ratio decidendi and principle of property law established.'),
      examTips: principlesMatch ? stripHtml(principlesMatch[1]) : 'High-yield landmark authority to cite in DU LL.B. semester examination answers.'
    });
  }

  // Fallback if no div.case: match by <h3...>CASE X — Name</h3>
  if (cases.length === 0) {
    const caseH3s = [...content.matchAll(/<h[234][^>]*id="?([^"\s>]*)"?[^>]*>([\s\S]*?CASE\s+\d+[\s\S]*?)<\/h[234]>([\s\S]*?)(?=<h[234]|$)/gi)];
    for (const ch of caseH3s) {
      const anchorId = ch[1];
      const titleRaw = stripHtml(ch[2]).replace(/^CASE\s*\d+\s*[—–-]\s*/i, '').trim();
      const body = ch[3];
      const citeMatch = body.match(/<div class="cite"[^>]*>([\s\S]*?)<\/div>/i);
      cases.push({
        id: `prop-c-u${unitNumber}-${caseIdx++}`,
        name: titleRaw,
        citation: citeMatch ? stripHtml(citeMatch[1]) : 'DU Prescribed Landmark Case',
        unitNumber: unitNumber,
        unit: `Topic ${unitNumber}: ${unitTitle}`,
        file: relFilePath,
        anchorId: anchorId || `case-${caseIdx}`,
        facts: `Material facts as recorded in DU Case Material for Topic ${unitNumber}.`,
        issues: 'Whether the transaction or transfer satisfies the statutory requirements under the Transfer of Property Act, 1882.',
        arguments: 'Arguments regarding statutory interpretation and applicability of precedent.',
        ratio: stripHtml(body).substring(0, 450) + '...',
        examTips: 'Primary authority for DU Semester II examination questions.'
      });
    }
  }

  // Extract PYQs: <div class="pyq"> ... <h3>...</h3> ... <div class="ans">...</div>
  const pyqBlocks = [...content.matchAll(/<div\s+class="pyq"[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<div class="pyq"|<h2|<footer|$))/gi)];
  let pyqIdx = 1;
  for (const pb of pyqBlocks) {
    const b = pb[1];
    const h3Match = b.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const qTitle = h3Match ? stripHtml(h3Match[1]) : `DU Semester Examination Question ${pyqIdx}`;
    const pMatch = b.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const qText = pMatch ? stripHtml(pMatch[1]) : qTitle;
    const ansMatch = b.match(/<div class="ans"[^>]*>([\s\S]*?)<\/div>/i);
    const ans = ansMatch ? stripHtml(ansMatch[1]) : stripHtml(b);

    const yearMatch = qTitle.match(/(?:19|20)\d{2}/) || qText.match(/(?:19|20)\d{2}/);

    pyqs.push({
      id: `prop-pyq-u${unitNumber}-${pyqIdx++}`,
      year: yearMatch ? yearMatch[0] : '2024',
      term: 'II Term',
      questionNumber: pyqIdx,
      unitNumber: unitNumber,
      question: qTitle.length > 30 ? qTitle : `${qTitle}: ${qText}`,
      answer: ans,
      keyPoints: [
        'Statutory provision under Transfer of Property Act, 1882',
        'Application of judicial ratio from landmark DU precedents',
        'Structured legal conclusion and rights of parties'
      ]
    });
  }

  // Revision Capsule
  const mnemMatch = content.match(/<div class="mnem"[^>]*>([\s\S]*?)<\/div>/i);
  const mnemonics = mnemMatch ? stripHtml(mnemMatch[1]) : `M-I-T-P (Topic ${unitNumber} Core Revision)`;

  const revisions = [{
    unitNumber: unitNumber,
    unitTitle: `Topic ${unitNumber}: ${unitTitle}`,
    badge: 'Rapid Revision Kit',
    title: `${unitTitle} — Comprehensive Revision Capsule`,
    anchorId: `rev-prop-u${unitNumber}`,
    file: relFilePath,
    type: 'capsule',
    summary: `High-yield revision capsule covering ${unitTitle} under the Transfer of Property Act, 1882 with essential statutory principles and landmark Supreme Court rulings.`,
    keyDoctrines: [
      'Transfer of Property Act, 1882',
      'Doctrine of Notice & Registration',
      'Rule Against Perpetuities & Vested Interests',
      'Equitable Principles & Specific Relief'
    ],
    mnemonics: mnemonics,
    examStrategy: '1. Identify relevant TPA section and define terms.\n2. Cite controlling Supreme Court authority.\n3. Apply judicial reasoning to factual problem.\n4. State distinct legal outcome.',
    caseMap: cases.slice(0, 6).map(c => `${c.name} (${c.citation})`)
  }];

  // Unit descriptor
  const statMatches = [...content.matchAll(/Section\s+(\d+[A-Za-z]?(?:\(\d+\))?)/gi)].map(m => `S. ${m[1]}`);
  const uniqueStats = [...new Set(statMatches)].slice(0, 8);

  const unit = {
    id: `prop-u${unitNumber}`,
    number: unitNumber,
    title: `Topic ${unitNumber}: ${unitTitle}`,
    subtitle: rawTitle,
    file: relFilePath,
    statutes: uniqueStats.length > 0 ? uniqueStats : ['Transfer of Property Act, 1882'],
    topics: [
      'Statutory Scope & Legal Definitions',
      'Landmark Supreme Court & Appellate Decisions',
      'Problem-Solving Rules for DU Exams',
      'Comparative Common Law & Indian Law Analysis'
    ]
  };

  return { unit, cases, pyqs, revisions };
}

function parsePilUnit(filePath, relFilePath, unitNumber, explicitTitle) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
  const unitTitle = explicitTitle || rawTitle.replace(/\s*[|—–-].*$/i, '').replace(/^Topic\s*\d+\s*[–—:-]\s*/i, '').trim();

  const cases = [];
  const pyqs = [];
  let caseIdx = 1;

  // Extract Cases: <h3 class="sub" id="case\d+">CASE \d+ — ... or Case \d+ · ...
  const caseHeaderRegex = /<h[234][^>]*id="([^"]*)"[^>]*>([\s\S]*?(?:CASE|Case)\s+\d+[\s\S]*?)<\/h[234]>([\s\S]*?)(?=<h[234] class="sub" id="case|<h2 class="sec"|<h2 id="pyq"|<footer|$)/gi;
  const caseMatches = [...content.matchAll(caseHeaderRegex)];

  for (const cm of caseMatches) {
    const anchorId = cm[1];
    const headerText = stripHtml(cm[2]);
    let title = headerText.replace(/^(?:CASE|Case)\s*\d+\s*[—–·-]\s*/i, '').trim();
    const body = cm[3];

    const citeMatch = body.match(/<strong>Citation[^<]*:<\/strong>([\s\S]*?)(?:<br|<\/p>)/i) ||
                      body.match(/<div class="cite"[^>]*>([\s\S]*?)<\/div>/i);
    const cite = citeMatch ? stripHtml(citeMatch[1]) : 'ICJ Reports / Landmark International Precedent';

    const factsMatch = body.match(/<h4[^>]*>[^<]*Facts[^<]*<\/h4>([\s\S]*?)(?=<h4|$)/i);
    const issuesMatch = body.match(/<h4[^>]*>[^<]*Issues?[^<]*<\/h4>([\s\S]*?)(?=<h4|$)/i);
    const decisionMatch = body.match(/<h4[^>]*>[^<]*(?:Decision|Judgment|Ruling|Holding)[^<]*<\/h4>([\s\S]*?)(?=<h4|$)/i);
    const principlesMatch = body.match(/<h4[^>]*>[^<]*(?:Principles|Significance|Take-aways)[^<]*<\/h4>([\s\S]*?)(?=<h4|<p class="top-link"|$)/i);

    cases.push({
      id: `pil-c-u${unitNumber}-${caseIdx++}`,
      name: title,
      citation: cite,
      unitNumber: unitNumber,
      unit: `Topic ${unitNumber}: ${unitTitle}`,
      file: relFilePath,
      anchorId: anchorId || `case-${caseIdx}`,
      facts: factsMatch ? stripHtml(factsMatch[1]) : `Material factual matrix under Public International Law for Topic ${unitNumber}.`,
      issues: issuesMatch ? stripHtml(issuesMatch[1]) : 'Core legal questions regarding international obligations and state responsibility.',
      arguments: 'Submissions of applicant State versus respondent State before the International Court of Justice.',
      ratio: decisionMatch ? stripHtml(decisionMatch[1]) : (principlesMatch ? stripHtml(principlesMatch[1]) : 'Governing principle and ratio of international law established.'),
      examTips: principlesMatch ? stripHtml(principlesMatch[1]) : 'Essential ICJ / PCIJ landmark ruling to cite in DU LL.B. semester exams.'
    });
  }

  // Fallback for PIL cases if not matched above
  if (cases.length === 0) {
    const altMatches = [...content.matchAll(/<div class="box case"[^>]*>([\s\S]*?)<\/div>/gi)];
    for (const ab of altMatches) {
      const b = ab[1];
      const p = b.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      cases.push({
        id: `pil-c-u${unitNumber}-${caseIdx++}`,
        name: `Landmark Authority (Topic ${unitNumber})`,
        citation: 'ICJ Reports',
        unitNumber: unitNumber,
        unit: `Topic ${unitNumber}: ${unitTitle}`,
        file: relFilePath,
        anchorId: `case-${caseIdx}`,
        facts: p ? stripHtml(p[1]) : `Leading case principle for Topic ${unitNumber}.`,
        issues: 'International legal rights and obligations.',
        arguments: 'Applicant and Respondent State pleadings.',
        ratio: stripHtml(b),
        examTips: 'Key precedent for DU Public International Law examination paper.'
      });
    }
  }

  // Extract PYQs: Look for "Model answer — ...", "<div class="box exam">", etc.
  const modelAnswerMatches = [...content.matchAll(/<h4[^>]*>[^<]*(?:Model answer|Question|Q\.\s*\d+)[^<]*<\/h4>([\s\S]*?)(?=<h4|<h3|<h2|$)/gi)];
  let pyqIdx = 1;

  for (const mm of modelAnswerMatches) {
    const rawHead = stripHtml(mm[0]);
    const body = mm[1];
    const yearMatch = rawHead.match(/(?:19|20)\d{2}/) || body.match(/(?:19|20)\d{2}/);

    pyqs.push({
      id: `pil-pyq-u${unitNumber}-${pyqIdx++}`,
      year: yearMatch ? yearMatch[0] : '2024',
      term: 'II Term',
      questionNumber: pyqIdx,
      unitNumber: unitNumber,
      question: rawHead,
      answer: stripHtml(body),
      keyPoints: [
        'Governing Article of UN Charter / ICJ Statute',
        'Established customary international law rule (opinio juris & state practice)',
        'Application of ICJ jurisprudence to fact matrix'
      ]
    });
  }

  // Fallback if model answers pattern varied
  if (pyqs.length === 0) {
    const qDivs = [...content.matchAll(/<div class="box q"[^>]*>([\s\S]*?)<\/div>/gi)];
    for (const qd of qDivs) {
      pyqs.push({
        id: `pil-pyq-u${unitNumber}-${pyqIdx++}`,
        year: '2024',
        term: 'II Term',
        questionNumber: pyqIdx,
        unitNumber: unitNumber,
        question: `Topic ${unitNumber} Question on International Legal Principles`,
        answer: stripHtml(qd[1]),
        keyPoints: ['Customary rule', 'ICJ Case Ratio', 'Academic doctrine']
      });
    }
  }

  // Revision Capsule
  const revisions = [{
    unitNumber: unitNumber,
    unitTitle: `Topic ${unitNumber}: ${unitTitle}`,
    badge: 'Rapid Revision Kit',
    title: `${unitTitle} — Comprehensive Revision Capsule`,
    anchorId: `rev-pil-u${unitNumber}`,
    file: relFilePath,
    type: 'capsule',
    summary: `Comprehensive revision summary for ${unitTitle} covering treaty law, state practice, ICJ jurisprudence, and DU examination answer structures.`,
    keyDoctrines: [
      'Pacta Sunt Servanda & Jus Cogens',
      'Customary International Law & Opinio Juris',
      'ICJ Jurisdiction & Contentious Proceedings',
      'State Responsibility & Attribution'
    ],
    mnemonics: `P-I-L-U${unitNumber} (High Yield International Law Recall)`,
    examStrategy: '1. State governing source of international law (Art. 38 ICJ Statute).\n2. Discuss ICJ landmark ruling (e.g. Lotus, Nicaragua, Reparation).\n3. Analyze state practice and opinio juris.\n4. Address treaty provisions and municipal implementation.',
    caseMap: cases.slice(0, 6).map(c => `${c.name} (${c.citation})`)
  }];

  const unit = {
    id: `pil-u${unitNumber}`,
    number: unitNumber,
    title: `Topic ${unitNumber}: ${unitTitle}`,
    subtitle: rawTitle,
    file: relFilePath,
    statutes: [
      'Statute of the International Court of Justice (Art. 38)',
      'Charter of the United Nations (1945)',
      'Vienna Convention on the Law of Treaties (1969)',
      'UNCLOS (1982) & VCDR (1961)'
    ],
    topics: [
      'Foundational Jurisprudence & Treaties',
      'Landmark ICJ, PCIJ & Municipal Decisions',
      'Model Answers for 20-Mark DU Semester Problems',
      'State Practice, Diplomatic Immunities & Global Governance'
    ]
  };

  return { unit, cases, pyqs, revisions };
}

// =========================================================================
// MAIN INGESTION FUNCTION
// =========================================================================
function runSemester2Ingestion() {
  console.log('============================================================');
  console.log('🚀 DU Law Notes Portal — Semester 2 Ingestion Engine');
  console.log('Ingesting Public International Law (LB-205) & Property Law (LB-204)');
  console.log('============================================================\n');

  // Load existing data.js
  const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
  const window = {};
  eval(dataJsRaw);
  const portalData = window.DU_LAW_PORTAL_DATA;

  if (!portalData) {
    console.error('Error: Could not load DU_LAW_PORTAL_DATA from data.js');
    process.exit(1);
  }

  // 1. INGEST PROPERTY LAW (12 Topics)
  console.log('--- INGESTING PROPERTY LAW (LB-204) ---');
  const propFolder = path.join(ROOT_DIR, 'sem 2', 'PROPERTY LAW');
  const propConfigFiles = [
    { u: 1, f: 'Topic1_Movable_Immovable_Property_DU_Notes.html', t: 'Movable & Immovable Property (Sec. 3 TPA)' },
    { u: 2, f: 'Topic2_Attestation_DU_Notes.html', t: 'Attestation (Sec. 3 TPA)' },
    { u: 3, f: 'Topic3_Notice_DU_Notes.html', t: 'Notice (Actual, Constructive & Agent, Sec. 3 TPA)' },
    { u: 4, f: 'Topic4_Transfer_of_Property_Sec5_DU_Notes.html', t: 'Meaning of Transfer of Property (Sec. 5 TPA)' },
    { u: 5, f: 'Topic5_Spes_Successionis_Sec6a_43_DU_Notes.html', t: 'Spes Successionis & Feeding Grant by Estoppel (Sec. 6(a) & 43)' },
    { u: 6, f: 'Topic6_Conditional_Transfer_Sec10_11_40_DU_Notes.html', t: 'Conditional Transfer & Restraints on Alienation (Sec. 10, 11, 40)' },
    { u: 7, f: 'Topic7_Unborn_Persons_Perpetuity_Sec13_18_DU_Notes.html', t: 'Transfer to Unborn Persons & Perpetuities (Sec. 13–18)' },
    { u: 8, f: 'Topic8_Vested_Contingent_Interests_Sec19_21_DU_Notes.html', t: 'Vested & Contingent Interests (Sec. 19 & 21)' },
    { u: 9, f: 'Topic9_Lis_Pendens_Sec52_DU_Notes.html', t: 'Transfer Pending Litigation — Lis Pendens (Sec. 52)' },
    { u: 10, f: 'Topic10_Mortgage_Sec58_60_100_DU_Notes.html', t: 'Mortgages & Charges (Sec. 58–60, 100)' },
    { u: 11, f: 'Topic11_Lease_and_Licence_Sec105_106_Easements_4_52_DU_Notes.html', t: 'Lease and Licence (Sec. 105, 106 & Easements)' },
    { u: 12, f: 'Topic12_Gift_Sec122_126_DU_Notes.html', t: 'Law of Gifts (Sec. 122–126)' }
  ];

  const propUnits = [];
  const propCases = [];
  const propPyqs = [];
  const propRevisions = [];

  propConfigFiles.forEach(cfg => {
    const fullPath = path.join(propFolder, cfg.f);
    const relPath = `sem 2/PROPERTY LAW/${cfg.f}`;
    const parsed = parsePropertyUnit(fullPath, relPath, cfg.u, cfg.t);
    propUnits.push(parsed.unit);
    propCases.push(...parsed.cases);
    propPyqs.push(...parsed.pyqs);
    propRevisions.push(...parsed.revisions);
    console.log(`✓ Unit ${cfg.u} (${cfg.t}): ${parsed.cases.length} cases, ${parsed.pyqs.length} PYQs`);
  });

  const propertySubject = {
    id: 'property',
    code: 'LB-204',
    name: 'Property Law (Transfer of Property Act, 1882)',
    shortName: 'Property Law (TPA)',
    semester: 2,
    folder: 'sem 2/PROPERTY LAW',
    theme: {
      primary: '#0b6e4f',
      primaryDark: '#063e2c',
      primaryLight: '#15956c',
      accent: '#d4a373',
      accentLight: '#faedcd',
      bgTint: '#f4fbf7',
      border: '#c8e6c9',
      badgeBg: '#e8f5e9',
      badgeColor: '#1b5e20',
      gradient: 'linear-gradient(135deg, #063e2c 0%, #0b6e4f 55%, #2d6a4f 100%)',
      tagline: 'Concept of Property, Fixtures, Perpetuities, Lis Pendens, Mortgages, Leases & Law of Gifts',
      motto: 'Nemo Dat Quod Non Habet • Qui Prior Est Tempore Potior Est Jure',
      quote: 'Property is an aggregate of rights, powers, privileges and immunities. — Salmond',
      icon: 'fa-landmark'
    },
    units: propUnits,
    cases: propCases,
    pyqs: propPyqs,
    revisions: propRevisions
  };

  // 2. INGEST PUBLIC INTERNATIONAL LAW (7 Topics)
  console.log('\n--- INGESTING PUBLIC INTERNATIONAL LAW (LB-205) ---');
  const pilFolder = path.join(ROOT_DIR, 'sem 2', 'PIL');
  const pilConfigFiles = [
    { u: 1, f: 'Topic1_Nature_and_Development_of_International_Law_DU_Notes.html', t: 'Nature & Development of International Law' },
    { u: 2, f: 'Topic2_Sources_of_International_Law_DU_Notes.html', t: 'Sources of International Law (Treaties, Custom, General Principles)' },
    { u: 3, f: 'Topic3_Relationship_Between_International_Law_and_Municipal_Law_DU_Notes.html', t: 'Relationship Between International Law & Municipal Law' },
    { u: 4, f: 'Topic4_State_Responsibility_DU_Notes.html', t: 'State Responsibility (Attribution, Breach & Reparation)' },
    { u: 5, f: 'Topic5_Law_of_the_Sea_DU_Notes.html', t: 'Law of the Sea (UNCLOS, Maritime Zones & Continental Shelf)' },
    { u: 6, f: 'Topic6_State_Jurisdiction_DU_Notes.html', t: 'State Jurisdiction & Extradition' },
    { u: 7, f: 'Topic7_Sovereign_Diplomatic_Consular_Immunity_DU_Notes.html', t: 'Sovereign, Diplomatic & Consular Immunity' }
  ];

  const pilUnits = [];
  const pilCases = [];
  const pilPyqs = [];
  const pilRevisions = [];

  pilConfigFiles.forEach(cfg => {
    const fullPath = path.join(pilFolder, cfg.f);
    const relPath = `sem 2/PIL/${cfg.f}`;
    const parsed = parsePilUnit(fullPath, relPath, cfg.u, cfg.t);
    pilUnits.push(parsed.unit);
    pilCases.push(...parsed.cases);
    pilPyqs.push(...parsed.pyqs);
    pilRevisions.push(...parsed.revisions);
    console.log(`✓ Unit ${cfg.u} (${cfg.t}): ${parsed.cases.length} cases, ${parsed.pyqs.length} PYQs`);
  });

  const pilSubject = {
    id: 'pil',
    code: 'LB-205',
    name: 'Public International Law',
    shortName: 'Public International Law',
    semester: 2,
    folder: 'sem 2/PIL',
    theme: {
      primary: '#0d3b66',
      primaryDark: '#051c33',
      primaryLight: '#1b5287',
      accent: '#00b4d8',
      accentLight: '#caf0f8',
      bgTint: '#f0f9ff',
      border: '#bae6fd',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      gradient: 'linear-gradient(135deg, #051c33 0%, #0d3b66 50%, #0284c7 100%)',
      tagline: 'Sources, State Responsibility, Law of the Sea, Jurisdiction & Diplomatic Immunity',
      motto: 'Pacta Sunt Servanda • Jus Cogens • Mare Liberum',
      quote: 'International law is that body of rules which are binding upon civilized states in their relations with one another. — Oppenheim',
      icon: 'fa-earth-americas'
    },
    units: pilUnits,
    cases: pilCases,
    pyqs: pilPyqs,
    revisions: pilRevisions
  };

  // 3. UPDATE REGISTRY IN DATA.JS
  console.log('\n--- UPDATING CENTRAL DATA REGISTRY ---');

  // Register subjects
  portalData.subjects['property'] = propertySubject;
  portalData.subjects['pil'] = pilSubject;

  // Update Semester 2 in portalData.semesters
  const sem2 = portalData.semesters.find(s => s.id === 2);
  if (sem2) {
    sem2.active = true;
    if (!sem2.subjectIds.includes('property')) sem2.subjectIds.push('property');
    if (!sem2.subjectIds.includes('pil')) sem2.subjectIds.push('pil');
    sem2.badge = '3 Core Subjects Loaded (BSA, Property Law, PIL)';
    sem2.description = 'Comprehensive study notes, DU landmark cases, previous year question banks, and rapid revision capsules for Law of Evidence (BSA), Property Law (TPA), and Public International Law.';
    console.log(`✓ Updated Semester II: ${sem2.subjectIds.length} subjects registered:`, sem2.subjectIds);
  }

  // Backup existing data.js
  fs.writeFileSync(DATA_FILE + '.bak', dataJsRaw, 'utf8');
  console.log(`✓ Created backup: ${DATA_FILE}.bak`);

  // Write new data.js
  const updatedContent = `// DU Law Notes Portal — Central Data Repository\n// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules\n// Comprehensive coverage across LL.B. syllabus\n\nwindow.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};\n`;
  fs.writeFileSync(DATA_FILE, updatedContent, 'utf8');

  console.log(`\n============================================================`);
  console.log(`🎉 Ingestion Complete!`);
  console.log(`  • Property Law (LB-204): ${propUnits.length} Units, ${propCases.length} Cases, ${propPyqs.length} PYQs, ${propRevisions.length} Revisions`);
  console.log(`  • Public Int Law (LB-205): ${pilUnits.length} Units, ${pilCases.length} Cases, ${pilPyqs.length} PYQs, ${pilRevisions.length} Revisions`);
  console.log(`  • New data.js size: ${(fs.statSync(DATA_FILE).size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`============================================================\n`);
}

runSemester2Ingestion();
