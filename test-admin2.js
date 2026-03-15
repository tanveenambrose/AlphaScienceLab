const admin = require('firebase-admin');
const rawCreds = require('./firebase-secret.json');

const parsedCredentials = {
    ...rawCreds,
    private_key: typeof rawCreds.private_key === 'string' 
        ? rawCreds.private_key.replace(/\\n/g, '\n')
        : rawCreds.private_key
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(parsedCredentials)
  });
  console.log("SUCCESS!");
} catch (error) {
  console.error("FAIL:", error);
}
