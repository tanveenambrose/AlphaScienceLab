import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        await db.insert("join_requests", {
            ...data,
            status: "pending",
            created_at: new Date().toISOString(),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }
}
