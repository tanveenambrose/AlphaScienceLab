"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Trash2, Info, X, CheckCircle, Save } from "lucide-react";
import Image from "next/image";

interface JoinRequestItem {
    id: string;
    full_name: string;
    department: string;
    batch: string;
    class_roll: string;
    registration: string;
    mobile: string;
    email: string;
    photo_url?: string;
    status: string;
    created_at: string;
}

export default function AdminJoinRequests() {
    const [requests, setRequests] = useState<JoinRequestItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<JoinRequestItem | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/requests");
            const data = await res.json();
            if (Array.isArray(data)) {
                setRequests(data);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to completely delete this join request? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
            if (res.ok) fetchRequests();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest.id}/approve`, {
                method: "POST",
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchRequests();
            } else {
                alert("Failed to approve the request");
            }
        } catch (error) {
            console.error("Approve error", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const openModal = (request: JoinRequestItem) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    return (
        <RequireAuth>
            <div className="relative z-10 w-full h-full flex flex-col gap-8 p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-bold uppercase">Membership Applications</h1>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-10 text-center text-zinc-500 uppercase tracking-widest text-sm font-bold">Loading applications...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Applicant</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Contact</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Academic Info</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {requests.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {item.photo_url ? (
                                                    <div className="w-10 h-10 rounded-full overflow-hidden relative bg-white/10">
                                                        <Image src={item.photo_url} alt={item.full_name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[#EC0D6E]/20 flex items-center justify-center text-[#EC0D6E] font-bold">
                                                        {item.full_name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-white uppercase tracking-tight">{item.full_name}</div>
                                                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{new Date(item.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">
                                            <div className="text-xs text-zinc-300">{item.email}</div>
                                            <div className="text-xs text-zinc-500 mt-1">{item.mobile}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold mr-2 uppercase text-white">{item.department}</span>
                                            <span className="text-zinc-400 text-xs font-bold">{item.batch} Batch</span>
                                            <div className="text-xs text-zinc-500 mt-2">Roll: {item.class_roll} | Reg: {item.registration}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                <button onClick={() => openModal(item)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest border border-blue-500/20" title="Review Details">
                                                    <Info size={14} /> Review
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20" title="Delete record entirely">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-16 text-zinc-500 uppercase tracking-widest text-sm font-bold opacity-50">No pending applications!</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(236,13,110,0.1)]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-display font-black uppercase text-white tracking-widest">Review Application</h2>
                                <p className="text-xs text-zinc-500 mt-2 uppercase font-bold tracking-widest">ID: <span className="text-[#EC0D6E] font-mono lowercase">{selectedRequest.id}</span></p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Photo */}
                                <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden bg-white/10 border border-white/20 relative">
                                    {selectedRequest.photo_url ? (
                                        <Image src={selectedRequest.photo_url} alt={selectedRequest.full_name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center p-4">No Photo provided</div>
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Full Name</p>
                                            <p className="text-lg font-bold text-white">{selectedRequest.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Department & Batch</p>
                                            <p className="text-sm font-bold text-zinc-300">{selectedRequest.department} - {selectedRequest.batch} Batch</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Email</p>
                                            <p className="text-sm text-zinc-300">{selectedRequest.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Mobile</p>
                                            <p className="text-sm text-zinc-300">{selectedRequest.mobile}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Class Roll</p>
                                            <p className="text-sm text-zinc-300">{selectedRequest.class_roll}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Registration</p>
                                            <p className="text-sm text-zinc-300">{selectedRequest.registration}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-white/10 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white transition-colors text-xs">Close</button>
                                <button type="button" onClick={handleApprove} disabled={isProcessing} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white transition-all shadow-[0_0_20px_rgba(236,13,110,0.3)] hover:shadow-[0_0_30px_rgba(236,13,110,0.5)] text-xs disabled:opacity-50">
                                    <CheckCircle size={16} /> {isProcessing ? "Processing..." : "Approve Member"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
