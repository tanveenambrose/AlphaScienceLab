import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Try Supabase auth or fallback demo auth
        let session = null;
        try {
            session = await signInWithPassword(email, password);
        } catch {
            // Demo fallback for testing member login
        }

        const name = email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        const user = {
            id: session?.user?.id || "usr_member_" + Math.random().toString(36).substring(2, 9),
            name: name || "ASL Member",
            email: email,
            role: "member",
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        };

        const response = NextResponse.json({
            success: true,
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
        }

        response.cookies.set({
            name: "asl-user-role",
            value: "member",
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
