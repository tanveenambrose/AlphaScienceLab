const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const keyLine = lines.find(l => l.startsWith('FIREBASE_PRIVATE_KEY='));
let val = keyLine.replace('FIREBASE_PRIVATE_KEY=', '').trim();
if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1);
val = val.replace(/\\n/g, '\n');

// Extract raw base64 by stripping header/footer/newlines
const headerMatch = val.match(/-----BEGIN PRIVATE KEY-----([^-]+)-----END PRIVATE KEY-----/);
if (!headerMatch) {
  console.error('Cannot find PEM markers!');
  process.exit(1);
}

const rawBase64 = headerMatch[1].replace(/\n/g, '').replace(/\r/g, '').trim();
console.log('Raw base64 length:', rawBase64.length);

// Re-wrap at 64 chars
let wrapped = '';
for (let i = 0; i < rawBase64.length; i += 64) {
  wrapped += rawBase64.substring(i, i + 64) + '\n';
}

const reformattedPem = '-----BEGIN PRIVATE KEY-----\n' + wrapped + '-----END PRIVATE KEY-----\n';

console.log('Reformatted key line count:', reformattedPem.split('\n').length);

// Test if it parses correctly
const admin = require('firebase-admin');
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'alpha-science-lab-a7e48',
      clientEmail: 'firebase-adminsdk-fbsvc@alpha-science-lab-a7e48.iam.gserviceaccount.com',
      privateKey: reformattedPem,
    })
  });
  console.log('SUCCESS! Firebase Admin initialized with reformatted key.');
  
  // Output the new .env.local key value (escaped for env file)
  const escapedKey = reformattedPem.replace(/\n/g, '\\n');
  console.log('\nNew FIREBASE_PRIVATE_KEY value:');
  console.log(`"${escapedKey}"`);
} catch(e) {
  console.error('FAILED:', e.message);
}
