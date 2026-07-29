import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, uploadFile } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const buffer = await file.arrayBuffer();
        const filename = `projects/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        const url = await uploadFile(buffer, filename, file.type, "uploads", token);
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
