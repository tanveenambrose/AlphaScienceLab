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
        const joinRequest = await db.getById("join_requests", id);
        if (!joinRequest) {
            return NextResponse.json({ error: "Application request not found" }, { status: 404 });
        }

        // 2. Generate a secure and readable password
        const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
        const tempPassword = `ASL-${randomHex}`; // e.g. ASL-7B9F1234

        // 3. Create user in Supabase Auth (or handle existing user)
        try {
            await adminCreateUser(joinRequest.email, tempPassword, joinRequest.full_name);
        } catch (authError: any) {
            console.warn("Supabase Auth notice (may already exist):", authError?.message || authError);
        }

        // 4. Save member record in Supabase members table
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
            image_url: joinRequest.photo_url || "",
            temp_password: tempPassword,
            bio: `Official Member of Alpha Science Lab. Department of ${joinRequest.department}, ${joinRequest.batch} Batch.`,
            social_links: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await db.insert("members", memberData);

        // 5. Delete from join_requests
        await db.delete("join_requests", id);

        // 6. Send Automated Welcome Email via Gmail SMTP
        const hostUrl = req.headers.get("origin") || "https://alphasciencelab.org";
        const emailResult = await sendWelcomeEmail(
            joinRequest.email,
            joinRequest.full_name,
            tempPassword,
            `${hostUrl}/login`
        );

        return NextResponse.json({
            success: true,
            emailSent: emailResult.success,
            tempPassword
        });
    } catch (error: any) {
        console.error("Approval workflow error:", error);
        return NextResponse.json({ error: error.message || "Failed to approve member application" }, { status: 500 });
    }
}
