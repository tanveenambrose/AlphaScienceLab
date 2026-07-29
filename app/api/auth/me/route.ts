import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/supabase";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;
        const userRoleCookie = cookieStore.get("asl-user-role")?.value;

        if (!accessToken) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const supabaseUser = await getUser(accessToken);

        if (!supabaseUser) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const email = (supabaseUser.email || "").toLowerCase();
        let role = userRoleCookie;
        if (!role) {
            if (email.includes("media")) {
                role = "media";
            } else if (email.includes("admin")) {
                role = "main";
            } else {
                role = "member";
            }
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: supabaseUser.id,
                email: supabaseUser.email,
                name: supabaseUser.email?.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "User",
                role: role,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(supabaseUser.email || "user")}`,
            },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
}
