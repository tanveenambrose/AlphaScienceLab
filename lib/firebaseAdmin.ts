import * as admin from "firebase-admin";

import { serviceAccount } from "./firebaseServiceAccount";

let db: admin.firestore.Firestore | any = {
    collection: () => ({
        orderBy: () => ({ get: async () => ({ docs: [] }) }),
        get: async () => ({ docs: [] }),
        doc: () => ({
            get: async () => ({ exists: false, data: () => ({}) }),
            update: async () => ({}),
            delete: async () => ({})
        }),
        add: async () => ({ id: "mock-id" })
    })
} as any;
let st: admin.storage.Storage | any = {} as any;
let au: admin.auth.Auth | any = {} as any;

if (!admin.apps.length) {
    try {
        const rawCreds = require("../firebase-secret.json");
        const parsedCredentials = {
            ...rawCreds,
            private_key: rawCreds.private_key.replace(/\\n/g, '\n')
        };
        
        admin.initializeApp({
            credential: admin.credential.cert(parsedCredentials),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        db = admin.firestore();
        st = admin.storage();
        au = admin.auth();
    } catch (error) {
        console.error("Firebase admin init failed (likely during build or missing valid secret):", error);
    }
} else {
    db = admin.firestore();
    st = admin.storage();
    au = admin.auth();
}

export const adminDb = db;
export const adminStorage = st;
export const adminAuth = au;
