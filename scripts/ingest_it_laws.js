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

// Div Depth Counter to extract balanced inner HTML of any container
function extractDivContent(html, startPattern) {
  const match = html.match(startPattern);
  if (!match) return '';
  const startIdx = match.index + match[0].length;
  let depth = 1;
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = startIdx;
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    if (m[0].startsWith('</')) {
      depth--;
      if (depth === 0) {
        return html.slice(startIdx, m.index).trim();
      }
    } else {
      depth++;
    }
  }
  return html.slice(startIdx).trim();
}

function parseCaseBody(bodyHtml) {
  const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|<\/div>\s*<\/div>|$)/gi;
  let m;
  const sections = [];
  while ((m = h4Regex.exec(bodyHtml)) !== null) {
    const rawHead = m[1].replace(/<[^>]+>/g, '').trim();
    const content = m[2].trim();
    sections.push({ head: rawHead, html: content });
  }

  let facts = '';
  let issues = '';
  let arguments = '';
  let ratio = '';
  let principle = '';
  let examTips = '';

  for (const sec of sections) {
    const h = sec.head.toLowerCase();

    // Check if both facts and issues are combined in one heading
    if (h.includes('fact') && h.includes('issue')) {
      facts += (facts ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
      if (!issues) issues = `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('fact') || h.includes('procedural') || h.includes('plea') || h.includes('admission') || h.includes('the scheme') || h.includes('provenance')) {
      facts += (facts ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('issue') || h.includes('statutory issue') || h.includes('points for determination') || h.includes('questions referred')) {
      issues += (issues ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('argument') || h.includes('submission') || h.includes('arguments of both sides') || h.includes('for the petitioners') || h.includes('respondents')) {
      arguments += (arguments ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('ratio') || h.includes('reasoning') || h.includes('holding') || h.includes('decision') || h.includes('matrix of holding')) {
      ratio += (ratio ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('principle') || h.includes('doctrine')) {
      principle += (principle ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('exam') || h.includes('significance') || h.includes('takeaway') || h.includes('criticism') || h.includes('application')) {
      examTips += (examTips ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    } else if (h.includes('citation') || h.includes('bench')) {
      if (!facts) {
        facts = `<h4>${sec.head}</h4>` + sec.html;
      } else {
        facts = `<h4>${sec.head}</h4>` + sec.html + '<hr>' + facts;
      }
    } else {
      ratio += (ratio ? '<hr>' : '') + `<h4>${sec.head}</h4>` + sec.html;
    }
  }

  // Pre-h4 fallback for facts if empty
  if (!facts) {
    const preH4 = bodyHtml.split(/<h4/i)[0];
    if (preH4 && preH4.trim().length > 20) {
      facts = preH4.trim();
    }
  }

  let principleEvolved = '';
  if (principle && examTips) {
    principleEvolved = `${principle}<hr>${examTips}`;
  } else if (principle) {
    principleEvolved = principle;
  } else if (examTips) {
    principleEvolved = examTips;
  }

  return { facts, issues, arguments, ratio, principleEvolved, examTips };
}

function parseUnit7Section(content, secId, name, citation, unitNumber, unitTitle, fileRel, idx) {
  const startIdx = content.indexOf(`id="${secId}"`);
  if (startIdx === -1) return null;
  const nextSecIdx = content.indexOf('<section id="', startIdx + 15);
  const chunk = nextSecIdx !== -1 ? content.slice(startIdx, nextSecIdx) : content.slice(startIdx);

  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|<\/section>|$)/gi;
  let m;
  let facts = '';
  let issues = '';
  let arguments = '';
  let ratio = '';
  let principle = '';

  while ((m = h3Regex.exec(chunk)) !== null) {
    const rawH = m[1].replace(/<[^>]+>/g, '').trim();
    const h = rawH.toLowerCase();
    const body = m[2].trim();

    if (h.includes('fact')) {
      facts += (facts ? '<hr>' : '') + `<h4>${rawH}</h4>` + body;
    } else if (h.includes('issue')) {
      issues += (issues ? '<hr>' : '') + `<h4>${rawH}</h4>` + body;
    } else if (h.includes('argument')) {
      arguments += (arguments ? '<hr>' : '') + `<h4>${rawH}</h4>` + body;
    } else if (h.includes('decision') || h.includes('reasoning')) {
      ratio += (ratio ? '<hr>' : '') + `<h4>${rawH}</h4>` + body;
    } else {
      ratio += (ratio ? '<hr>' : '') + `<h4>${rawH}</h4>` + body;
    }
  }

  // Model exam boxes
  const boxMatches = Array.from(chunk.matchAll(/<div class="box[^"]*">([\s\S]*?)<\/div>/gi));
  boxMatches.forEach(bm => {
    if (bm[0].includes('principle') || bm[0].includes('Model exam paragraph') || bm[0].includes('exam')) {
      principle += (principle ? '<hr>' : '') + bm[0];
    }
  });

  return {
    id: `it-c-u7-${idx}`,
    name,
    citation,
    unitNumber: 7,
    unit: unitTitle,
    file: fileRel,
    anchorId: secId,
    facts,
    issues,
    arguments,
    ratio,
    principleEvolved: principle || ratio.slice(0, 500),
    examTips: principle || 'Key judicial authority under IT Act 2000.'
  };
}

function extractCasesFromNote(content, fileRel, unitNumber, unitTitle) {
  if (unitNumber === 7) {
    return [
      parseUnit7Section(content, 'u7s6', 'Trimex International FZE Ltd. v. Vedanta Aluminium Ltd.', '(2010) 3 SCC 1 · AIR 2010 SC 2221 · Supreme Court of India', 7, unitTitle, fileRel, 1),
      parseUnit7Section(content, 'u7s7', 'World Wrestling Entertainment, Inc. v. M/s Reshma Collection & Ors.', '2014 (60) PTC 452 (Del) (DB) · Delhi High Court Division Bench', 7, unitTitle, fileRel, 2),
      parseUnit7Section(content, 'u7s8', 'P.R. Transport Agency v. Union of India & Ors.', 'AIR 2006 All 23 · Allahabad High Court Division Bench', 7, unitTitle, fileRel, 3)
    ].filter(Boolean);
  }

  const cases = [];
  const parts = content.split(/<div class="casehead"/gi);
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const titleM = chunk.match(/<h3>([\s\S]*?)<\/h3>/i) || chunk.match(/<h4>([\s\S]*?)<\/h4>/i);
    const citeM = chunk.match(/<span class="cite">([\s\S]*?)<\/span>/i);
    const title = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : `Case ${i}`;
    const cite = citeM ? citeM[1].replace(/<[^>]+>/g, '').trim() : 'DU Case Material Precedent';

    const bodyIdx = chunk.indexOf('<div class="casebody">');
    const endBodyIdx = chunk.indexOf('</div>\n  </div>', bodyIdx);
    const bodyHtml = bodyIdx !== -1 ? chunk.slice(bodyIdx + 22, endBodyIdx !== -1 ? endBodyIdx : undefined) : '';

    const parsed = parseCaseBody(bodyHtml);

    cases.push({
      id: `it-c-u${unitNumber}-${i}`,
      name: title,
      citation: cite,
      unitNumber: unitNumber,
      unit: unitTitle,
      file: fileRel,
      anchorId: `case-it-u${unitNumber}-${i}`,
      facts: parsed.facts,
      issues: parsed.issues,
      arguments: parsed.arguments,
      ratio: parsed.ratio,
      principleEvolved: parsed.principleEvolved,
      examTips: parsed.examTips
    });
  }

  return cases;
}

function extractPyqsFromNote(content, fileRel, unitNumber, unitTitle) {
  const pyqs = [];
  const rawBlocks = content.split(/<div class="pyq"[^>]*>/gi);

  for (let i = 1; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    const hasAns = /<div class="ans"[^>]*>/i.test(block);

    let qText = '';
    let modelAnswer = '';

    if (hasAns) {
      modelAnswer = extractDivContent(block, /<div class="ans"[^>]*>/i);
      const qtextM = block.match(/<span class="qtext"[^>]*>([\s\S]*?)<\/span>/i) || block.match(/<p class="qtext"[^>]*>([\s\S]*?)<\/p>/i);
      const qbM = block.match(/<div class="qb"[^>]*>([\s\S]*?)<\/div>/i);
      const qM = block.match(/<div class="q"[^>]*>([\s\S]*?)<\/div>/i);

      if (qtextM) {
        qText = qtextM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (qbM) {
        qText = qbM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (qM) {
        qText = qM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    } else {
      modelAnswer = extractDivContent(block, /<div class="qb"[^>]*>/i);
      const qtextM = block.match(/<span class="qtext"[^>]*>([\s\S]*?)<\/span>/i);
      const qhM = block.match(/<div class="qh"[^>]*>([\s\S]*?)<\/div>/i);
      if (qtextM) {
        qText = qtextM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (qhM) {
        qText = qhM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    let year = 'DU LL.B. Examination';
    const yrM = block.match(/<span class="yr">([\s\S]*?)<\/span>/i);
    const qmetaM = block.match(/<span class="qmeta">([\s\S]*?)<\/span>/i);
    if (qmetaM) year = qmetaM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    else if (yrM) year = yrM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    let marks = '20 Marks';
    const marksM = block.match(/<span class="marks">([\s\S]*?)<\/span>/i);
    if (marksM) marks = marksM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    else if (year.includes('marks') || year.includes('Marks')) marks = year;

    pyqs.push({
      id: `it-pyq-u${unitNumber}-${i}`,
      number: `Q${i}`,
      year,
      marks,
      type: qText.length > 200 ? 'Problem' : 'Essay',
      unitNumber,
      unit: unitTitle,
      file: fileRel,
      anchorId: `pyq-it-u${unitNumber}-${i}`,
      question: qText || `Examination Question on ${unitTitle}`,
      modelAnswer
    });
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
