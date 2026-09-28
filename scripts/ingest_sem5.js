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

// =========================================================================
// 1. DRAFTING (LB-502) UNITS CONFIGURATION
// =========================================================================
const DRAFTING_UNITS = [
  {
    number: 1,
    file: 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html',
    title: 'Topic 1: Fundamental Rules & Skills of Pleadings',
    subtitle: 'Drafting Rules & Skills — Part A: Pleadings | LB-502 DPC (University of Delhi)',
    statutes: ['O. VI CPC', 'O. VII CPC', 'O. VIII CPC', 'S. 26 CPC', 'O. VI R. 2', 'O. VI R. 17'],
    topics: [
      'Meaning, Function & Object of Pleadings',
      'The Four Fundamental Rules of Pleading (O. VI R. 2)',
      'Plead Facts, Not Law & Material Facts Only',
      'Evidence Excluded from Pleadings & Conciseness Rules',
      'Amendment of Pleadings (O. VI R. 17 CPC)'
    ]
  },
  {
    number: 2,
    file: 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html',
    title: 'Topic 2: Forms of Pleadings — Civil Plaints & Applications',
    subtitle: 'Forms of Pleadings — Civil | DU LL.B. LB-502 Drafting, Pleadings & Conveyance',
    statutes: ['O. XXXVII CPC', 'O. XXXIX Rr. 1 & 2', 'S. 151 CPC', 'O. VII R. 1', 'S. 34 CPC'],
    topics: [
      'Suit for Recovery under Order XXXVII CPC (Summary Suits)',
      'Drafting Affidavits in Support of Plaints and Applications',
      'Suit for Permanent Injunction & Temporary Injunction (O. XXXIX)',
      'Suit for Specific Performance of Contract & Possession',
      'Written Statement with Set-off and Counter-Claim (O. VIII CPC)'
    ]
  },
  {
    number: 3,
    file: 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html',
    title: 'Topic 3: Matrimonial Pleadings (HMA 1955)',
    subtitle: 'Matrimonial Pleadings — DU Forms 13–18 (LB-502) · Deep Notes',
    statutes: ['S. 9 HMA', 'S. 13(1)(ia) HMA', 'S. 13B HMA', 'S. 24 HMA', 'S. 26 HMA'],
    topics: [
      'Petition for Restitution of Conjugal Rights (S. 9 HMA)',
      'Petition for Dissolution of Marriage by Divorce on Ground of Cruelty (S. 13)',
      'Petition for Mutual Consent Divorce (S. 13B HMA)',
      'Application for Maintenance Pendente Lite & Litigation Expenses (S. 24)',
      'Application for Child Custody & Visitation Rights (S. 26 HMA)'
    ]
  },
  {
    number: 4,
    file: 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html',
    title: 'Topic 4: Pleadings under Indian Succession Act, 1925',
    subtitle: 'Pleadings under the Indian Succession Act, 1925 — DU LL.B. LB-502 (Items 19–21)',
    statutes: ['S. 276 ISA', 'S. 278 ISA', 'S. 372 ISA', 'S. 218 ISA'],
    topics: [
      'Petition for Grant of Probate of a Will (S. 276 ISA 1925)',
      'Petition for Grant of Letters of Administration (S. 278 ISA 1925)',
      'Petition for Grant of Succession Certificate (S. 372 ISA 1925)',
      'Citation, Administration Bond & Caveats in Testamentary Proceedings'
    ]
  },
  {
    number: 5,
    file: 'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html',
    title: 'Topic 5: Pleadings under Criminal Law & Special Enactments',
    subtitle: 'Pleadings under Criminal Law — DU LB-502 | Regular Bail · Anticipatory Bail · s.138 Complaint · Maintenance',
    statutes: ['S. 437 CrPC / S. 480 BNSS', 'S. 438 CrPC / S. 482 BNSS', 'S. 439 CrPC / S. 483 BNSS', 'S. 138 NI Act', 'S. 125 CrPC / S. 144 BNSS'],
    topics: [
      'Application for Regular Bail before Sessions Court & High Court',
      'Application for Anticipatory Bail (Pre-Arrest Bail)',
      'Criminal Complaint under Section 138 Negotiable Instruments Act',
      'Application for Maintenance under Section 125 CrPC / Section 144 BNSS'
    ]
  },
  {
    number: 6,
    file: 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html',
    title: 'Topic 6: Miscellaneous Petitions — Consumer, Contempt & DV Act',
    subtitle: 'Other Miscellaneous Pleadings — DU LB-502 | Consumer Complaint · Contempt Petition · PWDVA Petition',
    statutes: ['S. 35 CPA 2019', 'S. 11 Contempt of Courts Act 1971', 'S. 12 PWDVA 2005', 'Art. 215 Const.'],
    topics: [
      'Consumer Complaint before District Commission under Consumer Protection Act 2019',
      'Contempt Petition under Sections 11 & 12 Contempt of Courts Act 1971',
      'Application under Section 12 Protection of Women from Domestic Violence Act 2005'
    ]
  },
  {
    number: 7,
    file: 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html',
    title: 'Topic 7: Conveyancing — Deeds, Instruments & Statutory Notices',
    subtitle: 'Conveyancing (Part B) — Component Parts of a Deed + 13 Forms of Deeds & Notices · DU LB-502',
    statutes: ['S. 54 TPA', 'S. 58 TPA', 'S. 105 TPA', 'S. 122 TPA', 'S. 17 Registration Act', 'S. 80 CPC'],
    topics: [
      'Component Parts of a Deed (Habendum, Tenendum, Reddendum & Testimonium)',
      'Drafting Sale Deed of Immovable Property & Agreement to Sell',
      'Drafting Simple Mortgage Deed & Usufructuary Mortgage',
      'Drafting Commercial Lease Deed & Residential Rent Agreement',
      'Drafting Gift Deed & Revocation Clauses',
      'Drafting Promissory Note, General Power of Attorney & Special POA',
      'Drafting Statutory Notice under Section 80 CPC & Legal Notice under Section 138 NI Act'
    ]
  }
];

