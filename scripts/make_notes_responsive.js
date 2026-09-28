const fs = require('fs');
const path = require('path');

const RESPONSIVE_CSS = `
/* ==========================================================================
   MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE (320px - 768px)
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
    margin-left: auto !important;
    margin-right: auto !important;
  }

  /* 3. Hero Header & Covers */
  header.cover, header.hero, .hero, .topbar {
    padding: 24px 14px 20px !important;
    border-radius: 8px !important;
    margin-bottom: 16px !important;
    max-width: 100% !important;
  }
  header.cover h1, header.hero h1, .hero h1 {
    font-size: clamp(1.4rem, 6vw, 2.1rem) !important;
    line-height: 1.22 !important;
    margin: 10px 0 6px !important;
    word-break: break-word !important;
  }
  header.cover h2, header.hero .sub, .hero .dek {
    font-size: 0.95rem !important;
    line-height: 1.45 !important;
  }
  .badges, .meta {
    font-size: 0.82rem !important;
    line-height: 1.4 !important;
  }
  .badge, .tag, .lbl {
    font-size: 0.75rem !important;
    padding: 3px 8px !important;
    margin: 2px !important;
    display: inline-block !important;
  }

  /* 4. Table Scroll Containment (Prevents 100% of Horizontal Page Blowout) */
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
  .table-wrap, .table-container, .table-responsive {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin: 14px 0 !important;
  }
  th, td {
    padding: 8px 10px !important;
    min-width: 85px !important;
    word-break: break-word !important;
  }

  /* 5. Typography & Headings */
  h2, h2.part, .chapter h2 {
    font-size: clamp(1.25rem, 5vw, 1.6rem) !important;
    margin-top: 28px !important;
    margin-bottom: 10px !important;
    line-height: 1.3 !important;
    word-break: break-word !important;
  }
  h3 {
    font-size: clamp(1.1rem, 4.2vw, 1.35rem) !important;
    margin-top: 22px !important;
    line-height: 1.35 !important;
    padding-left: 8px !important;
    word-break: break-word !important;
  }
  h4, h5 {
    font-size: 1rem !important;
    line-height: 1.4 !important;
  }
  p {
    font-size: 15.5px !important;
    line-height: 1.65 !important;
    text-align: left !important;
    margin: 8px 0 !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }
  li {
    font-size: 15px !important;
    line-height: 1.6 !important;
    margin: 6px 0 !important;
    overflow-wrap: break-word !important;
  }
  ul, ol {
    padding-left: 20px !important;
    margin: 8px 0 !important;
  }

  /* 6. Grids & Multi-column Stacking */
  .twocol, .grid2, .vs, .source-grid, .split, .stats, .hero .stats, .flow, .section-index {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 12px !important;
    grid-template-columns: 1fr !important;
  }
  .vs > div {
    border-right: none !important;
    border-bottom: 1px solid var(--line, #dedfd7) !important;
  }
  .branch, .fbox, .flow > div {
    min-width: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 7. Case Briefs, Cards, Statutes & Q&A Cards */
  .card, .casefile, .box, .statute, .qa, .chapter, .ans, .pyq, .case, .mnemonic, .mnem {
    padding: 14px 14px !important;
    margin: 14px 0 !important;
    border-radius: 8px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }
  .casefile .cf-head, .casefile .cf-body {
    padding: 12px 14px !important;
  }

  /* 8. Code, Monospace & Pre Blocks */
  pre, code, .stat {
    max-width: 100% !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
    overflow-x: auto !important;
    font-size: 13px !important;
    padding: 10px 12px !important;
  }
  blockquote {
    margin: 12px 0 !important;
    padding: 10px 14px !important;
    font-size: 15px !important;
  }

  /* 9. Images & SVG Diagrams */
  img, svg {
    max-width: 100% !important;
    height: auto !important;
    box-sizing: border-box !important;
  }
  .fig, .case-visual, figure {
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin: 14px 0 !important;
  }

  /* 10. Horizontal Navigation & ToC */
  nav.tocbar, .topbar {
    padding: 4px 6px !important;
    width: 100% !important;
  }
  nav.tocbar .inner, .topbar .toolbar {
    display: flex !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    padding: 6px 4px !important;
    gap: 4px !important;
  }
  nav.tocbar a, .topbar button {
    padding: 5px 9px !important;
    font-size: 11.5px !important;
    white-space: nowrap !important;
  }
  .sidebar {
    position: static !important;
    width: 100% !important;
    max-height: none !important;
    padding: 0 !important;
  }
  .toc {
    columns: 1 !important;
    padding: 12px 16px !important;
  }
}

@media screen and (max-width: 480px) {
  html, body {
    font-size: 14.5px !important;
  }
  .wrap, .layout, .container, .page-wrap {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  header.cover, header.hero, .hero {
    padding: 18px 10px 16px !important;
  }
  th, td {
    padding: 6px 8px !important;
    font-size: 12px !important;
    min-width: 75px !important;
  }
  .card, .casefile, .box, .statute, .qa, .chapter, .ans, .pyq, .case {
    padding: 12px 10px !important;
  }
}
/* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE */
`;

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.gemini' || file === 'scratch') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const rootPages = ['index.html', 'terms.html', 'privacy.html', 'about.html'];
const notesHtml = getHtmlFiles('.').filter(f => !rootPages.includes(path.basename(f)));

console.log(`Processing ${notesHtml.length} notes HTML files...`);

let updatedCount = 0;
let viewportAddedCount = 0;

notesHtml.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Ensure viewport meta tag exists
  if (!/<meta[^>]+viewport/i.test(content)) {
    if (/<head[^>]*>/i.test(content)) {
      content = content.replace(/(<head[^>]*>)/i, '$1\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      viewportAddedCount++;
      changed = true;
    }
  }

  // 2. Insert or update the Universal Mobile Responsive Engine
  const startMarker = '/* ==========================================================================\n   MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE (320px - 768px)\n   ========================================================================== */';
  const endMarker = '/* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE */';

  if (content.includes(startMarker)) {
    // Replace existing block
    const sIdx = content.indexOf(startMarker);
    const eIdx = content.indexOf(endMarker);
    if (sIdx !== -1 && eIdx !== -1) {
      content = content.slice(0, sIdx) + RESPONSIVE_CSS.trim() + content.slice(eIdx + endMarker.length);
      changed = true;
    }
  } else if (/<\/style>/i.test(content)) {
    // Append before the last </style>
    const lastStyleClose = content.lastIndexOf('</style>');
    content = content.slice(0, lastStyleClose) + '\n' + RESPONSIVE_CSS.trim() + '\n' + content.slice(lastStyleClose);
    changed = true;
  } else if (/<\/head>/i.test(content)) {
    // Insert new <style> before </head>
    content = content.replace(/(<\/head>)/i, `<style>\n${RESPONSIVE_CSS.trim()}\n</style>\n$1`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
});

console.log(`\n🎉 DONE! Updated ${updatedCount} HTML notes files.`);
console.log(`Added viewport meta tag to ${viewportAddedCount} files.`);
