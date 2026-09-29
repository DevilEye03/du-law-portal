const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

const IT_UNITS_CONFIG = [
  {
    number: 1,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-I_Introduction_DU_LB5031_Notes.html',
    title: 'Unit 1: Introduction & Fundamentals of Cyber Law',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit I: Introduction) | DU LL.B. V Term LB-5031 Master Notes',
    statutes: ['S. 1(2) IT Act', 'S. 1(4) IT Act', 'S. 2(1)(i) IT Act', 'S. 2(1)(j) IT Act', 'S. 2(1)(k) IT Act', 'S. 2(1)(v) IT Act', 'S. 81 IT Act', 'UNCITRAL Model Law 1996'],
    topics: [
      'Evolution, Need & Scope of Cyber Law & Cyberspace',
      'UNCITRAL Model Law on Electronic Commerce, 1996',
      'Objects, Scheme & Legislative History of IT Act, 2000',
      'Key Definitions: Computer, Computer System, Network, Resource & Communication Device',
      'Exclusions under First Schedule (S. 1(4)) & Overriding Effect (S. 81)'
    ]
  },
  {
    number: 2,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-II_Legal_Recognition_and_Authentication_DU_LB5031_Notes.html',
    title: 'Unit 2: Legal Recognition & Authentication of Electronic Records',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit II: Legal Recognition & Authentication of Electronic Records) | DU LL.B. V Term LB-5031',
    statutes: ['S. 3 IT Act', 'S. 3A IT Act', 'S. 4 IT Act', 'S. 5 IT Act', 'S. 6 IT Act', 'S. 17–34 IT Act', 'S. 65B IEA / S. 63 BSA 2023'],
    topics: [
      'Functional Equivalence Approach & Legal Recognition of Electronic Records (S. 4)',
      'Authentication: Asymmetric Cryptosystem & Digital Signatures (S. 3)',
      'Electronic Signatures & Technology-Neutral Regime (S. 3A & Second Schedule)',
      'Electronic Governance & Delivery of Services by Service Provider (Ss. 6–9)',
      'Certifying Authorities (CA), Controller (CCA) & Digital Signature Certificates',
      'Admissibility of Electronic Records: S. 65B Evidence Act / S. 63 BSA 2023 (Arjun Panditrao)'
    ]
  },
  {
    number: 3,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-III_Civil_Liabilities_Cyber_Torts_DU_LB5031_Notes.html',
    title: 'Unit 3: Civil Liabilities & Cyber Torts',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit III: Civil Liabilities / Cyber Torts) | DU LL.B. V Term LB-5031',
    statutes: ['S. 43 IT Act', 'S. 43A IT Act', 'S. 46 IT Act', 'S. 47 IT Act', 'S. 57 IT Act / TDSAT', 'IT (SPDI) Rules 2011', 'DPDP Act 2023'],
    topics: [
      'Civil Contraventions & Compensation under Section 43 (Unauthorized Access, Virus, Damage)',
      'Corporate Liability for Failure to Protect Sensitive Personal Data (S. 43A & SPDI Rules 2011)',
      'Adjudicating Officer: Appointment, Powers & Jurisdiction under Section 46',
      'Quantum of Compensation: Factors & Criteria under Section 47',
      'Appellate Machinery: Cyber Appellate Tribunal / TDSAT under Section 57',
      'SIM Swap Fraud & Banking Cyber Torts (Sanjay Dhande, Chander Kalani)'
    ]
  },
  {
    number: 4,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-IV_Criminal_Liabilities_Cyber_Crimes_DU_LB5031_Notes.html',
    title: 'Unit 4: Criminal Liabilities & Cyber Crimes',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit IV: Criminal Liabilities / Cyber Crimes) | DU LL.B. V Term LB-5031',
    statutes: ['S. 65 IT Act', 'S. 66 IT Act', 'S. 66A IT Act (Struck Down)', 'S. 66C IT Act', 'S. 66D IT Act', 'S. 66E IT Act', 'S. 66F IT Act', 'S. 67 IT Act', 'S. 67A IT Act', 'S. 67B IT Act', 'S. 72 & 72A IT Act', 'BNS 2023 / IPC 1860'],
    topics: [
      'Tampering with Computer Source Documents (S. 65 & Syed Asifuddin)',
      'Hacking, Identity Theft & Cheating by Personation (Ss. 66, 66C, 66D)',
      'Violation of Privacy & Cyber Terrorism (Ss. 66E, 66F)',
      'The Demise of Section 66A: Shreya Singhal and Freedom of Online Speech',
      'Obscenity, Sexually Explicit Content & Child Abuse Material (Ss. 67, 67A, 67B)',
      'Breach of Confidentiality & Disclosure of Information in Breach of Contract (Ss. 72, 72A)',
      'Parallel Prosecutions under IT Act and IPC / Bharatiya Nyaya Sanhita 2023'
    ]
  },
  {
    number: 5,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-V_Intermediary_Liability_DU_LB5031_Notes.html',
    title: 'Unit 5: Intermediary Liability & Safe Harbour',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit V: Intermediary Liability) | DU LL.B. V Term LB-5031',
    statutes: ['S. 2(1)(w) IT Act', 'S. 79 IT Act', 'IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021', 'Copyright Act 1957 S. 51(a)(ii)'],
    topics: [
      'Definition & Scope of Intermediary under Section 2(1)(w)',
      'Safe Harbour Protection under Section 79 & Legislative Evolution post-Avinash Bajaj (Baazee.com)',
      'Conditions for Exemption: Passive Conduit, Lack of Knowledge & Due Diligence',
      'Notice & Takedown Regime: Judicial Reading of S. 79(3)(b) in Shreya Singhal (Court Order/Govt Notice)',
      'Copyright Infringement & Secondary Liability: MySpace Inc. v. Super Cassettes Industries',
      'E-Commerce Marketplaces vs Direct Selling: Amazon v. Modicare & Christian Louboutin',
      'Due Diligence & Compliance Framework under IT Intermediary Rules, 2021 (SSMIs)'
    ]
  },
  {
    number: 6,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-VI_Cyber_Security_DU_LB5031_Notes.html',
    title: 'Unit 6: Cyber Security & Critical Infrastructure',
    subtitle: 'Part A – The Information Technology Act, 2000 (Unit VI: Cyber Security) | DU LL.B. V Term LB-5031',
    statutes: ['S. 69 IT Act', 'S. 69A IT Act', 'S. 69B IT Act', 'S. 70 IT Act', 'S. 70A IT Act', 'S. 70B IT Act', 'CERT-In Directions 2022', 'Information Technology (Blocking Rules) 2009'],
    topics: [
      'Interception, Monitoring & Decryption of Information (S. 69 & Procedural Safeguards)',
      'Blocking for Public Access under Section 69A & Confidentiality of Orders',
      'Protected Systems & National Critical Information Infrastructure Protection Centre (NCIIPC, Ss. 70, 70A)',
      'Indian Computer Emergency Response Team (CERT-In) Powers & Reporting Mandates (S. 70B)',
      'Surveillance, Privacy & Constitutional Proportionality (Puttaswamy, Anuradha Bhasin, Ratan Tata)'
    ]
  },
  {
    number: 7,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-VII_E-Contracts_DU_LB5031_Notes.html',
    title: 'Unit 7: E-Contracts, Attribution & Dispatch',
    subtitle: 'Part B – Applicability of Other Laws on E-Commerce · Unit VII: E-Contracts | DU LL.B. V Term LB-5031',
    statutes: ['S. 10A IT Act', 'S. 11 IT Act', 'S. 12 IT Act', 'S. 13 IT Act', 'Indian Contract Act 1872 Ss. 3–10', 'Arbitration & Conciliation Act 1996 S. 7(4)(b)'],
    topics: [
      'Validity of Contracts Formed through Electronic Means (S. 10A IT Act)',
      'Types of Online Contracts: Browse-wrap, Click-wrap & Shrink-wrap Agreements',
      'Attribution & Deemed Attribution of Electronic Records (S. 11)',
      'Acknowledgment of Receipt of Electronic Records (S. 12)',
      'Time & Place of Despatch and Receipt (S. 13) vs Postal Acceptance Rule',
      'Enforceability of Email Contracts & Arbitration Clauses (Trimex v. Vedanta Aluminium)'
    ]
  },
  {
    number: 8,
    file: 'SEM 5/IT LAWS/IT_Act_2000_Unit-IX_Jurisdiction_in_Cyberspace_DU_LB5031_Notes.html',
    title: 'Unit 8: Jurisdiction in Cyberspace',
    subtitle: 'Part B – Applicability of Other Laws on E-Commerce · Unit IX: Jurisdiction in Cyberspace | DU LL.B. V Term LB-5031',
    statutes: ['S. 1(2) IT Act', 'S. 75 IT Act', 'S. 20 CPC', 'S. 134 TM Act / S. 62 Copyright Act', 'CrPC Ss. 177–188'],
    topics: [
      'Extraterritorial Jurisdiction of the IT Act (Ss. 1(2) & 75: Offence Outside India Involving Computer in India)',
      'Civil Jurisdiction in Cyberspace: Section 20(c) CPC & Cause of Action Online',
      'Personal Jurisdiction & "Long-Arm" Statutes: Minimum Contacts Test (International Shoe)',
      'Passive vs Interactive Websites: The Zippo Sliding Scale Test',
      'Purposeful Availment & "Targeting" in India: The Division Bench Ruling in Banyan Tree v. Murali Krishna Reddy',
      'Trademark & Copyright Infringement Jurisdiction: WWE v. Reshma Collection & Impresario',
      'Territorial Jurisdiction in Cyber Crimes: IPC/BNS & S. 179 CrPC (Maqbool Fida Husain)'
    ]
  }
];