// Fallback high-yield cases for drafting units without explicit div.case markup
const DRAFTING_EXTRA_CASES = {
  4: [
    {
      name: 'H. Venkatachala Iyengar v. B.N. Thimmajamma',
      citation: 'AIR 1959 SC 443',
      facts: 'The propounder of a will applied for probate. Suspicious circumstances surrounded the execution, including the propounder taking a leading part in execution and substantial benefit thereunder.',
      issues: 'What is the nature and standard of evidence required to prove execution and attestation of a will when suspicious circumstances are alleged?',
      arguments: 'Appellant argued execution was strictly proven per s. 63 Succession Act and s. 68 Evidence Act. Respondent argued propounder failed to dispel suspicious circumstances.',
      ratio: 'The propounder must prove that the testator signed the will in sound disposing state of mind and understood the nature of dispositions. Where suspicious circumstances exist, the court will not grant probate until the propounder satisfies the judicial conscience by cogent evidence.',
      examTips: 'The locus classicus on proof of wills in probate petitions under Section 276 of the Indian Succession Act, 1925.'
    },
    {
      name: 'Krishna Kumar Birla v. Rajendra Singh Lodha',
      citation: '(2008) 4 SCC 300',
      facts: 'In the Priyamvada Devi Birla will dispute, caveators claiming under a prior mutual will sought to enter caveats opposing grant of probate to Lodha.',
      issues: 'Who has caveatable interest to contest a probate petition under Section 283 and Section 284 of the Indian Succession Act?',
      arguments: 'Appellants claimed substantial interest in the estate. Respondent argued only persons who would inherit in intestacy or under another testamentary paper have caveatable interest.',
      ratio: 'A person who has a caveatable interest must show an interest in the estate of the deceased which is likely to be adversely affected by the grant of probate. A mere creditor or stranger with no claim in estate has no caveatable interest.',
      examTips: 'Crucial authority to cite on who can file a caveat opposing a probate petition in DU semester examinations.'
    }
  ],
  5: [
    {
      name: 'Gurbaksh Singh Sibbia v. State of Punjab',
      citation: '(1980) 2 SCC 565',
      facts: 'Constitution Bench decision examining whether restrictive limitations should be read into the judicial discretion to grant anticipatory bail under Section 438 CrPC.',
      issues: 'What are the principles and scope of discretion governing the grant of anticipatory bail by Sessions Courts and High Courts?',
      arguments: 'State contended that anticipatory bail should be granted only in exceptional and rare cases. Petitioners argued personal liberty under Article 21 requires wide judicial discretion without rigid fetters.',
      ratio: 'The power to grant anticipatory bail is wide and untrammeled by rigid formulas. The court must balance personal liberty against the need for effective investigation. Anticipatory bail can be granted before registration of FIR if reasonable apprehension of arrest on accusation of non-bailable offence exists.',
      examTips: 'Mandatory landmark Constitution Bench decision for drafting anticipatory bail applications under Section 438 CrPC / Section 482 BNSS.'
    },
    {
      name: 'Sushila Aggarwal v. State (NCT of Delhi)',
      citation: '(2020) 5 SCC 1',
      facts: 'Five-judge Constitution Bench resolved conflicting rulings on whether anticipatory bail must be limited in duration or continue until conclusion of trial.',
      issues: 'Whether anticipatory bail should be granted for a limited period or can continue till the culmination of trial.',
      arguments: 'One side relied on Mhetre holding no time limit. Other side relied on Salauddin holding bail must be for limited duration to enable accused to seek regular bail.',
      ratio: 'Anticipatory bail should not be routinely limited in duration; it normally continues till the culmination of trial unless special circumstances justify a time-limit. Imposing unreasonable restrictions on anticipatory bail impairs Article 21 personal liberty.',
      examTips: 'Indispensable recent Constitution Bench ruling to quote in DU Semester 5 bail drafting questions.'
    },
    {
      name: 'Dashrath Rupsingh Rathod v. State of Maharashtra',
      citation: '(2014) 9 SCC 129',
      facts: 'Examined territorial jurisdiction for filing Section 138 Negotiable Instruments Act complaints following dishonour of cheques.',
      issues: 'Which court has territorial jurisdiction to entertain a Section 138 NI Act criminal complaint?',
      arguments: 'Complainant argued jurisdiction exists where statutory notice was issued or received. Accused argued only where drawee bank is located.',
      ratio: 'Territorial jurisdiction lies exclusively where the drawee bank is situated where cheque is dishonoured. (Later amended by Parliament in Section 142(2) NI Act to place jurisdiction where payee maintains account if delivered for collection).',
      examTips: 'Essential for drafting jurisdiction paragraphs in Section 138 NI Act complaints.'
    }
  ],
  6: [
    {
      name: 'Lucknow Development Authority v. M.K. Gupta',
      citation: '(1994) 1 SCC 243',
      facts: 'Flat buyers complained against statutory housing authorities for excessive delay in delivery of possession and defective construction.',
      issues: 'Whether statutory development authorities and sovereign housing bodies are amenable to consumer jurisdiction under the Consumer Protection Act for deficiency in service.',
      arguments: 'Authority argued it performed statutory functions and did not provide commercial services. Complainant argued housing construction falls within definition of service.',
      ratio: 'Housing construction and allotment of plots by development authorities constitutes "service" under the Consumer Protection Act. Public authorities are liable for deficiency in service and arbitrary harassment of citizens.',
      examTips: 'Primary authority for drafting consumer complaints against real estate builders and statutory development authorities under CPA 2019.'
    },
    {
      name: 'S.R. Batra v. Taruna Batra',
      citation: '(2007) 3 SCC 169',
      facts: 'Wife filed application under Section 12 PWDVA 2005 seeking right of residence in a house owned exclusively by her mother-in-law.',
      issues: 'What constitutes a "shared household" under Section 2(s) and Section 17 of the Protection of Women from Domestic Violence Act, 2005?',
      arguments: 'Wife claimed right to reside in any house where she lived with her husband. In-laws argued property owned exclusively by mother-in-law is not a shared household.',
      ratio: 'A shared household means a house belonging to or taken on rent by the husband, or belonging to the joint family of which the husband is a member. (Later expanded by 3-judge bench in Satish Chander Ahuja (2020) 10 SCC 781 allowing residence even in mother-in-law’s house during subsistence of shared living).',
      examTips: 'Crucial for drafting residence applications under Section 12 & Section 17 of the PWDVA 2005.'
    }
  ],
  7: [
    {
      name: 'Ram Kumar Das v. Jagadish Chandra Deo',
      citation: 'AIR 1952 SC 23',
      facts: 'Tenancy created without registered instrument for manufacturing purposes; tenant paid rent annually. Landlord issued 15-day notice to quit under Section 106 TPA.',
      issues: 'How does Section 106 of the Transfer of Property Act operate when lease is not in writing or duration is unspecified?',
      arguments: 'Tenant argued lease was for manufacturing purposes requiring 6 months notice. Landlord argued periodic tenancy terminable by 15 days notice.',
      ratio: 'In the absence of a contract or local usage to the contrary, a lease of immovable property for agricultural or manufacturing purposes is deemed to be from year to year, terminable by 6 months notice; other leases are deemed month to month, terminable by 15 days notice.',
      examTips: 'Foundational authority for drafting statutory notices of termination of lease under Section 106 TPA.'
    }
  ]
};

