import { NextResponse } from "next/server";
import { signInWithPassword, db } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Sign in via Supabase Auth
        let session = null;
        try {
            session = await signInWithPassword(normalizedEmail, password);
        } catch {
            // Also check if member exists in members table with matching temp_password
            let memberByDb = null;
            try {
                memberByDb = await db.getByEmail("members", normalizedEmail);
            } catch (e) {
                console.error("DB check failed:", e);
            }

            if (memberByDb && memberByDb.temp_password && memberByDb.temp_password === password) {
                // Member found with matching password
            } else {
                throw new Error("Invalid email or password");
            }
        }

        // Fetch member profile from database to get member image and official details
        let memberData: any = null;
        try {
            memberData = await db.getByEmail("members", normalizedEmail);
        } catch (e) {
            console.error("Could not fetch member profile from db:", e);
        }

        const defaultName = normalizedEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        const user = {
            id: memberData?.id || session?.user?.id || "usr_member_" + Math.random().toString(36).substring(2, 9),
            name: memberData?.name || defaultName || "ASL Member",
            email: normalizedEmail,
            role: "member",
            avatarUrl: memberData?.image || memberData?.image_url || "",
            department: memberData?.department || "",
            batch: memberData?.batch || "",
            class_roll: memberData?.class_roll || "",
            registration: memberData?.registration || "",
            mobile: memberData?.mobile || "",
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
