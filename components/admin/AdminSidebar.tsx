"use client";

import { useState, useEffect } from "react";
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
    const { logout } = useAuth();

    // Default to main admin or media team based on state/localStorage
    const [adminRole, setAdminRole] = useState<"main" | "media">("main");

    useEffect(() => {
        const savedRole = localStorage.getItem("asl_admin_view_role");
        if (savedRole === "media" || savedRole === "main") {
            setAdminRole(savedRole);
        }
    }, []);

    const toggleRole = (role: "main" | "media") => {
        setAdminRole(role);
        localStorage.setItem("asl_admin_view_role", role);
    };

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
        icon: any;
        badge?: number;
    }

    // Full navigation list
    const mainNavItems: NavItem[] = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Join Requests", href: "/admin/requests", icon: Mailbox },
        { name: "Members", href: "/admin/members", icon: Users },
        { name: "Notifications", href: "/admin/notifications", icon: Bell, badge: 3 },
        { name: "Archive", href: "/admin/archive", icon: Archive },
    ];

    // Media Team navigation list (Excludes Join Requests and Notifications)
    const mediaNavItems: NavItem[] = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Members", href: "/admin/members", icon: Users },
        { name: "Archive", href: "/admin/archive", icon: Archive },
    ];

    const currentItems = adminRole === "media" ? mediaNavItems : mainNavItems;

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

            {/* Role View Toggle Selector */}
            <div className="mb-6 p-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-1">
                <button
                    onClick={() => toggleRole("main")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        adminRole === "main"
                            ? "bg-[#EC0D6E] text-white shadow-[0_0_12px_rgba(236,13,110,0.4)]"
                            : "text-zinc-400 hover:text-white"
                    }`}
                    title="Main Admin Dashboard View"
                >
                    <Shield size={13} />
                    Main
                </button>
                <button
                    onClick={() => toggleRole("media")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        adminRole === "media"
                            ? "bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                            : "text-zinc-400 hover:text-white"
                    }`}
                    title="Media Team Dashboard View"
                >
                    <Camera size={13} />
                    Media
                </button>
            </div>

            {/* Active View Indicator */}
            <div className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${adminRole === "media" ? "bg-purple-400 animate-pulse" : "bg-[#EC0D6E] animate-pulse"}`} />
                <span className="text-[11px] font-semibold text-zinc-300">
                    {adminRole === "media" ? "Media Team View" : "Full Admin Access"}
                </span>
            </div>

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
                            {item.badge && (
                                <span className="bg-[#EC0D6E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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
