const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const keyLine = lines.find(l => l.startsWith('FIREBASE_PRIVATE_KEY='));
let val = keyLine.replace('FIREBASE_PRIVATE_KEY=', '').trim();
if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1);
val = val.replace(/\\n/g, '\n');

const keyLines = val.split('\n');
console.log('Total lines in key:', keyLines.length);
console.log('\nRaw base64 lines (checking lengths):');
keyLines.forEach((line, i) => {
  if (line.includes('KEY') || line === '') {
    console.log(`Line ${i}: ${line} (${line.length})`);
  } else {
    console.log(`Line ${i}: length=${line.length}`);
  }
});

// The standard PEM RSA 2048 base64 lines should be 64 chars each  
// Any non-64 line (except last partial and header/footer) would indicate corruption
