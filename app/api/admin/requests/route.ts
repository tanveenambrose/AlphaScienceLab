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
    const { user } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const normalizedEmail = (user.email || "").toLowerCase().trim();
    const MAIN_ADMIN_EMAIL = "alphasciencelabmecbd@gmail.com";
    const isMainAdmin = normalizedEmail === MAIN_ADMIN_EMAIL || normalizedEmail === process.env.SMTP_EMAIL?.toLowerCase().trim();

    if (!isMainAdmin) {
        return NextResponse.json({ error: "Access Denied: Only Main Admin (alphasciencelabmecbd@gmail.com) can access join requests" }, { status: 403 });
    }

    try {
        const data = await db.getAll("join_requests");
        return NextResponse.json(data || []);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch requests error:", msg, err);
        return NextResponse.json({ error: "Failed to fetch requests", details: msg }, { status: 500 });
    }
}
