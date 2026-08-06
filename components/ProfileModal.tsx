"use client";

import { useState, useRef, useEffect } from "react";
import { 
    X, 
    User, 
    Lock, 
    Upload, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    KeyRound, 
    Mail, 
    Image as ImageIcon,
    RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, updateProfile } = useAuth();

    // State for Profile Image
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [fallbackUrl, setFallbackUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for Passwords
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Tabs & UI state
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [recoverSuccess, setRecoverSuccess] = useState("");

    // Reset when modal opens or user changes
    useEffect(() => {
        if (user) {
            setFallbackUrl(user.avatarUrl || "");
            setPreviewUrl(user.avatarUrl || "");
            setSelectedFile(null);
            setError("");
            setSuccessMsg("");
            setRecoverSuccess("");
        }
    }, [user, isOpen]);

    const handleClose = () => {
        setError("");
        setSuccessMsg("");
        setRecoverSuccess("");
        setSelectedFile(null);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image file size should be less than 5MB.");
                return;
            }
            setError("");
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemoveSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl(user?.avatarUrl || "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Recover Present Password via Gmail SMTP with ASL Logo
    const handleRecoverPassword = async () => {
        if (!user?.email) return;
        setError("");
        setSuccessMsg("");
        setRecoverSuccess("");
        setIsRecovering(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to recover password. Please try again or contact an admin.");
            } else {
                setRecoverSuccess(data.message || `Present password has been sent to ${user.email} from Alpha Science Lab.`);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred while sending password recovery email.");
        } finally {
            setIsRecovering(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setRecoverSuccess("");

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

        try {
            if (activeTab === "profile") {
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append("file", selectedFile);
                    if (user?.email) formData.append("email", user.email);

                    const res = await updateProfile(formData);
                    if (res.success) {
                        setSuccessMsg("Profile picture updated and replaced in database successfully!");
                        setSelectedFile(null);
                        setTimeout(() => setSuccessMsg(""), 4000);
                    } else {
                        setError(res.error || "Failed to upload and update profile picture.");
                    }
                } else if (fallbackUrl !== (user?.avatarUrl || "")) {
                    const res = await updateProfile({ avatarUrl: fallbackUrl });
                    if (res.success) {
                        setSuccessMsg("Profile picture URL updated successfully!");
                        setTimeout(() => setSuccessMsg(""), 4000);
                    } else {
                        setError(res.error || "Failed to update profile picture URL.");
                    }
                } else {
                    setSuccessMsg("No profile picture changes to save.");
                    setTimeout(() => setSuccessMsg(""), 3000);
                }
            } else if (activeTab === "password") {
                const res = await updateProfile({
                    currentPassword,
                    newPassword,
                });

                if (res.success) {
                    setSuccessMsg("Password updated successfully! Your present password has been updated.");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setTimeout(() => setSuccessMsg(""), 4000);
                } else {
                    setError(res.error || "Failed to update password. Please check your current password.");
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred while saving.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 relative shadow-[0_0_50px_rgba(236,13,110,0.25)] flex flex-col max-h-[90vh]"
                style={{
                    background: "rgba(15, 5, 25, 0.96)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EC0D6E]/15 border border-[#EC0D6E]/30 flex items-center justify-center text-[#EC0D6E]">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display text-white tracking-wide">Member Account Settings</h2>
                            <p className="text-xs text-zinc-400">Manage your profile image and account security</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-white/5 shrink-0">
                    <button
                        onClick={() => { setActiveTab("profile"); setError(""); setSuccessMsg(""); setRecoverSuccess(""); }}
                        className={`flex-1 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                            activeTab === "profile"
                                ? "border-[#EC0D6E] text-[#EC0D6E] bg-[#EC0D6E]/10"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <ImageIcon size={16} />
                        Change Profile Picture
                    </button>
                    <button
                        onClick={() => { setActiveTab("password"); setError(""); setSuccessMsg(""); setRecoverSuccess(""); }}
                        className={`flex-1 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                            activeTab === "password"
                                ? "border-[#EC0D6E] text-[#EC0D6E] bg-[#EC0D6E]/10"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <Lock size={16} />
                        Change Password
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start gap-2.5">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{successMsg}</span>
                        </div>
                    )}

                    {recoverSuccess && (
                        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs space-y-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <div className="flex items-center gap-2 font-bold text-emerald-400">
                                <Mail size={16} className="shrink-0" />
                                <span>Present Password Sent Successfully!</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                                {recoverSuccess}
                            </p>
                        </div>
                    )}

                    {activeTab === "profile" ? (
                        <>
                            {/* Device Photo Upload Box */}
                            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-[#EC0D6E] uppercase tracking-wider flex items-center gap-1.5">
                                        <Upload size={14} /> Upload New Photo From Device
                                    </label>
                                    {selectedFile && (
                                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                            New File Ready
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                                    {/* Avatar Circular Preview */}
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#EC0D6E] bg-white/5 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(236,13,110,0.3)]">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-white uppercase">
                                                {user.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Device Upload Actions */}
                                    <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(236,13,110,0.4)] transition-all flex items-center gap-1.5"
                                            >
                                                <Upload size={14} />
                                                Choose Image File
                                            </button>

                                            {selectedFile && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveSelectedFile}
                                                    className="px-3 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
                                                >
                                                    Cancel File
                                                </button>
                                            )}
                                        </div>

                                        {selectedFile ? (
                                            <p className="text-[11px] text-zinc-300 truncate font-mono">
                                                Selected: <strong className="text-white">{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-zinc-400">
                                                JPG, PNG, WEBP up to 5MB. Uploading a new picture will replace and delete the previous image from the database.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Read-Only Member Information from Database */}
                            <div className="space-y-3 pt-1">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                        Member Name (Database Verified)
                                    </label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        disabled
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 font-semibold cursor-not-allowed text-xs outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                        Member Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 font-semibold cursor-not-allowed text-xs outline-none"
                                    />
                                </div>

                                {user.department && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                                Department
                                            </label>
                                            <input
                                                type="text"
                                                value={user.department}
                                                disabled
                                                className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 text-xs cursor-not-allowed outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={user.role}
                                                disabled
                                                className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 text-xs capitalize cursor-not-allowed outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Current Password Field + Forgot Password Action */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider ml-1">
                                        Current Password
                                    </label>

                                    {/* FORGOT PASSWORD BUTTON */}
                                    <button
                                        type="button"
                                        onClick={handleRecoverPassword}
                                        disabled={isRecovering}
                                        className="text-[11px] text-[#EC0D6E] hover:text-[#ff388e] hover:underline font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {isRecovering ? (
                                            <>
                                                <Loader2 size={12} className="animate-spin" />
                                                Sending present password...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound size={12} />
                                                Forgot Password? Recover Present Password
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        placeholder="Enter your current password"
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500 ml-1">
                                    Need to recover your current password? Click &ldquo;Forgot Password&rdquo; above to receive it via email.
                                </p>
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider ml-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Enter new password (at least 6 characters)"
                                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider ml-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Re-enter new password"
                                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0D6E]/50 transition-all text-sm outline-none"
                                />
                            </div>

                            {/* Recovery info note */}
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] flex items-center gap-2">
                                <Mail size={14} className="shrink-0 text-purple-400" />
                                <span>When you click &ldquo;Forgot Password&rdquo;, your present password will be sent to <strong>{user.email}</strong> via our official ASL Gmail SMTP server with the ASL logo.</span>
                            </div>
                        </>
                    )}

                    {/* Footer Buttons */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 rounded-2xl border border-white/10 text-zinc-300 hover:bg-white/5 text-xs font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(236,13,110,0.5)] transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={14} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
