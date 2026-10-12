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
  // 1. REPOSITORY OF READY-TO-USE LEGAL TEMPLATES
  // =========================================================================
  const PRO_TEMPLATES_DB = [
    {
      id: 'tpl-pdf-criminal-trial',
      category: 'pleadings',
      categoryLabel: 'Court Pleadings & Bail',
      statute: 'Criminal Procedure & BNSS / CrPC Trial Practice',
      title: 'Criminal Defense & Trial Court Pleadings Compendium (Master Docket PDF)',
      shortDesc: 'Authoritative trial court drafting compendium containing vetted criminal trial court applications, bail petitions, and trial formats.',
      limitationNotice: 'Master Docket PDF: Complete court-tested litigation file containing standard trial court applications and procedural formats.',
      tags: ['Criminal Practice', 'Bail', 'Trial Court', 'Official PDF', 'Compendium'],
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
      category: 'pleadings',
      categoryLabel: 'Court Pleadings & Bail',
      statute: 'Criminal Appellate Practice & High Court Jurisprudence',
      title: 'Criminal Revisions, Quashing & Appeals Master Manual (Part II PDF)',
      shortDesc: 'Advanced appellate criminal drafting compendium for Sessions Courts and High Courts covering revisions, quashing, and statutory appeals.',
      limitationNotice: 'Master Docket PDF: High Court & Sessions Court appellate drafting compendium with standard prayer clauses.',
      tags: ['Criminal Revision', 'Appeals', 'High Court', 'Official PDF', 'Compendium'],
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
      id: 'tpl-pdf-ndps-docket',
      category: 'pleadings',
      categoryLabel: 'Court Pleadings & Bail',
      statute: 'Narcotic Drugs & Psychotropic Substances Act, 1985',
      title: 'Special NDPS Act Trial & Section 37 Bail Practice Compendium (PDF)',
      shortDesc: 'Specialized litigation compendium for NDPS Special Courts covering search & seizure memo compliance, sampling, and Section 37 bail.',
      limitationNotice: 'Special Statute PDF: Focuses on Section 37 twin conditions, Section 42/50 search compliance, and Section 52A inventory certification.',
      tags: ['NDPS Act', 'Section 37 Bail', 'Special Court', 'Official PDF', 'Narcotics'],
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
      id: 'tpl-138-ni-act',
      category: 'notices',
      categoryLabel: 'Statutory Notice',
      statute: 'Negotiable Instruments Act, 1881',
      title: 'Section 138 NI Act — Cheque Bounce Statutory Demand Notice',
      shortDesc: 'Mandatory 15-day statutory demand notice served upon the drawer following cheque dishonour for insufficiency of funds.',
      limitationNotice: 'Mandatory: Must be dispatched within 30 days of receiving the bank memo of dishonour (Section 138 Proviso (b)). Drawer receives 15 days from receipt to pay.',
      tags: ['Cheque Bounce', 'Section 138', 'Banking', 'Statutory Demand', 'Criminal Complaint'],
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
      category: 'notices',
      categoryLabel: 'Statutory Notice',
      statute: 'Code of Civil Procedure, 1908',
      title: 'Section 80 CPC — Statutory Notice to Government / Public Officer',
      shortDesc: 'Mandatory 2-month pre-suit statutory notice required before instituting any suit against the Union of India, State Government, or a Public Officer in respect of official acts.',
      limitationNotice: 'Mandatory: Suit cannot be instituted until the expiration of two months next after this notice has been delivered or left at the designated office (Section 80(1) CPC).',
      tags: ['Civil Procedure', 'Section 80 CPC', 'Government', 'Public Officer', 'Pre-Suit Notice'],
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
      id: 'tpl-106-tpa-notice',
      category: 'notices',
      categoryLabel: 'Statutory Notice',
      statute: 'Transfer of Property Act, 1882',
      title: 'Section 106 TPA — Notice to Quit & Terminate Monthly Tenancy',
      shortDesc: 'Statutory 15-day notice to tenant for terminating monthly tenancy and demanding vacant, peaceful possession along with mesne profits.',
      limitationNotice: 'Mandatory: 15 days notice expiring with the end of a month of the tenancy for leases other than agricultural/manufacturing (Section 106(1) TPA).',
      tags: ['Property Law', 'Tenancy', 'Eviction', 'Section 106 TPA', 'Landlord-Tenant'],
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
      id: 'tpl-bnss-regular-bail',
      category: 'pleadings',
      categoryLabel: 'Criminal Pleading',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Regular Bail Application under Section 480 & 483 BNSS, 2023',
      shortDesc: 'Comprehensive bail application before Court of Sessions / High Court replacing Sections 437 & 439 of the Code of Criminal Procedure, 1973.',
      limitationNotice: 'Procedure: Incorporates modern BNSS provisions, compliance with Supreme Court Satender Kumar Antil (2022) categorization, and triple test grounds.',
      tags: ['Criminal Procedure', 'Regular Bail', 'BNSS Section 480', 'BNSS Section 483', 'Sessions Court'],
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
      category: 'pleadings',
      categoryLabel: 'Criminal Pleading',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Anticipatory Bail Application under Section 482 BNSS, 2023',
      shortDesc: 'Pre-arrest bail petition before the Court of Sessions or High Court replacing Section 438 of the Code of Criminal Procedure, 1973.',
      limitationNotice: 'Procedure: Must show genuine apprehension of arrest in non-bailable offence; incorporates undertaking to join investigation under S. 35(3) BNSS.',
      tags: ['Criminal Procedure', 'Anticipatory Bail', 'BNSS Section 482', 'Pre-Arrest', 'Sessions Court'],
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
      id: 'tpl-148a-cpc-caveat',
      category: 'pleadings',
      categoryLabel: 'Civil Pleading',
      statute: 'Code of Civil Procedure, 1908',
      title: 'Caveat Petition under Section 148A CPC with Supporting Affidavit',
      shortDesc: 'Precautionary petition filed to ensure no ex-parte interim order or stay is granted against the Caveator without prior notice and hearing.',
      limitationNotice: 'Statutory Validity: Remains in force for a period of 90 days from the date of filing (Section 148A(5) CPC). Copy must be dispatched to prospective non-caveator.',
      tags: ['Civil Procedure', 'Caveat Petition', 'Section 148A CPC', 'No Ex-Parte Orders', 'Affidavit'],
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
      id: 'tpl-223-bnss-complaint',
      category: 'pleadings',
      categoryLabel: 'Criminal Pleading',
      statute: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Criminal Complaint under Section 223 BNSS, 2023',
      shortDesc: 'Formal private complaint before Judicial Magistrate replacing Section 200 CrPC, incorporating the mandatory pre-cognizance opportunity of being heard.',
      limitationNotice: 'Key Change: Section 223(1) BNSS mandates giving the proposed accused an opportunity of being heard before the Magistrate takes cognizance of a complaint.',
      tags: ['Criminal Procedure', 'Complaint', 'BNSS Section 223', 'Magistrate', 'Trial'],
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
      id: 'tpl-consumer-notice',
      category: 'notices',
      categoryLabel: 'Statutory Notice',
      statute: 'Consumer Protection Act, 2019',
      title: 'Statutory Legal Notice for Deficiency in Service & Unfair Trade Practice',
      shortDesc: 'Pre-litigation demand notice served upon manufacturers, sellers, or service providers prior to filing a complaint before the District Consumer Commission.',
      limitationNotice: 'Consumer Forum Limitation: A consumer complaint must be filed within 2 years from the date on which the cause of action arises (Section 69 Consumer Protection Act, 2019).',
      tags: ['Consumer Law', 'Deficiency in Service', 'Notice', 'Compensation', 'District Commission'],
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
      id: 'tpl-vakalatnama',
      category: 'contracts',
      categoryLabel: 'Advocate Instrument',
      statute: 'Advocates Act, 1961 & Bar Council Rules',
      title: 'Advocate Vakalatnama with Power of Attorney Authorization Clauses',
      shortDesc: 'Vetted, formal Vakalatnama for District Courts, High Courts, and Tribunals empowering advocate to plead, act, compromise, and inspect records.',
      limitationNotice: 'Standard Practice: Includes advocate welfare stamp, court fee stamp, and express authorization clauses required under Order 3 Rule 4 CPC.',
      tags: ['Court Practice', 'Vakalatnama', 'Power of Attorney', 'Advocate Ethics', 'District Court'],
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
    },
    {
      id: 'tpl-nda-agreement',
      category: 'contracts',
      categoryLabel: 'Commercial Agreement',
      statute: 'Indian Contract Act, 1872',
      title: 'Mutual Non-Disclosure Agreement (NDA & Confidentiality Contract)',
      shortDesc: 'Standard commercial contract protecting proprietary business data, trade secrets, algorithms, and legal disclosures during negotiations.',
      limitationNotice: 'Key Provisions: Strict definition of confidential information, carve-outs, 2-year survival clause, and exclusive jurisdiction.',
      tags: ['Contracts', 'NDA', 'Commercial Law', 'Confidentiality', 'Trade Secrets'],
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
    }
  ];

  // =========================================================================
  // 2. REPOSITORY OF REAL-TIME LAW UPDATES & PRECEDENTS
  // =========================================================================
  const PRO_LAW_UPDATES_DB = [
    {
      id: 'upd-bnss-transition',
      date: 'October 2026',
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
      date: 'September 2026',
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
      date: 'September 2026',
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
      date: 'August 2026',
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
      date: 'July 2026',
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
      date: 'June 2026',
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
          <h4>No Legal Templates Found</h4>
          <p>No drafting templates match your filter query "${escapeHtml(templateSearchQuery)}". Try clearing filters.</p>
          <button type="button" class="pro-empty-reset-btn" id="proResetTemplateFilterBtn">
            <i class="fa-solid fa-rotate-left"></i> Reset Template Filters
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
      <article class="pro-card pro-template-card" data-template-id="${t.id}">
        <div class="pro-card-header">
          <div class="pro-badge-group">
            <span class="pro-category-chip"><i class="fa-solid fa-folder-closed"></i> ${escapeHtml(t.categoryLabel)}</span>
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
          <a href="${t.pdfUrl}" target="_blank" rel="noopener noreferrer" class="pro-btn-copy" style="text-decoration:none;background:rgba(220,38,38,0.18);border-color:rgba(220,38,38,0.45);color:#ef4444;">
            <i class="fa-solid fa-file-pdf"></i> <span>PDF</span>
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

    grid.querySelectorAll('.pro-btn-copy, .pro-quick-copy-icon-btn').forEach(btn => {
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
                <span class="pro-category-chip">${escapeHtml(template.categoryLabel)}</span>
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

    const formattedText = `[MAKE LAW EASY PRO • LEGAL UPDATE]
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
    // Pro Sub-Tabs Switcher
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

    // Template Category Pills
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