// Special case definitions for Unit 7 to ensure 100% legal accuracy
const UNIT_7_SPECIAL_CASES = [
  {
    name: 'Trimex International FZE Ltd. v. Vedanta Aluminium Ltd.',
    citation: '(2010) 3 SCC 1 · AIR 2010 SC 2221 · Supreme Court of India',
    facts: 'Trimex (Dubai mineral trader) e-mailed a commercial offer to Vedanta for bauxite supply containing an arbitration clause. Following detailed e-mail negotiations, Vedanta confirmed acceptance of 5 shipments. Trimex entered into upstream and shipping commitments. Later Vedanta requested a hold and rejected the formal arbitration notice, contending no formal contract was signed.',
    issues: 'Whether an unconditional acceptance conveyed over e-mail constitutes a valid, binding contract with an enforceable arbitration clause under Section 10A IT Act and Section 7(4)(b) Arbitration and Conciliation Act without formal signatures.',
    arguments: 'Trimex argued intention to be bound was demonstrated by clear e-mail acceptance and subsequent conduct. Vedanta contended drafts were non-binding pending formal signed execution.',
    ratio: 'Held by the Supreme Court: Once a contract is concluded through e-mail exchanges, the absence of a formal signed contract does not invalidate the agreement. Under Section 10A of the IT Act, 2000, contracts formed through electronic communications are legally valid, binding and enforceable.',
    examTips: 'Top citation in e-commerce! Quote Sathasivam J. and emphasize that Section 10A legitimizes e-mail contracts provided the requirements of the Contract Act are met.'
  },
  {
    name: 'World Wrestling Entertainment, Inc. v. Reshma Collection & Ors.',
    citation: '2014 (60) PTC 452 (Del) · Delhi High Court Division Bench',
    facts: 'WWE filed a suit in Delhi for trademark infringement against sellers of counterfeit goods in Mumbai, invoking Delhi jurisdiction on the ground that its official website was accessible and permitted transactions in Delhi.',
    issues: 'Whether an interactive commercial website accessible in a forum gives that forum court territorial jurisdiction under Section 20(c) CPC and Section 134 Trade Marks Act.',
    arguments: 'Plaintiff argued modern e-commerce means contract formation happens at the buyer’s end where acceptance is received under Section 13 IT Act and Bhagwandas Kedia principle.',
    ratio: 'A Division Bench of the Delhi High Court held that when an interactive website invites customers to place orders and pay online, acceptance is communicated to the buyer at their desktop; hence a part of cause of action arises where the transaction occurs.',
    examTips: 'Landmark decision harmonizing Bhagwandas Kedia (instantaneous communication) with Section 13(2) IT Act in online transactions.'
  },
  {
    name: 'P.R. Transport Agency v. Union of India & Ors.',
    citation: 'AIR 2006 All 23 · Allahabad High Court Division Bench',
    facts: 'Bharat Coking Coal Ltd. accepted P.R. Transport Agency’s e-tender through an acceptance letter e-mailed from Dhanbad to the petitioner’s computer in Chandauli (UP). Later BCCL cancelled the tender alleging another cheque was dishonoured. P.R. Transport filed a writ in Allahabad High Court.',
    issues: 'Where does the cause of action arise in contracts formed via e-mail under Section 13(3) of the IT Act, 2000?',
    arguments: 'BCCL argued Jharkhand courts had sole jurisdiction because server and acceptance originated in Dhanbad. Petitioner argued acceptance was received at Chandauli, UP.',
    ratio: 'Under Section 13(3) of the IT Act, an electronic record is deemed to be received at the place where the addressee has his place of business. Since petitioner’s principal place of business was Chandauli (UP), acceptance was received in UP, establishing Allahabad High Court’s territorial jurisdiction.',
    examTips: 'Essential authority for Section 13(3) IT Act! Replaces physical server location with the statutory "place of business" rule.'
  }
];

