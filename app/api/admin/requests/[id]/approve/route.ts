import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db, adminCreateUser } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
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

        // 2. Generate temporary password
        const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 character alphanumeric

        // 3. Create user in Supabase Auth
        try {
            await adminCreateUser(joinRequest.email, tempPassword, joinRequest.full_name);
        } catch (authError: any) {
            console.error("Auth creation error:", authError);
            return NextResponse.json({ error: authError.message || "Failed to create user account" }, { status: 500 });
        }

        // 4. Insert into members
        const memberData = {
            name: joinRequest.full_name,
            email: joinRequest.email,
            role: "Member",
            department: joinRequest.department,
            batch: joinRequest.batch,
            class_roll: joinRequest.class_roll,
            registration: joinRequest.registration,
            mobile: joinRequest.mobile,
            image: joinRequest.photo_url || "",
            temp_password: tempPassword,
            bio: `Member since ${new Date().getFullYear()}. Department of ${joinRequest.department}, ${joinRequest.batch} Batch.`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await db.insert("members", memberData, token);

        // 5. Delete from join_requests
        await db.delete("join_requests", id, token);

        // 6. Send Welcome Email
        await sendWelcomeEmail(joinRequest.email, joinRequest.full_name, tempPassword);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Approve error:", error);
        return NextResponse.json({ error: error.message || "Failed to approve request" }, { status: 500 });
    }
}
