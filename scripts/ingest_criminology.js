const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const crimDir = path.join(rootDir, 'SEM 5', 'Criminology');

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanHtml(html) {
  if (!html) return '';
  return html.trim();
}

console.log('====================================================');
console.log('🚀 MAKE LAW EASY — CRIMINOLOGY INGESTION PIPELINE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// STEP 1: RESPONSIVE ENGINE & ANCHOR INJECTION FOR THE 7 DOSSIERS
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
  .title-block, .topic-header, .subject-banner, .part-head {
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
  .part-head .num, .num, .bno, .cno, .sno {
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

  /* All SVG diagrams & flowcharts scale proportionally to 100% container width — 100% FULLY VISIBLE */
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

  /* Flow arrows: rotate horizontal '→' 90deg into vertical down arrow '↓' */
  .flow .ar, .flow span.ar, .flow > .ar, .arrow, .flow .arrow {
    display: block !important;
    text-align: center !important;
    margin: 2px auto !important;
    font-size: 18px !important;
    line-height: 1 !important;
    color: var(--accent, #c8102e) !important;
  }

  .flow .ar::before, .flow span.ar::before {
    content: "↓" !important;
  }

  /* Flowchart Splits and Branches (e.g. Property Law & Contract) */
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
  .lease-fields, .lease-field, .vs, .kv, .cgrid, .arg2, .comparison, .step-grid,
  .timeline, .statute-grid, .def-grid, .defgrid, .vs-split, .quick-grid, .three-col,
  .four-col, .rule-grid, .memory-grid, .arg-grid, .cover-grid, .mcqgrid,
  .two-col-doc, .cmp, .checkgrid, .case-grid, .cols, .args, .decision, .side,
  .story, .clause-grid, .source-grid, .architecture, .arguments, .irac, .fir,
  .toc.grid, .toc-cols, .lane-wrap, .rmap {
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
    border-bottom: 1px solid var(--line, #e2e8f0) !important;
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

  /* 11. SECTION HEADERS & CARDS */
  .sec-head, .header-card, .chapter-header, .case-head, .answer-head {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 4px !important;
  }
}
/* END MAKE LAW EASY — UNIVERSAL OMNI-RESPONSIVE ENGINE */
`;

const fileConfigs = [
  { file: 'Topic2_Criminology_DU.html', unitNum: 1, title: 'Unit 1: Criminological Theories: Explaining Crime Causation' },
  { file: 'Topic3_Criminology_DU.html', unitNum: 2, title: 'Unit 2: The Indian Crime Reality (Organised, White Collar & Cyber Crimes)' },
  { file: 'Topic4_Criminology_DU.html', unitNum: 3, title: 'Unit 3: Juvenile Delinquency & The Juvenile Justice Act, 2015' },
  { file: 'Topic5_Criminology_DU.html', unitNum: 4, title: 'Unit 4: Punishment and Its Justifications: Penology, Sentencing & Capital Punishment' },
  { file: 'victimology-notes.html', unitNum: 5, title: 'Unit 5: Victimology: Rights of Victims, Remedies & Compensation' },
  { file: 'police-system-notes.html', unitNum: 6, title: 'Unit 6: The Indian Police System: Role, Custodial Violence & Police Reforms' },
  { file: 'prison-system-notes.html', unitNum: 7, title: 'Unit 7: The Indian Prison System: Prisoner Rights, Open Prisons & Prison Reforms' }
];

fileConfigs.forEach(({ file, unitNum }) => {
  const filePath = path.join(crimDir, file);
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

  // 3. Inject anchors on cases and pyqs if missing
  if (unitNum <= 5) {
    let caseIdx = 0;
    html = html.replace(/<div\s+class="case"(?![^>]*\bid=)/gi, (match) => {
      caseIdx++;
      modified = true;
      return `<div class="case" id="crim-case-u${unitNum}-${caseIdx}"`;
    });

    let qIdx = 0;
    html = html.replace(/<div\s+class="(?:q|pyq)"(?![^>]*\bid=)/gi, (match) => {
      qIdx++;
      modified = true;
      const cls = match.includes('pyq') ? 'pyq' : 'q';
      return `<div class="${cls}" id="crim-pyq-u${unitNum}-${qIdx}"`;
    });
  }

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

fileConfigs.forEach(({ file, unitNum, title }) => {
  const filePath = path.join(crimDir, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const relPath = `SEM 5/Criminology/${file}`;

  if (unitNum <= 5) {
    // Standard case divs
    const caseDivs = [...html.matchAll(/<div\s+class="case"[^>]*>([\s\S]*?)<\/div>\s*<\/div>(?:\s*<\/div>)?/gi)];
    caseDivs.forEach((c, i) => {
      const idx = i + 1;
      const raw = c[1];
      const nm = raw.match(/class="nm"[^>]*>([\s\S]*?)<\/span>/i) || raw.match(/class="nm"[^>]*>([\s\S]*?)<\/div>/i) || raw.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
      const ct = raw.match(/class="ct"[^>]*>([\s\S]*?)<\/span>/i) || raw.match(/class="ct"[^>]*>([\s\S]*?)<\/div>/i) || raw.match(/class="cite"[^>]*>([\s\S]*?)<\/div>/i);
      
      let name = nm ? stripHtml(nm[1]) : `Case ${idx}`;
      let citation = ct ? stripHtml(ct[1]) : '';

      // If citation is inside name (like in victimology: "State of Punjab v. Ajaib Singh — AIR 1995 SC 975 : (1995) 2 SCC 486")
      if (!citation && name.includes(' — ')) {
        const parts = name.split(' — ');
        name = parts[0].trim();
        citation = parts.slice(1).join(' — ').trim();
      }

      const dl = raw.match(/<dl>([\s\S]*?)<\/dl>/i);
      const dtMap = {};
      if (dl) {
        const dts = [...dl[1].matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/gi)];
        dts.forEach(d => {
          const k = stripHtml(d[1]).toLowerCase();
          dtMap[k] = cleanHtml(d[2]);
        });
      }

      let facts = '';
      let issues = '';
      let argumentsText = '';
      let ratio = '';
      let principle = '';
      let tips = '';

      for (const [k, val] of Object.entries(dtMap)) {
        if (k.startsWith('fact')) facts = val;
        else if (k.startsWith('issue')) issues = val;
        else if (k.includes('argument')) {
          argumentsText += (argumentsText ? '<br><br>' : '') + `<b>${k.toUpperCase()}:</b> ` + val;
        }
        else if (k.startsWith('decision') || k.startsWith('outcome') || k.startsWith('holding')) ratio = val;
        else if (k.includes('principle') || k.includes('significance') || k.includes('reading')) principle = val;
        else if (k.includes('use') || k.includes('afterlife') || k.includes('summary')) tips = val;
      }

      // Check victimology style
      if (!facts) {
        const factsM = raw.match(/class="facts"[^>]*>([\s\S]*?)<\/div>/i);
        if (factsM) facts = cleanHtml(factsM[1]);
      }
      if (!issues) {
        const issuesM = raw.match(/<h[34][^>]*>Issues?<\/h[34]>\s*([\s\S]*?)(?=<h[34]|$)/i);
        if (issuesM) issues = cleanHtml(issuesM[1]);
      }
      if (!argumentsText) {
        const argsM = raw.match(/<h[34][^>]*>Arguments?<\/h[34]>\s*([\s\S]*?)(?=<h[34]|$)/i);
        if (argsM) argumentsText = cleanHtml(argsM[1]);
      }
      if (!ratio) {
        const decM = raw.match(/<h[34][^>]*>Decision<\/h[34]>\s*([\s\S]*?)(?=<div class="ratio"|<h[34]|$)/i);
        if (decM) ratio = cleanHtml(decM[1]);
      }
      if (!principle) {
        const princM = raw.match(/class="ratio"[^>]*>([\s\S]*?)<\/div>/i) || raw.match(/class="princ"[^>]*>([\s\S]*?)<\/div>/i);
        if (princM) principle = cleanHtml(princM[1]);
      }
      if (!tips) {
        const tipM = raw.match(/class="exam-tip"[^>]*>([\s\S]*?)<\/div>/i);
        if (tipM) tips = cleanHtml(tipM[1]);
      }

      // Sensible defaults
      if (!ratio && facts) ratio = facts;
      if (!facts && ratio) facts = ratio;
      if (!principle) principle = ratio || 'Binding ratio and principle as laid down by the Supreme Court of India.';
      if (!issues) issues = `Whether the legal principles and statutory provisions applicable under the subject were correctly determined and applied.`;

      allCases.push({
        id: `crim-c-u${unitNum}-${idx}`,
        name,
        citation,
        unitNumber: unitNum,
        unit: title,
        file: relPath,
        anchorId: `crim-case-u${unitNum}-${idx}`,
        facts,
        issues,
        arguments: argumentsText || undefined,
        ratio,
        principleEvolved: principle,
        examTips: tips || undefined
      });
    });

    // Parse PYQs in Unit 1 to 5
    const qDivs = [...html.matchAll(/<div\s+class="(?:q|pyq)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>(?:\s*<\/div>)?/gi)];
    qDivs.forEach((q, i) => {
      const idx = i + 1;
      const raw = q[1];
      const qh = raw.match(/class="(?:qh|yr|pyq-head)"[^>]*>([\s\S]*?)<\/div>/i);
      const qt = raw.match(/class="qt"[^>]*>([\s\S]*?)<\/div>/i) || raw.match(/<h[34][^>]*>([\s\S]*?)<\/h[34]>/i);
      const ans = raw.match(/class="ans"[^>]*>([\s\S]*)$/i);

      let header = qh ? stripHtml(qh[1]) : '';
      let question = qt ? stripHtml(qt[1]) : `Criminology Exam Question ${idx}`;
      let modelAnswer = ans ? cleanHtml(ans[1]) : '<p>Detailed model answer based on prescribed Delhi University case material.</p>';

      let year = 'DU Past Exam';
      let number = `Q${idx}`;
      let marks = '15 Marks';

      if (header.includes('2017')) year = '2017';
      else if (header.includes('2022')) year = '2022';

      if (header.includes('Q.')) {
        const numM = header.match(/Q\.?\s*([0-9a-zA-Z()]+)/);
        if (numM) number = `Q${numM[1]}`;
      } else if (header.includes('Q')) {
        const numM = header.match(/Q\s*([0-9a-zA-Z()]+)/);
        if (numM) number = `Q${numM[1]}`;
      }

      allPyqs.push({
        id: `crim-pyq-u${unitNum}-${idx}`,
        number,
        year,
        marks,
        type: question.length > 250 ? 'Problem' : 'Essay',
        unitNumber: unitNum,
        unit: title,
        file: relPath,
        anchorId: `crim-pyq-u${unitNum}-${idx}`,
        question,
        modelAnswer
      });
    });

    // In victimology (unit 5), add the 6 probable questions from Part 6
    if (unitNum === 5) {
      const probables = [
        {
          num: 'P1',
          q: 'Discuss the UN Declaration of Basic Principles of Justice for Victims of Crime and Abuse of Power (1985) and its impact on Indian law.',
          ans: '<p><b>Introduction:</b> GA Res 40/34 (29 Nov 1985), adopted at the 7th UN Congress in Milan, serves as the global charter for victim justice. India has progressively incorporated its norms through constitutional tort jurisprudence, CrPC Amendments (2008 & 2013), and BNSS 2023 (Ss. 395–398).</p><p><b>Core Pillars:</b> (1) Access to justice & fair treatment (paras 4–7); (2) Restitution by offenders and State for abuse of power (paras 8–11); (3) State compensation funds (paras 12–13); (4) Comprehensive victim assistance (paras 14–17).</p><p><b>Indian Transplants:</b> S. 395 (offender compensation), S. 396 (State VCS), S. 397 (free hospital care), and S. 398 (Witness Protection Scheme). Landmark rulings like <i>Chandrima Das</i>, <i>Laxmi</i>, and <i>Nipun Saxena</i> directly mirror the UN Declaration.</p>'
        },
        {
          num: 'P2',
          q: 'X is acquitted of murder; his victim\'s widow seeks compensation. Advise her on available statutory and constitutional remedies.',
          ans: '<p><b>Legal Advice:</b> Acquittal of the accused does not terminate victim relief. Under modern compensatory jurisprudence, victim rehabilitation is decoupled from conviction.</p><p><b>Remedy 1 — BNSS S. 396(3) (CrPC 357A):</b> The trial court, even upon acquitting or discharging the accused, possesses statutory power to recommend compensation to DLSA/SLSA if the victim or dependants require rehabilitation. Supported by <i>State of Punjab v. Ajaib Singh</i> (1995), where SC directed ₹5 Lakh compensation despite upholding acquittal.</p><p><b>Remedy 2 — S. 396(6) Interim Relief:</b> DLSA may disburse immediate medical relief or maintenance pending final enquiry.</p><p><b>Remedy 3 — Constitutional Tort (Art. 32 / 226):</b> If acquittal resulted from state negligence or illegal police conduct, a writ for monetary amends lies under the <i>Rudul Shah</i> / <i>Nilabati Behera</i> doctrine.</p>'
        },
        {
          num: 'P3',
          q: 'A newspaper publishes a rape survivor\'s photograph and village address. Discuss the legal liability and victim protections.',
          ans: '<p><b>Criminal Liability:</b> Publishing the name, picture, or any identifying detail of a sexual offence survivor is a cognizable offence under BNS S. 72 (IPC 228A) punishable with up to 2 years imprisonment and fine.</p><p><b>Judicial Precedents:</b> In <i>Nipun Saxena v. Union of India</i> (2019), the Supreme Court ruled that victim anonymity is absolute by default. No media house may disclose indirect identifiers (school rank, village, parents\' names). FIRs in sexual offences must remain masked from the public domain.</p><p><b>Additional Relief:</b> Survivor is entitled to in-camera proceedings (BNSS 366), free medical/counseling support (BNSS 397), and compensation under the NALSA Scheme 2018.</p>'
        },
        {
          num: 'P4',
          q: 'Compare and contrast compensation under BNSS S. 395 (CrPC 357) and BNSS S. 396 (CrPC 357A).',
          ans: '<p><b>1. Source of Funds:</b> S. 395 is paid by the convicted accused (from fine or substantive compensation); S. 396 is paid from the State Government Victim Compensation Fund.</p><p><b>2. Pre-requisite of Conviction:</b> S. 395 strictly requires a finding of guilt and sentence; S. 396 operates upon conviction, acquittal, discharge, or even where the offender remains untraced (S. 396(4)).</p><p><b>3. Deciding Authority:</b> S. 395 is directly quantified and ordered by the trial/appellate court; S. 396 is recommended by the court and quantified by DLSA/SLSA within 2 months.</p><p><b>4. Primary Object:</b> S. 395 provides restitution for proven loss/expenses; S. 396 focuses on comprehensive social, physical, and economic rehabilitation.</p><p><b>5. Additionality:</b> Under S. 396(7), State compensation is cumulative and in addition to any fine payable to the victim under BNS Ss. 65, 70, or 124(1).</p>'
        },
        {
          num: 'P5',
          q: 'An acid attack survivor suffers grievous injuries, while the accused has absconded. Detail the legal and compensatory remedies available.',
          ans: '<p><b>Immediate Medical Care:</b> Under BNSS S. 397 (CrPC 357C), all hospitals (public and private) must immediately provide free first-aid and treatment. Refusal is penalized under BNS S. 200 (IPC 166B).</p><p><b>Compensation without Trial:</b> Under BNSS S. 396(4), where the offender is untraced, the victim can directly apply to DLSA/SLSA. In <i>Laxmi v. Union of India</i> (2014), SC established a mandatory floor of ₹3 Lakh (₹1L within 15 days + ₹2L within 2 months).</p><p><b>Substantive Charge:</b> Offender when traced is prosecuted under BNS S. 124(1) (min 10 years to life) with fine to cover medical expenses.</p><p><b>Regulatory Mechanism:</b> Compliance with Model Poisons Rules regarding over-the-counter acid sales and stock licensing.</p>'
        },
        {
          num: 'P6',
          q: 'Evaluate victim participation rights in the Indian criminal justice system from trial to appeal.',
          ans: '<p><b>1. Reporting Stage:</b> Mandatory FIR registration under BNSS S. 173 (<i>Lalita Kumari</i>); right to zero-FIR and audio-video recording.</p><p><b>2. Trial Stage:</b> Right to engage private advocate under BNSS S. 360 (acting under PP) or conduct prosecution with permission under S. 361 (<i>Shiv Kumar v. Hukam Chand</i>). In-camera trial protections under S. 366.</p><p><b>3. Sentencing Voice:</b> S. 395 compensation hearing and victim-impact evidence considerations (persuasive American doctrine: <i>Payne v. Tennessee</i>).</p><p><b>4. Appeal & Revision:</b> Independent right of appeal under BNSS S. 413 proviso (CrPC 372 proviso) against acquittal, lesser conviction, or inadequate compensation, without needing State consent. Pseudonym filing permitted per <i>Nipun Saxena</i>.</p>'
        }
      ];

      probables.forEach((p, idx) => {
        allPyqs.push({
          id: `crim-pyq-u5-${qDivs.length + idx + 1}`,
          number: p.num,
          year: 'DU Expected / Practice',
          marks: '10–15 Marks',
          type: 'Problem & Analytical',
          unitNumber: 5,
          unit: title,
          file: relPath,
          anchorId: `p6`,
          question: p.q,
          modelAnswer: p.ans
        });
      });
    }
  }

  // Unit 6: Police System Cases and PYQs
  if (unitNum === 6) {
    // Case 25: Prakash Singh
    allCases.push({
      id: 'crim-c-u6-1',
      name: 'Prakash Singh v. Union of India',
      citation: '(2006) 8 SCC 1; W.P. (C) No. 310 of 1996',
      unitNumber: 6,
      unit: title,
      file: relPath,
      anchorId: 'prakash',
      facts: `<p>A landmark PIL filed in 1996 by former DGP Prakash Singh and other veteran officers seeking implementation of the National Police Commission (NPC 1979–81) recommendations, which had remained unaddressed for decades despite repeated governmental assurances.</p>`,
      issues: `<p>1. Whether the Supreme Court can issue binding structural directives to reform police organization under Arts. 32 and 142 where the legislature and executive have failed to act?<br>2. What institutional mechanisms are imperative to insulate the police from extraneous political influence while ensuring accountability to the rule of law?</p>`,
      arguments: `<b>PETITIONERS:</b> Police politicization directly violates Arts. 14 and 21 (fair investigation is a core aspect of personal liberty). The Court possesses continuing mandamus power under Art. 142 on the <i>Vineet Narain</i> model.<br><br><b>STATE / UNION:</b> "Police" is a State subject under Entry 2 List II of the Seventh Schedule; judicially mandated uniform structures offend constitutional federalism and separation of powers.`,
      ratio: `<p>The Supreme Court overruled the federalism objections given three decades of executive inaction. Exercising powers under Arts. 32 and 142, the Court issued <b>SEVEN BINDING DIRECTIVES</b> operative till state legislatures frame appropriate laws:<br>(1) State Security Commission (SSC);<br>(2) Selection & minimum 2-year tenure of DGP;<br>(3) Minimum 2-year tenure for field officers (IG, DIG, SP, SHO);<br>(4) Separation of investigation from law & order (starting in cities with 10L+ population);<br>(5) Police Establishment Board (PEB) for service transfers up to DySP;<br>(6) Police Complaints Authorities (PCA) at District and State levels with binding recommendations;<br>(7) National Security Commission (NSC) for Central Police Organisations.</p>`,
      principleEvolved: `<p>1. <b>Judicial legislation doctrine extended:</b> Continuing mandamus under Art. 142 fills legislative vacuums to protect fundamental rights.<br>2. <b>Twin-pillar rule:</b> Functional autonomy (tenure security, SSC, PEB) must be accompanied by external civilian accountability (PCAs); autonomy without accountability leads to impunity.</p>`,
      examTips: `<p>Pair with <i>T.P. Senkumar v. UOI</i> (2017) as the premier enforcement precedent. Conclude with the classic evaluative aphorism: "<i>Prakash Singh</i> supplied the judicial skeleton of police reform; the executive must supply the flesh."</p>`
    });

    // Case 26: T.P. Senkumar
    allCases.push({
      id: 'crim-c-u6-2',
      name: 'T.P. Senkumar v. Union of India & Ors.',
      citation: 'AIR 2017 SC 2628; (2017) 6 SCC 801',
      unitNumber: 6,
      unit: title,
      file: relPath,
      anchorId: 'senkumar',
      facts: `<p>Appellant T.P. Senkumar was appointed DGP / State Police Chief of Kerala. Following a change of government in May 2016, he was removed prematurely mid-tenure under S. 97(2)(e) of the Kerala Police Act, 2011 on grounds of alleged dissatisfaction following the Puttingal temple fire tragedy and Jisha murder case.</p>`,
      issues: `<p>1. Can a State Government remove a DGP mid-tenure based on subjective political dissatisfaction without objective, verifiable material on record?<br>2. Does the two-year tenure security guarantee in <i>Prakash Singh</i> bind States where State Police legislation provides a subjective removal clause?</p>`,
      arguments: `<b>APPELLANT:</b> Removal was punitive and political, violating <i>Prakash Singh</i>. A police chief cannot be scapegoated for incidents without personal culpability established through due process.<br><br><b>STATE:</b> The elected government must have confidence in its police chief. S. 97(2)(e) empowers removal upon subjective dissatisfaction, which is not subject to judicial substitution.`,
      ratio: `<p>Appeal allowed; premature removal quashed and Senkumar ordered to be reinstated as DGP — marking India's <b>first-ever judicial reinstatement of a removed DGP</b>.<br>1. "Dissatisfaction" under statutory removal clauses must be founded upon <b>objective, verifiable material</b>, not subjective or partisan pleasure.<br>2. Tenure security established in <i>Prakash Singh</i> is a substantive legal shield that cannot be rendered illusory by vague administrative allegations.<br>3. Police chiefs cannot be made scapegoats for institutional crises without clear attribution of fault.</p>`,
      principleEvolved: `<p>Tenure security for police leadership is legally enforceable in public law, cementing the independence of criminal investigation from political turnover.</p>`,
      examTips: `<p>Cite alongside the Supreme Court's 2018 and 2019 follow-up orders banning "acting DGPs" and requiring proposals to UPSC 3 months prior to vacancy.</p>`
    });

    // Unit 6 PYQs
    allPyqs.push({
      id: 'crim-pyq-u6-1',
      number: 'Q8(a)',
      year: '2017',
      marks: '15 Marks',
      type: 'Essay',
      unitNumber: 6,
      unit: title,
      file: relPath,
      anchorId: 'pyq',
      question: 'Discuss the police reforms directed by the Supreme Court in Prakash Singh v. Union of India.',
      modelAnswer: `<p><b>Introduction:</b> In <i>Prakash Singh v. Union of India</i>, (2006) 8 SCC 1, the Supreme Court confronted nearly three decades of ignored expert commission recommendations (NPC 1979–81, Ribeiro 1998, Padmanabhaiah 2000). Invoking Arts. 32 and 142 on the <i>Vineet Narain</i> template, the Bench (Sabharwal C.J., Thakker & Balasubramanyan JJ.) formulated seven binding structural directives to insulate policing from extraneous executive interference.</p>
<p><b>The Seven Directives:</b><br>
1. <b>State Security Commission (SSC):</b> Formed in every State to ensure the Government does not exercise unwarranted pressure on the police. Mandated to evaluate police performance and submit annual reports to the legislature.<br>
2. <b>DGP Selection & Minimum 2-Year Tenure:</b> Selection by State from 3 senior-most officers empanelled by UPSC. Guaranteed 2-year tenure irrespective of superannuation date.<br>
3. <b>Field Officers Tenure:</b> Minimum 2-year tenure for IG (Zone), DIG (Range), SP (District), and SHO.<br>
4. <b>Separation of Wings:</b> Complete separation of investigation staff from law and order police in cities with 10 lakh+ population to improve prosecution quality.<br>
5. <b>Police Establishment Board (PEB):</b> DGP + 4 senior officers deciding transfers, postings, and promotions up to DySP rank.<br>
6. <b>Police Complaints Authorities (PCA):</b> District PCA (chaired by retired District Judge) for complaints against officers up to DySP; State PCA (chaired by retired HC/SC Judge) for SP and above regarding custodial death, grievous hurt, rape, and severe misconduct.<br>
7. <b>National Security Commission (NSC):</b> Union-level body to prepare panels for Central Police Organisation chiefs.</p>
<p><b>Enforcement & Afterlife:</b> Orders dated 11-1-2007 declared directives 2, 3, and 5 self-executory. Subsequent compliance was reinforced in <i>T.P. Senkumar</i> (2017) and 2018/2019 orders forbidding acting DGPs.</p>
<p><b>Conclusion:</b> <i>Prakash Singh</i> transitioned Indian policing from a colonial ruler's force into a democratic public service, though continuous judicial monitoring remains vital due to sluggish executive implementation.</p>`
    });

    const policeProbables = [
      {
        num: 'P1',
        q: '“The 1861 police framework is obsolete.” Discuss the role and functions of police in modern India.',
        ans: '<p><b>Colonial Origin:</b> Police Act 1861 was enacted following the 1857 revolt to maintain imperial dominion and surveillance, treating citizens as subjects rather than rights-holders.</p><p><b>Modern Democratic Role:</b> The police must balance order-maintenance with constitutional human rights (Arts. 14, 21, 22), serving as the primary gatekeepers of criminal justice.</p><p><b>Core Legal Functions:</b> Mandatory FIR registration (BNSS 173), preventive action, evidence collection, and victim assistance. Shift from coercive policing to community-oriented service (NPC 8 Principles).</p>'
      },
      {
        num: 'P2',
        q: 'Trace the chronology of police reform committees in India from the NPC to the Model Police Act, 2006.',
        ans: '<p><b>Chronological Trajectory:</b><br>1. <b>National Police Commission (1977–81):</b> 8 monumental reports introducing SSC and tenure security.<br>2. <b>Ribeiro Committee (1998–99):</b> Endorsed NPC framework and recommended immediate court-mandated rollout.<br>3. <b>Padmanabhaiah Committee (2000):</b> 240 recommendations focusing on recruitment, beat policing, and urban policing.<br>4. <b>Malimath Committee (2003):</b> 158 recommendations advocating investigation separation and forensic infrastructure.<br>5. <b>Model Police Act, 2006 (Sorabjee Committee):</b> Drafted a modern democratic police legislation replacing the 1861 Act.</p>'
      },
      {
        num: 'P3',
        q: 'Discuss T.P. Senkumar v. Union of India and its significance for the security of tenure of police chiefs.',
        ans: '<p><b>Holding:</b> The Supreme Court reinstated Kerala DGP Senkumar, holding that statutory removal on grounds of "dissatisfaction" must be grounded in objective, verifiable evidence rather than subjective political desire. Reaffirms Directive 2 of <i>Prakash Singh</i>.</p>'
      },
      {
        num: 'P4',
        q: 'Examine custodial violence in India: causes, judicial response, and procedural safeguards under BNSS.',
        ans: '<p><b>Judicial Safeguards:</b> <i>Joginder Kumar</i> (arrest is discretionary), <i>D.K. Basu</i> (11 mandatory arrest/detention protocols), <i>Nilabati Behera</i> (monetary compensation for custodial death), and <i>Arnesh Kumar</i> (checks on routine arrest).</p><p><b>BNSS Codification:</b> S. 35 BNSS regulates arrest, mandatory medical examination within 24 hours, and intimation to nominated relatives.</p>'
      },
      {
        num: 'P5',
        q: 'Write short notes on: (a) State Security Commission (SSC); (b) Police Complaints Authority (PCA); (c) Police Establishment Board (PEB).',
        ans: '<p><b>(a) SSC:</b> Chaired by CM/HM with DGP as secretary; frames policing policy guidelines and submits annual performance reports to the State Legislature to shield police from extraneous executive influence.<br><b>(b) PCA:</b> Independent civilian complaints body headed by retired judges to investigate grave custodial misconduct (custodial death, torture, rape).<br><b>(c) PEB:</b> DGP + 4 senior officers managing departmental transfers, postings, and promotions up to DySP rank to insulate personnel from political patronage.</p>'
      }
    ];

    policeProbables.forEach((p, idx) => {
      allPyqs.push({
        id: `crim-pyq-u6-${idx + 2}`,
        number: p.num,
        year: 'DU Expected / Practice',
        marks: '10–15 Marks',
        type: 'Problem & Analytical',
        unitNumber: 6,
        unit: title,
        file: relPath,
        anchorId: 'pyq',
        question: p.q,
        modelAnswer: p.ans
      });
    });
  }

  // Unit 7: Prison System Cases and PYQs
  if (unitNum === 7) {
    allCases.push(
      {
        id: 'crim-c-u7-1',
        name: 'Rama Murthy v. State of Karnataka',
        citation: 'AIR 1997 SC 1739; (1997) 2 SCC 642',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'ramamurthy',
        facts: `<p>Originating from a handwritten letter by prisoner Rama Murthy detained in Central Jail, Bangalore, detailing grave prison grievances: denial of wages, inedible food, rampant medical neglect, and physical torture, corroborated by a 300-page inquiry report by the District Judge.</p>`,
        issues: `<p>1. What are the primary systemic pathologies plaguing Indian prison administration under the Prisons Act, 1894?<br>2. What judicial guidelines and institutional directives are required to enforce fundamental human rights of prisoners under Art. 21?</p>`,
        arguments: `<b>PETITIONER / AMICUS:</b> Incarceration does not strip a citizen of Art. 21 rights. Systemic delays, torture, and unhygienic conditions violate human dignity.<br><br><b>STATE:</b> Prison discipline requires firm control; resource and financial constraints limit infrastructure modernization.`,
        ratio: `<p>The Supreme Court formulated the classic <b>NINE PROBLEMS OF PRISON ADMINISTRATION</b>:<br>(1) Overcrowding;<br>(2) Delay in trial;<br>(3) Torture and ill-treatment;<br>(4) Neglect of health and hygiene;<br>(5) Insufficient food and clothing;<br>(6) Prison vices and corruption;<br>(7) Communication deficiencies;<br>(8) Streamlining of visits (interviews/conjugal visits);<br>(9) Management of open-air prisons.</p><p>The Court issued <b>TEN REMEDIAL DIRECTIONS</b> including: implementation of Law Commission 78th Report, Mulla Committee Chapter 20 (remission/parole), framing a modern All-India Model Jail Manual, installing complaint boxes accessible only to judicial visitors, and establishing open prisons at district headquarters.</p>`,
        principleEvolved: `<p>Prisoners remain "persons" entitled to Art. 21 protections. The purpose of modern imprisonment is reformation and social reintegration, not institutional degradation.</p>`,
        examTips: `<p>This is the master authority for any question on Indian prison reform. Always organize your answers around the 9 problems and 10 directions.</p>`
      },
      {
        id: 'crim-c-u7-2',
        name: 'Re: Inhuman Conditions in 1382 Prisons',
        citation: '(2016) 3 SCC 700; 2017 SCC OnLine SC 1109',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'prisons1382',
        facts: `<p>Suo motu PIL registered pursuant to a letter by former CJI R.C. Lahoti to the Supreme Court highlighting horrific overcrowding, unnatural deaths, and lack of medical personnel across 1,382 prisons in India.</p>`,
        issues: `<p>How to institutionalize continuous monitoring of undertrial detention and implementation of statutory bail remedies across all Indian districts?</p>`,
        arguments: `Amicus Curiae emphasized that undertrials constitute over 67% of prison population, held in violation of S. 436A CrPC.<br><br>States pleaded budgetary constraints and delay in court trials.`,
        ratio: `<p>The Supreme Court made <b>Undertrial Review Committees (UTRCs)</b> mandatory in every district, meeting quarterly comprising District Judge, DM, SP, and DLSA Secretary.<br>Mandated active release under S. 436A CrPC (now S. 479 BNSS) and nationwide adoption of the Model Prison Manual, 2016.</p>`,
        principleEvolved: `<p>Overcrowding constitutes a per se violation of human dignity under Art. 21, creating an affirmative duty upon the judiciary to monitor custodial conditions.</p>`,
        examTips: `<p>Cite when discussing S. 479 BNSS, UTRC functioning, and modern undertrial release mechanisms.</p>`
      },
      {
        id: 'crim-c-u7-3',
        name: 'Sukanya Shantha v. Union of India',
        citation: '2024 INSC 753 (Decided 3 October 2024)',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'sukanya',
        facts: `<p>A writ petition challenging archaic provisions in various State Prison Manuals (Uttar Pradesh, Rajasthan, Madhya Pradesh, West Bengal) that institutionalized division of labor and barrack segregation based on caste hierarchy (e.g. assigning scavenging and manual cleaning exclusively to lower castes while cooking was reserved for upper castes).</p>`,
        issues: `<p>Whether caste-based division of prison labor and barrack segregation violates Arts. 14, 15, 17, 21, and 23 of the Constitution?</p>`,
        arguments: `<b>PETITIONER:</b> Segregating inmates and allocating menial tasks based on caste perpetuates untouchability and institutionalizes caste discrimination within State custody.<br><br><b>STATES:</b> Provisions were colonial legacies meant to preserve prison harmony and religious dietary customs.`,
        ratio: `<p>Supreme Court (D.Y. Chandrachud C.J., J.B. Pardiwala & Manoj Misra JJ.) struck down all caste-based rules in State Prison Manuals as unconstitutional.<br>1. Caste discrimination behind prison walls violates Arts. 14, 15(1), and 21, and amounts to enforcement of untouchability under Art. 17.<br>2. Directed all States/UTs to revise Prison Manuals within 3 months, eliminating caste references.<br>3. Directed the Union to remove caste references from the Model Prisons and Correctional Services Act, 2023.</p>`,
        principleEvolved: `<p>The constitutional promise of equality and dignity under Arts. 14 and 17 follows a prisoner inside the jail gates; State institutions cannot legitimize caste hierarchies.</p>`,
        examTips: `<p>The latest 2024 constitutional precedent on prison administration — essential for high scores in prison reform questions.</p>`
      },
      {
        id: 'crim-c-u7-4',
        name: 'Transgender Persons in Prisons (MHA Advisory & Jurisprudence)',
        citation: 'MHA Advisory dated 10 January 2022; NALSA v. UOI (2014) 5 SCC 438',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'transgender',
        facts: `<p>Persistent human rights reports of severe custodial sexual exploitation, bodily abuse, and arbitrary segregation of transgender inmates in male prisons lacking specialized wards.</p>`,
        issues: `<p>How must prison administrations accommodate and safeguard transgender inmates in compliance with the Transgender Persons (Protection of Rights) Act, 2019 and <i>NALSA</i>?</p>`,
        arguments: `Incarceration in binary male/female wards violates right to self-perceived gender identity and exposes transgender individuals to grave violence.`,
        ratio: `<p>MHA issued comprehensive national directives:<br>1. Creation of separate transgender wards in all prisons maintaining privacy and safety without isolating them completely from prison community life;<br>2. Right to self-perceived gender identity recognized at reception;<br>3. Search and bodily inspection conducted strictly by personnel of the same self-identified gender;<br>4. Access to healthcare, gender-affirming treatments, and specialized counseling.</p>`,
        principleEvolved: `<p>Gender identity is an integral facet of dignity and autonomy under Art. 21, requiring specialized custodial protection.</p>`,
        examTips: `<p>Highlight as a modern human-rights development under Unit 7 alongside the Model Prisons Act 2023.</p>`
      }
    );

    // Unit 7 PYQs
    allPyqs.push(
      {
        id: 'crim-pyq-u7-1',
        number: 'Q5',
        year: '2022',
        marks: '15 Marks',
        type: 'Problem & Analytical',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'pyq',
        question: 'According to NCRB 2019 data, prison occupancy stood at 118.4% with over 64% undertrials. To what extent have the recommendations in Rama Murthy v. State of Karnataka been applied? Critically evaluate.',
        modelAnswer: `<p><b>Introduction:</b> The question highlights the persistent implementation gap in Indian prison reform. NCRB 2019 figures reveal 4,78,600 inmates packed against a sanctioned capacity of 4,03,739 (118.4% occupancy), with undertrials forming ~64%, more than two decades after <i>Rama Murthy v. State of Karnataka</i>, AIR 1997 SC 1739 delivered its comprehensive reform charter under Art. 21 and UN Standard Minimum Rules.</p>
<p><b>The Rama Murthy Charter:</b> Arising from a prisoner's letter, the Court diagnosed 9 systemic pathologies (overcrowding, trial delay, torture, hygiene, poor diet, vice, communication barriers, unsystematic visits, open prison neglect) and formulated 10 actionable directions.</p>
<p><b>Extent of Application — Tangible Gains:</b><br>
1. <b>Legislative Relief:</b> Enactment of S. 436A CrPC (2005) now reinforced as S. 479 BNSS (release at 1/2 maximum term, 1/3 for first-time offenders).<br>
2. <b>Institutional Machinery:</b> <i>Re: Inhuman Conditions in 1382 Prisons</i> (2016) institutionalized quarterly Undertrial Review Committees (UTRCs) in every district.<br>
3. <b>Administrative Modernization:</b> Promulgation of the Model Prison Manual 2016 and Model Prisons Act 2023, shifting philosophy from deterrence to reformation.<br>
4. <b>Constitutional Purging:</b> <i>Sukanya Shantha v. UOI</i> (2024) struck down caste-based labor and barrack segregation.<br>
5. <b>Specialized Care:</b> MHA 2022 Transgender Advisory and women inmate safeguards post-<i>R.D. Upadhyaya</i>.</p>
<p><b>Critical Evaluation — Systemic Shortfalls:</b> Despite judicial directives, overcrowding remains acute (over 130% in several States). Open prisons remain drastically under-utilized (~3,786 inmates vs ~25,776 capacity — Vibhute Review). Fundamental impediments include: (a) "Prisons" being a State subject (Entry 4 List II); (b) chronic fiscal under-funding; and (c) political apathy as prisoners lack voting franchise (S. 62(5) RP Act 1951).</p>
<p><b>Conclusion:</b> <i>Rama Murthy</i> supplied the diagnosis and prescription; <i>1382 Prisons</i> built the machinery; but without executive political will and budgetary allocation, reform remains, in the Court's words, "promises to keep and miles to go."</p>`
      },
      {
        id: 'crim-pyq-u7-2',
        number: 'Q8(b)',
        year: '2017',
        marks: '15 Marks',
        type: 'Essay',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'pyq',
        question: '“Prisons serve reformation but suffer problems needing immediate attention, else breeding grounds of delinquency” — Discuss the reforms on foot.',
        modelAnswer: `<p><b>Theoretical Premise:</b> Incarceration in modern penology aims at rehabilitation (<i>Mohd. Giasuddin</i>; Dr. Sethna: "prisons as moral hospitals"). However, systemic neglect transforms prisons into schools of crime where first-time offenders are contaminated by hardened recidivists.</p>
<p><b>The 9 Core Problems & Ongoing Reforms:</b><br>
1. <b>Overcrowding:</b> Addressed via S. 479 BNSS, UTRC reviews, plea bargaining, and Lok Adalat compounding.<br>
2. <b>Speedy Trial:</b> Monitored through e-prisons infrastructure and video-conferencing production (S. 187 BNSS).<br>
3. <b>Torture & Ill-treatment:</b> Controlled through CCTV mandates (<i>Paramvir Singh Saini</i>) and strict compliance with <i>Sunil Batra</i> directives.<br>
4. <b>Health & Diet:</b> Implementation of Mulla Chapter 29 and mandatory regular health check-ups.<br>
5. <b>Open Prisons:</b> Expansion of open-air camps (Sampurnanand, Sanganer) offering trust-based community living to foster reintegration.<br>
6. <b>Parole & Furlough:</b> Liberalized quasi-judicial parole jurisprudence (<i>Poonam Lata</i>, <i>Dharamvir</i>) preventing snapped family ties.</p>
<p><b>Conclusion:</b> Institutionalization of the Model Prisons Act 2023 provides a statutory framework for true reformation, provided ground-level funding and administrative training keep pace.</p>`
      }
    );

    const prisonProbables = [
      {
        num: 'P1',
        q: 'Discuss the fundamental rights of prisoners under Article 21 with landmark Indian decisions.',
        ans: `<p><b>Constitutional Matrix:</b> Incarceration does not extinguish fundamental rights. A convict retains all rights except those necessarily circumscribed by imprisonment.<br>
1. <i>D.B.M. Patnaik</i> (1974): Inmates are not denuded of fundamental rights.<br>
2. <i>Sunil Batra I & II</i> (1978, 1980): Ban on solitary confinement without judicial sanction; bar on bar-fetters; letter to judge treated as habeas corpus.<br>
3. <i>Prem Shankar Shukla</i> (1980): Routine handcuffing violates human dignity.<br>
4. <i>Francis Coralie Mullin</i> (1981): Right to interviews with family and legal counsel is part of Art. 21.<br>
5. <i>R.D. Upadhyaya</i> (2007): Rights of female prisoners and children living in prisons.<br>
6. <i>Sukanya Shantha</i> (2024): Ban on caste-based division of prison work.</p>`
      },
      {
        num: 'P2',
        q: 'Critically examine the concept of Open Prisons in India in the light of K.I. Vibhute\'s fifty-five years review.',
        ans: `<p><b>Definition & Philosophy:</b> Open prisons (open-air institutions) function on minimal security, self-discipline, and inmate trust (UN 1955 SMR).<br>
<b>Advantages:</b> Removes physical and psychological degradation of closed cells, prevents moral contamination, promotes economic self-sufficiency through agriculture/trades, and eases transition to free society.<br>
<b>Vibhute\'s Findings & Critique:</b> Despite proven success (Sanganer camp, Sampurnanand Shivir), open prisons remain severely under-utilized (~15% of capacity) due to bureaucratic conservatism, ambiguous selection criteria, and exclusion of lifers under S. 433A CrPC.<br>
<b>Recommendation:</b> Mandatory establishment of open institutions in every district as directed in <i>Rama Murthy</i>.</p>`
      }
    ];

    prisonProbables.forEach((p, idx) => {
      allPyqs.push({
        id: `crim-pyq-u7-${idx + 3}`,
        number: p.num,
        year: 'DU Expected / Practice',
        marks: '10–15 Marks',
        type: 'Problem & Analytical',
        unitNumber: 7,
        unit: title,
        file: relPath,
        anchorId: 'pyq',
        question: p.q,
        modelAnswer: p.ans
      });
    });
  }

  // ---------------------------------------------------------------------------
  // BUILD RAPID REVISION CAPSULES (ONE PER UNIT)
  // ---------------------------------------------------------------------------
  const revisionTables = {
    1: {
      headers: ['School / Thinker', 'Core Premise', 'Landmark Precedent / Concept'],
      rows: [
        ['Pre-Classical', 'Demonological / spiritual causation; crime as sin/possession', 'Trial by ordeal; divine punishment'],
        ['Classical (Beccaria)', 'Free will, hedonistic calculus, proportion between crime & penalty', 'Prompt, certain & public punishment over severity'],
        ['Bentham Utilitarianism', 'Felicific calculus (pain vs pleasure); deterrence & prevention', 'Panopticon prison design; utilitarian penal code'],
        ['Positivist (Lombroso)', 'Born criminal; atavism, biological & physical determinism', 'Focus shifts from crime to criminal (scientific positivism)'],
        ['Differential Association', 'Sutherland: crime is learned in interaction within intimate groups', 'White collar crime; frequency, duration & intensity of contacts'],
        ['Anomie Theory', 'Merton: structural strain between cultural goals & institutional means', 'Innovators, conformists, ritualists, retreatists & rebels'],
        ['Labeling Theory', 'Becker: deviance is created by societal reaction and labeling', 'Self-fulfilling prophecy; secondary deviance']
      ],
      strategy: 'Map causation from spiritual → individual (Beccaria/Lombroso) → social (Sutherland/Merton). Contrast classical free-will with positivist determinism.',
      caseMap: 'R v. Craddock (PMT defence), Ediga Anamma commuted, Sukanya Shantha (caste bias).'
    },
    2: {
      headers: ['Crime Typology', 'Key Characteristic & Statutory Base', 'Leading Authority'],
      rows: [
        ['Mala In Se vs Prohibita', 'Inherently immoral (murder, rape) vs prohibited by statute (licensing)', 'Strict liability in socio-economic offences'],
        ['White Collar Crime', 'Offence by person of high social status in course of occupation', 'Sutherland concept; 47th Law Commission Report'],
        ['Organised Crime', 'Syndicates, continuing unlawful activity for economic gain', 'MCOCA 1999; human trafficking under BNS 143'],
        ['Cyber Crimes', 'Computer as target or weapon; hacking, spoofing, domain passing off', 'Rediff Communications; Satyam Infoway; Yahoo! v. Akash Arora'],
        ['Socio-Economic Offences', 'Harm to community health/economy; absence of individual victim', 'PC Act 1988; PMLA 2002; FSSA 2006; NDPS 1985']
      ],
      strategy: 'Highlight why traditional mens rea is diluted in welfare offences. Connect white collar crime with Sutherland and organised networks with Palermo Protocol.',
      caseMap: 'Rediff Communications (domain name TM), Satyam Infoway (passing off), Yahoo! (cybersquatting).'
    },
    3: {
      headers: ['JJ Act Provision / Topic', 'Substantive Rule & Age Limits', 'Key Precedent'],
      rows: [
        ['Doli Incapax & Child Definition', 'Child = below 18 yrs; absolute immunity below 7 yrs (S. 82 IPC / BNS)', 'Raghbir v. State of Haryana (S. 27 CrPC enabling)'],
        ['Bar on Jail / Lockup', 'No child in conflict with law may be placed in adult prison or police lockup', 'Sheela Barse v. UOI; Sanjay Suri v. Delhi Admin'],
        ['Age Determination', 'Age on date of commission; school certificate / matriculation conclusive', 'Rishipal Singh Solanki; Vinod Katara'],
        ['JJB vs CWC', 'JJB deals with CCL (Magistrate + 2 social workers); CWC handles CNCP', 'Child in Conflict with Law v. Karnataka (2024)'],
        ['Heinous Offences (16–18)', 'Preliminary assessment under S. 15 JJ Act for trial as adult', 'Barun Chandra Thakur (Master Bholu); Rahul Kumar Yadav']
      ],
      strategy: 'Differentiate Child in Conflict with Law (CCL) from Child in Need of Care and Protection (CNCP). Memorize S. 15 preliminary assessment sequence.',
      caseMap: 'Sheela Barse (no child in jail), Sanjay Suri (age on warrant), Master Bholu (preliminary assessment rigor).'
    },
    4: {
      headers: ['Theory / Doctrine', 'Core Legal Principle', 'Leading Landmark Case'],
      rows: [
        ['Retributive Theory', 'Lex talionis; punishment proportioned to moral desert', 'Ashworth desert theory; Kant & Hegel'],
        ['Deterrent Theory', 'Exemplary penalty to deter potential offenders', 'Bentham; Ashworth general vs individual deterrence'],
        ['Reformative Theory', 'Crime as social pathology; treatment & rehabilitation', 'Mohd. Giasuddin; Ediga Anamma (Krishna Iyer J.)'],
        ['Constitutionality of Death Penalty', 'Death penalty under S. 302 IPC is constitutional; procedure is guided', 'Jagmohan Singh (1973); Bachan Singh (1980)'],
        ['Rarest of Rare Doctrine', 'Death only when alternative option is unquestionably foreclosed', 'Bachan Singh (1980); Machhi Singh (1983)'],
        ['Special Remission Limits', 'Life imprisonment without remission for fixed 20–30 years', 'Swamy Shraddananda (2008)']
      ],
      strategy: 'Organize penology answers around the R-D-P-R matrix (Retribution, Deterrence, Prevention, Reformation). Structure Bachan Singh balance sheet: Aggravating vs Mitigating factors.',
      caseMap: 'Jagmohan Singh, Ediga Anamma, Bachan Singh (5-judge bench), Machhi Singh, Swamy Shraddananda.'
    },
    5: {
      headers: ['Victimology Topic / S.', 'Core Provision & Operating Mechanism', 'Leading Landmark Precedent'],
      rows: [
        ['Meaning & Scope', 'Lynch-pin of Criminology; forgotten person → rights holder', 'Mendelsohn & Von Hentig; UN Declaration 1985'],
        ['BNSS 395 (CrPC 357)', 'Offender-pays compensation from fine (1) or direct without fine (3)', 'Hari Kishan; Jacob George; Rachhpal Singh'],
        ['BNSS 396 (CrPC 357A)', 'State Victim Compensation Scheme via DLSA/SLSA; covers acquittal & untraced', 'State of Punjab v. Ajaib Singh (₹5L on acquittal)'],
        ['BNSS 397 (CrPC 357C)', 'Mandatory free first-aid and medical treatment in all hospitals', 'Laxmi v. Union of India (₹3L floor; BNS 200 teeth)'],
        ['Victim Anonymity & Shield', 'Absolute ban on disclosing name or indirect identifiers (BNS 72)', 'Nipun Saxena v. UOI (2019); NALSA Scheme 2018'],
        ['Constitutional Tort', 'Monetary amends for violation of Art. 21 in custodial abuse', 'Chandrima Das (₹10L for foreign rape victim); D.K. Basu']
      ],
      strategy: 'Contrast BNSS 395 (offender pays) with BNSS 396 (State VCS). Cite Nipun Saxena for anonymity and Laxmi for acid attack compensation.',
      caseMap: 'Ajaib Singh (acquittal compensation), Jacob George (rehab fund), Chandrima Das (foreigner Art. 21), Nipun Saxena (identity shield).'
    },
    6: {
      headers: ['Police Reform Element', 'Institutional Structure & Binding Requirement', 'Governing Authority'],
      rows: [
        ['Directive 1: SSC', 'State Security Commission to shield police from political influence', 'Prakash Singh (Directive 1); NHRC model'],
        ['Directive 2: DGP Tenure', 'UPSC panel of 3; minimum 2-year tenure irrespective of superannuation', 'Prakash Singh (Directive 2); T.P. Senkumar (2017)'],
        ['Directive 3: Field Tenures', 'Minimum 2-year tenure for IG, DIG, SP, and SHO', 'Prakash Singh (Directive 3); 11-1-2007 order'],
        ['Directive 4: Wing Separation', 'Separation of investigation from law & order in 10L+ cities', 'Prakash Singh (Directive 4); NPC 8th Report'],
        ['Directive 5: PEB', 'DGP + 4 officers for departmental postings/transfers up to DySP', 'Prakash Singh (Directive 5)'],
        ['Directive 6: PCA', 'District & State Complaints Authorities for serious custodial misconduct', 'Prakash Singh (Directive 6); retired judges'],
        ['Custodial Arrest Norms', 'Check on routine arrest; mandatory notice & guidelines', 'D.K. Basu; Joginder Kumar; Arnesh Kumar; S. 35 BNSS']
      ],
      strategy: 'State all 7 Prakash Singh directives by number. Cite Senkumar as the proof of judicial enforcement. Note police is Entry 2 List II State subject.',
      caseMap: 'Prakash Singh (2006), T.P. Senkumar (2017), D.K. Basu (1997), Nilabati Behera (1993).'
    },
    7: {
      headers: ['Prison Reform Element', 'Core Institutional Mechanism', 'Leading Landmark Case'],
      rows: [
        ['Rama Murthy Charter', '9 problems (overcrowding, delay, torture) & 10 directions', 'Rama Murthy v. Karnataka (1997)'],
        ['UTRCs & Overcrowding', 'Quarterly Undertrial Review Committees in every district', 'Re: Inhuman Conditions in 1382 Prisons (2016)'],
        ['S. 479 BNSS (436A CrPC)', 'Mandatory release of undertrials at 1/2 term (1/3 for first timers)', 'S. 479 BNSS; 1382 Prisons monitoring'],
        ['Abolition of Caste Bias', 'Striking down caste-based work and barrack segregation in prison manuals', 'Sukanya Shantha v. UOI (2024 INSC 753)'],
        ['Transgender Inmates', 'Separate transgender wards, self-perceived gender, privacy & safety', 'MHA Advisory (10-1-2022); NALSA (2014)'],
        ['Open Prisons Experience', 'Trust-based, minimum security institutions; economic self-reliance', 'K.I. Vibhute 55-Year Review; Dharamvir v. UP'],
        ['Parole vs Furlough', 'Furlough = right/remission; Parole = conditional/cause shown', 'Maharashtra v. Suresh Darvekar; Poonam Lata']
      ],
      strategy: 'Organize prison reform answers into the Rama Murthy 9-problem frame. Highlight 2024 Sukanya Shantha ruling and modern S. 479 BNSS undertrial relief.',
      caseMap: 'Rama Murthy (1997), 1382 Prisons (2016), Sukanya Shantha (2024), Suresh Darvekar (furlough).'
    }
  };

  const revInfo = revisionTables[unitNum];
  allRevisions.push({
    id: `crim-rev-u${unitNum}`,
    unitNumber: unitNum,
    unitTitle: title,
    badge: `Unit ${unitNum} Capsule`,
    title: `${title} — Rapid Revision Capsule`,
    anchorId: file.includes('police') ? 'revise' : (file.includes('prison') ? 'revise' : `rev-crim-u${unitNum}`),
    file: relPath,
    type: 'Master Revision Capsule',
    table: {
      headers: revInfo.headers,
      rows: revInfo.rows
    },
    examStrategy: revInfo.strategy,
    caseMap: revInfo.caseMap
  });
});

