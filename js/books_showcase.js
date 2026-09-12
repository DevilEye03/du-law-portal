/**
 * DU Law Notes Portal — 3D Interactive Books Showcase
 * Ported from VengeanceUI BooksShowcase (Three.js + Procedural Canvas Textures + Spring Physics)
 *
 * Renders each semester's subjects as realistic, interactive 3D hardbound law treatises.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. ALL SEMESTER SUBJECTS DICTIONARY (Named according to each subject)
  // =========================================================================
  const SEMESTER_SUBJECT_BOOKS = {
    1: [
      {
        id: "juris",
        code: "LB-106",
        title: "Jurisprudence–I",
        author: "LB-106 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "42 Landmark Cases",
        desc: "Legal Method, Bharatiya Jurisprudence, Vedic environmental consciousness, major world legal systems & judicial hierarchy.",
        spineBg: "#183059",
        spineInk: "#c59b27",
        spineFont: "700 38px Georgia",
        backBg: "#0e1f3d",
        backInk: "245,238,219",
        edge: "#f5eedc",
        chapters: [
          "Evolution of Bharatiya Jurisprudence – I",
          "Evolution of Bharatiya Jurisprudence – II",
          "Major Legal Systems of the World",
          "Principles & Institutions of Indian Legal System",
          "Sources of Law (Custom, Precedent, Legislation)"
        ]
      },
      {
        id: "contract",
        code: "LB-103",
        title: "Law of Contract",
        author: "LB-103 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "58 Landmark Cases",
        desc: "General Principles of Contract (Ss. 1–75), formation, consideration, free consent, breach of contract & Specific Relief Act 1963.",
        spineBg: "#4a2a18",
        spineInk: "#f9d784",
        spineFont: "700 38px Georgia",
        backBg: "#2e190e",
        backInk: "249,215,132",
        edge: "#ece3cf",
        chapters: [
          "Formation of Contract & Communication",
          "Consideration & Capacity of Parties",
          "Free Consent, Coercion, Fraud & Mistake",
          "Void Agreements, Contingent & Quasi-Contracts",
          "Discharge, Breach & Specific Relief Act"
        ]
      },
      {
        id: "bns",
        code: "LB-102",
        title: "Law of Crimes (IPC & BNS)",
        author: "LB-102 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "64 Landmark Cases",
        desc: "Criminal jurisprudence, Mens Rea, General Exceptions, Offences Against Human Body & Property (BNS 2023 ↔ IPC 1860).",
        spineBg: "#6b1414",
        spineInk: "#ffdede",
        spineFont: "700 38px Georgia",
        backBg: "#3f0a0a",
        backInk: "255,222,222",
        edge: "#e8ded8",
        chapters: [
          "Principles of Criminal Liability & Mens Rea",
          "General Exceptions & Right of Private Defence",
          "Offences Against Human Body (Homicide & Murder)",
          "Offences Against Women (Rape & Domestic Cruelty)",
          "Offences Against Property (Theft, Robbery & Dacoity)"
        ]
      },
      {
        id: "family",
        code: "LB-104",
        title: "Family Law–I (Hindu Law)",
        author: "LB-104 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "51 Landmark Cases",
        desc: "Hindu Marriage Act 1955, Hindu Succession Act 2005, Adoption, Maintenance & Mitakshara Coparcenary.",
        spineBg: "#542159",
        spineInk: "#f4d4fc",
        spineFont: "700 38px Georgia",
        backBg: "#310d36",
        backInk: "244,212,252",
        edge: "#f0e6f2",
        chapters: [
          "Sources & Schools of Hindu Law",
          "Marriage, Ceremonies & Restitution of Conjugal Rights",
          "Nullity, Divorce & Irretrievable Breakdown",
          "Adoption, Maintenance & Guardianship",
          "Mitakshara Joint Family & Coparcenary Devolution"
        ]
      },
      {
        id: "torts",
        code: "LB-105",
        title: "Law of Torts & CPA",
        author: "LB-105 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "48 Landmark Cases",
        desc: "Civil Wrongs, Strict & Absolute Liability, Vicarious Liability, Negligence, Defamation & Consumer Protection Act 2019.",
        spineBg: "#1a4731",
        spineInk: "#c6f6d5",
        spineFont: "700 38px Georgia",
        backBg: "#0c281b",
        backInk: "198,246,213",
        edge: "#dbece2",
        chapters: [
          "Nature & Principles of Tortious Liability",
          "General Defences & Justification in Tort",
          "Vicarious Liability of State & Master-Servant",
          "Negligence, Nuisance & Defamation",
          "Strict/Absolute Liability & Consumer Protection Act"
        ]
      }
    ],
    2: [
      {
        id: "crimes2",
        code: "LB-201",
        title: "Law of Crimes–II (CrPC & BNSS)",
        author: "LB-201 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "50 Landmark Cases",
        desc: "Criminal Procedure Code 1973 & BNSS 2023: Arrest, Investigation, FIR, Bail, Trial Procedure & Judgment.",
        spineBg: "#6b1414",
        spineInk: "#ffd6d6",
        spineFont: "700 38px Georgia",
        backBg: "#3d0808",
        backInk: "255,214,214",
        edge: "#ecd8d8",
        chapters: [
          "Hierarchy of Criminal Courts & Jurisdiction",
          "Arrest, Custody & Rights of Arrested Persons",
          "Information to Police (FIR) & Investigation Process",
          "Bail Provisions, Anticipatory Bail & Bond",
          "Framing of Charges, Trial Procedure & Appeals"
        ]
      },
      {
        id: "consti1",
        code: "LB-202",
        title: "Constitutional Law–I",
        author: "LB-202 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "60 Landmark Cases",
        desc: "Fundamental Rights (Arts. 12–35), Directive Principles of State Policy, Basic Structure & Constitutional Remedies.",
        spineBg: "#182a4d",
        spineInk: "#f9d784",
        spineFont: "700 38px Georgia",
        backBg: "#0c172e",
        backInk: "249,215,132",
        edge: "#f5eedc",
        chapters: [
          "Concept of State (Art. 12) & Judicial Review (Art. 13)",
          "Right to Equality & Non-Discrimination (Arts. 14–18)",
          "Fundamental Freedoms & Reasonable Restrictions (Art. 19)",
          "Right to Life & Personal Liberty (Art. 21)",
          "Constitutional Remedies & Writs (Arts. 32 & 226)"
        ]
      },
      {
        id: "property",
        code: "LB-203",
        title: "Property Law",
        author: "LB-203 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "45 Landmark Cases",
        desc: "Transfer of Property Act 1882: Movable vs Immovable, Perpetuities, Lis Pendens, Mortgages, Leases & Gifts.",
        spineBg: "#382d1c",
        spineInk: "#e6ccaa",
        spineFont: "700 38px Georgia",
        backBg: "#1f180d",
        backInk: "230,204,170",
        edge: "#ece0cb",
        chapters: [
          "Meaning of Property & Transferability",
          "Rule Against Perpetuity & Accumulation",
          "Doctrine of Election & Lis Pendens",
          "Sale of Immovable Property & Mortgages",
          "Leases, Exchanges & Law of Gifts"
        ]
      },
      {
        id: "pil",
        code: "LB-204",
        title: "Public International Law",
        author: "LB-204 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "40 Landmark Cases",
        desc: "Sources of International Law, State Recognition, Extradition, Asylum, Law of the Sea & UN Charter.",
        spineBg: "#1b3c4f",
        spineInk: "#c2e2f5",
        spineFont: "700 38px Georgia",
        backBg: "#0b1d28",
        backInk: "194,226,245",
        edge: "#dbe8f0",
        chapters: [
          "Nature, Basis & Sources of International Law",
          "Relationship Between International & Municipal Law",
          "State Recognition, Succession & Jurisdiction",
          "Extradition, Asylum & State Responsibility",
          "Law of the Sea & United Nations Charter System"
        ]
      },
      {
        id: "family2",
        code: "LB-205",
        title: "Family Law–II (Muslim Law)",
        author: "LB-205 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "45 Landmark Cases",
        desc: "Muslim Law, Marriage (Nikah), Dower (Mahr), Talaq, Waqf, Hiba (Gifts) & Special Marriage Act 1954.",
        spineBg: "#1d4734",
        spineInk: "#d4f2e0",
        spineFont: "700 38px Georgia",
        backBg: "#0a2418",
        backInk: "212,242,224",
        edge: "#e0eee5",
        chapters: [
          "Sources & Schools of Muslim Law",
          "Marriage (Nikah), Dower (Mahr) & Impediments",
          "Dissolution of Marriage & Talaq Regulations",
          "Wills (Wasiyat), Gifts (Hiba) & Waqf",
          "Special Marriage Act 1954 & Uniform Civil Code"
        ]
      }
    ],
    3: [
      {
        id: "cpc",
        code: "LB-301",
        title: "Civil Procedure & Limitation",
        author: "LB-301 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "11 Comprehensive Units",
        casesCount: "53 Landmark Cases",
        desc: "Code of Civil Procedure 1908 & Limitation Act 1963: Jurisdiction, Res Judicata, Pleadings, Rejection of Plaint, Appeals, Inherent Powers & Limitation.",
        spineBg: "#2e1065",
        spineInk: "#dfcaf5",
        spineFont: "700 38px Georgia",
        backBg: "#1a0d2b",
        backInk: "223,202,245",
        edge: "#ede0f5",
        chapters: [
          "Civil Courts Jurisdiction & Res Judicata (Ss. 9–11)",
          "Appeals: First, Second & Appellate Powers (Ss. 96, 100, 107)",
          "Reference, Review, Revision & S. 151 Inherent Powers",
          "Parties to Suits (O. I) & Amendment of Pleadings (O. VI R. 17)",
          "Rejection of Plaint (O. VII R. 11) & Ex-Parte Decrees (O. IX)",
          "Summary Procedure on Commercial Debts (Order XXXVII)",
          "Temporary Injunctions & Interlocutory Orders (Order XXXIX)",
          "Bar of Limitation & Condonation of Delay (Ss. 3–5)",
          "Computation of Limitation Period (Ss. 12, 17–19, 21)",
          "Acquisition of Ownership by Possession (Ss. 25–27)",
          "Limitation Schedule & Residuary Articles (Arts. 113, 137)"
        ]
      },
      {
        id: "company",
        code: "LB-303",
        title: "Company Law",
        author: "LB-303 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "10 Comprehensive Units",
        casesCount: "79 Landmark Cases",
        desc: "Companies Act 2013: Corporate Personality, MOA/AOA, Capital Markets, Directors' Duties, Oppression & Winding Up.",
        spineBg: "#0e1b30",
        spineInk: "#f5c358",
        spineFont: "700 38px Georgia",
        backBg: "#060c17",
        backInk: "245,195,88",
        edge: "#f5eedc",
        chapters: [
          "Corporate Personality & Lifting the Veil",
          "Promotion & Formation of Companies",
          "Constitutional Documents (MOA & AOA)",
          "Capital Market Instruments & Prospectus",
          "Board of Directors & Duties under S. 166",
          "General Meetings & Corporate Democracy",
          "Oppression & Mismanagement (Ss. 241–245)",
          "Winding Up of Companies",
          "Adjudicatory Bodies (NCLT & NCLAT)",
          "Corporate Social Responsibility & Governance"
        ]
      },
      {
        id: "wcc",
        code: "LB-3037",
        title: "White Collar Crimes",
        author: "LB-3037 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "6 Comprehensive Units",
        casesCount: "46 Landmark Cases",
        desc: "White Collar Crimes & Socio-Economic Offences: Sutherland & Cressey Theories, 47th LCI Report, PC Act 1988, PMLA 2002, FSSA 2006 & NDPS Act 1985.",
        spineBg: "#450a0a",
        spineInk: "#fed7d7",
        spineFont: "700 38px Georgia",
        backBg: "#260505",
        backInk: "254,215,215",
        edge: "#fde8e8",
        chapters: [
          "Concept of White Collar Crime & Socio-Economic Offences",
          "Criminological Theories: Sutherland & Cressey Fraud Triangle",
          "The Prevention of Corruption Act, 1988 (as amended 2018)",
          "Prevention of Money-Laundering Act, 2002 (PMLA)",
          "The Food Safety and Standards Act, 2006 (FSSA)",
          "The Narcotic Drugs and Psychotropic Substances Act, 1985 (NDPS)"
        ]
      },
      {
        id: "media",
        code: "LB-3031",
        title: "Media & Law",
        author: "LB-3031 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "8 Comprehensive Units",
        casesCount: "37 Landmark Cases",
        desc: "Fourth Estate Jurisprudence, Freedom of Speech (Art. 19(1)(a)), Cinema Censorship, Contempt of Court, RTI, Trial by Media & Digital Regulation.",
        spineBg: "#082f49",
        spineInk: "#bae6fd",
        spineFont: "700 38px Georgia",
        backBg: "#031c2e",
        backInk: "186,230,253",
        edge: "#e0f2fe",
        chapters: [
          "Different Forms of Media & Legislative History",
          "Freedom of Speech, Privacy, Defamation & Stings",
          "Right to Information & Trial by Media",
          "Contempt of Court & Unverified Reporting",
          "Media Regulation: Print, Broadcast & Social Media",
          "Media, Advertisement & Commercial Speech",
          "Cinema Censorship & Judicial Postponement",
          "Legislative Privileges, Paid News & Contemporary Issues"
        ]
      },
      {
        id: "consti2",
        code: "LB-302",
        title: "Constitutional Law–II",
        author: "LB-302 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "55 Landmark Cases",
        desc: "Federalism, Union & State Executive, Parliament, Judiciary (Art. 124–147) & Amendment Powers (Art. 368).",
        spineBg: "#192e47",
        spineInk: "#e8c974",
        spineFont: "700 38px Georgia",
        backBg: "#0c1724",
        backInk: "232,201,116",
        edge: "#ece4d0",
        chapters: [
          "Indian Federal Structure & Centre-State Relations",
          "The Union & State Executive Powers",
          "Parliamentary Privileges & Legislative Process",
          "Union & State Judiciary Independence",
          "Emergency Powers & Amendment Procedure"
        ]
      },
      {
        id: "specialcontracts",
        code: "LB-304",
        title: "Special Contracts",
        author: "LB-304 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "48 Landmark Cases",
        desc: "Sale of Goods Act 1930, Indian Partnership Act 1932, Contracts of Indemnity, Guarantee, Bailment, Pledge & Agency.",
        spineBg: "#1a2c38",
        spineInk: "#d2e9f7",
        spineFont: "700 38px Georgia",
        backBg: "#0c1820",
        backInk: "210,233,247",
        edge: "#dbe8f0",
        chapters: [
          "Contract of Indemnity & Guarantee (Ss. 124–147)",
          "Bailment & Pledge Rights and Duties (Ss. 148–181)",
          "Law of Agency & Principal-Agent Relations (Ss. 182–238)",
          "Sale of Goods Act: Conditions, Warranties & Unpaid Seller",
          "Indian Partnership Act: Relations of Partners & Dissolution"
        ]
      }
    ],
    4: [
      {
        id: "adminlaw",
        code: "LB-404",
        title: "Administrative Law",
        author: "LB-404 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "48 Landmark Cases",
        desc: "Separation of Powers, Delegated Legislation, Principles of Natural Justice & Judicial Review of Admin Action.",
        spineBg: "#1a3b39",
        spineInk: "#c2ebd9",
        spineFont: "700 38px Georgia",
        backBg: "#0c1e1d",
        backInk: "194,235,217",
        edge: "#daebe5",
        chapters: [
          "Nature & Scope of Administrative Law",
          "Rule of Law & Separation of Powers Doctrine",
          "Delegated Legislation & Parliamentary Control",
          "Principles of Natural Justice & Fair Hearing",
          "Judicial Review & Ombudsman Institutions"
        ]
      },
      {
        id: "labour",
        code: "LB-401",
        title: "Labour Law–I",
        author: "LB-401 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "45 Landmark Cases",
        desc: "Industrial Disputes Act 1947, Trade Unions Act 1926, Strikes, Lockouts, Lay-off & Retrenchment.",
        spineBg: "#2a1e36",
        spineInk: "#e5d4f5",
        spineFont: "700 38px Georgia",
        backBg: "#160e20",
        backInk: "229,212,245",
        edge: "#e8dfe0",
        chapters: [
          "Definition of Industry & Industrial Dispute",
          "Trade Union Registration & Collective Bargaining",
          "Strikes, Lockouts & Prohibitions",
          "Lay-off, Retrenchment & Closure",
          "Dispute Adjudication: Labour Courts & Tribunals"
        ]
      },
      {
        id: "adr",
        code: "LB-402",
        title: "Alternative Dispute Resolution",
        author: "LB-402 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "38 Landmark Cases",
        desc: "Arbitration and Conciliation Act 1996: Arbitration Agreements, Arbitral Tribunals, Awards & Lok Adalats.",
        spineBg: "#1c3328",
        spineInk: "#cbf5de",
        spineFont: "700 38px Georgia",
        backBg: "#0c1f16",
        backInk: "203,245,222",
        edge: "#d8eee2",
        chapters: [
          "Evolution of ADR & Section 89 CPC",
          "Arbitration Agreements & Judicial Intervention",
          "Composition & Jurisdiction of Arbitral Tribunals",
          "Making of Arbitral Award & Setting Aside (S. 34)",
          "Conciliation, Mediation & Lok Adalat Mechanism"
        ]
      },
      {
        id: "evidence",
        code: "LB-403",
        title: "Law of Evidence (BSA & IEA)",
        author: "LB-403 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "56 Landmark Cases",
        desc: "Bharatiya Sakshya Adhiniyam 2023 & Evidence Act 1872: Relevancy, Confessions, Dying Declarations & Burden of Proof.",
        spineBg: "#3d1b1b",
        spineInk: "#fad4d4",
        spineFont: "700 38px Georgia",
        backBg: "#220a0a",
        backInk: "250,212,212",
        edge: "#eee0e0",
        chapters: [
          "Concept of Fact, Relevant Fact & Issue",
          "Doctrine of Res Gestae & Admissions",
          "Confessions to Police & Section 27 Discovery",
          "Dying Declarations & Expert Opinions",
          "Burden of Proof, Estoppel & Witnesses"
        ]
      },
      {
        id: "taxation",
        code: "LB-404",
        title: "Corporate Taxation & GST",
        author: "LB-404 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "40 Landmark Cases",
        desc: "Income Tax Act 1961, Residential Status, Corporate Tax Rates, Capital Gains & GST Architecture.",
        spineBg: "#19283f",
        spineInk: "#fed17e",
        spineFont: "700 38px Georgia",
        backBg: "#0d1624",
        backInk: "254,209,126",
        edge: "#efe7d6",
        chapters: [
          "Basic Concepts & Residential Status of Companies",
          "Profits and Gains of Business (PGBP)",
          "Capital Gains & Set-off of Losses",
          "Deductions, Assessment & Corporate Surcharges",
          "GST Constitutional Framework & Input Tax Credit"
        ]
      },
      {
        id: "gender",
        code: "LB-405",
        title: "Gender Justice & Law",
        author: "LB-405 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "42 Landmark Cases",
        desc: "Constitutional protections for women, POSH Act 2013, Domestic Violence Act 2005 & Equal Remuneration.",
        spineBg: "#4a1936",
        spineInk: "#ffd6ee",
        spineFont: "700 38px Georgia",
        backBg: "#290a1c",
        backInk: "255,214,238",
        edge: "#f2e4ed",
        chapters: [
          "Feminist Jurisprudence & Patriarchal Legal Structures",
          "Constitutional Equality (Arts. 14, 15(3) & 16)",
          "Sexual Harassment at Workplace (POSH Act 2013)",
          "Protection from Domestic Violence Act 2005",
          "Reproductive Rights, Surrogacy & Equal Wages"
        ]
      }
    ],
    5: [
      {
        id: "envlaw",
        code: "LB-501",
        title: "Environmental Law",
        author: "LB-501 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "48 Landmark Cases",
        desc: "Environment Protection Act 1986, Water/Air Acts, National Green Tribunal (NGT) & Sustainable Development.",
        spineBg: "#153d26",
        spineInk: "#bbf2cf",
        spineFont: "700 38px Georgia",
        backBg: "#092113",
        backInk: "187,242,207",
        edge: "#d8eee1",
        chapters: [
          "Constitutional Mandate: Arts. 21, 48A & 51A(g)",
          "Polluter Pays & Precautionary Principles",
          "Environment Protection Act 1986 & EIA Notifications",
          "Water & Air Pollution Control Mechanisms",
          "National Green Tribunal Act 2010 Powers"
        ]
      },
      {
        id: "ipr",
        code: "LB-502",
        title: "Intellectual Property Rights",
        author: "LB-502 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "45 Landmark Cases",
        desc: "Patents Act 1970, Copyright Act 1957, Trade Marks Act 1999 & Geographical Indications.",
        spineBg: "#332617",
        spineInk: "#edd8b4",
        spineFont: "700 38px Georgia",
        backBg: "#1c1409",
        backInk: "237,216,180",
        edge: "#eee4d2",
        chapters: [
          "Theoretical Foundations of IPR & TRIPS Agreement",
          "Patentability Criteria, Novelty & Section 3 Exceptions",
          "Copyright: Original Expression & Fair Dealing",
          "Trade Marks: Distinctiveness & Deceptive Similarity",
          "IPR Enforcement, Injunctions & Counterfeiting Remedies"
        ]
      },
      {
        id: "taxprinciples",
        code: "LB-503",
        title: "Principles of Taxation",
        author: "LB-503 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "35 Landmark Cases",
        desc: "Canons of Taxation, Direct vs Indirect Taxes, Tax Avoidance vs Evasion & Double Taxation Treaties.",
        spineBg: "#1b2c45",
        spineInk: "#dfc17d",
        spineFont: "700 38px Georgia",
        backBg: "#0c1726",
        backInk: "223,193,125",
        edge: "#eee6d5",
        chapters: [
          "Constitutional Power of Taxation (Art. 265)",
          "Canons of Adam Smith & Modern Fiscal Policy",
          "Doctrine of Substantial Presence & Nexus",
          "Tax Avoidance vs Legitimate Planning",
          "International Taxation & Double Taxation Treaties"
        ]
      },
      {
        id: "humanrights",
        code: "LB-504",
        title: "Human Rights Law",
        author: "LB-504 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "40 Landmark Cases",
        desc: "UDHR 1948, ICCPR, ICESCR, Protection of Human Rights Act 1993, NHRC & Judicial Activism in India.",
        spineBg: "#451829",
        spineInk: "#f5cad8",
        spineFont: "700 38px Georgia",
        backBg: "#260a14",
        backInk: "245,202,216",
        edge: "#f0e1e6",
        chapters: [
          "Evolution of Human Rights & Generations of Rights",
          "Universal Declaration of Human Rights 1948",
          "ICCPR & ICESCR International Covenants",
          "National Human Rights Commission (NHRC) Jurisdiction",
          "Enforcement of Human Rights by Indian Supreme Court"
        ]
      },
      {
        id: "cyberlaw",
        code: "LB-505",
        title: "Cyber Law & IT Act",
        author: "LB-505 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "38 Landmark Cases",
        desc: "Information Technology Act 2000, Digital Signatures, Cyber Crimes, Intermediary Liability & DPDP Act 2023.",
        spineBg: "#122a3d",
        spineInk: "#99d6ff",
        spineFont: "700 38px Georgia",
        backBg: "#071622",
        backInk: "153,214,255",
        edge: "#d8eefc",
        chapters: [
          "UNCITRAL Model Law & Electronic Governance",
          "Digital & Electronic Signatures Authentication",
          "Cyber Offences: Hacking, Identity Theft & Data Protection",
          "Intermediary Liability (S. 79 & Shreya Singhal)",
          "Digital Personal Data Protection Act 2023 Principles"
        ]
      }
    ],
    6: [
      {
        id: "dpc",
        code: "LB-601",
        title: "Drafting & Conveyancing",
        author: "LB-601 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "30 Landmark Cases",
        desc: "Fundamental Principles of Legal Drafting: Plaints, Written Statements, Writ Petitions, Deeds of Sale & Wills.",
        spineBg: "#2f241a",
        spineInk: "#ecd8be",
        spineFont: "700 38px Georgia",
        backBg: "#17100a",
        backInk: "236,216,190",
        edge: "#eae0d2",
        chapters: [
          "General Principles of Pleadings (Order VI CPC)",
          "Drafting Civil Plaints & Written Statements",
          "Drafting Criminal Complaints & Bail Applications",
          "Writ Petitions under Arts. 32 & 226",
          "Conveyancing: Deeds of Sale, Mortgage, Lease & Will"
        ]
      },
      {
        id: "moot",
        code: "LB-602",
        title: "Moot Court & Advocacy",
        author: "LB-602 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "25 Landmark Cases",
        desc: "Memorial Drafting, Oral Advocacy, Court Decorum, Pre-trial Preparations & Client Interviewing Techniques.",
        spineBg: "#182c3f",
        spineInk: "#c4e4ff",
        spineFont: "700 38px Georgia",
        backBg: "#0a1824",
        backInk: "196,228,255",
        edge: "#dbeefc",
        chapters: [
          "Memorial Drafting: Structure, Citations & IRAC Format",
          "Oral Advocacy: Art of Persuasion & Court Demeanor",
          "Bench Queries & Handling Tough Judicial Interventions",
          "Trial Observation: Civil & Criminal Proceedings",
          "Client Counseling & Professional Legal Opinions"
        ]
      },
      {
        id: "ethics",
        code: "LB-603",
        title: "Professional Ethics & Bar",
        author: "LB-603 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "35 Landmark Cases",
        desc: "Advocates Act 1961, Bar Council of India Rules, Contempt of Courts Act 1971 & Fiduciary Duty to Clients.",
        spineBg: "#3b1e36",
        spineInk: "#f5d4f0",
        spineFont: "700 38px Georgia",
        backBg: "#210d1e",
        backInk: "245,212,240",
        edge: "#eedfe9",
        chapters: [
          "Evolution of Legal Profession & Advocates Act 1961",
          "BCI Rules on Professional Conduct & Etiquette",
          "Duties to Client, Court, Colleague & Opponent",
          "Professional Misconduct & Disciplinary Committees",
          "Contempt of Courts Act 1971: Civil vs Criminal Contempt"
        ]
      },
      {
        id: "trade",
        code: "LB-604",
        title: "International Trade Law",
        author: "LB-604 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "32 Landmark Cases",
        desc: "GATT 1994, WTO Agreements, Most Favoured Nation (MFN), National Treatment, Anti-Dumping & DSB.",
        spineBg: "#17363a",
        spineInk: "#bfeeed",
        spineFont: "700 38px Georgia",
        backBg: "#0a1f22",
        backInk: "191,238,237",
        edge: "#daf0ef",
        chapters: [
          "Bretton Woods System & Establishment of WTO",
          "GATT 1994: MFN Clause & National Treatment Principle",
          "Tariff vs Non-Tariff Barriers & Quantitative Restrictions",
          "Trade Remedial Measures: Anti-Dumping & Subsidies",
          "WTO Dispute Settlement Body (DSB) & Appellate Body"
        ]
      },
      {
        id: "ibc",
        code: "LB-605",
        title: "Insolvency Code (IBC)",
        author: "LB-605 • Faculty of Law, DU",
        year: "2025–26",
        stars: 5,
        unitsCount: "5 Comprehensive Units",
        casesCount: "42 Landmark Cases",
        desc: "Insolvency and Bankruptcy Code 2016: Corporate Insolvency Resolution Process (CIRP), CoC & Liquidation.",
        spineBg: "#2a1e16",
        spineInk: "#f5d5be",
        spineFont: "700 38px Georgia",
        backBg: "#170e08",
        backInk: "245,213,190",
        edge: "#eae0d6",
        chapters: [
          "Economic Rationale & Historical Evolution of IBC 2016",
          "Initiation of CIRP by Financial / Operational Creditors",
          "Moratorium under Section 14 & Powers of IRP/RP",
          "Committee of Creditors (CoC) Commercial Wisdom",
          "Approval of Resolution Plan (S. 31) & Liquidation Waterfall"
        ]
      }
    ]
  };

  // =========================================================================
  // 2. PROCEDURAL TEXTURE UTILITIES & CANVASES
  // =========================================================================
  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function drawSpaced(x, text, cx, y, ls) {
    const prev = x.textAlign;
    x.textAlign = 'left';
    const chars = [...text];
    let tot = 0;
    const ws = chars.map((ch) => {
      const w = x.measureText(ch).width;
      tot += w;
      return w;
    });
    tot += ls * (chars.length - 1);
    let px = cx - tot / 2;
    chars.forEach((ch, i) => {
      x.fillText(ch, px, y);
      px += ws[i] + ls;
    });
    x.textAlign = prev;
  }

  function rr(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  function trimToWidth(x, text, maxW) {
    if (x.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
    return t + '...';
  }

  // Paint Ornate Legal Treatise Front Cover
  function paintLawFront(x, w, h, o) {
    // Rich leather background
    x.fillStyle = o.bg || '#183059';
    x.fillRect(0, 0, w, h);

    // Subtle grain texture
    x.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 70; i++) x.fillRect(Math.random() * w, Math.random() * h, 3, 3);
    x.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 70; i++) x.fillRect(Math.random() * w, Math.random() * h, 3, 3);

    // Double Ornate Gold Foil Border
    x.strokeStyle = 'rgba(218, 175, 75, 0.7)';
    x.lineWidth = 4;
    x.strokeRect(55, 55, w - 110, h - 110);

    x.strokeStyle = 'rgba(218, 175, 75, 0.35)';
    x.lineWidth = 1.5;
    x.strokeRect(70, 70, w - 140, h - 140);

    // Corner flourishes
    const cs = 36;
    [[55, 55], [w - 55 - cs, 55], [55, h - 55 - cs], [w - 55 - cs, h - 55 - cs]].forEach(([cx, cy]) => {
      x.fillStyle = 'rgba(218, 175, 75, 0.65)';
      x.fillRect(cx, cy, cs, 4);
      x.fillRect(cx, cy, 4, cs);
    });

    // DU Crest / Scales of Justice Emblem
    x.save();
    x.translate(w / 2, 230);
    x.strokeStyle = '#e0b84c';
    x.lineWidth = 3.5;
    // Central pillar
    x.beginPath();
    x.moveTo(0, -40);
    x.lineTo(0, 45);
    x.stroke();
    // Crossbeam
    x.beginPath();
    x.moveTo(-50, -22);
    x.lineTo(50, -22);
    x.stroke();
    // Left scale
    x.beginPath();
    x.moveTo(-50, -22);
    x.lineTo(-65, 12);
    x.lineTo(-35, 12);
    x.closePath();
    x.stroke();
    // Right scale
    x.beginPath();
    x.moveTo(50, -22);
    x.lineTo(65, 12);
    x.lineTo(35, 12);
    x.closePath();
    x.stroke();
    // Base
    x.beginPath();
    x.moveTo(-28, 45);
    x.lineTo(28, 45);
    x.stroke();
    x.restore();

    // Top Institution Banner
    x.fillStyle = '#e8c872';
    x.textAlign = 'center';
    x.font = '600 28px Inter, sans-serif';
    drawSpaced(x, 'FACULTY OF LAW • UNIVERSITY OF DELHI', w / 2, 330, 4);

    // Course Code Badge
    if (o.code) {
      x.fillStyle = 'rgba(224, 184, 76, 0.15)';
      rr(x, w / 2 - 110, 365, 220, 44, 22);
      x.fill();
      x.strokeStyle = 'rgba(224, 184, 76, 0.5)';
      x.lineWidth = 1.5;
      x.stroke();
      x.fillStyle = '#ffd875';
      x.font = '700 24px Inter, sans-serif';
      x.fillText(o.code, w / 2, 396);
    }

    // Book Title in Large Classic Gold/White Serif
    x.fillStyle = '#ffffff';
    x.font = '700 68px Georgia, serif';
    const words = o.title.split(' ');
    let line = '';
    const lines = [];
    words.forEach((word) => {
      const test = line ? line + ' ' + word : word;
      if (x.measureText(test).width > w * 0.78 && line) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);

    const startY = h * 0.48 - ((lines.length - 1) * 82) / 2;
    lines.forEach((l, i) => {
      // Subtle gold drop shadow
      x.fillStyle = 'rgba(0,0,0,0.6)';
      x.fillText(l, w / 2 + 2, startY + i * 82 + 2);
      x.fillStyle = '#ffffff';
      x.fillText(l, w / 2, startY + i * 82);
    });

    // Gold Divider Ribbon
    const divY = startY + lines.length * 82 + 20;
    x.strokeStyle = 'rgba(224, 184, 76, 0.6)';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(w / 2 - 90, divY);
    x.lineTo(w / 2 + 90, divY);
    x.stroke();

    // Author / Edition
    x.fillStyle = '#e5cca0';
    x.font = 'italic 34px Georgia, serif';
    x.fillText(o.author, w / 2, divY + 54);

    x.fillStyle = 'rgba(255, 255, 255, 0.65)';
    x.font = '500 24px Inter, sans-serif';
    x.fillText('ACADEMIC SESSION 2025–2026', w / 2, divY + 98);
  }

  // Paint Leather Spine with Gold Embossed Title
  function paintLawSpine(x, w, h, o) {
    x.fillStyle = o.spineBg || '#183059';
    x.fillRect(0, 0, w, h);

    // Spine Ribs / Raised Bands (5 horizontal bands)
    const bandPositions = [110, 420, 800, 1180, 1420];
    bandPositions.forEach((by) => {
      x.fillStyle = 'rgba(0, 0, 0, 0.35)';
      x.fillRect(0, by - 4, w, 8);
      x.fillStyle = 'rgba(224, 184, 76, 0.7)';
      x.fillRect(16, by - 2, w - 32, 4);
    });

    // Rotated Embossed Spine Title
    x.save();
    x.translate(w / 2, h / 2);
    x.rotate(Math.PI / 2);
    x.fillStyle = o.spineInk || '#ffd875';
    x.font = o.spineFont || '700 36px Georgia, serif';
    drawSpaced(x, o.title.toUpperCase(), 0, 12, 5);

    // Sub-label (Code)
    if (o.code) {
      x.fillStyle = 'rgba(255, 255, 255, 0.85)';
      x.font = '600 24px Inter, sans-serif';
      drawSpaced(x, o.code, 420, 8, 3);
    }
    x.restore();

    // DU Emblem at bottom
    x.fillStyle = 'rgba(224, 184, 76, 0.75)';
    x.font = '700 20px Inter, sans-serif';
    x.textAlign = 'center';
    x.fillText('DU LAW', w / 2, h - 60);
  }

  // Paint Back Cover with Synopsis & Barcode
  function paintLawBack(x, w, h, o) {
    x.fillStyle = o.backBg || '#0e1f3d';
    x.fillRect(0, 0, w, h);

    const ink = o.backInk || '245,238,219';

    // Back summary heading
    x.fillStyle = 'rgba(' + ink + ', 0.9)';
    x.font = '700 32px Georgia, serif';
    x.textAlign = 'left';
    x.fillText('DELHI UNIVERSITY LL.B. CURRICULUM', 130, 210);

    x.fillStyle = 'rgba(' + ink + ', 0.35)';
    x.fillRect(130, 235, w - 260, 2);

    // Simulated paragraph text lines
    x.fillStyle = 'rgba(' + ink + ', 0.2)';
    for (let i = 0; i < 9; i++) {
      const lw = i === 8 ? w - 460 : w - 260 - Math.random() * 80;
      rr(x, 130, 280 + i * 48, lw, 14, 6);
      x.fill();
    }

    // Institutional Seal badge
    x.fillStyle = 'rgba(' + ink + ', 0.35)';
    x.beginPath();
    x.arc(170, h - 190, 36, 0, Math.PI * 2);
    x.fill();

    // Barcode box
    x.fillStyle = '#ffffff';
    rr(x, w - 340, h - 270, 240, 140, 8);
    x.fill();

    x.fillStyle = '#111111';
    let bx = w - 320;
    while (bx < w - 120) {
      const bw = 2 + Math.random() * 5;
      if (Math.random() > 0.4) x.fillRect(bx, h - 250, bw, 88);
      bx += bw + 2 + Math.random() * 4;
    }
    x.font = '600 19px Arial, sans-serif';
    x.textAlign = 'center';
    x.fillText('DU-LLB-2025', w - 220, h - 142);
  }

  // Paint Realistic Book Index / Chapters
  function makeIndexPageTex(chapters) {
    const w = 1024, h = 1536;
    const c = mkCanvas(w, h);
    const x = c.getContext('2d');

    // Parchment texture
    x.fillStyle = '#f6f1e3';
    x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(130, 110, 80, 0.08)';
    for (let i = 0; i < 1800; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);

    // Index Heading
    x.fillStyle = '#261f17';
    x.textAlign = 'center';
    x.font = '700 80px Georgia, serif';
    x.fillText('COURSE SYLLABUS', w / 2, 180);

    x.strokeStyle = 'rgba(180, 140, 70, 0.4)';
    x.lineWidth = 2.5;
    x.beginPath();
    x.moveTo(200, 215);
    x.lineTo(w - 200, 215);
    x.stroke();

    x.fillStyle = '#7a6a50';
    x.font = 'italic 30px Georgia, serif';
    x.fillText('Faculty of Law • Core Units Index', w / 2, 260);

    const list = chapters && chapters.length ? chapters : [
      'Unit 1: Foundational Principles & Constitutional Mandates',
      'Unit 2: Statutory Provisions & Judicial Interpretations',
      'Unit 3: Leading Precedents & Ratio Decidendi',
      'Unit 4: Contemporary Legal Developments & Amendments',
      'Unit 5: Examination Problem Questions & Model Answers'
    ];

    x.textAlign = 'left';
    let y = 350;
    list.forEach((topic, i) => {
      const n = String(i + 1).padStart(2, '0');
      const pageNo = String(10 + i * 28);
      const titleText = trimToWidth(x, `${n}. ${topic}`, 620);

      x.font = '600 40px Georgia, serif';
      x.fillStyle = '#1e1812';
      x.fillText(titleText, 130, y);

      x.font = '500 36px Georgia, serif';
      x.textAlign = 'right';
      x.fillStyle = '#6b5840';
      x.fillText(`p. ${pageNo}`, w - 130, y);
      x.textAlign = 'left';

      // Dotted leader line
      x.strokeStyle = 'rgba(107, 88, 64, 0.2)';
      x.lineWidth = 1.5;
      x.setLineDash([4, 6]);
      x.beginPath();
      x.moveTo(130, y + 18);
      x.lineTo(w - 130, y + 18);
      x.stroke();
      x.setLineDash([]);

      y += 115;
    });

    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = THREE.RepeatWrapping;
    tx.repeat.x = -1;
    tx.offset.x = 1;
    return tx;
  }

  // Spring Physics for tactile 3D movement
  class Spring {
    constructor(v, k, d) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      this.k = k || 120;
      this.d = d || 14;
    }
    set(v) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      return this;
    }
    update(dt) {
      const a = this.k * (this.t - this.v) - this.d * this.vel;
      this.vel += a * dt;
      this.v += this.vel * dt;
      return this.v;
    }
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // =========================================================================
  // 3. MAIN THREE.JS 3D BOOKS SHOWCASE ENGINE
  // =========================================================================
  let containerEl, canvasEl, prevBtn, nextBtn, closeBtn, openSlip, detailPanel;
  let codeBadge, semBadge, detailTitle, detailDesc, unitsCount, yearBadge, actionBtn;
  let onExploreSubjectCallback;

  let renderer, scene, camera;
  let bookRoot;
  let bookInstances = [];
  let hitMeshes = [];
  let activeSemester = 1;
  let animId = null;
  let isPointerDown = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let currentCarouselIndex = 0;
  let selectedBook = null;
  let hoveredBook = null;
  let isMobile = false;
  let raycaster, mouseNorm;

  const dims = { w: 0, h: 0 };
  const W = 1.42, H = 2.14, T = 0.34, CT = 0.032, OV = 0.05;
  const PAGE_N = 8, BACK_PAGE_N = 4, PW = W - 0.02, PH = H - 0.02;
  const BLOCK_D = 0.245, BLOCK_Z = -0.0205, PIVOT_Z = T / 2 + CT / 2, BPIVOT_Z = -(T / 2 + CT / 2), HINGE_OVERLAP = 0.05;

  let coverGeo, blockGeo, pageGeo, spineGeo, hitGeo;
  let striV, striH, endpaperTex, paperFlat, striMatV, striMatH, endpaperMat, pageMats, hitMat;

  function initTextures() {
    // Striated pages texture
    function striationTexture(vertical) {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#ece4d2';
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4;
        const tone = Math.random();
        x.fillStyle = tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2400; i++) {
        x.fillStyle = 'rgba(120,108,84,' + (Math.random() * 0.1).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    striV = striationTexture(true);
    striH = striationTexture(false);

    // Endpaper texture
    const s = 512;
    const c = mkCanvas(s, s);
    const x = c.getContext('2d');
    x.fillStyle = '#f3edde';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < 1200; i++) {
      x.fillStyle = 'rgba(120,105,70,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
      x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
    const g = x.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, 'rgba(0,0,0,.08)');
    g.addColorStop(0.12, 'rgba(0,0,0,0)');
    g.addColorStop(0.88, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,.08)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    endpaperTex = new THREE.CanvasTexture(c);
    endpaperTex.colorSpace = THREE.SRGBColorSpace;

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
    }
    paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
    striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
    pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map((col) =>
      std({ color: col, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide })
    );

    coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    pageGeo = new THREE.PlaneGeometry(PW, PH);
    spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  }

  function buildBook(cfg, index) {
    const root = new THREE.Group();
    const float = new THREE.Group();
    root.add(float);
    bookRoot.add(root);

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
    }

    const indexPageMat = std({
      map: makeIndexPageTex(cfg.chapters),
      roughness: 0.92,
      envMapIntensity: 0.2,
      side: THREE.DoubleSide
    });

    const mEdge = std({ color: cfg.edge || '#eee4cf', roughness: 0.7, envMapIntensity: 0.3 });
    const mFront = std({ roughness: 0.52, envMapIntensity: 0.3 });
    const mBack = std({ roughness: 0.58, envMapIntensity: 0.26 });
    const mSpine = std({ roughness: 0.75, envMapIntensity: 0.22 });

    // Procedural cover textures
    const cFront = mkCanvas(1024, 1536);
    paintLawFront(cFront.getContext('2d'), 1024, 1536, {
      title: cfg.title,
      author: cfg.author,
      code: cfg.code,
      bg: cfg.spineBg || '#183059'
    });
    const tFront = new THREE.CanvasTexture(cFront);
    tFront.colorSpace = THREE.SRGBColorSpace;
    mFront.map = tFront;
    mFront.needsUpdate = true;

    const cBack = mkCanvas(1024, 1536);
    paintLawBack(cBack.getContext('2d'), 1024, 1536, {
      backBg: cfg.backBg || '#0e1f3d',
      backInk: cfg.backInk || '245,238,219'
    });
    const tBack = new THREE.CanvasTexture(cBack);
    tBack.colorSpace = THREE.SRGBColorSpace;
    mBack.map = tBack;
    mBack.needsUpdate = true;

    const cSpine = mkCanvas(220, 1536);
    paintLawSpine(cSpine.getContext('2d'), 220, 1536, {
      spineBg: cfg.spineBg || '#183059',
      spineInk: cfg.spineInk || '#ffd875',
      spineFont: cfg.spineFont || '700 38px Georgia',
      title: cfg.title,
      code: cfg.code
    });
    const tSpine = new THREE.CanvasTexture(cSpine);
    tSpine.colorSpace = THREE.SRGBColorSpace;
    mSpine.map = tSpine;
    mSpine.needsUpdate = true;

    // Back cover assembly
    const backPivot = new THREE.Group();
    backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
    const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
    backMesh.position.x = (W + OV) / 2;
    backMesh.castShadow = backMesh.receiveShadow = true;
    backPivot.add(backMesh);
    float.add(backPivot);

    // Front cover assembly (opens around hinge)
    const pivot = new THREE.Group();
    pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
    const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
    frontMesh.position.x = (W + OV) / 2;
    frontMesh.castShadow = frontMesh.receiveShadow = true;
    pivot.add(frontMesh);
    float.add(pivot);

    // Spine
    const spine = new THREE.Mesh(spineGeo, mSpine);
    spine.position.set(-W / 2 - 0.013, 0, 0);
    spine.castShadow = true;
    float.add(spine);

    // Main page block
    const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
    block.position.set(-0.0075, 0, BLOCK_Z);
    block.castShadow = block.receiveShadow = true;
    float.add(block);

    // Dynamic fanned page leaves
    const pages = [];
    for (let i = 0; i < PAGE_N; i++) {
      const pp = new THREE.Group();
      pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.005, 0.165 - i * 0.0045);
      const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
      pm.position.x = PW / 2;
      pp.add(pm);
      float.add(pp);
      pages.push(pp);
    }

    const pagesB = [];
    for (let i = 0; i < BACK_PAGE_N; i++) {
      const pp = new THREE.Group();
      pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.005, -0.165 + i * 0.0045);
      const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
      pm.position.x = PW / 2;
      pp.add(pm);
      float.add(pp);
      pagesB.push(pp);
    }

    // Raycast hit target
    const hit = new THREE.Mesh(hitGeo, hitMat);
    float.add(hit);
    hitMeshes.push(hit);

    // Springs for 3D tactile animation
    const springs = {
      px: new Spring(0, 18, 7),
      py: new Spring(0, 18, 7),
      pz: new Spring(0, 18, 7),
      rx: new Spring(0, 18, 7),
      ry: new Spring(0, 18, 7),
      rz: new Spring(0, 18, 7),
      sc: new Spring(1, 18, 7),
      tiltX: new Spring(0, 110, 13),
      tiltY: new Spring(0, 110, 13),
      lift: new Spring(0, 110, 13),
      cover: new Spring(0, 85, 12),
      drag: new Spring(0, 150, 15)
    };

    const book = {
      cfg,
      index,
      root,
      float,
      pivot,
      backPivot,
      frontMesh,
      spine,
      block,
      pages,
      pagesB,
      hit,
      springs,
      slotScale: 1
    };

    bookInstances.push(book);
    return book;
  }

  function getSlots(count) {
    const a = dims.w / Math.max(1, dims.h);
    const portrait = a < 0.9;
    isMobile = portrait;

    if (selectedBook) {
      // Detail Open Slot: Book centered on left, facing camera so INDEX page is clearly legible
      return {
        selectedSlot: portrait
          ? { p: [0, 0.55, 0.9], r: [0.04, 0.32, -0.02], s: 0.92 }
          : { p: [-1.45, -0.05, 1.05], r: [0.04, 0.38, -0.02], s: 1.15 }
      };
    }

    // Carousel 3-slot presentation
    if (portrait) {
      const mobScale = dims.w < 380 ? 0.96 : (dims.w < 500 ? 1.05 : 1.15);
      const mobSpacing = dims.w < 380 ? 1.12 : 1.35;
      return [
        { p: [-mobSpacing, -0.42, -0.15], r: [-0.04, 0.42, 0.18], s: mobScale },
        { p: [0.0, -0.15, 0.55], r: [-0.05, -0.08, -0.03], s: mobScale * 1.12 },
        { p: [mobSpacing, -0.46, -0.3], r: [-0.04, -0.42, -0.16], s: mobScale }
      ];
    } else {
      return [
        { p: [-2.15, -0.45, -0.15], r: [-0.04, 0.42, 0.18], s: 1.18 },
        { p: [0.2, -0.22, 0.6], r: [-0.05, -0.08, -0.03], s: 1.32 },
        { p: [2.45, -0.5, -0.3], r: [-0.04, -0.42, -0.16], s: 1.18 }
      ];
    }
  }

  function updateSlots() {
    if (!bookInstances.length) return;
    const total = bookInstances.length;
    const slots = getSlots(total);

    if (selectedBook) {
      const ss = slots.selectedSlot;
      bookInstances.forEach((b) => {
        if (b === selectedBook) {
          b.springs.px.t = ss.p[0];
          b.springs.py.t = ss.p[1];
          b.springs.pz.t = ss.p[2];
          b.springs.rx.t = ss.r[0];
          b.springs.ry.t = ss.r[1];
          b.springs.rz.t = ss.r[2];
          b.slotScale = ss.s;
          b.springs.cover.t = 1.0; // Open cover fully
          b.root.visible = true;
        } else {
          // Send unselected books away and hide them
          b.springs.pz.t = -6;
          b.springs.cover.t = 0;
          b.slotScale = 0.5;
          b.root.visible = false;
        }
      });
      return;
    }

    // Normal Carousel Mode: 3 visible slots
    bookInstances.forEach((b, i) => {
      b.springs.cover.t = 0; // Cover closed
      const diff = (i - currentCarouselIndex + total) % total;

      if (diff === 0) {
        // Center Active Book
        const s = slots[1];
        b.springs.px.t = s.p[0];
        b.springs.py.t = s.p[1];
        b.springs.pz.t = s.p[2];
        b.springs.rx.t = s.r[0];
        b.springs.ry.t = s.r[1];
        b.springs.rz.t = s.r[2];
        b.slotScale = s.s;
        b.root.visible = true;
      } else if (diff === total - 1 || (total === 2 && diff === 1)) {
        // Left Book
        const s = slots[0];
        b.springs.px.t = s.p[0];
        b.springs.py.t = s.p[1];
        b.springs.pz.t = s.p[2];
        b.springs.rx.t = s.r[0];
        b.springs.ry.t = s.r[1];
        b.springs.rz.t = s.r[2];
        b.slotScale = s.s;
        b.root.visible = true;
      } else if (diff === 1) {
        // Right Book
        const s = slots[2];
        b.springs.px.t = s.p[0];
        b.springs.py.t = s.p[1];
        b.springs.pz.t = s.p[2];
        b.springs.rx.t = s.r[0];
        b.springs.ry.t = s.r[1];
        b.springs.rz.t = s.r[2];
        b.slotScale = s.s;
        b.root.visible = true;
      } else {
        // Offscreen books
        b.springs.pz.t = -5;
        b.root.visible = false;
      }
    });
  }

  function shiftCarousel(dir) {
    if (selectedBook || !bookInstances.length) return;
    const total = bookInstances.length;
    currentCarouselIndex = (currentCarouselIndex + dir + total) % total;
    updateSlots();
  }

  function openBook(book) {
    selectedBook = book;
    if (openSlip) openSlip.classList.remove('visible');
    if (closeBtn) closeBtn.classList.add('visible');
    if (prevBtn) prevBtn.style.opacity = '0';
    if (nextBtn) nextBtn.style.opacity = '0';

    // Populate Detail Panel
    if (detailPanel) {
      if (codeBadge) codeBadge.textContent = book.cfg.code || 'DU LAW';
      if (semBadge) semBadge.textContent = `Semester ${activeSemester}`;
      if (detailTitle) detailTitle.textContent = book.cfg.title;
      if (detailDesc) detailDesc.textContent = book.cfg.desc;
      if (unitsCount) unitsCount.textContent = book.cfg.unitsCount || `${book.cfg.chapters.length} Core Units`;
      if (yearBadge) yearBadge.textContent = `Session ${book.cfg.year}`;
      detailPanel.classList.add('visible');
    }

    updateSlots();
  }

  function closeSelectedBook() {
    if (!selectedBook) return;
    selectedBook = null;
    if (closeBtn) closeBtn.classList.remove('visible');
    if (detailPanel) detailPanel.classList.remove('visible');
    if (prevBtn) prevBtn.style.opacity = '1';
    if (nextBtn) nextBtn.style.opacity = '1';
    updateSlots();
  }

  // =========================================================================
  // 4. ANIMATION LOOP
  // =========================================================================
  let lastTime = performance.now();

  function animate(now) {
    animId = requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    bookInstances.forEach((b) => {
      const s = b.springs;

      // Update Springs
      const px = s.px.update(dt) + s.drag.update(dt);
      const py = s.py.update(dt) + s.lift.update(dt);
      const pz = s.pz.update(dt);
      const rx = s.rx.update(dt) + s.tiltX.update(dt);
      const ry = s.ry.update(dt) + s.tiltY.update(dt);
      const rz = s.rz.update(dt);
      const sc = s.sc.update(dt) * b.slotScale;

      b.root.position.set(px, py, pz);
      b.root.rotation.set(rx, ry, rz);
      b.root.scale.setScalar(Math.max(0.01, sc));

      // Book cover opening animation
      const cv = s.cover.update(dt); // 0 (closed) to 1 (open)
      // Front cover rotates open to ~145 deg (2.5 rad)
      b.pivot.rotation.y = -cv * 2.5;

      // Fan the inside pages
      b.pages.forEach((pp, i) => {
        const factor = Math.pow((PAGE_N - i) / PAGE_N, 1.8);
        pp.rotation.y = -cv * (2.2 * factor);
      });

      // Subtle breath when hovered
      if (b === hoveredBook && !selectedBook) {
        s.lift.t = 0.12;
      } else {
        s.lift.t = 0;
      }
    });

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // =========================================================================
  // 5. PUBLIC API & LIFECYCLE
  // =========================================================================
  const DUBooksShowcase = {
    init: function (opts) {
      containerEl = opts.container;
      canvasEl = opts.canvas;
      prevBtn = opts.prevBtn;
      nextBtn = opts.nextBtn;
      closeBtn = opts.closeBtn;
      openSlip = opts.openSlip;
      detailPanel = opts.detailPanel;
      codeBadge = opts.codeBadge;
      semBadge = opts.semBadge;
      detailTitle = opts.detailTitle;
      detailDesc = opts.detailDesc;
      unitsCount = opts.unitsCount;
      yearBadge = opts.yearBadge;
      actionBtn = opts.actionBtn;
      onExploreSubjectCallback = opts.onExploreSubject;

      if (!containerEl || !canvasEl) return;

      dims.w = containerEl.clientWidth || 1000;
      dims.h = containerEl.clientHeight || 650;

      // Three.js Scene, Camera, Renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(26, dims.w / dims.h, 0.1, 100);
      camera.position.set(0, 0.1, 9.6);

      try {
        renderer = new THREE.WebGLRenderer({
          canvas: canvasEl,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        });
      } catch (e) {
        console.warn('Three.js WebGLRenderer init failed', e);
        return;
      }

      renderer.setSize(dims.w, dims.h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Lights
      const hemi = new THREE.HemisphereLight(0x8fa0d8, 0x0d1024, 0.45);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xffffff, 0.95);
      key.position.set(4, 5.5, 6.5);
      key.castShadow = true;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xa9b6ff, 0.3);
      fill.position.set(-4, 1.5, 4);
      scene.add(fill);

      const goldRim = new THREE.DirectionalLight(0xe0b84c, 0.4);
      goldRim.position.set(0, 4, -5);
      scene.add(goldRim);

      bookRoot = new THREE.Group();
      scene.add(bookRoot);

      initTextures();

      raycaster = new THREE.Raycaster();
      mouseNorm = new THREE.Vector2();

      // UI Button Listeners
      if (prevBtn) prevBtn.addEventListener('click', () => shiftCarousel(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => shiftCarousel(1));
      if (closeBtn) closeBtn.addEventListener('click', () => closeSelectedBook());

      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          if (selectedBook && onExploreSubjectCallback) {
            onExploreSubjectCallback(selectedBook.cfg);
          }
        });
      }

      // Pointer Interactivity (Hover tilt, click to open, drag carousel)
      canvasEl.addEventListener('pointermove', (e) => {
        const rect = canvasEl.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        mouseNorm.x = (clientX / dims.w) * 2 - 1;
        mouseNorm.y = -(clientY / dims.h) * 2 + 1;

        if (isPointerDown) {
          dragDeltaX = e.clientX - dragStartX;
          if (Math.abs(dragDeltaX) > 40 && !selectedBook) {
            shiftCarousel(dragDeltaX > 0 ? -1 : 1);
            dragStartX = e.clientX;
            dragDeltaX = 0;
          }
          return;
        }

        if (selectedBook) return;

        raycaster.setFromCamera(mouseNorm, camera);
        const hits = raycaster.intersectObjects(hitMeshes, false);

        if (hits.length > 0) {
          const hit = hits[0].object;
          const found = bookInstances.find((b) => b.hit === hit);
          if (found) {
            hoveredBook = found;
            canvasEl.style.cursor = 'pointer';
            if (openSlip) {
              openSlip.style.left = `${clientX}px`;
              openSlip.style.top = `${clientY - 35}px`;
              openSlip.classList.add('visible');
            }
            return;
          }
        }

        hoveredBook = null;
        canvasEl.style.cursor = 'grab';
        if (openSlip) openSlip.classList.remove('visible');
      });

      canvasEl.addEventListener('pointerdown', (e) => {
        isPointerDown = true;
        dragStartX = e.clientX;
        dragDeltaX = 0;
      });

      window.addEventListener('pointerup', () => {
        isPointerDown = false;
      });

      canvasEl.addEventListener('click', (e) => {
        if (Math.abs(dragDeltaX) > 10) return; // ignore if dragging

        const rect = canvasEl.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        if (dims.w > 0 && dims.h > 0) {
          mouseNorm.x = (clientX / dims.w) * 2 - 1;
          mouseNorm.y = -(clientY / dims.h) * 2 + 1;
        }

        raycaster.setFromCamera(mouseNorm, camera);
        const hits = raycaster.intersectObjects(hitMeshes, false);

        if (hits.length > 0) {
          const hit = hits[0].object;
          const found = bookInstances.find((b) => b.hit === hit);
          if (found) {
            if (onExploreSubjectCallback) {
              onExploreSubjectCallback(found.cfg);
            } else {
              openBook(found);
            }
          }
        }
      });

      // Responsive Resize
      window.addEventListener('resize', () => {
        if (!containerEl || !renderer || !camera) return;
        dims.w = containerEl.clientWidth || 1000;
        dims.h = containerEl.clientHeight || 650;
        camera.aspect = dims.w / dims.h;
        camera.updateProjectionMatrix();
        renderer.setSize(dims.w, dims.h, false);
        updateSlots();
      });

      // Start Animation Loop
      lastTime = performance.now();
      animId = requestAnimationFrame(animate);
    },

    loadSemester: function (semId) {
      activeSemester = parseInt(semId, 10) || 1;
      const booksData = SEMESTER_SUBJECT_BOOKS[activeSemester] || SEMESTER_SUBJECT_BOOKS[1];

      // Clean existing books
      hitMeshes = [];
      bookInstances.forEach((b) => {
        bookRoot.remove(b.root);
      });
      bookInstances = [];
      selectedBook = null;
      hoveredBook = null;
      currentCarouselIndex = 0;

      if (closeBtn) closeBtn.classList.remove('visible');
      if (detailPanel) detailPanel.classList.remove('visible');
      if (openSlip) openSlip.classList.remove('visible');
      if (prevBtn) prevBtn.style.opacity = '1';
      if (nextBtn) nextBtn.style.opacity = '1';

      // Build new books
      booksData.forEach((cfg, idx) => {
        buildBook(cfg, idx);
      });

      updateSlots();
    },

    openBookByIndex: function (idx) {
      if (bookInstances[idx]) {
        openBook(bookInstances[idx]);
      }
    },

    exploreSubjectByIndex: function (idx) {
      if (bookInstances[idx] && onExploreSubjectCallback) {
        onExploreSubjectCallback(bookInstances[idx].cfg);
      }
    },

    closeBook: function () {
      closeSelectedBook();
    },

    destroy: function () {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    }
  };

  window.DUBooksShowcase = DUBooksShowcase;
})();
