const fs = require('fs');
const path = require('path');

const TAX_DIR = path.resolve(__dirname, '../SEM 5/Taxation');
const files = [
  'Topic1_Introduction_Taxation_Law_DU.html',
  'Topic2_Agricultural_Income_DU.html',
  'Topic3_Residence_and_Scope_of_Total_Income_DU.html',
  'Topic4_Heads_of_Income_DU.html',
  'Topic5_Clubbing_of_Income_DU.html',
  'Topic6_Best_Judgment_and_Escaping_Assessment_DU.html'
];

const RESPONSIVE_LINK = '<link rel="stylesheet" href="/css/notes-responsive.css?v=95.0">';

const DARK_STYLES = `
<style id="taxation-dark-theme">
/* ============================================================
   DARK MODE ADAPTATION — Principles of Taxation Law (Make Law Easy)
   ============================================================ */
html[data-theme="dark"], [data-theme="dark"] {
  --paper: #0b1120;
  --paper-2: #0f172a;
  --card: #1e293b;
  --ink: #f1f5f9;
  --ink-soft: #cbd5e1;
  --ink-mute: #94a3b8;
  --navy: #0f172a;
  --navy-2: #1e293b;
  --gold: #d4af37;
  --gold-soft: #2e2612;
  --teal: #14b8a6;
  --teal-soft: #132e2b;
  --crimson: #f87171;
  --crimson-soft: #381a1a;
  --blue-soft: #1e293b;
  --border: #334155;
  --border-2: #475569;
}
[data-theme="dark"] body {
  background: #0b1120 !important;
  color: #e2e8f0 !important;
}
[data-theme="dark"] .card, [data-theme="dark"] .case, [data-theme="dark"] .pyq, [data-theme="dark"] .callout, [data-theme="dark"] .tw, [data-theme="dark"] table {
  background: #1e293b !important;
  color: #e2e8f0 !important;
  border-color: #334155 !important;
}
[data-theme="dark"] .chead {
  background: #0f172a !important;
  border-bottom-color: #334155 !important;
}
[data-theme="dark"] .ctitle {
  color: #f1f5f9 !important;
}
[data-theme="dark"] .ccite {
  color: #94a3b8 !important;
}
[data-theme="dark"] .crow span {
  background: #1e293b !important;
  color: #cbd5e1 !important;
  border-color: #334155 !important;
}
[data-theme="dark"] .cblk {
  background: #162032 !important;
  border-color: #334155 !important;
}
[data-theme="dark"] .cblk .lbl {
  color: #d4af37 !important;
}
[data-theme="dark"] .qhead {
  background: #0f172a !important;
  border-bottom-color: #334155 !important;
}
[data-theme="dark"] .qhead h4 {
  color: #f1f5f9 !important;
}
[data-theme="dark"] .qstem {
  background: #162032 !important;
  color: #cbd5e1 !important;
  border-left-color: #d4af37 !important;
}
[data-theme="dark"] .sidebar, [data-theme="dark"] nav#toc, [data-theme="dark"] aside {
  background: #0b1120 !important;
  border-right-color: #334155 !important;
}
[data-theme="dark"] code, [data-theme="dark"] pre {
  background: #0f172a !important;
  color: #f1f5f9 !important;
  border-color: #334155 !important;
}
[data-theme="dark"] tr:nth-child(even) td {
  background: #162032 !important;
}
[data-theme="dark"] a {
  color: #38bdf8 !important;
}
[data-theme="dark"] .chip {
  background: #1e293b !important;
  color: #94a3b8 !important;
  border-color: #334155 !important;
}
</style>
`;

const THEME_SCRIPT = `<script id="taxation-theme-init">(function(){try{var t=localStorage.getItem('du_law_theme')||(new URLSearchParams(window.location.search)).get('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();</script>`;

files.forEach(f => {
  const filePath = path.join(TAX_DIR, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add responsive link if not present
  if (!content.includes('notes-responsive.css')) {
    content = content.replace('</head>', `  ${RESPONSIVE_LINK}\n  ${DARK_STYLES}\n</head>`);
  } else if (!content.includes('taxation-dark-theme')) {
    content = content.replace('</head>', `  ${DARK_STYLES}\n</head>`);
  }

  // 2. Add theme init script right after <head> or at start of <body>
  if (!content.includes('taxation-theme-init')) {
    if (content.includes('<body')) {
      content = content.replace(/<body([^>]*)>/i, `<body$1>\n${THEME_SCRIPT}`);
    } else {
      content = content.replace('</head>', `</head>\n${THEME_SCRIPT}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Enhanced ${f} with responsive CSS and dark theme support.`);
});
console.log('All 6 Taxation note files successfully enhanced!');
