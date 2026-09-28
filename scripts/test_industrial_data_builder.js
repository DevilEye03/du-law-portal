const fs = require('fs');

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

function getIndustrialData() {
  const cases = [];
  const pyqs = [];

  // --- UNIT 1 & 2: dl.brief and div.pyq ---
  const u1_2 = [
    { num: 1, title: 'Unit 1: Dispute Settlement under Industrial Relations Code, 2020', file: 'SEM 5/Industrial law/IR_Code_Unit1_Dispute_Settlement_Notes.html' },
    { num: 2, title: 'Unit 2: Reference of Industrial Disputes to Adjudicatory Authorities', file: 'SEM 5/Industrial law/IR_Code_Unit2_Reference_Notes.html' }
  ];

  u1_2.forEach(u => {
    const html = fs.readFileSync(u.file, 'utf8');

    // Cases
    const caseBoxes = html.split(/<div class=["']box case["']/i).slice(1);
    caseBoxes.forEach((chunk, idx) => {
      const inner = chunk.split(/<div class=["']box case["']|<\/section>|<footer/i)[0];
      const tagMatch = inner.match(/<span class=["']tag["']>([\s\S]*?)<\/span>/i);
      const tagText = tagMatch ? tagMatch[1].replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
      
      let name = tagText.replace(/^Case\s*[—–-]\s*/i, '').trim();
      let citation = '';
      const citeParts = name.split(/,\s*(AIR\s*\d+|(?:\(\d+\)|\d+)\s*SCC|\d+\s*SCR)/i);
      if (citeParts.length > 1) {
        name = citeParts[0].trim();
        citation = citeParts.slice(1).join('').trim();
      }

      let facts = '';
      let issues = '';
      let ratio = '';
      let args = '';

      const dtMatches = inner.match(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/gi) || [];
      dtMatches.forEach(dtdd => {
        const dt = dtdd.match(/<dt>([\s\S]*?)<\/dt>/i)?.[1]?.replace(/<[^>]+>/g, '')?.trim()?.toLowerCase() || '';
        const dd = dtdd.match(/<dd>([\s\S]*?)<\/dd>/i)?.[1]?.trim() || '';

        if (dt.includes('fact')) facts = cleanHtml(dd);
        else if (dt.includes('issue')) issues = cleanHtml(dd);
        else if (dt.includes('held') || dt.includes('ratio') || dt.includes('decision')) ratio = cleanHtml(dd);
        else if (dt.includes('argument')) args = cleanHtml(dd);
        else if (dt.includes('rule') || dt.includes('principle')) ratio += (ratio ? '<br><br>' : '') + `<strong>Principle:</strong> ` + cleanHtml(dd);
      });

      cases.push({
        id: `ind-c-u${u.num}-${idx + 1}`,
        name,
        citation,
        unitNumber: u.num,
        unit: u.title,
        file: u.file,
        anchorId: `case-u${u.num}-${idx + 1}`,
        facts: facts || 'Refer to the Industrial Law dossier for full facts and procedural history.',
        issues: issues || 'Industrial dispute jurisdiction and statutory construction.',
        arguments: args || '',
        ratio: ratio || 'Binding judicial ruling of the Supreme Court.',
        principleEvolved: 'Key authority on dispute settlement mechanism under IDA/IRC.',
        examTips: 'High-yield landmark authority in DU LL.B. semester examination answers.'
      });
    });

    // PYQs
    const pyqChunks = html.split(/<div class=["']pyq["']/i).slice(1);
    pyqChunks.forEach((chunk, idx) => {
      const inner = chunk.split(/<div class=["']pyq["']|<\/section>|<footer/i)[0];
      const qMatch = inner.match(/<div class=["']q["']>([\s\S]*?)<\/div>/i);
      const aMatch = inner.match(/<div class=["']a["']>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                     inner.match(/<div class=["']a["']>([\s\S]*?)<\/div>/i);

      const fullQ = qMatch ? qMatch[1] : `Question ${idx + 1}`;
      const srcMatch = fullQ.match(/<span class=["']src["']>([\s\S]*?)<\/span>/i);
      const year = srcMatch ? srcMatch[1].replace(/<[^>]+>/g, '').trim() : 'DU Examination';
      const qText = fullQ.replace(/<span class=["']src["']>[\s\S]*?<\/span>/i, '').replace(/<br\s*\/?>/i, '').trim();

      pyqs.push({
        id: `ind-pyq-u${u.num}-${idx + 1}`,
        number: `Q${idx + 1}`,
        year,
        marks: year.includes('marks') ? (year.match(/\d+\s*marks/i)?.[0] || '15 Marks') : '15 Marks',
        type: year.includes('problem') ? 'Problem' : 'Essay',
        unitNumber: u.num,
        unit: u.title,
        file: u.file,
        anchorId: `pyq-u${u.num}-${idx + 1}`,
        question: cleanHtml(qText),
        modelAnswer: aMatch ? cleanHtml(aMatch[1]) : ''
      });
    });
  });

  // Helper for casecard in Unit 3, 4, 5, 6, 7
  function parseCasecards(html, unitNum, unitTitle, filePath) {
    const unitCases = [];
    const casesSecIdx = html.indexOf('id="cases"');
    const casesSecEnd = html.indexOf('</section>', casesSecIdx !== -1 ? casesSecIdx : 0);
    const secHtml = casesSecIdx !== -1 ? html.slice(casesSecIdx, casesSecEnd !== -1 ? casesSecEnd : casesSecIdx + 40000) : html;

    const cards = secHtml.split(/<div class=["']casecard["']/i).slice(1);
    cards.forEach((chunk, idx) => {
      const inner = chunk.split(/<div class=["']casecard["']|<\/section>/i)[0];
      const h3Match = inner.match(/<h3>([\s\S]*?)<\/h3>/i);
      const citMatch = inner.match(/<div class=["']cit["']>([\s\S]*?)<\/div>/i);

      let name = h3Match ? h3Match[1].replace(/<span class=["']card-badge["']>[\s\S]*?<\/span>/i, '').replace(/<[^>]+>/g, '').trim() : `Case ${idx + 1}`;
      name = name.replace(/^[\u2460-\u24FF\d]+\s*[·\.]*\s*/, '').trim();
      const citation = citMatch ? citMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      let facts = '';
      let issues = '';
      let args = '';
      let ratio = '';
      let principle = '';

      const lblChunks = inner.split(/<div class=["']lbl["']>/i).slice(1);
      lblChunks.forEach(lc => {
        const lblTitleMatch = lc.match(/^([\s\S]*?)<\/div>/i);
        const lblTitle = lblTitleMatch ? lblTitleMatch[1].replace(/<[^>]+>/g, '').trim().toLowerCase() : '';
        const body = lc.replace(/^[\s\S]*?<\/div>/i, '').trim();

        if (lblTitle.includes('fact')) {
          facts = cleanHtml(body);
        } else if (lblTitle.includes('issue')) {
          issues = cleanHtml(body);
        } else if (lblTitle.includes('argument')) {
          args += (args ? '<br>' : '') + `<h6>${lblTitleMatch[1]}</h6>` + cleanHtml(body);
        } else if (lblTitle.includes('ratio') || lblTitle.includes('decision') || lblTitle.includes('holding')) {
          ratio += (ratio ? '<br>' : '') + cleanHtml(body);
        } else if (lblTitle.includes('principle') || lblTitle.includes('doctrine')) {
          principle += (principle ? '<br>' : '') + cleanHtml(body);
        }
      });

      unitCases.push({
        id: `ind-c-u${unitNum}-${idx + 1}`,
        name,
        citation,
        unitNumber: unitNum,
        unit: unitTitle,
        file: filePath,
        anchorId: `case-u${unitNum}-${idx + 1}`,
        facts: facts || 'Refer to unit dossier for complete factual matrix.',
        issues: issues || 'Industrial dispute jurisdiction and adjudicatory principles.',
        arguments: args || '',
        ratio: ratio || 'Binding judicial ruling of the Supreme Court.',
        principleEvolved: principle || '',
        examTips: citation
      });
    });

    return unitCases;
  }

  // --- UNIT 3: Awards and Settlements ---
  {
    const file = 'SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html';
    const title = 'Unit 3: Awards & Settlements — Binding Nature & Enforcement';
    const html = fs.readFileSync(file, 'utf8');

    // Cases (Bharat Bank, Rohtas Industries, Sirsilk, Remington Rand)
    const u3Cases = parseCasecards(html, 3, title, file);
    // Add Sirsilk and Remington Rand if in later sections
    if (html.includes('Sirsilk Ltd. v. Government of Andhra Pradesh') && !u3Cases.some(c => c.name.includes('Sirsilk'))) {
      const sirsilkIdx = html.indexOf('id="sirsilk"');
      const sirsilkSec = html.slice(sirsilkIdx, html.indexOf('</section>', sirsilkIdx));
      u3Cases.push({
        id: `ind-c-u3-3`,
        name: 'Sirsilk Ltd. v. Government of Andhra Pradesh',
        citation: 'AIR 1964 SC 160 · (1964) 2 SCR 448 · Three-Judge Bench (Wanchoo J.)',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'sirsilk',
        facts: 'While an industrial dispute was pending before the Industrial Tribunal, the parties arrived at a settlement under Section 18(1) and jointly wrote to the Government requesting it not to publish the award that had already been received by the Government.',
        issues: 'Whether the Government is bound to publish the award under Section 17(1) notwithstanding that the parties have arrived at a binding settlement before its publication?',
        arguments: 'Workmen & Employer: Settlement under S. 18(1) is binding and resolves the dispute; publishing the award would create fresh discord. Government: Publication under S. 17(1) is mandatory ("shall publish").',
        ratio: 'Harmonious construction between Section 17(1) and Section 18: The primary object of the Act is industrial peace. A settlement under Section 18(1) binds the parties and puts an end to the dispute. Where the parties inform the Government of a settlement before the award is published, the Government ought to withhold publication of the award to preserve industrial peace.',
        principleEvolved: 'Primacy of settlement over award: Settlement under S. 18(1) supersedes an unpublished award; mandatory duty under S. 17(1) yields to consensual dispute resolution.'
      });
    }
    if (html.includes('Remington Rand of India Ltd. v. The Workmen') && !u3Cases.some(c => c.name.includes('Remington'))) {
      u3Cases.push({
        id: `ind-c-u3-4`,
        name: 'Remington Rand of India Ltd. v. The Workmen',
        citation: 'AIR 1968 SC 224 · (1967) 3 SCR 863',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'case-remington',
        facts: 'Tribunal made an award and sent it to Government; Government published the award on 25 October 1966, which was beyond the thirty-day period prescribed by Section 17(1) of IDA.',
        issues: 'Is the 30-day time limit in Section 17(1) mandatory or directory? Does delayed publication invalidate the award?',
        arguments: 'Employer: Section 17(1) uses "shall publish within a period of thirty days"; publication beyond 30 days is ultra vires and invalid. Workmen: Time limit is directory; delay by Government cannot vitiate rights.',
        ratio: 'The provision in Section 17(1) requiring publication within thirty days is directory and not mandatory. The delay on the part of the Government in publishing the award cannot render the award void or unenforceable, as the parties had no control over the Government’s machinery.',
        principleEvolved: 'Directory nature of S. 17(1) timeline: The 30-day requirement for publication is directory; delayed publication does not vitiate the award.'
      });
    }
    cases.push(...u3Cases);

    // PYQs in Unit 3: G.2, G.3, G.4, G.6
    const u3Pyqs = [
      {
        id: 'ind-pyq-u3-1',
        number: 'Q1',
        year: 'DU LL.B. Core 15-Marker · Section G.2',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'pyq-u3-1',
        question: '“A settlement arrived at in the course of conciliation proceedings has a wider binding force than a settlement arrived at otherwise than in the course of conciliation.” Discuss with reference to statutory provisions and landmark judicial rulings.',
        modelAnswer: `### MODEL ANSWER — BINDING NATURE OF SETTLEMENTS (§18(1) VS §18(3) IDA / §57(1) VS §57(3) IRC)\n\n**1. Introduction:**\nThe Industrial Disputes Act, 1947 establishes a sharp dichotomy between settlements entered into by private agreement and those arrived at with the assistance of a conciliation officer. This binary is codified in Section 18 IDA [Section 57 of the Industrial Relations Code, 2020].\n\n**2. The Binary Classification:**\n- **Settlement under Section 18(1) [IRC §57(1)]:** A bilateral, consensual agreement arrived at between the employer and workmen otherwise than in the course of conciliation. **Binds ONLY the parties to the agreement**.\n- **Settlement under Section 18(3) [IRC §57(3)]:** A settlement arrived at **in the course of conciliation proceedings** before a conciliation officer or Board. **Binds ALL workmen** — including: (i) all parties to the dispute, (ii) all other persons summoned to appear, (iii) all persons employed in the establishment on the date of dispute, and (iv) **all persons who subsequently become employed** in the establishment or part thereof.\n\n**3. Rationale for Wider Binding Effect (Section 18(3)):**\nIn *Ramnagar Cane & Sugar Co. Ltd. v. Jatin Chakravorty* (AIR 1960 SC 1012), the Supreme Court explained that the Conciliation Officer is an independent statutory authority charged with the duty to ensure that the settlement is fair and reasonable. Because the officer acts in the public interest and satisfies himself of the equity of the terms, the law attaches universal binding force across the entire industrial unit.\n\n**4. Landmark Authority — *Herbertsons Ltd. v. Workmen* (AIR 1977 SC 322):**\nA settlement arrived at with a recognised majority union accepted by the vast majority of workmen must be assessed **as a whole**. It cannot be tested by bits and pieces. Even if some minor benefits are surrendered in exchange for larger gains, the settlement is fair and just and will bind the minority.\n\n**5. Conclusion:**\nSection 18(3) provides institutional sanctity and stability to collective bargaining by preventing rival minority factions from repudiating agreements negotiated through statutory conciliation.`
      },
      {
        id: 'ind-pyq-u3-2',
        number: 'Q2',
        year: 'DU LL.B. Core 10-Marker · Section G.3',
        marks: '10 Marks',
        type: 'Short Essay',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'pyq-u3-2',
        question: '“Discuss the commencement, operation, and duration of an award and a settlement under Section 19 of the Industrial Disputes Act, 1947.”',
        modelAnswer: `### MODEL ANSWER — COMMENCEMENT & DURATION (§19 IDA / §58 IRC)\n\n**1. Operation / Commencement (§19(1) & (3)):**\n- A settlement comes into operation on the date agreed upon, or if no date is agreed, on the date on which the memorandum is signed by the parties.\n- An award becomes enforceable on the expiry of **30 days** from the date of its publication under Section 17.\n\n**2. Period of Operation (§19(2) & (3)):**\n- A settlement remains in force for the period agreed upon, or if no period is specified, for **six months** from the date of signing.\n- An award remains in operation for **one year** from the date it becomes enforceable. The appropriate Government may reduce or extend the period up to a maximum of 3 years.\n\n**3. The Notice of Termination (§19(2) & (6)):**\nEven after the contractual or statutory period expires, the settlement or award does NOT automatically die. It continues to bind the parties until **two months** elapse from the date on which a written notice of intention to terminate is given by one party to the other.\n\n**4. Post-Termination Status — *LIC v. D.J. Bahadur* (AIR 1980 SC 2192):**\nKrishna Iyer J. ruled that even after termination under Section 19(6), the terms of an award/settlement continue to govern the contractual conditions of service until displaced by a fresh contract, settlement, or award.`
      },
      {
        id: 'ind-pyq-u3-3',
        number: 'Q3',
        year: 'DU LL.B. Core 15-Marker · Section G.4',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'pyq-u3-3',
        question: '“Is an Industrial Tribunal a ‘Court’? Examine the scope of Judicial Review of awards under Article 136 and Article 226 of the Constitution in light of Bharat Bank and Rohtas Industries.”',
        modelAnswer: `### MODEL ANSWER — JUDICIAL REVIEW OF INDUSTRIAL AWARDS (ARTS. 136 & 226)\n\n**1. Status of Industrial Tribunal — *Bharat Bank Ltd. v. Employees* (AIR 1950 SC 188):**\nThe Supreme Court held by majority that an Industrial Tribunal, though not a court in the strict sense, is a **judicial tribunal** exercising the judicial power of the State. It has all the trappings of a court (power to summon, take evidence on oath, bind parties by an enforceable adjudication). Therefore, an award of an Industrial Tribunal is subject to the **appellate jurisdiction of the Supreme Court under Article 136**.\n\n**2. High Court’s Writ Jurisdiction — *Rohtas Industries Ltd. v. Staff Union* (AIR 1976 SC 425):**\nAn arbitrator under Section 10A or an Industrial Tribunal under Section 10 is a public adjudicatory authority. Its awards are amenable to the **writ of certiorari under Article 226** on established grounds: (a) lack or excess of jurisdiction, (b) violation of natural justice, or (c) an error of law apparent on the face of the record.\n\n**3. Scope and Limitations of Judicial Review:**\nCourts exercising powers under Art. 226/136 do not sit as courts of appeal over findings of fact. Interference is justified only where the award is perverse, based on no evidence, or violates statutory provisions.`
      },
      {
        id: 'ind-pyq-u3-4',
        number: 'Q4',
        year: 'DU Predicted Problem · Section G.6',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 3,
        unit: title,
        file,
        anchorId: 'pyq-u3-4',
        question: '“During the pendency of a reference before an Industrial Tribunal, the management and the recognized union enter into a settlement under Section 18(1) resolving all disputes. The Tribunal refuses to recognize the settlement and delivers its award. Examine the validity of the award in light of Sirsilk Ltd. v. Govt. of A.P.”',
        modelAnswer: `### MODEL ANSWER — TRIBUNAL AWARD VS PENDING SETTLEMENT\n\n**1. Issue:** Whether a settlement arrived at between the parties under Section 18(1) during the pendency of a reference renders the subsequent award inoperative?\n\n**2. Law and Precedent:**\nIn *Sirsilk Ltd. v. Government of Andhra Pradesh* (AIR 1964 SC 160), the Supreme Court harmonised Section 17 and Section 18. Industrial adjudication is not an academic exercise; its primary purpose is industrial peace and dispute resolution.\n\n**3. Application:**\nWhen the employer and the workmen’s representative union resolve the dispute amicably by a settlement under Section 18, the industrial dispute ceases to exist. There remains no industrial dispute for the Tribunal to adjudicate or for the Government to enforce. The award delivered in disregard of the binding settlement is a nullity in practical effect.\n\n**4. Conclusion:** The settlement prevails, and the Government must withhold enforcement of the inconsistent award.`
      }
    ];
    pyqs.push(...u3Pyqs);
  }

  // --- UNIT 4: Managerial Prerogative & Disciplinary Action ---
  {
    const file = 'SEM 5/Industrial law/Unit-4-Managerial-Prerogative-Disciplinary-Action.html';
    const title = 'Unit 4: Managerial Prerogative & Disciplinary Action (Domestic Inquiry)';
    const html = fs.readFileSync(file, 'utf8');

    // 6 Landmark Cases: Kushal Bhan, Associated Cement, Tata Oil Mills, IOB v Ganesan, Kusheshwar Dubey, Prem Nath Bali
    cases.push(...parseCasecards(html, 4, title, file));

    // 4 PYQs from Section G
    pyqs.push(
      {
        id: 'ind-pyq-u4-1',
        number: 'Q1',
        year: 'Dec 2024 · Q.5 · 15 marks',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 4,
        unit: title,
        file,
        anchorId: 'pyq-u4-1',
        question: '“Must a domestic enquiry be stayed pending a criminal trial on the same facts? Discuss the law and advise an employee who has been charged departmentally while a criminal case is pending against him.”',
        modelAnswer: `### MODEL ANSWER — STAY OF DOMESTIC ENQUIRY PENDING CRIMINAL TRIAL\n\n**1. The General Rule — *DCM v. Kushal Bhan* (AIR 1960 SC 806):**\nThere is no legal bar to holding disciplinary proceedings while a criminal trial on the same facts is pending. A domestic enquiry does not have to be stayed merely because criminal proceedings have been launched.\n\n**2. The Standard and Objective Distinction:**\n- **Domestic Enquiry:** Concerned with maintaining discipline in the workplace; standard of proof is **preponderance of probabilities**; hearsay evidence may be considered if credible.\n- **Criminal Trial:** Concerned with punishment for crime against the State; standard of proof is **beyond reasonable doubt**; strict rules of the Evidence Act apply.\n\n**3. The Exception — Grave & Complex Questions (*Kusheshwar Dubey* / *IOB v. P. Ganesan*):**\nStay of domestic enquiry is advisable only when:\n- The charge is of a **grave nature** involving complex questions of fact and law;\n- The employee would be compelled to disclose his defence in the domestic enquiry, thereby prejudicing his defence in the criminal trial.\n\n**4. Limitation on Stay:** Stay cannot be indefinite. If the criminal trial is delayed, the employer is entitled to proceed with the domestic enquiry.`
      },
      {
        id: 'ind-pyq-u4-2',
        number: 'Q2',
        year: 'Nov–Dec 2025 · Q.3 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 4,
        unit: title,
        file,
        anchorId: 'pyq-u4-2',
        question: '“Two workmen fought at a public bus stop over the company bonus scheme. The employer dismissed them for misconduct under the standing order ‘within or without the factory’. The Tribunal held the fight was purely private. Advise.”',
        modelAnswer: `### MODEL ANSWER — OFF-PREMISES MISCONDUCT (*TATA OIL MILLS* DOCTRINE)\n\n**1. Issue:** Whether misconduct committed outside work premises can justify disciplinary action by the employer?\n\n**2. Principle of *Tata Oil Mills Co. Ltd. v. Workmen* (AIR 1965 SC 155):**\nMisconduct committed outside the physical premises of the establishment can be dealt with departmentally if it has a **direct and rational nexus** with the business of the employer or discipline in the establishment.\n\n**3. Application:**\nHere, the brawl, though taking place at a public bus stop, was triggered directly by the **company bonus scheme**. It directly impacts workplace harmony and managerial authority. The Tribunal erred in holding it a purely private dispute. Dismissal is lawful if fair enquiry was held.`
      },
      {
        id: 'ind-pyq-u4-3',
        number: 'Q3',
        year: 'DU Core Question · Section G.4',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 4,
        unit: title,
        file,
        anchorId: 'pyq-u4-3',
        question: '“The enquiry was held ex parte; the workman was later acquitted in the criminal case. What is the Labour Court’s power under §11-A? Can it reduce the punishment?”',
        modelAnswer: `### MODEL ANSWER — EX PARTE ENQUIRY, CRIMINAL ACQUITTAL & §11-A POWERS\n\n**1. Validity of Ex Parte Enquiry:**\nIf the workman was served notice and deliberately abstained, the ex parte enquiry is valid. However, if the employer failed to give reasonable notice, the enquiry violates natural justice (*Associated Cement Companies Ltd. v. Workmen*).\n\n**2. Effect of Criminal Acquittal:**\nAcquittal in a criminal case does not automatically vitiate departmental dismissal because of the difference in standards of proof (*State of Rajasthan v. B.K. Meena*). However, if the acquittal is an **honourable acquittal on the same identical facts** with no evidence, the disciplinary penalty cannot stand.\n\n**3. Powers under Section 11-A:**\nUnder Section 11-A, the Labour Court may set aside discharge or dismissal and direct reinstatement with back wages or award a lesser punishment.`
      },
      {
        id: 'ind-pyq-u4-4',
        number: 'Q4',
        year: 'DU Core Checklist · Section G.6',
        marks: '10 Marks',
        type: 'Short Essay',
        unitNumber: 4,
        unit: title,
        file,
        anchorId: 'pyq-u4-4',
        question: '“What are the essential elements of a valid domestic enquiry? Outline the eight-step natural justice checklist.”',
        modelAnswer: `### MODEL ANSWER — ESSENTIALS OF A VALID DOMESTIC ENQUIRY\n\n**1. Charge-sheet:** Clear, specific notice of allegations with dates and provisions.\n**2. Explanation:** Reasonable time given to delinquent to submit written reply.\n**3. Impartial Inquiry Officer:** IO must have no personal interest or bias in the outcome.\n**4. Notice of Date & Venue:** Workman given advance notice of all hearings.\n**5. Evidence in Presence of Delinquent:** Management witnesses must be examined in the workman's presence; management cannot rely on statements recorded behind his back (*Associated Cement*).\n**6. Right to Cross-Examine:** Workman must be allowed to cross-examine management witnesses.\n**7. Opportunity to Lead Defence:** Delinquent given full liberty to produce witnesses and documents.\n**8. Reasoned Inquiry Report:** IO must record findings based strictly on evidence adduced at the inquiry.`
      }
    );
  }

  // --- UNIT 5: Powers of Adjudicatory Authorities & Proportionality ---
  {
    const file = 'SEM 5/Industrial law/Unit-5-Adjudicatory-Powers-Proportionality-Notes.html';
    const title = 'Unit 5: Powers of Adjudicatory Authorities & Doctrine of Proportionality';
    const html = fs.readFileSync(file, 'utf8');

    // 4 Landmark Cases: Firestone, Hombe Gowda, Scooters India, Raghubir Singh
    cases.push(...parseCasecards(html, 5, title, file));

    // 4 PYQs from Section F
    pyqs.push(
      {
        id: 'ind-pyq-u5-1',
        number: 'Q1',
        year: 'DU Core 15-Marker · Section F.2',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 5,
        unit: title,
        file,
        anchorId: 'pyq-u5-1',
        question: '“Critically examine the scope of Section 11-A of the Industrial Disputes Act, 1947 before and after the 1971 amendment with reference to Workmen of Firestone Tyre & Rubber Co.”',
        modelAnswer: `### MODEL ANSWER — SECTION 11-A & THE FIRESTONE PRINCIPLES\n\n**1. Position Prior to Section 11-A (*Indian Iron & Steel Co.*, 1958):**\nThe Tribunal could interfere with managerial dismissal ONLY where there was: (a) want of good faith, (b) victimisation or unfair labour practice, (c) violation of natural justice, or (d) a completely perverse finding on the evidence. The Tribunal had no power to evaluate evidence afresh or modify quantum of punishment.\n\n**2. Legislative Intervention — Insertion of Section 11-A (1971):**\nEnacted following ILO Recommendation No. 119. Section 11-A empowers the Labour Court/Tribunal to:\n- Satisfy itself whether the misconduct is proved;\n- Disagree with the findings of the domestic enquiry;\n- **Alter or reduce the punishment** of discharge/dismissal and award lesser punishment.\n\n**3. *Workmen of Firestone Tyre & Rubber Co. v. Management* (1973) 1 SCC 813:**\nVaidialingam J. laid down the ten canonical principles governing Section 11-A:\n- Employer is entitled to justify the dismissal by leading fresh evidence before the Tribunal if the enquiry is found defective or no enquiry was held.\n- Tribunal has the power to reappraise the evidence on record.\n- Interference with punishment requires cogent reasons showing the penalty was **shockingly disproportionate**.`
      },
      {
        id: 'ind-pyq-u5-2',
        number: 'Q2',
        year: 'Dec 2024 · Section F.3',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 5,
        unit: title,
        file,
        anchorId: 'pyq-u5-2',
        question: '“A school teacher assaulted the Principal in the office. After a domestic enquiry, he was dismissed. The Labour Court reduced the punishment to withholding of increments on grounds of 20 years of clean service. Decide.”',
        modelAnswer: `### MODEL ANSWER — VIOLENCE AT WORKPLACE & PROPORTIONALITY (*HOMBE GOWDA* RULE)\n\n**1. Issue:** Can the Labour Court under Section 11-A reduce the punishment of dismissal in cases of physical violence at the workplace?\n\n**2. Supreme Court Ruling in *Hombe Gowda Educational Trust v. State of Karnataka* (2006) 1 SCC 430:**\nThe Supreme Court held that physical assault on a superior in an educational institution or workplace is an act of gross indiscipline. The doctrine of proportionality does not permit the Tribunal to show misplaced sympathy to violent employees.\n\n**3. Application:** Assault on a principal completely destroys discipline and the relationship of trust. Withholding increments is perverse. The Labour Court exceeded its jurisdiction under Section 11-A; dismissal must be upheld.`
      },
      {
        id: 'ind-pyq-u5-3',
        number: 'Q3',
        year: 'May–June 2025 · Section F.4',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 5,
        unit: title,
        file,
        anchorId: 'pyq-u5-3',
        question: '“Discuss the employer’s right to lead fresh evidence before the Labour Court to justify dismissal when the domestic enquiry is set aside as defective.”',
        modelAnswer: `### MODEL ANSWER — EMPLOYER'S RIGHT TO LEAD FRESH EVIDENCE\n\n**1. The Rule from *Firestone* & *Shambhu Nath Goyal*:**\nIf the Tribunal holds that the domestic enquiry was conducted in violation of natural justice, the employer has the legal right to lead fresh evidence before the Tribunal to prove the charge on merits.\n\n**2. Procedural Requirement — Timely Request:**\nIn *Shambhu Nath Goyal v. Bank of Baroda* (1983) 4 SCC 491, the Supreme Court held that the employer must make a request to lead fresh evidence in its written statement at the earliest opportunity. The employer cannot ask for permission at a late stage after the finding on the domestic enquiry is delivered.\n\n**3. Consequence:** If fresh evidence establishes the misconduct, the dismissal relates back to the original date of termination.`
      },
      {
        id: 'ind-pyq-u5-4',
        number: 'Q4',
        year: 'Nov–Dec 2025 · Section F.5',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 5,
        unit: title,
        file,
        anchorId: 'pyq-u5-4',
        question: '“A bus conductor was dismissed for misappropriating ₹20 by not issuing tickets. The Labour Court substituted dismissal with reinstatement without back wages. Management challenges this as improper exercise of §11-A. Decide.”',
        modelAnswer: `### MODEL ANSWER — MISAPPROPRIATION & LOSS OF CONFIDENCE (*RAGHUBIR SINGH* / *U.P. SRTC*)\n\n**1. Issue:** Does small financial misappropriation allow reduction of dismissal under Section 11-A?\n\n**2. Law and Precedent:**\nIn *Raghubir Singh v. GM, Haryana Roadways* (2014) 10 SCC 301 and *U.P. State Road Transport Corp. v. Suresh Chand Sharma* (2010) 6 SCC 555, the Supreme Court ruled that in cases of theft, fraud, or misappropriation by conductors or cashiers, the **amount of money misappropriated is irrelevant**. The conductor holds a position of trust; breach of that trust results in loss of confidence.\n\n**3. Conclusion:** Section 11-A cannot be used to reward dishonesty. Interference with dismissal is unjustified; dismissal must be restored.`
      }
    );
  }

  // --- UNIT 6: Restraints on Managerial Prerogatives ---
  {
    const file = 'SEM 5/Industrial law/Unit-6-Restraints-on-Managerial-Prerogatives-Notes.html';
    const title = 'Unit 6: Restraints on Managerial Prerogatives (§33 & §33-A IDA)';
    const html = fs.readFileSync(file, 'utf8');

    // 3 Landmark Cases: Hotel Imperial, Fakirbhai, Ram Lakhan
    cases.push(...parseCasecards(html, 6, title, file));

    // 4 PYQs from Section F
    pyqs.push(
      {
        id: 'ind-pyq-u6-1',
        number: 'Q1',
        year: 'DU Core 15-Marker · Section F.2',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 6,
        unit: title,
        file,
        anchorId: 'pyq-u6-1',
        question: '“Compare and contrast Section 33(1) and Section 33(2) of the Industrial Disputes Act, 1947. What is the object of these provisions?”',
        modelAnswer: `### MODEL ANSWER — SECTION 33(1) VS SECTION 33(2) OF THE IDA\n\n**1. Statutory Object:**\nTo maintain status quo during pendency of dispute resolution proceedings; to prevent victimisation and unfair labour practices by the employer; and to ensure workmen are not coerced into abandoning their industrial claims.\n\n**2. Section 33(1) — Misconduct CONNECTED with Dispute:**\n- Applies where proposed action relates to any matter **connected with the dispute**.\n- Requires **prior express permission in writing** of the conciliation officer / tribunal.\n- Applies equally to alter conditions of service or discharge/dismissal.\n\n**3. Section 33(2) — Misconduct NOT Connected with Dispute:**\n- Applies where proposed action relates to misconduct **not connected with the dispute**.\n- Employer may alter conditions of service in accordance with standing orders.\n- If discharging or dismissing, the employer must satisfy the **three-fold proviso**:\n  (i) Payment of one month's wages;\n  (ii) Making of an application for approval to the authority simultaneously;\n  (iii) Passing of the order of dismissal.`
      },
      {
        id: 'ind-pyq-u6-2',
        number: 'Q2',
        year: 'Dec 2024 · Q.7 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 6,
        unit: title,
        file,
        anchorId: 'pyq-u6-2',
        question: '“Workman suspended pending permission under §33(1); application pending for 6 years; employer pays no subsistence allowance. Advise workman in light of Fakirbhai and Ram Lakhan.”',
        modelAnswer: `### MODEL ANSWER — SUBSISTENCE ALLOWANCE DURING PENDENCY OF §33 APPLICATION\n\n**1. The Landmark Ruling in *Fakirbhai Fulabhai Solanki v. Presiding Officer* (1986) 3 SCC 131:**\nIf an employer suspends a workman pending permission under Section 33(1), the employer **MUST pay subsistence allowance** during the entire pendency of the application. Denial of subsistence allowance starves the workman and cripples his capacity to defend himself before the Tribunal, violating natural justice.\n\n**2. Reconciliation in *Ram Lakhan v. Presiding Officer* (2000) 10 SCC 201:**\nThe Supreme Court affirmed that subsistence allowance is payable as a matter of right. If the employer refuses to pay, the Tribunal must dismiss the Section 33 application.\n\n**3. Remedy:** Workman is entitled to order directing immediate payment of arrears of subsistence allowance.`
      },
      {
        id: 'ind-pyq-u6-3',
        number: 'Q3',
        year: 'Nov–Dec 2025 · Q.4 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 6,
        unit: title,
        file,
        anchorId: 'pyq-u6-3',
        question: '“A ‘protected workman’ under §33(3) was dismissed for misconduct unconnected with the dispute without prior permission. Examine the validity of the dismissal and the remedy available under §33-A.”',
        modelAnswer: `### MODEL ANSWER — PROTECTED WORKMAN & SECTION 33-A COMPLAINT\n\n**1. Status of Protected Workman (§33(3)):**\nA protected workman is a recognized union officer granted special statutory immunity. Even for misconduct **unconnected** with the dispute, the employer CANNOT discharge or dismiss a protected workman without **prior express permission in writing** under Section 33(3).\n\n**2. Breach of Section 33:**\nDismissing a protected workman without prior permission is a contravention of Section 33. The dismissal order is completely invalid and inoperative.\n\n**3. Remedy under Section 33-A / §91 IRC:**\nThe aggrieved workman may file a complaint in writing under Section 33-A. The Tribunal will adjudicate the complaint **as if it were a dispute referred to it** and can order reinstatement with full back wages.`
      },
      {
        id: 'ind-pyq-u6-4',
        number: 'Q4',
        year: 'DU Core 10-Marker · Section F.5',
        marks: '10 Marks',
        type: 'Short Essay',
        unitNumber: 6,
        unit: title,
        file,
        anchorId: 'pyq-u6-4',
        question: '“What is the legal effect of an order of dismissal passed in contravention of Section 33 of the IDA? Discuss Jaipur Zila Sahakari Bhoomi Vikas Bank.”',
        modelAnswer: `### MODEL ANSWER — EFFECT OF NON-COMPLIANCE WITH §33 (*JAIPUR ZILA BANK*)\n\n**1. Conflict of Authorities:** Earlier rulings conflicted on whether an order passed without approval under Section 33(2)(b) was void ab initio or merely gave a cause of action under Section 33-A.\n\n**2. Constitution Bench Ruling in *Jaipur Zila Sahakari Bhoomi Vikas Bank v. Ram Gopal Sharma* (2002) 2 SCC 244:**\nThe 5-Judge Constitution Bench held that the requirements of Section 33(2)(b) proviso are mandatory conditions precedent. If approval is not granted, or if the order is passed without applying for approval, the order of dismissal is **void ab initio and inoperative in law**.\n\n**3. Consequence:** The workman is deemed to have continued in service throughout and is entitled to all wages and benefits.`
      }
    );
  }

  // --- UNIT 7: Wages & Code on Wages ---
  {
    const file = 'SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html';
    const title = 'Unit 7: Wages — Concepts, Kinds & The Code on Wages, 2019';
    const html = fs.readFileSync(file, 'utf8');

    // Cases: Crown Aluminium, Greaves Cotton, Reptakos Brett, PUDR Asiad
    cases.push(...parseCasecards(html, 7, title, file));

    // 5 PYQs from Section H
    pyqs.push(
      {
        id: 'ind-pyq-u7-1',
        number: 'Q1',
        year: 'Dec 2024 · Q.8(a) · 15 marks',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: 'pyq-u7-1',
        question: '“Discuss People’s Union for Democratic Rights v. Union of India (AIR 1982 SC 1473) in relation to non-payment of minimum wages and Article 23 of the Constitution.”',
        modelAnswer: `### MODEL ANSWER — PUDR V. UNION OF INDIA (ASIAD WORKERS' CASE)\n\n**1. Facts:** Public Interest Litigation on behalf of thousands of construction workers employed in Asian Games projects in Delhi who were paid less than the statutory minimum wage by contractors.\n\n**2. The Article 23 Constitutional Breakthrough:**\nBhagwati J. held that "forced labour" under Article 23 is not confined to physical force or legal compulsion. It includes labour resulting from **economic circumstances and poverty** where a person has no choice but to accept work at less than the minimum wage.\n\n**3. Ratio:** Payment of less than the minimum wage constitutes **"forced labour" (begar)** prohibited under Article 23 of the Constitution. Every person has a fundamental right under Article 23 to be paid not less than the statutory minimum wage.\n\n**4. Significance:** Elevated the statutory right to minimum wages under the Minimum Wages Act to an enforceable Fundamental Right under the Constitution.`
      },
      {
        id: 'ind-pyq-u7-2',
        number: 'Q2',
        year: 'Dec 2024 · Q.8(b) · 15 marks',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: 'pyq-u7-2',
        question: '“Discuss the fixation of fair wages by the industrial adjudicator and the principles governing wage revision.”',
        modelAnswer: `### MODEL ANSWER — FIXATION OF FAIR WAGES\n\n**1. The Three Tiers of Wages (Fair Wages Committee Report):**\n- **Living Wage:** Highest level; provides for basic food, clothing, housing, plus education, social security, and comfort.\n- **Minimum Wage:** Irreducible bare minimum necessary to sustain human life and efficiency.\n- **Fair Wage:** Sits between minimum wage and living wage. Determined by capacity of industry to pay and prevailing rates in the region.\n\n**2. Principles of Wage Revision:**\n- **Capacity to Pay:** Industry-wide capacity on long-term prospects, not temporary fluctuations.\n- **Industry-cum-Region Formula (*Greaves Cotton*):** Comparing similar concerns in the same geographical region.`
      },
      {
        id: 'ind-pyq-u7-3',
        number: 'Q3',
        year: 'May–June 2025 · Q.7 · 15 marks',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: 'pyq-u7-3',
        question: '“Explain the concept of minimum, fair and living wages with reference to Crown Aluminium Works v. Workmen (AIR 1958 SC 130).”',
        modelAnswer: `### MODEL ANSWER — CROWN ALUMINIUM WORKS V. WORKMEN\n\n**1. Facts:** Management of Crown Aluminium Works claimed that wage rates had become uneconomic due to financial depression and sought reduction of existing wage structure.\n\n**2. Supreme Court Ruling (Gajendragadkar J.):**\n- **Minimum Wage is Absolute:** An employer who cannot pay the bare minimum wage has **no right to exist** in business. Financial incapacity cannot be pleaded against payment of minimum wage.\n- **Fair Wage & Downward Revision:** Wages above minimum wage (fair wages) once fixed should not be lightly revised downward. Downward revision is permissible ONLY if the financial depression is profound, permanent, and threatens survival of the industry.`
      },
      {
        id: 'ind-pyq-u7-4',
        number: 'Q4',
        year: 'May–June 2025 / Nov–Dec 2025 · 10 marks',
        marks: '10 Marks',
        type: 'Short Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: 'pyq-u7-4',
        question: '“Write a short note on the ‘Industry-cum-Region’ formula in wage fixation in light of Greaves Cotton & Co. v. Workmen.”',
        modelAnswer: `### MODEL ANSWER — INDUSTRY-CUM-REGION FORMULA (*GREAVES COTTON*)\n\n**1. The Twin Pillars of the Formula (*Greaves Cotton & Co. Ltd. v. Workmen*, AIR 1964 SC 689):**\n- **Industry Aspect:** Comparing concerns in the same line of business.\n- **Region Aspect:** Comparing concerns in the same geographical area.\n\n**2. How Applied:**\n- When comparable concerns in the **same industry in the same region** exist, that comparison is primary.\n- If no comparable concern in the same industry exists in that region, comparison may be made with **similar concerns in other industries in the same region** having similar capital, turnover, and workforce size.`
      },
      {
        id: 'ind-pyq-u7-5',
        number: 'Q5',
        year: 'Code on Wages, 2019 Key Reform',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 7,
        unit: title,
        file,
        anchorId: 'pyq-u7-5',
        question: '“Explain the concept of ‘Floor Wage’ and universal minimum wage under the Code on Wages, 2019.”',
        modelAnswer: `### MODEL ANSWER — FLOOR WAGE UNDER CODE ON WAGES, 2019\n\n**1. Universal Minimum Wage Coverage:** Unlike Minimum Wages Act 1948 (which applied only to scheduled employments), Code on Wages 2019 applies to **all employees and all establishments**.\n\n**2. The Floor Wage (§9):**\n- Central Government determines statutory **Floor Wage** based on minimum living standards across geographical areas.\n- State minimum wages **CANNOT be lower than the floor wage** fixed by Centre.\n- If existing state wage is higher than floor wage, State cannot reduce it.`
      }
    );
  }

  // --- UNIT 8: Code on Social Security, 2020 ---
  {
    const file = 'SEM 5/Industrial law/Unit8_Code_on_Social_Security_Notes.html';
    const title = 'Unit 8: The Code on Social Security, 2020';
    const html = fs.readFileSync(file, 'utf8');

    // Cases
    const u8CaseList = [
      {
        name: 'General Manager, B.E.S.T. Undertaking, Bombay v. Mrs. Agnes',
        citation: '(1964) 3 SCR 930 · AIR 1964 SC 193',
        facts: 'Bus driver finished duty at Jogeshwari depot at 7:45 p.m., boarded another B.E.S.T. bus under a free transit rule to go home to Santa Cruz; bus collided with stationary lorry; driver suffered fatal injuries. Widow claimed compensation under §3(1) WC Act [now §74(1) Code].',
        issues: 'Did the accident arise "out of and in the course of employment" when the employee had finished work and was travelling home in employer-provided transport?',
        arguments: 'Employer: Duty ended when driver left depot; travel was voluntary convenience, not statutory obligation. Widow: Transport facility was incidental to duty; bus was an extension of workplace.',
        ratio: 'Doctrine of Notional Extension: In the case of public transport drivers who must travel long distances to depot at odd hours, the free travel facility is a condition of service and an incident of employment. The employment begins when the driver boards the bus and extends to the journey home. Accident occurred in the course of employment.',
        principle: 'Notional extension of workplace: Accidents occurring in transport provided by employer as an incident of service arise out of and in the course of employment.'
      },
      {
        name: 'Daivshala & Ors. v. Oriental Insurance Company Ltd.',
        citation: '2025 INSC 152 · Supreme Court of India',
        facts: 'Workman on daily commute to work was killed in a road accident before reaching factory premises; compensation claimed under Section 3(1) of Employees\' Compensation Act.',
        issues: 'Does an accident during ordinary transit to/from work without dedicated employer transport fall within "in the course of employment"?',
        arguments: 'Claimants: Transit is necessary for work; without travel, employment impossible. Insurer: Public road commute is general public risk, not employment risk.',
        ratio: 'Affirmed Section 51-E of ESI Act (2010 amendment) and Section 74(4) of Code on Social Security: An accident occurring to an employee while commuting between residence and place of work is deemed to arise out of and in the course of employment, provided there is a reasonable nexus in time and space.',
        principle: 'Statutory transit coverage: Modern Indian law recognizes commute accident between home and work as arising in course of employment.'
      },
      {
        name: 'Royal Western India Turf Club Ltd. v. ESIC',
        citation: '(2016) 4 SCC 521',
        facts: 'Turf club employed race-course staff and casual employees on race days; contended casual and seasonal workers are not "employees" under ESI Act.',
        issues: 'Does the ESI Act apply to casual, temporary, and intermittent employees working on race days?',
        arguments: 'Club: Employment is intermittent and temporary, not continuous; contribution unjust. ESIC: Section 2(9) covers all persons employed for wages in connection with establishment work.',
        ratio: 'Beneficent legislation must be construed liberally. The definition of "employee" in Section 2(9) includes casual and temporary workmen. Casual employees employed for even a few days are entitled to statutory social security protection.',
        principle: 'Universal coverage of temporary staff: Social security benefits extend to casual, ad-hoc, and temporary employees.'
      },
      {
        name: 'Dr. Kavita Yadav v. Secretary, Ministry of Health & Family Welfare',
        citation: '(2024) 1 SCC 421',
        facts: 'Senior resident doctor appointed on fixed-term contract of three years applied for maternity leave; contract expired before completion of leave period; authorities refused maternity benefits beyond contract date.',
        issues: 'Does the entitlement to maternity benefit under Section 5 of Maternity Benefit Act survive expiry of fixed-term contractual employment?',
        arguments: 'Employer: Employment ceased on contract expiry; employer cannot pay post-employment benefit. Doctor: Section 5 confers absolute statutory entitlement.',
        ratio: 'Maternity benefit is an unalienable statutory right under Section 5. Once a woman employee satisfies the qualifying condition (worked for 80 days), she is entitled to the full 26 weeks of maternity benefit, even if her contract of employment expires during the maternity leave period.',
        principle: 'Contract expiry does not extinguish maternity benefit: Statutory maternity entitlement survives expiry of fixed-term contract.'
      },
      {
        name: 'Birla Institute of Technology v. State of Jharkhand',
        citation: '(2019) 4 SCC 513',
        facts: 'Educational institution contested payment of gratuity to retired teachers, relying on earlier ruling in Ahmedabad Private Primary Teachers Assn (2004) that teachers were not employees.',
        issues: 'Are teachers in educational institutions entitled to gratuity following the 2009 amendment to Payment of Gratuity Act?',
        arguments: 'Institution: 2009 amendment cannot apply retrospectively; teachers are non-industrial. Teachers: 2009 amendment retrospective from 1997.',
        ratio: 'The 2009 amendment adding teachers to the definition of "employee" under Section 2(e) of the Payment of Gratuity Act with retrospective effect from 3 April 1997 is valid. Teachers are entitled to gratuity for all qualifying past service.',
        principle: 'Gratuity for teachers: Teachers are employees under Gratuity Act and Code on Social Security; entitlement applies retrospectively.'
      }
    ];

    u8CaseList.forEach((c, idx) => {
      cases.push({
        id: `ind-c-u8-${idx + 1}`,
        name: c.name,
        citation: c.citation,
        unitNumber: 8,
        unit: title,
        file,
        anchorId: `case-u8-${idx + 1}`,
        facts: c.facts,
        issues: c.issues,
        arguments: c.arguments,
        ratio: c.ratio,
        principleEvolved: c.principle,
        examTips: 'Prescribed social security landmark.'
      });
    });

    // 10 PYQs from Section J
    const u8PyqsList = [
      {
        id: 'ind-pyq-u8-1',
        number: 'Q1',
        year: 'Dec 2024 · Q.6 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-1',
        question: '“A workman meets with an incident at the workplace (injury/acute distress) and is being taken to a hospital; on the way he suffers a heart attack and dies. Dependants claim compensation; employer argues natural cause. Decide.”',
        modelAnswer: `### MODEL ANSWER — HEART ATTACK FOLLOWING WORKPLACE INCIDENT\n\n**1. Issue:** Whether death by heart attack while being taken to hospital after a workplace incident is a personal injury caused by accident arising out of and in the course of employment (§74(1) Code / §3(1) WC Act)?\n\n**2. Legal Principles:**\n- **Accident:** Unlooked-for mishap or untoward event (*Fenton v. Thorley*).\n- **Arising out of Employment:** Causal connection between employment strain and heart attack (*Mackinnon Mackenzie v. Ibrahim*). Pre-existing heart weakness does not defeat claim if work strain accelerated death.\n- **Notional Extension:** Journey to hospital to treat a workplace injury is an act incidental to employment.\n\n**3. Conclusion:** Employer is liable to pay full compensation to dependants.`
      },
      {
        id: 'ind-pyq-u8-2',
        number: 'Q2',
        year: 'Dec 2024 · Q.4(c) · 10 marks',
        marks: '10 Marks',
        type: 'Short Note',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-2',
        question: '“Applicability of the Maternity Benefit Act to ad-hoc, temporary, and contractual employees in light of MCD v. Female Workers (Muster Roll).”',
        modelAnswer: `### MODEL ANSWER — MATERNITY BENEFIT FOR AD-HOC & MUSTER ROLL WORKERS\n\n**1. Landmark Precedent (*MCD v. Female Workers (Muster Roll)*, (2000) 3 SCC 224):**\nThe Supreme Court held that the Maternity Benefit Act applies to **daily-wage, muster roll, and ad-hoc female workers**. Denying maternity benefits to casual women workers violates Articles 14, 21, and 42 of the Constitution.\n\n**2. Absolute Character of Benefit:** Maternity protection cannot be conditioned on permanent employment status. If the employee worked 80 days in the preceding 12 months, entitlement is complete.`
      },
      {
        id: 'ind-pyq-u8-3',
        number: 'Q3',
        year: 'May–June 2025 · Q.5 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-3',
        question: '“Workman knocked down by a speeding vehicle on public road while travelling to work on bicycle. Employer denies liability. Decide under doctrine of notional extension.”',
        modelAnswer: `### MODEL ANSWER — COMMUTE ACCIDENT & DOCTRINE OF NOTIONAL EXTENSION\n\n**1. Evolution:** From *Saurashtra Salt* (traditional rule: employer not liable for general public hazards) to *B.E.S.T. v. Agnes* (transport provided by employer is within employment).\n\n**2. Modern Position (§74(4) Code on Social Security 2020):**\nAccidents occurring while travelling between residence and workplace are explicitly deemed to arise out of and in the course of employment if there is a direct causal connection in route and time.\n\n**3. Conclusion:** Workman is entitled to statutory compensation.`
      },
      {
        id: 'ind-pyq-u8-4',
        number: 'Q4',
        year: 'May–June 2025 · Q.8(e) · 10 marks',
        marks: '10 Marks',
        type: 'Short Note',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-4',
        question: '“Explain the salient features of the Payment of Gratuity Act and the 5-year continuous service rule.”',
        modelAnswer: `### MODEL ANSWER — PAYMENT OF GRATUITY ACT SALIENT FEATURES\n\n**1. Eligibility (§4):** Payable on termination after rendering continuous service for not less than **five years** (waived in case of death or disablement).\n**2. Calculation:** 15 days’ wages based on last drawn rate for each completed year of service (15/26 × Last Wage × Years).\n**3. Ceiling:** Maximum gratuity limit is ₹20 Lakhs.\n**4. Forfeiture (§4(6)):** Permissible only for wilful damage to property or disorderly conduct/moral turpitude leading to termination.`
      },
      {
        id: 'ind-pyq-u8-5',
        number: 'Q5',
        year: 'Nov–Dec 2025 · Q.5 · 15 marks',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-5',
        question: '“Discuss the four propositions laid down in Saurashtra Salt Mfg. Co. v. Bai Valu Raja on the doctrine of notional extension.”',
        modelAnswer: `### MODEL ANSWER — SAURASHTRA SALT DOCTRINE\n\n**1. The Four Propositions (*Saurashtra Salt*, AIR 1958 SC 881):**\n- As a rule, employment does not commence until the workman reaches the place of employment and does not continue after he leaves.\n- Employment may extend beyond actual hours and boundaries by notional extension.\n- Notional extension applies where workman travels by transport provided by employer as an obligation or necessity.\n- Workman on public road exposed to ordinary public dangers is not in the course of employment unless there is special employment risk.\n\n**2. Evolution:** Adapted by *B.E.S.T. v. Agnes* and codified in S. 74(4) of the 2020 Code.`
      },
      {
        id: 'ind-pyq-u8-6',
        number: 'Q6',
        year: 'Nov–Dec 2025 · Q.7 · 15 marks',
        marks: '15 Marks',
        type: 'Problem',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-6',
        question: '“Dr. Dolly, appointed on a 1-year contract expiring 14 Jan 2025, applied for 26 weeks maternity leave on 15 Dec 2024. College offered benefit only till 14 Jan 2025 (20 days). Advise in light of Dr. Kavita Yadav.”',
        modelAnswer: `### MODEL ANSWER — MATERNITY BENEFIT BEYOND CONTRACT EXPIRY (*KAVITA YADAV*)\n\n**1. Ratio of *Dr. Kavita Yadav v. Secretary, MoHFW* (2024) 1 SCC 421:**\nEntitlement to maternity benefit under Section 5 is an absolute statutory right. Expiry of the contractual term does not defeat the right to receive full 26 weeks of benefit.\n\n**2. Conclusion:** College is legally bound to pay full 26 weeks of maternity benefit; restriction to 20 days is unlawful.`
      },
      {
        id: 'ind-pyq-u8-7',
        number: 'Q7',
        year: 'Nov–Dec 2025 · Q.8(b) · 10 marks',
        marks: '10 Marks',
        type: 'Short Note',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-7',
        question: '“Applicability of the Payment of Gratuity Act to Teachers in light of Birla Institute of Technology.”',
        modelAnswer: `### MODEL ANSWER — GRATUITY TO TEACHERS\n\n**1. Legal Evolution:** *Ahmedabad Teachers* (2004) held teachers were not employees. Parliament passed 2009 amendment adding teachers retrospectively from 3 April 1997.\n\n**2. Supreme Court Ruling in *Birla Institute of Technology v. State of Jharkhand* (2019) 4 SCC 513:**\nUpheld validity of amendment. Teachers are entitled to gratuity for past service. Under Chapter V of the Code on Social Security 2020, teachers are fully protected.`
      },
      {
        id: 'ind-pyq-u8-8',
        number: 'Q8',
        year: 'LC-I 2008 Past Question',
        marks: '10 Marks',
        type: 'Short Note',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-8',
        question: '“Distinguish between a ‘Contract of Service’ and a ‘Contract for Service’.”',
        modelAnswer: `### MODEL ANSWER — CONTRACT OF SERVICE VS CONTRACT FOR SERVICE\n\n**1. Contract OF Service:** Employer-employee relationship; employer controls manner and method of work; servant subject to discipline; entitled to statutory compensation.\n**2. Contract FOR Service:** Independent contractor relationship; contractor agrees to produce a given result; free to choose method; not an "employee" under social security enactments (*Dharangadhra Chemical Works*).`
      },
      {
        id: 'ind-pyq-u8-9',
        number: 'Q9',
        year: 'CLC Past Paper Question',
        marks: '10 Marks',
        type: 'Short Note',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-9',
        question: '“Distinguish between Total Disablement and Partial Disablement under the Employees’ Compensation provisions.”',
        modelAnswer: `### MODEL ANSWER — TOTAL VS PARTIAL DISABLEMENT\n\n- **Total Disablement (§2(1)(l) / S. 2(85) Code):** Incapacitates employee for all work which he was capable of performing at the time of accident. Permanent loss of sight or amputation of both hands is deemed total disablement (100% loss of earning capacity).\n- **Partial Disablement (§2(1)(g) / S. 2(54) Code):** Reduces earning capacity in employment. May be temporary or permanent.`
      },
      {
        id: 'ind-pyq-u8-10',
        number: 'Q10',
        year: 'DU LL.B. Core Essay Question',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 8,
        unit: title,
        file,
        anchorId: 'pyq-u8-10',
        question: '“What are the conditions precedent to establish employer’s liability for compensation under Section 74 of the Code on Social Security, 2020?”',
        modelAnswer: `### MODEL ANSWER — CONDITIONS OF EMPLOYER'S LIABILITY\n\n**1. Essential Conditions (§74(1) Code / §3(1) WC Act):**\n- Personal injury caused to an employee;\n- Injury caused by **accident**;\n- Accident must **arise out of** employment (causal connection);\n- Accident must occur **in the course of** employment (nexus in time and space).\n\n**2. Statutory Exceptions (§74(1) proviso):**\nEmployer not liable if injury does not disable for more than 3 days, or if caused by employee’s intoxication, wilful disobedience to safety rules, or wilful removal of safety guards.`
      }
    ];

    pyqs.push(...u8PyqsList);
  }

  return { cases, pyqs };
}

module.exports = { getIndustrialData };

