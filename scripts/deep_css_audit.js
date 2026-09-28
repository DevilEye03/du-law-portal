const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING'
];

const gridSelectors = new Set();
const flexRowSelectors = new Set();
const minWidthRules = [];
const tableClasses = new Set();
const flowchartClasses = new Set();

allDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    // extract style content before the responsive engine
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (!styleMatch) return;
    const css = styleMatch[1].split('MAKE LAW EASY — UNIVERSAL MOBILE RESPONSIVE ENGINE')[0];

    // find grid rules
    const gridMatches = [...css.matchAll(/([^{}]+)\{[^{}]*grid-template-columns[^{}]*\}/gi)];
    gridMatches.forEach(m => {
      m[1].split(',').forEach(sel => gridSelectors.add(sel.trim()));
    });

    // find min-width rules > 200px
    const mwMatches = [...css.matchAll(/([^{}]+)\{[^{}]*min-width\s*:\s*([2-9]\d{2}|\d{4,})px[^{}]*\}/gi)];
    mwMatches.forEach(m => {
      minWidthRules.push({ file: filePath, selector: m[1].trim().replace(/\s+/g, ' '), val: m[2] + 'px' });
    });

    // find table wrap classes
    const tblMatches = [...css.matchAll(/\.([\w-]+)\s*\{[^{}]*overflow-x\s*:\s*auto[^{}]*\}/gi)];
    tblMatches.forEach(m => tableClasses.add('.' + m[1]));

    // find flow / chart / step / diagram classes
    const flowMatches = [...css.matchAll(/\.([\w-]*(?:flow|chart|step|branch|fbox|node|diagram|phase|ladder|chain)[\w-]*)\s*\{/gi)];
    flowMatches.forEach(m => flowchartClasses.add('.' + m[1]));
  });
});

console.log('Grid Selectors that need 1-column mobile override:');
console.log([...gridSelectors]);

console.log('\nFlowchart & Diagram Classes found across all subjects:');
console.log([...flowchartClasses]);

console.log('\nTable container classes:');
console.log([...tableClasses]);

console.log(`\nMin-Width Rules > 200px found (${minWidthRules.length} instances):`);
console.log(minWidthRules.slice(0, 20));
