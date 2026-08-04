import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";
import { sendRejectionEmail } from "@/lib/email";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Fetch request details before deleting
        const joinRequest = await db.getById("join_requests", id);
        if (!joinRequest) {
            return NextResponse.json({ error: "Application request not found" }, { status: 404 });
        }

        // Delete from join_requests
        await db.delete("join_requests", id);

        // Send automated rejection email via Gmail SMTP
        let emailSent = false;
        if (joinRequest.email) {
            const emailResult = await sendRejectionEmail(
                joinRequest.email,
                joinRequest.full_name || "Applicant"
            );
            emailSent = emailResult.success;
        }

        return NextResponse.json({
            success: true,
            id,
            emailSent
        });
    } catch (error: any) {
        console.error("Rejection workflow error:", error);
        return NextResponse.json({ error: error?.message || "Failed to reject application" }, { status: 500 });
    }
}
