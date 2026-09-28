const fs = require('fs');
const path = require('path');

const allDirs = [
  'Juris', 'Contract', 'BNS', 'Family', 'Torts',
  'sem 2/BSA', 'sem 2/PIL', 'sem 2/PROPERTY LAW',
  'sem 3/company', 'sem 3/cpc', 'sem 3/Media', 'sem 3/wcc',
  'SEM 5/DRAFTING'
];

const visualStats = {};

allDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  visualStats[dir] = [];

  files.forEach(f => {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    const fileReport = {
      file: f,
      svgCount: (content.match(/<svg/g) || []).length,
      flowCount: (content.match(/class=["'][^"']*\bflow\b[^"']*["']/g) || []).length,
      tableCount: (content.match(/<table/g) || []).length,
      preCount: (content.match(/<pre/g) || []).length,
      fixedWidthElements: [],
      specialDiagramClasses: []
    };

    // check for specific diagram classes
    const classMatches = content.match(/class=["']([^"']+)["']/g) || [];
    const diagKeywords = ['flow', 'tree', 'diagram', 'chart', 'timeline', 'matrix', 'ladder', 'mindmap', 'schema', 'process', 'step', 'vis', 'figure', 'scene'];
    const foundClasses = new Set();
    classMatches.forEach(cm => {
      diagKeywords.forEach(kw => {
        if (cm.includes(kw)) {
          foundClasses.add(cm);
        }
      });
    });
    fileReport.specialDiagramClasses = [...foundClasses].slice(0, 5);

    // check for inline style widths > 400px
    const styleMatches = [...content.matchAll(/style=["'][^"']*(?:width|min-width)\s*:\s*(\d+)px/gi)];
    styleMatches.forEach(sm => {
      const px = parseInt(sm[1], 10);
      if (px > 400) {
        fileReport.fixedWidthElements.push(sm[0]);
      }
    });

    if (fileReport.svgCount > 0 || fileReport.flowCount > 0 || fileReport.tableCount > 0 || fileReport.fixedWidthElements.length > 0) {
      visualStats[dir].push(fileReport);
    }
  });
});

for (const [dir, reports] of Object.entries(visualStats)) {
  console.log(`\n================== ${dir} (${reports.length} files with visuals) ==================`);
  reports.forEach(r => {
    console.log(`- ${r.file}: SVGs=${r.svgCount}, Flows=${r.flowCount}, Tables=${r.tableCount}, FixedPx=${r.fixedWidthElements.length}`);
    if (r.fixedWidthElements.length > 0) {
      console.log(`  FixedPx examples:`, r.fixedWidthElements.slice(0, 3));
    }
  });
}