// =========================================================================
// 2. INDUSTRIAL LAW (LB-503) UNITS CONFIGURATION
// =========================================================================
const INDUSTRIAL_UNITS = [
  {
    number: 1,
    file: 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html',
    title: 'Unit 1: Dispute Settlement under Industrial Relations Code, 2020',
    subtitle: 'LB-503 Industrial Law | Unit 1: Dispute Settlement under the Industrial Relations Code, 2020',
    statutes: ['S. 2(k) IDA', 'S. 2(q) IRC', 'S. 3 IRC', 'S. 4 IRC', 'S. 44 IRC', 'S. 49 IRC', 'S. 53 IRC'],
    topics: [
      'Constitutional & Statutory Philosophy of Dispute Settlement Machinery',
      'Definitions: Industrial Dispute, Workman, Industry, Settlement & Award',
      'Bi-partite Machinery: Works Committee & Grievance Redressal Committee',
      'Conciliation Machinery: Conciliation Officers & Boards of Conciliation',
      'Voluntary Arbitration & Industrial Tribunals under the 2020 Code'
    ]
  },
  {
    number: 2,
    file: 'SEM 5/Industrial law/IR_Code_Unit2_Reference_Notes.html',
    title: 'Unit 2: Reference of Industrial Disputes to Adjudicatory Authorities',
    subtitle: 'LB-503 Industrial Law | Unit 2: Reference of the Industrial Dispute (s.54 IR Code; Jurisdiction; Defective Reference)',
    statutes: ['S. 10 IDA', 'S. 54 IRC', 'S. 12(5) IDA', 'Art. 226 Const.'],
    topics: [
      'Power of Appropriate Government to Refer Disputes (S. 10 IDA / S. 54 IRC)',
      'Nature of Administrative Discretion: Subjective Satisfaction vs Objective Facts',
      'Judicial Review of Reference Orders & Writs of Mandamus / Certiorari',
      'Competence of Tribunal to Examine Validity of Reference & Incidental Matters'
    ]
  },
  {
    number: 3,
    file: 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html',
    title: 'Unit 3: Awards & Settlements — Binding Nature & Enforcement',
    subtitle: 'Unit 3 · Awards & Settlements — LB-503 Industrial Law · DU LL.B. V Term',
    statutes: ['S. 18 IDA', 'S. 19 IDA', 'S. 17 IDA', 'S. 17A IDA', 'S. 2(b) IDA', 'S. 2(p) IDA'],
    topics: [
      'Definition, Form & Contents of an Award vs Settlement',
      'Persons on Whom Settlements and Awards are Binding (S. 18 IDA / S. 58 IRC)',
      'Period of Operation, Duration and Termination of Awards & Settlements (S. 19)',
      'Withholding of Publication of Award: The Sirsilk Principle',
      'Judicial Review of Industrial Awards under Arts. 136 and 226 of the Constitution'
    ]
  },
  {
    number: 4,
    file: 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html',
    title: 'Unit 4: Managerial Prerogative & Disciplinary Action (Domestic Inquiry)',
    subtitle: 'Unit 4 · Managerial Prerogative & Disciplinary Action — LB-503 Industrial Law · DU LL.B. V Term',
    statutes: ['S. 11A IDA', 'S. 33 IDA', 'Industrial Employment (Standing Orders) Act 1946'],
    topics: [
      'Concept of Managerial Prerogative and Disciplinary Action for Misconduct',
      'Principles of Natural Justice in Domestic Inquiry (Nemo Judex & Audi Alteram Partem)',
      'Steps in Domestic Inquiry: Charge-sheet, Explanation, Inquiry Officer, Report & Punishment',
      'Effect of Defective or No Inquiry: Employer’s Right to Lead Evidence before Tribunal'
    ]
  },
  {
    number: 5,
    file: 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html',
    title: 'Unit 5: Powers of Adjudicatory Authorities & Doctrine of Proportionality',
    subtitle: 'Unit 5 · Powers of the Adjudicatory Authorities & Doctrine of Proportionality — LB-503 Industrial Law',
    statutes: ['S. 11A IDA', 'S. 44 IRC', 'Art. 136 Const.'],
    topics: [
      'Power of Tribunal to Give Appropriate Relief in Discharge or Dismissal (S. 11A)',
      'Scope of Appellate Jurisdiction under Section 11A: Reappreciation of Evidence',
      'Doctrine of Proportionality: Interference with Quantum of Punishment',
      'Reliefs: Reinstatement with Full Back Wages vs Lump Sum Compensation'
    ]
  },
  {
    number: 6,
    file: 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html',
    title: 'Unit 6: Restraints on Managerial Prerogatives (§33 & §33-A IDA)',
    subtitle: 'Unit 6 · Restraints on Managerial Prerogatives — §33 & §33-A IDA / §90 & §91 IRC',
    statutes: ['S. 33(1) IDA', 'S. 33(2)(b) IDA', 'S. 33A IDA', 'S. 90 IRC', 'S. 91 IRC'],
    topics: [
      'Object & Scope of Section 33: Preservation of Status Quo during Pendency of Proceedings',
      'Distinction between Section 33(1) (Connected Matters) and Section 33(2)(b) (Unconnected Matters)',
      'Mandatory Requirements of Section 33(2)(b): Action Taken, One Month Wages & Approval Application',
      'Section 33-A Complaint by Aggrieved Workman: Dual Jurisdiction of Tribunal',
      'Concept of Protected Workman and Special Statutory Safeguards'
    ]
  },
  {
    number: 7,
    file: 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html',
    title: 'Unit 7: Wages — Concepts, Kinds & The Code on Wages, 2019',
    subtitle: 'Unit 7 · Wages — Concept & Kinds (Minimum, Fair, Living Wage) & The Code on Wages, 2019',
    statutes: ['Code on Wages 2019', 'Minimum Wages Act 1948', 'Payment of Wages Act 1936', 'Payment of Bonus Act 1965', 'Art. 23 Const.', 'Art. 39(d) Const.'],
    topics: [
      'Concepts of Minimum Wage, Fair Wage and Living Wage (Crown Aluminium & Express Newspapers)',
      'The Industry-cum-Region Formula and Capacity to Pay (Greaves Cotton Rule)',
      'Revision of Minimum Wages & Linking with Consumer Price Index (Reptakos Brett)',
      'Statutory Framework under Code on Wages 2019: Floor Wage, Deductions & Claims',
      'Article 23 Constitutional Protection: Asiad Workers Case (PUDR v. Union of India)'
    ]
  },
  {
    number: 8,
    file: 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html',
    title: 'Unit 8: The Code on Social Security, 2020',
    subtitle: 'Unit 8 – The Code on Social Security, 2020 | LB-503 Industrial Law · Master Notes',
    statutes: ['Code on Social Security 2020', 'Employees’ Compensation Act 1923', 'Maternity Benefit Act 1961', 'Payment of Gratuity Act 1972'],
    topics: [
      'Consolidation of 9 Social Security Enactments under the 2020 Code',
      'Employees’ Compensation: Liability of Employer for Accidents Arising Out of & In Course of Employment',
      'Doctrine of Notional Extension of Employer’s Premises (Saurashtra Salt & BEST Cases)',
      'Maternity Benefit: Mandatory Leave, Cash Benefits & Crèche Facilities',
      'Gratuity: Eligibility, Continuous Service & Forfeiture Grounds',
      'Social Security for Gig Workers, Platform Workers & Unorganised Workers'
    ]
  }
];

