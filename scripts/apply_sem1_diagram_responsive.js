const fs = require('fs');
const path = require('path');

const sem1Dirs = ['Juris', 'Contract', 'BNS', 'Family', 'Torts'];

// 1. Build the updated Universal Mobile Responsive Engine CSS
const universalResponsiveCss = `/* ==========================================================================
   MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE (320px - 768px)
   Enhanced: Full Responsive Diagrams, Flowcharts & Charts Engine
   ========================================================================== */
@media screen and (max-width: 768px) {
  /* 1. Root & Viewport Overflow Containment (Rule 3) */
  html, body {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
    font-size: 15.5px !important;
    line-height: 1.65 !important;
    -webkit-text-size-adjust: 100% !important;
  }

  *, *::before, *::after {
    box-sizing: border-box !important;
  }

  /* 2. Container & Layout Fluid Scaling */
  .wrap, .layout, .container, .page-wrap, main, article, .dossier, .content {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
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
  header.hero, .hero, .header, .top-bar {
    padding: 28px 16px 24px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    position: relative !important;
    overflow: hidden !important;
  }

  header.hero h1, .hero h1, h1 {
    font-size: clamp(22px, 6.2vw, 32px) !important;
    line-height: 1.22 !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  header.hero .lede, .hero p, .hero-sub, .lead {
    font-size: 14.5px !important;
    line-height: 1.5 !important;
  }

  /* Decorative Crests in Hero Banners */
  svg.crest, .hero-crest, .hero svg.crest, svg.crest-mark {
    width: 80px !important;
    height: 80px !important;
    max-width: 80px !important;
    max-height: 80px !important;
    opacity: 0.2 !important;
    position: absolute !important;
    right: 10px !important;
    top: 10px !important;
    pointer-events: none !important;
  }

  svg.hero-visual {
    max-width: 130px !important;
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

  /* 4. DIAGRAMS & FLOWCHARTS: CONTAINER & HORIZONTAL TOUCH-PAN */
  .fig, .figure, .scene, .svgwrap, figure, .case-visual, .diagram-wrap,
  .flow-svg, .flow:has(svg), .flow:has(.diagram) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: pan-x pan-y !important;
    background: var(--card, #ffffff) !important;
    border: 1px solid var(--line, #e2e8f0) !important;
    border-radius: 12px !important;
    padding: 14px 10px !important;
    margin: 18px 0 !important;
    box-sizing: border-box !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
  }

  /* Visual touch-pan scroll hint badge on mobile diagrams */
  .fig::after, .figure::after, .scene::after, .svgwrap::after, .flow-svg::after, .flow:has(svg)::after {
    content: "⇄ Swipe horizontally to pan diagram" !important;
    display: block !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    color: var(--mut, #64748b) !important;
    text-align: center !important;
    margin-top: 10px !important;
    letter-spacing: 0.4px !important;
    opacity: 0.85 !important;
    pointer-events: none !important;
  }

  /* Captions & badges on figures & scenes */
  .fig .cap, .fcap, .scene .badge {
    display: block !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    font-weight: 700 !important;
    text-align: center !important;
    margin: 4px 0 10px !important;
    color: var(--ink, #14213d) !important;
    white-space: normal !important;
    word-break: break-word !important;
  }

  /* 5. SVG DIAGRAM RESIZING & LEGIBILITY */
  /* Wide SVGs inside scrollable figure cards: maintain legible typography & geometry */
  .fig svg, .figure svg, .scene svg, .svgwrap svg, .flow-svg svg, .flow svg, svg.diagram,
  svg[width]:not([width="18"]):not([width="20"]):not([width="24"]):not(.icon),
  svg[viewBox*="9"], svg[viewBox*="8"], svg[viewBox*="7"], svg[viewBox*="6"] {
    display: block !important;
    min-width: 600px !important;
    max-width: none !important;
    height: auto !important;
    margin: 0 auto !important;
  }

  /* Moderate/Small standalone SVGs (viewBox width <= 450) */
  svg[viewBox*=" 0 0 2"]:not(.crest):not(.hero-visual),
  svg[viewBox*=" 0 0 3"]:not(.crest),
  svg[viewBox*=" 0 0 4"]:not(.crest) {
    min-width: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
  }

  /* 6. CSS FLOWCHARTS (.flow, .node, .ar, .dn, .step) */
  .flow:not(.flow-svg):not(:has(svg)) {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    gap: 8px !important;
    padding: 14px 12px !important;
    margin: 18px 0 !important;
    background: var(--paper, #f8fafc) !important;
    border: 1px solid var(--line, #e2e8f0) !important;
    border-radius: 12px !important;
  }

  .flow .node, .flow > .node, .flow.horizontal .node {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    box-sizing: border-box !important;
    margin: 2px 0 !important;
    padding: 12px 14px !important;
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    text-align: center !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  .flow .node small, .flow > .node small {
    display: block !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    margin-top: 4px !important;
  }

  /* Flow arrows: rotate horizontal '→' 90deg into vertical down arrow '↓' */
  .flow .ar, .flow span.ar, .flow > .ar {
    display: block !important;
    transform: rotate(90deg) !important;
    margin: 4px auto !important;
    text-align: center !important;
    font-size: 20px !important;
    line-height: 1 !important;
    padding: 2px 0 !important;
    width: auto !important;
  }

  .flow .dn {
    display: block !important;
    flex-basis: auto !important;
    height: auto !important;
    margin: 4px auto !important;
    font-size: 20px !important;
  }

  .flow .step, .flow > .step {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin: 4px 0 !important;
    padding: 12px 14px !important;
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    text-align: center !important;
  }

  .flow.vertical {
    width: 100% !important;
    max-width: 100% !important;
    padding: 12px 8px !important;
  }

  .flow.vertical .node {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 7. FAMILY LAW DECISION TREES (.decision-tree, .branches, .branch) */
  .decision-tree {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 16px 12px !important;
    margin: 18px 0 !important;
    background: #f1f5f9 !important;
    border-radius: 10px !important;
  }

  .decision-tree .root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto 12px !important;
    text-align: center !important;
  }

  .branches {
    display: flex !important;
    flex-direction: column !important;
    grid-template-columns: 1fr !important;
    width: 100% !important;
    gap: 12px !important;
    margin: 14px 0 !important;
  }

  .branch {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 14px 12px !important;
    border-radius: 8px !important;
  }

  /* 8. TREE DIAGRAMS (.tree, .tree .node, .tree ul) */
  .tree {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 12px 6px !important;
    box-sizing: border-box !important;
  }

  .tree ul {
    padding-left: 12px !important;
    margin-left: 0 !important;
  }

  .tree .node {
    font-size: 13px !important;
    padding: 6px 10px !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* 9. FCHARTS (.fchart, .fbox, .frow, .farrow) */
  .fchart {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 12px 6px !important;
    gap: 6px !important;
  }

  .fbox {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 10px 12px !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
  }

  .frow {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 8px !important;
  }

  .frow .fbox {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
  }

  .farrow {
    margin: 4px 0 !important;
    font-size: 18px !important;
    line-height: 1 !important;
  }

  /* 10. TIMELINES & SCENES (.timeline, .scene) */
  .timeline {
    padding-left: 18px !important;
    margin-left: 4px !important;
    border-left-width: 2px !important;
  }

  .timeline .ev {
    font-size: 13.5px !important;
    line-height: 1.55 !important;
    margin: 12px 0 !important;
  }

  .timeline .ev:before {
    left: -24px !important;
    width: 10px !important;
    height: 10px !important;
    top: 5px !important;
  }

  /* 11. COMPARISON CHARTS, GRIDS & MATRICES (.vs, .grid, .grid2, .grid3, .cgrid, etc.) */
  .vs, .grid, .grid2, .grid3, .cgrid, .case-grid, .remedy-grid, .revision-grid, .test-grid, .quiz-grid {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .vs > div, .grid > div, .grid2 > div, .grid3 > div, .cgrid > div {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  /* 12. DIAGRAM IMAGES */
  img {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 12px auto !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
  }

  .case-img, .diag-img {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    margin: 14px 0 !important;
    text-align: center !important;
  }

  /* 13. TABLES: HORIZONTAL SCROLL CONTAINMENT (Rule 3) */
  table {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    border-collapse: collapse !important;
    margin: 14px 0 !important;
    font-size: 13.5px !important;
  }

  th, td {
    padding: 8px 10px !important;
    white-space: normal !important;
    min-width: 90px !important;
  }

  /* 14. PRE & CODE BLOCKS */
  pre, code, pre code {
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    font-size: 12.5px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }

  /* 15. SECTION HEADERS & CARDS */
  .sec-head, .header-card, .chapter-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  .sec-num, .chapter-num, .badge-num {
    margin-bottom: 4px !important;
  }

  .card, .box, .case, .pyq, .callout, .warn, .tip, .note {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding: 14px 12px !important;
    margin: 14px 0 !important;
    box-sizing: border-box !important;
  }
}
/* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE */`;