console.log(`\n📊 Extraction Complete:`);
console.log(`- Total Landmark Cases (FIRAC): ${allCases.length}`);
console.log(`- Total Past Year & Practice Questions (PYQs): ${allPyqs.length}`);
console.log(`- Total Master Revision Capsules: ${allRevisions.length}`);

// -----------------------------------------------------------------------------
// STEP 3: REGISTER CRIMINOLOGY IN JS/DATA.JS
// -----------------------------------------------------------------------------
const dataJsPath = path.join(rootDir, 'js', 'data.js');
const dataJsRaw = fs.readFileSync(dataJsPath, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);

const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

const criminologySubject = {
  id: 'criminology',
  code: 'LB-5033',
  name: 'Criminology',
  shortName: 'Criminology',
  semester: 5,
  folder: 'SEM 5/Criminology',
  theme: {
    primary: '#1e293b',
    primaryDark: '#0f172a',
    primaryLight: '#334155',
    accent: '#b45309',
    accentLight: '#fef3c7',
    bgTint: '#f8fafc',
    border: '#e2e8f0',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #b45309 100%)',
    tagline: 'Criminological Theories, Indian Crime Reality, Juvenile Delinquency, Penology, Victimology & Police/Prison Reforms',
    motto: 'Crime Causation • Penology • Victim Justice • Custodial Reforms',
    quote: 'The mood and temper of the public in regard to the treatment of crime and criminals is one of the most unfailing tests of the civilisation of any country. — Winston Churchill',
    icon: 'fa-gavel'
  },
  units: [
    {
      id: 'crim-u1',
      number: 1,
      title: 'Unit 1: Criminological Theories: Explaining Crime Causation',
      subtitle: 'Topic 2 – Criminological Theories: Classical, Positivist, Sociological, Anomie & Labeling Schools | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/Topic2_Criminology_DU.html',
      statutes: [
        'Indian Penal Code 1860 / BNS 2023',
        'Mental Healthcare Act 2017',
        'Model Prisons Act 2023',
        'Probation of Offenders Act 1958'
      ],
      topics: [
        'The Dilemma of Causation: Demonological & Pre-Classical Thought',
        'Classical School (Beccaria) & Felicific Calculus (Bentham)',
        'Positivist School: Lombroso Born Criminal & Biological Determinism',
        'Sociological Explanations: Sutherland Differential Association & Merton Anomie',
        'Feminist Criminology, Labeling Theory & Marginalized Crime'
      ]
    },
    {
      id: 'crim-u2',
      number: 2,
      title: 'Unit 2: The Indian Crime Reality (Organised, White Collar & Cyber Crimes)',
      subtitle: 'Topic 3 – The Indian Crime Reality: Crime Typologies, Mala In Se vs Prohibita, Cyber Crimes & Organized Networks | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/Topic3_Criminology_DU.html',
      statutes: [
        'Information Technology Act 2000',
        'Trade Marks Act 1999',
        'Prevention of Corruption Act 1988',
        'PMLA 2002',
        'NDPS Act 1985',
        'Immoral Traffic (Prevention) Act 1956',
        'MCOCA 1999'
      ],
      topics: [
        'Mala In Se vs Mala Prohibita & Strict Liability in Welfare Legislation',
        'Typology of Crimes: NCRB Statistics, Violent vs Property Crimes',
        'White Collar Crimes & Corporate Fraud (Sutherland Concept)',
        'Organised Crime Syndicates, Human Trafficking & Gangster Acts',
        'Cyber Crimes, Domain Name Disputes & Transnational Crime Reality'
      ]
    },
    {
      id: 'crim-u3',
      number: 3,
      title: 'Unit 3: Juvenile Delinquency & The Juvenile Justice Act, 2015',
      subtitle: 'Topic 4 – Juvenile Delinquency: Care & Protection, Children in Conflict with Law, JJB & CWC | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/Topic4_Criminology_DU.html',
      statutes: [
        'Juvenile Justice (Care and Protection of Children) Act, 2015',
        'JJ Model Rules 2016',
        'POCSO Act 2012',
        'Constitution of India Arts. 15(3), 39(e), 39(f)',
        'UN CRC 1989'
      ],
      topics: [
        'Concept of Delinquency, Doli Incapax (S. 82/83 IPC / BNS) & Age Determination',
        'Evolution of Juvenile Justice Law: Reformatory Schools Act 1897 to JJ Act 2015',
        'Child in Need of Care and Protection vs Child in Conflict with Law',
        'Juvenile Justice Board (JJB) & Child Welfare Committee (CWC): Powers & Procedure',
        'Preliminary Assessment for Heinous Offences (16–18 Years) & Bar on Adult Jail'
      ]
    },
    {
      id: 'crim-u4',
      number: 4,
      title: 'Unit 4: Punishment and Its Justifications: Penology, Sentencing & Capital Punishment',
      subtitle: 'Topic 5 – Punishment & Penology: Retributive, Deterrent, Reformative Theories & Death Penalty Jurisprudence | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/Topic5_Criminology_DU.html',
      statutes: [
        'Indian Penal Code 1860 (S. 302/53) / BNS 2023 (S. 103/4)',
        'Code of Criminal Procedure 1973 (Ss. 235(2), 354(3), 366–371) / BNSS 2023',
        'Probation of Offenders Act 1958',
        'Constitution Arts. 14, 21, 72, 161'
      ],
      topics: [
        'Concept & Theories of Punishment: Retribution, Deterrence, Prevention, Reformation',
        'Sentencing Discretion: Pre-Sentence Hearing (S. 235(2) CrPC) & Mitigating Circumstances',
        'Capital Punishment Constitutionality: Jagmohan Singh to Bachan Singh',
        'The "Rarest of Rare" Doctrine: Aggravating vs Mitigating Circumstances (Machhi Singh)',
        'Alternative Sentencing, Life Imprisonment without Remission & Probation'
      ]
    },
    {
      id: 'crim-u5',
      number: 5,
      title: 'Unit 5: Victimology: Rights of Victims, Remedies & Compensation',
      subtitle: 'Topic 6 – Victimology: Meaning, Role of Victim in CJS, UN Declaration 1985 & Compensatory Jurisprudence | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/victimology-notes.html',
      statutes: [
        'BNSS 2023 (Ss. 395, 396, 397, 398, 413) / CrPC (Ss. 357, 357A, 357B, 357C, 372)',
        'BNS 2023 (Ss. 64–71, 72, 124, 200) / IPC (Ss. 376, 228A, 326A, 166B)',
        'UN Declaration of Basic Principles of Justice 1985 (GA Res 40/34)',
        'NALSA Compensation Scheme for Women Victims 2018'
      ],
      topics: [
        'Meaning, Nature & Scope of Victimology: Lynch-Pin of Criminology vs Penology',
        'Theories of Victimology: Victim Precipitation (Rejected) vs Routine Activities (Cohen & Felson)',
        'Role of Victim in CJS: Reporting, Investigation, Counsel, Sentencing & Appeal',
        'Compensation under BNSS 395 (Offender-Pays) vs BNSS 396 (State VCS Scheme)',
        'Victim Identity Shield (Nipun Saxena), Free Medical Aid (S. 397) & Restorative Justice'
      ]
    },
    {
      id: 'crim-u6',
      number: 6,
      title: 'Unit 6: The Indian Police System: Role, Custodial Violence & Police Reforms',
      subtitle: 'Topic 7 – Police Administration: Legal Functions, Custodial Controls & Prakash Singh Directives | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/police-system-notes.html',
      statutes: [
        'Police Act 1861',
        'Model Police Act 2006',
        'BNSS 2023 (Ss. 35, 173, 175, 187, 193) / CrPC (Ss. 41, 154, 156, 167, 173)',
        'Constitution of India Arts. 14, 21, 22, 32, 142'
      ],
      topics: [
        'Origin, Principles & Legal Functions of Police in Criminal Justice',
        'Custodial Violence & Judicial Controls: D.K. Basu Guidelines & S. 35 BNSS',
        'History of Police Reform Committees: NPC (1977–81), Ribeiro, Padmanabhaiah & Malimath',
        'Prakash Singh v. Union of India (2006): Seven Binding Directives under Art. 142',
        'Tenure Security of Police Leadership: T.P. Senkumar v. UOI (2017) & Enforcement'
      ]
    },
    {
      id: 'crim-u7',
      number: 7,
      title: 'Unit 7: The Indian Prison System: Prisoner Rights, Open Prisons & Prison Reforms',
      subtitle: 'Topic 8 – Prison Administration: Overcrowding, Undertrials, Rama Murthy Directives, Open Jails & Parole | DU LL.B. V Term LB-5033 Master Notes',
      file: 'SEM 5/Criminology/prison-system-notes.html',
      statutes: [
        'Prisons Act 1894',
        'Model Prison Manual 2016',
        'Model Prisons and Correctional Services Act 2023',
        'BNSS 2023 (Ss. 187, 430, 473–477, 479) / CrPC (Ss. 167, 389, 432–435, 436A)',
        'Probation of Offenders Act 1958'
      ],
      topics: [
        'Evolution of Prisons: Pennsylvanian vs Auburn Systems & UN Mandela Rules',
        'Problems of Indian Prison Administration: Overcrowding, Undertrials & Staffing',
        'Rama Murthy v. State of Karnataka (1997): 9 Problems & 10 Core Directions',
        'Inhuman Conditions in 1382 Prisons & Sukanya Shantha (2024 Caste Bias Abolition)',
        'Open Prisons Experience (Vibhute Review), Parole, Furlough vs Remission Jurisprudence'
      ]
    }
  ],
  cases: allCases,
  pyqs: allPyqs,
  revisions: allRevisions
};