// Helper to extract cases
function extractCases(content, fileRel, unitNumber, unitTitle, prefix) {
  const cases = [];
  let idx = 1;

  // Pattern 1: Split by <div class="case" or <div class="box case"
  const rawChunks = content.split(/<div class="(?:case|box case)"/gi);
  if (rawChunks.length > 1) {
    for (let i = 1; i < rawChunks.length; i++) {
      const chunk = rawChunks[i].substring(0, 3500); // look inside case block
      const cnameMatch = chunk.match(/<div class="cname">([\s\S]*?)<\/div>/i) ||
                         chunk.match(/<span class="tag">Case\s*[—–-]\s*([\s\S]*?)<\/span>/i) ||
                         chunk.match(/<h[34][^>]*>([\s\S]*?)<\/h[34]>/i);
      let title = cnameMatch ? stripHtml(cnameMatch[1]) : '';
      title = title.replace(/^[0-9·•\-—\s]+/, '').replace(/^Case\s*[—–-]\s*/i, '').trim();
      if (!title || title.length < 3) continue;

      const citMatch = chunk.match(/<div class="ccit">([\s\S]*?)<\/div>/i) ||
                       chunk.match(/<div class="cit">([\s\S]*?)<\/div>/i) ||
                       chunk.match(/<span class="cit">([\s\S]*?)<\/span>/i);
      let cite = citMatch ? stripHtml(citMatch[1]) : 'DU Prescribed Landmark Case';
      if (cite === 'DU Prescribed Landmark Case' && title.includes(',')) {
        const parts = title.split(',');
        if (parts.length > 1 && parts[1].match(/(?:AIR|\(\d{4}\)|SCR|SCC)/i)) {
          cite = parts.slice(1).join(',').trim();
          title = parts[0].trim();
        }
      }

      const factsMatch = chunk.match(/<dt>Facts<\/dt>\s*<dd>([\s\S]*?)<\/dd>/i) ||
                         chunk.match(/Facts[:\s]*<\/h[45]?>([\s\S]*?)(?=<h[45]|$)/i) ||
                         chunk.match(/<div class="blk facts">([\s\S]*?)<\/div>/i);
      const facts = factsMatch ? stripHtml(factsMatch[1]) : `Material facts as recorded in DU Case Material for Unit ${unitNumber}.`;

      const ratioMatch = chunk.match(/<dt>(?:Decision|Ratio|Ruling|Holding)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/i) ||
                         chunk.match(/(?:Decision|Ratio|Holding)[:\s]*<\/h[45]?>([\s\S]*?)(?=<h[45]|$)/i) ||
                         chunk.match(/<div class="blk ratio">([\s\S]*?)<\/div>/i);
      const ratio = ratioMatch ? stripHtml(ratioMatch[1]) : stripHtml(chunk).substring(0, 600);

      cases.push({
        id: `${prefix}-c-u${unitNumber}-${idx++}`,
        name: title,
        citation: cite,
        unitNumber: unitNumber,
        unit: unitTitle,
        file: fileRel,
        anchorId: `case-u${unitNumber}-${idx}`,
        facts: facts.substring(0, 750),
        issues: 'Core question of law, jurisdiction or statutory compliance examined by the bench.',
        arguments: 'Submissions advanced by respective parties on the relevant statutory provisions and judicial precedents.',
        ratio: ratio.substring(0, 850),
        examTips: 'High-yield landmark authority to cite for maximum marks in DU LL.B. semester examination answers.'
      });
    }
  }

  // Pattern 2: Split by <div class="casecard"
  if (cases.length === 0) {
    const cardChunks = content.split(/<div class="casecard"/gi);
    if (cardChunks.length > 1) {
      for (let i = 1; i < cardChunks.length; i++) {
        const chunk = cardChunks[i].substring(0, 3500);
        const h3Match = chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        let title = h3Match ? stripHtml(h3Match[1]) : '';
        title = title.replace(/^[0-9·•\-—\s]+/, '').trim();
        if (!title) continue;

        const citMatch = chunk.match(/<div class="cit"[^>]*>([\s\S]*?)<\/div>/i);
        const cite = citMatch ? stripHtml(citMatch[1]) : 'Supreme Court Landmark Authority';

        cases.push({
          id: `${prefix}-c-u${unitNumber}-${idx++}`,
          name: title,
          citation: cite,
          unitNumber: unitNumber,
          unit: unitTitle,
          file: fileRel,
          anchorId: `case-u${unitNumber}-${idx}`,
          facts: `Material factual matrix as digested in DU Case Material for ${unitTitle}.`,
          issues: 'Fundamental questions of law, statutory interpretation and natural justice.',
          arguments: 'Arguments of both sides on jurisdiction, industrial peace and proportional discipline.',
          ratio: stripHtml(chunk).substring(0, 650) + '...',
          examTips: 'Mandatory precedent to quote in Semester 5 examinations.'
        });
      }
    }
  }

  // Pattern 3: If drafting extra cases exist for this unit, add them
  if (prefix === 'draft' && DRAFTING_EXTRA_CASES[unitNumber]) {
    DRAFTING_EXTRA_CASES[unitNumber].forEach(ec => {
      cases.push({
        id: `${prefix}-c-u${unitNumber}-${idx++}`,
        name: ec.name,
        citation: ec.citation,
        unitNumber: unitNumber,
        unit: unitTitle,
        file: fileRel,
        anchorId: `case-u${unitNumber}-${idx}`,
        facts: ec.facts,
        issues: ec.issues,
        arguments: ec.arguments,
        ratio: ec.ratio,
        examTips: ec.examTips
      });
    });
  }

  return cases;
}

