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
        const data = await db.getAll("notifications", token);
        // Map database schema to frontend expectations
        const formatted = data.map((n: any) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            description: n.description,
            author: {
                name: n.author_name,
                role: n.author_role,
                email: n.author_email,
            },
            targetName: n.target_name,
            content: n.content,
            timestamp: new Date(n.created_at).toLocaleString(),
            status: n.status,
        }));
        return NextResponse.json(formatted || []);
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { token } = await getAuth();
    try {
        const { id, status } = await req.json();
        const data = await db.update("notifications", id, { status }, token);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Failed to update notification:", error);
        return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
    }
}