function extractCasesFromNote(content, fileRel, unitNumber, unitTitle) {
  if (unitNumber === 7) {
    return UNIT_7_SPECIAL_CASES.map((sc, idx) => ({
      id: `it-c-u7-${idx + 1}`,
      name: sc.name,
      citation: sc.citation,
      unitNumber: 7,
      unit: unitTitle,
      file: fileRel,
      anchorId: `case-it-u7-${idx + 1}`,
      facts: sc.facts,
      issues: sc.issues,
      arguments: sc.arguments,
      ratio: sc.ratio,
      principleEvolved: sc.ratio.substring(0, 400),
      examTips: sc.examTips
    }));
  }

  const cases = [];
  let idx = 1;

  const caseBlocks = content.split(/<div class="caseblock"/gi);
  if (caseBlocks.length > 1) {
    for (let i = 1; i < caseBlocks.length; i++) {
      const block = caseBlocks[i];
      
      const h3Match = block.match(/<h[34][^>]*>([\s\S]*?)<\/h[34]>/i);
      let title = h3Match ? stripHtml(h3Match[1]) : '';
      
      if (!title || title.match(/^\d+\s+/)) {
        const cnMatch = block.match(/<div class="cn"[^>]*>([\s\S]*?)<\/div>/i);
        const nameMatch = block.match(/<b>([A-Z][a-zA-Z\s.,&'\-()]+v\.\s+[A-Z][a-zA-Z\s.,&'\-()]+)<\/b>/i);
        if (nameMatch) {
          title = stripHtml(nameMatch[1]);
        } else if (cnMatch) {
          title = stripHtml(cnMatch[1]);
        }
      }

      if (!title || title.length < 3) continue;

      const citeMatches = Array.from(block.matchAll(/<span class="cite">([\s\S]*?)<\/span>/gi)).map(m => stripHtml(m[1]));
      let citation = citeMatches.length > 0 ? citeMatches.join(' · ') : 'DU Prescribed Landmark Case';

      const factsMatch = block.match(/<h4>[^<]*Facts[\s\S]*?<\/h4>([\s\S]*?)(?=<h4>|<\/div>\s*<\/div>|$)/i);
      let facts = factsMatch ? stripHtml(factsMatch[1]) : `Material facts as recorded in DU Case Material for ${title}.`;

      const issuesMatch = block.match(/<h4>[^<]*Issues[\s\S]*?<\/h4>([\s\S]*?)(?=<h4>|<\/div>\s*<\/div>|$)/i);
      let issues = issuesMatch ? stripHtml(issuesMatch[1]) : `Whether the impugned acts fall within the scope of the Information Technology Act, 2000 and related penal/civil provisions.`;

      const argsMatch = block.match(/<h4>[^<]*Arguments[\s\S]*?<\/h4>([\s\S]*?)(?=<h4>|<\/div>\s*<\/div>|$)/i);
      let args = argsMatch ? stripHtml(argsMatch[1]) : `Parties advanced detailed submissions regarding the interpretation of cyber law provisions, technical definitions, and constitutional safeguards.`;

      const ratioMatch = block.match(/<h4>[^<]*(?:Ratio|Decision|Holdings|Principle)[\s\S]*?<\/h4>([\s\S]*?)(?=<h4>|<\/div>\s*<\/div>|$)/i);
      let ratio = ratioMatch ? stripHtml(ratioMatch[1]) : stripHtml(block).substring(0, 750);

      const tipsMatch = block.match(/<h4>[^<]*(?:Exam|Takeaway|Analysis)[\s\S]*?<\/h4>([\s\S]*?)(?=<h4>|<\/div>\s*<\/div>|$)/i);
      let examTips = tipsMatch ? stripHtml(tipsMatch[1]) : `Quote the exact ratio and statutory sections in DU LL.B. semester exams for maximum marks.`;

      cases.push({
        id: `it-c-u${unitNumber}-${idx++}`,
        name: title,
        citation: citation.substring(0, 160),
        unitNumber: unitNumber,
        unit: unitTitle,
        file: fileRel,
        anchorId: `case-it-u${unitNumber}-${idx}`,
        facts: facts.substring(0, 850),
        issues: issues.substring(0, 650),
        arguments: args.substring(0, 650),
        ratio: ratio.substring(0, 850),
        principleEvolved: ratio.substring(0, 450),
        examTips: examTips.substring(0, 450)
      });
    }
  }

  return cases;
}

