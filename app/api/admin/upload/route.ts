import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value === "mock-jwt-token-pending-db";
}

export async function POST(req: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `projects/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        
        const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
        const fileRef = bucket.file(filename);

        await fileRef.save(buffer, {
            metadata: { contentType: file.type },
        });

        await fileRef.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
