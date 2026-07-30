import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // 1. Fetch the request
        const joinRequest = await db.getById("join_requests", id, token);
        if (!joinRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // 2. Insert into members
        const memberData = {
            name: joinRequest.full_name,
            role: "General Member",
            department: joinRequest.department,
            batch: joinRequest.batch,
            image_url: joinRequest.photo_url || "",
            bio: `Member since ${new Date().getFullYear()}. Department of ${joinRequest.department}, ${joinRequest.batch} Batch.`,
            social_links: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await db.insert("members", memberData, token);

        // 3. Delete from join_requests
        await db.delete("join_requests", id, token);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Approve error:", error);
        return NextResponse.json({ error: "Failed to approve request" }, { status: 500 });
    }
}
