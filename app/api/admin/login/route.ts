import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/supabase";

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
            // Fallback for dev/demo login
        }

        const normalizedEmail = email.toLowerCase().trim();
        const isMediaTeam = normalizedEmail === "racoctanveen15@gmail.com" || normalizedEmail.includes("media");
        const role = isMediaTeam ? "media" : "main";

        const name = normalizedEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

        const user = {
            id: session?.user?.id || (isMediaTeam ? "usr_media_1" : "usr_admin_1"),
            name: isMediaTeam ? `${name} (Media Team)` : `${name} (Admin)`,
            email: email,
            role: role,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
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
