const fs = require('fs');

const u3 = fs.readFileSync('SEM 5/Industrial law/Unit-3-Awards-and-Settlements-Notes.html', 'utf8');
const u3Secs = u3.match(/<section[^>]*id=["'][^"']*["'][^>]*>/gi) || [];
console.log('Unit 3 section tags:', u3Secs);

const u7 = fs.readFileSync('SEM 5/Industrial law/Unit-7-Wages-and-Code-on-Wages-2019-Notes.html', 'utf8');
const u7Secs = u7.match(/<section[^>]*id=["'][^"']*["'][^>]*>/gi) || [];
console.log('Unit 7 section tags:', u7Secs);
