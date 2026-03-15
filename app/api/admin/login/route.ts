import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // This is a temporary placeholder setup until MongoDB is linked.
        if (email === "racoctanveen15@gmail.com" && password === "admin123") {
            const response = NextResponse.json({ success: true, message: "Logged in successfully" });
            
            // Set a securely signed dummy cookie to simulate session
            response.cookies.set({
                name: "admin_token",
                value: "mock-jwt-token-pending-db",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return response;
        }

        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
