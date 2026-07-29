import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase";

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("sb-access-token")?.value;

    let user = null;
    if (accessToken) {
        user = await getUser(accessToken);
    }

    // Protect admin routes (except /admin/login)
    if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login") && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
