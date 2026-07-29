import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;
    return { token: user ? token : undefined, user };
}

export async function GET() {
    const { token } = await getAuth();
    try {
        const data = await db.getAll("members", token);
        return NextResponse.json(data || []);
    } catch (error) {
        console.error("Members API GET error:", error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const data = await db.insert("members", { ...body, created_at: new Date().toISOString() }, token);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Members API POST error:", error);
        return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }
}
