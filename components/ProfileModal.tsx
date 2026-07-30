"use client";

import { useState } from "react";
import { X, User, Lock, Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, updateProfile } = useAuth();

    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleClose = () => {
        setError("");
        setSuccessMsg("");
        onClose();
    };

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (activeTab === "password") {
            if (!currentPassword) {
                setError("Please enter your current password.");
                return;
            }
            if (newPassword.length < 6) {
                setError("New password must be at least 6 characters long.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("New passwords do not match.");
                return;
            }
        }

        setIsLoading(true);

        const res = await updateProfile({
            avatarUrl: activeTab === "profile" ? avatarUrl : undefined,
            currentPassword: activeTab === "password" ? currentPassword : undefined,
            newPassword: activeTab === "password" ? newPassword : undefined,
        });

        setIsLoading(false);

        if (res.success) {
            setSuccessMsg("Profile updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setSuccessMsg(""), 3000);
        } else {
            setError(res.error || "Failed to update profile");
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div
                className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 relative shadow-[0_0_50px_rgba(236,13,110,0.2)]"
                style={{
                    background: "rgba(15, 5, 25, 0.95)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EC0D6E]/10 border border-[#EC0D6E]/30 flex items-center justify-center text-[#EC0D6E]">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display text-white tracking-wide">Account Settings</h2>
                            <p className="text-xs text-zinc-400">Manage your profile and security</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-white/5">
                    <button
                        onClick={() => { setActiveTab("profile"); setError(""); setSuccessMsg(""); }}
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                            activeTab === "profile"
                                ? "border-[#EC0D6E] text-[#EC0D6E] bg-[#EC0D6E]/5"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <User size={16} />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => { setActiveTab("password"); setError(""); setSuccessMsg(""); }}
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                            activeTab === "password"
                                ? "border-[#EC0D6E] text-[#EC0D6E] bg-[#EC0D6E]/5"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <Lock size={16} />
                        Change Password
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} className="shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {activeTab === "profile" ? (
                        <>
                            {/* Profile Picture Update */}
                            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <label className="text-xs font-bold text-[#EC0D6E] uppercase tracking-wider flex items-center gap-1.5">
                                    <Camera size={14} /> Profile Picture
                                </label>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#EC0D6E]/50 bg-white/5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(236,13,110,0.3)]">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt="Profile" fill sizes="64px" className="object-cover" unoptimized />
                                        ) : (
                                            <span className="text-xl font-bold text-white uppercase">
                                                {user.name.slice(0, 2) || "AS"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <input
                                            type="url"
                                            value={avatarUrl}
                                            onChange={(e) => setAvatarUrl(e.target.value)}
                                            placeholder="Enter image URL (https://...)"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E] text-xs outline-none"
                                        />
                                        <p className="text-[11px] text-zinc-400">Update your avatar image link above.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Read-Only Personal Details */}
                            <div className="space-y-3 pt-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name (Read-Only)</label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-300 font-semibold cursor-not-allowed text-sm outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address (Read-Only)</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-300 font-semibold cursor-not-allowed text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="At least 6 characters"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Re-enter new password"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 text-sm font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-xl bg-[#EC0D6E] text-white font-semibold text-sm hover:bg-[#ff1a7d] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(236,13,110,0.4)]"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
