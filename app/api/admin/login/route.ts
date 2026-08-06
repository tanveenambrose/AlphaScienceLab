import { NextResponse } from "next/server";
import { signInWithPassword, db } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const MAIN_ADMIN_EMAIL = "alphasciencelabmecbd@gmail.com";
        const MEDIA_ADMIN_EMAIL = "racoctanveen15@gmail.com";
        const envSmtpEmail = process.env.SMTP_EMAIL?.toLowerCase().trim();

        const isMainAdmin = normalizedEmail === MAIN_ADMIN_EMAIL || normalizedEmail === envSmtpEmail;
        const isMediaAdmin = normalizedEmail === MEDIA_ADMIN_EMAIL;

        // STRICT ACCESS RESTRICTION: Only the 2 designated admin emails can access the admin login
        if (!isMainAdmin && !isMediaAdmin) {
            return NextResponse.json({
                error: "Access Denied: Only authorized administrators (alphasciencelabmecbd@gmail.com or racoctanveen15@gmail.com) can access the admin panel. Other members must log in via the Member Login."
            }, { status: 403 });
        }

        const role = isMainAdmin ? "main" : "media";
        let session = null;

        // 1. Try Supabase Auth password verification
        try {
            session = await signInWithPassword(normalizedEmail, password);
        } catch {
            // 2. Fallback to master admin password check
            if (password === "admin123") {
                try {
                    // Auto-create or ensure user exists in Supabase Auth
                    const { adminCreateUser } = await import("@/lib/supabase");
                    await adminCreateUser(
                        normalizedEmail, 
                        "admin123", 
                        isMainAdmin ? "Alpha Science Lab Main Admin" : "Alpha Science Lab Media Team"
                    );
                    
                    session = await signInWithPassword(normalizedEmail, password);
                } catch (createErr) {
                    console.warn("Auto-create admin notice in Supabase Auth:", createErr);
                }
            } else {
                throw new Error("Invalid password for admin account");
            }
        }

        // Fetch member profile from database to get member image if exists
        let memberData: Record<string, unknown> | null = null;
        try {
            memberData = (await db.getByEmail("members", normalizedEmail)) as Record<string, unknown> | null;
        } catch (e) {
            console.error("Could not fetch member profile from db:", e);
        }

        const defaultName = isMainAdmin ? "Main Admin" : "Media Team Admin";

        const user = {
            id: memberData?.id || session?.user?.id || (isMediaAdmin ? "usr_media_1" : "usr_admin_1"),
            name: memberData?.name || defaultName,
            email: normalizedEmail,
            role: role,
            avatarUrl: memberData?.image || memberData?.image_url || "",
        };

        const response = NextResponse.json({
            success: true,
            message: `Logged in successfully as ${isMainAdmin ? "Main Admin" : "Media Team Admin"}`,
            user,
        });

        if (session?.access_token) {
            response.cookies.set({
                name: "sb-access-token",
                value: session.access_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            if (session.refresh_token) {
                response.cookies.set({
                    name: "sb-refresh-token",
                    value: session.refresh_token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
        }

        response.cookies.set({
            name: "asl-user-role",
            value: role,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication error";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
