const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'js', 'data.js');
const TAX_DIR = path.join(ROOT_DIR, 'SEM 5', 'Taxation');

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

const TAX_UNITS_CONFIG = [
  {
    number: 1,
    file: 'SEM 5/Taxation/Topic1_Introduction_Taxation_Law_DU.html',
    title: 'Unit 1: Introduction, Basic Concepts & Income Definition',
    subtitle: 'Basic Concepts, Art. 265, S. 2(24) Income, Diversion vs Application, Capital vs Revenue Receipts | DU LL.B. LB-505',
    statutes: ['Art. 265 Constitution', 'S. 2(24) Income-tax Act', 'S. 4 Charge of Tax', 'S. 2(7) Assessee', 'S. 2(9) Assessment Year', 'S. 3 Previous Year', 'S. 10(3) Winnings'],
    topics: [
      'Constitutional Architecture of Tax under Article 265 & Entry 82 List I',
      'Concept of Tax vs Fee vs Cess vs Surcharge',
      'Section 2(24) Inclusive Definition of Income (Karthikeyan)',
      'Diversion of Income by Overriding Title vs Application of Income (Sitaldas, Kinariwala)',
      'Capital Receipts vs Revenue Receipts & Salami (Sindhurani, Empire Jute)'
    ],
    revAnchor: 's10'
  },
  {
    number: 2,
    file: 'SEM 5/Taxation/Topic2_Agricultural_Income_DU.html',
    title: 'Unit 2: Agricultural Income & Partial Integration',
    subtitle: 'Agricultural Income Definition [s. 2(1A)], Exemption [s. 10(1)], Agro-Industries & Partial Integration | DU LL.B. LB-505',
    statutes: ['Art. 366(1) Constitution', 'S. 2(1A) Income-tax Act', 'S. 10(1) Exemption', 'Rule 7, 7A, 7B, 8 (Rules 1962)', 'Finance Act Partial Integration Scheme'],
    topics: [
      'Definition of Agricultural Income under Section 2(1A) & Exemption under Section 10(1)',
      'The Test of Agriculture: Basic & Subsequent Operations (Benoy Kumar Sahas Roy)',
      'Dividend from Tea/Agricultural Company: Agrarian vs Dividend Character (Bacha F. Guzdar)',
      'Managing Agency Commission from Agricultural Companies (Premier Construction)',
      'Standing Crops, Fruits on Trees & Produce Purchased for Resale (Maddi Venkatasubbayya, Sakarlal Naranlal)',
      'Partial Integration of Agricultural and Non-Agricultural Income'
    ],
    revAnchor: 's10'
  },
  {
    number: 3,
    file: 'SEM 5/Taxation/Topic3_Residence_and_Scope_of_Total_Income_DU.html',
    title: 'Unit 3: Residence and Scope of Total Income',
    subtitle: 'Residential Status [s. 6], Scope of Total Income [s. 5], Income Deemed to Accrue or Arise [s. 9] | DU LL.B. LB-505',
    statutes: ['S. 4 Charge of Income Tax', 'S. 5 Scope of Total Income', 'S. 6 Residence in India', 'S. 9 Income Deemed to Accrue or Arise', 'S. 9(1)(i) Business Connection', 'POEM (Place of Effective Management)'],
    topics: [
      'Residential Status of Individual: Basic Conditions & Secondary Conditions (S. 6(1), S. 6(6))',
      'Residential Status of Hindu Undivided Family (HUF) & Control and Management (Subbayya Chettiar)',
      'Residential Status of Companies & Control and Management / POEM (Narottam & Parekh)',
      'Scope of Total Income under Section 5: ROR, RNOR, and Non-Resident Matrix',
      'Income Deemed to Accrue or Arise in India under Section 9(1)(i) & Business Connection',
      'Offshore Share Transfers & Nexus: The Landmark Ruling in Vodafone International Holdings'
    ],
    revAnchor: 's11'
  },
  {
    number: 4,
    file: 'SEM 5/Taxation/Topic4_Heads_of_Income_DU.html',
    title: 'Unit 4: Heads of Income (Salaries, House Property, PGBP, Capital Gains & Other Sources)',
    subtitle: 'Computation under the Five Heads of Income [Sections 14 to 59] | DU LL.B. LB-505',
    statutes: ['S. 14 Heads of Income', 'Ss. 15–17 Salaries', 'Ss. 22–27 House Property', 'Ss. 28–44DB PGBP', 'Ss. 45–55A Capital Gains', 'Ss. 56–59 Other Sources', 'S. 37(1) General Deduction', 'S. 54 Capital Gains Exemptions'],
    topics: [
      'Head A: Salaries — Master-Servant Relationship, Chargeability under S. 15, Perquisites (Ram Pershad, L.W. Russel)',
      'Head B: Income from House Property — Annual Value, Beneficial Ownership, Trust Properties (Biman Behari, East India Housing, Jodhamal Kuthiala)',
      'Head C: Profits and Gains of Business or Profession — S. 28, S. 37(1) Deductions, Capital vs Revenue Expenditure (Mysore Kirloskar, Travancore Sugars, Empire Jute, L.B. Sugar, Bikaner Gypsums)',
      'Head D: Capital Gains — Transfer under S. 2(47), Capital Asset, Computation under S. 48, Liquidation of Company & Cost of Acquisition (General Insurance Corp, Bagavathy Ammal)',
      'Head E: Income from Other Sources — S. 56(1) Residuary Scope & S. 57(iii) Deductions (Rajendra Prasad Moody)'
    ],
    revAnchor: 's10'
  },
  {
    number: 5,
    file: 'SEM 5/Taxation/Topic5_Clubbing_of_Income_DU.html',
    title: 'Unit 5: Income of Other Persons Included in Assessee\'s Total Income (Clubbing)',
    subtitle: 'Revocable Transfers, Spouse Remuneration, Transferred Assets to Spouse/Daughter-in-law & Minor Child [ss. 60–64] | DU LL.B. LB-505',
    statutes: ['S. 60 Transfer of Income without Transfer of Assets', 'Ss. 61–63 Revocable Transfer of Assets', 'S. 64(1)(ii) Spouse Remuneration', 'S. 64(1)(iv) Asset Transfer to Spouse', 'S. 64(1)(vi) Transfer to Son\'s Wife', 'S. 64(1A) Clubbing of Minor\'s Income'],
    topics: [
      'General Principle against Income Splitting & Legislative Architecture of Sections 60 to 65',
      'Transfer of Income without Asset (S. 60) and Revocable Transfers (Ss. 61–63)',
      'Clubbing of Remuneration of Spouse from Concern with Substantial Interest (S. 64(1)(ii)) & Technical Qualification Proviso (Batta Kalyani, J.M. Mokashi)',
      'Direct or Indirect Asset Transfers to Spouse: Agreement to Live Apart vs Inadequate Consideration (Philip John Plasket Thomas)',
      'Cross-Transfers, Transfers through Intermediary & Indirect Accretion of Income (Mohini Thapar)',
      'Clubbing of Minor Child\'s Income under S. 64(1A) & Statutory Exceptions'
    ],
    revAnchor: 's13'
  },
  {
    number: 6,
    file: 'SEM 5/Taxation/Topic6_Best_Judgment_and_Escaping_Assessment_DU.html',
    title: 'Unit 6: Assessment: Best Judgment Assessment & Income Escaping Assessment',
    subtitle: 'Return of Income [s. 139], Best Judgment Assessment [s. 144], Income Escaping Assessment [ss. 147–153] | DU LL.B. LB-505',
    statutes: ['S. 139 Return of Income', 'S. 142 Inquiry before Assessment', 'S. 143 Summary & Scrutiny Assessment', 'S. 144 Best Judgment Assessment', 'S. 147 Income Escaping Assessment', 'S. 148 Issue of Notice', 'S. 148A Inquiry & Show Cause', 'S. 151 Sanction for Reopening'],
    topics: [
      'Scheme of Assessment under Income-tax Act: Self-Assessment (S. 140A), Summary (S. 143(1)), Scrutiny (S. 143(3))',
      'Best Judgment Assessment under Section 144: Grounds, Scope & Arbitrariness Ban (State of Kerala v. C. Velukutty)',
      'Income Escaping Assessment under Section 147: Jurisdictional Conditions Precedent & Reason to Believe',
      'Duty of Assessee to Disclose Primary Facts vs Inference of Assessing Officer: Change of Opinion Bar (Burlop Dealers, Gemini Leather Stores)',
      'Requirement of Tangible Material and Direct Live Nexus (Lakhmani Mewal Das)',
      'Full and True Disclosure of Material Facts & Fresh Reopening Justification (Srikrishna (P) Ltd.)',
      'Procedural Safeguards under Post-2021 Regime: Section 148A Show Cause and Order before Notice'
    ],
    revAnchor: 's13'
  }
];

