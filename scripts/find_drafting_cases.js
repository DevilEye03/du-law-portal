const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('SEM 5/DRAFTING').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(path.join('SEM 5/DRAFTING', f), 'utf8');
  const cnames = [...content.matchAll(/<div class="cname">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const bolds = [...content.matchAll(/<strong>([A-Z][^<]{2,60}?\bv\.[^<]{2,60}?)<\/strong>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const headings = [...content.matchAll(/<h[234][^>]*>([^<]{2,80}?\bv\.[^<]{2,80}?)<\/h[234]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log(`\n${f}:`);
  console.log('cnames:', cnames);
  console.log('headings:', headings.slice(0, 5));
  console.log('sample bolds:', bolds.slice(0, 5));
});
