"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserCheck, Lock, Mail, Loader2, ArrowRight, KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
    const [loginType, setLoginType] = useState<"admin" | "member">("member");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const res = await login(email, password, loginType);

            if (!res.success) {
                setError(res.error || "Invalid email or password");
                return;
            }

            // Redirect based on login type
            if (loginType === "member") {
                router.push("/");
            } else {
                router.push("/admin");
            }
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address above to recover your password.");
            return;
        }
        setError("");
        setSuccess("");
        setIsRecovering(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to send recovery email. Please check your email address.");
            } else {
                setSuccess(data.message || `Present password sent to ${email}. Please check your inbox.`);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send recovery email.");
        } finally {
            setIsRecovering(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#07020d] overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-[#EC0D6E]/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-[#8B5CF6]/15 rounded-full blur-[140px]" />
            </div>

            {/* Top Back Navigation */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            {/* Login Card */}
            <div
                className="w-full max-w-md relative z-10 p-8 sm:p-10 rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(236,13,110,0.15)]"
                style={{
                    background: "rgba(18, 5, 26, 0.75)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Radial Glow Header */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] opacity-30 bg-[radial-gradient(circle,rgba(236,13,110,0.8)_0%,transparent_70%)] blur-[30px] pointer-events-none" />

                {/* Logo & Heading */}
                <div className="flex flex-col items-center justify-center mb-8 relative z-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
                        <Image src="/assets/asl.png" alt="ASL Logo" width={40} height={40} style={{ width: "auto", height: "auto" }} className="object-contain" priority />
                    </div>
                    <h1 className="text-3xl font-display uppercase font-extrabold text-white tracking-wider text-center">
                        Login
                    </h1>
                    <p className="text-zinc-400 mt-1.5 text-xs text-center">
                        Welcome to Alpha Science Lab Portal
                    </p>
                </div>

                {/* Dual Option Toggle: Admin Login vs Member Login */}
                <div className="grid grid-cols-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-6 relative z-20">
                    <button
                        type="button"
                        onClick={() => { setLoginType("member"); setError(""); setSuccess(""); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            loginType === "member"
                                ? "bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white shadow-[0_0_20px_rgba(236,13,110,0.4)]"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        <UserCheck size={16} />
                        Member Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setLoginType("admin"); setError(""); setSuccess(""); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            loginType === "admin"
                                ? "bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white shadow-[0_0_20px_rgba(236,13,110,0.4)]"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        <ShieldCheck size={16} />
                        Admin Login
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4 relative z-20">
                    {error && (
                        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs text-center font-medium flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} className="shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                            {loginType === "admin" ? "Admin Email" : "Member Email"}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder={loginType === "admin" ? "alphasciencelabmecbd@gmail.com or racoctanveen15@gmail.com" : "your.email@gmail.com"}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]/50 focus:bg-white/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isRecovering}
                                className="text-[11px] text-[#EC0D6E] hover:text-[#ff388e] hover:underline font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                                {isRecovering ? (
                                    <>
                                        <Loader2 size={11} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={11} />
                                        Forgot Password?
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]/50 focus:bg-white/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-[#EC0D6E] via-[#A855F7] to-[#6366F1] text-white font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(236,13_110,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Login as {loginType === "admin" ? "Admin" : "Member"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-[11px] text-zinc-500 mt-4 leading-relaxed">
                        {loginType === "member"
                            ? "Approved ASL members log in here with their registered email and password."
                            : "Main Admin (alphasciencelabmecbd@gmail.com) and Media Team (racoctanveen15@gmail.com) log in here."}
                    </p>
                </form>
            </div>
        </div>
    );
}