function extractCasesFromNote(content, fileRel, unitNumber, unitTitle) {
  const cases = [];
  const tagRegex = /<div class="case"[^>]*>/gi;
  let m;
  let cCount = 0;

  while ((m = tagRegex.exec(content)) !== null) {
    cCount++;
    const startIdx = m.index;
    const tag = m[0];
    const idOnTag = (tag.match(/id="([^"]+)"/) || [])[1];

    // Find balanced div
    let depth = 1;
    let endIdx = content.length;
    const divScan = /<\/?div\b[^>]*>/gi;
    divScan.lastIndex = startIdx + tag.length;
    let dm;
    while ((dm = divScan.exec(content)) !== null) {
      if (dm[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          endIdx = dm.index;
          break;
        }
      } else {
        depth++;
      }
    }
    const caseHtml = content.slice(startIdx + tag.length, endIdx);

    // Anchor ID
    let anchorId = idOnTag;
    if (!anchorId) {
      const pre = content.slice(Math.max(0, startIdx - 300), startIdx);
      const preId = pre.match(/id="([^"]+)"/);
      anchorId = preId ? preId[1] : `tax-c-u${unitNumber}-${cCount}`;
    }

    // Title & Citation
    const titleMatch = caseHtml.match(/<p class="ctitle">([\s\S]*?)<\/p>/i);
    const citeMatch = caseHtml.match(/<div class="ccite">([\s\S]*?)<\/div>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : `Taxation Case U${unitNumber}-${cCount}`;
    const citation = citeMatch ? stripHtml(citeMatch[1]) : '';

    // FIRAC blocks
    function getBlk(cls) {
      const reg = new RegExp(`<div class="cblk\\s+${cls}"[^>]*>([\\s\\S]*?)(?=<div class="cblk|<\\/div>\\s*<\\/div>|$)`, 'i');
      const bm = caseHtml.match(reg);
      if (!bm) return '';
      return bm[1].replace(/<span class="lbl">[\s\S]*?<\/span>/i, '').trim();
    }

    const facts = getBlk('facts');
    const issues = getBlk('issue');
    const arguments = getBlk('args');
    const held = getBlk('held');
    const ratio = getBlk('ratio') || held;
    const signif = getBlk('signif');

    let principleEvolved = '';
    if (ratio && signif) {
      principleEvolved = `<div><strong>Ratio Decidendi:</strong> ${ratio}</div><hr><div><strong>Significance & Principles:</strong> ${signif}</div>`;
    } else {
      principleEvolved = signif || ratio;
    }

    const examTips = signif || '';

    cases.push({
      id: anchorId,
      name: title,
      citation: citation,
      unitNumber: unitNumber,
      unit: unitTitle,
      file: fileRel,
      anchorId: anchorId,
      facts: facts || '<p>Detailed case facts digested in full study notes.</p>',
      issues: issues || '<p>Constitutional and statutory issues on taxation principles.</p>',
      arguments: arguments || '<p>Submissions of Revenue and Assessee analyzed in notes.</p>',
      ratio: ratio || '<p>Ratio decidendi established by Supreme Court.</p>',
      principleEvolved: principleEvolved || '<p>Landmark rule of taxation law.</p>',
      examTips: examTips
    });
  }

  return cases;
}

