"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Quickly check if we have a cookie session to skip login
        fetch("/api/admin/check-auth")
            .then(res => {
                if (res.ok) router.push("/admin");
            });
    }, [router]);

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

            if (res.ok) {
                router.push("/admin");
            } else {
                const data = await res.json();
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-6 w-full absolute inset-0">
            {/* The Login Card */}
            <div 
                className="w-full max-w-md relative z-10 p-8 sm:p-12 rounded-[32px] overflow-hidden"
                style={{
                    background: "rgba(18, 5, 24, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] opacity-20 bg-[radial-gradient(circle,rgba(236,13,110,0.8)_0%,transparent_70%)] blur-[40px] pointer-events-none" />

                <div className="flex flex-col items-center justify-center mb-10 relative z-20">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                       <Image src="/ASL LOGO.png" alt="ASL Logo" width={40} height={40} className="opacity-90 object-contain" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-white tracking-wide text-center">
                        Admin Portal
                    </h1>
                    <p className="text-zinc-400 mt-2 text-sm text-center">Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-20">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="racoctanveen15@gmail.com"
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 focus:bg-white/10 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="admin123"
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 focus:bg-white/10 transition-all outline-none"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-4 rounded-2xl bg-[#EC0D6E] text-white font-semibold text-sm hover:bg-[#ff1a7d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                            boxShadow: "0 0 20px rgba(236, 13, 110, 0.3)"
                        }}
                    >
                        {isLoading ? "Authenticating..." : "Sign In"}
                    </button>
                    
                    <p className="text-center text-xs text-zinc-500 mt-4">
                        Please use the authorized ASL Admin credentials.
                    </p>
                </form>
            </div>
        </div>
    );
}
