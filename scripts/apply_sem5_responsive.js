const fs = require('fs');
const path = require('path');

const dirs = ['SEM 5/DRAFTING', 'SEM 5/Industrial law'];
const omniEngineCss = fs.readFileSync('css/notes-responsive.css', 'utf8');

let totalFiles = 0;
let modifiedFiles = 0;
let svgViewBoxAdded = 0;
let inlineMinWidthsRemoved = 0;

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    totalFiles++;
    const filePath = path.join(dirPath, f);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Standardize viewport meta tag
    if (/<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i.test(content)) {
      content = content.replace(/<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i, '<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    } else if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }

    // 2. Remove rigid inline min-widths >= 320px
    content = content.replace(/style="([^"]*?)(?:min-width\s*:\s*(?:[3-9]\d{2}|\d{4,})px;?)([^"]*?)"/gi, (match, before, after) => {
      inlineMinWidthsRemoved++;
      const combined = (before + ' ' + after).trim().replace(/\s*;\s*;/g, ';').replace(/^;|;$/g, '').trim();
      return combined ? `style="${combined}"` : '';
    });

    // Also remove rigid min-widths in internal <style> blocks if they target large widths
    content = content.replace(/(min-width\s*:\s*(?:[4-9]\d{2}|\d{4,})px)/gi, (match) => {
      inlineMinWidthsRemoved++;
      return 'min-width: 0';
    });

    // 3. Ensure all SVGs have viewBox (if width and height exist)
    content = content.replace(/<svg\b([^>]*?)>/gi, (match, attrs) => {
      if (!/viewBox/i.test(attrs)) {
        const wMatch = attrs.match(/\bwidth=["']?(\d+)["']?/i);
        const hMatch = attrs.match(/\bheight=["']?(\d+)["']?/i);
        if (wMatch && hMatch && parseInt(wMatch[1], 10) > 0 && parseInt(hMatch[1], 10) > 0) {
          svgViewBoxAdded++;
          return `<svg viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"${attrs}>`;
        }
      }
      return match;
    });

    // 4. Wrap any bare <table> that is not already inside a table wrapper
    // Check if table has a responsive container parent
    // For safety, the CSS also styles `table { display: block; overflow-x: auto; max-width: 100%; }`

    // 5. Replace or inject the Omni-Responsive Engine
    const engineRegex = /\/\* ==========================================================================\s+MAKE LAW EASY — UNIVERSAL (?:MOBILE RESPONSIVE|OMNI-RESPONSIVE) ENGINE[\s\S]*?\/\* END MAKE LAW EASY — UNIVERSAL (?:MOBILE RESPONSIVE|OMNI-RESPONSIVE) ENGINE \*\//gi;

    if (engineRegex.test(content)) {
      content = content.replace(engineRegex, omniEngineCss);
    } else if (content.includes('</style>')) {
      const lastStyleClose = content.lastIndexOf('</style>');
      content = content.substring(0, lastStyleClose) + '\n\n' + omniEngineCss + '\n' + content.substring(lastStyleClose);
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', `<style>\n${omniEngineCss}\n</style>\n</head>`);
    }

    // 6. Ensure valid closing tags
    if (!content.includes('</body>')) {
      content = content.trimEnd() + '\n</body>\n</html>\n';
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
    }
  });
  console.log(`✅ Processed subject folder: ${dir}`);
});

console.log(`\n🎉 Omni-Responsive Engine applied across SEM 5 subjects!`);
console.log(`- Total notes files: ${totalFiles}`);
console.log(`- Modified files: ${modifiedFiles}`);
console.log(`- SVGs enriched with viewBox: ${svgViewBoxAdded}`);
console.log(`- Inline min-widths removed: ${inlineMinWidthsRemoved}`);