function extractPyqsFromNote(content, fileRel, unitNumber, unitTitle) {
  const pyqs = [];
  const tagRegex = /<div class="pyq"[^>]*>/gi;
  let m;
  let qCount = 0;

  while ((m = tagRegex.exec(content)) !== null) {
    qCount++;
    const startIdx = m.index;
    const tag = m[0];
    const idOnTag = (tag.match(/id="([^"]+)"/) || [])[1];

    let depth = 1;
    let endIdx = content.length;
    const divScan = /<\/?div\b[^>]*>/gi;
    divScan.lastIndex = startIdx + tag.length;
    let dm;
    while ((dm = divScan.exec(content)) !== null) {
      if (dm[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          endIdx = dm.index;
          break;
        }
      } else {
        depth++;
      }
    }
    const pyqHtml = content.slice(startIdx + tag.length, endIdx);

    let anchorId = idOnTag;
    if (!anchorId) {
      const pre = content.slice(Math.max(0, startIdx - 300), startIdx);
      const preId = pre.match(/id="([^"]+)"/);
      anchorId = preId ? preId[1] : `tax-pyq-u${unitNumber}-${qCount}`;
    }

    const tagrow = (pyqHtml.match(/<div class="tagrow">([\s\S]*?)<\/div>/i) || [])[1] || '';
    const tagsText = stripHtml(tagrow);

    const yearMatch = tagsText.match(/20\d\d/) || ['2024'];
    const marksMatch = tagsText.match(/(\d+)\s*marks/i) || tagsText.match(/(\d+)\s*M/i) || ['20', '20'];
    const marks = marksMatch[1] || '20';
    const year = yearMatch[0] || '2024';

    const h4Match = pyqHtml.match(/<h4>([\s\S]*?)<\/h4>/i);
    const stemMatch = pyqHtml.match(/<div class="qstem"[^>]*>([\s\S]*?)<\/div>/i);
    
    let questionText = '';
    if (stemMatch) {
      questionText = stripHtml(stemMatch[1]);
    } else if (h4Match) {
      questionText = stripHtml(h4Match[1]);
    } else {
      questionText = `Taxation Exam Question (Unit ${unitNumber})`;
    }

    const qbodyMatch = pyqHtml.match(/<div class="qbody"[^>]*>([\s\S]*)$/i);
    let modelAnswer = qbodyMatch ? qbodyMatch[1] : pyqHtml;

    pyqs.push({
      id: anchorId,
      number: qCount,
      year: year,
      marks: marks,
      type: /(?:problem|Mr\.|Ms\.|Pvt|Ltd)/i.test(questionText) ? 'Problem' : 'Theory',
      unitNumber: unitNumber,
      unit: unitTitle,
      file: fileRel,
      anchorId: anchorId,
      question: questionText,
      modelAnswer: modelAnswer
    });
  }

  // Method B for Unit 3
  if (pyqs.length === 0 && content.includes('id="pyq-')) {
    const q3Matches = [
      { id: 'pyq-2024-q8b', title: 'Residential status of a Hindu Undivided Family (HUF)', year: '2024', marks: '10' },
      { id: 'pyq-flagship', title: 'Residential status of an individual with foreign travels & dual stay', year: '2024', marks: '20' }
    ];
    q3Matches.forEach((item, idx) => {
      const idxStart = content.indexOf(`id="${item.id}"`);
      if (idxStart !== -1) {
        const nextH = content.indexOf('<h3', idxStart + 20);
        const chunk = nextH !== -1 ? content.slice(idxStart, nextH) : content.slice(idxStart, idxStart + 4000);
        pyqs.push({
          id: item.id,
          number: idx + 1,
          year: item.year,
          marks: item.marks,
          type: item.title.includes('individual') ? 'Problem' : 'Theory',
          unitNumber: unitNumber,
          unit: unitTitle,
          file: fileRel,
          anchorId: item.id,
          question: item.title,
          modelAnswer: chunk
        });
      }
    });
  }

  return pyqs;
}

