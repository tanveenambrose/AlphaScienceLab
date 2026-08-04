"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { 
    Bell, 
    Check, 
    X, 
    Clock, 
    Filter, 
    Calendar, 
    FolderKanban,
    Award,
    Archive,
    User,
    CheckCircle2,
    XCircle,
    RefreshCw
} from "lucide-react";

interface NotificationItem {
    id: string;
    type: "media_project_update" | "media_event_update" | "archive_update" | "achievement_msg" | "member_post_submission";
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
    const [filterCategory, setFilterCategory] = useState<"all" | "projects" | "events" | "archive">("all");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/notifications");
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
            } else {
                setNotifications([]);
            }
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("asl-counts-updated"));
            }
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
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("asl-counts-updated"));
                }
            }
        } catch (error) {
            console.error("Failed to update notification status:", error);
        }
    };

    const filtered = notifications.filter(item => {
        if (filterCategory === "projects") {
            return item.type === "media_project_update";
        }
        if (filterCategory === "events") {
            return item.type === "media_event_update";
        }
        if (filterCategory === "archive") {
            return item.type === "archive_update" || item.type === "achievement_msg";
        }
        return true;
    });

    const pendingCount = notifications.filter(n => n.status === "pending").length;

    return (
        <RequireAuth>
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-wide flex items-center gap-3">
                            <Bell className="text-[#A855F7]" />
                            Events &amp; Projects Review Center
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Review submissions and updates for Events, Projects, Archives, and Achievements.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
                            <span className="text-xs font-bold text-zinc-300">
                                {pendingCount} Pending Updates
                            </span>
                        </div>

                        <button
                            onClick={fetchNotifications}
                            disabled={isLoading}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold border border-white/10 transition-all"
                            title="Refresh"
                        >
                            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Categories & Filter Tabs */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
                    <button
                        onClick={() => setFilterCategory("all")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "all"
                                ? "bg-[#A855F7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Filter size={14} />
                        All Updates ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilterCategory("projects")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "projects"
                                ? "bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <FolderKanban size={14} />
                        Project Updates
                    </button>
                    <button
                        onClick={() => setFilterCategory("events")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "events"
                                ? "bg-[#EC0D6E] text-white shadow-[0_0_15px_rgba(236,13,110,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Calendar size={14} />
                        Event Updates
                    </button>
                    <button
                        onClick={() => setFilterCategory("archive")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                            filterCategory === "archive"
                                ? "bg-[#06B6D4] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Award size={14} />
                        Achievements &amp; Archive
                    </button>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl">
                        <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">No Pending Updates</h3>
                        <p className="text-zinc-400 text-sm">All event, project, and achievement updates have been reviewed.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                                    item.status === "pending"
                                        ? "bg-white/5 border-white/10 hover:border-[#A855F7]/30"
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
                                        {(item.type === "archive_update" || item.type === "achievement_msg") && (
                                            <div className="w-12 h-12 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
                                                <Award size={22} />
                                            </div>
                                        )}
                                        {item.type === "member_post_submission" && (
                                            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                                <Archive size={22} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Info */}
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                item.type === "media_project_update"
                                                    ? "bg-[#8B5CF6]/20 text-purple-300 border border-purple-500/30"
                                                    : item.type === "media_event_update"
                                                    ? "bg-[#EC0D6E]/20 text-pink-300 border border-pink-500/30"
                                                    : "bg-[#06B6D4]/20 text-cyan-300 border border-cyan-500/30"
                                            }`}>
                                                {item.type === "media_project_update" 
                                                    ? "Project Update" 
                                                    : item.type === "media_event_update" 
                                                    ? "Event Update" 
                                                    : item.type === "achievement_msg"
                                                    ? "Achievement"
                                                    : "Archive Update"}
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
                                            <span className="font-semibold text-zinc-200">{item.author?.name || "Team Member"}</span>
                                            <span className="text-zinc-500">• {item.author?.role || "Contributor"}</span>
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
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC0D6E] text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5"
                                        >
                                            <Check size={15} /> Approve &amp; Publish
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
