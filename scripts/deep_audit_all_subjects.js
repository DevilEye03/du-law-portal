const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING'
];

let issues = [];

allDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Check if engine exists
    const hasEngine = content.includes('MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE');
    if (!hasEngine) {
      issues.push({ file: filePath, type: 'NO_ENGINE' });
    }

    // 2. Check SVGs for missing viewBox
    const svgMatches = [...content.matchAll(/<svg\b([^>]*)>/gi)];
    svgMatches.forEach((m, idx) => {
      const attrs = m[1];
      if (!attrs.includes('viewBox') && !attrs.includes('viewbox')) {
        issues.push({ file: filePath, type: 'SVG_WITHOUT_VIEWBOX', svgIndex: idx, attrs: attrs.trim() });
      }
    });

    // 3. Check for fixed pixel widths or min-widths that could cause horizontal scroll
    const fixedWidthMatches = [...content.matchAll(/(?:min-width|width)\s*:\s*([6-9]\d{2}|\d{4,})px/gi)];
    if (fixedWidthMatches.length > 0) {
      // Filter out if inside our responsive engine
      // Check if it's outside media query
    }

    // 4. Check for CSS flowcharts (.flow, .tree, .mermaid, .timeline, .step)
    const hasFlow = /class=["'][^"']*\b(flow|flowchart|tree|mindmap|diagram-grid|steps-row)\b[^"']*["']/i.test(content);
    if (hasFlow) {
      // check if flow has any flex-direction: row or grid
    }

    // 5. Check if responsive engine is at the VERY END of the <style> tag so it wins cascade
    const styleCloseIndex = content.lastIndexOf('</style>');
    const engineIndex = content.lastIndexOf('/* ==========================================================================\n   MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE');
    if (engineIndex === -1) {
      // checked in #1
    } else {
      const between = content.substring(engineIndex, styleCloseIndex);
      // check if another style block or rule comes after it
      if (content.indexOf('</style>', engineIndex) !== -1) {
        const afterEngine = content.substring(content.indexOf('/* END MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE */', engineIndex) + 60, styleCloseIndex).trim();
        if (afterEngine.length > 10) {
          issues.push({ file: filePath, type: 'STYLES_AFTER_ENGINE', length: afterEngine.length, sample: afterEngine.substring(0, 100) });
        }
      }
    }
  });
});

console.log('Total issues found:', issues.length);
console.log(JSON.stringify(issues, null, 2));
