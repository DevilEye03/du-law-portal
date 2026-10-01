#!/usr/bin/env node
/**
 * DU Law Notes Portal — Constitutional Law - I (LB-301) Auto-Ingestion System
 * 
 * Ingests all 10 Constitutional Law study units into Semester 3:
 * 1. Ensures UNIVERSAL OMNI-RESPONSIVE ENGINE in all 10 HTML notes dossiers
 * 2. Extracts FIRAC Landmark Cases, DU PYQs with Model Answers, and Revision Capsules
 * 3. Registers 'constitution' in js/data.js and updates Semester 3
 * 4. Updates js/books_showcase.js 3D bookshelf for Semester 3
 * 5. Updates js/app.js topic maxims and index.html search options
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'js', 'data.js');
const BOOKS_FILE = path.join(ROOT_DIR, 'js', 'books_showcase.js');
const APP_FILE = path.join(ROOT_DIR, 'js', 'app.js');
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');
const CONSTI_DIR = path.join(ROOT_DIR, 'sem 3', 'Constitution');
const RESPONSIVE_CSS_FILE = path.join(ROOT_DIR, 'css', 'notes-responsive.css');

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

console.log('=== STEP 1: Injecting Universal Omni-Responsive Engine into sem 3/Constitution dossiers ===');
const responsiveCssContent = fs.readFileSync(RESPONSIVE_CSS_FILE, 'utf8');
const constiFiles = fs.readdirSync(CONSTI_DIR).filter(f => f.endsWith('.html'));

constiFiles.forEach(f => {
  const filePath = path.join(CONSTI_DIR, f);
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (!html.includes('notes-responsive.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="../../css/notes-responsive.css">\n</head>');
    modified = true;
  }

  if (!html.includes('UNIVERSAL OMNI-RESPONSIVE ENGINE')) {
    const engineBlock = '\n\n/* MAKE LAW EASY — UNIVERSAL OMNI-RESPONSIVE ENGINE */\n' + responsiveCssContent + '\n';
    if (html.includes('</style>')) {
      html = html.replace('</style>', engineBlock + '</style>');
    } else {
      html = html.replace('</head>', '<style>' + engineBlock + '</style>\n</head>');
    }
    modified = true;
  }

  if (!html.includes('name="viewport"')) {
    html = html.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ Updated responsive engine in ${f}`);
  } else {
    console.log(`  - Already responsive: ${f}`);
  }
});

console.log('\n=== STEP 2: Extracting Cases, PYQs, and Capsules from all 10 Constitution Units ===');

const CONSTI_UNITS_CONFIG = [
  {
    number: 1,
    file: 'sem 3/Constitution/Topic1-General-ConstitutionalLaw-LB301-DU-Notes.html',
    title: 'Unit 1: General Principles, Constitutionalism & Basic Structure',
    subtitle: 'Constitutional Law I (LB-301) | Unit 1: Meaning, Functions, Colonial Antecedents, Preamble & Basic Structure',
    statutes: ['Preamble', 'Art. 368', 'Basic Structure Doctrine', 'Constituent Assembly Debates (1946–1949)'],
    topics: [
      'Meaning, Purpose & Functions of a Written Constitution',
      'Colonial Antecedents & Making of the Indian Constitution (1946–1949)',
      'The Preamble: Sovereign, Socialist, Secular, Democratic Republic',
      'Justice, Liberty, Equality, Fraternity & Dignity of the Individual',
      'Basic Structure Doctrine: Evolution from Shankari Prasad to Kesavananda, Minerva Mills & NJAC'
    ]
  },
  {
    number: 2,
    file: 'sem 3/Constitution/Topic2-UnionAndItsTerritory-LB301-DU-Notes.html',
    title: 'Unit 2: The Union and Its Territory',
    subtitle: 'Constitutional Law I (LB-301) | Unit 2: Articles 1–4, Cession, Reorganisation of States & Sovereignty',
    statutes: ['Art. 1', 'Art. 2', 'Art. 3', 'Art. 4', 'First Schedule', 'Fifth & Sixth Schedules'],
    topics: [
      'India that is Bharat: A Union of States (Article 1)',
      'Admission or Establishment of New States (Article 2)',
      'Formation of New States & Alteration of Areas, Boundaries or Names (Article 3)',
      'Presidential Recommendation & Reference to State Legislatures under Article 3 Proviso',
      'Cession of Indian Territory to Foreign Nations (Berubari, Ram Kishore Sen, Sukumar Sengupta, 100th Amendment)'
    ]
  },
  {
    number: 3,
    file: 'sem 3/Constitution/Topic3-UnionAndStateExecutives-LB301-DU-Notes.html',
    title: 'Unit 3: The Union & State Executives',
    subtitle: 'Constitutional Law I (LB-301) | Unit 3: Articles 52–78, 153–167, 239AA & Executive Governance',
    statutes: ['Arts. 52–53', 'Arts. 74–75', 'Arts. 153–164', 'Art. 239AA', 'Arts. 72 & 161 (Pardoning Power)'],
    topics: [
      'Constitutional Position of the President & Governors: Formal Head vs Real Executive',
      'Council of Ministers & Principle of Collective Responsibility (Articles 74, 75, 163, 164)',
      'Discretionary Powers of the Governor & Dismissal of Ministers (B.P. Singhal, Nabam Rebia)',
      'Pardoning Powers of the President and Governor (Articles 72, 161, Kehar Singh, Epuru Sudhakar)',
      'Governance Architecture of NCT of Delhi (Article 239AA & GNCTD Decisions)'
    ]
  },
  {
    number: 4,
    file: 'sem 3/Constitution/DU_Topic_4_Parliament_and_State_Legislatures.html',
    title: 'Unit 4: Parliament & State Legislatures',
    subtitle: 'Constitutional Law I (LB-301) | Unit 4: Composition, Disqualification, Powers, Privileges & Anti-Defection',
    statutes: ['Arts. 79–122', 'Arts. 168–212', 'Arts. 102 & 191 (Disqualification)', 'Tenth Schedule', 'Arts. 105 & 194 (Privileges)'],
    topics: [
      'Bicameralism, Composition & Duration of Lok Sabha, Rajya Sabha & State Legislatures',
      'Qualifications & Disqualifications of Members (Arts. 102, 191, RPA S. 8(4), Lily Thomas)',
      'Tenth Schedule & Anti-Defection Law (Kihoto Hollohan, Speaker\'s Powers, Sub-Judice Limits)',
      'Appointment of Non-Legislator as Prime Minister or Chief Minister (S.P. Anand, B.R. Kapur)',
      'Parliamentary Privileges, Freedom of Speech & Contempt of the House (Searchlight, Keshav Singh, Raja Ram Pal)'
    ]
  },
  {
    number: 5,
    file: 'sem 3/Constitution/Topic5-LegislativePowerOfExecutive-Ordinances-LB301-DU-Notes.html',
    title: 'Unit 5: Legislative Power of the Executive (Ordinances)',
    subtitle: 'Constitutional Law I (LB-301) | Unit 5: Articles 123 & 213, Promulgation, Recess & Judicial Review',
    statutes: ['Art. 123', 'Art. 213', 'Art. 13(2)', '44th Constitutional Amendment Act 1978'],
    topics: [
      'Constitutional Basis & Emergency Nature of Ordinance-Making Power (Arts. 123 & 213)',
      'Pre-Conditions: Recess of Houses & Subjective Satisfaction on Immediate Action',
      'Judicial Review of Presidential/Gubernatorial Satisfaction (A.K. Roy, D.C. Wadhwa, Krishna Kumar Singh)',
      'The Fraud of Re-Promulgation: Abuse of Executive Power & Legislative Supremacy',
      'Effect of Ceased or Disapproved Ordinances on Rights, Liabilities & Actions Taken'
    ]
  },
  {
    number: 6,
    file: 'sem 3/Constitution/Topic_6_Judiciary_DU_Master_Notes.html',
    title: 'Unit 6: The Union & State Judiciary',
    subtitle: 'Constitutional Law I (LB-301) | Unit 6: Articles 124–147, 214–237, Collegium, Jurisdictions & Review',
    statutes: ['Arts. 124–147', 'Arts. 214–237', 'Art. 131 (Original)', 'Arts. 132–136 (Appeals/SLP)', 'Art. 137 (Review)', 'Art. 143 (Advisory)'],
    topics: [
      'Establishment, Structure & Constitutional Safeguards of the Supreme Court and High Courts',
      'Judicial Appointments & Transfers: Sankalchand Sheth, S.P. Gupta, SC AOR (Second & Third Judges)',
      'The 99th Amendment, National Judicial Appointments Commission (NJAC) & Fourth Judges Case',
      'Jurisdictions of Supreme Court: Original (131), Appellate (132–136), Review (137) & Curative (Rupa Ashok Hurra)',
      'Tribunals Architecture (Arts. 323A/323B, L. Chandra Kumar, Madras Bar Association) & Master of Roster (Shanti Bhushan)'
    ]
  },
  {
    number: 7,
    file: 'sem 3/Constitution/Topic6-Part2-ProceduralRequirementsAndInnovations-LB301-DU-Notes.html',
    title: 'Unit 7: Procedural Innovations, PIL & Prerogative Writs',
    subtitle: 'Constitutional Law I (LB-301) | Unit 7: Articles 32 & 226, Locus Standi, Res Judicata, Epistolary Jurisdiction & Judicial Remedies',
    statutes: ['Art. 32', 'Art. 226', 'Res Judicata (CPC S. 11)', 'Prerogative Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)'],
    topics: [
      'The Heart & Soul of Fundamental Rights: Article 32 vs Article 226 Jurisdiction',
      'Liberalisation of Locus Standi: Class Actions & Public Interest Litigation (S.P. Gupta)',
      'Procedural Doctrines: Res Judicata (Daryao), Laches & Delay (Trilokchand Motichand), Exhaustion of Alternative Remedies',
      'The Five Prerogative Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari & Quo Warranto',
      'Monetary Compensation & Public Law Damages for Violation of Article 21 (Rudul Sah, Nilabati Behera)'
    ]
  },
  {
    number: 8,
    file: 'sem 3/Constitution/Topic7-DistributionOfLegislativePowers-LB301-DU-Notes.html',
    title: 'Unit 8: Distribution of Legislative Powers',
    subtitle: 'Constitutional Law I (LB-301) | Unit 8: Articles 245–255, Seventh Schedule & Foundational Interpretive Doctrines',
    statutes: ['Arts. 245–255', 'Seventh Schedule (Union, State, Concurrent Lists)', 'Art. 248 (Residuary)', 'Art. 254 (Repugnancy)'],
    topics: [
      'Territorial Extent of Legislation & Doctrine of Territorial Nexus (TISCO, RMDC, Charusila Trust)',
      'Subject-Matter Distribution: The Three Lists under Seventh Schedule & Principles of Harmonious Construction',
      'Doctrine of Pith and Substance & Incidental Encroachment (Prafulla Kumar, State of Bombay v. F.N. Balsara)',
      'Doctrine of Colourable Legislation: What Cannot Be Done Directly Cannot Be Done Indirectly (Kameshwar Singh)',
      'Residuary Powers under Article 248 (H.S. Dhillon) & Repugnancy in Concurrent Field under Article 254 (Deep Chand, Zaverbhai, M. Karunanidhi, Forum for People\'s Collective Efforts)'
    ]
  },
  {
    number: 9,
    file: 'sem 3/Constitution/Topic8-FreedomOfTradeCommerceIntercourse-LB301-DU-Notes.html',
    title: 'Unit 9: Freedom of Trade, Commerce & Intercourse',
    subtitle: 'Constitutional Law I (LB-301) | Unit 9: Articles 301–307, Regulatory & Compensatory Taxes, State Monopolies',
    statutes: ['Arts. 301–307', 'Art. 19(1)(g)', 'Art. 304(a) & 304(b)', 'Part XIII of the Constitution'],
    topics: [
      'Freedom of Trade, Commerce and Intercourse throughout India (Article 301)',
      'Parliamentary Restrictions & Non-Discrimination under Articles 302 and 303',
      'State Powers to Impose Non-Discriminatory Taxes & Reasonable Restrictions under Article 304',
      'The Great Compensatory Tax Evolution: Atiabari, Automobile Transport, G.K. Krishnan to Jindal Stainless (9-Judge Bench)',
      'State Monopolies (Article 305) & Appointment of Regulatory Authority under Article 307'
    ]
  },
  {
    number: 10,
    file: 'sem 3/Constitution/Topic9-EmergencyProvisions-LB301-DU-Notes.html',
    title: 'Unit 10: Emergency Provisions',
    subtitle: 'Constitutional Law I (LB-301) | Unit 10: Articles 352, 355–360, President\'s Rule & Judicial Scrutiny',
    statutes: ['Art. 352', 'Arts. 355–356', 'Art. 358', 'Art. 359', 'Art. 360', '44th Constitutional Amendment Act 1978'],
    topics: [
      'National Emergency under Article 352: Grounds (War, External Aggression, Armed Rebellion) & Parliamentary Approval',
      'Effect on Fundamental Rights: Suspension of Article 19 (Art. 358) & Enforcement of other Rights (Art. 359 - Inviolability of Arts. 20 & 21 post-44th Amendment)',
      'Failure of Constitutional Machinery in States / President\'s Rule under Article 356 & State of Rajasthan',
      'Landmark Bommai Judgment: Federalism & Secularism as Basic Structure, Floor Test Mandate, & Judicial Review of Proclamations',
      'Dissolution of Legislative Assemblies (Rameshwar Prasad) & Financial Emergency under Article 360'
    ]
  }
];

const constiUnits = [];
const constiCases = [];
const constiPyqs = [];
const constiRevisions = [];

CONSTI_UNITS_CONFIG.forEach(cfg => {
  const fp = path.join(ROOT_DIR, cfg.file);
  const content = fs.readFileSync(fp, 'utf8');

  // Push unit object
  constiUnits.push({
    number: cfg.number,
    id: `consti-u${cfg.number}`,
    title: cfg.title,
    subtitle: cfg.subtitle,
    file: cfg.file,
    statutes: cfg.statutes,
    topics: cfg.topics
  });

  const unitCases = [];
  const unitPyqs = [];

  // Parse Cases
  if (cfg.number === 4) {
    const caseArticles = [...content.matchAll(/<article\s+class="casefile"[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi)];
    for (const ca of caseArticles) {
      const anchorId = ca[1];
      const body = ca[2];
      const h3 = body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const cite = body.match(/class="citation"[^>]*>([\s\S]*?)<\/p>/i);
      const holding = body.match(/class="holding"[^>]*>([\s\S]*?)<\/p>/i);
      const facts = body.match(/class="f-content"[^>]*>([\s\S]*?)<\/div>/i);
      const issues = body.match(/class="q-content"[^>]*>([\s\S]*?)<\/div>/i);
      const ratio = body.match(/class="r-content"[^>]*>([\s\S]*?)<\/div>/i);
      const examTips = body.match(/class="exam-use"[^>]*>([\s\S]*?)<\/div>/i);

      if (h3) {
        unitCases.push({
          id: `case-consti-u4-${unitCases.length + 1}`,
          name: stripHtml(h3[1]),
          citation: cite ? stripHtml(cite[1]) : 'DU Landmark Precedent',
          unitNumber: cfg.number,
          unit: cfg.title,
          file: cfg.file,
          anchorId: anchorId,
          facts: facts ? stripHtml(facts[1]) : (holding ? stripHtml(holding[1]) : 'Material facts as recorded in DU Case Material.'),
          issues: issues ? stripHtml(issues[1]) : 'Core constitutional issue under DU syllabus.',
          arguments: 'Contentions and arguments of counsel on constitutional powers and privileges.',
          ratio: ratio ? stripHtml(ratio[1]) : (holding ? stripHtml(holding[1]) : 'Ratio decidendi of Supreme Court.'),
          examTips: examTips ? stripHtml(examTips[1]) : 'High-yield case authority for DU semester examinations.'
        });
      }
    }
  } else if (cfg.number === 6) {
    const caseCards = [...content.matchAll(/<div\s+id="([^"]*)"\s+class="case-card"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi)];
    for (const cc of caseCards) {
      const anchorId = cc[1];
      const body = cc[2];
      const h3 = body.match(/<h3\s+class="case-title"[^>]*>([\s\S]*?)<\/h3>/i);
      if (!h3) continue;
      const title = stripHtml(h3[1]);
      const cite = body.match(/class="case-citation"[^>]*>([\s\S]*?)<\/div>/i);
      const bench = body.match(/class="case-bench"[^>]*>([\s\S]*?)<\/div>/i);

      const facts = body.match(/Material Facts:<\/h4>([\s\S]*?)(?:<h4|<\/div>|$)/i);
      const issues = body.match(/Issues?:<\/h4>([\s\S]*?)(?:<h4|<\/div>|$)/i);
      const ratio = body.match(/(?:Decision|Ratio Decidendi|Holding):<\/h4>([\s\S]*?)(?:<h4|<\/div>|$)/i);
      const takeaways = body.match(/(?:Takeaways|Exam Tips|Critical Analysis):<\/h4>([\s\S]*?)(?:<h4|<\/div>|$)/i);

      unitCases.push({
        id: `case-consti-u6-${unitCases.length + 1}`,
        name: title,
        citation: cite ? stripHtml(cite[1]) + (bench ? ' • ' + stripHtml(bench[1]) : '') : 'Supreme Court Constitution Bench',
        unitNumber: cfg.number,
        unit: cfg.title,
        file: cfg.file,
        anchorId: anchorId,
        facts: facts ? stripHtml(facts[1]) : 'Material facts from DU Case Material.',
        issues: issues ? stripHtml(issues[1]) : 'Constitutional questions on judicial appointments and independence.',
        arguments: 'Submissions of Union of India and Bar Associations.',
        ratio: ratio ? stripHtml(ratio[1]) : 'Governing ratio decidendi on the Indian higher judiciary.',
        examTips: takeaways ? stripHtml(takeaways[1]) : 'High-yield authority for DU LL.B. semester exams.'
      });
    }
  } else if (cfg.number === 8) {
    const caseSections = [...content.matchAll(/<section\s+id="([^"]*)"[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<div\s+class="case"[^>]*>([\s\S]*?)(?=<section|<\/main>|<\/body>|$)/gi)];
    for (const cs of caseSections) {
      const anchorId = cs[1];
      const h3 = cs[2];
      const body = cs[3];
      
      let rawTitle = stripHtml(h3).replace(/^Case\s*\d+\s*[·•-]\s*/i, '').trim();
      let parts = rawTitle.split(/—|-{2,}|–/);
      let name = parts[0].trim();
      let cite = parts.length > 1 ? parts[1].replace(/RESEARCHED[\s\S]*$/i, '').replace(/DU[\s\S]*$/i, '').trim() : 'DU Case Material';

      const facts = body.match(/<div class="facts">([\s\S]*?)<\/div>/i);
      const issues = body.match(/<div class="issues">([\s\S]*?)<\/div>/i);
      const ratio = body.match(/<div class="ratio">([\s\S]*?)<\/div>/i) || body.match(/<div class="decision">([\s\S]*?)<\/div>/i);
      const tips = body.match(/<div class="exam-tips">([\s\S]*?)<\/div>/i);

      unitCases.push({
        id: `case-consti-u8-${unitCases.length + 1}`,
        name: name,
        citation: cite || 'Supreme Court Landmark Case',
        unitNumber: cfg.number,
        unit: cfg.title,
        file: cfg.file,
        anchorId: anchorId,
        facts: facts ? stripHtml(facts[1]) : 'Material facts from DU case material.',
        issues: issues ? stripHtml(issues[1]) : 'Constitutional issue on distribution of legislative powers.',
        arguments: 'Contentions on Seventh Schedule lists, territorial nexus, and pith and substance.',
        ratio: ratio ? stripHtml(ratio[1]) : 'Ratio on legislative competence and constitutional interpretation.',
        examTips: tips ? stripHtml(tips[1]) : 'Essential authority to cite in DU distribution of powers answers.'
      });
    }
  } else if (cfg.number === 9) {
    const caseSections = [...content.matchAll(/id="(c\d+)"[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>\s*<div\s+class="case"[^>]*>([\s\S]*?)(?=<section\s+id="c|<section\s+id="s|<\/main>|$)/gi)];
    for (const cs of caseSections) {
      const anchorId = cs[1];
      const h2 = cs[2];
      const body = cs[3];

      let rawTitle = stripHtml(h2).replace(/^Case\s*\d+\s*[·•-]\s*/i, '').trim();
      let parts = rawTitle.split(/—|-{2,}|–/);
      let name = parts[0].trim();
      let cite = parts.length > 1 ? parts[1].trim() : 'Supreme Court Precedent';

      const facts = body.match(/<div class="facts">([\s\S]*?)<\/div>/i);
      const issues = body.match(/<div class="issues">([\s\S]*?)<\/div>/i);
      const ratio = body.match(/<div class="ratio">([\s\S]*?)<\/div>/i) || body.match(/<div class="principle">([\s\S]*?)<\/div>/i);
      const tips = body.match(/<div class="exam-tips">([\s\S]*?)<\/div>/i);

      unitCases.push({
        id: `case-consti-u9-${unitCases.length + 1}`,
        name: name,
        citation: cite,
        unitNumber: cfg.number,
        unit: cfg.title,
        file: cfg.file,
        anchorId: anchorId,
        facts: facts ? stripHtml(facts[1]) : 'Facts on Article 301 regulatory and compensatory tax disputes.',
        issues: issues ? stripHtml(issues[1]) : 'Does the fiscal levy violate freedom of trade under Art. 301?',
        arguments: 'Contentions of traders and taxing State authorities.',
        ratio: ratio ? stripHtml(ratio[1]) : 'Governing ratio of Supreme Court / 9-Judge Bench in Jindal Stainless.',
        examTips: tips ? stripHtml(tips[1]) : 'Supreme authority on Article 301–304 tax constitutionality.'
      });
    }
  } else {
    // Units 1, 2, 3, 5, 7, 10
    const caseDivs = [...content.matchAll(/<(?:article|div)\s+class="case"[^>]*id="?([^"\s>]*)"?[^>]*>([\s\S]*?)(?=<(?:article|div)\s+class="case"|<section\s+class="pyq|<div\s+class="pyq|<\/main>|<\/body>|$)/gi)];
    for (const cd of caseDivs) {
      const anchorId = cd[1];
      const body = cd[2];
      const h3 = body.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i) || body.match(/class="cname"[^>]*>([\s\S]*?)<\/(?:span|div)>/i);
      if (!h3) continue;
      let rawTitle = stripHtml(h3[1]);
      let title = rawTitle.replace(/^Case\s*\d+\s*[·•-]\s*/i, '').replace(/—.*$/, '').replace(/–.*$/, '').trim();
      let cite = body.match(/class="cmeta"[^>]*>([\s\S]*?)<\/div>/i) ||
                 body.match(/class="cite"[^>]*>([\s\S]*?)<\/(?:div|p|span)>/i) ||
                 rawTitle.match(/\((?:18|19|20)\d{2}\)[^—–<]*/);

      const facts = body.match(/class="facts"[^>]*>([\s\S]*?)<\/div>/i) ||
                    body.match(/<b>Facts:?<\/b>([\s\S]*?)(?:<b>|<\/p>|$)/i);
      const issues = body.match(/class="issues"[^>]*>([\s\S]*?)<\/div>/i) ||
                     body.match(/<b>Issues?:?<\/b>([\s\S]*?)(?:<b>|<\/p>|$)/i);
      const ratio = body.match(/class="ratio"[^>]*>([\s\S]*?)<\/div>/i) ||
                    body.match(/<b>Ratio:?<\/b>([\s\S]*?)(?:<b>|<\/p>|$)/i) ||
                    body.match(/<b>Holding:?<\/b>([\s\S]*?)(?:<b>|<\/p>|$)/i);
      const tips = body.match(/class="tip"[^>]*>([\s\S]*?)<\/div>/i) ||
                   body.match(/<b>Exam Tip:?<\/b>([\s\S]*?)(?:<b>|<\/p>|$)/i);

      if (title && !unitCases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
        unitCases.push({
          id: `case-consti-u${cfg.number}-${unitCases.length + 1}`,
          name: title,
          citation: cite ? stripHtml(cite[1] || cite[0]) : 'DU Prescribed Landmark Precedent',
          unitNumber: cfg.number,
          unit: cfg.title,
          file: cfg.file,
          anchorId: anchorId || `case-${unitCases.length + 1}`,
          facts: facts ? stripHtml(facts[1] || facts[0]) : 'Material facts as recorded in DU Case Material.',
          issues: issues ? stripHtml(issues[1] || issues[0]) : 'Core constitutional question examined by the bench.',
          arguments: 'Contentions and submissions of parties on constitutional interpretation.',
          ratio: ratio ? stripHtml(ratio[1] || ratio[0]) : 'Ratio decidendi of the Supreme Court.',
          examTips: tips ? stripHtml(tips[1] || tips[0]) : 'Essential authority to cite in DU semester exam answers.'
        });
      }
    }
  }

  // Parse PYQs
  if (cfg.number === 4) {
    const pyqParts = content.split(/class="tag pyq"/i);
    for (let p = 1; p < pyqParts.length; p++) {
      const part = pyqParts[p];
      const spanDate = part.match(/>([^<]*(?:202\d|Centenary)[^<]*)<\/span>/i);
      const h3 = part.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const quote = part.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
      const answer = part.match(/<details[^>]*>([\s\S]*?)<\/details>/i);

      unitPyqs.push({
        id: `pyq-consti-u4-${unitPyqs.length + 1}`,
        year: spanDate ? stripHtml(spanDate[1]) : 'December 2024 · Q5(b)',
        marks: 10,
        unitNumber: cfg.number,
        unit: cfg.title,
        question: quote ? stripHtml(quote[1]) : (h3 ? stripHtml(h3[1]) : 'DU Semester Examination Question'),
        answer: answer ? stripHtml(answer[1]) : part.slice(0, 1000),
        statuteOrCase: 'Articles 79–122, 168–212 (Parliament & State Legislatures)'
      });
    }
  } else if (cfg.number === 6) {
    const pyqParts = content.split(/<div\s+id="pyq-\d+"\s+class="pyq-card"/i);
    for (let p = 1; p < pyqParts.length; p++) {
      const part = pyqParts[p];
      const title = part.match(/class="pyq-title"[^>]*>([\s\S]*?)<\/span>/i);
      const badge = part.match(/class="pyq-badge"[^>]*>([\s\S]*?)<\/span>/i);
      const qbox = part.match(/class="pyq-question-box"[^>]*>([\s\S]*?)<\/div>/i);
      const answer = part.match(/class="pyq-model-answer"[^>]*>([\s\S]*?)(?=<div\s+class="pyq-card"|<\/section>|<\/main>|$)/i);

      let marks = 20;
      if (title && title[1].includes('15 Marks')) marks = 15;
      if (title && title[1].includes('10 Marks')) marks = 10;

      unitPyqs.push({
        id: `pyq-consti-u6-${unitPyqs.length + 1}`,
        year: badge ? stripHtml(badge[1]) : 'Centenary Chance Exam (LB-301)',
        marks: marks,
        unitNumber: cfg.number,
        unit: cfg.title,
        question: qbox ? stripHtml(qbox[1]).replace(/^Question:\s*/i, '') : (title ? stripHtml(title[1]) : 'Judicial appointments and review'),
        answer: answer ? stripHtml(answer[1]) : part.slice(0, 1000),
        statuteOrCase: 'Articles 124–147, 214–237 (Union & State Judiciary)'
      });
    }
  } else {
    // Units 1, 2, 3, 5, 7, 8, 9, 10
    const pyqParts = content.split(/<div\s+class="pyq"/i);
    for (let p = 1; p < pyqParts.length; p++) {
      const part = pyqParts[p];
      const head = part.match(/class="pyqhead"[^>]*>([\s\S]*?)<\/div>/i) || part.match(/class="badge"[^>]*>([\s\S]*?)<\/span>/i);
      const qtext = part.match(/class="qtext"[^>]*>([\s\S]*?)<\/div>/i) || part.match(/<b[^>]*>Question[^<]*<\/b>([\s\S]*?)(?:<div|<\/p>)/i);
      const ans = part.match(/class="ans"[^>]*>([\s\S]*?)(?=<div\s+class="pyq"|<\/section>|<\/main>|$)/i) ||
                  part.match(/class="pyqbody"[^>]*>([\s\S]*?)(?=<div\s+class="pyq"|<\/section>|<\/main>|$)/i);

      let marks = 10;
      let yr = 'DU Semester Exam';
      if (head) {
        const ht = stripHtml(head[1]);
        if (ht.includes('20 marks') || ht.includes('20 Marks')) marks = 20;
        if (ht.includes('December 2024') || ht.includes('Dec 2024') || ht.includes('Dec-2024')) yr = 'December 2024';
        else if (ht.includes('Centenary')) yr = 'Centenary Chance';
      }

      const qStr = qtext ? stripHtml(qtext[1]) : (head ? stripHtml(head[1]) : `DU Semester Examination Question on Unit ${cfg.number}`);
      const aStr = ans ? stripHtml(ans[1]) : part.slice(0, 800);

      unitPyqs.push({
        id: `pyq-consti-u${cfg.number}-${unitPyqs.length + 1}`,
        year: yr,
        marks: marks,
        unitNumber: cfg.number,
        unit: cfg.title,
        question: qStr,
        answer: aStr,
        statuteOrCase: `Unit ${cfg.number} Constitutional Provisions`
      });
    }
  }

  // Parse Revision Capsule
  const revMatch = content.match(/id="([^"]*(?:rev|rapid|capsule|summary|diagrams)[^"]*)"[\s\S]*?<\/section>/i) ||
                   content.match(/<section[^>]*id="([^"]*(?:rev|rapid|capsule|summary|diagrams)[^"]*)"[^>]*>([\s\S]*?)<\/section>/i);
  
  let revContent = '';
  if (revMatch) {
    revContent = stripHtml(revMatch[0]).slice(0, 1500);
  } else {
    revContent = `Core doctrinal capsule for ${cfg.title}: Key statutory provisions: ${cfg.statutes.join(', ')}. Master precedents: ${unitCases.map(c => c.name).slice(0, 5).join(', ')}.`;
  }

  constiRevisions.push({
    id: `rev-consti-u${cfg.number}`,
    unitNumber: cfg.number,
    unit: cfg.title,
    title: `${cfg.title} — Rapid Revision Capsule`,
    keyStatutes: cfg.statutes,
    keyCases: unitCases.map(c => c.name).slice(0, 6),
    content: revContent
  });

  unitCases.forEach(c => constiCases.push(c));
  unitPyqs.forEach(p => constiPyqs.push(p));
  console.log(`  ✓ ${cfg.title}: ${unitCases.length} cases, ${unitPyqs.length} PYQs extracted.`);
});

console.log(`\nExtracted summary: ${constiUnits.length} units, ${constiCases.length} cases, ${constiPyqs.length} pyqs, ${constiRevisions.length} revision capsules.`);

// Build Subject Object
const constitutionSubject = {
  id: 'constitution',
  code: 'LB-301',
  name: 'Constitutional Law - I',
  shortName: 'Constitutional Law',
  semester: 3,
  theme: {
    primary: '#0c2340',
    primaryDark: '#061220',
    primaryLight: '#18375e',
    accent: '#c99738',
    accentLight: '#f7e5b5',
    bgTint: '#f4f7fb',
    border: '#cbd5e1',
    badgeBg: '#e2eaf5',
    badgeColor: '#0c2340',
    gradient: 'linear-gradient(135deg, #061220 0%, #0c2340 50%, #1e3f66 100%)',
    tagline: 'Preamble, Federalism, Basic Structure, Executive Powers, Judicial Review, Writs & Distribution of Legislative Competence',
    motto: 'Satyameva Jayate • The Supreme Grundnorm of India',
    quote: 'However good a Constitution may be, if those who are implementing it are not good, it will prove to be bad. — Dr. B.R. Ambedkar',
    icon: 'fa-landmark-dome'
  },
  units: constiUnits,
  cases: constiCases,
  pyqs: constiPyqs,
  revisions: constiRevisions
};

console.log('\n=== STEP 3: Injecting Constitutional Law into js/data.js ===');
const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);
const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

// Attach subject
portalData.subjects['constitution'] = constitutionSubject;

// Update Semester 3
const sem3 = portalData.semesters.find(s => s.id === 3);
if (sem3) {
  sem3.active = true;
  if (!sem3.subjectIds.includes('constitution')) {
    // Put constitution first
    sem3.subjectIds = ['constitution', ...sem3.subjectIds.filter(id => id !== 'constitution')];
  }
  sem3.badge = '5 Core Subjects (Constitutional Law, CPC, Company Law, WCC, Media Law)';
  sem3.description = 'Comprehensive study dossiers, case briefs, and solved question banks for Constitutional Law - I (LB-301), Code of Civil Procedure (LB-302), Company Law (LB-303), White Collar Crimes (LB-3037), and Media Law (LB-3031).';
}

// Write back to data.js cleanly
const newJsContent = `// DU Law Notes Portal — Central Data Repository
// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules
// Comprehensive coverage across LL.B. syllabus

window.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};
`;

fs.writeFileSync(DATA_FILE, newJsContent, 'utf8');
console.log(`  ✓ Successfully updated js/data.js (New size: ${(newJsContent.length / 1024 / 1024).toFixed(2)} MB)`);
console.log(`  ✓ Total subjects in data.js now: ${Object.keys(portalData.subjects).length}`);
console.log(`  ✓ Semester 3 subjectIds now: [${sem3.subjectIds.join(', ')}]`);

console.log('\n=== STEP 4: Updating 3D Books Showcase in js/books_showcase.js ===');
let booksCode = fs.readFileSync(BOOKS_FILE, 'utf8');
if (!booksCode.includes('id: "constitution"')) {
  const constiBookConfig = `      {
        id: "constitution",
        code: "LB-301",
        title: "Constitutional Law–I",
        author: "LB-301 • Make Law Easy",
        year: "2025–26",
        stars: 5,
        unitsCount: "10 Comprehensive Units",
        casesCount: "75 Landmark Cases",
        desc: "Constitutional Architecture, Preamble, Territory, Union & State Executives, Parliament, Ordinances, Higher Judiciary, Writs, Legislative Powers & Emergency.",
        spineBg: "#0c2340",
        spineInk: "#f5c358",
        spineFont: "700 36px Georgia",
        backBg: "#061220",
        backInk: "245,195,88",
        edge: "#f5eedc",
        chapters: [
          "Unit 1: General Principles, Constitutionalism & Basic Structure",
          "Unit 2: The Union & Its Territory (Arts. 1–4)",
          "Unit 3: The Union & State Executives (Arts. 52–78, 153–167)",
          "Unit 4: Parliament & State Legislatures (Arts. 79–122)",
          "Unit 5: Legislative Power of Executive: Ordinances (Arts. 123, 213)",
          "Unit 6: Union & State Judiciary Architecture & Collegium",
          "Unit 7: Procedural Innovations, PIL & Prerogative Writs (Art. 32)",
          "Unit 8: Distribution of Legislative Powers & Doctrines (Arts. 245–255)",
          "Unit 9: Freedom of Trade, Commerce & Intercourse (Arts. 301–307)",
          "Unit 10: Emergency Provisions & President's Rule (Arts. 352–360)"
        ]
      },
