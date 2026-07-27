const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
// Extract FIREBASE_PRIVATE_KEY value
const lines = content.split('\n');
const keyLine = lines.find(l => l.startsWith('FIREBASE_PRIVATE_KEY='));
if (!keyLine) { console.log('NO KEY FOUND'); process.exit(1); }

let val = keyLine.replace('FIREBASE_PRIVATE_KEY=', '').trim();
if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1);
val = val.replace(/\\n/g, '\n');
console.log('Key starts with:', val.substring(0,40));
console.log('Key contains BEGIN PRIVATE KEY:', val.includes('BEGIN PRIVATE KEY'));
console.log('Key contains newlines:', val.includes('\n'));
console.log('Line count:', val.split('\n').length);