// Helper to extract PYQs
function extractPyqs(content, fileRel, unitNumber, unitTitle, prefix) {
  const pyqs = [];
  let idx = 1;

  // Split by <div class="pyq"
  const rawPyqs = content.split(/<div class="pyq"/gi);
  if (rawPyqs.length > 1) {
    for (let i = 1; i < rawPyqs.length; i++) {
      const chunk = rawPyqs[i].substring(0, 4500);
      const badgeMatch = chunk.match(/<span class="(?:badge|src)"[^>]*>([\s\S]*?)<\/span>/i);
      const year = badgeMatch ? stripHtml(badgeMatch[1]) : `DU Semester Exam`;

      const qMatch = chunk.match(/<span class="q"[^>]*>([\s\S]*?)<\/span>/i) ||
                     chunk.match(/<div class="q"[^>]*>([\s\S]*?)<\/div>/i);
      let qText = qMatch ? stripHtml(qMatch[1]) : '';
      if (!qText) qText = `Problem / Examination Question on ${unitTitle}`;

      const ansMatch = chunk.match(/<div class="ans"[^>]*>([\s\S]*?)<\/div>/i) ||
                       chunk.match(/<div class="pybody"[^>]*>([\s\S]*?)<\/div>/i);
      let ansText = ansMatch ? stripHtml(ansMatch[1]) : stripHtml(chunk).substring(0, 1500);

      pyqs.push({
        id: `${prefix}-pyq-u${unitNumber}-${idx++}`,
        unitNumber: unitNumber,
        unitTitle: unitTitle,
        year: year,
        marks: year.includes('20') ? '20 Marks' : (year.includes('15') ? '15 Marks' : (year.includes('10') ? '10 Marks' : 'DU Semester Exam')),
        type: qText.length > 200 ? 'Problem' : 'Essay',
        question: qText,
        modelAnswer: ansText
      });
    }
  }

  // Fallback if no div.pyq found: extract from <section id="pyq">
  if (pyqs.length === 0) {
    const pyqSection = content.match(/<section id="pyq"[\s\S]*?<\/section>/i);
    if (pyqSection) {
      const secText = pyqSection[0];
      const h3s = [...secText.matchAll(/<h[34][^>]*>([\s\S]*?)<\/h[34]>([\s\S]*?)(?=<h[34]|$)/gi)];
      for (const h of h3s) {
        pyqs.push({
          id: `${prefix}-pyq-u${unitNumber}-${idx++}`,
          unitNumber: unitNumber,
          unitTitle: unitTitle,
          year: 'DU LL.B. Recent Exam',
          marks: '20 Marks',
          type: 'Essay',
          question: stripHtml(h[1]),
          modelAnswer: stripHtml(h[2]).substring(0, 1500)
        });
      }
    }
  }

  // Generic fallback if still 0
  if (pyqs.length === 0) {
    pyqs.push({
      id: `${prefix}-pyq-u${unitNumber}-1`,
      unitNumber: unitNumber,
      unitTitle: unitTitle,
      year: 'DU LL.B. Recent Exam',
      marks: '20 Marks',
      type: 'Essay',
      question: `Examine the statutory framework and judicial principles governing ${unitTitle.replace(/^Unit \d+:\s*|^Topic \d+:\s*/, '')}. Discuss with leading Supreme Court authorities.`,
      modelAnswer: `### Model Answer Outline\n\n1. **Statutory Framework & Object:** Detail the primary provisions and legislative purpose.\n2. **Key Legal Issues & Interpretations:** Analyze the core controversies and principles settled by the Supreme Court.\n3. **Landmark Judicial Precedents:** Cite and discuss the ratio decidendi of leading cases.\n4. **Critical Analysis & Conclusion:** Synthesize the current legal position with practical examination takeaways.`
    });
  }

  return pyqs;
}

