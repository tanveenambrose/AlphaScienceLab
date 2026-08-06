"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    FolderKanban, 
    Calendar, 
    Users, 
    Archive, 
    Mailbox, 
    Bell, 
    LogOut, 
    Shield, 
    Camera 
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Role-based access control based on user's email / role
    const userEmail = user?.email?.toLowerCase().trim() || "";
    const isMediaTeam = userEmail === "racoctanveen15@gmail.com" || user?.role === "media";
    const activeRole: "main" | "media" = isMediaTeam ? "media" : "main";

    // Dynamic Live Counts for Join Requests and Notifications
    const [counts, setCounts] = useState<{ joinRequests: number; notifications: number }>({
        joinRequests: 0,
        notifications: 0,
    });

    const fetchCounts = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/counts");
            if (res.ok) {
                const data = await res.json();
                setCounts({
                    joinRequests: Number(data.joinRequests) || 0,
                    notifications: Number(data.notifications) || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch admin counts:", error);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchCounts();
        };
        load();
        
        // Poll every 12 seconds for real-time updates
        const interval = setInterval(fetchCounts, 12000);

        const handleFocus = () => fetchCounts();
        const handleCustomEvent = () => fetchCounts();

        window.addEventListener("focus", handleFocus);
        window.addEventListener("asl-counts-updated", handleCustomEvent);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("asl-counts-updated", handleCustomEvent);
        };
    }, [fetchCounts]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    interface NavItem {
        name: string;
        href: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        badge?: number;
        badgeColor?: string;
    }

    // Main Admin Navigation (Displayed ONLY for Main Admin email)
    const mainNavItems: NavItem[] = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { 
            name: "Join Requests", 
            href: "/admin/requests", 
            icon: Mailbox, 
            badge: counts.joinRequests > 0 ? counts.joinRequests : undefined,
            badgeColor: "bg-[#EC0D6E] shadow-[0_0_10px_rgba(236,13,110,0.5)]"
        },
        { name: "Members", href: "/admin/members", icon: Users },
        { 
            name: "Notifications", 
            href: "/admin/notifications", 
            icon: Bell, 
            badge: counts.notifications > 0 ? counts.notifications : undefined,
            badgeColor: "bg-[#A855F7] shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        },
        { name: "Archive", href: "/admin/archive", icon: Archive },
    ];

    // Media Team Navigation (Displayed ONLY for Media Team email - excludes Join Requests)
    const mediaNavItems: NavItem[] = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Members", href: "/admin/members", icon: Users },
        { 
            name: "Notifications", 
            href: "/admin/notifications", 
            icon: Bell, 
            badge: counts.notifications > 0 ? counts.notifications : undefined,
            badgeColor: "bg-[#A855F7] shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        },
        { name: "Archive", href: "/admin/archive", icon: Archive },
    ];

    const currentItems = activeRole === "media" ? mediaNavItems : mainNavItems;

    return (
        <div className="w-64 h-screen bg-[#0a0210] border-r border-white/10 flex flex-col p-5 fixed left-0 top-0 z-50 overflow-y-auto">
            {/* Logo */}
            <div className="mb-6 pt-2 flex items-center justify-between">
                <Link href="/admin">
                    <h2 className="text-xl font-display font-bold text-white tracking-wider">
                        ASL <span className="text-[#EC0D6E]">ADMIN</span>
                    </h2>
                </Link>
            </div>

            {/* Role Access Indicator Pill */}
            <div className="mb-6 px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    activeRole === "media" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-[#EC0D6E]/20 text-[#EC0D6E] border border-[#EC0D6E]/30"
                }`}>
                    {activeRole === "media" ? <Camera size={16} /> : <Shield size={16} />}
                </div>
                <div className="overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Access Granted</p>
                    <h4 className="text-xs font-extrabold text-white truncate">
                        {activeRole === "media" ? "Media Team" : "Main Admin"}
                    </h4>
                </div>
            </div>

            {/* User Profile Mini Badge */}
            {user && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeRole === "media" ? "bg-purple-400 animate-pulse" : "bg-[#EC0D6E] animate-pulse"}`} />
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">
                        {user.email}
                    </span>
                </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1.5">
                {currentItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                isActive 
                                    ? "bg-[#EC0D6E]/10 text-[#EC0D6E] border border-[#EC0D6E]/20 font-bold shadow-[0_0_15px_rgba(236,13,110,0.15)]" 
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={19} />
                                <span className="text-sm">{item.name}</span>
                            </div>
                            {typeof item.badge === "number" && item.badge > 0 && (
                                <span className={`text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] ${item.badgeColor || "bg-[#EC0D6E]"}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout Button */}
            <div className="pt-4 border-t border-white/10 mt-auto">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-left font-semibold text-sm"
                >
                    <LogOut size={19} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
