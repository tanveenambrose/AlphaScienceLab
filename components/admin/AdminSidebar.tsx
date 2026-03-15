"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    FolderKanban, 
    Users, 
    Image as ImageIcon, 
    Mailbox,
    LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Join Requests", href: "/admin/requests", icon: Mailbox },
        { name: "Members", href: "/admin/members", icon: Users },
        { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    ];

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="w-64 h-screen bg-[#0a0210] border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-50">
            <div className="mb-10">
                <Link href="/admin">
                    <h2 className="text-xl font-display font-bold text-white tracking-wider">
                        ASL <span className="text-[#EC0D6E]">ADMIN</span>
                    </h2>
                </Link>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive 
                                    ? "bg-[#EC0D6E]/10 text-[#EC0D6E] border border-[#EC0D6E]/20" 
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-semibold text-sm">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-left"
                >
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
