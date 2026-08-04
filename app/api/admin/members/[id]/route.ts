import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

async function getAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;
    return { token, user };
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await props.params;
        const body = await req.json();
        await db.update("members", id, { ...body, updated_at: new Date().toISOString() });
        return NextResponse.json({ id, ...body });
    } catch {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await props.params;
        await db.delete("members", id);
        return NextResponse.json({ success: true, id });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