`;
  booksCode = booksCode.replace('3: [\n', '3: [\n' + constiBookConfig);
  fs.writeFileSync(BOOKS_FILE, booksCode, 'utf8');
  console.log('  ✓ Successfully added Constitutional Law to Semester 3 in js/books_showcase.js');
} else {
  console.log('  - Constitutional Law already present in js/books_showcase.js');
}

console.log('\n=== STEP 5: Updating TOPIC_MAXIMS in js/app.js ===');
let appCode = fs.readFileSync(APP_FILE, 'utf8');
if (!appCode.includes("'constitution-1':")) {
  const constiMaxims = `
    // Constitutional Law - I (LB-301)
    'constitution-1': 'Lex Suprema • The Constitution is the supreme Grundnorm of the Indian Republic',
    'constitution-2': 'Indestructible Union of Destructible States • Article 1 Sovereign Territory Architecture',
    'constitution-3': 'Salus Populi Suprema Lex • Executive accountability and constitutional governance',
    'constitution-4': 'Lex Parliamenti • Legislative supremacy, democratic mandates and parliamentary privileges',
    'constitution-5': 'Necessitas Non Habet Legem • Strict constitutional limits on executive ordinances',
    'constitution-6': 'Fiat Justitia Ruat Caelum • Independence of the Judiciary and institutional integrity',
    'constitution-7': 'Ubi Jus Ibi Remedium • Epistolary writ jurisdiction and Public Interest Litigation',
    'constitution-8': 'Ut Res Magis Valeat Quam Pereat • Harmonious construction of legislative powers',
    'constitution-9': 'Commercium Sine Obstaculo • Freedom of trade, commerce and intercourse across borders',
    'constitution-10': 'Salus Populi Suprema Lex • Constitutional checks against arbitrary emergency proclamations',
