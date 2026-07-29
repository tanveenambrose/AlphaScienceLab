"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { 
    Bell, 
    Check, 
    X, 
    Clock, 
    Filter, 
    Camera, 
    MessageSquare, 
    Calendar, 
    FolderKanban,
    User,
    CheckCircle2,
    XCircle
} from "lucide-react";

interface NotificationItem {
    id: string;
    type: "media_project_update" | "media_event_update" | "member_post_submission";
    title: string;
    description: string;
    author: {
        name: string;
        role: string;
        email: string;
        avatarUrl?: string;
    };
    targetName?: string;
    content?: string;
    mediaUrl?: string;
    timestamp: string;
    status: "pending" | "approved" | "rejected";
}

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<"all" | "media" | "feed">("all");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approved" | "rejected") => {
        try {
            const res = await fetch("/api/admin/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: action }),
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(item => item.id === id ? { ...item, status: action } : item)
                );
            }
        } catch (error) {
            console.error("Failed to update notification status:", error);
        }
    };

    const filtered = notifications.filter(item => {
        if (filterCategory === "media") {
            return item.type === "media_project_update" || item.type === "media_event_update";
        }
        if (filterCategory === "feed") {
            return item.type === "member_post_submission";
        }
        return true;
    });

    const pendingCount = notifications.filter(n => n.status === "pending").length;

    return (
        <RequireAuth>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-wide flex items-center gap-3">
                            <Bell className="text-[#EC0D6E]" />
                            Notifications & Review Center
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Review pending project & event updates from the media team and member feed post submissions.
                        </p>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EC0D6E] animate-ping" />
                        <span className="text-xs font-bold text-zinc-300">
                            {pendingCount} Pending Approvals
                        </span>
                    </div>
                </div>

                {/* Categories & Filter Tabs */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
                    <button
                        onClick={() => setFilterCategory("all")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "all"
                                ? "bg-[#EC0D6E] text-white shadow-[0_0_15px_rgba(236,13,110,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Filter size={14} />
                        All Submissions ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilterCategory("media")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "media"
                                ? "bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Camera size={14} />
                        Media Team Updates (Project & Events)
                    </button>
                    <button
                        onClick={() => setFilterCategory("feed")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "feed"
                                ? "bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <MessageSquare size={14} />
                        Members Feed Posts
                    </button>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#EC0D6E] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl">
                        <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">No Pending Notifications</h3>
                        <p className="text-zinc-400 text-sm">All media team updates and member posts have been reviewed.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                                    item.status === "pending"
                                        ? "bg-white/5 border-white/10 hover:border-[#EC0D6E]/30"
                                        : "bg-white/[0.02] border-white/5 opacity-75"
                                }`}
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Icon Avatar */}
                                    <div className="shrink-0 mt-1">
                                        {item.type === "media_project_update" && (
                                            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                                                <FolderKanban size={22} />
                                            </div>
                                        )}
                                        {item.type === "media_event_update" && (
                                            <div className="w-12 h-12 rounded-2xl bg-[#EC0D6E]/10 border border-[#EC0D6E]/30 flex items-center justify-center text-[#EC0D6E]">
                                                <Calendar size={22} />
                                            </div>
                                        )}
                                        {item.type === "member_post_submission" && (
                                            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                                <MessageSquare size={22} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Info */}
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                item.type.startsWith("media")
                                                    ? "bg-[#8B5CF6]/20 text-purple-300 border border-purple-500/30"
                                                    : "bg-[#3B82F6]/20 text-blue-300 border border-blue-500/30"
                                            }`}>
                                                {item.type === "media_project_update" ? "Media: Project Update" : item.type === "media_event_update" ? "Media: Event Update" : "Member Feed Post"}
                                            </span>

                                            {item.status === "approved" && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Approved
                                                </span>
                                            )}
                                            {item.status === "rejected" && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                                                    <XCircle size={10} /> Rejected
                                                </span>
                                            )}

                                            <span className="text-[11px] text-zinc-500 flex items-center gap-1 ml-auto">
                                                <Clock size={12} /> {item.timestamp}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-white text-base">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            {item.description}
                                        </p>

                                        {item.content && (
                                            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-200 text-xs mt-2 italic">
                                                &quot;{item.content}&quot;
                                            </div>
                                        )}

                                        {/* Author metadata */}
                                        <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                                            <User size={13} className="text-zinc-500" />
                                            <span className="font-semibold text-zinc-200">{item.author.name}</span>
                                            <span className="text-zinc-500">• {item.author.role}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {item.status === "pending" ? (
                                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                                        <button
                                            onClick={() => handleAction(item.id, "rejected")}
                                            className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center gap-1.5"
                                        >
                                            <X size={15} /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(item.id, "approved")}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(236,13,110,0.4)] transition-all flex items-center gap-1.5"
                                        >
                                            <Check size={15} /> Approve & Publish
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-xs text-zinc-500 font-semibold self-end md:self-center">
                                        Reviewed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
