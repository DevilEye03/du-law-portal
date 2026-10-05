const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const splDir = path.join(rootDir, 'sem 3', 'spl contract');

function unescapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  if (!html) return '';
  return unescapeHtml(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function convertTablesToMarkdown(html) {
  if (!html) return '';
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableBody) => {
    const rows = [...tableBody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    let out = '\n';
    rows.forEach(r => {
      const cells = [...r[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map(c => stripHtml(c[1]));
      out += '| ' + cells.join(' | ') + ' |\n';
    });
    return out + '\n';
  });
}

function cleanMarkdown(html) {
  if (!html) return '';
  let str = convertTablesToMarkdown(html);
  str = unescapeHtml(
    str
      .replace(/<span\s+class="lb"[^>]*>[\s\S]*?<\/span>/gi, '')
      .replace(/<div\s+class="lb"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div\s+class="mob-hint"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
  return str;
}

function extractDivBlock(html, startPos) {
  let depth = 0;
  let pos = startPos;
  while (pos < html.length) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      pos = nextClose + 6;
      if (depth === 0) {
        return {
          start: startPos,
          end: pos,
          outerHtml: html.slice(startPos, pos)
        };
      }
    }
  }
  return null;
}

console.log('====================================================');
console.log('🚀 MAKE LAW EASY — SPECIAL CONTRACTS INGESTION');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// STEP 1: RESPONSIVE ENGINE & ANCHOR INJECTION FOR THE 8 DOSSIERS
// -----------------------------------------------------------------------------
const RESPONSIVE_ENGINE_CSS = `
/* ==========================================================================
   MAKE LAW EASY — UNIVERSAL OMNI-RESPONSIVE ENGINE (320px - 768px)
   Applied to EVERY Topic of EVERY Subject of EVERY Semester
   100% Mobile Responsive: Zero Side Margins, Zero Viewport Wobble,
   100% Full Visibility for All Diagrams, Flowcharts, Grids, and Tables
   ========================================================================== */
@media screen and (max-width: 768px) {
  /* 1. ROOT & VIEWPORT LOCK: ZERO HORIZONTAL WOBBLE (Rule 3) */
  html, body {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
    font-size: 15px !important;
    line-height: 1.6 !important;
    -webkit-text-size-adjust: 100% !important;
  }

  *, *::before, *::after {
    box-sizing: border-box !important;
  }

  /* 2. RECLAIM ALL WASTED SIDE MARGINS ACROSS ALL CONTAINER TYPES */
  .wrap, .page, .layout, .container, .page-wrap, main, article, .dossier,
  .content, .shell, .inner, .cover, .cover-in, .cover-content, .topbar-inner,
  .quicknav-inner, .paper, .note-container, .notes-body, .reading-container,
  .syllabus-container, .toc-container, .wrapper, .site-main, .main-wrap,
  .doc-wrapper, .document-body, .notes-content, .revision-wrap, .exam-wrap,
  .firac-wrapper, .briefs-container, .pyq-wrap, .deck, section.card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    box-sizing: border-box !important;
  }

  /* 3. HERO & HEADERS: ZERO MARGIN OVERFLOW */
  header, header.hero, .hero, .header, .topbar, .cover, .banner, .title-card,
  .title-block, .topic-header, .subject-banner, .part-head, .part-band {
    width: 100% !important;
    max-width: 100% !important;
    padding: 24px 14px 18px !important;
    border-radius: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    box-sizing: border-box !important;
  }

  header.hero h1, .hero h1, .header h1, h1 {
    font-size: clamp(20px, 5.8vw, 27px) !important;
    line-height: 1.25 !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    margin: 8px 0 !important;
  }

  /* 4. EXPANDABLE DETAILS, ACCORDIONS, CALLOUTS, CARDS & CASES */
  details, .card, .case, .q, .pyq, .box, .callout, .warnbox, .okbox,
  .info-box, .statute, .statute-card, .note, .tip, .exam-tip, .def, .defbox,
  .highlight, .highlight-box, .rule-box, .quote, blockquote, .card-body,
  .case-card, .part-body, .timeline-item, .capsule, .analysis-box, .summary-box,
  .ans, .model-answer, .qt, .qh, .solution, .judges-box, .facts, .issues, .ratio,
  .princ, .exam-card, .bare-act-box, .illustration-box, .provision-card,
  .procedure-card, .precedent-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 12px 10px !important;
    border-radius: 10px !important;
    box-sizing: border-box !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }

  /* 5. TYPOGRAPHY & LISTS */
  .part-head .num, .part-band .num, .num, .bno, .cno, .sno {
    width: 32px !important;
    height: 32px !important;
    font-size: 14px !important;
    margin-right: 8px !important;
    border-radius: 8px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }

  h2 {
    font-size: clamp(17px, 4.8vw, 22px) !important;
    line-height: 1.28 !important;
    margin: 18px 0 8px !important;
    word-break: break-word !important;
  }

  h3 {
    font-size: clamp(15px, 4.2vw, 19px) !important;
    line-height: 1.3 !important;
    margin: 14px 0 6px !important;
    word-break: break-word !important;
  }

  h4 {
    font-size: clamp(13.5px, 3.8vw, 16.5px) !important;
    line-height: 1.35 !important;
    margin: 10px 0 4px !important;
    word-break: break-word !important;
  }

  p, li {
    font-size: 14.5px !important;
    line-height: 1.58 !important;
    text-align: left !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  ul, ol {
    padding-left: 20px !important;
    margin: 6px 0 10px !important;
  }

  /* 6. DIAGRAMS & SVGS: 100% FULL VISIBILITY & CONTAINMENT */
  .fig, .figure, .scene, .svgwrap, figure, .case-visual, .diagram-wrap, .flow-svg,
  .diagram-frame, .diagram-box, .svgbox, .dia, .fchart, .svg-flow {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
    background: var(--card, #ffffff) !important;
    border: 1px solid var(--line, #e2e8f0) !important;
    border-radius: 10px !important;
    padding: 8px 4px !important;
    margin: 12px 0 !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 6px rgba(0,0,0,0.04) !important;
  }

  svg, .fig svg, .figure svg, .scene svg, .svgwrap svg, .flow-svg svg, .flow svg,
  svg.diagram, .svgbox svg, .diagram-box svg, .diagram-frame svg, .case-visual svg,
  .fchart svg, .svg-flow svg,
  svg[width]:not(.icon):not([width="18"]):not([width="20"]):not([width="24"]) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    height: auto !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
  }

  .fig .cap, .fig .caption, .fcap, .scene .badge, .scene .cap, .diagram-title, .diagram-hint {
    display: block !important;
    font-size: 11.5px !important;
    line-height: 1.4 !important;
    font-weight: 600 !important;
    text-align: center !important;
    margin: 4px auto 6px !important;
    color: var(--sub, #4a5a6a) !important;
    white-space: normal !important;
    word-break: break-word !important;
    max-width: 95% !important;
  }

  /* 7. CSS FLOWCHARTS & TIMELINES ACROSS ALL SUBJECTS */
  .flow:not(.flow-svg):not(:has(svg)), .fchart:not(:has(svg)), .vflow, .flowcol {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    gap: 8px !important;
    padding: 10px 6px !important;
    margin: 12px 0 !important;
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 10px !important;
  }

  .flow .node, .flow > .node, .flow.horizontal .node, .fbox, .fnode, .fstep,
  .arch-node, .flow-step, .step-card {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    box-sizing: border-box !important;
    margin: 2px 0 !important;
    padding: 10px 10px !important;
    font-size: 12.5px !important;
    line-height: 1.45 !important;
    text-align: center !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  .flow .node small, .flow > .node small, .fbox small {
    display: block !important;
    font-size: 11px !important;
    line-height: 1.35 !important;
    margin-top: 3px !important;
  }

  .flow .ar, .flow span.ar, .flow > .ar, .arrow, .flow .arrow {
    display: block !important;
    text-align: center !important;
    margin: 2px auto !important;
    font-size: 18px !important;
    line-height: 1 !important;
    color: var(--accent, #78350f) !important;
  }

  .flow .ar::before, .flow span.ar::before {
    content: "↓" !important;
  }

  .split, .branches, .frow, .fork {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  .branch, .frow .fbox, .fork .fbox {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* 8. COLLAPSE ALL MULTI-COLUMN GRIDS INTO CLEAN SINGLE COLUMN */
  .grid, .grid2, .grid3, .grid4, .g2, .g3, .two-col, .twocol, .two, .three,
  .four, .two-up, .three-up, .remedy-grid, .test-grid, .revision-grid,
  .vs, .kv, .cgrid, .arg2, .comparison, .step-grid, .timeline, .statute-grid,
  .def-grid, .defgrid, .vs-split, .quick-grid, .three-col, .four-col, .rule-grid,
  .memory-grid, .arg-grid, .cover-grid, .two-col-doc, .cmp, .checkgrid,
  .case-grid, .cols, .args, .decision, .side, .story, .clause-grid, .source-grid {
    display: flex !important;
    flex-direction: column !important;
    grid-template-columns: 1fr !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    gap: 10px !important;
    box-sizing: border-box !important;
  }

  .vs > div, .cmp > div {
    border-right: none !important;
    border-bottom: 1px solid var(--line, #dfe6ec) !important;
    width: 100% !important;
  }

  /* 9. ALL TABLES: RESPONSIVE HORIZONTAL SCROLL & CELL TEXT BREAKING */
  .tblwrap, .tbl-scroll, .twrap, .tbl-wrap, .table-wrap, .tw, .scroll, .table-container {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    box-sizing: border-box !important;
    margin: 10px 0 !important;
  }

  .twrap table, .tblwrap table, .table-wrap table, .tbl-scroll table, .tw table {
    display: table !important;
    width: 100% !important;
    min-width: 480px !important;
    max-width: none !important;
    border-collapse: collapse !important;
    box-sizing: border-box !important;
  }

  table:not(.twrap table):not(.tblwrap table):not(.table-wrap table) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    border-collapse: collapse !important;
    margin: 10px 0 !important;
    box-sizing: border-box !important;
  }

  th, td {
    padding: 7px 7px !important;
    font-size: 12.5px !important;
    line-height: 1.4 !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* 10. PRE & CODE BLOCKS */
  pre, code, pre code, .stat, .mnem {
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    font-size: 12px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
    box-sizing: border-box !important;
  }
}
/* END MAKE LAW EASY — UNIVERSAL OMNI-RESPONSIVE ENGINE */
`;

const fileConfigs = [
  {
    file: 'topic1_agency_partnership.html',
    unit: 1,
    title: 'Unit 1: Concept of Agency & The Nature of Partnership',
    subtitle: 'Topic 1 – Agency Fundamentals, Nature of Partnership, Mutual Agency & The Real Relation Test (Cox v. Hickman, Mollwo March, K.D. Kamath) | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Indian Partnership Act, 1932 (Ss. 4, 5, 6, 8)',
      'Indian Contract Act, 1872 (Ss. 182–238)'
    ],
    topics: [
      'Concept of Agency: Definition, Creation & Legal Relations (Ss. 182–189 ICA)',
      'Definition & Essential Elements of Partnership under S. 4',
      'Distinction between Partnership, Co-ownership, Joint Hindu Family & Company',
      'Mode of Determining Existence of Partnership: S. 6 Real Relation Test',
      'Sharing of Profits vs Conclusive Test of Mutual Agency (Cox v. Hickman & Mollwo March)',
      'Concentration of Management Powers in One Partner: K.D. Kamath & Co. v. CIT'
    ]
  },
  {
    file: 'topic2_relations_of_partners.html',
    unit: 2,
    title: 'Unit 2: Relations of Partners to One Another and to Third Parties',
    subtitle: 'Topic 2 – Relations of Partners: General Duties, Partnership Property, Implied Authority & Holding Out | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Indian Partnership Act, 1932 (Ss. 9–30)'
    ],
    topics: [
      'General Duties of Partners: Greatest Common Advantage, Just & Faithful, Duty to Account (Ss. 9–10)',
      'Mutual Rights & Liabilities of Partners (Ss. 11–13)',
      'Partnership Property & Its Determination: S. 14 (Miles v. Clarke & Birendra Chandra)',
      'Doctrine of Implied Authority of a Partner: Scope & Statutory Restrictions (Ss. 18–20)',
      'Liability of Firm for Wrongs & Misapplication by Partner (Ss. 25–27)',
      'Doctrine of Holding Out / Estoppel: S. 28 & Rights of Transferee of Partner’s Interest (S. 29)'
    ]
  },
  {
    file: 'topic3_incoming_outgoing_registration.html',
    unit: 3,
    title: 'Unit 3: Incoming & Outgoing Partners and Registration of a Firm',
    subtitle: 'Topic 3 – Incoming & Outgoing Partners: Retirement, Expulsion, Insolvency & Registration of Firms (S. 69 Bar on Suits) | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Indian Partnership Act, 1932 (Ss. 31–38, 56–71)'
    ],
    topics: [
      'Introduction of New Partner (S. 31) & Retirement of Partner (S. 32)',
      'Expulsion of Partner: Good Faith & Natural Justice Requirements (S. 33)',
      'Insolvency & Death of Partner: Effects on Firm & Personal Estate (Ss. 34–35)',
      'Rights of Outgoing Partner to Competing Business & Share of Subsequent Profits (Ss. 36–37)',
      'Registration of Firms: Procedure & Evidentiary Value of Register (Ss. 58–68)',
      'Effects of Non-Registration: Section 69 Bar on Suits & Statutory Exceptions'
    ]
  },
  {
    file: 'topic4_dissolution_of_firm.html',
    unit: 4,
    title: 'Unit 4: Dissolution of a Firm',
    subtitle: 'Topic 4 – Dissolution of Firm: Modes of Dissolution, Judicial Intervention, Winding Up & Settlement of Accounts | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Indian Partnership Act, 1932 (Ss. 39–55)'
    ],
    topics: [
      'Dissolution of Firm vs Dissolution of Partnership (S. 39)',
      'Dissolution by Agreement, Compulsory Dissolution & Contingent Dissolution (Ss. 40–42)',
      'Dissolution by Notice in Partnership at Will (S. 43)',
      'Dissolution by Court under S. 44: Insanity, Permanent Incapacity, Misconduct & Just and Equitable Grounds',
      'Continuing Authority of Partners for Winding Up & Liability of Partners after Dissolution (Ss. 45–47)',
      'Mode of Settling Accounts & Application of Firm Assets (Ss. 48–49, 55)'
    ]
  },
  {
    file: 'topic5_formation_contracts_sale.html',
    unit: 5,
    title: 'Unit 5: Formation of Contracts of Sale',
    subtitle: 'Topic 5 – Formation of Contracts of Sale: Sale vs Agreement to Sell, Subject-Matter, Ascertainment of Price & Formalities | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Sale of Goods Act, 1930 (Ss. 4–10)'
    ],
    topics: [
      'Concept of Contract of Sale: Sale and Agreement to Sell (S. 4)',
      'Distinction between Sale, Hire-Purchase, Contract for Work and Labour & Bailment',
      'Subject-Matter of Contract: Existing Goods, Future Goods & Contingent Goods (S. 6)',
      'Goods Perishing before Making of Contract (S. 7) & Perishing before Sale but after Agreement to Sell (S. 8)',
      'Ascertainment of Price & Agreement to Sell at Valuation (Ss. 9–10)'
    ]
  },
  {
    file: 'topic6_conditions_warranties.html',
    unit: 6,
    title: 'Unit 6: Conditions and Warranties',
    subtitle: 'Topic 6 – Conditions and Warranties: Stipulations, Caveat Emptor & Implied Conditions as to Quality and Fitness | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Sale of Goods Act, 1930 (Ss. 11–17)'
    ],
    topics: [
      'Stipulations as to Time (S. 11) & Condition vs Warranty: The Essential Tests (S. 12)',
      'When Condition May be Treated as Warranty: Waiver & Compulsory Acceptance (S. 13)',
      'Implied Undertaking as to Title, Quiet Possession & Freedom from Encumbrance (S. 14)',
      'Sale by Description & Sale by Sample (Ss. 15 & 17)',
      'The Rule of Caveat Emptor & Its Progressive Judicial Erosion (S. 16)',
      'Implied Conditions as to Quality, Fitness & Merchantable Quality: Priest v. Last & Grant v. AKM (S. 16(1) & (2))'
    ]
  },
  {
    file: 'topic7_effects_of_contract_nemo_dat.html',
    unit: 7,
    title: 'Unit 7: Effects of Contract of Sale: Transfer of Property & Nemo Dat',
    subtitle: 'Topic 7 – Transfer of Property in Goods, Risk & The Nemo Dat Quod Non Habet Rule with Exceptions | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Sale of Goods Act, 1930 (Ss. 18–30)'
    ],
    topics: [
      'Transfer of Property in Specific Goods: Deliverable State, Weighing & Testing (Ss. 19–22)',
      'Transfer of Property in Unascertained & Future Goods: Unconditional Appropriation (Ss. 18 & 23)',
      'Reservation of Right of Disposal: S. 25 & Presumptions from Railway Receipts / Bill of Lading',
      'Risk Prima Facie Passes with Property (S. 26) & Exceptions to Risk Rule',
      'The Doctrine of Nemo Dat Quod Non Habet (S. 27)',
      'Statutory Exceptions to Nemo Dat: Mercantile Agent (S. 27), Joint Owner (S. 28), Voidable Title (S. 29) & Seller/Buyer in Possession (S. 30)'
    ]
  },
  {
    file: 'topic8_unpaid_seller.html',
    unit: 8,
    title: 'Unit 8: Rights of the Unpaid Seller',
    subtitle: 'Topic 8 – Rights of the Unpaid Seller: Lien, Stoppage in Transitu, Re-sale & Remedies for Breach of Contract | DU LL.B. III Term LB-304 Master Notes',
    statutes: [
      'Sale of Goods Act, 1930 (Ss. 45–61)'
    ],
    topics: [
      'Definition & Characteristics of Unpaid Seller (S. 45)',
      'Unpaid Seller’s Right of Lien: Conditions, Part Delivery & Termination (Ss. 47–49)',
      'Right of Stoppage in Transitu: Origin, Duration of Transit & Mode of Stoppage (Ss. 50–52)',
      'Effect of Sub-Sale or Pledge by Buyer: S. 53 & Proviso regarding Documents of Title',
      'Right of Re-sale by Unpaid Seller: Perishable Goods, Notice & Damages (S. 54)',
      'Remedies of Seller and Buyer for Breach of Contract: Price, Damages & Specific Performance (Ss. 55–61)'
    ]
  }
];

