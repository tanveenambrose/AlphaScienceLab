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
        const data = await db.getAll("gallery", token);
        const items = (data || []).map((item: any) => ({
            ...item,
            image: item.image || item.image_url || "",
            image_url: item.image_url || item.image || "",
            title: item.title || item.caption || "",
            caption: item.caption || item.title || "",
        }));
        return NextResponse.json(items);
    } catch (error) {
        console.error("Gallery API GET error:", error);
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { user, token } = await getAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const payload: Record<string, any> = {
            image_url: body.image_url || body.image || "",
            caption: body.caption || body.title || "",
            created_at: new Date().toISOString(),
        };
        if (body.category) payload.category = body.category;

        const data = await db.insert("gallery", payload, token);
        const result = Array.isArray(data) ? data[0] : data;
        const normalized = result
            ? {
                  ...result,
                  image: result.image_url || result.image || "",
                  title: result.caption || result.title || "",
              }
            : result;
        return NextResponse.json(normalized);
    } catch (error) {
        console.error("Gallery API POST error:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
