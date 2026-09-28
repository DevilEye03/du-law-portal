const fs = require('fs');
const path = require('path');

const sem1Dirs = ['Juris', 'Contract', 'BNS', 'Family', 'Torts'];

console.log('=== SEMESTER 1 DEEP DIAGRAM / FLOWCHART / CHART AUDIT ===\n');

const stats = {
  totalFiles: 0,
  svgFiles: 0,
  totalSvgs: 0,
  cssFlowFiles: 0,
  imgFiles: 0,
  preDiagramFiles: 0
};

const detailedFindings = [];

sem1Dirs.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return;
  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    stats.totalFiles++;
    const filePath = path.join(fullDir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. SVGs
    const svgMatches = content.match(/<svg[\s\S]*?<\/svg>/gi) || [];
    const svgs = [];
    const svgTagRegex = /<svg\b([^>]*)>/gi;
    let sm;
    while ((sm = svgTagRegex.exec(content)) !== null) {
      const attrs = sm[1];
      const viewBox = (attrs.match(/viewBox=["']([^"']*)["']/i) || [])[1] || null;
      const width = (attrs.match(/width=["']([^"']*)["']/i) || [])[1] || null;
      const height = (attrs.match(/height=["']([^"']*)["']/i) || [])[1] || null;
      const style = (attrs.match(/style=["']([^"']*)["']/i) || [])[1] || null;
      svgs.push({ viewBox, width, height, style });
    }

    // 2. CSS-based flowcharts / diagrams / trees / charts
    const cssDiagramPatterns = [
      /class=["'][^"']*\b(flow|fchart|flowchart|tree|decision-tree|diagram|timeline|steps|pipeline|workflow|mindmap|orgchart|process-flow)\b[^"']*["']/gi,
      /<div[^>]*id=["'][^"']*(?:flow|diagram|chart|tree)[^"']*["']/gi
    ];
    const cssDiagramMatches = [];
    cssDiagramPatterns.forEach(pattern => {
      let dm;
      while ((dm = pattern.exec(content)) !== null) {
        cssDiagramMatches.push(dm[0]);
      }
    });

    // 3. Check for diagram wrapper containers (e.g. .svgwrap, .diagram-wrap, .chart-wrap, etc.)
    const wrapperMatches = content.match(/class=["'][^"']*(?:svgwrap|diagram-wrap|chart-container|chart-box)[^"']*["']/gi) || [];

    // 4. Images used as diagrams / flowcharts / charts
    const imgMatches = content.match(/<img\b[^>]*>/gi) || [];

    // 5. Pre blocks that contain ASCII flowcharts (e.g. arrows ->, |, +, ---)
    const preBlocks = content.match(/<pre[\s\S]*?<\/pre>/gi) || [];
    let asciiDiagrams = 0;
    preBlocks.forEach(pre => {
      if (/(?:-->|->|──>|──|\|[\s\S]*\||\+[-+]+\+)/.test(pre)) {
        asciiDiagrams++;
      }
    });

    if (svgMatches.length > 0) {
      stats.svgFiles++;
      stats.totalSvgs += svgMatches.length;
    }
    if (cssDiagramMatches.length > 0) stats.cssFlowFiles++;
    if (imgMatches.length > 0) stats.imgFiles++;
    if (asciiDiagrams > 0) stats.preDiagramFiles++;

    detailedFindings.push({
      dir,
      file: f,
      fullPath: filePath,
      svgCount: svgMatches.length,
      svgs,
      cssDiagramCount: cssDiagramMatches.length,
      cssDiagramSamples: Array.from(new Set(cssDiagramMatches)).slice(0, 5),
      wrapperCount: wrapperMatches.length,
      imgCount: imgMatches.length,
      asciiDiagrams
    });
  });
});

console.log(`Audited ${stats.totalFiles} Semester 1 HTML files:`);
console.log(`- Files with SVG diagrams/flowcharts: ${stats.svgFiles} (${stats.totalSvgs} SVGs total)`);
console.log(`- Files with CSS-based flowcharts/trees/diagrams: ${stats.cssFlowFiles}`);
console.log(`- Files with Diagram Images: ${stats.imgFiles}`);
console.log(`- Files with ASCII flowcharts in <pre>: ${stats.preDiagramFiles}`);

console.log('\n--- DETAILED BREAKDOWN PER SUBJECT ---');
sem1Dirs.forEach(dir => {
  console.log(`\n📁 SUBJECT: ${dir}`);
  const dirFindings = detailedFindings.filter(df => df.dir === dir);
  dirFindings.forEach(df => {
    console.log(`  📄 ${df.file}`);
    console.log(`     SVGs: ${df.svgCount} | CSS Diagrams: ${df.cssDiagramCount} | Imgs: ${df.imgCount} | ASCII: ${df.asciiDiagrams} | Wrappers: ${df.wrapperCount}`);
    if (df.svgs.length > 0) {
      const fixedW = df.svgs.filter(s => s.width && !s.width.includes('%'));
      const missingViewBox = df.svgs.filter(s => !s.viewBox);
      console.log(`     SVG details: ${df.svgs.length} total, ${fixedW.length} have fixed width attr, ${missingViewBox.length} missing viewBox`);
    }
    if (df.cssDiagramSamples.length > 0) {
      console.log(`     CSS diagram classes: ${df.cssDiagramSamples.join(', ')}`);
    }
  });
});
