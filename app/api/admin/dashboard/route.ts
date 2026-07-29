import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const [projects, requests, members, gallery] = await Promise.all([
            db.count("projects"),
            db.count("join_requests"),
            db.count("members"),
            db.count("gallery"),
        ]);

        return NextResponse.json({ projects, requests, members, gallery });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
