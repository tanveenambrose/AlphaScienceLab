import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { name, avatarUrl, currentPassword, newPassword } = body;

        // Validation
        if (newPassword && !currentPassword) {
            return NextResponse.json({ error: "Current password is required to set a new password." }, { status: 400 });
        }

        if (newPassword && newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        // Return updated metadata confirmation
        return NextResponse.json({
            success: true,
            message: "Profile updated successfully!",
            updated: {
                name,
                avatarUrl,
            },
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update profile";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
