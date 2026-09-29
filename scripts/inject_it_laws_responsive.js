const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'SEM 5', 'IT LAWS');
const cssPath = path.join(__dirname, '..', 'css', 'notes-responsive.css');
const responsiveCssContent = fs.readFileSync(cssPath, 'utf8');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} files in ${dir}...`);

for (const f of files) {
  const filePath = path.join(dir, f);
  let html = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // 1. Ensure <link rel="stylesheet" href="../../css/notes-responsive.css"> in <head>
  if (!html.includes('notes-responsive.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="../../css/notes-responsive.css">\n</head>');
    modified = true;
    console.log(`[${f}] Added link to notes-responsive.css in <head>`);
  }

  // 2. Ensure embedded responsive engine inside <style>
  if (!html.includes('UNIVERSAL OMNI-RESPONSIVE ENGINE')) {
    const engineBlock = '\n\n/* Embedded Universal Omni-Responsive Engine */\n' + responsiveCssContent + '\n';
    html = html.replace('</style>', engineBlock + '</style>');
    modified = true;
    console.log(`[${f}] Embedded UNIVERSAL OMNI-RESPONSIVE ENGINE before </style>`);
  }

  // 3. Ensure viewport meta is present and robust
  if (!html.includes('viewport')) {
    html = html.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    modified = true;
    console.log(`[${f}] Added viewport meta tag`);
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[${f}] Successfully updated! File size: ${fs.statSync(filePath).size} bytes`);
  } else {
    console.log(`[${f}] Already up to date.`);
  }
}

console.log('All IT Laws files processed successfully.');
