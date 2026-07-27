import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    console.warn("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };

if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = cached;
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        if (MONGODB_URI) {
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
                return m;
            });
        }
    }

    if (cached.promise) {
        cached.conn = await cached.promise;
    }
    return cached.conn;
}

export default dbConnect;