// Helper to extract revision capsule
function extractRevision(content, unitNumber, unitTitle, fileRel, prefix) {
  let tableRows = [
    ['Statutory Foundation', 'Mandatory compliance with procedural requirements & substantive criteria', 'DU Case Material Rule'],
    ['Judicial Doctrine', 'Application of natural justice, fair hearing & proportionality', 'Supreme Court Landmark Rulings'],
    ['Drafting & Exam Strategy', 'Identify cause of action, verify jurisdiction, relief sought & cite exact section numbers', 'Model Examination Takeaways']
  ];

  // If table exists in note, extract top 6 rows
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
    id: `${prefix}-rev-u${unitNumber}`,
    unitNumber: unitNumber,
    unitTitle: unitTitle,
    badge: `Unit ${unitNumber} Capsule`,
    title: `${unitTitle} — Rapid Revision Capsule`,
    anchorId: `rev-u${unitNumber}`,
    file: fileRel,
    type: 'Master Revision Capsule',
    table: {
      headers: ['Concept / Provision', 'Core Rule & Judicial Test', 'Landmark Precedent'],
      rows: tableRows
    },
    examStrategy: `Structure answers systematically: Statutory Provision → Essential Ingredients → Landmark Precedents → Application to Facts → Specific Relief.`,
    caseMap: `Authoritative decisions prescribed in University of Delhi Case Materials for ${unitTitle}.`
  };
}

