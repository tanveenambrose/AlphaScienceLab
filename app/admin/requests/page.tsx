"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Trash2, CheckCircle, Info } from "lucide-react";

export default function AdminJoinRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/requests");
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        try {
            const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
            if (res.ok) fetchRequests();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    return (
        <RequireAuth>
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold uppercase">Join ASL Requests</h1>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-10 text-center text-zinc-500">Loading requests...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Name / Email</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Department</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Details</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {requests.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-white">{item.firstName} {item.lastName}</div>
                                            <div className="text-xs text-zinc-400">{item.email}</div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">
                                            {item.department} <span className="text-zinc-500 text-xs">(Sem {item.semester})</span>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400 text-xs">
                                            <div>Interest: <span className="text-white">{item.interest}</span></div>
                                            <div>Hours: <span className="text-white">{item.hours}/wk</span></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                <button onClick={() => alert(`Reason: ${item.reason}\n\nSkills: ${item.skills}`)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-xs font-semibold border border-blue-500/20" title="View Full Details">
                                                    <Info size={14} /> View
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-10 text-zinc-500">No pending join requests!</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
}
