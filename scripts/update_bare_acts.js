const fs = require('fs');
const path = require('path');

const bareActsFile = path.join(__dirname, '..', 'js', 'bare_acts.js');
let content = fs.readFileSync(bareActsFile, 'utf8');

// The new sections to add
const newSections = [
  {
    "id": "ca-s135",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "135",
    "title": "Corporate Social Responsibility (CSR)",
    "text": "1. Every company having net worth of ₹500 crore or more, or turnover of ₹1000 crore or more or a net profit of ₹5 crore or more during the immediately preceding financial year shall constitute a Corporate Social Responsibility Committee of the Board consisting of 3 or more directors, at least one of whom shall be an independent director.\n2. The Board shall approve the CSR Policy and ensure that the company spends, in every financial year, at least 2% of the average net profits made during the 3 immediately preceding financial years.\n3. Any unspent CSR amount relating to an ongoing project shall be transferred within 30 days of the end of the financial year to a special Unspent Corporate Social Responsibility Account.",
    "analysis": "Pioneering mandatory corporate philanthropy provision under Indian law. Requires compliance with Schedule VII activities. Disjunctive monetary thresholds. Penalty for non-compliance under S. 135(7): company liable to twice the unspent amount or ₹1 crore (whichever is less), and defaulting officers liable to 1/10th or ₹2 lakh.",
    "keywords": [
      "csr",
      "corporate social responsibility",
      "section 135",
      "2 percent profit",
      "schedule vii",
      "unspent csr account",
      "net worth",
      "turnover",
      "net profit"
    ]
  },
  {
    "id": "ca-s149",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "149",
    "title": "Company to have Board of Directors",
    "text": "1. Every company shall have a Board of Directors consisting of individuals as directors:\n(a) minimum 3 directors in public company, 2 in private company, and 1 in One Person Company;\n(b) maximum 15 directors (can exceed 15 by passing a special resolution).\n2. Prescribed classes of companies shall have at least one woman director.\n3. Every listed public company shall have at least 1/3rd of total directors as independent directors.",
    "analysis": "Foundational provision on board composition. Only individuals can be appointed as directors (no corporate directors). Mandates resident director (stay in India ≥ 182 days) and statutory diversity via women directors. Independent director requirements ensure objective oversight of management.",
    "keywords": [
      "board of directors",
      "minimum directors",
      "maximum directors",
      "independent director",
      "woman director",
      "resident director",
      "special resolution"
    ]
  },
  {
    "id": "ca-s166",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "166",
    "title": "Duties of Directors",
    "text": "1. A director shall act in accordance with the articles of the company.\n2. A director shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole, and in the best interests of the company, its employees, the shareholders, the community and for the protection of environment.\n3. A director shall exercise his duties with due and reasonable care, skill and diligence and shall exercise independent judgment.\n4. A director shall not involve in a situation in which he may have a direct or indirect interest that conflicts with the interest of the company.\n5. A director shall not achieve or attempt to achieve any undue gain or advantage either to himself or to his relatives, partners, or associates.\n6. A director shall not assign his office.",
    "analysis": "Statutory codification of fiduciary duties of directors in India. Codifies principles from Percival v. Wright, Regal (Hastings) Ltd. v. Gulliver, and Industrial Development Consultants Ltd. v. Cooley. Combines shareholder primacy with stakeholder theory (employees, environment, community). Breach attracts fine of ₹1 lakh to ₹5 lakh.",
    "keywords": [
      "duties of directors",
      "fiduciary duty",
      "good faith",
      "reasonable care",
      "conflict of interest",
      "undue gain",
      "stakeholder theory",
      "percival v wright",
      "regal hastings"
    ]
  },
  {
    "id": "ca-s173",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "173",
    "title": "Meetings of Board",
    "text": "1. Every company shall hold the first meeting of the Board of Directors within 30 days of the date of its incorporation and thereafter hold a minimum number of 4 meetings of its Board of Directors every year in such a manner that not more than 120 days shall intervene between two consecutive meetings.\n2. Participation of directors may be in person or through video conferencing.\n3. A meeting of the Board shall be called by giving not less than 7 days' notice in writing.",
    "analysis": "Governs board operations and minimum meeting frequency (4 per year, max gap 120 days). Authorizes modern video-conferencing technology. Urgent board meetings permitted with shorter notice if at least one independent director is present.",
    "keywords": [
      "board meeting",
      "video conferencing",
      "notice of meeting",
      "120 days gap",
      "quorum"
    ]
  },
  {
    "id": "ca-s184",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "184",
    "title": "Disclosure of Interest by Director",
    "text": "1. Every director shall at the first meeting of the Board in which he participates as a director and thereafter at the first meeting in every financial year disclose his concern or interest in any company or body corporate or firm by giving a notice in writing in Form MBP-1.\n2. Every director interested or concerned in any contract or arrangement shall disclose the nature of his interest at the meeting of the Board in which the contract is discussed and shall not participate in such meeting.",
    "analysis": "Statutory safeguard against self-dealing and undisclosed conflicts of interest. Interested director cannot vote or be counted in the quorum for that transaction. Contracts entered in violation are voidable at the option of the company.",
    "keywords": [
      "disclosure of interest",
      "interested director",
      "form mbp-1",
      "conflict of interest",
      "voidable contract"
    ]
  },
  {
    "id": "ca-s241",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "241",
    "title": "Application to Tribunal for Relief in Cases of Oppression, etc.",
    "text": "1. Any member of a company who complains that—\n(a) the affairs of the company have been or are being conducted in a manner prejudicial to public interest or in a manner prejudicial or oppressive to him or any other member or members or in a manner prejudicial to the interests of the company; or\n(b) the bringing about of a material change in the management or control of the company is prejudicial to the interests of members,\nmay apply to the Tribunal for an order under this Chapter.",
    "analysis": "The cornerstone minority protection provision. Replaced Ss. 397/398 of 1956 Act. Conduct must be continuous, harsh, burdensome, and wrongful (Shanti Prasad Jain v. Kalinga Tubes; Needle Industries v. Needle Industries Newey; Tata Consultancy Services v. Cyrus Investments). Central Government may also initiate proceedings under S. 241(2).",
    "keywords": [
      "oppression",
      "mismanagement",
      "section 241",
      "nclt application",
      "prejudicial to public interest",
      "shanti prasad jain",
      "needle industries",
      "cyrus mistry"
    ]
  },
  {
    "id": "ca-s242",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "242",
    "title": "Powers of Tribunal",
    "text": "1. If on any application under Section 241, the Tribunal is of opinion that—\n(a) the company's affairs have been or are being conducted in a manner prejudicial to public interest or oppressive to any member; and\n(b) to wind up the company would unfairly prejudice such member or members, but that otherwise the facts would justify the making of a winding-up order on just and equitable grounds,\nthe Tribunal may make such order as it thinks fit with a view to bringing to an end the matters complained of.\n2. Order may provide for regulation of conduct of company affairs, purchase of shares of any members by other members, restrictions on transfer, removal or appointment of directors.",
    "analysis": "Alternative to winding up. Confers wide equitable discretion upon NCLT to craft remedial orders without killing the company. Dual test: facts must justify just & equitable winding up, but winding up would unfairly prejudice the applicant.",
    "keywords": [
      "powers of tribunal",
      "remedial order",
      "nclt",
      "alternative to winding up",
      "just and equitable",
      "purchase of shares",
      "removal of director"
    ]
  },
  {
    "id": "ca-s244",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "244",
    "title": "Right to Apply under Section 241 (Eligibility Thresholds)",
    "text": "1. The following members shall have the right to apply under Section 241:\n(a) in the case of a company having a share capital, not less than 100 members or not less than 1/10th of the total number of its members, whichever is less, or any member or members holding not less than 1/10th of the issued share capital of the company;\n(b) in the case of a company not having a share capital, not less than 1/5th of the total number of its members.\nProvided that the Tribunal may, on an application made to it in this behalf, waive all or any of the requirements specified in clause (a) or (b).",
    "analysis": "Statutory locus standi filter to prevent frivolous litigation by isolated shareholders. Crucial proviso empowers NCLT to waive the numerical threshold in meritorious cases (Tata Consultancy Services v. Cyrus Investments Pvt. Ltd.). Fully paid calls are a mandatory prerequisite.",
    "keywords": [
      "eligibility threshold",
      "right to apply",
      "section 244",
      "100 members",
      "one tenth voting power",
      "waiver power",
      "cyrus mistry"
    ]
  },
  {
    "id": "ca-s245",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "245",
    "title": "Class Action Suits",
    "text": "1. Such number of member or members, depositor or depositors or any class of them, as the case may be, may, if they are of the opinion that the management or conduct of the affairs of the company are being conducted in a manner prejudicial to the interests of the company or its members or depositors, file an application before the Tribunal on behalf of the members or depositors for seeking orders to restrain fraudulent conduct or claiming damages.",
    "analysis": "Introduced in India post-Satyam scam. Empowers minority shareholders and depositors to initiate collective action against the company, directors, auditors, or experts for fraudulent, unlawful, or wrongful conduct and claim restitution or damages.",
    "keywords": [
      "class action",
      "section 245",
      "depositors",
      "satyam scam",
      "damages against auditors",
      "restrain fraudulent conduct"
    ]
  },
  {
    "id": "ca-s271",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "271",
    "title": "Circumstances in which Company may be Wound up by Tribunal",
    "text": "A company may, on a petition under Section 272, be wound up by the Tribunal:—\n(a) if the company has, by special resolution, resolved that the company be wound up by the Tribunal;\n(b) if the company has acted against the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality;\n(c) if on an application made by the Registrar or any other person authorised by the Central Government, the Tribunal is of opinion that the affairs of the company have been conducted in a fraudulent manner;\n(d) if the company has made a default in filing with the Registrar its financial statements or annual returns for immediately preceding 5 consecutive financial years;\n(e) if the Tribunal is of the opinion that it is just and equitable that the company should be wound up.",
    "analysis": "Primary statutory grounds for tribunal winding up. Sub-clause (e) (Just and equitable) is of premier importance for DU exams: failure of substratum (German Date Coffee), deadlock in private quasi-partnership companies (Yenidje Tobacco; Ebrahimi v. Westbourne Galleries), lack of probity of directors (Loch v. John Blackwood), and fraud in company formation (Devas Multimedia). Note: Inability to pay debts has been transferred exclusively to the IBC 2016.",
    "keywords": [
      "winding up by tribunal",
      "section 271",
      "just and equitable",
      "failure of substratum",
      "deadlock",
      "german date coffee",
      "yenidje tobacco",
      "ebrahimi",
      "sovereignty of india"
    ]
  },
  {
    "id": "ca-s408",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "408",
    "title": "Constitution of National Company Law Tribunal (NCLT)",
    "text": "The Central Government shall, by notification, constitute, with effect from such date as may be specified therein, a Tribunal to be known as the National Company Law Tribunal consisting of a President and such number of Judicial and Technical members as the Central Government may deem necessary, to exercise and discharge such powers and functions as are, or may be, conferred on it by or under this Act or any other law for the time being in force.",
    "analysis": "Constitutional authority establishing the specialist company law tribunal. Operates from 1 June 2016. Replaced Company Law Board (CLB) and High Court company jurisdiction. Constitutional validity upheld with institutional independence safeguards in Union of India v. R. Gandhi (2010) and Madras Bar Association v. Union of India (2015).",
    "keywords": [
      "nclt",
      "national company law tribunal",
      "section 408",
      "madras bar association",
      "r gandhi",
      "judicial member",
      "technical member"
    ]
  },
  {
    "id": "ca-s410",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "410",
    "title": "Constitution of Appellate Tribunal (NCLAT)",
    "text": "The Central Government shall, by notification, constitute, with effect from such date as may be specified therein, an Appellate Tribunal to be known as the National Company Law Appellate Tribunal consisting of a chairperson and such number of Judicial and Technical Members, not exceeding eleven, as the Central Government may deem fit, for hearing appeals against the orders of the Tribunal.",
    "analysis": "Establishes specialist appellate forum. Hears appeals from NCLT orders (S. 421) and Competition Commission of India (CCI) orders. Appeal lies to Supreme Court on substantial questions of law under Section 423.",
    "keywords": [
      "nclat",
      "appellate tribunal",
      "section 410",
      "appeals",
      "supreme court appeal",
      "section 421",
      "section 423"
    ]
  },
  {
    "id": "ca-s430",
    "actId": "ca",
    "act": "Companies Act, 2013",
    "sec": "430",
    "title": "Civil Court not to have Jurisdiction",
    "text": "No civil court shall have jurisdiction to entertain any suit or proceeding in respect of any matter which the Tribunal or the Appellate Tribunal is empowered to determine by or under this Act or any other law for the time being in force and no injunction shall be granted by any court or other authority in respect of any action taken or to be taken in pursuance of any power conferred by or under this Act.",
    "analysis": "Statutory exclusion of civil courts to ensure specialist tribunal primacy. Bars civil suits on oppression, mismanagement, alteration of capital, and winding up. Does not bar constitutional writ jurisdiction of High Courts under Article 226 (Embassy Property Developments v. State of Karnataka).",
    "keywords": [
      "bar of civil courts",
      "section 430",
      "ouster of jurisdiction",
      "article 226",
      "embassy property developments"
    ]
  }
];