// Build subject object
function buildSubject(subId, code, name, shortName, folder, unitsConfig, theme, prefix) {
  const units = [];
  let allCases = [];
  let allPyqs = [];
  let allRevisions = [];

  unitsConfig.forEach(u => {
    const fullPath = path.join(ROOT_DIR, u.file);
    let content = '';
    if (fs.existsSync(fullPath)) {
      content = fs.readFileSync(fullPath, 'utf8');
    }

    units.push({
      id: `${prefix}-u${u.number}`,
      number: u.number,
      title: u.title,
      subtitle: u.subtitle,
      file: u.file,
      statutes: u.statutes,
      topics: u.topics
    });

    const cases = extractCases(content, u.file, u.number, u.title, prefix);
    allCases = allCases.concat(cases);

    const pyqs = extractPyqs(content, u.file, u.number, u.title, prefix);
    allPyqs = allPyqs.concat(pyqs);

    const rev = extractRevision(content, u.number, u.title, u.file, prefix);
    allRevisions.push(rev);
  });

  return {
    id: subId,
    code: code,
    name: name,
    shortName: shortName,
    semester: 5,
    folder: folder,
    theme: theme,
    units: units,
    cases: allCases,
    pyqs: allPyqs,
    revisions: allRevisions
  };
}

// 1. Build Drafting
const draftingSubject = buildSubject(
  'drafting',
  'LB-502',
  'Drafting, Pleadings & Conveyance',
  'Drafting',
  'SEM 5/DRAFTING',
  DRAFTING_UNITS,
  {
    primary: '#1e3a5f',
    primaryDark: '#0d1b2a',
    primaryLight: '#2d547d',
    accent: '#c59b27',
    accentLight: '#faedcd',
    bgTint: '#f5f7fa',
    border: '#ccd5e1',
    badgeBg: '#e8eff8',
    badgeColor: '#1e3a5f',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 55%, #2d547d 100%)',
    tagline: 'Fundamental Rules of Pleading, Civil Plaints, Criminal Complaints, Matrimonial Petitions & Conveyancing Deeds',
    motto: 'Order VI CPC • Pleading Skills • Conveyancing Instruments',
    quote: 'Pleadings are the foundation of litigation; a defect in drafting can prove fatal to the cause of justice.',
    icon: 'fa-pen-nib'
  },
  'draft'
);

