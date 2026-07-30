import { NextResponse } from "next/server";
import { db, uploadFile } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        
        const email = formData.get("email") as string;
        const fullName = formData.get("fullName") as string;
        const department = formData.get("department") as string;
        const batch = formData.get("batch") as string;
        const classRoll = formData.get("classRoll") as string;
        const registration = formData.get("registration") as string;
        const mobile = formData.get("mobile") as string;
        const photo = formData.get("photo") as File | null;

        if (!email || !fullName || !department || !batch || !classRoll || !registration || !mobile || !photo) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload photo to Supabase storage
        const arrayBuffer = await photo.arrayBuffer();
        const fileExt = photo.name.split('.').pop();
        const filename = `join_requests/${Date.now()}_${classRoll}.${fileExt}`;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
        
        let photoUrl = "";
        try {
            photoUrl = await uploadFile(arrayBuffer, filename, photo.type, "uploads", serviceKey);
        } catch (uploadError) {
            console.error("Photo upload failed:", uploadError);
            return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
        }

        // Insert into join_requests
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

        await db.insert("join_requests", joinRequestData, serviceKey);

        // Insert notification
        const notificationData = {
            type: "join_request",
            title: "New Membership Application",
            description: `${fullName} (Roll: ${classRoll}) has applied to join ASL.`,
            author_name: fullName,
            author_role: `Applicant - ${department} ${batch}`,
            author_email: email,
            target_name: "ASL Membership",
            content: `Please review their application details and photo.`,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        await db.insert("notifications", notificationData, serviceKey);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Join submission error:", error);
        return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }
}
