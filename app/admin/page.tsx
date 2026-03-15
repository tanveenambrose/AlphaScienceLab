"use client";

import RequireAuth from "@/components/admin/RequireAuth";

export default function AdminDashboard() {
    return (
        <RequireAuth>
            <div className="text-white relative z-10">
                <h1 className="text-3xl font-display font-bold uppercase mb-8">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Projects</h2>
                        <p className="text-4xl font-display font-bold">12</p>
                    </div>
                    
                    <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Join Requests</h2>
                        <p className="text-4xl font-display font-bold text-[#EC0D6E]">5</p>
                    </div>

                    <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Members</h2>
                        <p className="text-4xl font-display font-bold text-[#b526ff]">48</p>
                    </div>

                    <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Gallery Photos</h2>
                        <p className="text-4xl font-display font-bold text-blue-400">124</p>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-[24px] bg-[#EC0D6E]/5 border border-[#EC0D6E]/20 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC0D6E] to-[#b526ff]" />
                    <h3 className="text-xl font-display font-bold mb-3">Welcome to the Firebase Admin Portal</h3>
                    <p className="text-zinc-300 leading-relaxed max-w-3xl text-sm">
                        You successfully logged in via Google! Your Firebase database (Firestore) is actively linked to this project. Use the sidebar to manage your Projects, review new ASL Join Requests (with document downloads), and manipulate the Member database and Photo Gallery.
                    </p>
                </div>
                
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(236,13,110,0.15)_0%,transparent_70%)] blur-[80px] rounded-full pointer-events-none mix-blend-screen" />
            </div>
        </RequireAuth>
    );
}