// 2. Build Industrial Law
const industrialSubject = buildSubject(
  'industrial',
  'LB-503',
  'Industrial Law',
  'Industrial Law',
  'SEM 5/Industrial law',
  INDUSTRIAL_UNITS,
  {
    primary: '#7c2d12',
    primaryDark: '#451a03',
    primaryLight: '#9a3412',
    accent: '#ea580c',
    accentLight: '#ffedd5',
    bgTint: '#fffaf5',
    border: '#fed7aa',
    badgeBg: '#ffedd5',
    badgeColor: '#7c2d12',
    gradient: 'linear-gradient(135deg, #451a03 0%, #7c2d12 55%, #9a3412 100%)',
    tagline: 'Industrial Relations Code 2020, Dispute Settlement, Strikes, Lockouts, Wage Determination & Social Security',
    motto: 'IR Code 2020 • Dispute Settlement • Code on Wages 2019',
    quote: 'Industrial law seeks to balance the conflicting interests of capital and labour to achieve social justice and economic peace.',
    icon: 'fa-industry'
  },
  'ind'
);

console.log('=== DRAFTING SUBJECT STATS ===');
console.log(`Units: ${draftingSubject.units.length}`);
console.log(`Cases: ${draftingSubject.cases.length}`);
console.log(`PYQs: ${draftingSubject.pyqs.length}`);
console.log(`Revisions: ${draftingSubject.revisions.length}`);

console.log('\n=== INDUSTRIAL LAW SUBJECT STATS ===');
console.log(`Units: ${industrialSubject.units.length}`);
console.log(`Cases: ${industrialSubject.cases.length}`);
console.log(`PYQs: ${industrialSubject.pyqs.length}`);
console.log(`Revisions: ${industrialSubject.revisions.length}`);

// Load existing data.js
const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);
const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

// Attach subjects
portalData.subjects['drafting'] = draftingSubject;
portalData.subjects['industrial'] = industrialSubject;

// Update semester 5
const sem5 = portalData.semesters.find(s => s.id === 5);
if (sem5) {
  sem5.active = true;
  sem5.badge = '2 Core Subjects Loaded (Drafting, Industrial Law)';
  sem5.description = 'Comprehensive study notes, DU landmark cases, past year examination questions, and rapid revision capsules for Drafting, Pleadings & Conveyance (LB-502) and Industrial Law (LB-503).';
  sem5.subjectIds = ['drafting', 'industrial'];
}

// Write back to data.js cleanly
const newJsContent = `// DU Law Notes Portal — Central Data Repository
// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules
// Comprehensive coverage across LL.B. syllabus

window.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};
`;

fs.writeFileSync(DATA_FILE, newJsContent, 'utf8');
console.log(`\n🎉 Successfully injected Drafting and Industrial Law into js/data.js!`);
console.log(`New data.js file size: ${(newJsContent.length / 1024 / 1024).toFixed(2)} MB`);
