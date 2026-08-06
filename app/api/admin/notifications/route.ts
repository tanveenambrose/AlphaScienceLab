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
    const { token, user } = await getAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await db.getAll("notifications", token);
        // Exclude join requests - only events, projects, archive, and achievements updates are shown in notifications
        type NotifRecord = {
            id?: string;
            type?: string;
            title?: string;
            description?: string;
            link?: string;
            created_at?: string;
            read?: boolean;
            author_name?: string;
            author_role?: string;
            author_email?: string;
            target_name?: string;
            content?: string;
            status?: string;
        };
        const filtered = (data || []).filter((n: NotifRecord) => n.type !== "join_request");

        // Map database schema to frontend expectations
        const formatted = filtered.map((n: NotifRecord) => ({
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
            timestamp: n.created_at ? new Date(n.created_at).toLocaleString() : new Date().toLocaleString(),
            status: n.status || "pending",
        }));
        return NextResponse.json(formatted || []);
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { token, user } = await getAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await req.json();
        const data = await db.update("notifications", id, { status }, token);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Failed to update notification:", error);
        return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { token, user } = await getAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
        }
        await db.delete("notifications", id, token);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
}
