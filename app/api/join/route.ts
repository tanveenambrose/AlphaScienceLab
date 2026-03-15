import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const docRef = await adminDb.collection("joinRequests").add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }
}
