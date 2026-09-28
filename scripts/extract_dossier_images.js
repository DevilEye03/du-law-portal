const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const imagesDir = path.join(rootDir, 'images', 'dossiers');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'scratch' || file === 'images') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = scanDir(rootDir);
let processedFiles = 0;
let totalExtractedImages = 0;
let totalSavedBytes = 0;

for (const htmlPath of htmlFiles) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  if (!content.includes('data:image/')) continue;

  const relHtml = path.relative(rootDir, htmlPath);
  const baseName = path.basename(htmlPath, '.html')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 40);

  const originalSize = fs.statSync(htmlPath).size;
  let imgIndex = 0;

  // Regex to match data:image/TYPE;base64,DATA
  const newContent = content.replace(/src=["']data:image\/([a-zA-Z]+);base64,([^"']+)["']/g, (match, format, base64Data) => {
    imgIndex++;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const imgFileName = `${baseName}_img${imgIndex}.${ext}`;
    const imgFullPath = path.join(imagesDir, imgFileName);

    // Save image buffer
    const imgBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(imgFullPath, imgBuffer);
    totalExtractedImages++;

    // Compute relative path from HTML file to the image file
    let relToImg = path.relative(path.dirname(htmlPath), imgFullPath).replace(/\\/g, '/');

    return `src="${relToImg}" loading="lazy" decoding="async"`;
  });

  if (imgIndex > 0) {
    fs.writeFileSync(htmlPath, newContent, 'utf8');
    const newSize = fs.statSync(htmlPath).size;
    const saved = originalSize - newSize;
    totalSavedBytes += saved;
    processedFiles++;
    console.log(`✅ ${relHtml}: Extracted ${imgIndex} images | ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (Saved ${(saved / 1024).toFixed(1)} KB)`);
  }
}

console.log(`\n🎉 SUMMARY:`);
console.log(`Files Processed: ${processedFiles}`);
console.log(`Images Extracted: ${totalExtractedImages}`);
console.log(`Total HTML Size Reduction: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