// Load into node runtime
const window = {};
eval(content);

// Find CA act entry in acts array and update count
const caAct = window.BARE_ACTS_DB.acts.find(a => a.id === 'ca');
if (caAct) {
  // Check how many sections for 'ca' exist already
  const existingCa = window.BARE_ACTS_DB.sections.filter(s => s.actId === 'ca');
  console.log(`Existing CA sections in DB: ${existingCa.length}`);

  // Append new sections that don't already exist
  newSections.forEach(sec => {
    if (!window.BARE_ACTS_DB.sections.some(s => s.id === sec.id)) {
      window.BARE_ACTS_DB.sections.push(sec);
    }
  });

  const totalCa = window.BARE_ACTS_DB.sections.filter(s => s.actId === 'ca').length;
  caAct.count = totalCa;
  console.log(`Updated CA total sections in DB: ${totalCa}`);
}

// Re-serialize bare_acts.js
const updatedBareActs = `/**
 * Delhi University Law Notes Portal — Statutory Database & Bare Act Registry
 * Quick Reference for Indian Contract Act, Bharatiya Nyaya Sanhita (BNS),
 * Hindu Marriage Act, HAMA, HMGA, Consumer Protection Act, and Companies Act.
 */
window.BARE_ACTS_DB = ${JSON.stringify(window.BARE_ACTS_DB, null, 2)};

// Helper utilities for Bare Act lookup and search
window.BARE_ACTS_DB.findSection = function(actIdOrCode, sec) {
  if (!sec) return null;
  const cleanSec = String(sec).trim().toLowerCase();
  const cleanAct = actIdOrCode ? String(actIdOrCode).trim().toLowerCase() : '';
  
  return this.sections.find(s => {
    const actMatch = !cleanAct || 
      s.actId.toLowerCase() === cleanAct || 
      s.act.toLowerCase().includes(cleanAct) || 
      (s.keywords && s.keywords.some(k => k.toLowerCase() === cleanAct));
    const secMatch = s.sec.toLowerCase() === cleanSec || 
      s.sec.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSec.replace(/[^a-z0-9]/g, '') ||
      s.id.toLowerCase().endsWith(cleanSec);
    return actMatch && secMatch;
  });
};

window.BARE_ACTS_DB.search = function(query, filterActId) {
  if (!query && (!filterActId || filterActId === 'all')) return this.sections;
  const q = (query || '').toLowerCase().trim();
  const act = filterActId && filterActId !== 'all' ? filterActId.toLowerCase() : null;

  return this.sections.filter(s => {
    if (act && s.actId.toLowerCase() !== act) return false;
    if (!q) return true;
    
    // Check section number
    if (s.sec.toLowerCase().includes(q)) return true;
    // Check title
    if (s.title.toLowerCase().includes(q)) return true;
    // Check text
    if (s.text.toLowerCase().includes(q)) return true;
    // Check analysis
    if (s.analysis.toLowerCase().includes(q)) return true;
    // Check keywords
    if (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q))) return true;
    
    return false;
  });
};
`;

fs.writeFileSync(bareActsFile, updatedBareActs, 'utf8');
console.log('✓ Successfully updated js/bare_acts.js with 13 comprehensive Companies Act sections!');