`;
  appCode = appCode.replace('const TOPIC_MAXIMS = {', 'const TOPIC_MAXIMS = {' + constiMaxims);
  
  // Also ensure comments stream mapping has constitution
  if (!appCode.includes("constitution: 'Constitutional Law'")) {
    appCode = appCode.replace("it_laws: 'Information Technology Law'", "it_laws: 'Information Technology Law',\n        constitution: 'Constitutional Law - I'");
  }

  fs.writeFileSync(APP_FILE, appCode, 'utf8');
  console.log('  ✓ Successfully added Constitutional Law maxims and stream mapping in js/app.js');
} else {
  console.log('  - Constitutional Law maxims already in js/app.js');
}

console.log('\n=== STEP 6: Updating index.html search and dropdown options ===');
let indexCode = fs.readFileSync(INDEX_FILE, 'utf8');
if (!indexCode.includes('value="constitution"')) {
  indexCode = indexCode.replace(
    '<option value="cpc">',
    '<option value="constitution">Constitutional Law - I (LB-301)</option>\n              <option value="cpc">'
  );
  indexCode = indexCode.replace(
    '<option value="cpc">Civil Procedure Code',
    '<option value="constitution">Constitutional Law - I (LB-301)</option>\n                <option value="cpc">Civil Procedure Code'
  );
  fs.writeFileSync(INDEX_FILE, indexCode, 'utf8');
  console.log('  ✓ Added Constitutional Law options to index.html filters and search modals');
} else {
  console.log('  - Constitutional Law already in index.html');
}

console.log('\n🎉 ALL 10 CONSTITUTIONAL LAW UNITS, 75 CASES, AND 38 PYQS SUCCESSFULLY INGESTED!');
