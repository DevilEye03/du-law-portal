const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING'
];

const containerClasses = new Set();
const headerClasses = new Set();
const sectionClasses = new Set();
const cardClasses = new Set();

allDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    // find body immediate children classes
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyInner = bodyMatch[1];
      // match first few div classes
      const topDivs = [...bodyInner.matchAll(/<div\s+class=["']([^"']+)["']/gi)].slice(0, 5);
      topDivs.forEach(td => td[1].split(/\s+/).forEach(c => containerClasses.add(c)));

      const headers = [...bodyInner.matchAll(/<header\s+class=["']([^"']+)["']/gi)];
      headers.forEach(h => h[1].split(/\s+/).forEach(c => headerClasses.add(c)));

      const sections = [...bodyInner.matchAll(/<(?:section|article|main|div)\s+class=["']([^"']+)["']/gi)];
      sections.forEach(s => s[1].split(/\s+/).forEach(c => {
        if (/card|box|bx|panel|sheet|block|cassheet|case|topic|unit|sec/i.test(c)) {
          cardClasses.add(c);
        }
      }));
    }
  });
});

console.log('Top Container Classes across subjects:', [...containerClasses]);
console.log('\nHeader Classes across subjects:', [...headerClasses]);
console.log('\nCard / Box Classes across subjects:', [...cardClasses]);
