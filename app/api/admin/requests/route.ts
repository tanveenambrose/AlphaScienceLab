import { NextResponse } from "next/server";
import { adminDb, isFirebaseReady } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value === "mock-jwt-token-pending-db";
}

export async function GET() {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        console.log(`Fetch requests. Firebase Live: ${isFirebaseReady}`);
        const snapshot = await adminDb.collection("joinRequests").orderBy("createdAt", "desc").get();
        const requests = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}
