const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.gemini') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allHtml = getHtmlFiles('.');
const rootPages = ['index.html', 'terms.html', 'privacy.html', 'about.html'];
const notesHtml = allHtml.filter(f => !rootPages.includes(path.basename(f)));

console.log('Total notes HTML files:', notesHtml.length);

let missingViewport = [];
let hasStyleTag = 0;
let hasExternalCss = 0;
let hasTable = 0;
let hasSvg = 0;
let hasImages = 0;
let fixedWidthContainers = [];
let commonContainerClasses = {};

notesHtml.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('.', file);

  const hasVp = /<meta[^>]+viewport/i.test(content);
  if (!hasVp) {
    missingViewport.push(relPath);
  }

  if (/<style/i.test(content)) hasStyleTag++;
  if (/<link[^>]+rel=["']stylesheet["']/i.test(content)) hasExternalCss++;
  if (/<table/i.test(content)) hasTable++;
  if (/<svg/i.test(content)) hasSvg++;
  if (/<img/i.test(content)) hasImages++;

  // Find container classes like .wrap, .container, .layout, etc.
  const classes = content.match(/\.(wrap|container|layout|main|dossier|content|page-wrap)\s*\{[^}]+\}/gi);
  if (classes) {
    classes.forEach(c => {
      const name = c.match(/\.([a-zA-Z0-9_-]+)/)[1];
      commonContainerClasses[name] = (commonContainerClasses[name] || 0) + 1;
    });
  }

  // Look for fixed pixel width (not max-width) in style or inline style
  const fixedWidths = content.match(/(?<!max-)(?:width|min-width):\s*(?:[5-9]\d{2}|[1-9]\d{3,})px/gi);
  if (fixedWidths) {
    fixedWidthContainers.push({ file: relPath, count: fixedWidths.length, samples: fixedWidths.slice(0, 3) });
  }
});

console.log('\n=== AUDIT METRICS ===');
console.log('Missing viewport:', missingViewport.length, missingViewport);
console.log('Files with <style> tags:', hasStyleTag, '/', notesHtml.length);
console.log('Files with external CSS:', hasExternalCss, '/', notesHtml.length);
console.log('Files with <table>:', hasTable, '/', notesHtml.length);
console.log('Files with <svg>:', hasSvg, '/', notesHtml.length);
console.log('Files with <img>:', hasImages, '/', notesHtml.length);
console.log('\nCommon container classes found:', commonContainerClasses);
console.log('\nFiles with fixed pixel width (causing overflow):', fixedWidthContainers.length);
console.log('Sample fixed width containers:', fixedWidthContainers.slice(0, 5));
