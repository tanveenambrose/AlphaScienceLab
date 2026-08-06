import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";
import { sendPasswordRecoveryEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        let email = "";

        // Try getting email from request body
        try {
            const body = await req.json();
            if (body?.email) {
                email = body.email.toLowerCase().trim();
            }
        } catch {
            // body might be empty if called from authenticated session
        }

        // If no email in body, try to get from session cookies
        if (!email) {
            const cookieStore = await cookies();
            const token = cookieStore.get("sb-access-token")?.value;
            if (token) {
                const user = await getUser(token);
                if (user?.email) {
                    email = user.email.toLowerCase().trim();
                }
            }
        }

        if (!email) {
            return NextResponse.json({ error: "Email address is required for password recovery." }, { status: 400 });
        }

        // Query member from database
        let member: Record<string, unknown> | null = null;
        try {
            member = (await db.getByEmail("members", email)) as Record<string, unknown> | null;
        } catch (dbErr) {
            console.error("Failed to query member by email:", dbErr);
        }

        // If member doesn't exist in members table
        if (!member) {
            // Check if it's admin email
            if (email === process.env.SMTP_EMAIL?.toLowerCase().trim()) {
                const emailRes = await sendPasswordRecoveryEmail(
                    email,
                    "Administrator",
                    "admin123"
                );
                if (!emailRes.success) {
                    return NextResponse.json({ error: emailRes.error || "Failed to send email" }, { status: 500 });
                }
                return NextResponse.json({
                    success: true,
                    message: `Present password has been sent to ${email}. Please check your inbox.`,
                });
            }

            return NextResponse.json({
                error: "No registered member account was found associated with this email address.",
            }, { status: 404 });
        }

        // Member found, retrieve present password
        const presentPassword = member.temp_password as string | undefined;

        if (!presentPassword) {
            return NextResponse.json({
                error: "No recoverable present password found on file for this account. Please contact an ASL admin.",
            }, { status: 400 });
        }

        // Send email via Gmail SMTP with ASL Logo
        const emailRes = await sendPasswordRecoveryEmail(
            email,
            (member.name as string) || "Member",
            presentPassword
        );

        if (!emailRes.success) {
            return NextResponse.json({
                error: `Failed to dispatch recovery email: ${emailRes.error || "SMTP error"}`,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Present password successfully sent to ${email}. Please check your inbox and spam folder.`,
        });
    } catch (err: unknown) {
        console.error("Forgot password route error:", err);
        return NextResponse.json({
            error: err instanceof Error ? err.message : "Internal server error occurred while recovering password.",
        }, { status: 500 });
    }
}
