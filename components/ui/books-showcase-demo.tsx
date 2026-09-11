import { useState } from "react";
import { BooksShowcase, BookCfg } from "@/components/ui/books-showcase";

/**
 * All Delhi University LL.B. Subjects across all 6 semesters,
 * formatted as 3D Hardbound Books for the BooksShowcase component.
 */
export const SEMESTER_SUBJECT_BOOKS: Record<number, BookCfg[]> = {
  1: [
    {
      id: "juris",
      title: "Jurisprudence–I",
      author: "LB-106 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
      desc: "Legal Method, Bharatiya Jurisprudence, Vedic environmental ethics, major legal systems & sources of law.",
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
      title: "Law of Contract",
      author: "LB-103 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
      desc: "General Principles of Contract (Ss. 1–75), formation, consideration, free consent, breach & Specific Relief Act 1963.",
      spineBg: "#4a2a18",
      spineInk: "#f9d784",
      spineFont: "700 38px Georgia",
      backBg: "#2e190e",
      backInk: "249,215,132",
      edge: "#ece3cf",
      chapters: [
        "Formation of Contract & Communication",
        "Consideration & Capacity of Parties",
        "Free Consent, Coercion & Fraud",
        "Void Agreements & Contingent Contracts",
        "Discharge, Breach & Specific Relief Act"
      ]
    },
    {
      id: "bns",
      title: "Law of Crimes (IPC & BNS)",
      author: "LB-102 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Family Law–I (Hindu Law)",
      author: "LB-104 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Law of Torts & CPA",
      author: "LB-105 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
      desc: "Civil Wrongs, Strict & Absolute Liability, Vicarious Liability, Negligence & Consumer Protection Act 2019.",
      spineBg: "#1a4731",
      spineInk: "#c6f6d5",
      spineFont: "700 38px Georgia",
      backBg: "#0c281b",
      backInk: "198,246,213",
      edge: "#dbece2",
      chapters: [
        "Nature & Principles of Tortious Liability",
        "General Defences & Justification",
        "Vicarious Liability of State & Master-Servant",
        "Negligence, Nuisance & Defamation",
        "Strict/Absolute Liability & Consumer Protection Act"
      ]
    }
  ],
  2: [
    {
      id: "crimes2",
      title: "Law of Crimes–II (CrPC & BNSS)",
      author: "LB-201 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
      desc: "Criminal Procedure Code 1973 & BNSS 2023: Arrest, Investigation, FIR, Bail, Trial & Judgment.",
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
      title: "Constitutional Law–I",
      author: "LB-202 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Property Law",
      author: "LB-203 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Public International Law",
      author: "LB-204 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Family Law–II (Muslim Law)",
      author: "LB-205 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Civil Procedure & Limitation",
      author: "LB-301 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Company Law",
      author: "LB-303 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "White Collar Crimes",
      author: "LB-3037 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      id: "consti2",
      title: "Constitutional Law–II",
      author: "LB-302 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Special Contracts",
      author: "LB-304 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Administrative Law",
      author: "LB-404 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Labour Law–I",
      author: "LB-401 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Alternative Dispute Resolution",
      author: "LB-402 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Law of Evidence (BSA & IEA)",
      author: "LB-403 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
        "Burden of Proof, Estoppel & Examination of Witnesses"
      ]
    },
    {
      id: "taxation",
      title: "Corporate Taxation & GST",
      author: "LB-404 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
      desc: "Income Tax Act 1961, Residential Status, Corporate Tax Rates, Capital Gains & GST Architecture.",
      spineBg: "#19283f",
      spineInk: "#fed17e",
      spineFont: "700 38px Georgia",
      backBg: "#0d1624",
      backInk: "254,209,126",
      edge: "#efe7d6",
      chapters: [
        "Basic Concepts & Residential Status of Companies",
        "Profits and Gains of Business or Profession (PGBP)",
        "Capital Gains & Set-off of Losses",
        "Deductions, Assessment & Corporate Surcharges",
        "GST Constitutional Framework & Input Tax Credit"
      ]
    },
    {
      id: "gender",
      title: "Gender Justice & Law",
      author: "LB-405 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Environmental Law",
      author: "LB-501 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Intellectual Property Rights",
      author: "LB-502 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
        "Trade Marks: Distinctiveness, Deceptive Similarity",
        "IPR Enforcement, Injunctions & Counterfeiting Remedies"
      ]
    },
    {
      id: "taxprinciples",
      title: "Principles of Taxation",
      author: "LB-503 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Human Rights Law",
      author: "LB-504 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Cyber Law & IT Act",
      author: "LB-505 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Drafting & Conveyancing",
      author: "LB-601 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Moot Court & Advocacy",
      author: "LB-602 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Professional Ethics & Bar",
      author: "LB-603 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "International Trade Law",
      author: "LB-604 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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
      title: "Insolvency Code (IBC)",
      author: "LB-605 • Faculty of Law, DU",
      year: "2025–26",
      stars: 5,
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

export function BooksShowcaseDemo() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const currentBooks = SEMESTER_SUBJECT_BOOKS[selectedSemester] || SEMESTER_SUBJECT_BOOKS[1];

  return (
    <div className="relative h-[680px] w-full flex flex-col bg-[#080b18] text-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Semester Switcher Tabs */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-wider uppercase text-amber-400">
            DU Law Faculty
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            3D Books Showcase
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
          {[1, 2, 3, 4, 5, 6].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                selectedSemester === sem
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/30 scale-105"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Three.js Interactive Books Showcase */}
      <div className="flex-1 w-full min-h-0 relative">
        <BooksShowcase
          key={`sem-${selectedSemester}`}
          books={currentBooks}
          heroTitle={`Semester ${selectedSemester}`}
          navTitle={`LL.B. Semester ${selectedSemester} • Core Subjects`}
          className="min-h-0"
        />
      </div>
    </div>
  );
}

export default BooksShowcaseDemo;
