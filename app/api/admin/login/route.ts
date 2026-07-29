import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const session = await signInWithPassword(email, password);

        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully",
        });

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

        return response;
    } catch (err) {
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
