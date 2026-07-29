import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const user = token ? await getUser(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await props.params;
        await db.delete("gallery", id, token);
        return NextResponse.json({ success: true, id });
    } catch {
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
}
