/**
 * ====================================================================
 * MAKE LAW EASY — LIMITATION PERIOD CALCULATOR ENGINE & CASE REPOSITORY
 * Statutory Database: Limitation Act, 1963 (Act No. 36 of 1963)
 * Supreme Court of India Jurisprudence & DU LL.B. Curriculum Matrix
 * ====================================================================
 */

(function (global) {
  'use strict';

  // ------------------------------------------------------------------
  // 1. LANDMARK JURISPRUDENCE & CASE MATRIX (Limitation Act, 1963)
  // ------------------------------------------------------------------
  const LIMITATION_LANDMARK_CASES = [
    {
      id: 'case_katiji',
      citation: 'Collector, Land Acquisition, Anantnag v. Mst. Katiji, AIR 1987 SC 1353',
      parties: 'Collector, Land Acquisition, Anantnag v. Mst. Katiji',
      year: 1987,
      court: 'Supreme Court of India',
      bench: 'M.P. Thakkar & B.C. Ray, JJ.',
      section: 'Section 5',
      topic: 'Condonation of Delay — 6 Golden Principles',
      ratio: 'Section 5 must be construed liberally to advance substantial justice. Litigants do not stand to benefit by lodging appeals late. "Every day’s delay must be explained" does not mean a pedantic, impossible burden; judiciary is not respected for legalizing injustice on technicalities. Substantial justice must always triumph over technical considerations.',
      tags: ['sufficient cause', 'condonation', 'substantial justice', 'section 5', 'delay']
    },
    {
      id: 'case_pathapati',
      citation: 'Pathapati Subba Reddy (Died) by LRs v. Special Deputy Collector (LA), 2024 INSC 286',
      parties: 'Pathapati Subba Reddy v. Special Deputy Collector',
      year: 2024,
      court: 'Supreme Court of India',
      bench: 'Bela M. Trivedi & Pankaj Mithal, JJ.',
      section: 'Section 5',
      topic: 'Restatement of 8 Guiding Principles on Section 5 Condonation',
      ratio: 'Synthesized all prior jurisprudence into an 8-point rule: (1) Law of limitation founded on public policy; (2) Discretion must be exercised judiciously, not arbitrarily; (3) Liberal approach cannot be stretched to defeat statutory purpose or condone gross negligence; (4) Merits of case secondary to explanation of delay; (5) Vested rights created in opposite party cannot be casually unsettled.',
      tags: ['section 5', '2024 precedent', 'guiding principles', 'condonation', 'vested rights']
    },
    {
      id: 'case_bherulal',
      citation: 'State of Madhya Pradesh v. Bherulal, (2020) 10 SCC 654',
      parties: 'State of Madhya Pradesh v. Bherulal',
      year: 2020,
      court: 'Supreme Court of India',
      bench: 'Sanjay Kishan Kaul & Dinesh Maheshwari, JJ.',
      section: 'Section 5',
      topic: 'Government Lethargy & "Certificate Cases" Strongly Reprimanded',
      ratio: 'The Supreme Court clamped down on Government appeals filed with massive delay merely as "certificate cases" to save officers from departmental action. Law of limitation binds the State equally; impersonal administrative machinery cannot be a license for red-tape lethargy. Exemplary costs imposed on the State.',
      tags: ['government delay', 'section 5', 'certificate cases', 'costs', 'red tape']
    },
    {
      id: 'case_pnb',
      citation: 'Punjab National Bank v. Surendra Prasad Sinha, AIR 1992 SC 1815',
      parties: 'Punjab National Bank v. Surendra Prasad Sinha',
      year: 1992,
      court: 'Supreme Court of India',
      bench: 'K. Ramaswamy & V. Ramaswami, JJ.',
      section: 'Section 3',
      topic: 'Remedy Barred vs. Right Extinguished (Except Section 27)',
      ratio: 'Section 3 bars the judicial remedy of instituting a suit, but does NOT extinguish the underlying right or debt. A creditor is legally entitled to adjust a time-barred debt against securities, FDRs, or funds lawfully coming into its hands. Extinguishment of the substantive right itself occurs ONLY under Section 27 for immovable property.',
      tags: ['section 3', 'bar of limitation', 'remedy vs right', 'debt adjustment', 'section 27']
    },
    {
      id: 'case_manindra',
      citation: 'Manindra Land and Building Corp. v. Bhutnath Banerjee, AIR 1964 SC 1336',
      parties: 'Manindra Land and Building Corp. v. Bhutnath Banerjee',
      year: 1964,
      court: 'Supreme Court of India',
      bench: 'J.C. Shah, K.N. Wanchoo & S.M. Sikri, JJ.',
      section: 'Section 3',
      topic: 'Mandatory Duty of Court to Dismiss Time-Barred Claims Suo Motu',
      ratio: 'Section 3 is mandatory and leaves no discretion. Even if limitation is NOT pleaded as a defence by the defendant, the Court is statutorily bound to dismiss any suit, appeal or application instituted after the prescribed period.',
      tags: ['section 3', 'mandatory duty', 'suo motu', 'bar of remedy', 'no discretion']
    },
    {
      id: 'case_madan_lal',
      citation: 'Commissioner of Sales Tax, UP v. M/s Madan Lal Das & Sons, (1977) 1 SCC 644',
      parties: 'CST, UP v. M/s Madan Lal Das & Sons',
      year: 1977,
      court: 'Supreme Court of India',
      bench: 'H.R. Khanna & Jaswant Singh, JJ.',
      section: 'Section 12(2)',
      topic: 'Time Requisite for Certified Copy Excluded across Appeals & Revisions',
      ratio: '"Time requisite" under Section 12(2) means the time properly required by the copying department of the court/tribunal. The period between applying for the certified copy and the date it is notified ready or delivered must be excluded. The litigant cannot be penalized for ministerial delay in the court copying branch.',
      tags: ['section 12', 'certified copy', 'time requisite', 'exclusion', 'copying delay']
    },
    {
      id: 'case_maharaj_narain',
      citation: 'State of Uttar Pradesh v. Maharaj Narain, AIR 1968 SC 960',
      parties: 'State of Uttar Pradesh v. Maharaj Narain',
      year: 1968,
      court: 'Supreme Court of India',
      bench: 'K.S. Hegde & R.S. Bachawat, JJ.',
      section: 'Section 12(2)',
      topic: 'Exclusion of Copy Actually Filed Even if Prior Copy Obtained',
      ratio: 'The appellant is legally entitled to exclude the time requisite for obtaining the certified copy that actually accompanied the memorandum of appeal, even if he had previously applied for and obtained another copy earlier. Section 12 does not require the appellant to file the earliest obtained copy.',
      tags: ['section 12', 'certified copy', 'accompanying copy', 'exclusion of time']
    },
    {
      id: 'case_sampuran_singh',
      citation: 'Sampuran Singh v. Smt. Niranjan Kaur, AIR 1999 SC 1047',
      parties: 'Sampuran Singh v. Smt. Niranjan Kaur',
      year: 1999,
      court: 'Supreme Court of India',
      bench: 'A.P. Misra & M. Srinivasan, JJ.',
      section: 'Section 18',
      topic: 'Acknowledgment MUST Precede Expiry; Dead Debt Cannot be Revived',
      ratio: 'An acknowledgment of liability under Section 18 MUST be made before the expiration of the prescribed period of limitation. Once the period of limitation has expired, a subsequent acknowledgment is void and cannot resurrect or breathe new life into an already barred and dead claim.',
      tags: ['section 18', 'acknowledgment', 'before expiry', 'dead debt', 'fresh limitation']
    },
    {
      id: 'case_bishal_jaiswal',
      citation: 'Asset Reconstruction Company (India) Ltd. v. Bishal Jaiswal, (2021) 6 SCC 366',
      parties: 'Asset Reconstruction Company (India) Ltd. v. Bishal Jaiswal',
      year: 2021,
      court: 'Supreme Court of India',
      bench: 'R.F. Nariman, B.R. Gavai & Hrishikesh Roy, JJ.',
      section: 'Section 18',
      topic: 'Entries in Balance Sheets Constitute Valid Section 18 Acknowledgment',
      ratio: 'An entry in a company’s audited balance sheet signed by directors acknowledging a debt constitutes a valid acknowledgment of liability under Section 18, resetting the limitation period, provided there is no qualifying caveat disclaiming liability in notes to accounts.',
      tags: ['section 18', 'balance sheet', 'company debt', 'acknowledgment', 'IBC']
    },
    {
      id: 'case_tm_chacko',
      citation: 'State of Kerala v. T.M. Chacko, AIR 2000 SC 3530',
      parties: 'State of Kerala v. T.M. Chacko',
      year: 2000,
      court: 'Supreme Court of India',
      bench: 'S.S.M. Quadri & S.N. Phukan, JJ.',
      section: 'Section 18',
      topic: 'Essentials of Valid Acknowledgment in Writing',
      ratio: 'To satisfy Section 18: (1) Acknowledgment must be in writing; (2) Signed by the party against whom property/right is claimed or an authorized agent; (3) Made before expiry of prescribed period; (4) Relate to a subsisting jural relationship of debtor and creditor.',
      tags: ['section 18', 'written acknowledgment', 'jural relationship', 'reset limitation']
    },
    {
      id: 'case_consolidated_eng',
      citation: 'Consolidated Engineering Enterprises v. Irrigation Dept., (2008) 7 SCC 169',
      parties: 'Consolidated Engineering Enterprises v. Irrigation Dept.',
      year: 2008,
      court: 'Supreme Court of India',
      bench: 'K.G. Balakrishnan, C.J., R.V. Raveendran & J.M. Panchal, JJ.',
      section: 'Section 14',
      topic: '5 Strict Conditions for Section 14 Exclusion (Bona Fide Proceeding in Wrong Court)',
      ratio: 'To claim Section 14 exclusion: (1) Both prior and subsequent proceedings are civil proceedings by same party; (2) Prior proceeding prosecuted with due diligence and good faith; (3) Same cause of action; (4) Court unable to entertain due to defect of jurisdiction or like cause; (5) Both proceedings before a court. Principles apply to S. 34 arbitration challenges.',
      tags: ['section 14', 'wrong court', 'bona fide', 'jurisdiction defect', 'due diligence']
    },
    {
      id: 'case_mp_steel',
      citation: 'M.P. Steel Corporation v. Commissioner of Central Excise, (2015) 7 SCC 58',
      parties: 'M.P. Steel Corporation v. CCE',
      year: 2015,
      court: 'Supreme Court of India',
      bench: 'R.F. Nariman & A.K. Sikri, JJ.',
      section: 'Section 14',
      topic: 'Equitable Principles of Section 14 Extend Beyond Strict Civil Courts',
      ratio: 'Although Section 14 strictly applies to "courts", its underlying equitable and just principles apply broadly to appeals and proceedings before quasi-judicial tribunals (e.g. CESTAT, appellate commissioners) to prevent miscarriage of justice where litigant was pursuing remedy diligently.',
      tags: ['section 14', 'tribunals', 'equitable principles', 'due diligence']
    },
    {
      id: 'case_mahabir_kishore',
      citation: 'Mahabir Kishore v. State of Madhya Pradesh, AIR 1990 SC 313',
      parties: 'Mahabir Kishore v. State of Madhya Pradesh',
      year: 1990,
      court: 'Supreme Court of India',
      bench: 'K.N. Saikia & M.M. Dutt, JJ.',
      section: 'Section 17(1)(c) & Article 113',
      topic: 'Money Paid Under Mistake of Law — Limitation Runs from Discovery',
      ratio: 'Where money is paid under mistake of law (unconstitutional tax cess), Section 17(1)(c) and Article 113 govern. The 3-year limitation period does NOT begin from the date of payment, but from the date when the mistake was discovered — which is the date when the High Court or Supreme Court delivered judgment declaring the law unconstitutional.',
      tags: ['section 17', 'mistake of law', 'article 113', 'discovery of mistake', 'refund of tax']
    },
    {
      id: 'case_ravinder_kaur',
      citation: 'Ravinder Kaur Grewal v. Manjit Kaur, (2019) 8 SCC 729 (3-Judge Bench)',
      parties: 'Ravinder Kaur Grewal v. Manjit Kaur',
      year: 2019,
      court: 'Supreme Court of India',
      bench: 'Arun Mishra, S. Abdul Nazeer & M.R. Shah, JJ.',
      section: 'Section 27 & Articles 64, 65',
      topic: 'Extinguishment of Title & Adverse Possession as a Sword and Shield',
      ratio: 'Overruled Gurdwara Sahib v. Gram Panchayat. Section 27 not only extinguishes the true owner’s title after 12 years of adverse possession under Article 65, but also confers possessory title on the squatter/adverse possessor. Adverse possession can be used as a "sword" by the plaintiff to seek declaration of title and injunction, not merely as a "shield" in defence.',
      tags: ['section 27', 'article 65', 'adverse possession', 'extinguishment of title', 'sword and shield']
    },
    {
      id: 'case_bailochan_karan',
      citation: 'Bailochan Karan v. Basant Babu, AIR 1999 SC 876',
      parties: 'Bailochan Karan v. Basant Babu',
      year: 1999,
      court: 'Supreme Court of India',
      bench: 'S. Saghir Ahmad & D.P. Wadhwa, JJ.',
      section: 'Sections 6 & 8',
      topic: 'Legal Disability (Minority) — Maximum 3-Year Ceiling Post-Cessation',
      ratio: 'Section 8 controls and restricts Section 6. In NO case can limitation be extended for more than THREE YEARS from the date when the legal disability (minority/insanity) ceases or death occurs. Even if the general schedule period was 12 years, the extended window after attaining majority is strictly capped at 3 years.',
      tags: ['section 6', 'section 8', 'legal disability', 'minority', '3 year ceiling']
    },
    {
      id: 'case_kseb_kunhaliumma',
      citation: 'Kerala State Electricity Board v. T.P. Kunhaliumma, AIR 1977 SC 282',
      parties: 'KSEB v. T.P. Kunhaliumma',
      year: 1976,
      court: 'Supreme Court of India',
      bench: 'A.N. Ray, C.J., M.H. Beg & P.N. Shinghal, JJ.',
      section: 'Article 137',
      topic: 'Residuary Article 137 Applies to Any Special or General Act Before Civil Court',
      ratio: 'Article 137 is not restricted to applications under the Code of Civil Procedure. It applies to ANY application filed before a civil court under any special or local Act (such as Indian Telegraph Act or Electricity Act), providing a 3-year limitation from when the right to apply accrues.',
      tags: ['article 137', 'residuary application', 'civil court', 'special act', '3 years']
    },
    {
      id: 'case_maqbul_ahmad',
      citation: 'Maqbul Ahmad v. Onkar Pratap Narain Singh, AIR 1935 PC 85',
      parties: 'Maqbul Ahmad v. Onkar Pratap Narain Singh',
      year: 1935,
      court: 'Privy Council',
      bench: 'Lord Tomlin, Sir Lancelot Sanderson & Sir Shadi Lal',
      section: 'Section 4',
      topic: 'Court Closure on Expiry Date Does NOT Extend Limitation',
      ratio: 'Section 4 does not alter or extend the period of limitation prescribed by the Schedule. It merely provides a concession: if the prescribed period expires on a day when the court is closed, the filing may be made on the reopening day. Litigant cannot tack Section 4 onto Section 14 to compute extended periods.',
      tags: ['section 4', 'court closure', 'court holiday', 'reopening day']
    },
    {
      id: 'case_west_coast',
      citation: 'Union of India v. West Coast Paper Mills Ltd., (2004) 2 SCC 747',
      parties: 'Union of India v. West Coast Paper Mills Ltd.',
      year: 2004,
      court: 'Supreme Court of India',
      bench: 'V.N. Khare, C.J., S.B. Sinha & Ar. Lakshmanan, JJ.',
      section: 'Article 113',
      topic: 'Doctrine of Merger & Accrual of Cause of Action During Appellate Pendency',
      ratio: 'Once an appeal or special leave petition is admitted and heard by the superior court, the dispute remains sub judice. Cause of action for consequential relief under Article 113 accrues only upon final determination and merger of the decree by the appellate court.',
      tags: ['article 113', 'doctrine of merger', 'appellate pendency', 'cause of action']
    },
    {
      id: 'case_living_media',
      citation: 'Chief Postmaster General v. Living Media India Ltd., AIR 2012 SC 1506',
      parties: 'Chief Postmaster General v. Living Media India Ltd.',
      year: 2012,
      court: 'Supreme Court of India',
      bench: 'P. Sathasivam & J. Chelameswar, JJ.',
      section: 'Section 5',
      topic: 'Government Litigant Not Exempt from Rigour of Section 5',
      ratio: 'Condonation of delay cannot be claimed as a matter of generosity simply because the appellant is a government department. Unless a reasonable and bona fide explanation is tendered, red-tape movement of files from desk to desk is not "sufficient cause".',
      tags: ['section 5', 'government delay', 'red tape', 'sufficient cause']
    },
    {
      id: 'case_simplex',
      citation: 'Simplex Infrastructure Ltd. v. Union of India, (2019) 2 SCC 455',
      parties: 'Simplex Infrastructure Ltd. v. Union of India',
      year: 2019,
      court: 'Supreme Court of India',
      bench: 'R. Banumathi & Indira Banerjee, JJ.',
      section: 'Section 34 A&C Act & Section 5',
      topic: 'Section 5 Inapplicable Beyond Statutory Proviso in Special Acts',
      ratio: 'Section 34(3) of the Arbitration & Conciliation Act 1996 sets an absolute outer limit of 3 months + 30 days condonable. Section 5 of the Limitation Act is completely excluded by Section 29(2) and cannot condone delay even by a single day beyond the 30-day proviso.',
      tags: ['arbitration', 'section 34', 'section 29(2)', 'special law', 'absolute limitation']
    }
  ];

  // ------------------------------------------------------------------
  // 2. SCHEDULE ARTICLES DATABASE (Limitation Act, 1963 & Special Acts)
  // ------------------------------------------------------------------
  const LIMITATION_SCHEDULE_DB = [
    // DIVISION I: SUITS
    // Part II: Contracts & Money
    {
      id: 'art_19',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 19',
      title: 'Money payable for money lent',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the loan is made.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_pnb', 'case_sampuran_singh'],
      tips: 'Section 5 DOES NOT apply to original suits. If limitation is missed, suit is barred under S. 3. Look for written acknowledgments under S. 18 or part-payment under S. 19 to reset.'
    },
    {
      id: 'art_21',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 21',
      title: 'Money on promissory note or bond payable on demand',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'The date of the promissory note or bond.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_pnb'],
      tips: 'Runs immediately from execution date, NOT from demand date.'
    },
    {
      id: 'art_22',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 22',
      title: 'Money deposited under agreement to repay on demand (Bank deposit / FDR)',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the demand is made.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_pnb'],
      tips: 'Distinguishes between a loan (Art. 19/21, runs from loan date) and a deposit (Art. 22, runs from actual demand).'
    },
    {
      id: 'art_52',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 52',
      title: 'For arrears of rent',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the arrears become due.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_pnb'],
      tips: 'Each monthly default gives rise to a distinct starting point. Rent older than 3 years is barred.'
    },
    {
      id: 'art_54',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 54',
      title: 'Specific Performance of a Contract',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'The date fixed for performance, or, if no such date is fixed, when the plaintiff has notice that performance is refused.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: 'Two limbs: (1) If agreement specifies an exact completion date, clock runs strictly from that date; (2) If no date fixed, clock runs from unequivocal notice of refusal.'
    },
    {
      id: 'art_55',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Contracts & Money',
      article: 'Article 55',
      title: 'Compensation for breach of any contract (express or implied)',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the contract is broken, or (where there are successive breaches) when the breach in respect of which the suit is instituted occurs.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_sampuran_singh', 'case_tm_chacko'],
      tips: 'Residuary article for contracts. Applies where no specific article (like sale of goods or guarantee) covers the breach.'
    },

    // Part III: Declarations
    {
      id: 'art_58',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Declarations & Instruments',
      article: 'Article 58',
      title: 'To obtain any other declaration (Section 34 Specific Relief Act)',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the right to sue first accrues.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra', 'case_west_coast'],
      tips: 'Crucial word is "first accrues". A repeated threat or reaffirmation does not give a fresh start if cause first arose earlier.'
    },
    {
      id: 'art_59',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Declarations & Instruments',
      article: 'Article 59',
      title: 'To cancel or set aside an instrument or decree, or for rescission of a contract',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the facts entitling the plaintiff to have the instrument or decree cancelled or set aside or the contract rescinded first become known to him.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_mahabir_kishore'],
      tips: 'Linked to Section 17 discovery principle. Clock begins when fraudulent execution or vitiating facts first become known.'
    },

    // Part V: Immovable Property
    {
      id: 'art_61a',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Immovable Property',
      article: 'Article 61(a)',
      title: 'By a mortgagor to redeem or to recover possession of immovable property mortgaged',
      periodUnit: 'years',
      periodValue: 30,
      startingPoint: 'When the right to redeem or to recover possession accrues.',
      appliesSection5: false,
      appliesSection27: true,
      keyCases: ['case_sampuran_singh'],
      tips: 'Longest period in civil suits (30 years). Sampuran Singh held S. 18 acknowledgment must be within these 30 years.'
    },
    {
      id: 'art_64',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Immovable Property',
      article: 'Article 64',
      title: 'Possession based on previous possession and not on title (Dispossession)',
      periodUnit: 'years',
      periodValue: 12,
      startingPoint: 'The date of dispossession.',
      appliesSection5: false,
      appliesSection27: true,
      keyCases: ['case_ravinder_kaur'],
      tips: 'Possessory suit under Section 6 SRA or general law based on prior possession alone. Section 27 operates to extinguish rights upon expiry!'
    },
    {
      id: 'art_65',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Immovable Property',
      article: 'Article 65',
      title: 'Possession of immovable property based on title (Adverse Possession)',
      periodUnit: 'years',
      periodValue: 12,
      startingPoint: 'When the possession of the defendant becomes adverse to the plaintiff.',
      appliesSection5: false,
      appliesSection27: true,
      keyCases: ['case_ravinder_kaur'],
      tips: 'CRITICAL: Burden of proof of adverse possession is on defendant. If 12 years lapse without challenge, plaintiff’s title is permanently extinguished under Section 27! Ravinder Kaur Grewal (2019) allows adverse possessor to sue as plaintiff.'
    },
    {
      id: 'art_67',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Immovable Property',
      article: 'Article 67',
      title: 'By a landlord to recover possession from a tenant',
      periodUnit: 'years',
      periodValue: 12,
      startingPoint: 'When the tenancy is determined.',
      appliesSection5: false,
      appliesSection27: true,
      keyCases: ['case_ravinder_kaur'],
      tips: 'Determined by notice to quit under Section 106/111 Transfer of Property Act, or expiry of lease period.'
    },

    // Part VII: Torts
    {
      id: 'art_72',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Torts',
      article: 'Article 72',
      title: 'For compensation for doing or for omitting to do an act alleged to be in pursuance of any enactment',
      periodUnit: 'years',
      periodValue: 1,
      startingPoint: 'When the act or omission takes place.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: 'Short 1-year period protecting statutory officers acting under official authority.'
    },
    {
      id: 'art_74',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Torts',
      article: 'Article 74',
      title: 'For compensation for a malicious prosecution',
      periodUnit: 'years',
      periodValue: 1,
      startingPoint: 'When the plaintiff is acquitted or the prosecution is otherwise terminated.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: '1 year starting from acquittal/discharge order date. Clock does not pause merely because State contemplates filing an appeal unless stay is granted.'
    },
    {
      id: 'art_75',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Torts',
      article: 'Article 75',
      title: 'For compensation for libel (written defamation)',
      periodUnit: 'years',
      periodValue: 1,
      startingPoint: 'When the libel is published.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: '1 year from publication date. Internet publication: single publication vs multiple publication doctrine.'
    },
    {
      id: 'art_91',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Torts',
      article: 'Article 91',
      title: 'For compensation for any other tort not specially provided for (General Negligence / Nuisance)',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the wrong is done.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: 'Residuary article for torts.'
    },

    // Part IX: Government Suits
    {
      id: 'art_112',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Government Suits',
      article: 'Article 112',
      title: 'Any suit by or on behalf of the Central Government or any State Government',
      periodUnit: 'years',
      periodValue: 30,
      startingPoint: 'When the period of limitation would begin to run under this Act against a like suit by a private person.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_bherulal', 'case_living_media'],
      tips: 'Statutory 30-year grace for the State in original civil suits. Note: This 30-year period applies to SUITS, NOT to appeals/SLPs where Government has same deadlines!'
    },

    // Part X: Residuary Suit
    {
      id: 'art_113',
      division: 'suits',
      divisionTitle: 'Division I — Suits',
      category: 'Residuary Suit',
      article: 'Article 113',
      title: 'Any suit for which no period of limitation is provided elsewhere in this Schedule',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the right to sue accrues.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_mahabir_kishore', 'case_west_coast'],
      tips: 'The great omnibus residuary suit article. Used for recovery of unconstitutional taxes (S. 17 + Art. 113), restitution, and unjust enrichment.'
    },

    // DIVISION II: APPEALS
    {
      id: 'art_114a',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Criminal Appeals',
      article: 'Article 114(a)',
      title: 'Criminal Appeal from order of acquittal under CrPC / BNSS (by State Government)',
      periodUnit: 'days',
      periodValue: 90,
      startingPoint: 'The date of the order appealed from.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji', 'case_bherulal', 'case_pathapati'],
      tips: 'Section 5 condonation applies. Under BNSS Section 419 / CrPC Section 378. Section 12(2) copying time excluded.'
    },
    {
      id: 'art_114b',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Criminal Appeals',
      article: 'Article 114(b)',
      title: 'Criminal Appeal from acquittal on Special Leave by Complainant (CrPC 378(4) / BNSS 419(4))',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the grant of special leave.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji', 'case_pathapati'],
      tips: 'Short 30-day window from grant of special leave. Section 5 condonation applicable.'
    },
    {
      id: 'art_115a',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Civil Appeals',
      article: 'Article 115(a)',
      title: 'Civil First Appeal (RFA) to High Court from any decree or order',
      periodUnit: 'days',
      periodValue: 90,
      startingPoint: 'The date of the decree or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_madan_lal', 'case_maharaj_narain', 'case_katiji', 'case_pathapati'],
      tips: '90 days. Section 12(2) time requisite for obtaining certified copy is mandatorily excluded. Section 5 condonation of delay available upon showing sufficient cause.'
    },
    {
      id: 'art_115b',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Civil Appeals',
      article: 'Article 115(b)',
      title: 'Civil Appeal to any other court (District Court / Senior Civil Judge)',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the decree or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_madan_lal', 'case_katiji'],
      tips: 'Only 30 days! Section 12(2) certified copy time must be claimed to avoid limitation bar.'
    },
    {
      id: 'art_116a',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Criminal Appeals',
      article: 'Article 116(a)',
      title: 'Criminal Appeal against conviction to High Court (other than sentence of death)',
      periodUnit: 'days',
      periodValue: 60,
      startingPoint: 'The date of the sentence or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji', 'case_madan_lal'],
      tips: '60 days under CrPC / BNSS. Section 12(2) copying time excluded. Section 5 liberal condonation applies where appellant was in custody.'
    },
    {
      id: 'art_116b',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Criminal Appeals',
      article: 'Article 116(b)',
      title: 'Criminal Appeal against conviction to Sessions Court',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the sentence or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: '30 days. Section 12(2) copying time excluded.'
    },
    {
      id: 'art_117',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Civil Appeals',
      article: 'Article 117',
      title: 'High Court Intra-Court Appeal (Letters Patent Appeal / Commercial Appellate Division)',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the decree or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji', 'case_pathapati'],
      tips: '30 days from judgment of Single Judge to Division Bench.'
    },
    {
      id: 'art_sc_slp',
      division: 'appeals',
      divisionTitle: 'Division II — Appeals',
      category: 'Supreme Court Special Leave',
      article: 'Supreme Court Rules / Order XXI',
      title: 'Special Leave Petition (Civil / Criminal) to Supreme Court of India (Article 136)',
      periodUnit: 'days',
      periodValue: 90,
      startingPoint: 'Date of judgment/order appealed from (or 60 days where certificate of fitness was refused by High Court).',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_pathapati', 'case_bherulal', 'case_living_media'],
      tips: '90 days from HC judgment (or 60 days from certificate refusal). Section 5 delay must be explained strictly under SC Rules Order XXI.'
    },

    // DIVISION III: APPLICATIONS
    {
      id: 'art_120',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Interlocutory Applications',
      article: 'Article 120',
      title: 'Under CPC to have the legal representative of a deceased plaintiff/appellant or defendant/respondent made a party',
      periodUnit: 'days',
      periodValue: 90,
      startingPoint: 'The date of death of the plaintiff, appellant, defendant or respondent.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: '90 days from date of death. If missed, suit/appeal abates automatically under Order XXII CPC.'
    },
    {
      id: 'art_121',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Interlocutory Applications',
      article: 'Article 121',
      title: 'Under CPC for an order to set aside an abatement',
      periodUnit: 'days',
      periodValue: 60,
      startingPoint: 'The date of abatement (which occurs 90 days after death).',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: '60 days after abatement (total 150 days from death). Section 5 condonation applies if both periods lapse.'
    },
    {
      id: 'art_122',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Interlocutory Applications',
      article: 'Article 122',
      title: 'To restore a suit or appeal dismissed for default of appearance or failure to pay costs (Order IX / Order XLI CPC)',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the dismissal.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: '30 days. Order IX Rule 9 (suit) or Order XLI Rule 19 (appeal).'
    },
    {
      id: 'art_123',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Interlocutory Applications',
      article: 'Article 123',
      title: 'To set aside an ex parte decree or rehearing of an appeal heard ex parte (Order IX Rule 13 CPC)',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the decree, or where the summons or notice was not duly served, when the applicant had knowledge of the decree.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji', 'case_manindra'],
      tips: 'Crucial distinction: If summons was properly served, runs strictly from decree date. If summons was never served, clock starts ONLY when defendant first acquired actual knowledge!'
    },
    {
      id: 'art_124',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Interlocutory Applications',
      article: 'Article 124',
      title: 'For a review of judgment by a court other than the Supreme Court (Order XLVII CPC)',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'The date of the decree or order.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_madan_lal'],
      tips: '30 days. Section 12(2) copying time excluded.'
    },
    {
      id: 'art_131',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Revision Petitions',
      article: 'Article 131',
      title: 'To High Court for exercise of its powers of revision under CPC (Section 115) or CrPC / BNSS',
      periodUnit: 'days',
      periodValue: 90,
      startingPoint: 'The date of the decree or order or sentence sought to be revised.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_madan_lal', 'case_katiji'],
      tips: '90 days. Section 12(2) time requisite for obtaining certified copy is excluded (*Madan Lal Das*).'
    },
    {
      id: 'art_134',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Execution Applications',
      article: 'Article 134',
      title: 'For delivery of possession by a purchaser of immovable property at a sale in execution of a decree',
      periodUnit: 'years',
      periodValue: 1,
      startingPoint: 'When the sale becomes absolute.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: '1 year from confirmation of auction sale under Order XXI Rule 92 CPC.'
    },
    {
      id: 'art_135',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Execution Applications',
      article: 'Article 135',
      title: 'For the enforcement of a decree granting a mandatory injunction',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'The date of the decree or where a date is fixed for performance, such date.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_manindra'],
      tips: 'Only 3 years for mandatory injunctions (unlike 12 years for other decrees under Art. 136).'
    },
    {
      id: 'art_136',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Execution Applications',
      article: 'Article 136',
      title: 'For execution of any decree (other than mandatory injunction) or order of any civil court',
      periodUnit: 'years',
      periodValue: 12,
      startingPoint: 'When the decree or order becomes enforceable or where the decree directs payment of money/property at certain dates, when default in making payment occurs.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_pnb', 'case_manindra'],
      tips: 'Section 5 expressly DOES NOT apply to Order XXI execution applications! A time-barred decree cannot be executed under any circumstance.'
    },
    {
      id: 'art_137',
      division: 'applications',
      divisionTitle: 'Division III — Applications',
      category: 'Residuary Applications',
      article: 'Article 137',
      title: 'Any other application for which no period of limitation is provided elsewhere in this Schedule',
      periodUnit: 'years',
      periodValue: 3,
      startingPoint: 'When the right to apply accrues.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_kseb_kunhaliumma', 'case_katiji'],
      tips: 'Applies to ANY application before a civil court under any general or special enactment (*KSEB v. Kunhaliumma*). Section 5 condonation applies.'
    },

    // SPECIAL STATUTES (High Practical & Academic Relevance)
    {
      id: 'art_arb_34',
      division: 'special',
      divisionTitle: 'Special Statutes',
      category: 'Arbitration & Conciliation Act, 1996',
      article: 'Section 34(3) A&C Act',
      title: 'Application for Setting Aside Arbitral Award',
      periodUnit: 'months',
      periodValue: 3,
      startingPoint: 'Date on which the applicant received the signed arbitral award.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_simplex', 'case_consolidated_eng'],
      tips: 'STRICT LIMITATION: 3 months from award receipt. The court can condone up to 30 days ONLY if sufficient cause is shown. Section 5 cannot condone even 1 extra day beyond the 30-day proviso (*Simplex Infrastructure (2019)*)!'
    },
    {
      id: 'art_ni_138',
      division: 'special',
      divisionTitle: 'Special Statutes',
      category: 'Negotiable Instruments Act, 1881',
      article: 'Section 138 & 142 NI Act',
      title: 'Criminal Complaint for Cheque Bounce',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'Expiry of 15 days from receipt of demand notice by drawer.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: 'Statutory sequence: Dishonour -> 30 days to send notice -> 15 days notice window -> cause of action arises on 16th day -> 1 month to file complaint. Section 142(b) proviso permits condonation upon sufficient cause.'
    },
    {
      id: 'art_cpa_69',
      division: 'special',
      divisionTitle: 'Special Statutes',
      category: 'Consumer Protection Act, 2019',
      article: 'Section 69 CPA 2019',
      title: 'Consumer Complaint before District / State / National Commission',
      periodUnit: 'years',
      periodValue: 2,
      startingPoint: 'The date on which the cause of action has arisen.',
      appliesSection5: true,
      appliesSection27: false,
      keyCases: ['case_katiji'],
      tips: '2 years from cause of action. Section 69(2) allows condonation if sufficient cause is recorded in writing.'
    },
    {
      id: 'art_ibc_61',
      division: 'special',
      divisionTitle: 'Special Statutes',
      category: 'Insolvency & Bankruptcy Code, 2016',
      article: 'Section 61(2) IBC',
      title: 'Appeal to NCLAT against order of NCLT / Adjudicating Authority',
      periodUnit: 'days',
      periodValue: 30,
      startingPoint: 'Date of receipt of certified copy of NCLT order.',
      appliesSection5: false,
      appliesSection27: false,
      keyCases: ['case_simplex', 'case_bishal_jaiswal'],
      tips: '30 days. NCLAT may condone maximum 15 days delay under S. 61(2) proviso. Beyond 45 days, delay is fatal and incurable.'
    }
  ];

  // ------------------------------------------------------------------
  // 3. COMPUTATION ENGINE (Statutory Algorithm)
  // ------------------------------------------------------------------

  /**
   * Helper: Add calendar days, months, or years to a Date object.
   */
  function addPeriod(startDate, value, unit) {
    const d = new Date(startDate.getTime());
    if (unit === 'days') {
      d.setDate(d.getDate() + value);
    } else if (unit === 'months') {
      d.setMonth(d.getMonth() + value);
    } else if (unit === 'years') {
      d.setFullYear(d.getFullYear() + value);
    }
    return d;
  }

  /**
   * Helper: Difference in whole calendar days between two dates.
   */
  function diffDays(d1, d2) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  /**
   * Helper: Format Date as YYYY-MM-DD
   */
  function formatDate(d) {
    if (!d || isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Helper: Human-friendly date string (e.g., "14 Oct 2026")
   */
  function formatHumanDate(d) {
    if (!d || isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Main Calculation Routine
   * 
   * @param {Object} params
   *   - articleId: String (id from LIMITATION_SCHEDULE_DB)
   *   - accrualDate: String (YYYY-MM-DD)
   *   - filingDate: String (YYYY-MM-DD, optional, defaults to today)
   * 
   *   Exclusions:
   *   - copyingApplyDate: String (YYYY-MM-DD)
   *   - copyingReadyDate: String (YYYY-MM-DD)
   *   - wrongCourtStartDate: String (YYYY-MM-DD)
   *   - wrongCourtEndDate: String (YYYY-MM-DD)
   *   - stayStartDate: String (YYYY-MM-DD)
   *   - stayEndDate: String (YYYY-MM-DD)
   *   - statutoryNoticeDays: Number (e.g. 60 for S. 80 CPC)
   * 
   *   Resets / Triggers:
   *   - ackDate: String (YYYY-MM-DD, Section 18 / 19 acknowledgment)
   *   - discoveryDate: String (YYYY-MM-DD, Section 17 fraud/mistake)
   *   - disabilityCeasedDate: String (YYYY-MM-DD, Section 6/8 minority ceased)
   *   - courtClosedOnExpiry: Boolean (Section 4)
   *   - courtReopenDate: String (YYYY-MM-DD)
   */
  function calculateLimitation(params) {
    const article = LIMITATION_SCHEDULE_DB.find(a => a.id === params.articleId);
    if (!article) {
      throw new Error(`Article with id "${params.articleId}" not found in database.`);
    }

    if (!params.accrualDate) {
      throw new Error('Cause of action / accrual date is required.');
    }

    const steps = [];
    let effectiveStartDate = new Date(params.accrualDate + 'T00:00:00');
    const today = params.filingDate ? new Date(params.filingDate + 'T00:00:00') : new Date();
    today.setHours(0, 0, 0, 0);

    steps.push({
      step: 1,
      title: 'Cause of Action Accrual Date (Starting Point)',
      date: formatDate(effectiveStartDate),
      description: `Reckoning commences from ${formatHumanDate(effectiveStartDate)} (${article.startingPoint}).`
    });

    // Section 17: Fraud / Mistake Adjustment
    let isSection17Applied = false;
    if (params.discoveryDate) {
      const disc = new Date(params.discoveryDate + 'T00:00:00');
      if (disc > effectiveStartDate) {
        effectiveStartDate = disc;
        isSection17Applied = true;
        steps.push({
          step: 2,
          title: 'Section 17: Discovery of Fraud / Mistake',
          date: formatDate(effectiveStartDate),
          description: `Under Section 17(1) and Mahabir Kishore v. State of MP (1990), period of limitation does not begin until discovery of fraud/mistake on ${formatHumanDate(effectiveStartDate)}.`
        });
      }
    }

    // Section 12(1): Day of accrual excluded (+1 calendar day)
    const nominalStart = new Date(effectiveStartDate.getTime());
    nominalStart.setDate(nominalStart.getDate() + 1);
    steps.push({
      step: 3,
      title: 'Section 12(1): First Day Excluded',
      date: formatDate(nominalStart),
      description: `By virtue of Section 12(1), the day from which the period is to be reckoned is excluded. First active computation day is ${formatHumanDate(nominalStart)}.`
    });

    // Compute Base Scheduled Deadline
    let scheduledDeadline = addPeriod(nominalStart, article.periodValue, article.periodUnit);
    steps.push({
      step: 4,
      title: `Schedule Prescribed Period (${article.periodValue} ${article.periodUnit})`,
      date: formatDate(scheduledDeadline),
      description: `Adding the prescribed period of ${article.periodValue} ${article.periodUnit} yields nominal base deadline of ${formatHumanDate(scheduledDeadline)}.`
    });

    // ----------------------------------------------------------------
    // STATUTORY EXCLUSIONS (Sections 12(2), 14, 15)
    // ----------------------------------------------------------------
    let totalExcludedDays = 0;
    const exclusionsBreakdown = [];

    // Section 12(2): Time requisite for obtaining certified copy
    let copyingDays = 0;
    if (params.copyingApplyDate && params.copyingReadyDate) {
      const applyD = new Date(params.copyingApplyDate + 'T00:00:00');
      const readyD = new Date(params.copyingReadyDate + 'T00:00:00');
      if (readyD >= applyD) {
        copyingDays = diffDays(applyD, readyD) + 1; // inclusive of apply and ready dates
        totalExcludedDays += copyingDays;
        exclusionsBreakdown.push({
          provision: 'Section 12(2) & 12(3)',
          label: 'Certified Copy Time Requisite',
          days: copyingDays,
          detail: `Applied: ${formatHumanDate(applyD)} -> Ready/Delivered: ${formatHumanDate(readyD)} (Excludes ${copyingDays} days per CST v. Madan Lal Das & Sons (1977)).`
        });
      }
    }

    // Section 14: Bona fide proceeding in court without jurisdiction
    let wrongCourtDays = 0;
    if (params.wrongCourtStartDate && params.wrongCourtEndDate) {
      const startW = new Date(params.wrongCourtStartDate + 'T00:00:00');
      const endW = new Date(params.wrongCourtEndDate + 'T00:00:00');
      if (endW >= startW) {
        wrongCourtDays = diffDays(startW, endW) + 1;
        totalExcludedDays += wrongCourtDays;
        exclusionsBreakdown.push({
          provision: 'Section 14',
          label: 'Bona Fide Proceeding in Court Without Jurisdiction',
          days: wrongCourtDays,
          detail: `Prosecuted from ${formatHumanDate(startW)} to ${formatHumanDate(endW)} (${wrongCourtDays} days excluded per Consolidated Engineering (2008)).`
        });
      }
    }

    // Section 15(1): Injunction / Stay order period
    let stayDays = 0;
    if (params.stayStartDate && params.stayEndDate) {
      const startS = new Date(params.stayStartDate + 'T00:00:00');
      const endS = new Date(params.stayEndDate + 'T00:00:00');
      if (endS >= startS) {
        stayDays = diffDays(startS, endS) + 1;
        totalExcludedDays += stayDays;
        exclusionsBreakdown.push({
          provision: 'Section 15(1)',
          label: 'Injunction / Stay Order Period',
          days: stayDays,
          detail: `Injunction in force from ${formatHumanDate(startS)} to ${formatHumanDate(endS)} (${stayDays} days excluded).`
        });
      }
    }

    // Section 15(2): Notice period (e.g. S. 80 CPC)
    let noticeDays = Number(params.statutoryNoticeDays) || 0;
    if (noticeDays > 0) {
      totalExcludedDays += noticeDays;
      exclusionsBreakdown.push({
        provision: 'Section 15(2)',
        label: 'Statutory Notice Period (e.g. S. 80 CPC)',
        days: noticeDays,
        detail: `Mandatory notice period of ${noticeDays} days excluded.`
      });
    }

    // Apply statutory exclusions to scheduled deadline
    let deadlineAfterExclusions = new Date(scheduledDeadline.getTime());
    if (totalExcludedDays > 0) {
      deadlineAfterExclusions.setDate(deadlineAfterExclusions.getDate() + totalExcludedDays);
      steps.push({
        step: 5,
        title: `Statutory Exclusions Added (+${totalExcludedDays} Days)`,
        date: formatDate(deadlineAfterExclusions),
        description: `Exclusions (Ss. 12, 14, 15) push the prescribed deadline out to ${formatHumanDate(deadlineAfterExclusions)}.`
      });
    }

    // ----------------------------------------------------------------
    // SECTION 18 & 19: FRESH START VIA ACKNOWLEDGMENT OR PART-PAYMENT
    // ----------------------------------------------------------------
    let isResetApplied = false;
    let resetError = null;
    let effectiveDeadline = new Date(deadlineAfterExclusions.getTime());

    if (params.ackDate) {
      const ackD = new Date(params.ackDate + 'T00:00:00');
      // Sampuran Singh v. Niranjan Kaur: Acknowledgment MUST be before expiry!
      if (ackD <= deadlineAfterExclusions) {
        isResetApplied = true;
        // Fresh limitation computed from date of acknowledgment!
        const newNominal = new Date(ackD.getTime());
        newNominal.setDate(newNominal.getDate() + 1); // S. 12(1) applies to fresh computation too
        effectiveDeadline = addPeriod(newNominal, article.periodValue, article.periodUnit);
        steps.push({
          step: 6,
          title: 'Section 18 / 19: Fresh Limitation Reset',
          date: formatDate(effectiveDeadline),
          description: `Valid acknowledgment in writing signed on ${formatHumanDate(ackD)} prior to expiry. Under Section 18 and ARC v. Bishal Jaiswal (2021), a fresh full period of ${article.periodValue} ${article.periodUnit} is computed, extending deadline to ${formatHumanDate(effectiveDeadline)}.`
        });
      } else {
        resetError = {
          provision: 'Section 18 / 19',
          title: 'Acknowledgment Void (Post-Expiry)',
          description: `The acknowledgment date (${formatHumanDate(ackD)}) falls AFTER the limitation period expired (${formatHumanDate(deadlineAfterExclusions)}). Per Sampuran Singh v. Niranjan Kaur (1999), an acknowledgment cannot revive a dead debt.`
        };
      }
    }

    // ----------------------------------------------------------------
    // SECTIONS 6 & 8: LEGAL DISABILITY (MINORITY / INSANITY)
    // ----------------------------------------------------------------
    let isDisabilityApplied = false;
    if (params.disabilityCeasedDate) {
      const cessationD = new Date(params.disabilityCeasedDate + 'T00:00:00');
      // Section 8 ceiling: Maximum 3 years from cessation of disability!
      const ceilingD = new Date(cessationD.getTime());
      ceilingD.setFullYear(ceilingD.getFullYear() + 3);

      // Compare standard schedule vs Section 8 ceiling
      let postDisabilityDeadline = addPeriod(cessationD, article.periodValue, article.periodUnit);
      if (postDisabilityDeadline > ceilingD) {
        postDisabilityDeadline = ceilingD;
      }

      if (postDisabilityDeadline > effectiveDeadline) {
        effectiveDeadline = postDisabilityDeadline;
        isDisabilityApplied = true;
        steps.push({
          step: 7,
          title: 'Sections 6 & 8: Legal Disability Adjustment',
          date: formatDate(effectiveDeadline),
          description: `Disability ceased on ${formatHumanDate(cessationD)}. Section 8 imposes a mandatory maximum ceiling of 3 years from cessation (Bailochan Karan v. Basant Babu (1999)). New deadline: ${formatHumanDate(effectiveDeadline)}.`
        });
      }
    }

    // ----------------------------------------------------------------
    // SECTION 4: EXPIRY DURING COURT CLOSURE / VACATION
    // ----------------------------------------------------------------
    let isSection4Applied = false;
    let finalFilingDeadline = new Date(effectiveDeadline.getTime());

    if (params.courtClosedOnExpiry && params.courtReopenDate) {
      const reopenD = new Date(params.courtReopenDate + 'T00:00:00');
      if (reopenD > finalFilingDeadline) {
        finalFilingDeadline = reopenD;
        isSection4Applied = true;
        steps.push({
          step: 8,
          title: 'Section 4: Filing on Court Reopening Day',
          date: formatDate(finalFilingDeadline),
          description: `Prescribed period expired while court was closed. Under Section 4 and Maqbul Ahmad v. Onkar Pratap (1935), suit/appeal may be instituted on reopening day (${formatHumanDate(finalFilingDeadline)}).`
        });
      }
    }

    // ----------------------------------------------------------------
    // FINAL TIME-BAR & SECTION 5 / SECTION 27 EVALUATION
    // ----------------------------------------------------------------
    const daysDiffFromToday = diffDays(today, finalFilingDeadline);
    const isTimeBarred = daysDiffFromToday < 0;
    const daysDelayed = isTimeBarred ? Math.abs(daysDiffFromToday) : 0;
    const daysRemaining = isTimeBarred ? 0 : daysDiffFromToday;

    // Build Section 5 Condonability Assessment
    let section5Report = null;
    if (isTimeBarred) {
      if (!article.appliesSection5) {
        section5Report = {
          isAvailable: false,
          statusClass: 'danger',
          badgeText: 'NO CONDONATION — SECTION 5 INAPPLICABLE',
          verdict: 'Mandatory Suo Motu Dismissal under Section 3',
          headline: 'Section 5 does NOT apply to original Suits or Order XXI Execution applications!',
          reasons: [
            'Section 5 explicitly restricts its scope to "any appeal or any application, other than an application under any of the provisions of Order XXI of CPC".',
            'Under Section 3 and Manindra Land & Building Corp. (1964), the Court has a mandatory duty to dismiss this proceeding, even if the defendant does not plead limitation.',
            'No court possesses inherent or equitable powers to bypass statutory limitation for an original suit.'
          ],
          landmarkCase: 'Manindra Land and Building Corp. v. Bhutnath Banerjee (1964)'
        };
      } else {
        // Appeals / Applications where Section 5 applies
        section5Report = {
          isAvailable: true,
          statusClass: 'warning',
          badgeText: 'SECTION 5 CONDONATION OF DELAY APPLICABLE',
          verdict: `Condonation Required for ${daysDelayed} Days Delay`,
          headline: `A separate Application under Section 5 supported by an Affidavit establishing "Sufficient Cause" is mandatory.`,
          reasons: [
            `Total delay: ${daysDelayed} calendar days after statutory exclusions.`,
            'Under Collector Land Acquisition, Anantnag v. Mst. Katiji (1987), delay should be construed pragmatically to advance substantial justice.',
            'Under Pathapati Subba Reddy (2024), explanation must demonstrate bona fides without gross negligence or inaction.',
            'Opposite party has acquired a valuable vested right upon limitation expiry which can only be disturbed for legitimate cause.'
          ],
          landmarkCase: 'Collector, Land Acquisition, Anantnag v. Mst. Katiji, AIR 1987 SC 1353'
        };
      }
    }

    // Build Section 27 Extinguishment Assessment
    let section27Report = null;
    if (article.appliesSection27 && isTimeBarred) {
      section27Report = {
        applied: true,
        badgeText: 'SECTION 27: SUBSTANTIVE RIGHT EXTINGUISHED',
        title: 'Title and Ownership Extinguished by Adverse Possession',
        description: 'Under Section 27 of the Limitation Act, 1963, upon determination of the 12-year period under Articles 64/65, the true owner’s right and title to the property is permanently extinguished. Per the 3-Judge Bench ruling in Ravinder Kaur Grewal v. Manjit Kaur (2019), the adverse possessor acquires valid possessory title and can sue as plaintiff.',
        landmarkCase: 'Ravinder Kaur Grewal v. Manjit Kaur, (2019) 8 SCC 729'
      };
    }

    // Retrieve Landmark Cases for this Article
    const relevantCases = LIMITATION_LANDMARK_CASES.filter(c => article.keyCases.includes(c.id));

    return {
      article,
      effectiveStartDate: formatDate(effectiveStartDate),
      nominalDeadline: formatDate(scheduledDeadline),
      deadlineAfterExclusions: formatDate(deadlineAfterExclusions),
      finalFilingDeadline: formatDate(finalFilingDeadline),
      filingDate: formatDate(today),
      isTimeBarred,
      daysRemaining,
      daysDelayed,
      totalExcludedDays,
      exclusionsBreakdown,
      isResetApplied,
      resetError,
      isSection17Applied,
      isDisabilityApplied,
      isSection4Applied,
      section5Report,
      section27Report,
      steps,
      relevantCases
    };
  }

  // ------------------------------------------------------------------
  // 4. PRESET SCENARIOS (DU LL.B. Moot & Bar Exam Master Problems)
  // ------------------------------------------------------------------
  const LIMITATION_PRESETS = [
    {
      id: 'preset_specific_perf',
      name: 'Suit for Specific Performance (Article 54)',
      description: 'Agreement to Sell with specific completion date. Suit filed 2 years and 10 months after date fixed.',
      params: {
        articleId: 'art_54',
        accrualDate: '2023-01-15',
        copyingApplyDate: '',
        copyingReadyDate: '',
        statutoryNoticeDays: 0,
        ackDate: '',
        courtClosedOnExpiry: false
      }
    },
    {
      id: 'preset_money_ack',
      name: 'Money Recovery with Balance Sheet Acknowledgment (Art. 19 + S. 18)',
      description: 'Loan advanced in 2021. Signed balance sheet acknowledging debt in 2023 resets limitation for 3 fresh years.',
      params: {
        articleId: 'art_19',
        accrualDate: '2021-04-10',
        copyingApplyDate: '',
        copyingReadyDate: '',
        statutoryNoticeDays: 0,
        ackDate: '2023-03-31',
        courtClosedOnExpiry: false
      }
    },
    {
      id: 'preset_civil_appeal_copy',
      name: 'Civil First Appeal with Certified Copy Exclusion (Art. 115(a) + S. 12(2))',
      description: 'District Court decree. Certified copy took 38 days to prepare by copying branch. 90-day limitation pushed out.',
      params: {
        articleId: 'art_115a',
        accrualDate: '2026-06-01',
        copyingApplyDate: '2026-06-05',
        copyingReadyDate: '2026-07-13',
        statutoryNoticeDays: 0,
        ackDate: '',
        courtClosedOnExpiry: false
      }
    },
    {
      id: 'preset_adverse_possession',
      name: 'Adverse Possession & Title Extinguishment (Art. 65 + S. 27)',
      description: 'Dispossession in 2010. 12-year window expired in 2022. Substantive title extinguished under Section 27.',
      params: {
        articleId: 'art_65',
        accrualDate: '2010-02-01',
        copyingApplyDate: '',
        copyingReadyDate: '',
        statutoryNoticeDays: 0,
        ackDate: '',
        courtClosedOnExpiry: false
      }
    },
    {
      id: 'preset_arbitration_s34',
      name: 'Arbitration Award Challenge (S. 34(3) A&C Act Strict 30-Day Proviso)',
      description: 'Award received. 3-month statutory window + 30-day condonable limit. Strict bar per Simplex Infrastructure.',
      params: {
        articleId: 'art_arb_34',
        accrualDate: '2026-07-01',
        copyingApplyDate: '',
        copyingReadyDate: '',
        statutoryNoticeDays: 0,
        ackDate: '',
        courtClosedOnExpiry: false
      }
    },
    {
      id: 'preset_ex_parte_decree',
      name: 'Setting Aside Ex-Parte Decree (Art. 123 Summons Not Served)',
      description: 'Ex-parte decree passed in 2024, but defendant only discovered it during bank attachment in 2026.',
      params: {
        articleId: 'art_123',
        accrualDate: '2026-08-01',
        discoveryDate: '2026-08-01',
        copyingApplyDate: '',
        copyingReadyDate: '',
        statutoryNoticeDays: 0,
        ackDate: '',
        courtClosedOnExpiry: false
      }
    }
  ];

  // ------------------------------------------------------------------
  // 5. EXPOSE PUBLIC INTERFACE
  // ------------------------------------------------------------------
  const LimitationCalculator = {
    CASES: LIMITATION_LANDMARK_CASES,
    SCHEDULE: LIMITATION_SCHEDULE_DB,
    PRESETS: LIMITATION_PRESETS,
    calculate: calculateLimitation,
    helpers: {
      diffDays,
      addPeriod,
      formatDate,
      formatHumanDate
    }
  };

  if (typeof window !== 'undefined') {
    window.LimitationCalculator = LimitationCalculator;
  }
  if (typeof global !== 'undefined') {
    global.LimitationCalculator = LimitationCalculator;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LimitationCalculator;
  }

})(typeof window !== 'undefined' ? window : this);