function extractRevision(content, uNum, uTitle, fileRel, revAnchor) {
  const anchorId = revAnchor || `s10`;
  const startIdx = content.indexOf(`id="${anchorId}"`);
  let revHtml = '';
  if (startIdx !== -1) {
    const nextH2 = content.indexOf('<h2', startIdx + 30);
    revHtml = nextH2 !== -1 ? content.slice(startIdx, nextH2) : content.slice(startIdx, startIdx + 6000);
  } else {
    revHtml = content.slice(-5000);
  }

  const tableMatch = revHtml.match(/<table[\s\S]*?<\/table>/i);
  let tableData = {
    headers: ['Topic / Issue', 'Statutory Rule / Test', 'Precedent'],
    rows: []
  };

  if (tableMatch) {
    const ths = [];
    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let thm;
    while ((thm = thRegex.exec(tableMatch[0])) !== null) {
      ths.push(stripHtml(thm[1]));
    }
    if (ths.length >= 2) {
      tableData.headers = ths.slice(0, 4);
    }

    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trm;
    while ((trm = trRegex.exec(tableMatch[0])) !== null) {
      const tds = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdm;
      while ((tdm = tdRegex.exec(trm[1])) !== null) {
        tds.push(stripHtml(tdm[1]));
      }
      if (tds.length >= 2) {
        tableData.rows.push(tds.slice(0, tableData.headers.length));
      }
    }
  }

  return {
    id: `tax-rev-u${uNum}`,
    unitNumber: uNum,
    unitTitle: uTitle,
    badge: `Unit ${uNum} Capsule`,
    title: `${uTitle} — Rapid Revision Capsule`,
    anchorId: anchorId,
    file: fileRel,
    type: 'Master Revision Capsule',
    table: tableData,
    examStrategy: [
      `Review key statutory sections and constitutional foundations in Unit ${uNum}.`,
      `Apply FIRAC framework to landmark Supreme Court authorities cited in this unit.`,
      `Verify computation rules, exemptions, and procedural conditions before writing answers.`
    ],
    caseMap: [],
    htmlContent: revHtml.slice(0, 4000)
  };
}

