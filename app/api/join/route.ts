import { NextResponse } from "next/server";
import { db, uploadFile } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        
        const email = (formData.get("email") as string || "").trim();
        const fullName = (formData.get("fullName") as string || "").trim();
        const department = (formData.get("department") as string || "").trim();
        const batch = (formData.get("batch") as string || "").trim();
        const classRoll = (formData.get("classRoll") as string || "").trim();
        const registration = (formData.get("registration") as string || "").trim();
        const mobile = (formData.get("mobile") as string || "").trim();
        const photo = formData.get("photo") as File | null;

        if (!email || !fullName || !department || !batch || !classRoll || !registration || !mobile || !photo) {
            return NextResponse.json({ error: "All fields including photo are required" }, { status: 400 });
        }

        // Upload photo to Supabase storage
        const arrayBuffer = await photo.arrayBuffer();
        const fileExt = photo.name.split('.').pop() || "jpg";
        const filename = `join_requests/${Date.now()}_${classRoll.replace(/\s+/g, "_")}.${fileExt}`;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
        
        let photoUrl = "";
        try {
            photoUrl = await uploadFile(arrayBuffer, filename, photo.type || "image/jpeg", "uploads", serviceKey);
        } catch (uploadError) {
            console.warn("Storage bucket upload failed, using Base64 fallback:", uploadError);
            const buffer = Buffer.from(arrayBuffer);
            photoUrl = `data:${photo.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
        }

        // Insert into join_requests table
        const joinRequestData = {
            full_name: fullName,
            email,
            department,
            batch,
            class_roll: classRoll,
            registration,
            mobile,
            photo_url: photoUrl,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        const inserted = await db.insert("join_requests", joinRequestData);

        return NextResponse.json({ success: true, data: inserted });
    } catch (error: unknown) {
        console.error("Join submission error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to submit request" }, { status: 500 });
    }
}
