const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generate() {
  const url = 'https://makelaweasy.in';
  console.log(`Generating QR code for: ${url}`);

  const pngOptions = {
    errorCorrectionLevel: 'H',
    type: 'png',
    quality: 1,
    margin: 2,
    width: 1024,
    color: {
      dark: '#111827', // Deep slate/black
      light: '#ffffff'  // Pure crisp white
    }
  };

  const svgOptions = {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin: 2,
    color: {
      dark: '#111827',
      light: '#ffffff'
    }
  };

  // Generate PNG
  await QRCode.toFile(path.join(__dirname, '../makelaweasy_qr.png'), url, pngOptions);
  await QRCode.toFile(path.join(__dirname, '../qrcode.png'), url, pngOptions);
  console.log('✅ Generated makelaweasy_qr.png and qrcode.png (1024x1024)');

  // Generate SVG
  await QRCode.toFile(path.join(__dirname, '../makelaweasy_qr.svg'), url, svgOptions);
  console.log('✅ Generated makelaweasy_qr.svg');

  // Copy to artifacts for visual preview if artifacts dir exists
  const artifactDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\cce45e33-8359-4f71-a9c0-e27ec1824480';
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(path.join(__dirname, '../makelaweasy_qr.png'), path.join(artifactDir, 'makelaweasy_qr.png'));
    console.log('✅ Copied to artifact directory for preview');
  }
}

generate().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});