// Ingestion Execution
const taxUnits = [];
const taxCases = [];
const taxPyqs = [];
const taxRevisions = [];

for (const u of TAX_UNITS_CONFIG) {
  const fullPath = path.join(ROOT_DIR, u.file);
  const content = fs.readFileSync(fullPath, 'utf8');

  taxUnits.push({
    id: `tax-u${u.number}`,
    number: u.number,
    title: u.title,
    subtitle: u.subtitle,
    file: u.file,
    statutes: u.statutes,
    topics: u.topics
  });

  const unitCases = extractCasesFromNote(content, u.file, u.number, u.title);
  const unitPyqs = extractPyqsFromNote(content, u.file, u.number, u.title);
  const unitRev = extractRevision(content, u.number, u.title, u.file, u.revAnchor);

  taxCases.push(...unitCases);
  taxPyqs.push(...unitPyqs);
  taxRevisions.push(unitRev);
}

const taxationSubject = {
  id: 'taxation',
  code: 'LB-505',
  name: 'Principles of Taxation Law',
  shortName: 'Taxation Law',
  semester: 5,
  folder: 'SEM 5/Taxation',
  theme: {
    primary: '#101f3f',
    primaryDark: '#0a1428',
    primaryLight: '#1b2f5c',
    accent: '#a4802a',
    accentLight: '#fdf6e3',
    bgTint: '#f7f4ec',
    border: '#ddd4c2',
    badgeBg: '#fdf6e3',
    badgeColor: '#101f3f',
    gradient: 'linear-gradient(135deg, #101f3f 0%, #1b2f5c 55%, #a4802a 100%)',
    tagline: 'Direct Taxes, Constitutional Architecture of Tax, Income Definition, Heads of Income, Clubbing & Assessment',
    motto: 'Article 265 • Income Tax Act 1961 • Charge, Computation & Assessment',
    quote: 'No tax shall be levied or collected except by authority of law. Taxation is the price of civilized society, conditioned upon strict constitutional legality and fair procedure.',
    icon: 'fa-receipt'
  },
  units: taxUnits,
  cases: taxCases,
  pyqs: taxPyqs,
  revisions: taxRevisions
};

console.log('=== TAXATION SUBJECT INGESTION SUMMARY ===');
console.log(`Units: ${taxationSubject.units.length}`);
console.log(`Cases: ${taxationSubject.cases.length}`);
console.log(`PYQs: ${taxationSubject.pyqs.length}`);
console.log(`Revisions: ${taxationSubject.revisions.length}`);

// Load existing data.js safely
console.log('\nLoading and verifying existing data.js...');
const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);
const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

console.log(`Existing subjects count before injection: ${Object.keys(portalData.subjects).length}`);

// Attach taxation subject
portalData.subjects['taxation'] = taxationSubject;

// Update semester 5
const sem5 = portalData.semesters.find(s => s.id === 5);
if (sem5) {
  sem5.active = true;
  if (!sem5.subjectIds.includes('taxation')) {
    sem5.subjectIds.push('taxation');
  }
  sem5.badge = '5 Core Subjects Loaded (Drafting, Industrial Law, IT Laws, Criminology, Taxation)';
  sem5.description = 'Comprehensive study notes, DU landmark cases, past year examination questions, and rapid revision capsules for Drafting (LB-502), Industrial Law (LB-503), IT Laws (LB-5031), Criminology (LB-5033), and Principles of Taxation Law (LB-505).';
}

// Write back to data.js cleanly
const newJsContent = `// DU Law Notes Portal — Central Data Repository
// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules
// Comprehensive coverage across LL.B. syllabus

window.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};
`;

fs.writeFileSync(DATA_FILE, newJsContent, 'utf8');
console.log(`\n🎉 Successfully injected Principles of Taxation Law (LB-505) into js/data.js!`);
console.log(`New data.js file size: ${(newJsContent.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total subjects in data.js now: ${Object.keys(portalData.subjects).length}`);
console.log(`Sem 5 subjectIds now: [${sem5.subjectIds.join(', ')}]`);
