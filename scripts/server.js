/**
 * Simple local static server for Delhi University Law Notes Portal
 * Run: node server.js
 * Open: http://localhost:3000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0].split('#')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const fullPath = path.join(__dirname, reqPath);

  // Security check: ensure path is within __dirname
  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fullPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏛️  DELHI UNIVERSITY LAW NOTES PORTAL IS RUNNING!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📁 Directory: ${__dirname}`);
  console.log(`======================================================\n`);
});
