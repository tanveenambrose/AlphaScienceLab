"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-6 bg-surface">
            <Link
                href="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#EC0D6E]/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 p-8 sm:p-12 rounded-[32px] overflow-hidden border border-primary/20 bg-surface-container/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(221,183,255,0.1)]">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center mb-6">
                        <Image src="/assests/asl.png" alt="ASL Logo" width={40} height={40} className="opacity-90 object-contain" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-on-surface tracking-wide text-center">
                        Sign In
                    </h1>
                    <p className="text-on-surface-variant mt-2 text-sm text-center">Access the Admin Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@alphasciencelab.com"
                            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-primary/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:bg-surface-container-higher transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-primary/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:bg-surface-container-higher transition-all outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-semibold text-sm hover:shadow-[0_0_20px_rgba(221,183,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Authenticating..." : "Sign In"}
                    </button>

                    <p className="text-center text-xs text-on-surface-variant/60 mt-6 leading-relaxed">
                        These credentials are for administrators only. <br />
                        Not for general users.
                    </p>
                </form>
            </div>
        </div>
    );
}
