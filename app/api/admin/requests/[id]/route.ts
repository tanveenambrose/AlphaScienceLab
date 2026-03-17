import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value === "mock-jwt-token-pending-db";
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await props.params;
        await adminDb.collection("joinRequests").doc(id).delete();
        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await props.params;
        const data = await req.json();
        await adminDb.collection("joinRequests").doc(id).update({
            ...data,
            updatedAt: new Date().toISOString()
        });
        return NextResponse.json({ success: true, id, ...data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
