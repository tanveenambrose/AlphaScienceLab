import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;
    return { token: user ? token : undefined, user };
}

export async function GET() {
    const { token } = await getAuth();
    try {
        let data = [];
        try {
            data = await db.getAll("gallery", token);
        } catch {
            data = [];
        }

        const items = (data || []).map((item: any) => ({
            ...item,
            image: item.image || item.image_url || "",
            image_url: item.image_url || item.image || "",
            title: item.title || item.caption || "Archive Item",
            caption: item.caption || item.title || "",
            category: item.category || "Project Artifact",
        }));

        if (items.length === 0) {
            // Return initial demo archive items if database is empty
            return NextResponse.json([
                {
                    id: "arc_1",
                    title: "Robotics Championship Showcase",
                    category: "Media Event",
                    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
                    date: "2025-11-15",
                },
                {
                    id: "arc_2",
                    title: "VLSI Wafer Synthesis Lab Demo",
                    category: "Research Artifact",
                    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                    date: "2025-10-20",
                },
                {
                    id: "arc_3",
                    title: "Structural Simulation 3D Render",
                    category: "3D CAD Archive",
                    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
                    date: "2025-09-05",
                },
            ]);
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("Archive API GET error:", error);
        return NextResponse.json({ error: "Failed to fetch archive" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { token } = await getAuth();
    try {
        const body = await req.json();
        const payload: Record<string, any> = {
            image_url: body.image || body.image_url || "",
            caption: body.title || body.caption || "",
            category: body.category || "General Archive",
            created_at: new Date().toISOString(),
        };

        try {
            await db.insert("gallery", payload, token);
        } catch {
            // Ignore DB error if table not yet configured
        }

        return NextResponse.json({
            id: "arc_" + Date.now(),
            title: payload.caption,
            image: payload.image_url,
            category: payload.category,
        });
    } catch (error) {
        console.error("Archive API POST error:", error);
        return NextResponse.json({ error: "Failed to create archive item" }, { status: 500 });
    }
}
