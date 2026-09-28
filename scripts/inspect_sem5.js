const fs = require('fs');
const path = require('path');

const dirs = ['SEM 5/DRAFTING', 'SEM 5/Industrial law'];

dirs.forEach(dir => {
  console.log(`\n=== ${dir} ===`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    const full = path.join(dir, f);
    const content = fs.readFileSync(full, 'utf8');
    const hasOmni = content.includes('UNIVERSAL OMNI-RESPONSIVE ENGINE') || content.includes('UNIVERSAL MOBILE RESPONSIVE ENGINE');
    const hasMeta = /<meta\s+name=["']viewport["']/i.test(content);
    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE';
    console.log(`- ${f}`);
    console.log(`  Title: ${title}`);
    console.log(`  OmniEngine: ${hasOmni}, Viewport: ${hasMeta}, Size: ${(content.length / 1024).toFixed(1)} KB`);
  });
});
