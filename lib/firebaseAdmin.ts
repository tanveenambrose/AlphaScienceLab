import * as admin from "firebase-admin";

declare global {
    var __MOCK_FIRESTORE_DATA: any;
}

const initMockDB = () => {
    if (!global.__MOCK_FIRESTORE_DATA) {
        global.__MOCK_FIRESTORE_DATA = { projects: [], joinRequests: [], members: [], gallery: [] };
    }
    const genId = () => Math.random().toString(36).substring(2, 9);
    const getCol = (name: string) => {
        if (!global.__MOCK_FIRESTORE_DATA[name]) global.__MOCK_FIRESTORE_DATA[name] = [];
        return global.__MOCK_FIRESTORE_DATA[name];
    };
    return {
        collection: (name: string) => ({
            orderBy: () => ({
                get: async () => ({ docs: getCol(name).map((d: any) => ({ id: d.id, data: () => d })) })
            }),
            get: async () => ({
                docs: getCol(name).map((d: any) => ({ id: d.id, data: () => d }))
            }),
            count: () => ({
                get: async () => ({ data: () => ({ count: getCol(name).length }) })
            }),
            doc: (id: string) => ({
                get: async () => {
                    const item = getCol(name).find((i: any) => i.id === id);
                    return { exists: !!item, data: () => item };
                },
                update: async (data: any) => {
                    const idx = getCol(name).findIndex((i: any) => i.id === id);
                    if (idx > -1) getCol(name)[idx] = { ...getCol(name)[idx], ...data };
                },
                delete: async () => {
                    global.__MOCK_FIRESTORE_DATA[name] = getCol(name).filter((i: any) => i.id !== id);
                }
            }),
            add: async (data: any) => {
                const id = genId();
                getCol(name).push({ ...data, id });
                return { id };
            }
        })
    };
};

let db: admin.firestore.Firestore | any = initMockDB();
let st: admin.storage.Storage | any = {
    bucket: () => ({
        file: (name: string) => ({
            save: async () => {},
            makePublic: async () => {},
        }),
        name: "mock-bucket"
    })
};
let au: admin.auth.Auth | any = {} as any;

let firebaseInitialized = false;

function tryInitFirebase() {
    if (admin.apps.length > 0) {
        db = admin.firestore();
        st = admin.storage();
        au = admin.auth();
        firebaseInitialized = true;
        return;
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey) {
        console.warn(
            "⚠️  Firebase Admin SDK: Missing environment variables " +
            "(FIREBASE_CLIENT_EMAIL and/or FIREBASE_PRIVATE_KEY). " +
            "Falling back to in-memory mock database."
        );
        return;
    }

    try {
        // Handle potentially quoted or escaped private key strings
        let formattedKey = privateKey;
        if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
            formattedKey = formattedKey.substring(1, formattedKey.length - 1);
        }
        formattedKey = formattedKey.replace(/\\n/g, "\n");

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: formattedKey,
            }),
            storageBucket,
        });

        db = admin.firestore();
        st = admin.storage();
        au = admin.auth();
        firebaseInitialized = true;
        console.log("✅ Firebase Admin SDK initialized successfully with Project ID:", projectId);
    } catch (error: any) {
        console.error("❌ Firebase Admin SDK init failed:", error.message);
    }
}

tryInitFirebase();

export const adminDb = db;
export const adminStorage = st;
export const adminAuth = au;
export const isFirebaseReady = firebaseInitialized;
