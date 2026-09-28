const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING', 'SEM 5/Industrial law'
];

const refinedEngineCss = `/* ==========================================================================
   MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE (320px - 768px)
   Full Mobile Responsive: Zero Side-Margin Waste, 100% Full Vector Diagram
   Visibility, Zero Horizontal Viewport Wobble / Page Moving
   ========================================================================== */
@media screen and (max-width: 768px) {
  /* 1. Root & Viewport Safety: Zero Horizontal Wobble (Rule 3) */
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

  /* 2. Container Gutters: Remove Wasted Side Margins */
  .wrap, .layout, .container, .page-wrap, main, article, .dossier, .content {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-top: 0 !important;
    padding-bottom: 30px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  /* Hide sticky desktop sidebar TOC on mobile */
  nav#toc, aside.sidebar, .toc-sidebar, #toc {
    display: none !important;
  }

  /* 3. Hero & Header Responsive Scaling */
  header.hero, .hero, .header, .top-bar, .topbar {
    padding: 24px 12px 20px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    position: relative !important;
    overflow: hidden !important;
  }

  header.hero h1, .hero h1, .topbar h1, h1 {
    font-size: clamp(20px, 5.8vw, 30px) !important;
    line-height: 1.2 !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  header.hero .lede, .hero p, .hero-sub, .lead, .sub {
    font-size: 14px !important;
    line-height: 1.48 !important;
  }

  /* Decorative Crests in Hero Banners */
  svg.crest, .hero-crest, .hero svg.crest, svg.crest-mark {
    width: 70px !important;
    height: 70px !important;
    max-width: 70px !important;
    max-height: 70px !important;
    opacity: 0.18 !important;
    position: absolute !important;
    right: 8px !important;
    top: 8px !important;
    pointer-events: none !important;
  }

  svg.hero-visual {
    max-width: 120px !important;
    height: auto !important;
    margin: 8px auto !important;
    display: block !important;
  }

  svg[viewBox="0 0 24 24"], svg.icon, .icon svg {
    width: 18px !important;
    height: 18px !important;
    min-width: 0 !important;
    max-width: 24px !important;
    display: inline-block !important;
  }

  /* 4. Horizontal Navigation (nav.toc) Smooth Touch Swipe */
  nav.toc {
    position: sticky !important;
    top: 0 !important;
    z-index: 50 !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  nav.toc .wrap {
    display: flex !important;
    gap: 2px !important;
    overflow-x: auto !important;
    padding: 0 8px !important;
    width: max-content !important;
    max-width: none !important;
  }

  nav.toc a {
    padding: 10px 9px !important;
    font-size: 12px !important;
  }

  /* 5. Sections & Cards: Compact Mobile Padding (Eliminates Blank Side Margins) */
  section, section.card, .section, .block, .card, .cassheet, .case, .pyq, .box,
  .statute, .illus, .note, .exam, .warn, .ratio, .teal, .toc, .pyqbox, .sourceband {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding: 14px 10px !important;
    margin: 10px 0 !important;
    border-radius: 10px !important;
    box-sizing: border-box !important;
  }

  .hsub {
    padding-left: 0 !important;
    margin-left: 0 !important;
    margin-bottom: 12px !important;
  }

  .secnum {
    width: 32px !important;
    height: 32px !important;
    font-size: 14px !important;
    margin-right: 8px !important;
    border-radius: 8px !important;
  }

  /* 6. DIAGRAMS & FLOWCHARTS: 100% FULL VISIBILITY & CONTAINMENT */
  .fig, .figure, .scene, .svgwrap, figure, .case-visual, .diagram-wrap, .flow-svg {
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
  svg, .fig svg, .figure svg, .scene svg, .svgwrap svg, .flow-svg svg, .flow svg, svg.diagram,
  svg[width]:not(.icon):not([width="18"]):not([width="20"]):not([width="24"]) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    height: auto !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
  }

  /* Captions & badges on figures & scenes */
  .fig .cap, .fig .caption, .fcap, .scene .badge, .scene .cap {
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

  /* 7. CSS FLOWCHARTS (.flow, .node, .ar, .dn, .step) */
  .flow:not(.flow-svg):not(:has(svg)) {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    gap: 8px !important;
    padding: 12px 8px !important;
    margin: 14px 0 !important;
    background: var(--paper, #f8fafc) !important;
    border: 1px solid var(--line, #e2e8f0) !important;
    border-radius: 10px !important;
  }

  .flow .node, .flow > .node, .flow.horizontal .node {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    box-sizing: border-box !important;
    margin: 2px 0 !important;
    padding: 10px 12px !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    text-align: center !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  .flow .node small, .flow > .node small {
    display: block !important;
    font-size: 11.5px !important;
    line-height: 1.4 !important;
    margin-top: 3px !important;
  }

  /* Flow arrows: rotate horizontal '→' 90deg into vertical down arrow '↓' */
  .flow .ar, .flow span.ar, .flow > .ar {
    display: block !important;
    transform: rotate(90deg) !important;
    margin: 2px auto !important;
    text-align: center !important;
    font-size: 18px !important;
    line-height: 1 !important;
    padding: 2px 0 !important;
    width: auto !important;
  }

  .flow .dn {
    display: block !important;
    flex-basis: auto !important;
    height: auto !important;
    margin: 2px auto !important;
    font-size: 18px !important;
  }

  .flow .step, .flow > .step {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin: 3px 0 !important;
    padding: 10px 12px !important;
    font-size: 13px !important;
    line-height: 1.48 !important;
    text-align: center !important;
  }

  .flow.vertical {
    width: 100% !important;
    max-width: 100% !important;
    padding: 10px 6px !important;
  }

  .flow.vertical .node {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 8. FAMILY LAW DECISION TREES (.decision-tree, .branches, .branch) */
  .decision-tree {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 14px 8px !important;
    margin: 14px 0 !important;
    background: #f1f5f9 !important;
    border-radius: 10px !important;
  }

  .decision-tree .root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto 10px !important;
    text-align: center !important;
  }

  .branches {
    display: flex !important;
    flex-direction: column !important;
    grid-template-columns: 1fr !important;
    width: 100% !important;
    gap: 10px !important;
    margin: 10px 0 !important;
  }

  .branch {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 12px 10px !important;
    border-radius: 8px !important;
  }

  /* 9. TREE DIAGRAMS (.tree, .tree .node, .tree ul) */
  .tree {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 10px 4px !important;
    box-sizing: border-box !important;
  }

  .tree ul {
    padding-left: 12px !important;
    margin-left: 0 !important;
  }

  .tree .node {
    font-size: 12.5px !important;
    padding: 5px 8px !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* 10. FCHARTS (.fchart, .fbox, .frow, .farrow) */
  .fchart {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 10px 4px !important;
    gap: 6px !important;
  }

  .fbox {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 8px 10px !important;
    font-size: 12.5px !important;
    line-height: 1.45 !important;
  }

  .frow {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 6px !important;
  }

  .frow .fbox {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
  }

  .farrow {
    margin: 2px 0 !important;
    font-size: 16px !important;
    line-height: 1 !important;
  }

  /* 11. TIMELINES & SCENES (.timeline, .scene) */
  .timeline {
    padding-left: 16px !important;
    margin-left: 2px !important;
    border-left-width: 2px !important;
  }

  .timeline .ev {
    font-size: 13px !important;
    line-height: 1.5 !important;
    margin: 10px 0 !important;
  }

  .timeline .ev:before {
    left: -22px !important;
    width: 9px !important;
    height: 9px !important;
    top: 5px !important;
  }

  /* 12. COMPARISON CHARTS, GRIDS & MATRICES (.vs, .grid, .grid2, .grid3, .cgrid, etc.) */
  .vs, .grid, .grid2, .grid3, .cgrid, .case-grid, .remedy-grid, .revision-grid, .test-grid, .quiz-grid {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .vs > div, .grid > div, .grid2 > div, .grid3 > div, .cgrid > div {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  /* 13. DIAGRAM IMAGES */
  img {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 10px auto !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
  }

  .case-img, .diag-img {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    margin: 10px 0 !important;
    text-align: center !important;
  }

  /* 14. TABLES: CLEAN HORIZONTAL SCROLL CONTAINMENT WITHOUT PAGE BLOWOUT */
  table {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    border-collapse: collapse !important;
    margin: 12px 0 !important;
    box-sizing: border-box !important;
  }

  th, td {
    padding: 8px 8px !important;
    font-size: 13px !important;
    line-height: 1.45 !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* 15. PRE & CODE BLOCKS */
  pre, code, pre code {
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    font-size: 12px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }

  /* 16. SECTION HEADERS & CARDS */
  .sec-head, .header-card, .chapter-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }

  .sec-num, .chapter-num, .badge-num {
    margin-bottom: 2px !important;
  }
}
/* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE */`;

