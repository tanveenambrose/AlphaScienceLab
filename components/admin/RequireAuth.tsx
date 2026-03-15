"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/admin/check-auth")
            .then(res => {
                if (res.ok) {
                    setIsAuthorized(true);
                } else {
                    router.push("/admin/login");
                }
            })
            .catch(() => {
                router.push("/admin/login");
            });
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center w-full">
                <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#EC0D6E] rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
