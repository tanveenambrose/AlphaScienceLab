import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sb-access-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUser(token);
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 1. Get active join requests count for Main Admin
        let joinRequestsCount = 0;
        if (isMain) {
            try {
                // Count all pending applications in join_requests
                joinRequestsCount = await db.count("join_requests");
            } catch (err) {
                console.error("Count join_requests error:", err);
            }
        }

        // 2. Get active notifications count (events, projects, archive, achievements - excluding join_request)
        let notificationsCount = 0;
        try {
            const allNotifs = await db.getAll("notifications");
            const pendingNotifs = (allNotifs || []).filter(
                (n: any) => n.type !== "join_request" && (n.status === "pending" || !n.status)
            );
            notificationsCount = pendingNotifs.length;
        } catch (err) {
            console.error("Count notifications error:", err);
        }

        return NextResponse.json({
            joinRequests: joinRequestsCount,
            notifications: notificationsCount,
        });
    } catch (error) {
        console.error("Admin counts error:", error);
        return NextResponse.json({ joinRequests: 0, notifications: 0 }, { status: 500 });
    }
}
