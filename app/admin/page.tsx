"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/admin/RequireAuth";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        requests: 0,
        members: 0,
        gallery: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/dashboard");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <RequireAuth>
            <div className="text-white relative z-10 w-full">
                <h1 className="text-3xl font-display font-bold uppercase mb-8">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 relative z-10">Total Projects</h2>
                        <div className="flex items-center gap-3 relative z-10">
                            <p className="text-5xl font-display font-black tracking-tighter w-16">
                                {isLoading ? <span className="text-zinc-700 animate-pulse">--</span> : stats.projects}
                            </p>
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-tight">Live<br/>Count</span>
                        </div>
                    </div>
                    
                    <div className="p-6 rounded-[24px] bg-[#EC0D6E]/[0.05] border border-[#EC0D6E]/20 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EC0D6E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 relative z-10">Join Requests</h2>
                        <div className="flex items-center gap-3 relative z-10">
                            <p className="text-5xl font-display font-black tracking-tighter text-[#EC0D6E] w-16">
                                {isLoading ? <span className="opacity-50 animate-pulse">--</span> : stats.requests}
                            </p>
                            <span className="text-[10px] text-[#EC0D6E]/50 uppercase font-black tracking-widest leading-tight">Pending<br/>Review</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-[24px] bg-[#b526ff]/[0.05] border border-[#b526ff]/20 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#b526ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 relative z-10">Active Members</h2>
                        <div className="flex items-center gap-3 relative z-10">
                            <p className="text-5xl font-display font-black tracking-tighter text-[#b526ff] w-16">
                                {isLoading ? <span className="opacity-50 animate-pulse">--</span> : stats.members}
                            </p>
                            <span className="text-[10px] text-[#b526ff]/50 uppercase font-black tracking-widest leading-tight">Total<br/>Joined</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-[24px] bg-blue-500/[0.05] border border-blue-500/20 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 relative z-10">Gallery Photos</h2>
                        <div className="flex items-center gap-3 relative z-10">
                            <p className="text-5xl font-display font-black tracking-tighter text-blue-400 w-16">
                                {isLoading ? <span className="opacity-50 animate-pulse">--</span> : stats.gallery}
                            </p>
                            <span className="text-[10px] text-blue-500/50 uppercase font-black tracking-widest leading-tight">Public<br/>Assets</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-10 rounded-[32px] bg-[#0A0A0A] border border-white/5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#EC0D6E] to-[#b526ff] opacity-50" />
                    <h3 className="text-2xl font-display font-black mb-4 uppercase tracking-widest text-white">Welcome to the Admin Portal</h3>
                    <p className="text-zinc-400 leading-relaxed max-w-4xl text-sm font-medium">
                        You successfully logged in via Google! Your Firebase database (Firestore) is actively linked to this project. Use the sidebar to manage your Projects, review new ASL Join Requests (with document downloads), and manipulate the Member database and Photo Gallery. The live count cards above now fetch real-time data from your connected Firebase collections.
                    </p>
                </div>
                
                <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(236,13,110,0.05)_0%,transparent_60%)] rounded-full pointer-events-none" />
            </div>
        </RequireAuth>
    );
}
