import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

        const email = (supabaseUser.email || "").toLowerCase().trim();
        let role = userRoleCookie;
        if (!role) {
            if (email.includes("media")) {
                role = "media";
            } else if (email.includes("admin") || email === process.env.SMTP_EMAIL?.toLowerCase().trim()) {
                role = "main";
            } else {
                role = "member";
            }
        }

        // Fetch member profile from database to get member image and official details
        let memberData: any = null;
        try {
            memberData = await db.getByEmail("members", email);
        } catch (e) {
            console.error("Could not fetch member profile from db:", e);
        }

        const dbImage = memberData?.image || memberData?.image_url;
        const dbName = memberData?.name;

        const defaultName = supabaseUser.email?.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "User";

        return NextResponse.json({
            authenticated: true,
            user: {
                id: memberData?.id || supabaseUser.id,
                email: supabaseUser.email,
                name: dbName || defaultName,
                role: role,
                avatarUrl: dbImage || "",
                department: memberData?.department || "",
                batch: memberData?.batch || "",
                class_roll: memberData?.class_roll || "",
                registration: memberData?.registration || "",
                mobile: memberData?.mobile || "",
            },
        });
    } catch (err) {
        console.error("Auth /api/auth/me error:", err);
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
}
