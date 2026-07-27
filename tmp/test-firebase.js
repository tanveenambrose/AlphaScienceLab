const admin = require('firebase-admin');
const fs = require('fs');

// Test the key from .env.local
const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const keyLine = lines.find(l => l.startsWith('FIREBASE_PRIVATE_KEY='));
let val = keyLine.replace('FIREBASE_PRIVATE_KEY=', '').trim();
if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1);
val = val.replace(/\\n/g, '\n');

const projectId = 'alpha-science-lab-a7e48';
const clientEmail = 'firebase-adminsdk-fbsvc@alpha-science-lab-a7e48.iam.gserviceaccount.com';

console.log('Attempting Firebase Admin init...');
try {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey: val })
  });
  console.log('SUCCESS! Firebase Admin initialized.');
} catch(e) {
  console.error('FAILED:', e.message);
}