// Add to subjects in portalData
portalData.subjects['criminology'] = criminologySubject;

// Update Semester 5 in portalData.semesters
const sem5 = portalData.semesters.find(s => s.id === 5);
if (sem5) {
  if (!sem5.subjectIds.includes('criminology')) {
    sem5.subjectIds.push('criminology');
  }
  sem5.badge = '4 Core Subjects (Drafting, Industrial Law, IT Laws, Criminology)';
  sem5.description = 'Comprehensive lecture notes, DU case material briefs, past year questions with model answers, and revision capsules for Drafting & Pleadings, Industrial Law, IT Laws, and Criminology.';
}

// Write back to js/data.js safely
const newContent = `// DU Law Notes Portal — Central Data Repository\n// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules\n// Comprehensive coverage across LL.B. syllabus\n\nwindow.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};\n`;
fs.writeFileSync(dataJsPath, newContent, 'utf8');
console.log('✅ js/data.js safely updated with Criminology (LB-5033)!');

// -----------------------------------------------------------------------------
// STEP 4: REGISTER IN JS/BOOKS_SHOWCASE.JS
// -----------------------------------------------------------------------------
const booksPath = path.join(rootDir, 'js', 'books_showcase.js');
let booksContent = fs.readFileSync(booksPath, 'utf8');

