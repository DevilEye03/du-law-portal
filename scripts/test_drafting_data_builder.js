const fs = require('fs');
const path = require('path');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// =========================================================================
// 1. DRAFTING (LB-502) EXTRACTION
// =========================================================================
function getDraftingData() {
  const cases = [];
  const pyqs = [];

  // --- TOPIC 1, 2, 3 ---
  const t1_3 = [
    { num: 1, title: 'Topic 1: Fundamental Rules & Skills of Pleadings', file: 'SEM 5/DRAFTING/Drafting_Rules_and_Skills_DU_LB502.html' },
    { num: 2, title: 'Topic 2: Forms of Pleadings — Civil Plaints & Applications', file: 'SEM 5/DRAFTING/Forms_of_Civil_Pleadings_DU_LB502.html' },
    { num: 3, title: 'Topic 3: Matrimonial Pleadings (HMA 1955)', file: 'SEM 5/DRAFTING/Matrimonial_Pleadings_DU_LB502.html' }
  ];

  t1_3.forEach(t => {
    const html = fs.readFileSync(t.file, 'utf8');
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

      let args = '';
      const argsPlMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Plaintiff[^<]*<\/h5>([\s\S]*?)<\/div>/i);
      const argsDefMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*Defendant[^<]*<\/h5>([\s\S]*?)<\/div>/i);
      const argsGenMatch = inner.match(/<div class=["']el["']><h5>Arguments[^<]*<\/h5>([\s\S]*?)<\/div>/i);
      if (argsPlMatch || argsDefMatch) {
        args = (argsPlMatch ? `<h6>Arguments — Plaintiff</h6>${cleanHtml(argsPlMatch[1])}` : '') +
               (argsDefMatch ? `<h6>Arguments — Defendant</h6>${cleanHtml(argsDefMatch[1])}` : '');
      } else if (argsGenMatch) {
        args = cleanHtml(argsGenMatch[1]);
      }

      let ratio = '';
      const decMatch = inner.match(/<div class=["']el["']><h5>Decision<\/h5>([\s\S]*?)<\/div>/i) ||
                       inner.match(/<div class=["']el["']><h5>Held<\/h5>([\s\S]*?)<\/div>/i);
      if (decMatch) ratio = cleanHtml(decMatch[1]);

      let principle = '';
      const princMatch = inner.match(/<div class=["']principle["']>([\s\S]*?)<\/div>/i);
      if (princMatch) principle = cleanHtml(princMatch[1]);

      cases.push({
        id: `draft-c-u${t.num}-${idx + 1}`,
        name,
        citation,
        unitNumber: t.num,
        unit: t.title,
        file: t.file,
        anchorId: `c${idx + 1}`,
        facts: facts || 'Refer to the dossier for extensive factual history.',
        issues: issues || 'Core questions of law and statutory compliance.',
        arguments: args || '',
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
        id: `draft-pyq-u${t.num}-${idx + 1}`,
        number: `Q${idx + 1}`,
        year,
        marks: year.includes('Marks') ? (year.match(/\d+\s*Marks/i)?.[0] || '20 Marks') : '20 Marks',
        type: question.toLowerCase().includes('draft') ? 'Drafting Model' : 'Essay',
        unitNumber: t.num,
        unit: t.title,
        file: t.file,
        anchorId: `pyq-u${t.num}-${idx + 1}`,
        question,
        modelAnswer
      });
    });
  });

  // --- TOPIC 4: Succession Act Pleadings ---
  {
    const file = 'SEM 5/DRAFTING/Succession_Act_Pleadings_DU_LB502.html';
    const title = 'Topic 4: Pleadings under Indian Succession Act, 1925';
    const html = fs.readFileSync(file, 'utf8');

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

      let args = '';
      const argsMatch = inner.match(/<p><b>Arguments[^<]*:?<\/b>([\s\S]*?)<\/p>/i);
      if (argsMatch) args = cleanHtml(argsMatch[1]);

      let ratio = '';
      const decMatch = inner.match(/<p><b>(?:Held|Decision|Ratio)[^<]*<\/b>([\s\S]*?)<\/p>/i);
      if (decMatch) ratio = cleanHtml(decMatch[1]);

      let principle = '';
      const princMatch = inner.match(/<p><b>Principle:?<\/b>([\s\S]*?)<\/p>/i) ||
                         inner.match(/<div class=["']principle["']>([\s\S]*?)<\/div>/i);
      if (princMatch) principle = cleanHtml(princMatch[1]);

      cases.push({
        id: `draft-c-u4-${idx + 1}`,
        name,
        citation,
        unitNumber: 4,
        unit: title,
        file,
        anchorId: `c4-${idx + 1}`,
        facts: facts || 'Refer to the Succession Act dossier for full case analysis.',
        issues: issues || 'Probate and testamentary execution issues.',
        arguments: args || '',
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
        id: `draft-pyq-u4-${idx + 1}`,
        number: `Q${idx + 1}`,
        year,
        marks: '20 Marks',
        type: 'Drafting Model',
        unitNumber: 4,
        unit: title,
        file,
        anchorId: `pyq-u4-${idx + 1}`,
        question,
        modelAnswer
      });
    });
  }

  // --- TOPIC 5: Criminal Law Pleadings ---
  {
    const file = 'SEM 5/DRAFTING/Pleadings_Under_Criminal_Law_DU_LB502.html';
    const title = 'Topic 5: Pleadings under Criminal Law & Special Enactments';
    const html = fs.readFileSync(file, 'utf8');

    // Cases from cards
    const d5CaseList = [
      {
        name: 'Sanjay Chandra & Ors. v. Central Bureau of Investigation',
        citation: '(2012) 1 SCC 40',
        facts: 'Appellants accused of economic offences in 2G spectrum allocation case; in custody over 6 months; chargesheet filed; high court rejected bail on grounds of gravity of economic offence.',
        issues: 'Whether bail is a rule and jail an exception in economic offences where trial is likely to take substantial time?',
        arguments: 'Appellants: No risk of flight, documents already seized by CBI, prolonged pre-trial incarceration violates Art. 21. CBI: Heinous economic scam of unprecedented magnitude; high social impact.',
        ratio: 'The primary purpose of bail is to secure attendance at trial; bail is the rule and committal to jail the exception. Deprivation of liberty before conviction must be considered as a measure of punishment only where there is real apprehension of flight or tampering. Incarceration in economic offences cannot be punitive pre-trial imprisonment.',
        principle: 'Bail jurisprudence: Bail is rule, jail exception. Seriousness of charge cannot be the sole consideration for refusing bail when investigation is complete and trial will take long.'
      },
      {
        name: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        facts: 'Wife filed complaint under Section 498-A IPC against husband and his family; anticipatory bail was dismissed by High Court; routine arrest practice challenged.',
        issues: 'Whether police officers can make routine arrests in offences punishable with imprisonment up to 7 years without satisfying Section 41 CrPC requirements?',
        arguments: 'Petitioner: Section 498-A IPC is weaponised for harassment; mechanical arrests without preliminary satisfaction violate liberty. State: Police have statutory prerogative to arrest accused in cognizable cases.',
        ratio: 'Police officers cannot make arrests merely because an offence is cognizable and non-bailable. In offences punishable with imprisonment up to 7 years, compliance with Section 41(1)(b) CrPC (now Section 35(3) BNSS) is mandatory. Police must serve Notice of Appearance under Section 41A (now S. 35(3) BNSS) within 2 weeks of complaint.',
        principle: 'Arrest guidelines: Notice under Section 41A CrPC (s. 35(3) BNSS) must precede arrest in offences under 7 years; Magistrate cannot authorize detention mechanically without recording independent satisfaction.'
      },
      {
        name: 'Gurbaksh Singh Sibbia v. State of Punjab',
        citation: '(1980) 2 SCC 565 (Constitution Bench, 5 Judges)',
        facts: 'Former Minister of Irrigation & Power challenged Full Bench decision of High Court imposing restrictive conditions on granting anticipatory bail under Section 438 CrPC.',
        issues: 'Whether Section 438 CrPC is subject to narrow restrictions not expressed in statute? Can anticipatory bail be blanket or unlimited?',
        arguments: 'Appellant: S. 438 is a beneficial provision in furtherance of Art. 21; wide judicial discretion cannot be fettered by court-made straightjackets. State: Anticipatory bail is extraordinary relief; needs special case.',
        ratio: 'Section 438 confers wide judicial discretion that cannot be cut down by reading restrictions not in statute. Anticipatory bail can be granted without filing of FIR if reasonable belief of arrest exists. However, blanket orders of protection cannot be passed without reference to specific accusations.',
        principle: 'The fountainhead of anticipatory bail: Section 438 CrPC (s. 482 BNSS) is an expression of personal liberty under Art. 21; broad discretion of Sessions and High Courts cannot be curtailed by rigid judge-made limitations.'
      },
      {
        name: 'Sushila Aggarwal v. State (NCT of Delhi)',
        citation: '(2020) 5 SCC 1 (Constitution Bench, 5 Judges)',
        facts: 'Conflicting decisions of Supreme Court referred to 5-Judge Bench on whether anticipatory bail must be limited to a fixed period till the filing of chargesheet.',
        issues: 'Does protection granted under Section 438 CrPC automatically lapse when accused is summoned or chargesheet is filed?',
        arguments: 'Petitioners: Sibbia held that anticipatory bail should not be fettered by time limits; once granted, it continues till end of trial. State: Public interest requires re-examination when chargesheet is filed.',
        ratio: 'Protection under Section 438 CrPC is not invariably limited to a fixed period; it normally continues till the conclusion of trial unless there are special circumstances requiring curtailment. Anticipatory bail can be granted even after chargesheet is filed if reasonable belief of arrest remains.',
        principle: 'Anticipatory bail duration: Continues till conclusion of trial unless revoked for violation of conditions or special circumstances; filing of chargesheet does not automatically end bail protection.'
      },
      {
        name: 'K. Bhaskaran v. Sankaran Vaidhyan Balan',
        citation: '(1999) 7 SCC 510',
        facts: 'Complainant filed Section 138 complaint before magistrate in whose jurisdiction cheque was presented; accused contested territorial jurisdiction arguing cheque was drawn elsewhere.',
        issues: 'Which Magistrate has territorial jurisdiction to try an offence under Section 138 of the Negotiable Instruments Act?',
        arguments: 'Complainant: Offence comprises 5 components; any court where one component took place has jurisdiction under Section 177/178 CrPC. Accused: Drawer’s bank location alone gives jurisdiction.',
        ratio: 'The offence under Section 138 NI Act is not committed solely by bouncing of cheque, but by failure to pay after statutory demand notice. The offence is completed only through 5 distinct acts: (1) drawing, (2) presentation, (3) dishonour, (4) notice, (5) failure to pay. Complaint can be filed at any of these 5 places under Sections 177 and 178 CrPC.',
        principle: 'Section 138 NI Act statutory elements: 5 essential components of cheque dishonour offence. Territorial jurisdiction governed by S. 142(2) NI Act (amended in 2015 based on this foundation).'
      },
      {
        name: 'Mohd. Ahmed Khan v. Shah Bano Begum',
        citation: '(1985) 2 SCC 556',
        facts: 'Husband divorced 62-year-old wife by irrevocable talaq; wife claimed maintenance under Section 125 CrPC; husband contended personal Muslim law limited liability to Iddat period only.',
        issues: 'Does Section 125 CrPC apply to Muslim divorced women notwithstanding personal law provisions?',
        arguments: 'Husband: Section 125 cannot override Muslim personal law under which maintenance ceases after iddat. Wife: Section 125 is a secular, criminal-law measure designed to prevent destitution regardless of religion.',
        ratio: 'Section 125 CrPC is a secular provision of social justice designed to prevent vagrancy and destitution; it applies to all citizens irrespective of religion. Religion of the parties has no relevance. A divorced Muslim wife is entitled to maintenance beyond iddat period if she is unable to maintain herself and has not remarried.',
        principle: 'Secular scope of Section 125 CrPC (s. 144 BNSS): Speedier, summary remedy against vagrancy overrides personal law restrictions; husband’s moral and statutory obligation is non-negotiable.'
      }
    ];

    d5CaseList.forEach((c, idx) => {
      cases.push({
        id: `draft-c-u5-${idx + 1}`,
        name: c.name,
        citation: c.citation,
        unitNumber: 5,
        unit: title,
        file,
        anchorId: `c5-${idx + 1}`,
        facts: c.facts,
        issues: c.issues,
        arguments: c.arguments,
        ratio: c.ratio,
        principleEvolved: c.principle,
        examTips: 'High-yield criminal pleading authority cited in DU examination answers.'
      });
    });

    // PYQs from Section 8
    const qSec = html.indexOf('DU Semester Questions + Best Model Answers');
    const qSecEnd = html.indexOf('Where Criminal Pleadings Go Wrong');
    const qHtml = html.slice(qSec, qSecEnd !== -1 ? qSecEnd : qSec + 15000);
    const cards = qHtml.match(/<div class=["']card (?:blue|green|orange|violet|gold|red)["']>[\s\S]*?<\/div>\s*(?=<div class=["']card|<\/section>|$)/gi) || [];

    cards.forEach((c, idx) => {
      const ctMatch = c.match(/<div class=["']ct["']>([\s\S]*?)<\/div>/i);
      const ct = ctMatch ? ctMatch[1] : `Question ${idx + 1}`;
      const year = ct.match(/DU\s*\d{4}[^:—]*|KAMKUS\s*Q\.\d+/i)?.[0] || 'DU Past Paper';
      const qText = ct.replace(/<[^>]+>/g, '').trim();
      const ansBody = c.replace(/<div class=["']ct["']>[\s\S]*?<\/div>/i, '').trim();

      pyqs.push({
        id: `draft-pyq-u5-${idx + 1}`,
        number: `Q${idx + 1}`,
        year: cleanHtml(year),
        marks: '20 Marks',
        type: 'Drafting Model',
        unitNumber: 5,
        unit: title,
        file,
        anchorId: `pyq-u5-${idx + 1}`,
        question: qText,
        modelAnswer: cleanHtml(ansBody)
      });
    });
  }

  // --- TOPIC 6: Other Miscellaneous Pleadings ---
  {
    const file = 'SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html';
    const title = 'Topic 6: Miscellaneous Petitions — Consumer, Contempt & DV Act';
    const html = fs.readFileSync(file, 'utf8');

    const d6CaseList = [
      {
        name: 'Lucknow Development Authority v. M.K. Gupta',
        citation: '(1994) 2 SCC 1',
        facts: 'Complainants suffered due to deliberate delay and harassment in allotment of flats by statutory development authority; filed consumer complaint for deficiency in housing construction service.',
        issues: 'Whether statutory development authorities fall within the definition of "service" under the Consumer Protection Act? Can exemplary damages be awarded against errant public officers?',
        arguments: 'Authority: Statutory authorities exercising statutory duties are not traders or service providers; sovereign/administrative function. Complainant: Housing construction is a commercial amenity service for consideration.',
        ratio: 'Public authorities engaged in developmental or housing construction activities provide "service" within the meaning of the Consumer Protection Act. When a public servant acts arbitrarily or maliciously causing loss and harassment to a citizen, the Commission has the jurisdiction not only to compensate the consumer but to direct recovery of damages from the salary of erring officers.',
        principle: 'Deficiency in public services: Government housing and infrastructure corporations subject to Consumer Protection Act; public servants personally accountable for oppressive delay and bad faith.'
      },
      {
        name: 'Baradakanta Mishra v. Registrar of Orissa High Court',
        citation: '(1974) 1 SCC 374 (Constitution Bench, 5 Judges)',
        facts: 'Subordinate judicial officer suspended by High Court; filed memo alleging bias against Chief Justice and High Court administration, suggesting court acted corruptly.',
        issues: 'What constitutes criminal contempt under Section 2(c) of Contempt of Courts Act, 1971? Can administrative acts of High Court be separated from judicial acts for scandalising the court?',
        arguments: 'Appellant: Criticism directed at administrative action of High Court, not judicial adjudication; fair criticism of administrative conduct does not lower dignity of court. State: Undermining integrity of judicial institution amounts to scandalisation.',
        ratio: 'Scandalising the court is not confined to attacks on judges in their adjudicatory functions, but extends to scurrilous attacks on the administration of justice as a whole. An attack on the integrity, impartiality, or fairness of the High Court even in administrative supervision impairs public confidence in justice and constitutes criminal contempt under Section 2(c).',
        principle: 'Criminal contempt threshold: Scandalisation encompasses attacks on judicial integrity and administrative functioning that lower the authority of the court in the estimation of the public.'
      },
      {
        name: 'In re Vinay Chandra Mishra',
        citation: '(1995) 2 SCC 584',
        facts: 'Senior advocate hurled abuse, shouted, and threatened a sitting Judge of Allahabad High Court in open court during hearing of a civil revision petition; High Court referred for criminal contempt.',
        issues: 'Can the Supreme Court punish for contempt of High Court and suspend advocate’s licence under Article 129/142 of Constitution?',
        arguments: 'Contemnor: Tendered conditional apology; argued Bar Council alone has disciplinary authority to suspend licence under Advocates Act 1961.',
        ratio: 'Grossly disrespectful and threatening conduct toward a judge in open court amounts to criminal contempt of the highest order. The court’s power to punish for contempt under Article 129 is plenary and inherent. (Note: The part regarding suspension of licence was later overruled in Supreme Court Bar Association v. UOI (1998) 4 SCC 409, holding Bar Council retains exclusive disciplinary power).',
        principle: 'Contempt in the face of the court: Threatening and intimidating judges in open court is criminal contempt that strikes at the root of the administration of justice.'
      },
      {
        name: 'Hiral P. Harsora & Ors. v. State of Maharashtra',
        citation: '(2016) 9 SCC 1 (3 Judges)',
        facts: 'Wife filed complaint under Section 12 PWDVA against husband and also named female relatives (mother-in-law, sister-in-law); Section 2(q) restricted respondent to "adult male person".',
        issues: 'Is the restriction in Section 2(q) PWDVA limiting respondents to "adult male person" violative of Article 14 of the Constitution?',
        arguments: 'Petitioners: Violence against women in shared household is often perpetrated by female relatives; restricting respondent to adult males denies effective relief. Opponents: Statute aimed at patriarchal violence by husbands.',
        ratio: 'The words "adult male" in Section 2(q) of the Protection of Women from Domestic Violence Act, 2005 are unconstitutional and struck down as violating Article 14. Domestic violence can be perpetrated by female relatives as well as male relatives; an aggrieved woman can implead any person residing in the shared household as a respondent.',
        principle: 'Gender-neutral respondents under PWDVA: Any person (male or female) who is or was in a domestic relationship with the aggrieved woman and subjected her to domestic violence can be impleaded as a respondent.'
      }
    ];

    d6CaseList.forEach((c, idx) => {
      cases.push({
        id: `draft-c-u6-${idx + 1}`,
        name: c.name,
        citation: c.citation,
        unitNumber: 6,
        unit: title,
        file,
        anchorId: `c6-${idx + 1}`,
        facts: c.facts,
        issues: c.issues,
        arguments: c.arguments,
        ratio: c.ratio,
        principleEvolved: c.principle,
        examTips: 'Prescribed miscellaneous pleading landmark.'
      });
    });

    // 6 Expected Exam Frames from Section 7
    const d6PyqsList = [
      {
        num: 'F1',
        year: 'DU Expected Frame 1 · CPA 2019',
        q: '“Draft a consumer complaint under the Consumer Protection Act, 2019 before the District Commission for deficiency in service against a telecom service provider / builder.”',
        ans: `### MODEL DRAFTING ANSWER — CONSUMER COMPLAINT (s. 35 CPA 2019)\n\n**1. Cause Title & Heading:**\nBEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION AT NEW DELHI\nCONSUMER COMPLAINT NO. _____ OF 2026\nIN THE MATTER OF: Complainant (Name, Address, Contact) VS Opposite Party (Service Provider / Company through Managing Director, Registered Office)\nCOMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE\n\n**2. Essential Averments:**\n- **¶1 Consumer Status:** Complainant is a 'consumer' under S. 2(7) CPA 2019, having hired/availed services for consideration.\n- **¶2 Service Transaction:** Details of subscription/contract dated ____, consideration paid of ₹____ vide receipt Annexure C-1.\n- **¶3-5 Deficiency:** Opposite Party failed to deliver agreed services; details of breakdown, neglect, and failure to rectify despite repeated complaints (Annexure C-2).\n- **¶6 Legal Notice:** Statutory notice of demand served on _____ (Annexure C-3); Opposite Party either replied with untenable excuses or failed to respond.\n- **¶7 Cause of Action:** Arose on date of transaction, subsisted on repeated failures, and within 2-year limitation under Section 69 CPA 2019.\n- **¶8 Jurisdiction:** Transaction within territorial jurisdiction of Commission (S. 34(2)); claim amount under ₹50 Lakhs satisfies pecuniary threshold under Consumer Protection (Jurisdiction of Commission) Rules, 2021.\n\n**3. Prayer Clause:**\n- Direct Opposite Party to refund consideration with 12% interest p.a.\n- Direct payment of ₹1,00,000 as compensation for mental agony, harassment and financial loss.\n- Award ₹25,000 towards litigation costs.\n- Verification and Supporting Affidavit under Order VI CPC discipline.`
      },
      {
        num: 'F2',
        year: 'DU Expected Frame 2 · Theory',
        q: '“What is a consumer complaint? Explain the three-tier redressal machinery, pecuniary jurisdiction, and limitation under the Consumer Protection Act, 2019.”',
        ans: `### MODEL ANSWER — THREE-TIER CONSUMER MACHINERY & JURISDICTION\n\n**1. Definition of Consumer Complaint:** Under Section 2(6) CPA 2019, a complaint is an allegation in writing made by a consumer regarding unfair trade practices, defects in goods, deficiencies in service, overcharging, or hazardous goods.\n\n**2. Three-Tier Redressal Hierarchy:**\n- **District Commission (S. 34):** Pecuniary jurisdiction up to ₹50 Lakhs (per Jurisdiction Rules 2021; Act initially provided up to ₹1 Crore).\n- **State Commission (S. 47):** Claims exceeding ₹50 Lakhs up to ₹2 Crores; appellate jurisdiction over District Commission orders.\n- **National Commission (NCDRC) (S. 58):** Claims exceeding ₹2 Crores; appellate jurisdiction over State Commission orders.\n\n**3. Limitation (Section 69):** Complaint must be filed within **2 years** from the date on which cause of action arose. Delay may be condoned if sufficient cause is shown in writing.\n\n**4. Landmark Precedent:** *Lucknow Development Authority v. M.K. Gupta* (1994) 2 SCC 1 — statutory authorities providing amenities are amenable to consumer jurisdiction.`
      },
      {
        num: 'F3',
        year: 'DU Expected Frame 3 · Contempt',
        q: '“Draft a Contempt Petition under Sections 11 and 12 of the Contempt of Courts Act, 1971 for deliberate disobedience of an ad-interim injunction order passed by the High Court.”',
        ans: `### MODEL DRAFTING ANSWER — CONTEMPT PETITION (ss. 11 & 12)\n\n**1. Heading:**\nIN THE HIGH COURT OF DELHI AT NEW DELHI\nCONTEMPT PETITION (CIVIL) NO. _____ OF 2026\nIN CIVIL WRIT / SUIT NO. _____ OF 2025\nIN THE MATTER OF: Petitioner (Aggrieved Party) VERSUS Contemnor / Respondent (Delinquent Authority / Party)\nPETITION UNDER SECTIONS 11 AND 12 OF THE CONTEMPT OF COURTS ACT, 1971 READ WITH ARTICLE 215 OF THE CONSTITUTION OF INDIA\n\n**2. Core Pleading Paras:**\n- **¶1 Order Disobeyed:** High Court passed status-quo / restraint order on _____ directing Respondent not to demolish / interfere with possession.\n- **¶2 Knowledge:** Respondent had full knowledge and was duly served on _____ vide process / speed post / email (Annexure P-1).\n- **¶3 Wilful Disobedience:** On _____, Respondent deliberately, contumaciously, and in open defiance entered suit premises and began demolition.\n- **¶4 Limitation:** Filed within 1 year of contempt as mandated by Section 20 of the Act.\n- **¶5 Prayer:** Initiate contempt proceedings, punish contemnor under Section 12, and restore status quo ante.`
      },
      {
        num: 'F4',
        year: 'DU Expected Frame 4 · Contempt Theory',
        q: '“Distinguish between Civil and Criminal Contempt. What are the statutory defences available under the Contempt of Courts Act, 1971?”',
        ans: `### MODEL ANSWER — CIVIL VS CRIMINAL CONTEMPT & DEFENCES\n\n**1. Statutory Distinction (Section 2):**\n- **Civil Contempt [S. 2(b)]:** Wilful disobedience to any judgment, decree, direction, order, writ, or other process of a court, or wilful breach of an undertaking given to a court. Focus: private injury and enforcement of orders.\n- **Criminal Contempt [S. 2(c)]:** Publication of any matter or doing of any act which (i) scandalises or tends to lower the authority of any court, or (ii) prejudices or interferes with the due course of judicial proceedings, or (iii) obstructs administration of justice in any manner.\n\n**2. Statutory Defences (Sections 3 to 13):**\n- Innocent publication and distribution without reason to believe proceeding pending (S. 3).\n- Fair and accurate report of judicial proceedings (S. 4).\n- Fair criticism of judicial act on merits after disposal (S. 5).\n- Complaint against presiding officer made in good faith (S. 6).\n- **Truth as a Valid Defence [Section 13(b)]:** Inserted by 2006 Amendment — court may permit truth as a defence if satisfied it is in public interest and request is bona fide.\n\n**3. Limitation:** Section 20 prescribes strict 1-year limitation from the date on which contempt is alleged to have been committed.`
      },
      {
        num: 'F5',
        year: 'DU Expected Frame 5 · PWDVA 2005',
        q: '“Draft an Application under Section 12 of the Protection of Women from Domestic Violence Act, 2005 seeking protection, residence, and monetary relief.”',
        ans: `### MODEL DRAFTING ANSWER — SECTION 12 PWDVA COMPLAINT\n\n**1. Heading:**\nIN THE COURT OF LEARNED METROPOLITAN MAGISTRATE (MAHILA COURT), DELHI\nAPPLICATION NO. _____ OF 2026\nIN THE MATTER OF: Aggrieved Person (Wife) VERSUS Respondents (Husband and in-laws)\nAPPLICATION UNDER SECTION 12 OF THE PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005 SEEKING RELIEFS UNDER SECTIONS 18, 19, 20, AND 22\n\n**2. Core Pleading Paras:**\n- **¶1 Domestic Relationship & Shared Household:** Marriage solemnized on _____; parties lived together in shared household at _____.\n- **¶2 Incidents of Domestic Violence:** Physical, verbal, emotional, and economic abuse detailed with dates, medical reports, and demands for dowry.\n- **¶3 Dispossession:** Aggrieved woman thrown out of shared household on _____ without means of subsistence.\n- **¶4 Reliefs Claimed:**\n  - Protection Order under Section 18 restraining violence and entry.\n  - Residence Order under Section 19 securing right to reside in shared household or alternative accommodation.\n  - Monetary Relief under Section 20 for maintenance of ₹25,000 p.m. and medical expenses.\n  - Compensation under Section 22 for emotional distress.\n- **¶5 Interim Ex-parte Relief:** Section 23 affidavit attached.`
      },
      {
        num: 'F6',
        year: 'DU Expected Frame 6 · DV Act Theory',
        q: '“Explain the concept of ‘Domestic Violence’ and ‘Shared Household’ under the PWDVA, 2005 in light of recent Supreme Court rulings.”',
        ans: `### MODEL ANSWER — DOMESTIC VIOLENCE & SHARED HOUSEHOLD\n\n**1. Domestic Violence (Section 3):** Exhaustive definition encompassing: (a) Physical abuse; (b) Sexual abuse; (c) Verbal and emotional abuse (insults, ridicule, humiliation); (d) Economic abuse (deprivation of financial resources, stridhan, disposal of assets).\n\n**2. Shared Household (Section 2(s)):** A household where the person aggrieved lives or at any stage has lived in a domestic relationship either singly or along with the respondent.\n\n**3. Landmark Judicial Evolution:**\n- *S.R. Batra v. Taruna Batra* (2007) 3 SCC 169: Narrow view that shared household meant only house owned by husband or joint family.\n- **Overruled in *Satish Chander Ahuja v. Sneha Ahuja* (2020) 10 SCC 788:** Shared household is not restricted to property owned by husband; living in property belonging to parents-in-law where parties resided together confers statutory protection against arbitrary eviction under S. 19.\n- *Hiral P. Harsora v. State of Maharashtra* (2016) 9 SCC 1: "Adult male" in Section 2(q) struck down — female relatives can be respondents.`
      }
    ];

    d6PyqsList.forEach((p, idx) => {
      pyqs.push({
        id: `draft-pyq-u6-${idx + 1}`,
        number: p.num,
        year: p.year,
        marks: '20 Marks',
        type: p.q.toLowerCase().includes('draft') ? 'Drafting Model' : 'Essay',
        unitNumber: 6,
        unit: title,
        file,
        anchorId: `pyq-u6-${idx + 1}`,
        question: p.q,
        modelAnswer: cleanHtml(p.ans)
      });
    });
  }

  // --- TOPIC 7: Conveyancing ---
  {
    const file = 'SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html';
    const title = 'Topic 7: Conveyancing — Deeds, Instruments & Statutory Notices';
    const html = fs.readFileSync(file, 'utf8');

    const d7CaseList = [
      {
        name: 'Suraj Lamp & Industries Pvt. Ltd. v. State of Haryana',
        citation: '(2012) 1 SCC 656',
        facts: 'Widespread practice of transferring immovable properties through General Power of Attorney (GPA), Agreement to Sell, Will, and Affidavit (SA/GPA/WILL transfers) to evade stamp duty, registration charges, and capital gains tax.',
        issues: 'Does a transaction of sale through Agreement to Sell, GPA, and Will convey title or create ownership rights in immovable property?',
        arguments: 'Transferees: GPA transactions have been commercially recognized and customary practice for decades in Delhi and surrounding regions. State: Section 54 TPA and Section 17 Registration Act mandate registered deed of conveyance; GPA is merely agency.',
        ratio: 'A transfer of immovable property by way of sale can only be made by a deed of conveyance (Sale Deed) duly stamped and registered as required by law under Section 54 of the Transfer of Property Act and Section 17 of the Registration Act. SA/GPA/WILL transfers do not convey any title nor do they amount to transfer of, or create any interest in, immovable property. GPA cannot be used to circumvent statutory conveyance.',
        principle: 'GPA Sales Invalidity: Immovable property transfer requires registered sale deed. A power of attorney is not an instrument of transfer in regard to any right, title or interest in an immovable property.'
      },
      {
        name: 'K.B. Saha & Sons Pvt. Ltd. v. Development Consultant Ltd.',
        citation: '(2008) 8 SCC 564',
        facts: 'Lease agreement for a period of three years was unregistered; landlord filed eviction suit based on a negative covenant in the unregistered lease prohibiting sub-letting.',
        issues: 'Can an unregistered lease deed required to be registered under Section 17(1)(d) Registration Act be admitted in evidence to prove a negative covenant under Section 49 proviso?',
        arguments: 'Landlord: Proviso to Section 49 allows receipt of unregistered document as evidence of collateral transaction. Tenant: Proving terms of lease is not a collateral purpose.',
        ratio: 'A document required to be registered cannot be used to prove terms of the lease itself under the guise of collateral transaction. A collateral transaction must be independent of, or divisible from, the transaction required to be registered. A covenant in a lease deed is an integral term of the lease and cannot be proved if the document is unregistered.',
        principle: 'Unregistered documents & collateral purpose (S. 49 Registration Act): Collateral purpose cannot be used to prove primary terms, obligations, or covenants of an unregistered transaction.'
      },
      {
        name: 'V.M. Salgaocar & Bros. v. Board of Trustees of Port of Mormugao',
        citation: '(2005) 4 SCC 613',
        facts: 'Suit filed against port trust without giving statutory notice under Section 120 of Major Port Trusts Act, 1963; effect of mandatory statutory notice examined.',
        issues: 'Is compliance with statutory notice a condition precedent to filing suit against statutory/governmental authority? Can such notice be waived?',
        arguments: 'Plaintiff: Substantial compliance with notice; notice is mere formality. Authority: Mandatory condition precedent going to root of maintainability.',
        ratio: 'Statutory notice under Section 80 CPC (or analogous provisions) is a mandatory condition precedent. The object is to give the government or authority an opportunity to examine the legal basis of the claim and settle without public litigation. Suit filed without compliance or valid exemption is bad in law.',
        principle: 'Mandatory nature of statutory notice: Statutory notices under S. 80 CPC / S. 106 TPA are mandatory procedural safeguards and must be pleaded specifically.'
      },
      {
        name: 'Jadunath Roy v. Rup Lal Mullick',
        citation: 'ILR (1906) 33 Cal 507',
        facts: 'Mortgage deed drafted with ambiguity regarding whether interest was payable simple or compound, and whether power of sale arose on single default.',
        issues: 'How must ambiguous clauses in deeds and conveyances be construed by courts?',
        arguments: 'Mortgagor: Deeds must be construed strictly against the drafter. Mortgagee: Plain commercial intention of parties must govern.',
        ratio: 'A deed must be construed as a whole (ex antecedentibus et consequentibus fit optima interpretatio). Words in an indenture are to be construed in their ordinary grammatical meaning, and where there is ambiguity, the document must be construed contra proferentem (against the party who drew it).',
        principle: 'Interpretation of deeds: Golden rule of harmonious construction; deed must be read in its entirety to deduce the true intention of the executing parties.'
      }
    ];

    d7CaseList.forEach((c, idx) => {
      cases.push({
        id: `draft-c-u7-${idx + 1}`,
        name: c.name,
        citation: c.citation,
        unitNumber: 7,
        unit: title,
        file,
        anchorId: `c7-${idx + 1}`,
        facts: c.facts,
        issues: c.issues,
        arguments: c.arguments,
        ratio: c.ratio,
        principleEvolved: c.principle,
        examTips: 'Core landmark authority in Indian conveyancing jurisprudence.'
      });
    });

    // 8 Question Bank Models from Section 12
    const d7PyqsList = [
      {
        num: 'Q1',
        year: 'DU / KAMKUS Q.2',
        q: '“What is a Deed? Explain the formal parts (components A to N) of a deed with their legal significance.”',
        ans: `### MODEL ANSWER — COMPONENT PARTS OF A DEED (A TO N)\n\n**1. Definition:** A deed is a formal legal instrument in writing, signed, sealed (in English law) and delivered, by which an interest, right, or property is transferred or an obligation created. In India, deeds are governed by the Transfer of Property Act 1882, Registration Act 1908, and Indian Stamp Act 1899.\n\n**2. Anatomy — The Formal Parts (A to N):**\n- **A. Description / Title:** States the nature of the deed (e.g., “THIS DEED OF SALE”, “THIS INDENTURE OF LEASE”).\n- **B. Date:** Essential for limitation, registration (4 months under S. 23 Registration Act), and priority.\n- **C. Parties (Inter Partes):** Full names, parentage, age, residence, and capacity (e.g., Karta, Partner, Director).\n- **D. Recitals (Narrative & Introductory):** Commences with “WHEREAS…”. Recites history of vendor’s title and agreement between parties. Creates estoppel.\n- **E. Testatum (Operative Witnessing Clause):** “NOW THIS DEED WITNESSETH AS FOLLOWS:”.\n- **F. Consideration Clause:** Explicitly states consideration amount in figures and words.\n- **G. Receipt Clause:** Acknowledges receipt of payment (“the receipt whereof the vendor doth hereby admit and acknowledge”).\n- **H. Operative Words:** Transferring words (“doth hereby grant, transfer, convey and assign”).\n- **I. Parcels (Property Description):** Accurate physical description, boundary measurements, municipal number, schedule.\n- **J. Exceptions & Reservations:** Any rights withheld (easements, mineral rights).\n- **K. Habendum:** “TO HAVE AND TO HOLD…”. Defines estate or interest granted (absolute ownership, life estate).\n- **L. Covenants:** Express undertakings (good title, quiet enjoyment, encumbrance-free per S. 55 TPA).\n- **M. Testimonium:** Attestation clause: “IN WITNESS WHEREOF the parties have set their hands…”.\n- **N. Signatures & Attestation:** Execution by parties + attestation by minimum two witnesses (S. 59 TPA / S. 68 Evidence Act).`
      },
      {
        num: 'Q2',
        year: 'DU / KAMKUS Q.24',
        q: '“Draft a Deed of Sale of Joint Family Property executed by the Karta for legal necessity.”',
        ans: `### MODEL DRAFTING ANSWER — SALE DEED BY KARTA (LEGAL NECESSITY)\n\n**1. Title:** THIS DEED OF SALE is executed at New Delhi on this ___ day of _______ 2026.\n**2. Parties:** Sh. Ramesh Chand, aged ___ years, son of late Sh. ______, resident of _______, acting in his capacity as the **KARTA and Manager of the Joint Hindu Undivided Family** comprising himself and his minor coparceners (hereinafter called the VENDOR) OF THE FIRST PART; AND Sh. Suresh Kumar (PURCHASER) OF THE SECOND PART.\n**3. Recitals of Legal Necessity:**\n- WHEREAS the Vendor as Karta is in possession of ancestral property described in Schedule A.\n- AND WHEREAS the said HUF is in urgent need of funds for **payment of debts binding on family / medical treatment / education of coparceners**, constituting **legal necessity (legal necessity under Hindu Law)**.\n- AND WHEREAS the Vendor after diligent effort has agreed to sell the property for consideration of ₹50,00,000/-.\n**4. Operative Part & Covenants:**\n- Consideration paid and acknowledged.\n- Transfer of absolute ownership, peaceful physical possession delivered.\n- Covenant of indemnity by Karta against any claim by other coparceners upon attaining majority.\n**5. Schedule of Property, Testimonium & Attestation by two witnesses.**`
      },
      {
        num: 'Q3',
        year: 'DU / KAMKUS Q.25',
        q: '“Draft a Statutory Notice under Section 106 of the Transfer of Property Act, 1882 terminating a monthly tenancy on grounds of arrears of rent.”',
        ans: `### MODEL DRAFTING ANSWER — NOTICE UNDER S. 106 TPA\n\n**REGISTERED A.D. / SPEED POST**\nDate: _________\nTo: Sh. Tenant (Name & Address of Leased Premises)\nSir,\nUnder instructions from and on behalf of my client Sh. Landlord, I hereby serve upon you this NOTICE under Section 106 of the Transfer of Property Act, 1882:\n1. That you were inducted as a monthly tenant in respect of premises bearing No. _____ at monthly rent of ₹15,000/- excluding electricity and water charges.\n2. That you have defaulted in payment of rent since ______ (total arrears: ₹45,000/-).\n3. That my client hereby **TERMINATES your monthly tenancy** upon the expiry of **fifteen (15) days** from the date of receipt of this notice.\n4. You are hereby called upon to quit, vacate, and deliver peaceful physical possession to my client on or before _____ and pay the outstanding arrears.\n5. Take notice that in default, my client will initiate eviction proceedings and claim mesne profits at market rate of ₹1,000/- per day.\nYours faithfully, [Advocate Signature & Address]`
      },
      {
        num: 'Q4',
        year: 'DU / KAMKUS Q.26',
        q: '“Draft a Special Power of Attorney (SPA) authorizing an agent to execute a sale deed and present it for registration before the Sub-Registrar.”',
        ans: `### MODEL DRAFTING ANSWER — SPECIAL POWER OF ATTORNEY (SPA)\n\n**KNOW ALL MEN BY THESE PRESENTS** that I, Sh. Principal, residing at _______, do hereby nominate, constitute and appoint Sh. Agent, residing at _______, as my true and lawful SPECIAL ATTORNEY to act for me and in my name for the specific purpose of:\n1. To attend the office of the Sub-Registrar at ______ and execute the Deed of Sale in respect of Property No. _____ in favour of Sh. Buyer.\n2. To present the said Sale Deed for registration under the Registration Act, 1908 and admit execution thereof.\n3. To receive consideration of ₹________ on my behalf and issue receipt.\n4. To hand over vacant peaceful possession of the property and execute all necessary affidavits and forms.\n5. I hereby ratify and confirm all lawful acts done by my said attorney pursuant to this power.\nIN WITNESS WHEREOF I have executed this SPA at New Delhi on ______.\n[Executant Signature] · [Two Attesting Witnesses] · [Notarization / Registration Seal]`
      },
      {
        num: 'Q5',
        year: 'DU / KAMKUS Q.28',
        q: '“Draft a Simple Mortgage Deed under Section 58(b) of the Transfer of Property Act, 1882.”',
        ans: `### MODEL DRAFTING ANSWER — SIMPLE MORTGAGE DEED (S. 58(b) TPA)\n\n**THIS DEED OF SIMPLE MORTGAGE** made on this ___ day of _____ 2026 BETWEEN Sh. Mortgagor (Borrower) OF THE ONE PART and Sh. Mortgagee (Lender) OF THE OTHER PART.\n1. **Loan Recital:** Mortgagor has borrowed a sum of ₹10,00,000/- from Mortgagee repayable with interest at 10% p.a. within 2 years.\n2. **Personal Obligation:** Mortgagor personally binds himself to repay the principal and interest on or before _____.\n3. **Mortgage Charge:** As security for repayment, Mortgagor hereby transfers to Mortgagee the right to cause the property described in Schedule to be sold in the event of default in repayment.\n4. **Possession Retained:** Possession remains with Mortgagor; no right to rents/profits is transferred to Mortgagee.\n5. **Remedy on Default:** If money unpaid, Mortgagee entitled to obtain decree for sale under Section 67 TPA.\n[Schedule of Property] · [Signatures] · [Attestation by 2 witnesses (mandatory under S. 59 TPA)].`
      },
      {
        num: 'Q6',
        year: 'ICSI / DU Exam Question',
        q: '“Distinguish between an Agreement to Sell and a Sale Deed in light of Suraj Lamp & Industries v. State of Haryana.”',
        ans: `### MODEL ANSWER — AGREEMENT TO SELL VS SALE DEED\n\n**1. Agreement to Sell (S. 54 TPA):**\n- An executory contract creating an obligation to sell in the future on agreed terms.\n- Does NOT create any interest in or charge on the immovable property (S. 54, ¶2).\n- Operates in personam (creates personal rights between parties).\n- Requires nominal stamping; registration optional under S. 17 (unless S. 53A part performance invoked).\n\n**2. Sale Deed (Conveyance):**\n- An executed conveyance transferring absolute proprietary ownership immediately.\n- Operates in rem (against the whole world).\n- Requires full ad-valorem stamp duty and mandatory registration under Section 17(1)(b) Registration Act.\n\n**3. Suraj Lamp Ruling (2012) 1 SCC 656:** General Power of Attorney sales and Agreements to Sell cannot transfer ownership or convey title; registered sale deed is mandatory.`
      },
      {
        num: 'Q7',
        year: 'DU LB-502 Core Rule',
        q: '“Explain the essential drafting rules for preparing a valid Will under the Indian Succession Act, 1925.”',
        ans: `### MODEL ANSWER — ESSENTIAL DRAFTING RULES FOR A WILL\n\n**1. Statutory Anchor:** Section 2(h) ISA 1925: "Will means the legal declaration of the intention of a testator with respect to his property which he desires to be carried into effect after his death."\n\n**2. 11 Cardinal Drafting Rules (from DU LB-502 curriculum):**\n- Testator’s sound and disposing mind must be stated explicitly.\n- Revocation of all prior wills, codicils, and testamentary dispositions.\n- Appointment of reliable Executors to administer the estate.\n- Clear, unambiguous identification of beneficiaries and properties bequeathed.\n- Contingent provisions or residuary clause ("All the rest, residue and remainder...").\n- Express mention that the Will is made out of free will without undue influence or coercion.\n- Avoid ambiguous conditions repugnant to absolute grant.\n- Execution signature / mark of testator at the foot or end.\n- **Attestation by minimum two witnesses (Section 63(c) ISA)** who saw testator sign and signed in testator's presence.\n- Doctor's fitness certificate advised for elderly testators to rebut suspicion.`
      },
      {
        num: 'Q8',
        year: 'DU Past Question',
        q: '“Distinguish between a Lease and a Leave and Licence Agreement. Draft key covenants of a commercial Lease Deed.”',
        ans: `### MODEL ANSWER — LEASE VS LEAVE & LICENCE\n\n**1. Statutory Distinction:**\n- **Lease (S. 105 TPA):** Transfer of a right to enjoy immovable property; creates an interest in the land; confers exclusive possession; irrevocable during term; transferable and heritable.\n- **Licence (S. 52 Indian Easements Act 1882):** Merely grants permission to do something on land which would otherwise be unlawful; creates NO interest in land; no exclusive possession (legal possession remains with licensor); generally revocable.\n\n**2. Key Covenants in Commercial Lease:**\n- Rent payment and security deposit with escalation clause (e.g. 5% annually).\n- Permitted user (strictly commercial / office use).\n- Maintenance, repair, and municipal tax allocation.\n- Prohibition against sub-letting, assignment, or parting with possession.\n- Determination and forfeiture conditions (S. 111 TPA) and notice period (S. 106 TPA).`
      }
    ];

    d7PyqsList.forEach((p, idx) => {
      pyqs.push({
        id: `draft-pyq-u7-${idx + 1}`,
        number: p.num,
        year: p.year,
        marks: '20 Marks',
        type: p.q.toLowerCase().includes('draft') ? 'Drafting Model' : 'Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: `pyq-u7-${idx + 1}`,
        question: p.q,
        modelAnswer: cleanHtml(p.ans)
      });
    });
  }

  return { cases, pyqs };
}

module.exports = { getDraftingData };