// Process and update each dossier
fileConfigs.forEach(({ file, unit }) => {
  const filePath = path.join(splDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Inject responsive CSS engine if missing
  if (!html.includes('MAKE LAW EASY — UNIVERSAL OMNI-RESPONSIVE ENGINE')) {
    if (html.includes('</style>')) {
      html = html.replace('</style>', `${RESPONSIVE_ENGINE_CSS}\n</style>`);
      modified = true;
    }
  }

  // 2. Inject notes-responsive.css link before </head> if missing
  if (!html.includes('notes-responsive.css')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `  <link rel="stylesheet" href="../../css/notes-responsive.css">\n</head>`);
      modified = true;
    }
  }

  // 3. Inject missing IDs on cases
  let cCount = 0;
  html = html.replace(/<div\s+class="case"(?![^>]*\bid=)/gi, (match) => {
    cCount++;
    modified = true;
    return `<div class="case" id="spl-case-u${unit}-${cCount}"`;
  });

  // 4. Inject missing IDs on pyqs
  let qCount = 0;
  html = html.replace(/<div\s+class="pyq"(?![^>]*\bid=)/gi, (match) => {
    qCount++;
    modified = true;
    return `<div class="pyq" id="spl-pyq-u${unit}-${qCount}"`;
  });

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Dossier updated: ${file} (Responsive engine & anchors injected)`);
  } else {
    console.log(`ℹ️ Dossier already up-to-date: ${file}`);
  }
});

// -----------------------------------------------------------------------------
// STEP 2: EXTRACT UNITS, FIRAC CASES, DU PYQS & REVISIONS
// -----------------------------------------------------------------------------
const allCases = [];
const allPyqs = [];
const allRevisions = [];

fileConfigs.forEach(({ file, unit, title }) => {
  const filePath = path.join(splDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = `sem 3/spl contract/${file}`;

  // 1. Extract Cases
  let pos = 0;
  let cIdx = 0;
  while ((pos = content.indexOf('<div class="case"', pos)) !== -1) {
    cIdx++;
    const block = extractDivBlock(content, pos);
    if (!block) break;
    pos = block.end;
    const raw = block.outerHtml;

    const existingId = (raw.match(/<div class="case"[^>]*id="([^"]+)"/i) || [])[1];
    const anchorId = existingId || `spl-case-u${unit}-${cIdx}`;

    const nmMatch = raw.match(/<div\s+class="cn"[^>]*>([\s\S]*?)<\/div>/i);
    const ccMatch = raw.match(/<div\s+class="cc"[^>]*>([\s\S]*?)<\/div>/i);
    const tagMatch = raw.match(/<div\s+class="tagline"[^>]*>([\s\S]*?)<\/div>/i);

    let caseName = nmMatch ? stripHtml(nmMatch[1]) : `Case ${cIdx}`;
    caseName = caseName.replace(/^(?:CASE\s*\d+\s*[·•-]\s*|\d+\.\s*)/i, '').trim();

    let citation = ccMatch ? stripHtml(ccMatch[1]) : 'DU LB-304 Landmark Precedent';

    const factsBlock = raw.match(/<div\s+class="blk f"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="blk [iadp]"|<div\s+class="box|$)/i);
    const issuesBlock = raw.match(/<div\s+class="blk i"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="blk [adp]"|<div\s+class="box|$)/i);
    const argsBlock = raw.match(/<div\s+class="blk a"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="blk [dp]"|<div\s+class="box|$)/i);
    const decisionBlock = raw.match(/<div\s+class="blk d"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="blk p"|<div\s+class="box|$)/i);
    const princBlock = raw.match(/<div\s+class="blk p"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="box|$)/i);
    const tipBlock = raw.match(/<div\s+class="box b-tip"[^>]*>([\s\S]*?)<\/div>/i);

    const facts = factsBlock ? cleanMarkdown(factsBlock[1]) : (tagMatch ? stripHtml(tagMatch[1]) : `Leading case on ${title} under DU LB-304.`);
    const issues = issuesBlock ? cleanMarkdown(issuesBlock[1]) : `Whether the principles of ${title} apply to the commercial transaction between the parties.`;
    const argumentsText = argsBlock ? cleanMarkdown(argsBlock[1]) : undefined;
    const ratio = decisionBlock ? cleanMarkdown(decisionBlock[1]) : (princBlock ? cleanMarkdown(princBlock[1]) : 'Binding judicial ratio on the scope of the statutory provision.');
    const principleEvolved = princBlock ? cleanMarkdown(princBlock[1]) : ratio;
    const examTips = tipBlock ? cleanMarkdown(tipBlock[1]) : undefined;

    allCases.push({
      id: `spl-c-u${unit}-${cIdx}`,
      name: caseName,
      citation: citation,
      unitNumber: unit,
      unit: `Unit ${unit}: ${title}`,
      file: relPath,
      anchorId: anchorId,
      facts: facts,
      issues: issues,
      arguments: argumentsText,
      ratio: ratio,
      principleEvolved: principleEvolved,
      examTips: examTips
    });
  }

  // 2. Extract PYQs
  pos = 0;
  let qIdx = 0;
  while ((pos = content.indexOf('<div class="pyq"', pos)) !== -1) {
    qIdx++;
    const block = extractDivBlock(content, pos);
    if (!block) break;
    pos = block.end;
    const raw = block.outerHtml;

    const existingId = (raw.match(/<div class="pyq"[^>]*id="([^"]+)"/i) || [])[1];
    const anchorId = existingId || `spl-pyq-u${unit}-${qIdx}`;

    const yrMatch = raw.match(/<span\s+class="pyq-yr"[^>]*>([\s\S]*?)<\/span>/i);
    const paperMatch = raw.match(/<span\s+class="pyq-paper"[^>]*>([\s\S]*?)<\/span>/i);
    const topicMatch = raw.match(/<span\s+class="pyq-topic"[^>]*>([\s\S]*?)<\/span>/i);
    const qMatch = raw.match(/<div\s+class="pyq-q"[^>]*>([\s\S]*?)<\/div>/i);
    const ansMatch = raw.match(/<div\s+class="ans"[^>]*>([\s\S]*)$/i);

    let year = yrMatch ? stripHtml(yrMatch[1]) : 'DU Past Exam';
    let marks = topicMatch ? stripHtml(topicMatch[1]) : '10/20 Marks';
    let paper = paperMatch ? stripHtml(paperMatch[1]) : 'LB-304 Special Contracts';

    let question = qMatch ? cleanMarkdown(qMatch[1].replace(/<span\s+class="qm"[^>]*>Question<\/span>/i, '')) : `Exam Question ${qIdx}`;
    let modelAnswer = ansMatch ? cleanMarkdown(ansMatch[1].replace(/<span\s+class="ah"[^>]*>Model Answer<\/span>/i, '')) : 'Comprehensive model answer provided in topic dossier.';

    allPyqs.push({
      id: `spl-pyq-u${unit}-${qIdx}`,
      number: `Q${qIdx}`,
      year: year,
      marks: marks,
      paper: paper,
      type: question.length > 200 ? 'Problem & Analytical' : 'Essay',
      unitNumber: unit,
      unit: `Unit ${unit}: ${title}`,
      file: relPath,
      anchorId: anchorId,
      question: question,
      modelAnswer: modelAnswer,
      answer: modelAnswer
    });
  }

  // 3. Extract Revision
  const mnemBoxes = [...content.matchAll(/<div class="box b-tip"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
  const revisionPoints = [];
  mnemBoxes.slice(0, 5).forEach(m => {
    const rawBox = m[1];
    const h = rawBox.match(/<div class="bt"[^>]*>([\s\S]*?)<\/div>/i);
    if (h) {
      revisionPoints.push(`**${stripHtml(h[1])}**:\n${cleanMarkdown(rawBox)}`);
    }
  });

  allRevisions.push({
    unitNumber: unit,
    unitTitle: `Unit ${unit}: ${title}`,
    unit: `Unit ${unit}: ${title}`,
    file: relPath,
    anchorId: 'partE',
    summary: `Comprehensive master revision capsule for ${title} under DU LL.B. LB-304. High-yield statutory rules, landmark authorities, and answer blueprint.`,
    keyTakeaways: revisionPoints.length > 0 ? revisionPoints.join('\n\n') : `Essential principles, definitions and cases for ${title}.`,
    sections: [`Key statutory provisions of Unit ${unit}`]
  });
});

console.log(`\nExtracted: ${allCases.length} Landmark Cases, ${allPyqs.length} PYQs with Model Answers, ${allRevisions.length} Revision Capsules.`);

// -----------------------------------------------------------------------------
// STEP 3: REGISTER IN JS/DATA.JS
// -----------------------------------------------------------------------------
const dataJsPath = path.join(rootDir, 'js', 'data.js');
const dataJsRaw = fs.readFileSync(dataJsPath, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);

const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

const specialContractsSubject = {
  id: 'special_contracts',
  code: 'LB-304',
  name: 'Special Contracts (Partnership & Sale of Goods)',
  shortName: 'Special Contracts',
  semester: 3,
  folder: 'sem 3/spl contract',
  theme: {
    primary: '#78350f',
    primaryDark: '#451a03',
    primaryLight: '#92400e',
    accent: '#d97706',
    accentLight: '#fef3c7',
    bgTint: '#fffbeb',
    border: '#fde68a',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #78350f 55%, #b45309 100%)',
    tagline: 'Partnership Law (1932), Sale of Goods Act (1930), Agency, Mercantile Precedents & Commercial Remedies',
    motto: 'Cox v. Hickman • Nemo Dat Quod Non Habet • Caveat Emptor',
    quote: 'The law as to partnership is undoubtedly a branch of the law of principal and agent. — Lord Wensleydale in Cox v. Hickman (1860)',
    icon: 'fa-handshake'
  },
  units: fileConfigs.map(c => ({
    id: `spl-u${c.unit}`,
    number: c.unit,
    title: c.title,
    subtitle: c.subtitle,
    file: `sem 3/spl contract/${c.file}`,
    statutes: c.statutes,
    topics: c.topics
  })),
  cases: allCases,
  pyqs: allPyqs,
  revisions: allRevisions
};

portalData.subjects['special_contracts'] = specialContractsSubject;

// Update Semester 3 in portalData.semesters
const sem3 = portalData.semesters.find(s => s.id === 3);
if (sem3) {
  if (!sem3.subjectIds.includes('special_contracts')) {
    sem3.subjectIds.push('special_contracts');
  }
  sem3.badge = '6 Core Subjects (Constitutional Law, CPC, Company Law, Special Contracts, WCC, Media Law)';
  sem3.description = 'Comprehensive study dossiers, case briefs, and solved question banks for Constitutional Law - I (LB-301), Code of Civil Procedure (LB-302), Company Law (LB-303), Special Contracts (LB-304), White Collar Crimes (LB-3037), and Media Law (LB-3031).';
}

const newContent = `// DU Law Notes Portal — Central Data Repository\n// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules\n// Comprehensive coverage across LL.B. syllabus\n\nwindow.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};\n`;
fs.writeFileSync(dataJsPath, newContent, 'utf8');
console.log('✅ js/data.js safely updated with Special Contracts (LB-304)!');

// -----------------------------------------------------------------------------
// STEP 4: REGISTER IN JS/BOOKS_SHOWCASE.JS
// -----------------------------------------------------------------------------
const booksPath = path.join(rootDir, 'js', 'books_showcase.js');
let booksContent = fs.readFileSync(booksPath, 'utf8');

if (!booksContent.includes('id: "special_contracts"') && !booksContent.includes("id: 'special_contracts'")) {
  const splBookConfig = `      {
        id: "special_contracts",
        code: "LB-304",
        title: "Special Contracts",
        author: "LB-304 • Make Law Easy",
        year: "2025–26",
        stars: 5,
        unitsCount: "8 Comprehensive Units",
        casesCount: "${allCases.length} Landmark Cases",
        desc: "Indian Partnership Act 1932 & Sale of Goods Act 1930: Mutual Agency, Property, Dissolution, Caveat Emptor, Nemo Dat & Unpaid Seller Remedies.",
        spineBg: "#78350f",
        spineInk: "#fef3c7",
        spineFont: "700 36px Georgia",
        backBg: "#451a03",
        backInk: "254,243,199",
        edge: "#fffbeb",
        chapters: [
          "Unit 1: Concept of Agency & The Nature of Partnership",
          "Unit 2: Relations of Partners to One Another and to Third Parties",
          "Unit 3: Incoming & Outgoing Partners and Registration of a Firm",
          "Unit 4: Dissolution of a Firm",
          "Unit 5: Formation of Contracts of Sale",
          "Unit 6: Conditions and Warranties",
          "Unit 7: Effects of Contract of Sale: Transfer of Property & Nemo Dat",
          "Unit 8: Rights of the Unpaid Seller"
        ]
      },`;

  const sem3Index = booksContent.indexOf('3: [');
  if (sem3Index !== -1) {
    const companyIndex = booksContent.indexOf('id: "company"', sem3Index);
    if (companyIndex !== -1) {
      const nextEndBrace = booksContent.indexOf('},', companyIndex);
      booksContent = booksContent.slice(0, nextEndBrace + 2) + '\n' + splBookConfig + booksContent.slice(nextEndBrace + 2);
      fs.writeFileSync(booksPath, booksContent, 'utf8');
      console.log('✅ js/books_showcase.js updated with Special Contracts 3D book!');
    }
  }
} else {
  console.log('ℹ️ js/books_showcase.js already includes Special Contracts');
}

// -----------------------------------------------------------------------------
// STEP 5: REGISTER IN INDEX.HTML
// -----------------------------------------------------------------------------
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

let indexModified = false;
if (!indexContent.includes('value="special_contracts"')) {
  // 1. Comments filter
  if (indexContent.includes('<option value="company">Company Law (LB-303)</option>')) {
    indexContent = indexContent.replace(
      '<option value="company">Company Law (LB-303)</option>',
      '<option value="company">Company Law (LB-303)</option>\n                <option value="special_contracts">Special Contracts (LB-304)</option>'
    );
    indexModified = true;
  }

  // 2. Compose tag
  const secondCompany = indexContent.lastIndexOf('<option value="company">Company Law (LB-303)</option>');
  if (secondCompany !== -1) {
    indexContent = indexContent.slice(0, secondCompany) +
      '<option value="company">Company Law (LB-303)</option>\n                    <option value="special_contracts">Special Contracts (LB-304)</option>' +
      indexContent.slice(secondCompany + '<option value="company">Company Law (LB-303)</option>'.length);
    indexModified = true;
  }

  // 3. Mock selection
  if (indexContent.includes('<option value="company">Company Law (Semester 3)</option>')) {
    indexContent = indexContent.replace(
      '<option value="company">Company Law (Semester 3)</option>',
      '<option value="company">Company Law (Semester 3)</option>\n          <option value="special_contracts">Special Contracts (Semester 3)</option>'
    );
    indexModified = true;
  }

  if (indexModified) {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ index.html updated with Special Contracts select options!');
  }
} else {
  console.log('ℹ️ index.html already includes Special Contracts options');
}

// -----------------------------------------------------------------------------
// STEP 6: SERVICE WORKER & ASSET CACHE BUMP (v64 -> v65)
// -----------------------------------------------------------------------------
const swPath = path.join(rootDir, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
if (swContent.includes('du-law-portal-v64')) {
  swContent = swContent.replace(/du-law-portal-v64/g, 'du-law-portal-v65');
  swContent = swContent.replace(/\?v=64\.0/g, '?v=65.0');
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('✅ sw.js updated to CACHE_NAME du-law-portal-v65 (?v=65.0)');
}

// Update index.html and feedback.html cache versions
indexContent = fs.readFileSync(indexPath, 'utf8');
if (indexContent.includes('?v=64.0')) {
  indexContent = indexContent.replace(/\?v=64\.0/g, '?v=65.0');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('✅ index.html asset versions updated to ?v=65.0');
}

const fbPath = path.join(rootDir, 'feedback.html');
if (fs.existsSync(fbPath)) {
  let fbContent = fs.readFileSync(fbPath, 'utf8');
  if (fbContent.includes('?v=64.0')) {
    fbContent = fbContent.replace(/\?v=64\.0/g, '?v=65.0');
    fs.writeFileSync(fbPath, fbContent, 'utf8');
    console.log('✅ feedback.html asset versions updated to ?v=65.0');
  }
}

console.log('\n🎉 SPECIAL CONTRACTS INGESTION PIPELINE FINISHED SUCCESSFULLY!');
