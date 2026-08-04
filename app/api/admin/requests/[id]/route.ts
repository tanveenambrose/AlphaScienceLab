import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";
import { sendRejectionEmail } from "@/lib/email";

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
        await db.update("join_requests", id, { ...body, updated_at: new Date().toISOString() });
        return NextResponse.json({ success: true, id });
    } catch {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await props.params;
        
        // Fetch request details before deleting to send email
        const joinRequest = await db.getById("join_requests", id);
        
        await db.delete("join_requests", id);

        // Send rejection email if request was found
        if (joinRequest && joinRequest.email) {
            await sendRejectionEmail(joinRequest.email, joinRequest.full_name || "Applicant");
        }

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Failed to delete/reject:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