function extractPyqsFromNote(content, fileRel, unitNumber, unitTitle) {
  const pyqs = [];
  let idx = 1;

  const rawPyqs = content.split(/<div class="pyq"/gi);
  if (rawPyqs.length > 1) {
    for (let i = 1; i < rawPyqs.length; i++) {
      const chunk = rawPyqs[i].substring(0, 5000);
      
      let qText = '';
      const qtextM = chunk.match(/<span class="qtext">([\s\S]*?)<\/span>/i);
      const qnM = chunk.match(/<div class="q">([\s\S]*?)<\/div>/i);
      const qhM = chunk.match(/<div class="qh">([\s\S]*?)<\/div>/i);
      if (qtextM) qText = stripHtml(qtextM[1]);
      else if (qnM) qText = stripHtml(qnM[1]);
      else if (qhM) qText = stripHtml(qhM[1]);

      if (!qText) qText = `Examination Problem / Question on ${unitTitle}`;

      let year = 'DU LL.B. Examination';
      const yrM = chunk.match(/<span class="yr">([\s\S]*?)<\/span>/i);
      const qmetaM = chunk.match(/<span class="qmeta">([\s\S]*?)<\/span>/i);
      if (qmetaM) year = stripHtml(qmetaM[1]);
      else if (yrM) year = stripHtml(yrM[1]);

      let marks = '15–20 Marks';
      const marksM = chunk.match(/<span class="marks">([\s\S]*?)<\/span>/i);
      if (marksM) marks = stripHtml(marksM[1]);
      else if (year.includes('marks')) marks = year;

      let ansText = '';
      const ansM = chunk.match(/<div class="ans">([\s\S]*?)<\/div>/i);
      const qbM = chunk.match(/<div class="qb">([\s\S]*?)<\/div>/i);
      if (ansM) ansText = stripHtml(ansM[1]);
      else if (qbM) ansText = stripHtml(qbM[1]);
      else ansText = stripHtml(chunk).substring(0, 1500);

      pyqs.push({
        id: `it-pyq-u${unitNumber}-${idx++}`,
        number: `Q${idx - 1}`,
        year: year,
        marks: marks,
        type: qText.length > 220 ? 'Problem' : 'Essay',
        unitNumber: unitNumber,
        unit: unitTitle,
        file: fileRel,
        anchorId: `pyq-it-u${unitNumber}-${idx}`,
        question: qText,
        modelAnswer: ansText
      });
    }
  }

  return pyqs;
}

