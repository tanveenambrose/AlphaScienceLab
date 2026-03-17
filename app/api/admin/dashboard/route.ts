import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value === "mock-jwt-token-pending-db";
}

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [projectsSnap, requestsSnap, membersSnap, gallerySnap] = await Promise.all([
            adminDb.collection("projects").count().get(),
            adminDb.collection("joinRequests").count().get(),
            adminDb.collection("members").count().get(),
            adminDb.collection("gallery").count().get(),
        ]);

        return NextResponse.json({
            projects: projectsSnap.data().count,
            requests: requestsSnap.data().count,
            members: membersSnap.data().count,
            gallery: gallerySnap.data().count,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
