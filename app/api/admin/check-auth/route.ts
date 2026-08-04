import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUser(accessToken);

        if (!user || !user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const normalizedEmail = user.email.toLowerCase().trim();
        const MAIN_ADMIN_EMAIL = "alphasciencelabmecbd@gmail.com";
        const MEDIA_ADMIN_EMAIL = "racoctanveen15@gmail.com";
        const envSmtpEmail = process.env.SMTP_EMAIL?.toLowerCase().trim();

        const isMain = normalizedEmail === MAIN_ADMIN_EMAIL || normalizedEmail === envSmtpEmail;
        const isMedia = normalizedEmail === MEDIA_ADMIN_EMAIL;

        if (!isMain && !isMedia) {
            return NextResponse.json({ 
                error: "Access Denied: Only alphasciencelabmecbd@gmail.com and racoctanveen15@gmail.com can access the admin panel." 
            }, { status: 403 });
        }

        return NextResponse.json({ 
            authenticated: true, 
            email: user.email,
            role: isMain ? "main" : "media",
        });
    } catch (err) {
        console.error("check-auth error:", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
