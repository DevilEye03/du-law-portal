/**
 * MAKE LAW EASY — ANDROID OFFLINE ASSETS BUNDLER
 * Copies all portal files, study notes, bare acts, scripts, and media
 * into android-app/app/src/main/assets for 100% offline standalone functionality.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DEST = path.resolve(ROOT_DIR, 'android-app', 'app', 'src', 'main', 'assets');

const ROOT_FILES_TO_COPY = [
  'index.html',
  'terms.html',
  'privacy.html',
  'about.html',
  'feedback.html',
  'favicon.svg',
  'particles.png',
  'manifest.json'
];

const DIRECTORIES_TO_COPY = [
  'css',
  'js',
  'lib',
  'tools',
  'images',
  'img',
  'BNS',
  'Contract',
  'Family',
  'Juris',
  'Torts',
  'sem 1',
  'sem 2',
  'sem 3',
  'SEM 5'
];

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  for (const item of items) {
    if (item.startsWith('.') || item === 'node_modules') continue;
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyFolderRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function calculateDirSize(dir) {
  let totalBytes = 0;
  let count = 0;
  function walk(d) {
    if (!fs.existsSync(d)) return;
    const items = fs.readdirSync(d);
    for (const item of items) {
      const p = path.join(d, item);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        walk(p);
      } else {
        totalBytes += stat.size;
        count++;
      }
    }
  }
  walk(dir);
  return { totalBytes, count };
}

console.log('🚀 Starting Android Offline Asset Bundling...');
if (!fs.existsSync(ASSETS_DEST)) {
  fs.mkdirSync(ASSETS_DEST, { recursive: true });
}

// 1. Copy individual root files
let rootCopied = 0;
for (const file of ROOT_FILES_TO_COPY) {
  const src = path.join(ROOT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(ASSETS_DEST, file));
    rootCopied++;
  }
}
console.log(`✅ Copied ${rootCopied} core root files into assets/`);

// 2. Copy directories
for (const dir of DIRECTORIES_TO_COPY) {
  const src = path.join(ROOT_DIR, dir);
  const dest = path.join(ASSETS_DEST, dir);
  if (fs.existsSync(src)) {
    copyFolderRecursiveSync(src, dest);
    console.log(`📁 Bundled directory: ${dir}`);
  }
}

const stats = calculateDirSize(ASSETS_DEST);
const sizeMb = (stats.totalBytes / (1024 * 1024)).toFixed(2);
console.log(`\n🎉 BUNDLING COMPLETE!`);
console.log(`📦 Total Assets in APK: ${stats.count} files (${sizeMb} MB uncompressed)`);