if (!booksContent.includes('id: "criminology"') && !booksContent.includes("id: 'criminology'")) {
  const crimBookConfig = `      {
        id: "criminology",
        code: "LB-5033",
        title: "Criminology",
        author: "LB-5033 • Make Law Easy",
        year: "2025–26",
        stars: 5,
        unitsCount: "7 Comprehensive Units",
        casesCount: "${allCases.length} Landmark Cases",
        desc: "Criminological Theories, Indian Crime Reality, Juvenile Delinquency, Penology, Victimology & Police/Prison Reforms.",
        spineBg: "#1e293b",
        spineInk: "#fbbf24",
        spineFont: "700 36px Georgia",
        backBg: "#0f172a",
        backInk: "251,191,36",
        edge: "#fef3c7",
        chapters: [
          "Unit 1: Criminological Theories: Explaining Crime Causation",
          "Unit 2: The Indian Crime Reality (Organised, White Collar & Cyber Crimes)",
          "Unit 3: Juvenile Delinquency & The Juvenile Justice Act, 2015",
          "Unit 4: Punishment and Its Justifications: Penology & Capital Punishment",
          "Unit 5: Victimology: Rights of Victims, Remedies & Compensation",
          "Unit 6: The Indian Police System: Role, Custodial Violence & Police Reforms",
          "Unit 7: The Indian Prison System: Prisoner Rights, Open Prisons & Prison Reforms"
        ]
      },`;

  // Find where semester 5 books array starts
  const sem5Index = booksContent.indexOf('5: [');
  if (sem5Index !== -1) {
    const itLawsIndex = booksContent.indexOf('id: "it_laws"', sem5Index);
    if (itLawsIndex !== -1) {
      // Find the closing brace of it_laws object
      const nextEndBrace = booksContent.indexOf('}', itLawsIndex);
      // Insert right after that object
      booksContent = booksContent.slice(0, nextEndBrace + 1) + ',\n' + crimBookConfig + booksContent.slice(nextEndBrace + 1);
      fs.writeFileSync(booksPath, booksContent, 'utf8');
      console.log('✅ js/books_showcase.js updated with Criminology 3D book!');
    }
  }
} else {
  console.log('ℹ️ js/books_showcase.js already includes Criminology');
}

