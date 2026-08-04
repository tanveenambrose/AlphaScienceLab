import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;
    return { token, user };
}

export async function GET() {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await db.getAll("join_requests");
        return NextResponse.json(data || []);
    } catch (err: any) {
        console.error("Fetch requests error:", err.message, err);
        return NextResponse.json({ error: "Failed to fetch requests", details: err.message }, { status: 500 });
    }
}