function extractRevision(content, unitNumber, unitTitle, fileRel) {
  let tableRows = [
    ['Statutory Foundation', 'Mandatory compliance with IT Act 2000 provisions and statutory rules', 'DU Case Material Rule'],
    ['Judicial Doctrine', 'Application of functional equivalence, proportionality and safe harbour', 'Supreme Court Landmark Rulings'],
    ['Examination Strategy', 'Identify civil vs criminal liability, verify cyber jurisdiction and quote sections precisely', 'Model Examination Takeaways']
  ];

  const tableMatch = content.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (tableMatch) {
    const trMatches = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    if (trMatches.length > 1) {
      const extractedRows = [];
      for (let r = 1; r < Math.min(trMatches.length, 8); r++) {
        const cells = [...trMatches[r][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c => stripHtml(c[1]));
        if (cells.length >= 2) {
          extractedRows.push([cells[0], cells[1], cells[2] || 'Leading Precedent']);
        }
      }
      if (extractedRows.length >= 3) {
        tableRows = extractedRows;
      }
    }
  }

  return {
    id: `it-rev-u${unitNumber}`,
    unitNumber: unitNumber,
    unitTitle: unitTitle,
    badge: `Unit ${unitNumber} Capsule`,
    title: `${unitTitle} — Rapid Revision Capsule`,
    anchorId: `rev-it-u${unitNumber}`,
    file: fileRel,
    type: 'Master Revision Capsule',
    table: {
      headers: ['Concept / Provision', 'Core Rule & Judicial Test', 'Landmark Precedent'],
      rows: tableRows
    },
    examStrategy: 'State the statutory definition (IT Act) → distinguish civil contravention (s.43) vs crime (s.65/66) → analyze knowledge/mens rea → apply Supreme Court tests (Shreya Singhal, Arjun Panditrao, Trimex).',
    caseMap: `Authoritative decisions prescribed in University of Delhi Case Materials for ${unitTitle}.`
  };
}

// Build IT Laws Subject
console.log('Building Information Technology Law (LB-5031)...');

const itUnits = [];
const itCases = [];
const itPyqs = [];
const itRevisions = [];

for (const u of IT_UNITS_CONFIG) {
  const fullPath = path.join(ROOT_DIR, u.file);
  const content = fs.readFileSync(fullPath, 'utf8');

  itUnits.push({
    id: `it-u${u.number}`,
    number: u.number,
    title: u.title,
    subtitle: u.subtitle,
    file: u.file,
    statutes: u.statutes,
    topics: u.topics
  });

  const unitCases = extractCasesFromNote(content, u.file, u.number, u.title);
  const unitPyqs = extractPyqsFromNote(content, u.file, u.number, u.title);
  const unitRev = extractRevision(content, u.number, u.title, u.file);

  itCases.push(...unitCases);
  itPyqs.push(...unitPyqs);
  itRevisions.push(unitRev);
}

const itLawsSubject = {
  id: 'it_laws',
  code: 'LB-5031',
  name: 'Information Technology Law',
  shortName: 'IT Laws',
  semester: 5,
  folder: 'SEM 5/IT LAWS',
  theme: {
    primary: '#0b2545',
    primaryDark: '#061527',
    primaryLight: '#13315c',
    accent: '#1b6ca8',
    accentLight: '#e8f1fa',
    bgTint: '#f4f6fb',
    border: '#dfe5f0',
    badgeBg: '#e8f1fa',
    badgeColor: '#0b2545',
    gradient: 'linear-gradient(135deg, #0b2545 0%, #13315c 55%, #1b6ca8 100%)',
    tagline: 'Information Technology Act 2000, Cyber Crimes, Electronic Records, Intermediary Liability & Cyberspace Jurisdiction',
    motto: 'IT Act 2000 • Cyber Crimes • Safe Harbour • E-Commerce',
    quote: 'The law of cyberspace must evolve as rapidly as technology itself, safeguarding fundamental speech while enforcing accountability in the digital realm.',
    icon: 'fa-laptop-code'
  },
  units: itUnits,
  cases: itCases,
  pyqs: itPyqs,
  revisions: itRevisions
};

console.log('=== IT LAWS SUBJECT STATS ===');
console.log(`Units: ${itLawsSubject.units.length}`);
console.log(`Cases: ${itLawsSubject.cases.length}`);
console.log(`PYQs: ${itLawsSubject.pyqs.length}`);
console.log(`Revisions: ${itLawsSubject.revisions.length}`);

// Load existing data.js
console.log('\nLoading and verifying existing data.js...');
const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);
const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