// Write to css/notes-responsive.css
fs.writeFileSync('css/notes-responsive.css', refinedEngineCss, 'utf8');
console.log('✅ Updated css/notes-responsive.css');

// Process all 133 notes files
let totalProcessed = 0;

allDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dirPath, f);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Standardize viewport meta tag
    if (/<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i.test(content)) {
      content = content.replace(/<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i, '<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    } else if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }

    // 2. Remove any rigid style="min-width:...px" on SVGs
    content = content.replace(/(<svg\b[^>]*)\s+style="[^"]*min-width:\s*\d+px[^"]*"/gi, '$1');

    // 3. Replace or inject the refined Universal Responsive Engine
    const engineStartRegex = /\/\* ==========================================================================\s+MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE[\s\S]*?\/\* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE \*\//gi;

    if (engineStartRegex.test(content)) {
      content = content.replace(engineStartRegex, refinedEngineCss);
    } else if (content.includes('</style>')) {
      const lastStyleClose = content.lastIndexOf('</style>');
      content = content.substring(0, lastStyleClose) + '\n\n' + refinedEngineCss + '\n' + content.substring(lastStyleClose);
    }

    // 4. Ensure closing body and html tags exist
    if (!content.includes('</body>')) {
      content = content.trimEnd() + '\n</body>\n</html>\n';
    }

    fs.writeFileSync(filePath, content, 'utf8');
    totalProcessed++;
  });
  console.log(`✅ Processed directory: ${dir}`);
});

console.log(`\n🎉 Successfully processed all ${totalProcessed} HTML notes files across workspace!`);
