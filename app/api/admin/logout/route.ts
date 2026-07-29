import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/lib/supabase";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (refreshToken) {
        await signOut(refreshToken);
    }

    const response = NextResponse.json({ success: true, message: "Logged out" });
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");

    return response;
}
