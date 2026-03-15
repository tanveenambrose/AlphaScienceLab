import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true, message: "Logged out" });
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return response;
}