// Write to css/notes-responsive.css
fs.writeFileSync('css/notes-responsive.css', universalResponsiveCss, 'utf8');
console.log('✅ Updated css/notes-responsive.css');

// 2. Process all Semester 1 HTML files
let modifiedCount = 0;
let svgWrappedCount = 0;
let flowSvgCount = 0;

sem1Dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dirPath, f);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // A. In BNS (Unit 8, 9, 10): Replace bare <div><svg with <div class="fig"><svg
    if (dir === 'BNS') {
      const bnsSvgRegex = /<div>\s*(<svg\b[^>]*role="img"[^>]*>)/gi;
      if (bnsSvgRegex.test(content)) {
        content = content.replace(bnsSvgRegex, (match, p1) => {
          svgWrappedCount++;
          changed = true;
          return `<div class="fig">${p1}`;
        });
      }
    }

    // B. In Family Law: Add class flow-svg to <div class="flow"> containing SVGs
    if (dir === 'Family') {
      // Check for <div class="flow"> that has SVG
      const flowRegex = /<div class="flow">(\s*<div class="fcap">[\s\S]*?<svg|<svg)/gi;
      if (flowRegex.test(content)) {
        content = content.replace(flowRegex, (match, p1) => {
          flowSvgCount++;
          changed = true;
          return `<div class="flow flow-svg">${p1}`;
        });
      }
    }

    // C. Remove rigid inline style="min-width:760px" or similar on SVGs
    const minWidthSvgRegex = /(<svg\b[^>]*)\s+style="min-width:\s*\d+px"/gi;
    if (minWidthSvgRegex.test(content)) {
      content = content.replace(minWidthSvgRegex, (match, p1) => {
        changed = true;
        return p1;
      });
    }

    // D. Update or insert the Universal Mobile Responsive Engine in the HTML's <style> block
    const engineStartRegex = /\/\* ==========================================================================\s+MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE[\s\S]*?\/\* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE \*\//gi;

    if (engineStartRegex.test(content)) {
      content = content.replace(engineStartRegex, universalResponsiveCss);
      changed = true;
    } else {
      // If not present, append before </style>
      if (content.includes('</style>')) {
        const lastStyleClose = content.lastIndexOf('</style>');
        content = content.substring(0, lastStyleClose) + '\n\n' + universalResponsiveCss + '\n' + content.substring(lastStyleClose);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`✅ Updated ${dir}/${f}`);
    }
  });
});

console.log(`\n🎉 Processed ${modifiedCount} Semester 1 HTML files!`);
console.log(`- SVG figures wrapped: ${svgWrappedCount}`);
console.log(`- Flow SVG containers labeled: ${flowSvgCount}`);
