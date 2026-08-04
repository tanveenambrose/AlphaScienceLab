import { NextResponse } from "next/server";
import { signInWithPassword, db } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        let session = null;
        try {
            session = await signInWithPassword(email, password);
        } catch {
            // Check hardcoded admin credentials
            if (email === process.env.SMTP_EMAIL && password === "admin123") {
                try {
                    // Auto-create the admin user in Supabase if they don't exist
                    const { adminCreateUser } = await import("@/lib/supabase");
                    await adminCreateUser(email, password, "Main Admin");
                    
                    // Now login should succeed and provide a valid session token
                    session = await signInWithPassword(email, password);
                } catch (createErr) {
                    console.error("Auto-create admin failed:", createErr);
                    throw new Error("Invalid credentials");
                }
            } else {
                throw new Error("Invalid credentials");
            }
        }

        const normalizedEmail = email.toLowerCase().trim();
        const isMediaTeam = normalizedEmail === "racoctanveen15@gmail.com" || normalizedEmail.includes("media");
        
        let role = "main";
        if (normalizedEmail === process.env.SMTP_EMAIL?.toLowerCase().trim()) {
            role = "main";
        } else if (isMediaTeam) {
            role = "media";
        }

        // Fetch member profile from database to get member image if exists
        let memberData: any = null;
        try {
            memberData = await db.getByEmail("members", normalizedEmail);
        } catch (e) {
            console.error("Could not fetch member profile from db:", e);
        }

        const name = normalizedEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

        const user = {
            id: memberData?.id || session?.user?.id || (isMediaTeam ? "usr_media_1" : "usr_admin_1"),
            name: memberData?.name || (isMediaTeam ? `${name} (Media Team)` : `${name} (Admin)`),
            email: email,
            role: role,
            avatarUrl: memberData?.image || memberData?.image_url || "",
        };

        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully",
            user,
        });

        if (session) {
            response.cookies.set({
                name: "sb-access-token",
                value: session.access_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            response.cookies.set({
                name: "sb-refresh-token",
                value: session.refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
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
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
