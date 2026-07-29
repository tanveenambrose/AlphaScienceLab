"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGalleryRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/archive");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen text-zinc-400 text-sm">
            Redirecting to Archive...
        </div>
    );
}
