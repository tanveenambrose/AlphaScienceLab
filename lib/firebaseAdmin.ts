import * as admin from "firebase-admin";

interface MockItem {
    id: string;
    [key: string]: unknown;
}

declare global {
    var __MOCK_FIRESTORE_DATA: Record<string, MockItem[]> | undefined;
}

const initMockDB = () => {
    if (!globalThis.__MOCK_FIRESTORE_DATA) {
        globalThis.__MOCK_FIRESTORE_DATA = { projects: [], joinRequests: [], members: [], gallery: [] };
    }
    const genId = () => Math.random().toString(36).substring(2, 9);
    const getCol = (name: string): MockItem[] => {
        if (!globalThis.__MOCK_FIRESTORE_DATA) {
            globalThis.__MOCK_FIRESTORE_DATA = { projects: [], joinRequests: [], members: [], gallery: [] };
        }
        if (!globalThis.__MOCK_FIRESTORE_DATA[name]) {
            globalThis.__MOCK_FIRESTORE_DATA[name] = [];
        }
        return globalThis.__MOCK_FIRESTORE_DATA[name];
    };
    return {
        collection: (name: string) => ({
            orderBy: () => ({
                get: async () => ({ docs: getCol(name).map((d) => ({ id: d.id, data: () => d })) })
            }),
            get: async () => ({
                docs: getCol(name).map((d) => ({ id: d.id, data: () => d }))
            }),
            count: () => ({
                get: async () => ({ data: () => ({ count: getCol(name).length }) })
            }),
            doc: (id: string) => ({
                get: async () => {
                    const item = getCol(name).find((i) => i.id === id);
                    return { exists: !!item, data: () => item };
                },
                update: async (data: Record<string, unknown>) => {
                    const col = getCol(name);
                    const idx = col.findIndex((i) => i.id === id);
                    if (idx > -1) col[idx] = { ...col[idx], ...data };
                },
                delete: async () => {
                    if (globalThis.__MOCK_FIRESTORE_DATA) {
                        globalThis.__MOCK_FIRESTORE_DATA[name] = getCol(name).filter((i) => i.id !== id);
                    }
                }
            }),
            add: async (data: Record<string, unknown>) => {
                const id = genId();
                getCol(name).push({ ...data, id });
                return { id };
            }
        })
    };
};

let db: admin.firestore.Firestore = initMockDB() as unknown as admin.firestore.Firestore;
let st: admin.storage.Storage = {
    bucket: () => ({
        file: () => ({
            save: async () => {},
            makePublic: async () => {},
        }),
        name: "mock-bucket"
    })
} as unknown as admin.storage.Storage;
let au: admin.auth.Auth = {} as admin.auth.Auth;

let firebaseInitialized = false;

function formatKey(key: string): string {
    let k = key.trim();
    if (k.startsWith('"') && k.endsWith('"')) {
        k = k.substring(1, k.length - 1);
    }
    if (k.includes("\\n")) {
        k = k.replace(/\\n/g, "\n");
    }
    return k;
}

function tryInitFirebase() {
    if (admin.apps.length > 0) {
        db = admin.firestore();
        st = admin.storage();
        au = admin.auth();
        firebaseInitialized = true;
        return;
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "alpha-science-lab-a7e48";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !rawPrivateKey) {
        console.warn(
            "⚠️  Firebase Admin SDK: Missing environment variables. Falling back to in-memory mock database."
        );
        return;
    }

    try {
        const privateKey = formatKey(rawPrivateKey);
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
            storageBucket,
        });

        db = admin.firestore();
        st = admin.storage();
        au = admin.auth();
        firebaseInitialized = true;
        console.log("✅ Firebase Admin SDK initialized successfully with Project ID:", projectId);
    } catch (error: unknown) {
        const errMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ Firebase Admin SDK init failed:", errMessage);
    }
}

tryInitFirebase();

export const adminDb = db;
export const adminStorage = st;
export const adminAuth = au;
export const isFirebaseReady = firebaseInitialized;