console.log(`Existing subjects before injection: ${Object.keys(portalData.subjects).join(', ')}`);

// Attach it_laws subject
portalData.subjects['it_laws'] = itLawsSubject;

// Update semester 5
const sem5 = portalData.semesters.find(s => s.id === 5);
if (sem5) {
  sem5.active = true;
  if (!sem5.subjectIds.includes('it_laws')) {
    sem5.subjectIds.push('it_laws');
  }
  sem5.badge = '3 Subjects Loaded (Drafting, Industrial Law, IT Laws)';
  sem5.description = 'Comprehensive study notes, DU landmark cases, past year examination questions, and rapid revision capsules for Drafting (LB-502), Industrial Law (LB-503), and Information Technology Law (LB-5031).';
}

// Write back to data.js cleanly
const newJsContent = `// DU Law Notes Portal — Central Data Repository
// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules
// Comprehensive coverage across LL.B. syllabus

window.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};
`;

fs.writeFileSync(DATA_FILE, newJsContent, 'utf8');
console.log(`\n🎉 Successfully injected Information Technology Law (LB-5031) into js/data.js!`);
console.log(`New data.js file size: ${(newJsContent.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total subjects in data.js now: ${Object.keys(portalData.subjects).length}`);
console.log(`Sem 5 subjectIds now: [${sem5.subjectIds.join(', ')}]`);
