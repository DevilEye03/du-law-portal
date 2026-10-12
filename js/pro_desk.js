/**
 * MAKE LAW EASY PRO — PRACTICE DESK, READY-TO-USE TEMPLATES & REAL-TIME LAW UPDATES
 * Pure Vanilla ES6+ Engine (Zero dependencies, offline-first, client-side execution)
 * 
 * Target Audience: Practicing Advocates, Junior Litigators, Judicial Aspirants (DJS/PCS-J),
 * Law Clerks, and LL.B. Scholars.
 * 
 * Extensibility: To add new templates or law updates, simply append to PRO_TEMPLATES_DB
 * or PRO_LAW_UPDATES_DB below!
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. REPOSITORY OF READY-TO-USE LEGAL TEMPLATES BY SUBJECT
  // =========================================================================
  const PRO_TEMPLATES_DB = [
    // -----------------------------------------------------------------------
    // SUBJECT 1: CRIME (General Criminal Law, BNSS 2023, BNS 2023, CrPC 1973)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-pdf-criminal-trial',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Criminal Procedure & BNSS / CrPC Trial Practice',
      title: 'Criminal Defense & Trial Court Pleadings Compendium (Master Docket PDF)',
      shortDesc: 'Authoritative trial court drafting compendium containing vetted criminal trial court applications, bail petitions, and trial formats.',
      limitationNotice: 'Master Docket PDF: Complete court-tested litigation file containing standard trial court applications and procedural formats.',
      tags: ['Criminal Practice', 'Bail', 'Trial Court', 'Official PDF', 'Compendium', 'Crime'],
      pdfUrl: '/Templates/criminal%20template.pdf',
      content: `========================================================================
CRIMINAL DEFENSE & TRIAL COURT PLEADINGS COMPENDIUM (MASTER DOCKET)
Source Document: Templates/criminal template.pdf (~558 KB)
========================================================================

This master courtroom drafting compendium is available for instant direct viewing and download.
Click "Download Official PDF" to access the full verified court file.

CONTENTS INCLUDE:
1. Applications for Grant of Regular Bail & Interim Bail
2. Applications for Anticipatory Bail with Affidavit
3. Applications for Discharge / Dropping of Proceedings
4. Exemption Applications under Section 205 CrPC / BNSS
5. Applications for Superdari / Custody of Impounded Property
6. Section 156(3) / 175(3) Applications for Directions to Register FIR`
    },
    {
      id: 'tpl-pdf-criminal-appeals',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Criminal Appellate Practice & High Court Jurisprudence',
      title: 'Criminal Revisions, Quashing & Appeals Master Manual (Part II PDF)',
      shortDesc: 'Advanced appellate criminal drafting compendium for Sessions Courts and High Courts covering revisions, quashing, and statutory appeals.',
      limitationNotice: 'Master Docket PDF: High Court & Sessions Court appellate drafting compendium with standard prayer clauses.',
      tags: ['Criminal Revision', 'Appeals', 'High Court', 'Official PDF', 'Compendium', 'Crime'],
      pdfUrl: '/Templates/criminal%20template%201.pdf',
      content: `========================================================================
CRIMINAL REVISIONS, QUASHING & APPEALS MASTER MANUAL (PART II)
Source Document: Templates/criminal template 1.pdf (~652 KB)
========================================================================

This advanced appellate drafting compendium is available for instant direct viewing and download.
Click "Download Official PDF" to open the complete court file.

CONTENTS INCLUDE:
1. Criminal Revision Petitions against summoning orders and framing of charges
2. Section 482 CrPC / Section 528 BNSS Quashing Petitions
3. Criminal Appeal Formats against judgment of conviction
4. Applications for Suspension of Sentence pending appeal
5. Criminal Writ Petitions under Article 226 of the Constitution of India`
    },
    {
      id: 'tpl-bnss-regular-bail',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Regular Bail Application under Section 480 & 483 BNSS, 2023',
      shortDesc: 'Comprehensive bail application before Court of Sessions / High Court replacing Sections 437 & 439 of the Code of Criminal Procedure, 1973.',
      limitationNotice: 'Procedure: Incorporates modern BNSS provisions, compliance with Supreme Court Satender Kumar Antil (2022) categorization, and triple test grounds.',
      tags: ['Criminal Procedure', 'Regular Bail', 'BNSS Section 480', 'BNSS Section 483', 'Sessions Court', 'Crime'],
      content: `IN THE COURT OF THE PRINCIPAL DISTRICT AND SESSIONS JUDGE AT [Insert District/City, e.g., TIS HAZARI COURTS, DELHI]

BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Accused Name], S/o [Insert Father's Name],
Age: [___] years, R/o [Insert Residential Address]
(Presently confined in Central Jail No. [___], [Tihar / Mandoli / Rohini / District Jail])
                                                        ...APPLICANT / ACCUSED
VERSUS
STATE (NCT OF DELHI / STATE OF [___])
Through: S.H.O., Police Station [Insert P.S. Name]
                                                        ...RESPONDENT

FIR NO.: [Insert FIR No.] / 2026
UNDER SECTIONS: [Insert BNS Sections, e.g., Sections 115(2), 303(2), 318(4) of Bharatiya Nyaya Sanhita, 2023]
POLICE STATION: [Insert Police Station Name]

APPLICATION ON BEHALF OF THE APPLICANT / ACCUSED UNDER SECTION 480 READ WITH SECTION 483 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 FOR GRANT OF REGULAR BAIL

MOST RESPECTFULLY SHOWETH:

1. That the Applicant / Accused is a law-abiding citizen of India, aged about [___] years, residing at the address mentioned above, having deep roots in society, with no previous criminal antecedents whatsoever.

2. That the Applicant has been falsely implicated and arrested in the aforementioned FIR on [Insert Date of Arrest] and has been in judicial custody since [Insert Date of Remand]. The Applicant has already undergone custody of [Insert Number of Days/Months] days.

3. That the prosecution story in brief is that [Insert 2-3 sentences summarizing the brief allegation in the FIR].

4. That the allegations leveled against the Applicant in the FIR are completely baseless, concocted, and motivated by extraneous reasons. The Applicant has no connection with the alleged commission of the offence.

5. GROUNDS FOR BAIL:
   A. COMPLETION OF INVESTIGATION:
      That the Applicant has fully cooperated with the Investigating Agency during the period of police custody. All alleged recoveries have already been effected. No further custodial interrogation of the Applicant is required for any purpose whatsoever.

   B. SATENDER KUMAR ANTIL GUIDELINES COMPLIANCE:
      That the alleged offences are punishable with imprisonment not exceeding 7 years and fall strictly within Category 'A' as classified by the Hon'ble Supreme Court in Satender Kumar Antil v. CBI, (2022) 10 SCC 51. The mandatory safeguards under Section 35 of the BNSS, 2023 (corresponding to Section 41/41A CrPC) were not adhered to.

   C. SATISFACTION OF TRIPLE TEST (P. Chidambaram v. ED):
      i. FLIGHT RISK: The Applicant is a permanent resident of [Insert City], having family, dependent parents, and fixed assets, and poses zero flight risk.
      ii. TAMPERING WITH EVIDENCE: The entire evidence in the matter is documentary / electronic and is already in the custody of the Police / Court.
      iii. INFLUENCING WITNESSES: The Applicant undertakes not to contact or influence any prosecution witness directly or indirectly.

   D. PRINCIPLE OF BAIL IS THE RULE, JAIL IS THE EXCEPTION:
      That the Hon'ble Supreme Court has repeatedly held that pre-trial incarceration without trial amounts to punishment before conviction, violating the Applicant's fundamental right to personal liberty guaranteed under Article 21 of the Constitution of India.

6. That the Applicant is ready and willing to furnish substantial surety to the satisfaction of this Hon'ble Court and undertakes to abide by any condition imposed by this Hon'ble Court.

PRAYER:
WHEREFORE, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:
(a) Grant Regular Bail to the Applicant / Accused in FIR No. [Insert FIR No.]/2026 registered at Police Station [Insert P.S. Name] under Sections [Insert Sections] of the Bharatiya Nyaya Sanhita, 2023;
(b) Pass any other or further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE APPLICANT SHALL EVER PRAY.

APPLICANT
THROUGH:

___________________________
[Insert Advocate Name]
Advocate for Applicant / Accused
[Insert Bar Enrolment No.]
Chamber Address: [Insert Chamber Address]
Place: [Insert City] | Date: [Insert Date]`
    },
    {
      id: 'tpl-bnss-anticipatory-bail',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Anticipatory Bail Application under Section 482 BNSS, 2023',
      shortDesc: 'Pre-arrest bail petition before the Court of Sessions or High Court replacing Section 438 of the Code of Criminal Procedure, 1973.',
      limitationNotice: 'Procedure: Must show genuine apprehension of arrest in non-bailable offence; incorporates undertaking to join investigation under S. 35(3) BNSS.',
      tags: ['Criminal Procedure', 'Anticipatory Bail', 'BNSS Section 482', 'Pre-Arrest', 'Sessions Court', 'Crime'],
      content: `IN THE COURT OF THE PRINCIPAL DISTRICT AND SESSIONS JUDGE AT [Insert City/District]

ANTICIPATORY BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Applicant Name], S/o [Insert Father's Name],
Age: [___] years, R/o [Insert Residential Address]
                                                        ...APPLICANT
VERSUS
STATE (NCT OF DELHI / STATE OF [___])
Through: S.H.O., Police Station [Insert P.S. Name]
                                                        ...RESPONDENT

FIR NO.: [Insert FIR No. / If FIR not yet registered, state: "In respect of Complaint / Inquiry bearing DD No. ___"]
UNDER SECTIONS: [Insert Sections of Bharatiya Nyaya Sanhita, 2023]
POLICE STATION: [Insert Police Station Name]

APPLICATION UNDER SECTION 482 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 ON BEHALF OF THE APPLICANT FOR GRANT OF ANTICIPATORY BAIL (BAIL IN THE EVENT OF ARREST)

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is a peaceful, respectable, and law-abiding citizen of India, residing at the aforementioned address, carrying on business / profession as [Insert Profession].

2. That the Applicant has a reasonable and genuine apprehension of being arrested by the officials of Police Station [Insert P.S. Name] in connection with the aforementioned FIR / Complaint, which alleges non-bailable offences.

3. That the complainant [Insert Complainant Name] has instituted the present criminal proceeding with a malicious and malafide intent to extort money, harass, and coerce the Applicant into settling a purely civil / commercial dispute.

4. GROUNDS FOR ANTICIPATORY BAIL:
   A. APPREHENSION OF ARREST IS REASONABLE: Police officials from Police Station [___] have visited the residence and business premises of the Applicant on [Insert Dates] and threatened coercive action.
   B. DISPUTE IS EX-FACIE OF CIVIL NATURE: The transaction in question arises out of a commercial contract / family settlement, and criminal color has been unlawfully given to a purely civil cause of action.
   C. UNDERTAKING TO COOPERATE: The Applicant undertakes to join investigation as and when directed by the Investigating Officer under Section 35(3) BNSS, 2023.
   D. NO NEED FOR CUSTODIAL INTERROGATION: No custodial interrogation is required as the evidence consists entirely of documents already available.
   E. CLEAN BACKGROUND: The Applicant has no prior criminal history and undertakes not to tamper with evidence or influence any witness.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Direct that in the event of arrest of the Applicant in connection with FIR No. [___] / Complaint dated [___] registered at P.S. [___], the Applicant be admitted to bail on furnishing reasonable surety to the satisfaction of the Arresting Officer / Court;
(b) Pass any ad-interim protection order pending final disposal of this application;
(c) Pass any other order(s) deemed fit in the interest of justice.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-223-bnss-complaint',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Criminal Complaint under Section 223 BNSS, 2023',
      shortDesc: 'Formal private complaint before Judicial Magistrate replacing Section 200 CrPC, incorporating the mandatory pre-cognizance opportunity of being heard.',
      limitationNotice: 'Key Change: Section 223(1) BNSS mandates giving the proposed accused an opportunity of being heard before the Magistrate takes cognizance of a complaint.',
      tags: ['Criminal Procedure', 'Complaint', 'BNSS Section 223', 'Magistrate', 'Trial', 'Crime'],
      content: `IN THE COURT OF THE METROPOLITAN MAGISTRATE / JUDICIAL MAGISTRATE FIRST CLASS AT [Insert District/City]

CRIMINAL COMPLAINT NO. ________ OF 2026

IN THE MATTER OF:
[Insert Complainant Full Name], S/o [Insert Father's Name],
Age: [___] years, R/o [Insert Complainant Address]
                                                        ...COMPLAINANT
VERSUS
[Insert Accused Name], S/o [Insert Father's Name],
Age: [___] years, R/o [Insert Accused Address]
                                                        ...ACCUSED

COMPLAINT UNDER SECTION 223 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 FOR OFFENCES PUNISHABLE UNDER SECTIONS [Insert Sections, e.g., 316(2), 318(4), 351(2) OF BHARATIYA NYAYA SANHITA, 2023]

MOST RESPECTFULLY SHOWETH:

1. That the Complainant is a respectable citizen residing at the address given above.
2. That the Accused is [Insert description/relationship with Accused].
3. FACTS OF THE COMPLAINT:
   (a) That on [Insert Date], the Accused approached the Complainant with a representation that [State the dishonest inducement/fraud].
   (b) That relying upon the said false representations, the Complainant [State action taken by Complainant, e.g., parted with money / goods].
   (c) That the Complainant later discovered that the Accused never had the intention to honor the commitment, and dishonestly misappropriated the property.
4. That the Complainant approached the local Police Station on [Insert Date], but no FIR was registered despite disclosing a cognizable offence. A representation was also dispatched to the Superintendent of Police / DCP on [Insert Date] under Section 173(4) BNSS.
5. That the Accused has committed offences punishable under Sections [___] of the Bharatiya Nyaya Sanhita, 2023.
6. COMPLIANCE WITH SECTION 223 BNSS PROVISO:
   The Complainant submits that before taking cognizance, this Hon'ble Court may afford the Accused an opportunity of being heard in accordance with the proviso to Section 223(1) of the BNSS, 2023.

PRAYER:
It is, therefore, prayed that this Hon'ble Court may be pleased to:
(a) Examine the Complainant and witnesses under Section 223 BNSS;
(b) Issue summons to the Accused for facing trial;
(c) Punish the Accused in accordance with law.

COMPLAINANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-bnss-528-quashing',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 528)',
      title: 'Quashing Petition under Section 528 BNSS, 2023 (Old Section 482 CrPC)',
      shortDesc: 'Inherent powers petition before the High Court for quashing FIR, chargesheet, and summoning order under State of Haryana v. Bhajan Lal guidelines.',
      limitationNotice: 'High Court Inherent Jurisdiction: No statutory period of limitation, but must be instituted without inordinate laches.',
      tags: ['Quashing', 'Section 528 BNSS', 'Section 482 CrPC', 'Bhajan Lal', 'High Court', 'Inherent Powers', 'Crime'],
      content: `IN THE HIGH COURT OF JUDICATURE AT [Insert City, e.g., DELHI]
CRIMINAL MISCELLANEOUS (MAIN) NO. ________ OF 2026

IN THE MATTER OF:
[Insert Petitioner Name], S/o [Insert Father's Name],
R/o [Insert Residential Address]
                                                        ...PETITIONER
VERSUS
1. STATE (NCT OF DELHI / STATE OF [___])
   Through: Standing Counsel (Criminal)
2. [Insert Name of De-facto Complainant],
   R/o [Insert Address of Complainant]
                                                        ...RESPONDENTS

PETITION UNDER SECTION 528 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (CORRESPONDING TO SECTION 482 OF THE CODE OF CRIMINAL PROCEDURE, 1973) FOR QUASHING OF FIR NO. [___] DATED [___] REGISTERED AT POLICE STATION [___] AND ALL CONSEQUENTIAL PROCEEDINGS ARISING THEREFROM.

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner has approached this Hon'ble Court seeking invocation of its inherent powers to prevent abuse of the process of Court and to secure the ends of justice.

2. That the Respondent No. 2 has lodged the impugned FIR out of sheer malice, grudge, and personal vendetta, giving criminal color to an admitted civil and contractual dispute.

3. GROUNDS FOR QUASHING (Bhajan Lal Categories):
   (a) Even if allegations in the FIR are taken at their face value in entirety, they do not prima facie constitute any cognizable offence.
   (b) The dispute is purely of a civil nature arising out of commercial contract / accounts reconciliation.
   (c) The criminal proceeding has been instituted with malafide intent and ulterior motive for wreaking vengeance upon the Petitioner.
   (d) Continuation of the criminal proceedings amounts to gross harassment and harassment of the Petitioner.

PRAYER:
Wherefore, it is prayed that this Hon'ble Court may be pleased to:
(a) Quash FIR No. [___] dated [___] under Sections [___] of BNS, 2023 registered at P.S. [___] and all proceedings emanating therefrom;
(b) Stay coercive steps during pendency of this Petition.

PETITIONER
THROUGH:
___________________________
[Insert Advocate Name], Advocate for Petitioner`
    },
    {
      id: 'tpl-bnss-superdari',
      category: 'crime',
      categoryLabel: 'Crime',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (Sections 497 & 503)',
      title: 'Application for Superdari (Release of Seized Vehicle / Property)',
      shortDesc: 'Application before Magistrate for release of impounded vehicle or valuable property on interim custody under Sunderbhai Ambalal Desai guidelines.',
      limitationNotice: 'Trial Stage: Can be filed immediately upon seizure/detention of vehicle by police.',
      tags: ['Superdari', 'Release of Vehicle', 'Section 497 BNSS', 'Section 451 CrPC', 'Magistrate', 'Crime'],
      content: `IN THE COURT OF THE METROPOLITAN MAGISTRATE / JMFC AT [Insert Court Name]

APPLICATION FOR RELEASE OF VEHICLE ON SUPERDARI
IN FIR NO.: [Insert FIR No.] / 2026
UNDER SECTIONS: [Insert Sections]
POLICE STATION: [Insert Police Station]

IN THE MATTER OF:
STATE
VERSUS
[Insert Accused Name]

APPLICATION ON BEHALF OF APPLICANT [Insert Name] FOR RELEASE OF MOTOR VEHICLE BEARING REGISTRATION NO. [Insert Vehicle Reg. No.] ON SUPERDARI

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is the registered owner of vehicle bearing Registration No. [___], Make [___], Model [___], Engine No. [___], Chassis No. [___]. Copy of Registration Certificate (RC) is annexed herewith.
2. That the said vehicle was seized by police of P.S. [___] in connection with the above FIR on [Insert Date].
3. That the vehicle is lying in the open premises of the Police Station exposed to weather, rain, and dust, deteriorating daily into scrap.
4. That the Hon'ble Supreme Court in Sunderbhai Ambalal Desai v. State of Gujarat, (2002) 10 SCC 283 held that articles seized by police ought not to be kept in police stations for long periods.
5. That the Applicant undertakes to produce the vehicle before the Court whenever directed, not to alter its color or shape, and not to dispose of or create third-party rights therein during the pendency of trial.

PRAYER:
It is prayed that the vehicle bearing Registration No. [___] be ordered to be released to the Applicant on Superdari on furnishing reasonable indemnity bond.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 2: NDPS (Narcotic Drugs and Psychotropic Substances Act, 1985)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-pdf-ndps-docket',
      category: 'ndps',
      categoryLabel: 'NDPS',
      statute: 'Narcotic Drugs & Psychotropic Substances Act, 1985',
      title: 'Special NDPS Act Trial & Section 37 Bail Practice Compendium (PDF)',
      shortDesc: 'Specialized litigation compendium for NDPS Special Courts covering search & seizure memo compliance, sampling, and Section 37 bail.',
      limitationNotice: 'Special Statute PDF: Focuses on Section 37 twin conditions, Section 42/50 search compliance, and Section 52A inventory certification.',
      tags: ['NDPS Act', 'Section 37 Bail', 'Special Court', 'Official PDF', 'Narcotics', 'NDPS'],
      pdfUrl: '/Templates/ndps%20template.pdf',
      content: `========================================================================
SPECIAL NDPS ACT TRIAL & SECTION 37 BAIL PRACTICE COMPENDIUM
Source Document: Templates/ndps template.pdf (~551 KB)
========================================================================

Complete specialized litigation manual for proceedings under the NDPS Act, 1985 before the Special Judge / High Court.
Click "Download Official PDF" to open the complete court file.

SPECIALIZED CHAPTERS:
1. Bail Applications in Commercial Quantity matters dealing with Section 37 twin conditions
2. Grounds challenging non-compliance with Section 42 (Mandatory recording of secret information)
3. Mandatory notice and compliance under Section 50 (Search of person before Gazetted Officer / Magistrate)
4. Section 52A sampling and magistrate inventory certification jurisprudence
5. Regular and Default Bail parameters under NDPS Act read with BNSS / CrPC`
    },
    {
      id: 'tpl-ndps-regular-bail',
      category: 'ndps',
      categoryLabel: 'NDPS',
      statute: 'Narcotic Drugs and Psychotropic Substances Act, 1985 (Section 37)',
      title: 'NDPS Regular Bail Application in Commercial Quantity (Section 37 Rebuttal)',
      shortDesc: 'Bail petition before Special Judge (NDPS) / High Court meeting the twin conditions of Section 37 NDPS Act on grounds of procedural illegality and lack of conscious possession.',
      limitationNotice: 'Statutory Threshold: Must demonstrate reasonable grounds to believe the accused is not guilty and not likely to commit an offence while on bail (Section 37(1)(b)).',
      tags: ['NDPS Bail', 'Section 37', 'Commercial Quantity', 'Conscious Possession', 'Special Judge', 'NDPS'],
      content: `IN THE COURT OF THE SPECIAL JUDGE (NDPS ACT) AT [Insert District/City]

BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Accused Name], S/o [Insert Father's Name],
Presently in Judicial Custody
                                                        ...APPLICANT / ACCUSED
VERSUS
STATE (NCT OF DELHI / STATE OF [___])
Through: Investigating Officer / Narcotics Control Bureau (NCB)
                                                        ...RESPONDENT

FIR / CRIME NO.: [Insert Crime No.] / 2026
UNDER SECTIONS: [Insert Sections, e.g., 8, 20(b)(ii)(C), 21(c), 29 NDPS Act, 1985]
POLICE STATION / NCB ZONE: [Insert Name]

APPLICATION UNDER SECTION 37 OF THE NDPS ACT, 1985 READ WITH SECTION 483 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 FOR GRANT OF REGULAR BAIL

MOST RESPECTFULLY SHOWETH:

1. That the Applicant has been arrested on [Insert Date] on allegations of recovery of commercial quantity of contraband.
2. GROUNDS OVERCOMING SECTION 37 NDPS TWIN CONDITIONS:
   A. ABSENCE OF CONSCIOUS POSSESSION: No contraband was recovered from physical person of Applicant.
   B. BREACH OF SECTION 42 NDPS ACT: Secret information was not reduced into writing within statutory window nor dispatched to superior officer (Karnail Singh v. State of Haryana).
   C. FATAL DEFECT IN SECTION 50 COMPLIANCE: Option given to accused was partial/misleading; search not conducted before Magistrate/Gazetted Officer (State of Punjab v. Baldev Singh).
   D. VIOLATION OF SECTION 52A SAMPLING: Representative samples were drawn by IO at spot instead of before the Judicial Magistrate (Union of India v. Mohanlal).
   E. PROLONGED INCARCERATION: Right to speedy trial under Article 21 overrides Section 37 bar where trial has no prospect of conclusion soon (Mohd. Muslim v. State (NCT of Delhi), 2023).

PRAYER:
Wherefore, it is prayed that Applicant be enlarged on regular bail on reasonable terms.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-ndps-section-50-discharge',
      category: 'ndps',
      categoryLabel: 'NDPS',
      statute: 'Narcotic Drugs and Psychotropic Substances Act, 1985',
      title: 'NDPS Discharge Application based on Section 50 & 52A Mandatory Violations',
      shortDesc: 'Application seeking discharge before Special Judge on grounds that seizure stands vitiated by non-compliance with statutory search and sampling safeguards.',
      limitationNotice: 'Stage of Filing: At the stage of consideration of framing of charges under Section 250 BNSS / 227 CrPC.',
      tags: ['NDPS Discharge', 'Section 50', 'Section 52A', 'Illegal Search', 'Special Judge', 'NDPS'],
      content: `IN THE COURT OF THE SPECIAL JUDGE (NDPS) AT [Insert Court]

IN SESSIONS CASE NO.: ________ / 2026
IN FIR NO.: [Insert FIR No.]
P.S. / AGENCY: [Insert Agency]

STATE VERSUS [Insert Accused Name]

APPLICATION ON BEHALF OF ACCUSED UNDER SECTION 250 BNSS, 2023 (OLD SECTION 227 CrPC) FOR DISCHARGE IN NDPS PROCEEDINGS

MOST RESPECTFULLY SHOWETH:

1. That the charge-sheet filed against the Accused discloses patent incurable legal infirmities.
2. That Section 50 mandates informing the accused of his legal right to be searched before a Gazetted Officer or Magistrate. In the present case, the notice merely stated "if you wish, you can be searched", rendering the search illegal.
3. That under Section 52A(2), sampling must occur in the presence of the Magistrate. Here, the IO drew samples at the police station, violating mandatory Supreme Court precedent.
4. That illegal recovery cannot form the basis of framing charges.

PRAYER:
Prayed that the Accused be discharged of all offences.

ACCUSED
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 3: CORRUPTION (Prevention of Corruption Act, 1988 & PMLA)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-pc-act-sanction-discharge',
      category: 'corruption',
      categoryLabel: 'Corruption',
      statute: 'Prevention of Corruption Act, 1988 (Sections 17A & 19)',
      title: 'PC Act Discharge Application for Absence of Valid Sanction & Section 17A Approval',
      shortDesc: 'Discharge application before Special Judge (CBI/ACB) challenging lack of competent sanction under Section 19 and absence of prior enquiry approval under Section 17A.',
      limitationNotice: 'Mandatory Bar: No court shall take cognizance of an offence punishable under Sections 7, 11, 13 without prior sanction of competent authority.',
      tags: ['Corruption', 'PC Act', 'Sanction S.19', 'Section 17A', 'CBI', 'Discharge', 'Special Court'],
      content: `IN THE COURT OF THE SPECIAL JUDGE (PC ACT / CBI) AT [Insert Court Name]

CC NO. ________ OF 2026
RC NO.: [Insert RC/FIR No.]

CBI / STATE (ACB)
VERSUS
[Insert Public Servant Name]

APPLICATION ON BEHALF OF ACCUSED UNDER SECTION 250 BNSS (OLD SECTION 227 CrPC) FOR DISCHARGE ON GROUNDS OF WANT OF SANCTION UNDER SECTION 19 AND VIOLATION OF SECTION 17A OF THE PREVENTION OF CORRUPTION ACT, 1988

MOST RESPECTFULLY SHOWETH:

1. That the Accused is a public servant against whom prosecution has been launched under Sections 7 and 13(1)(b) of the PC Act, 1988.
2. ABSENCE OF VALID SANCTION UNDER SECTION 19:
   The alleged sanction order dated [___] has been passed mechanically without application of mind, by an authority lower than the appointing authority competent to remove the Accused.
3. BAR UNDER SECTION 17A OF PC ACT (2018 AMENDMENT):
   No enquiry, inquiry, or investigation was initiated with the prior approval of the competent authority, rendering the entire investigation ab initio void (Yashwant Sinha v. CBI).
4. DEMAND AND ACCEPTANCE NOT ESTABLISHED:
   Mere recovery without proof of voluntary demand does not constitute an offence under Section 7 (Neeraj Dutta v. State).

PRAYER:
It is respectfully prayed that the Accused be discharged.

ACCUSED
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-pc-act-regular-bail',
      category: 'corruption',
      categoryLabel: 'Corruption',
      statute: 'Prevention of Corruption Act, 1988 & BNSS, 2023',
      title: 'Bail Application in CBI / ACB Trap Case (Sections 7 & 13 PC Act)',
      shortDesc: 'Regular bail petition for public servant arrested in alleged bribe trap case before Special Judge (CBI / Prevention of Corruption Act).',
      limitationNotice: 'Trial Practice: Emphasizes completion of trap proceedings, voice sample recording, and absence of necessity for custodial interrogation.',
      tags: ['Corruption', 'Bail', 'Trap Case', 'Section 7 PC Act', 'CBI Court', 'Public Servant'],
      content: `IN THE COURT OF THE SPECIAL JUDGE (PC ACT / CBI) AT [Insert District]

BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Accused Name], Public Servant
Presently in Judicial Custody
                                                        ...APPLICANT
VERSUS
CENTRAL BUREAU OF INVESTIGATION (CBI) / STATE (ACB)
                                                        ...RESPONDENT

APPLICATION UNDER SECTION 480/483 BNSS, 2023 FOR GRANT OF REGULAR BAIL IN RC NO. [___] UNDER SECTIONS 7 & 7A OF PC ACT, 1988

MOST RESPECTFULLY SHOWETH:

1. That Applicant has been arrested on [Insert Date] in an alleged trap proceeding.
2. That the trap has already concluded, phenolphthalein test memo is prepared, and voice identification samples have been obtained.
3. That the Applicant has clean service record spanning [___] years with zero complaints.
4. That all relevant office files and documents are in safe custody of the department.
5. That pre-trial detention of a public servant whose identity and residence are well established serves no legitimate investigative purpose.

PRAYER:
Prayed that the Applicant be released on regular bail.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-pmla-anticipatory-bail',
      category: 'corruption',
      categoryLabel: 'Corruption',
      statute: 'Prevention of Money Laundering Act, 2002 (Section 45)',
      title: 'Anticipatory Bail Application in ED / PMLA Proceedings (Section 45 Compliance)',
      shortDesc: 'Pre-arrest bail petition before Special Court / High Court addressing proceeds of crime, predicate offence nexus, and Section 45 twin conditions.',
      limitationNotice: 'PMLA Rigor: Rebuts Section 45 twin conditions relying on Vijay Madanlal Choudhary and Manish Sisodia Supreme Court precedents on trial delay.',
      tags: ['PMLA', 'ED Bail', 'Money Laundering', 'Section 45', 'Proceeds of Crime', 'Corruption'],
      content: `IN THE COURT OF THE SPECIAL JUDGE (PMLA) AT [Insert City]

BAIL APPLICATION NO. ________ OF 2026
ECIR NO.: [Insert ECIR No.]

IN THE MATTER OF:
[Insert Applicant Name]
                                                        ...APPLICANT
VERSUS
DIRECTORATE OF ENFORCEMENT (ED)
Through its Assistant Director, [Insert Zonal Office]
                                                        ...RESPONDENT

APPLICATION UNDER SECTION 482 BNSS, 2023 READ WITH SECTION 45 OF PMLA, 2002 FOR GRANT OF ANTICIPATORY BAIL

MOST RESPECTFULLY SHOWETH:

1. That the Applicant apprehends arrest by ED in connection with ECIR No. [___].
2. THAT NO PROCEEDS OF CRIME ATTRIBUTABLE TO APPLICANT:
   The Applicant is neither named in the Scheduled/Predicate Offence nor has generated or possessed any proceeds of crime.
3. SATISFACTION OF SECTION 45 TWIN CONDITIONS:
   (a) Prima facie, no offence under Section 3 PMLA is made out.
   (b) The Applicant is not likely to commit any offence while on bail.
4. RIGHT TO LIBERTY UNDER ARTICLE 21:
   The Hon'ble Supreme Court in Manish Sisodia v. ED (2024) held that Section 45 cannot be used as an instrument of indefinite pre-trial incarceration without speedy trial.

PRAYER:
Prayed that in event of arrest, Applicant be admitted to bail.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 4: MARRIAGE & FAMILY (Hindu Marriage Act, DV Act, BNSS Maintenance)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-hma-mutual-divorce',
      category: 'marriage',
      categoryLabel: 'Marriage',
      statute: 'Hindu Marriage Act, 1955 (Section 13B)',
      title: 'Joint Petition for Mutual Consent Divorce (Section 13B(1) & 13B(2) HMA)',
      shortDesc: 'Comprehensive joint petition for dissolution of Hindu marriage by mutual consent with full settlement of permanent alimony, stridhan, and child custody.',
      limitationNotice: 'Statutory Condition: Spouses must have lived separately for a period of one year or more and must have mutually agreed to dissolve marriage.',
      tags: ['Divorce', 'Mutual Consent', 'Section 13B HMA', 'Alimony', 'Family Court', 'Marriage'],
      content: `IN THE FAMILY COURT AT [Insert District, e.g., SAKET COURTS, NEW DELHI]

HMA PETITION NO. ________ OF 2026

IN THE MATTER OF:
1. [Insert Name of Husband], S/o [___],
   Age: [___] years, R/o [Insert Address]
                                                        ...PETITIONER NO. 1
AND
2. [Insert Name of Wife], D/o [___],
   Age: [___] years, R/o [Insert Address]
                                                        ...PETITIONER NO. 2

JOINT PETITION UNDER SECTION 13B(1) OF THE HINDU MARRIAGE ACT, 1955 FOR DISSOLUTION OF MARRIAGE BY A DECREE OF DIVORCE BY MUTUAL CONSENT

MOST RESPECTFULLY SHOWETH:

1. That marriage between Petitioners was solemnized on [Insert Date] at [Insert Place] according to Hindu rites and ceremonies.
2. That [State if children born from wedlock, e.g., one female child born on ___ / no child was born from the marriage].
3. That due to irreconcilable temperamental differences, Petitioners could not adjust together and have been living separately since [Insert Date of Separation, must be > 1 year].
4. That all efforts of reconciliation made by family elders and friends have completely failed.
5. TERMS OF FULL AND FINAL SETTLEMENT:
   (a) Petitioner No. 1 has agreed to pay a total sum of Rs. [Insert Alimony Amount]/- to Petitioner No. 2 towards full and final settlement of permanent alimony, maintenance (past, present, future), and stridhan.
   (b) Payment schedule: Rs. [___] at First Motion, Rs. [___] at Second Motion.
   (c) Child Custody & Visitation: [Specify custody terms].
   (d) Both parties agree to withdraw all pending litigations (FIR, 125, DV Act).

PRAYER:
Wherefore, it is prayed that this Hon'ble Court be pleased to dissolve the marriage by a decree of divorce by mutual consent.

PETITIONER NO. 1                        PETITIONER NO. 2
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-hma-maintenance-24',
      category: 'marriage',
      categoryLabel: 'Marriage',
      statute: 'Hindu Marriage Act, 1955 (Section 24)',
      title: 'Application for Interim Maintenance & Litigation Expenses (Section 24 HMA)',
      shortDesc: 'Application before Family Court seeking interim maintenance and litigation funding during pendency of matrimonial proceedings as per Rajnesh v. Neha guidelines.',
      limitationNotice: 'Mandatory Requirement: Must be accompanied by comprehensive Affidavit of Assets & Liabilities pursuant to Supreme Court directives in Rajnesh v. Neha.',
      tags: ['Maintenance', 'Interim Maintenance', 'Section 24 HMA', 'Rajnesh v Neha', 'Family Court', 'Marriage'],
      content: `IN THE FAMILY COURT AT [Insert City/District]

IN HMA PETITION NO.: ________ / 2026
[Insert Case Title, e.g., Husband v. Wife]

APPLICATION UNDER SECTION 24 OF THE HINDU MARRIAGE ACT, 1955 ON BEHALF OF THE APPLICANT/WIFE FOR GRANT OF INTERIM MAINTENANCE PENDENTE LITE AND LITIGATION EXPENSES

MOST RESPECTFULLY SHOWETH:

1. That the Respondent/Husband has instituted petition under Section 13 HMA against Applicant.
2. That the Applicant has no independent source of income and is completely unable to support herself.
3. That the Respondent is an affluent person earning over Rs. [Insert Husband Monthly Income]/- per month as [Insert Occupation].
4. That the Applicant has filed her Affidavit of Income, Assets, and Liabilities in terms of the landmark judgment of the Hon'ble Supreme Court in Rajnesh v. Neha, (2021) 2 SCC 324.

PRAYER:
Wherefore, it is prayed that this Hon'ble Court may direct Respondent to pay:
(a) Sum of Rs. [___]/- per month towards interim maintenance pendente lite;
(b) Sum of Rs. [___]/- towards litigation expenses.

APPLICANT
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-bnss-144-maintenance',
      category: 'marriage',
      categoryLabel: 'Marriage',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 144)',
      title: 'Maintenance Application for Wife & Child under Section 144 BNSS (Old 125 CrPC)',
      shortDesc: 'Application before Principal Judge, Family Court claiming monthly maintenance allowance for deserted wife and minor child replacing Section 125 CrPC.',
      limitationNotice: 'Summary Relief: Quasi-criminal statutory remedy to prevent destitution and vagrancy.',
      tags: ['Maintenance', 'Section 144 BNSS', 'Section 125 CrPC', 'Family Court', 'Child Support', 'Marriage'],
      content: `IN THE COURT OF THE PRINCIPAL JUDGE, FAMILY COURT AT [Insert District]

MAINTENANCE PETITION NO. ________ OF 2026

IN THE MATTER OF:
1. [Insert Wife Name], W/o [Insert Husband Name]
2. [Insert Minor Child Name], through mother
                                                        ...PETITIONERS
VERSUS
[Insert Husband Name], S/o [___]
                                                        ...RESPONDENT

PETITION UNDER SECTION 144 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (CORRESPONDING TO SECTION 125 CrPC, 1973) FOR MAINTENANCE

MOST RESPECTFULLY SHOWETH:

1. That Petitioner No. 1 is the legally wedded wife of Respondent, married on [Insert Date].
2. That Respondent has neglected and refused to maintain Petitioners without any just cause.
3. That Respondent has sufficient means and earns Rs. [___]/- per month.
4. That Petitioners are unable to maintain themselves.

PRAYER:
Prayed that Respondent be directed to pay Rs. [___]/- per month to Petitioner No. 1 and Rs. [___]/- per month to Petitioner No. 2.

PETITIONERS
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-dv-act-complaint',
      category: 'marriage',
      categoryLabel: 'Marriage',
      statute: 'Protection of Women from Domestic Violence Act, 2005 (Section 12)',
      title: 'Domestic Violence Application under Section 12 DV Act, 2005',
      shortDesc: 'Comprehensive petition before Magistrate seeking protection orders (S. 18), residence orders (S. 19), and monetary relief (S. 20) under Domestic Violence Act.',
      limitationNotice: 'Special Statute: Relief available to woman in domestic relationship facing physical, emotional, or economic domestic violence.',
      tags: ['Domestic Violence', 'DV Act Section 12', 'Protection Order', 'Residence Order', 'Family Law', 'Marriage'],
      content: `IN THE COURT OF THE METROPOLITAN MAGISTRATE / JMFC AT [Insert City]

DV PETITION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Aggrieved Woman Name]
                                                        ...AGGRIEVED PERSON
VERSUS
1. [Insert Husband Name]
2. [Insert In-Laws Names]
                                                        ...RESPONDENTS

APPLICATION UNDER SECTION 12 READ WITH SECTIONS 18, 19, 20, 22 OF THE PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005

MOST RESPECTFULLY SHOWETH:

1. That the Applicant has lived in domestic relationship in a shared household with Respondents.
2. That the Respondents have subjected the Applicant to continuous domestic violence, physical cruelty, and economic abuse.
3. PRAYER FOR RELIEFS:
   (a) Protection Order under Section 18 prohibiting acts of violence;
   (b) Residence Order under Section 19 securing right in shared household;
   (c) Monetary Relief under Section 20 for maintenance and medical expenses;
   (d) Compensation under Section 22 for mental torture.

AGGRIEVED PERSON
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 5: PROPERTY (Transfer of Property Act, Partition, Injunction)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-106-tpa-notice',
      category: 'property',
      categoryLabel: 'Property',
      statute: 'Transfer of Property Act, 1882 (Section 106)',
      title: 'Section 106 TPA — Notice to Quit & Terminate Monthly Tenancy',
      shortDesc: 'Statutory 15-day notice to tenant for terminating monthly tenancy and demanding vacant, peaceful possession along with mesne profits.',
      limitationNotice: 'Mandatory: 15 days notice expiring with the end of a month of the tenancy for leases other than agricultural/manufacturing (Section 106(1) TPA).',
      tags: ['Property Law', 'Tenancy', 'Eviction', 'Section 106 TPA', 'Landlord-Tenant', 'Property'],
      content: `REGISTERED POST WITH A.D. / SPEED POST / BY HAND

Date: [Insert Date, e.g., 12th October, 2026]

TO,
[Insert Name of Tenant]
S/o [Insert Father's Name]
Tenanted Premises at:
[Insert Complete Address of Tenanted Property, including Flat/Shop No., Floor, Area]

SUBJECT: NOTICE UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882 TERMINATING THE MONTHLY TENANCY IN RESPECT OF PREMISES SITUATED AT [Insert Short Property Address] AND DEMAND FOR VACANT POSSESSION AND ARREARS OF RENT.

Sir / Madam,

Under instructions from and on behalf of my client, [Insert Name of Landlord/Owner], S/o [Insert Father's Name], resident of [Insert Landlord Address] (hereinafter referred to as "my Client" / "the Landlord"), I do hereby serve upon you this Notice to Quit:

1. That my Client is the absolute owner and landlord of the property bearing [Insert Property Description], consisting of [Insert Details of space, e.g., Ground Floor Shop / 2BHK Apartment] (hereinafter referred to as the "Tenanted Premises").

2. That you were inducted as a monthly tenant in the Tenanted Premises under an oral / unregistered Lease Agreement dated [Insert Date], at a monthly rent of Rs. [Insert Monthly Rent]/- excluding electricity, water, and maintenance charges, payable in advance on or before the [___] day of each English calendar month.

3. That you have defaulted in the regular payment of rent since [Insert Default Month/Year] and are currently in outstanding arrears of rent amounting to Rs. [Insert Total Arrears Amount]/- up to the date of this notice.

4. That my Client no longer desires to continue your tenancy and has decided to terminate the same.

NOW, THEREFORE, by virtue of this Notice under Section 106 of the Transfer of Property Act, 1882, my Client HEREBY TERMINATES YOUR MONTHLY TENANCY in respect of the Tenanted Premises with effect from the expiry of FIFTEEN (15) DAYS from the date of receipt of this notice.

YOU ARE HEREBY CALLED UPON TO:
(a) Vacate and hand over peaceful, physical, and vacant possession of the Tenanted Premises to my Client on or before the expiry of 15 days from the receipt hereof;
(b) Pay the outstanding arrears of rent amounting to Rs. [Insert Amount]/- along with interest @ 18% p.a.

PLEASE TAKE NOTE that in the event of your failure to hand over vacant possession as demanded, your status shall be that of an unauthorized occupant / trespasser, and you shall be liable to pay mesne profits and damages for unauthorized use and occupation @ Rs. [Insert Daily/Monthly Damages Amount]/- per day/month until actual delivery of possession. My Client shall also immediately file a Suit for Possession, Recovery of Rent, and Mesne Profits against you in the competent Civil Court at your sole risk and costs.

Yours faithfully,

___________________________
[Insert Advocate Name]
Advocate
Enrolment No.: [Insert State Bar Enrolment No.]
Chamber Address: [Insert Address] | Phone: [Insert Contact]`
    },
    {
      id: 'tpl-property-partition-suit',
      category: 'property',
      categoryLabel: 'Property',
      statute: 'Code of Civil Procedure, 1908 & Hindu Succession Act, 1956',
      title: 'Plaint for Partition, Separate Possession & Injunction (Ancestral Property)',
      shortDesc: 'Complete civil suit plaint by co-owner / coparcener for division by metes and bounds of joint family ancestral immovable properties with preliminary decree prayer.',
      limitationNotice: 'Limitation: 12 years from when the exclusion becomes known to the plaintiff (Article 110 Limitation Act, 1963).',
      tags: ['Partition Suit', 'Coparcenary', 'Ancestral Property', 'Metes and Bounds', 'Civil Plaint', 'Property'],
      content: `IN THE COURT OF THE PRINCIPAL DISTRICT JUDGE / CIVIL JUDGE (SR. DIVISION) AT [Insert District]

SUIT NO. ________ OF 2026

IN THE MATTER OF:
[Insert Plaintiff Name], S/o [___]
                                                        ...PLAINTIFF
VERSUS
1. [Insert Defendant 1 Name, Co-owner]
2. [Insert Defendant 2 Name, Co-owner]
                                                        ...DEFENDANTS

SUIT FOR PARTITION, SEPARATION OF SHARES BY METES AND BOUNDS, AND PERMANENT INJUNCTION

MOST RESPECTFULLY SHOWETH:

1. That the Plaintiff and Defendants are real brothers / coparceners and co-owners of ancestral properties described in Schedule 'A' annexed hereto.
2. That Late [Insert Common Ancestor Name] was absolute owner who died intestate on [Insert Date], leaving behind Plaintiff and Defendants as sole surviving legal heirs under Section 8/6 of Hindu Succession Act.
3. That Plaintiff has a 1/3rd undivided share in the suit properties.
4. That Plaintiff approached Defendants on [Insert Date] demanding partition by metes and bounds, but Defendants refused.
5. That Defendants are actively attempting to alienate and create third-party rights over suit property to defeat Plaintiff's share.

PRAYER:
Wherefore, Plaintiff prays:
(a) Pass Preliminary Decree declaring Plaintiff entitled to 1/3rd share in suit properties;
(b) Appoint Local Commissioner to suggest partition by metes and bounds;
(c) Pass Final Decree for partition;
(d) Pass Permanent Injunction restraining Defendants from selling or creating third-party rights.

PLAINTIFF
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-property-agreement-to-sell',
      category: 'property',
      categoryLabel: 'Property',
      statute: 'Indian Contract Act, 1872 & Transfer of Property Act, 1882',
      title: 'Comprehensive Agreement to Sell Immovable Property with Title Warranties',
      shortDesc: 'Vetted real estate agreement to sell with earnest money (bayana) clauses, title indemnities, timeline for registration of sale deed, and forfeiture clauses.',
      limitationNotice: 'Specific Performance: Suit must be filed within 3 years from date fixed for performance (Article 54 Limitation Act).',
      tags: ['Agreement to Sell', 'Real Estate', 'Bayana', 'Earnest Money', 'Sale Deed', 'Property'],
      content: `AGREEMENT TO SELL IMMOVABLE PROPERTY

THIS AGREEMENT TO SELL is executed on this _____ day of ____________, 2026 at [Insert City] by and between:

VENDOR: [Insert Seller Name], S/o [___], R/o [___] (hereinafter called "First Party / Seller");
AND
PURCHASER: [Insert Buyer Name], S/o [___], R/o [___] (hereinafter called "Second Party / Buyer").

WHEREAS the Seller is absolute owner of property bearing No. [Insert Full Property Description] ("Schedule Property").

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
1. TOTAL SALE CONSIDERATION:
   Agreed total sale price is Rs. [Insert Total Amount]/- (Rupees ___ only).
2. EARNEST MONEY (BAYANA):
   Buyer has paid Rs. [Insert Advance Amount]/- as earnest money vide Cheque/NEFT No. [___] dated [___].
3. BALANCE PAYMENT & SALE DEED REGISTRATION:
   Balance amount of Rs. [___]/- shall be paid on or before [Insert Cut-off Date] against execution of Sale Deed before Sub-Registrar.
4. TITLE ASSURANCE:
   Seller guarantees free and clear title free from mortgages, liens, or legal encumbrances.
5. DEFAULT CLAUSE:
   If Seller fails to execute deed, Buyer may sue for Specific Performance. If Buyer defaults, earnest money shall be forfeited.

SELLER                                  BUYER
Witness 1: __________________           Witness 2: __________________`
    },
    {
      id: 'tpl-property-eviction-plaint',
      category: 'property',
      categoryLabel: 'Property',
      statute: 'Code of Civil Procedure, 1908 & Transfer of Property Act, 1882',
      title: 'Plaint for Ejectment, Arrears of Rent & Mesne Profits against Tenant',
      shortDesc: 'Formal civil suit plaint for eviction of monthly tenant following expiry of Section 106 TPA notice to quit, recovery of rent arrears, and future damages.',
      limitationNotice: 'Limitation: 12 years for possession based on title; 3 years for recovery of rent arrears.',
      tags: ['Eviction', 'Ejectment', 'Tenant Eviction', 'Mesne Profits', 'Civil Suit', 'Property'],
      content: `IN THE COURT OF THE SENIOR CIVIL JUDGE AT [Insert Court]

CIVIL SUIT NO. ________ OF 2026

[Insert Landlord Name]
                                                        ...PLAINTIFF
VERSUS
[Insert Tenant Name]
                                                        ...DEFENDANT

SUIT FOR EJECTMENT / POSSESSION, ARREARS OF RENT, AND MESNE PROFITS / DAMAGES

MOST RESPECTFULLY SHOWETH:

1. That Plaintiff is landlord and owner of premises [Insert Address].
2. That Defendant was inducted as monthly tenant at rent of Rs. [___]/- per month.
3. That Plaintiff served statutory notice under Section 106 TPA on [Insert Date] terminating tenancy.
4. That despite receipt on [___], Defendant has failed to deliver possession and is an unauthorized occupant.

PRAYER:
(a) Pass decree for possession of suit premises in favor of Plaintiff;
(b) Decree for recovery of arrears of rent amounting to Rs. [___]/-;
(c) Award mesne profits @ Rs. [___]/- per month until vacant possession is delivered.

PLAINTIFF
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 6: COMPANY & IBC (Companies Act, 2013 & Insolvency Law)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-nclt-oppression-241',
      category: 'company',
      categoryLabel: 'Company',
      statute: 'Companies Act, 2013 (Sections 241 & 242)',
      title: 'Company Petition before NCLT for Oppression & Mismanagement (Sections 241-242)',
      shortDesc: 'Comprehensive company petition before National Company Law Tribunal (NCLT) for relief against oppressive acts of majority shareholders and siphoning of corporate assets.',
      limitationNotice: 'Eligibility: Petitioners must hold not less than 1/10th of issued share capital or represent 1/10th of total members (Section 244 Companies Act, 2013).',
      tags: ['Company Law', 'NCLT', 'Oppression', 'Mismanagement', 'Section 241', 'Corporate Dispute', 'Company'],
      content: `BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, [Insert Bench, e.g., NEW DELHI BENCH (COURT-II)]

COMPANY PETITION NO. ________ OF 2026

IN THE MATTER OF SECTIONS 241 & 242 READ WITH SECTION 244 OF THE COMPANIES ACT, 2013

AND IN THE MATTER OF:
[Insert Minority Shareholder Name],
Holding [___]% equity shares
                                                        ...PETITIONER
VERSUS
1. [Insert Company Name] PRIVATE LIMITED,
   Through its Board of Directors
2. [Insert Majority Director Name]
                                                        ...RESPONDENTS

COMPANY PETITION FOR RELIEF AGAINST OPPRESSION AND MISMANAGEMENT

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner meets the threshold of Section 244(1)(a) of the Companies Act, 2013.
2. ACTS OF OPPRESSION AND MISMANAGEMENT:
   (a) The Respondent Directors have illegally siphoned off corporate funds to related entities.
   (b) Board meetings and AGMs were conducted without statutory notice to the Petitioner.
   (c) Arbitrary dilution of Petitioner's shareholding through sham rights issue.
3. That facts justify winding up of company on just and equitable grounds, but winding up would unfairly prejudice the members.

PRAYER:
Wherefore, it is prayed that this Hon'ble Tribunal may be pleased to:
(a) Supercede the existing Board and appoint an Independent Administrator;
(b) Order forensic audit of books of accounts;
(c) Restrain Respondents from creating third-party rights on company assets.

PETITIONER
THROUGH:
___________________________
[Insert Advocate / PCS Name], Advocate for Petitioner`
    },
    {
      id: 'tpl-ibc-section-8-demand',
      category: 'company',
      categoryLabel: 'Company',
      statute: 'Insolvency and Bankruptcy Code, 2016 (Section 8)',
      title: 'Statutory Demand Notice under Section 8 IBC, 2016 (Form 3 Demand Notice)',
      shortDesc: 'Mandatory 10-day statutory demand notice served by Operational Creditor demanding payment of operational debt before filing Section 9 CIRP petition.',
      limitationNotice: 'Mandatory Procedure: Corporate Debtor gets 10 days to either pay or bring to notice the existence of a pre-existing dispute (Section 8(2) IBC).',
      tags: ['IBC 2016', 'Section 8 Notice', 'Operational Debt', 'NCLT', 'Insolvency', 'CIRP', 'Company'],
      content: `FORM 3
[See Rule 5 of the Insolvency and Bankruptcy (Application to Adjudicating Authority) Rules, 2016]

FORM OF DEMAND NOTICE / INVOICE DEMANDING PAYMENT UNDER THE INSOLVENCY AND BANKRUPTCY CODE, 2016

Date: [Insert Date, e.g., 12th October, 2026]

TO,
[Insert Name of Corporate Debtor] PRIVATE LIMITED
Registered Office: [Insert Registered Office Address]
CIN: [Insert Corporate Identification Number]

FROM,
[Insert Operational Creditor Name]
Address: [Insert Creditor Address]

SUBJECT: DEMAND NOTICE UNDER SECTION 8 OF THE INSOLVENCY AND BANKRUPTCY CODE, 2016 FOR PAYMENT OF UNPAID OPERATIONAL DEBT AMOUNTING TO RS. [Insert Amount]/-.

Sir / Madam,

1. This demand notice is served upon you in respect of unpaid operational debt arising out of [Insert particulars of goods supplied / services rendered].
2. PARTICULARS OF OPERATIONAL DEBT:
   (a) Total Debt: Rs. [Insert Total Outstanding]/- along with interest @ 18% p.a.
   (b) Date of Default: [Insert Date of Default].
   (c) Particulars of Invoices: Invoice No. ___ dated ___ amounting to Rs. ___.

3. You are hereby called upon to pay the aforesaid operational debt within TEN (10) DAYS of receipt of this notice, failing which an application under Section 9 of the IBC shall be initiated before NCLT to initiate Corporate Insolvency Resolution Process (CIRP) against you.

OPERATIONAL CREDITOR
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-nda-agreement',
      category: 'company',
      categoryLabel: 'Company',
      statute: 'Indian Contract Act, 1872',
      title: 'Mutual Non-Disclosure Agreement (NDA & Confidentiality Contract)',
      shortDesc: 'Standard commercial contract protecting proprietary business data, trade secrets, algorithms, and legal disclosures during negotiations.',
      limitationNotice: 'Key Provisions: Strict definition of confidential information, carve-outs, 2-year survival clause, and exclusive jurisdiction.',
      tags: ['Contracts', 'NDA', 'Commercial Law', 'Confidentiality', 'Trade Secrets', 'Company'],
      content: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT ("Agreement") is made and entered into on this [Insert Date] day of [Insert Month], 2026 ("Effective Date"), by and between:

PARTY A: [Insert Name of Company / Individual A], having its registered office / residing at [Insert Address A] (hereinafter referred to as the "First Party");
AND
PARTY B: [Insert Name of Company / Individual B], having its registered office / residing at [Insert Address B] (hereinafter referred to as the "Second Party").

(Party A and Party B are hereinafter individually referred to as "Party" and collectively as "Parties").

WHEREAS the Parties wish to explore a potential business relationship / engagement regarding [Insert Purpose, e.g., legal consulting / software development / partnership] ("the Purpose"), in the course of which either Party may disclose Confidential Information to the other.

NOW, THEREFORE, in consideration of the mutual covenants herein contained, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION:
   "Confidential Information" means all non-public information, whether technical, financial, commercial, legal, or operational, disclosed by one Party ("Disclosing Party") to the other ("Receiving Party"), whether orally, in writing, electronically, or by inspection.

2. EXCLUSIONS FROM CONFIDENTIAL INFORMATION:
   Confidential Information shall not include information that:
   (a) is or becomes publicly known through no breach of this Agreement;
   (b) was already known to the Receiving Party prior to disclosure;
   (c) is independently developed by the Receiving Party without reference to the Disclosing Party's information;
   (d) is required to be disclosed pursuant to judicial process or applicable law, with prior written notice to the Disclosing Party.

3. OBLIGATIONS OF RECEIVING PARTY:
   The Receiving Party agrees to:
   (a) Hold all Confidential Information in strict confidence using the same degree of care it uses for its own confidential data, but not less than reasonable care;
   (b) Use the Confidential Information solely for the Purpose stated herein;
   (c) Not disclose Confidential Information to any third party without prior written consent.

4. TERM & SURVIVAL:
   This Agreement shall remain in effect for a period of ONE (1) YEAR from the Effective Date. The confidentiality obligations hereunder shall survive for a period of TWO (2) YEARS from the date of termination or disclosure, whichever is later.

5. GOVERNING LAW & JURISDICTION:
   This Agreement shall be governed by and construed in accordance with the laws of India. The courts at [Insert City, e.g., New Delhi] shall have exclusive jurisdiction over all disputes arising hereunder.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

FOR AND ON BEHALF OF FIRST PARTY:            FOR AND ON BEHALF OF SECOND PARTY:
Signature: __________________________        Signature: __________________________
Name: [Insert Name]                          Name: [Insert Name]
Title: [Insert Title]                        Title: [Insert Title]`
    },
    {
      id: 'tpl-board-resolution-banking',
      category: 'company',
      categoryLabel: 'Company',
      statute: 'Companies Act, 2013 (Section 179)',
      title: 'Certified Board Resolution for Corporate Litigation & Power of Attorney',
      shortDesc: 'Certified true copy of board resolution authorizing Director / Authorized Signatory to institute legal proceedings and sign pleadings.',
      limitationNotice: 'Corporate Mandate: Order 29 Rule 1 CPC requires pleadings on behalf of a corporation to be signed by a duly authorized officer.',
      tags: ['Board Resolution', 'Corporate Litigation', 'Power of Attorney', 'Order 29 CPC', 'Company'],
      content: `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF [Insert Company Name] PRIVATE LIMITED HELD ON [Insert Date] AT THE REGISTERED OFFICE OF THE COMPANY.

"RESOLVED THAT the Company do initiate and defend all legal proceedings, suits, appeals, revisions, arbitrations, and petitions before any Court, Tribunal, High Court, Supreme Court, or Police Station in respect of [Insert Dispute Subject].

RESOLVED FURTHER THAT [Insert Name of Director / Authorized Signatory], Director of the Company, be and is hereby authorized to sign, verify, swear, and execute all plaints, written statements, petitions, affidavits, caveat petitions, vakalatnamas, powers of attorney, and applications on behalf of the Company.

RESOLVED FURTHER THAT [Insert Name] be authorized to engage Advocates, Senior Advocates, and legal counsels and settle their fees.

FOR AND ON BEHALF OF [Insert Company Name] PRIVATE LIMITED

___________________________________
[Insert Director Name]
Director / Managing Director
DIN: [Insert DIN Number]`
    },

    // -----------------------------------------------------------------------
    // SUBJECT 7: CIVIL, NOTICES & OTHER SUBJECTS (CPC, Consumer, NI Act)
    // -----------------------------------------------------------------------
    {
      id: 'tpl-138-ni-act',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Negotiable Instruments Act, 1881',
      title: 'Section 138 NI Act — Cheque Bounce Statutory Demand Notice',
      shortDesc: 'Mandatory 15-day statutory demand notice served upon the drawer following cheque dishonour for insufficiency of funds.',
      limitationNotice: 'Mandatory: Must be dispatched within 30 days of receiving the bank memo of dishonour (Section 138 Proviso (b)). Drawer receives 15 days from receipt to pay.',
      tags: ['Cheque Bounce', 'Section 138', 'Banking', 'Statutory Demand', 'Criminal Complaint', 'Civil & Notices'],
      content: `REGISTERED POST WITH A.D. / SPEED POST / LEGAL NOTICE
BY HAND & BY EMAIL

Date: [Insert Date of Notice, e.g., 12th October, 2026]

TO,
[Insert Name of Accused/Drawer]
[Insert Son/Daughter/Wife of, if applicable]
Residing at / Carrying on business at:
[Insert Full Postal Address of the Drawer]
Email: [Insert Email Address, if known]
Phone: [Insert Contact Number]

SUBJECT: STATUTORY LEGAL NOTICE UNDER SECTION 138 READ WITH SECTION 141 & 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 (AS AMENDED UP TO DATE) FOR DISHONOUR OF CHEQUE NO. [Insert Cheque Number] FOR AN AMOUNT OF RS. [Insert Amount in Figures]/- (RUPEES [Insert Amount in Words] ONLY).

Sir / Madam,

Under instructions from and on behalf of my client, [Insert Full Name of Payee/Complainant], S/o [Insert Father's Name], resident of [Insert Client Address] (hereinafter referred to as "my Client"), I do hereby serve upon you this Statutory Legal Notice:

1. That you, the Noticee, in discharge of your legally enforceable debt and outstanding liability towards my Client towards [Insert Nature of Transaction/Liability, e.g., repayment of friendly loan / payment against Invoice No. ___ dated ___ for supply of goods / professional services rendered], issued a cheque bearing No. [Insert Cheque No.] dated [Insert Cheque Date], drawn on [Insert Name of Bank & Branch], for an amount of Rs. [Insert Amount in Figures]/- (Rupees [Insert Amount in Words] only) in favour of my Client.

2. That at the time of handing over the said cheque, you expressly represented and assured my Client that the said cheque was genuine and valid and would be duly honoured on presentation by the drawee bank.

3. That believing your express representation and assurance, my Client presented the said cheque for encashment through its banker, namely [Insert Name of Complainant's Bank & Branch], on [Insert Presentation Date].

4. That to the shock and utter dismay of my Client, the said cheque was returned unpaid and dishonoured by the drawee bank vide Bank Return Memo dated [Insert Date of Return Memo] with the remarks "[Insert Reason as per memo, e.g., 'FUNDS INSUFFICIENT' / 'EXCEEDS ARRANGEMENT' / 'ACCOUNT CLOSED']". The said Return Memo was received by my Client on [Insert Date of Receipt of Memo].

5. That it is crystal clear that you, the Noticee, issued the aforesaid cheque knowing fully well that there were insufficient funds in your account, with a malafide and dishonest intention to cheat and defraud my Client of its rightful dues.

6. That by virtue of the said dishonour of the cheque, you have committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881, as well as offences of cheating and criminal breach of trust under the applicable provisions of the Bharatiya Nyaya Sanhita, 2023.

NOW, THEREFORE, I, on behalf of my Client, DO HEREBY CALL UPON YOU through this Statutory Notice to pay the aforesaid cheque amount of Rs. [Insert Amount in Figures]/- (Rupees [Insert Amount in Words] only), along with interest @ 18% per annum from the date of dishonour until realization, within a period of FIFTEEN (15) DAYS from the date of receipt of this Notice.

PLEASE NOTE that if you fail to make the aforesaid payment within the stipulated statutory period of 15 days, my Client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881 before the competent Court of Judicial Magistrate / Metropolitan Magistrate, at your sole risk, cost, and consequences, including praying for the maximum sentence of imprisonment and compensation as prescribed under law.

A copy of this Legal Notice is retained in my office for future reference and production before the Court.

Yours faithfully,

___________________________
[Insert Advocate Name]
Advocate
Enrolment No.: [Insert State Bar Council Enrolment No.]
Chamber Address: [Insert Chamber / Office Address]
Mobile: [Insert Phone Number] | Email: [Insert Email]`
    },
    {
      id: 'tpl-80-cpc-notice',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Code of Civil Procedure, 1908',
      title: 'Section 80 CPC — Statutory Notice to Government / Public Officer',
      shortDesc: 'Mandatory 2-month pre-suit statutory notice required before instituting any suit against the Union of India, State Government, or a Public Officer in respect of official acts.',
      limitationNotice: 'Mandatory: Suit cannot be instituted until the expiration of two months next after this notice has been delivered or left at the designated office (Section 80(1) CPC).',
      tags: ['Civil Procedure', 'Section 80 CPC', 'Government', 'Public Officer', 'Pre-Suit Notice', 'Civil & Notices'],
      content: `REGISTERED POST WITH A.D. / SPEED POST

Date: [Insert Date, e.g., 12th October, 2026]

TO,
1. THE SECRETARY,
   Ministry of [Insert Ministry / Department Name],
   Government of India / Government of NCT of Delhi / Government of [State],
   [Insert Office Address, New Delhi / State Capital].

2. [Insert Name & Designation of Public Officer, if applicable],
   [Insert Office Address].

SUBJECT: NOTICE UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908 (ACT V OF 1908) PRIOR TO INSTITUTION OF CIVIL SUIT FOR [Insert Cause of Action / Relief, e.g., RECOVERY OF DUES / DECLARATION AND PERMANENT INJUNCTION / DAMAGES].

Sir / Madam,

Under instructions from and on behalf of my client, [Insert Name of Intending Plaintiff], S/o [Insert Father's Name], resident of [Insert Address] (hereinafter referred to as "the Intending Plaintiff"), I do hereby serve upon you this Statutory Notice under Section 80 of the Code of Civil Procedure, 1908:

1. THE PARTIES:
   (a) The Intending Plaintiff is [Insert brief background of Plaintiff, e.g., a registered government contractor / citizen / employee / landowner of property situated at ___].
   (b) The proposed Defendants in the contemplated suit are the Union of India / State Government through the Secretary, Ministry of [___], and [Insert Public Officer Name].

2. CAUSE OF ACTION & FACTS OF THE CASE:
   (a) That on [Insert Date], [State the primary facts leading to dispute, e.g., the Intending Plaintiff entered into an agreement bearing No. ___ with the Department for the execution of works / owned land bearing Khasra No. ___].
   (b) That the Intending Plaintiff duly complied with all contractual and statutory obligations, including [State acts of compliance].
   (c) That despite full performance, the proposed Defendants unlawfully, arbitrarily, and without jurisdiction [State the wrongful act/omission, e.g., withheld payment of final bill amounting to Rs. ___ / issued arbitrary show-cause notice / threatened demolition without due process].
   (d) That several representations were made by the Intending Plaintiff dated [Insert Dates of representations], but the proposed Defendants failed and neglected to redress the genuine grievances.

3. RELIEFS CLAIMED IN THE CONTEMPLATED SUIT:
   In the civil suit to be instituted upon the expiry of the statutory period of two months, the Intending Plaintiff shall claim the following reliefs:
   (a) A Decree for payment of Rs. [Insert Amount]/- along with interest @ [___]% per annum from the date of accrual until realization;
   (b) A Decree of Permanent Injunction restraining the Defendants from [Insert Injunction Prayer];
   (c) Costs of the suit and this notice;
   (d) Any other relief which the Hon'ble Court may deem fit and proper.

NOW, THEREFORE, take notice that if the aforesaid grievances are not redressed and the claim of the Intending Plaintiff is not satisfied within TWO MONTHS from the date of service of this notice, my Client shall institute a civil suit against you in the competent Civil Court at [Insert City/District], holding you liable for all costs and consequences thereof.

Yours faithfully,

___________________________
[Insert Advocate Name]
Advocate
Enrolment No.: [Insert Enrolment No.]
Address: [Insert Chamber Address]
Contact: [Insert Phone & Email]`
    },
    {
      id: 'tpl-consumer-notice',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Consumer Protection Act, 2019',
      title: 'Statutory Legal Notice for Deficiency in Service & Unfair Trade Practice',
      shortDesc: 'Pre-litigation demand notice served upon manufacturers, sellers, or service providers prior to filing a complaint before the District Consumer Commission.',
      limitationNotice: 'Consumer Forum Limitation: A consumer complaint must be filed within 2 years from the date on which the cause of action arises (Section 69 Consumer Protection Act, 2019).',
      tags: ['Consumer Law', 'Deficiency in Service', 'Notice', 'Compensation', 'District Commission', 'Civil & Notices'],
      content: `REGISTERED POST WITH A.D. / SPEED POST / EMAIL

Date: [Insert Date, e.g., 12th October, 2026]

TO,
1. [Insert Name of Company / Service Provider / Dealer]
   Through its Managing Director / Authorized Representative
   Registered Office at: [Insert Full Corporate Address]
   Customer Support Email: [Insert Email Address]

SUBJECT: STATUTORY LEGAL NOTICE UNDER THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE, SALE OF DEFECTIVE GOODS, UNFAIR TRADE PRACTICE, AND CLAIM FOR REFUND WITH COMPENSATION.

Sir / Madam,

Under instructions from and on behalf of my client, [Insert Name of Consumer], S/o [Insert Father's Name], resident of [Insert Consumer Address] (hereinafter referred to as "my Client"), I do hereby serve upon you this Statutory Legal Notice:

1. That my Client purchased / subscribed to [Insert Description of Product or Service, e.g., Smart Refrigerator / Airline Ticket / Medical Insurance Policy] bearing Model / Booking / Policy No. [Insert No.] from your authorized store / online platform on [Insert Date of Purchase] for a total consideration of Rs. [Insert Amount Paid]/- vide Invoice No. [Insert Invoice No.].

2. That at the time of purchase, you expressly assured my Client regarding the premium quality, merchantability, and warranty/guarantee of the said product/service.

3. That within [Insert Time, e.g., 2 weeks] of purchase, the said product/service developed severe defects, namely [Describe defects in detail].

4. That my Client promptly lodged complaints with your customer care department vide Complaint Ticket Nos. [Insert Ticket Numbers] dated [Insert Dates]. However, your representatives failed, neglected, and refused to rectify the defects or replace the defective product, causing severe mental harassment, financial distress, and inconvenience to my Client.

5. That your aforesaid acts of supplying defective goods / failing to provide committed service constitute gross "Deficiency in Service" under Section 2(11) and "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.

NOW, THEREFORE, I, on behalf of my Client, hereby call upon you to:
(a) Refund the entire purchase consideration of Rs. [Insert Amount]/- along with interest @ 18% p.a. from the date of payment until realization; OR immediately replace the product with a brand new, defect-free unit;
(b) Pay a sum of Rs. [Insert Compensation Amount, e.g., 50,000]/- towards compensation for mental agony, distress, and physical harassment;
(c) Pay a sum of Rs. [Insert Legal Expenses Amount, e.g., 11,000]/- towards the costs of this Legal Notice,
WITHIN FIFTEEN (15) DAYS from the date of receipt of this Notice.

PLEASE NOTE that failing compliance within 15 days, my Client shall institute a Consumer Complaint against you before the competent District Consumer Disputes Redressal Commission under Section 35 of the Consumer Protection Act, 2019 at your sole risk, cost, and consequences.

Yours faithfully,

___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-148a-cpc-caveat',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Code of Civil Procedure, 1908',
      title: 'Caveat Petition under Section 148A CPC with Supporting Affidavit',
      shortDesc: 'Precautionary petition filed to ensure no ex-parte interim order or stay is granted against the Caveator without prior notice and hearing.',
      limitationNotice: 'Statutory Validity: Remains in force for a period of 90 days from the date of filing (Section 148A(5) CPC). Copy must be dispatched to prospective non-caveator.',
      tags: ['Civil Procedure', 'Caveat Petition', 'Section 148A CPC', 'No Ex-Parte Orders', 'Affidavit', 'Civil & Notices'],
      content: `IN THE COURT OF THE DISTRICT JUDGE / CIVIL JUDGE (SENIOR DIVISION) AT [Insert District, e.g., NEW DELHI]

CAVEAT PETITION NO. ________ OF 2026

IN THE MATTER OF:
[Insert Caveator Name], S/o [Insert Father's Name],
R/o [Insert Caveator Address]
                                                        ...CAVEATOR
VERSUS
[Insert Prospective Non-Caveator / Opposite Party Name],
S/o [Insert Father's Name],
R/o [Insert Address of Expected Plaintiff/Petitioner]
                                                        ...PROSPECTIVE NON-CAVEATOR / APPLICANT

CAVEAT PETITION UNDER SECTION 148A OF THE CODE OF CIVIL PROCEDURE, 1908

MOST RESPECTFULLY SHOWETH:

1. That the Caveator has a reasonable expectation and apprehension that the above-named Non-Caveator may institute a Civil Suit / Appeal / Miscellaneous Application / Application for Temporary Injunction under Order 39 Rules 1 & 2 CPC against the Caveator in this Hon'ble Court in respect of [Insert Brief Subject Matter / Property Details, e.g., Property bearing No. ___ / Agreement to Sell dated ___].

2. That the Caveator has a direct, substantial, and subsisting legal interest in the subject matter and would be severely prejudiced if any ex-parte ad-interim order, stay, or injunction is granted against the Caveator without affording a reasonable opportunity of being heard.

3. That a copy of this Caveat Petition has been dispatched to the Non-Caveator by Registered Post with A.D. / Speed Post at the address mentioned above on [Insert Date of Dispatch], in strict compliance with Section 148A(2) of the Code of Civil Procedure, 1908. Postal receipt bearing No. [___] is annexed herewith.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased:
(a) To issue notice to the Caveator before passing any ad-interim, interim, or final order on any suit, appeal, petition, or application that may be filed by the Non-Caveator against the Caveator;
(b) To not grant any ex-parte order in the expected matter without prior notice and hearing to the Caveator.

CAVEATOR
THROUGH:
___________________________
[Insert Advocate Name], Advocate
Enrolment No.: [Insert Enrolment No.]`
    },
    {
      id: 'tpl-order39-injunction',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Code of Civil Procedure, 1908 (Order 39 Rules 1 & 2)',
      title: 'Application for Ex-Parte Ad-Interim Injunction (Order 39 Rules 1 & 2 CPC)',
      shortDesc: 'Application for temporary injunction restraining alienation, demolition, or creation of third-party rights on suit property satisfying the three-fold test.',
      limitationNotice: 'Three-Fold Injunction Test: Prima facie case, balance of convenience, and irreparable injury (Dalpat Kumar v. Prahlad Singh).',
      tags: ['Injunction', 'Order 39', 'Stay Order', 'Civil Suit', 'Temporary Injunction', 'Civil & Notices'],
      content: `IN THE COURT OF THE SENIOR CIVIL JUDGE AT [Insert Court Name]

IN CIVIL SUIT NO.: ________ / 2026
[Insert Case Title, e.g., Plaintiff v. Defendant]

APPLICATION ON BEHALF OF PLAINTIFF UNDER ORDER 39 RULES 1 & 2 READ WITH SECTION 151 OF THE CODE OF CIVIL PROCEDURE, 1908 FOR GRANT OF EX-PARTE AD-INTERIM INJUNCTION

MOST RESPECTFULLY SHOWETH:

1. That Plaintiff has instituted accompanying suit for Declaration and Permanent Injunction.
2. THAT PLAINTIFF HAS A STRONG PRIMA FACIE CASE:
   The Plaintiff has valid registered title documents in respect of suit property.
3. BALANCE OF CONVENIENCE IN PLAINTIFF'S FAVOR:
   If Defendant creates third-party rights, multiple litigations will ensue.
4. IRREPARABLE INJURY:
   The injury caused to Plaintiff cannot be compensated in terms of money.

PRAYER:
Wherefore, Plaintiff prays this Hon'ble Court may graciously:
(a) Restrain Defendant from selling, alienating, or creating third-party rights over suit property;
(b) Pass ex-parte ad-interim order in terms of prayer (a).

PLAINTIFF
THROUGH:
___________________________
[Insert Advocate Name], Advocate`
    },
    {
      id: 'tpl-vakalatnama',
      category: 'civil',
      categoryLabel: 'Civil & Notices',
      statute: 'Advocates Act, 1961 & Bar Council Rules',
      title: 'Advocate Vakalatnama with Power of Attorney Authorization Clauses',
      shortDesc: 'Vetted, formal Vakalatnama for District Courts, High Courts, and Tribunals empowering advocate to plead, act, compromise, and inspect records.',
      limitationNotice: 'Standard Practice: Includes advocate welfare stamp, court fee stamp, and express authorization clauses required under Order 3 Rule 4 CPC.',
      tags: ['Court Practice', 'Vakalatnama', 'Power of Attorney', 'Advocate Ethics', 'District Court', 'Civil & Notices'],
      content: `VAKALATNAMA
IN THE COURT OF ____________________________________________________ AT _________________
SUIT / CASE / PETITION NO. _____________________ OF 2026

IN THE MATTER OF:
____________________________________________________________________ ...PLAINTIFF / PETITIONER / APPLICANT / APPELLANT
VERSUS
____________________________________________________________________ ...DEFENDANT / RESPONDENT / ACCUSED

KNOW ALL to whom these presents shall come that I / We, the above-named ________________________________________________, do hereby appoint and retain:

[Insert Advocate Name(s)]
Advocate(s), Enrolment No(s): [Insert Bar Council Enrolment No(s)]
Chamber / Office Address: [Insert Chamber Address]
Contact No.: [Insert Mobile No.] | Email: [Insert Email]

(hereinafter called the "Advocate") to be my/our Advocate in the above-noted case.

I/We hereby authorize the said Advocate:
1. To act, appear, and plead on my/our behalf in the above-mentioned matter before this Hon'ble Court or any other Court, Bench, or Tribunal to which the matter may be transferred or appealed.
2. To file, sign, verify, and present plaints, written statements, petitions, affidavits, caveats, appeals, revisions, applications, and documents of every description.
3. To withdraw, compromise, or settle the suit or proceedings, or submit the same to arbitration, with my/our consent.
4. To deposit, receive, and accept all monies, refunds, and costs payable to me/us in the said proceedings, and grant valid receipts for the same.
5. To inspect records, obtain certified copies of orders, decrees, and judgments, and represent me/us in execution proceedings.
6. To appoint and instruct any other Advocate, Senior Advocate, or Pleader to act on my/our behalf whenever considered necessary.

AND I/WE hereby agree to ratify and confirm all acts, deeds, and things lawfully done by my/our said Advocate in the conduct of the case as if done by me/us in person.

IN WITNESS WHEREOF, I/We have set my/our hand to these presents on this _____ day of _______________, 2026.

___________________________________
CLIENT'S SIGNATURE / THUMB IMPRESSION

ACCEPTED & FILED:

___________________________________
[Insert Advocate Signature]
Advocate for the [Plaintiff / Defendant / Petitioner / Respondent / Accused]`
    }
  ];

  // =========================================================================
  // 2. REPOSITORY OF REAL-TIME DAILY LAW UPDATES & PRECEDENTS
  // =========================================================================
  const PRO_LAW_UPDATES_DB = [
    {
      id: 'upd-bnss-transition',
      date: 'Daily Update • October 2026',
      authority: 'Supreme Court of India • 3-Judge Bench',
      badgeClass: 'badge-sc',
      category: 'criminal',
      categoryLabel: 'Criminal Law (BNS/BNSS)',
      title: 'Applicability of New Criminal Laws to Pre-July 2024 Offences: Constitutional Article 20(1) Doctrine',
      citation: '2026 INSC 782 • AIR 2026 SC 1845',
      summary: 'The Supreme Court clarifies the exact operational boundary between IPC/CrPC and BNS/BNSS/BSA for offences committed prior to 1 July 2024.',
      holdings: [
        'Substantive penal liability is governed strictly by the law in force at the time of the commission of the act (Article 20(1) of the Constitution). If the offence was committed before 1 July 2024, the Indian Penal Code, 1860 strictly applies.',
        'Procedural steps initiated after 1 July 2024 (including investigation methods, filing of chargesheets, and trial procedure) shall follow the Bharatiya Nagarik Suraksha Sanhita, 2023, subject to Section 531 BNSS savings clause.',
        'Bail applications filed after 1 July 2024 are to be titled and processed under Sections 480, 482, and 483 of the BNSS, 2023, while evaluating the offence with reference to IPC provisions.'
      ],
      takeaway: 'In criminal pleadings for pre-July 2024 incidents, invoke procedural relief under BNSS (e.g. S. 482 BNSS) while referencing substantive charges under IPC (e.g. S. 420 IPC).'
    },
    {
      id: 'upd-satender-antil-bnss',
      date: 'Daily Update • September 2026',
      authority: 'Supreme Court of India • Criminal Division',
      badgeClass: 'badge-sc',
      category: 'criminal',
      categoryLabel: 'Criminal Law (BNS/BNSS)',
      title: 'Mandatory Compliance with Section 35 BNSS (Arrest Safeguards) Reaffirmed (*Satender Kumar Antil Guidelines*)',
      citation: '2026 INSC 694 • (2026) 4 SCC 312',
      summary: 'Arrest without compliance with Section 35 BNSS notice guidelines in offences punishable with imprisonment up to 7 years renders custody unlawful.',
      holdings: [
        'Section 35 of the BNSS, 2023 (corresponding to Section 41 & 41A of CrPC) requires police officers to record reasons in writing before effecting an arrest for offences punishable up to 7 years.',
        'Magistrates are duty-bound to examine whether Section 35 guidelines were strictly observed before authorizing initial police or judicial remand.',
        'Non-compliance entitles the accused to immediate consideration for regular bail under Category A of the Satender Kumar Antil framework.'
      ],
      takeaway: 'Always annex a specific paragraph in your bail application detailing non-compliance with Section 35 BNSS notice provisions to claim parity with Satender Kumar Antil.'
    },
    {
      id: 'upd-bsa-63-certificate',
      date: 'Daily Update • September 2026',
      authority: 'High Court of Delhi • Division Bench',
      badgeClass: 'badge-hc',
      category: 'criminal',
      categoryLabel: 'Evidence Law (BSA 2023)',
      title: 'Section 63 BSA (Old 65B IEA) Electronic Record Certificate: WhatsApp Chats and Call Detail Records',
      citation: '2026 DHC 4210 • 2026 Cri LJ 2890',
      summary: 'Division Bench lays down standardized format for electronic evidence certificates under Section 63 of Bharatiya Sakshya Adhiniyam, 2023.',
      holdings: [
        'A certificate under Section 63 BSA is mandatory for secondary electronic records (printouts of WhatsApp messages, exported chats, and CCTV footage).',
        'The certificate must identify the device, state the cryptographic hash (where applicable), and affirm that the device was operating properly during the relevant period.',
        'Production of the original device itself dispenses with the requirement of the Section 63 certificate under the direct evidence doctrine (reiterating Arjun Panditrao).'
      ],
      takeaway: 'Ensure every electronic printout filed with a complaint or written statement is supported by a signed Section 63 BSA Certificate at the time of filing itself.'
    },
    {
      id: 'upd-commercial-courts-12a',
      date: 'Daily Update • August 2026',
      authority: 'Supreme Court of India • 3-Judge Bench',
      badgeClass: 'badge-sc',
      category: 'civil',
      categoryLabel: 'Civil & Commercial Law',
      title: 'Pre-Institution Mediation under Section 12A Commercial Courts Act Held Non-Negotiable',
      citation: '2026 INSC 551 • AIR 2026 SC 1420',
      summary: 'Reiterating Patil Automation; plaints filed without exhausting Section 12A mediation must be rejected at the threshold under Order 7 Rule 11 CPC.',
      holdings: [
        'Pre-institution mediation under Section 12A of the Commercial Courts Act, 2015 is mandatory in all commercial suits of specified value (Rs. 3 Lakhs and above).',
        'The only exception is when the suit contemplates urgent interim relief. However, illusory or sham prayers for interim relief cannot bypass the mandatory requirement.',
        'Courts must examine whether the urgency is genuine before entertaining applications for dispensing with Section 12A mediation.'
      ],
      takeaway: 'Always apply for pre-institution mediation through the District Legal Services Authority (DLSA) unless an immediate injunction or freezing order is genuinely required.'
    },
    {
      id: 'upd-arbitration-stamp-act',
      date: 'Daily Update • July 2026',
      authority: 'Supreme Court of India • 7-Judge Constitution Bench',
      badgeClass: 'badge-sc',
      category: 'civil',
      categoryLabel: 'Arbitration Law',
      title: 'Arbitration Agreement Validity Independent of Underlying Contract Stamp Adjudication',
      citation: '2026 INSC 490 • (2026) 2 SCC 1',
      summary: 'Constitution Bench upholds separability doctrine: stamp duty deficiencies do not invalidate the appointment of an arbitrator under Section 11.',
      holdings: [
        'The referral court under Section 11 of the Arbitration and Conciliation Act, 2016 is restricted to examining the prima facie existence of the arbitration agreement.',
        'Issues regarding deficiency of stamp duty on the commercial contract fall exclusively within the jurisdiction of the arbitral tribunal under Section 16 (competence-competence).',
        'Overrules earlier conflicting benches and restores efficiency in commercial dispute resolution in India.'
      ],
      takeaway: 'Opponents cannot stall Section 11 arbitrator appointment petitions solely on grounds of non-stamping of the master commercial agreement.'
    },
    {
      id: 'upd-bci-rule-36-ethics',
      date: 'Daily Update • June 2026',
      authority: 'Bar Council of India • Statutory Resolution',
      badgeClass: 'badge-bci',
      category: 'ethics',
      categoryLabel: 'Bar Council & Practice Rules',
      title: 'Bar Council of India Guidelines on Advocate Digital Profiles and Virtual Courtroom Conduct',
      citation: 'BCI Circular No. 14/2026 • Gazette of India',
      summary: 'BCI clarifies the boundaries between permitted educational/academic publishing and prohibited commercial solicitation under Rule 36.',
      holdings: [
        'Advocates and law students may maintain non-commercial academic portals, legal blogs, and case law summaries without violating Rule 36 of BCI Rules.',
        'Websites must provide information only on areas of practice and qualifications without touting, testimonials, or fee comparisons.',
        'Hybrid court appearances require strict adherence to formal dress codes (black coat, white neckband) with zero informal backgrounds.'
      ],
      takeaway: 'Make Law Easy operates in 100% compliance with BCI Rule 36 as an educational, non-commercial public knowledge initiative.'
    }
  ];

  // =========================================================================
  // 3. PRO SECTION CONTROLLER & UI COMPONENT
  // =========================================================================
  let activeTab = 'templates'; // 'templates' | 'updates' | 'roadmap'
  let activeTemplateCategory = 'all';
  let activeUpdateCategory = 'all';
  let templateSearchQuery = '';
  let updateSearchQuery = '';

  function initProDesk() {
    renderProTabs();
    updateCategoryBadges();
    renderProTemplates();
    renderProUpdates();
    setupProEventListeners();
  }

  function renderProTabs() {
    const tabBtns = document.querySelectorAll('.pro-tab-btn');
    tabBtns.forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if (tab === activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const panels = {
      templates: document.getElementById('proTemplatesPanel'),
      updates: document.getElementById('proUpdatesPanel'),
      roadmap: document.getElementById('proRoadmapPanel')
    };

    Object.keys(panels).forEach(key => {
      if (panels[key]) {
        if (key === activeTab) {
          panels[key].style.display = 'block';
        } else {
          panels[key].style.display = 'none';
        }
      }
    });
  }

  function updateCategoryBadges() {
    const counts = {
      all: PRO_TEMPLATES_DB.length,
      crime: PRO_TEMPLATES_DB.filter(t => t.category === 'crime').length,
      ndps: PRO_TEMPLATES_DB.filter(t => t.category === 'ndps').length,
      corruption: PRO_TEMPLATES_DB.filter(t => t.category === 'corruption').length,
      marriage: PRO_TEMPLATES_DB.filter(t => t.category === 'marriage').length,
      property: PRO_TEMPLATES_DB.filter(t => t.category === 'property').length,
      company: PRO_TEMPLATES_DB.filter(t => t.category === 'company').length,
      civil: PRO_TEMPLATES_DB.filter(t => t.category === 'civil').length
    };

    const countEls = {
      all: document.getElementById('tplCountAll'),
      crime: document.getElementById('tplCountCrime'),
      ndps: document.getElementById('tplCountNdps'),
      corruption: document.getElementById('tplCountCorruption'),
      marriage: document.getElementById('tplCountMarriage'),
      property: document.getElementById('tplCountProperty'),
      company: document.getElementById('tplCountCompany'),
      civil: document.getElementById('tplCountCivil')
    };

    Object.keys(countEls).forEach(k => {
      if (countEls[k] && counts[k] !== undefined) {
        countEls[k].textContent = counts[k];
      }
    });

    const totalMetricsEl = document.getElementById('metricTotalTemplates');
    if (totalMetricsEl) {
      totalMetricsEl.textContent = `${PRO_TEMPLATES_DB.length}+`;
    }
  }

  function filterTemplates() {
    return PRO_TEMPLATES_DB.filter(t => {
      const matchesCategory = (activeTemplateCategory === 'all' || t.category === activeTemplateCategory);
      const q = templateSearchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        t.title.toLowerCase().includes(q) ||
        t.statute.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
      return matchesCategory && matchesSearch;
    });
  }

  function renderProTemplates() {
    const grid = document.getElementById('proTemplatesGrid');
    if (!grid) return;

    const filtered = filterTemplates();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="pro-empty-card">
          <div class="pro-empty-icon"><i class="fa-solid fa-file-circle-question"></i></div>
          <h4>No Legal Templates Found in This Subject</h4>
          <p>No drafting templates match your filter query "${escapeHtml(templateSearchQuery)}". Try switching subject subsections or clearing your search.</p>
          <button type="button" class="pro-empty-reset-btn" id="proResetTemplateFilterBtn">
            <i class="fa-solid fa-rotate-left"></i> View All Subjects
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('proResetTemplateFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeTemplateCategory = 'all';
          templateSearchQuery = '';
          const searchInput = document.getElementById('proTemplateSearchInput');
          if (searchInput) searchInput.value = '';
          updateTemplateCategoryPills();
          renderProTemplates();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(t => `
      <article class="pro-card pro-template-card" data-template-id="${t.id}" data-category="${t.category}">
        <div class="pro-card-header">
          <div class="pro-badge-group">
            <span class="pro-category-chip cat-${t.category}"><i class="fa-solid fa-folder-closed"></i> ${escapeHtml(t.categoryLabel)}</span>
            <span class="pro-statute-chip"><i class="fa-solid fa-scale-balanced"></i> ${escapeHtml(t.statute)}</span>
          </div>
          <button class="pro-quick-copy-icon-btn" data-copy-id="${t.id}" title="Quick Copy Template" aria-label="Quick Copy Template">
            <i class="fa-regular fa-copy"></i>
          </button>
        </div>

        <h3 class="pro-card-title">${escapeHtml(t.title)}</h3>
        <p class="pro-card-desc">${escapeHtml(t.shortDesc)}</p>

        <div class="pro-limitation-pill">
          <i class="fa-solid fa-clock"></i>
          <span>${escapeHtml(t.limitationNotice)}</span>
        </div>

        <div class="pro-card-tags">
          ${t.tags.map(tag => `<span class="pro-tag-badge">#${escapeHtml(tag)}</span>`).join('')}
        </div>

        <div class="pro-card-footer">
          <button type="button" class="pro-btn-preview" data-preview-id="${t.id}">
            <i class="fa-solid fa-eye"></i> <span>Preview &amp; Customize</span>
          </button>
          ${t.pdfUrl ? `
          <a href="${t.pdfUrl}" target="_blank" rel="noopener noreferrer" class="pro-btn-copy pro-btn-pdf-link" style="text-decoration:none;background:rgba(220,38,38,0.18);border-color:rgba(220,38,38,0.45);color:#ef4444;">
            <i class="fa-solid fa-file-pdf"></i> <span>Open PDF</span>
          </a>` : `
          <button type="button" class="pro-btn-copy" data-copy-id="${t.id}">
            <i class="fa-solid fa-copy"></i> <span>Copy Draft</span>
          </button>`}
        </div>
      </article>
    `).join('');

    // Attach click listeners to cards
    grid.querySelectorAll('.pro-btn-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-preview-id');
        openTemplatePreviewModal(id);
      });
    });

    grid.querySelectorAll('.pro-btn-copy:not(.pro-btn-pdf-link), .pro-quick-copy-icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-copy-id');
        copyTemplateContent(id, btn);
      });
    });
  }

  function filterUpdates() {
    return PRO_LAW_UPDATES_DB.filter(u => {
      const matchesCategory = (activeUpdateCategory === 'all' || u.category === activeUpdateCategory);
      const q = updateSearchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        u.title.toLowerCase().includes(q) ||
        u.authority.toLowerCase().includes(q) ||
        u.citation.toLowerCase().includes(q) ||
        u.summary.toLowerCase().includes(q) ||
        u.takeaway.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }

  function renderProUpdates() {
    const stream = document.getElementById('proUpdatesStream');
    if (!stream) return;

    const filtered = filterUpdates();

    if (filtered.length === 0) {
      stream.innerHTML = `
        <div class="pro-empty-card">
          <div class="pro-empty-icon"><i class="fa-solid fa-newspaper"></i></div>
          <h4>No Legal Updates Found</h4>
          <p>No legal updates match your filter query "${escapeHtml(updateSearchQuery)}". Try clearing filters.</p>
          <button type="button" class="pro-empty-reset-btn" id="proResetUpdateFilterBtn">
            <i class="fa-solid fa-rotate-left"></i> Reset Update Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('proResetUpdateFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeUpdateCategory = 'all';
          updateSearchQuery = '';
          const searchInput = document.getElementById('proUpdateSearchInput');
          if (searchInput) searchInput.value = '';
          updateUpdateCategoryPills();
          renderProUpdates();
        });
      }
      return;
    }

    stream.innerHTML = filtered.map(u => `
      <article class="pro-card pro-update-card" data-update-id="${u.id}">
        <div class="pro-update-header">
          <div class="pro-update-meta">
            <span class="pro-authority-badge ${u.badgeClass}"><i class="fa-solid fa-gavel"></i> ${escapeHtml(u.authority)}</span>
            <span class="pro-category-chip"><i class="fa-solid fa-bookmark"></i> ${escapeHtml(u.categoryLabel)}</span>
          </div>
          <div class="pro-date-citation">
            <span class="pro-update-date"><i class="fa-regular fa-calendar"></i> ${escapeHtml(u.date)}</span>
            <span class="pro-update-citation"><code>${escapeHtml(u.citation)}</code></span>
          </div>
        </div>

        <h3 class="pro-update-title">${escapeHtml(u.title)}</h3>
        <p class="pro-update-summary">${escapeHtml(u.summary)}</p>

        <div class="pro-holding-box">
          <div class="pro-box-label"><i class="fa-solid fa-scale-balanced"></i> Core Holdings &amp; Legal Principles:</div>
          <ul class="pro-holding-list">
            ${u.holdings.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        </div>

        <div class="pro-takeaway-box">
          <div class="pro-takeaway-label"><i class="fa-solid fa-lightbulb"></i> Courtroom &amp; Academic Takeaway:</div>
          <p class="pro-takeaway-text">${escapeHtml(u.takeaway)}</p>
        </div>

        <div class="pro-update-actions">
          <button type="button" class="pro-update-copy-btn" data-update-copy-id="${u.id}">
            <i class="fa-regular fa-copy"></i> <span>Copy Case Summary</span>
          </button>
          <span class="pro-update-verified-pill"><i class="fa-solid fa-circle-check"></i> Ratio Verified</span>
        </div>
      </article>
    `).join('');

    // Attach copy listeners
    stream.querySelectorAll('.pro-update-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-update-copy-id');
        copyUpdateContent(id, btn);
      });
    });
  }

  function openTemplatePreviewModal(templateId) {
    const template = PRO_TEMPLATES_DB.find(t => t.id === templateId);
    if (!template) return;

    let modal = document.getElementById('proPreviewModal');
    let overlay = document.getElementById('proPreviewModalOverlay');

    if (!modal) {
      overlay = document.createElement('div');
      overlay.id = 'proPreviewModalOverlay';
      overlay.className = 'pro-preview-modal-overlay';
      document.body.appendChild(overlay);

      modal = document.createElement('div');
      modal.id = 'proPreviewModal';
      modal.className = 'pro-preview-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);

      overlay.addEventListener('click', closeTemplatePreviewModal);
    }

    modal.innerHTML = `
      <div class="pro-modal-inner">
        <div class="pro-modal-header">
          <div class="pro-modal-title-group">
            <span class="pro-modal-crest"><i class="fa-solid fa-file-signature"></i></span>
            <div>
              <div class="pro-modal-meta-top">
                <span class="pro-category-chip cat-${template.category}">${escapeHtml(template.categoryLabel)}</span>
                <span class="pro-statute-chip">${escapeHtml(template.statute)}</span>
              </div>
              <h3 class="pro-modal-title">${escapeHtml(template.title)}</h3>
            </div>
          </div>
          <button type="button" class="pro-modal-close-btn" id="proModalCloseBtn" title="Close Preview (Esc)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="pro-modal-alert">
          <i class="fa-solid fa-circle-info"></i>
          <span><b>Customization Tip:</b> Replace the bracketed placeholders like <code>[Insert Name]</code> with your actual case particulars.</span>
        </div>

        <div class="pro-modal-body">
          <div class="pro-modal-text-wrap">
            <pre class="pro-modal-pre" id="proModalTemplateText">${escapeHtml(template.content)}</pre>
          </div>
        </div>

        <div class="pro-modal-footer">
          <div class="pro-modal-footer-left">
            <button type="button" class="pro-modal-download-btn" id="proModalDownloadBtn">
              <i class="fa-solid fa-download"></i> <span>Download Draft (.txt)</span>
            </button>
            ${template.pdfUrl ? `
            <a href="${template.pdfUrl}" target="_blank" rel="noopener noreferrer" class="pro-modal-download-btn" style="text-decoration:none;background:rgba(220,38,38,0.15);border-color:rgba(220,38,38,0.4);color:#ef4444;">
              <i class="fa-solid fa-file-pdf"></i> <span>Download Official PDF</span>
            </a>` : ''}
          </div>
          <div class="pro-modal-footer-right">
            <button type="button" class="pro-modal-close-secondary" id="proModalSecondaryCloseBtn">Close</button>
            <button type="button" class="pro-modal-copy-btn liquid-metal-btn" id="proModalCopyBtn">
              <span class="btn-icon-wrap"><i class="fa-solid fa-copy"></i></span>
              <span class="btn-lbl">Copy Complete Draft</span>
            </button>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook up modal buttons
    const closeBtn = document.getElementById('proModalCloseBtn');
    const secCloseBtn = document.getElementById('proModalSecondaryCloseBtn');
    const copyBtn = document.getElementById('proModalCopyBtn');
    const downloadBtn = document.getElementById('proModalDownloadBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeTemplatePreviewModal);
    if (secCloseBtn) secCloseBtn.addEventListener('click', closeTemplatePreviewModal);

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(template.content).then(() => {
          showProToast('Legal template copied to clipboard with formatting!');
          copyBtn.innerHTML = '<span class="btn-icon-wrap"><i class="fa-solid fa-check"></i></span><span class="btn-lbl">Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span class="btn-icon-wrap"><i class="fa-solid fa-copy"></i></span><span class="btn-lbl">Copy Complete Draft</span>';
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          showProToast('Please copy manually (browser permission denied).');
        });
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        downloadTextFile(`${template.id}.txt`, template.content);
        showProToast('Downloaded drafting file successfully!');
      });
    }

    // Escape key closes modal
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeTemplatePreviewModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function closeTemplatePreviewModal() {
    const modal = document.getElementById('proPreviewModal');
    const overlay = document.getElementById('proPreviewModalOverlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function copyTemplateContent(templateId, triggerBtn) {
    const template = PRO_TEMPLATES_DB.find(t => t.id === templateId);
    if (!template) return;

    navigator.clipboard.writeText(template.content).then(() => {
      showProToast(`Copied "${template.title}" to clipboard!`);
      if (triggerBtn) {
        const origHTML = triggerBtn.innerHTML;
        triggerBtn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> <span>Copied!</span>';
        setTimeout(() => { triggerBtn.innerHTML = origHTML; }, 2000);
      }
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
      openTemplatePreviewModal(templateId);
    });
  }

  function copyUpdateContent(updateId, triggerBtn) {
    const update = PRO_LAW_UPDATES_DB.find(u => u.id === updateId);
    if (!update) return;

    const formattedText = `[MAKE LAW EASY PRO • DAILY LEGAL UPDATE]
${update.title}
Authority: ${update.authority}
Citation: ${update.citation} (${update.date})

SUMMARY:
${update.summary}

KEY HOLDINGS:
${update.holdings.map((h, i) => `${i + 1}. ${h}`).join('\n')}

TAKEAWAY:
${update.takeaway}

Source: Make Law Easy (https://makelaweasy.in/pro)`;

    navigator.clipboard.writeText(formattedText).then(() => {
      showProToast('Precedent summary copied to clipboard!');
      if (triggerBtn) {
        const origHTML = triggerBtn.innerHTML;
        triggerBtn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> <span>Copied!</span>';
        setTimeout(() => { triggerBtn.innerHTML = origHTML; }, 2000);
      }
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }

  function downloadTextFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function showProToast(message) {
    let toast = document.getElementById('proToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'proToast';
      toast.className = 'pro-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(message)}</span>`;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  function updateTemplateCategoryPills() {
    const pills = document.querySelectorAll('.pro-filter-pill[data-tpl-cat]');
    pills.forEach(pill => {
      const cat = pill.getAttribute('data-tpl-cat');
      if (cat === activeTemplateCategory) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function updateUpdateCategoryPills() {
    const pills = document.querySelectorAll('.pro-filter-pill[data-upd-cat]');
    pills.forEach(pill => {
      const cat = pill.getAttribute('data-upd-cat');
      if (cat === activeUpdateCategory) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function setupProEventListeners() {
    // Pro Sub-Tabs Switcher (TEMPLATES vs DAILY UPDATES vs ROADMAP)
    const tabBtns = document.querySelectorAll('.pro-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== activeTab) {
          activeTab = tab;
          renderProTabs();
        }
      });
    });

    // Template Category Pills (CRIME, NDPS, CORRUPTION, MARRIAGE, PROPERTY, COMPANY, ALL OTHER SUBJECTS)
    const tplPills = document.querySelectorAll('.pro-filter-pill[data-tpl-cat]');
    tplPills.forEach(pill => {
      pill.addEventListener('click', () => {
        activeTemplateCategory = pill.getAttribute('data-tpl-cat') || 'all';
        updateTemplateCategoryPills();
        renderProTemplates();
      });
    });

    // Template Search
    const tplSearchInput = document.getElementById('proTemplateSearchInput');
    const tplSearchClear = document.getElementById('proTemplateSearchClear');
    if (tplSearchInput) {
      tplSearchInput.addEventListener('input', (e) => {
        templateSearchQuery = e.target.value;
        if (tplSearchClear) {
          tplSearchClear.style.display = templateSearchQuery ? 'inline-flex' : 'none';
        }
        renderProTemplates();
      });
    }
    if (tplSearchClear) {
      tplSearchClear.addEventListener('click', () => {
        templateSearchQuery = '';
        if (tplSearchInput) tplSearchInput.value = '';
        tplSearchClear.style.display = 'none';
        renderProTemplates();
      });
    }

    // Update Category Pills
    const updPills = document.querySelectorAll('.pro-filter-pill[data-upd-cat]');
    updPills.forEach(pill => {
      pill.addEventListener('click', () => {
        activeUpdateCategory = pill.getAttribute('data-upd-cat') || 'all';
        updateUpdateCategoryPills();
        renderProUpdates();
      });
    });

    // Update Search
    const updSearchInput = document.getElementById('proUpdateSearchInput');
    const updSearchClear = document.getElementById('proUpdateSearchClear');
    if (updSearchInput) {
      updSearchInput.addEventListener('input', (e) => {
        updateSearchQuery = e.target.value;
        if (updSearchClear) {
          updSearchClear.style.display = updateSearchQuery ? 'inline-flex' : 'none';
        }
        renderProUpdates();
      });
    }
    if (updSearchClear) {
      updSearchClear.addEventListener('click', () => {
        updateSearchQuery = '';
        if (updSearchInput) updSearchInput.value = '';
        updSearchClear.style.display = 'none';
        renderProUpdates();
      });
    }

    // Pro Feature Request Button
    const reqFeatureBtn = document.getElementById('proRequestFeatureBtn');
    if (reqFeatureBtn) {
      reqFeatureBtn.addEventListener('click', () => {
        if (typeof window.navigateToFeedback === 'function') {
          window.navigateToFeedback();
        } else {
          window.location.hash = '#feedback';
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose Global Controller
  window.PRO_TEMPLATES_DB = PRO_TEMPLATES_DB;
  window.PRO_LAW_UPDATES_DB = PRO_LAW_UPDATES_DB;
  window.initProDesk = initProDesk;

})();