// -----------------------------------------------------------------------------
// STEP 5: REGISTER IN INDEX.HTML
// -----------------------------------------------------------------------------
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

let indexModified = false;
if (!indexContent.includes('value="criminology"')) {
  // 1. Comments filter
  if (indexContent.includes('<option value="it_laws">Information Technology Law (LB-5031)</option>')) {
    indexContent = indexContent.replace(
      '<option value="it_laws">Information Technology Law (LB-5031)</option>',
      '<option value="it_laws">Information Technology Law (LB-5031)</option>\n                <option value="criminology">Criminology (LB-5033)</option>'
    );
    indexModified = true;
  }

  // 2. Compose filter
  if (indexContent.includes('<option value="it_laws">Information Technology Law (LB-5031)</option>')) {
    // Note: the second occurrence
    const secondIdx = indexContent.lastIndexOf('<option value="it_laws">Information Technology Law (LB-5031)</option>');
    if (secondIdx !== -1) {
      indexContent = indexContent.slice(0, secondIdx) +
        '<option value="it_laws">Information Technology Law (LB-5031)</option>\n                    <option value="criminology">Criminology (LB-5033)</option>' +
        indexContent.slice(secondIdx + '<option value="it_laws">Information Technology Law (LB-5031)</option>'.length);
      indexModified = true;
    }
  }

  // 3. Mock selection
  if (indexContent.includes('<option value="it_laws">Information Technology Law (Semester 5)</option>')) {
    indexContent = indexContent.replace(
      '<option value="it_laws">Information Technology Law (Semester 5)</option>',
      '<option value="it_laws">Information Technology Law (Semester 5)</option>\n          <option value="criminology">Criminology (Semester 5)</option>'
    );
    indexModified = true;
  }

  if (indexModified) {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ index.html updated with Criminology filter options!');
  }
} else {
  console.log('ℹ️ index.html already includes Criminology options');
}

console.log('\n🎉 ALL INGESTION STEPS EXECUTED SUCCESSFULLY!');
