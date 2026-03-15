import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value === "mock-jwt-token-pending-db";
}

export async function GET() {
    try {
        const snapshot = await adminDb.collection("gallery").orderBy("createdAt", "desc").get();
        const gallery = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(gallery);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const data = await req.json();
        const docRef = await adminDb.collection("gallery").add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return NextResponse.json({ id: docRef.id, ...data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
