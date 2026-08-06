import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;

        if (!accessToken) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const supabaseUser = await getUser(accessToken);

        if (!supabaseUser) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const normalizedEmail = (supabaseUser.email || "").toLowerCase().trim();
        const MAIN_ADMIN_EMAIL = "alphasciencelabmecbd@gmail.com";
        const MEDIA_ADMIN_EMAIL = "racoctanveen15@gmail.com";
        const envSmtpEmail = process.env.SMTP_EMAIL?.toLowerCase().trim();

        // Strictly determine role from email
        let role = "member";
        if (normalizedEmail === MAIN_ADMIN_EMAIL || normalizedEmail === envSmtpEmail) {
            role = "main";
        } else if (normalizedEmail === MEDIA_ADMIN_EMAIL) {
            role = "media";
        } else {
            role = "member";
        }

        // Fetch member profile from database to get member image and official details
        let memberData: Record<string, unknown> | null = null;
        try {
            memberData = (await db.getByEmail("members", normalizedEmail)) as Record<string, unknown> | null;
        } catch (e) {
            console.error("Could not fetch member profile from db:", e);
        }

        const dbImage = memberData?.image || memberData?.image_url;
        const dbName = memberData?.name;

        const defaultName = normalizedEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "User";

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
