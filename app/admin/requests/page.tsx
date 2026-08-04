"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { 
    Trash2, Info, X, CheckCircle, XCircle, Mail, Phone, 
    GraduationCap, Calendar, User, ShieldCheck, AlertCircle, RefreshCw
} from "lucide-react";
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
    const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/requests");
            const data = await res.json();
            if (Array.isArray(data)) {
                setRequests(data);
            } else {
                setRequests([]);
            }
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("asl-counts-updated"));
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        setActionFeedback(null);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest.id}/approve`, {
                method: "POST",
            });
            const data = await res.json().catch(() => ({}));
            
            if (res.ok && data.success) {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("asl-counts-updated"));
                }
                setActionFeedback({
                    type: "success",
                    message: `Approved ${selectedRequest.full_name}! Account created & welcome email sent${data.tempPassword ? ` with password: ${data.tempPassword}` : ''}.`
                });
                setTimeout(() => {
                    setIsModalOpen(false);
                    fetchRequests();
                }, 2000);
            } else {
                setActionFeedback({
                    type: "error",
                    message: data.error || "Failed to approve the application."
                });
            }
        } catch (error: any) {
            console.error("Approve error", error);
            setActionFeedback({
                type: "error",
                message: "Network error approving application."
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (request: JoinRequestItem) => {
        if (!confirm(`Are you sure you want to reject ${request.full_name}'s application? An automated rejection email will be sent via Gmail SMTP.`)) {
            return;
        }
        setIsProcessing(true);
        setActionFeedback(null);
        try {
            const res = await fetch(`/api/admin/requests/${request.id}/reject`, {
                method: "POST",
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success) {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("asl-counts-updated"));
                }
                if (isModalOpen) {
                    setActionFeedback({
                        type: "success",
                        message: `Application rejected and automated email sent to ${request.email}.`
                    });
                    setTimeout(() => {
                        setIsModalOpen(false);
                        fetchRequests();
                    }, 1500);
                } else {
                    fetchRequests();
                }
            } else {
                alert(data.error || "Failed to reject application.");
            }
        } catch (error) {
            console.error("Reject error", error);
            alert("Network error while rejecting application.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteOnly = async (id: string) => {
        if (!confirm("Delete this record without sending an email?")) return;
        try {
            const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
            if (res.ok) fetchRequests();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const openModal = (request: JoinRequestItem) => {
        setSelectedRequest(request);
        setActionFeedback(null);
        setIsModalOpen(true);
    };

    return (
        <RequireAuth requireMainAdmin={true}>
            <div className="relative z-10 w-full h-full flex flex-col gap-8 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-white">
                            Membership Applications
                        </h1>
                        <p className="text-xs text-zinc-400 mt-1">
                            Review join requests, approve new members (with automatic login generation & welcome email), or reject.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchRequests}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-white/10 transition-all"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <div className="px-4 py-2 rounded-xl bg-[#EC0D6E]/10 border border-[#EC0D6E]/30 text-[#EC0D6E] text-xs font-bold">
                            {requests.length} Pending
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-16 text-center space-y-3">
                             <div className="w-8 h-8 border-2 border-[#EC0D6E] border-t-transparent rounded-full animate-spin mx-auto" />
                             <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Loading applications...</p>
                         </div>
                    ) : (
                        <div className="overflow-x-auto">
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
                                                <div className="flex items-center gap-3.5">
                                                    {item.photo_url ? (
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden relative bg-white/10 border border-white/10 shrink-0">
                                                            {/* Render base64 or storage url */}
                                                            <img src={item.photo_url} alt={item.full_name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-xl bg-[#EC0D6E]/20 border border-[#EC0D6E]/30 flex items-center justify-center text-[#EC0D6E] font-bold shrink-0">
                                                            {item.full_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-white uppercase tracking-tight text-sm">{item.full_name}</div>
                                                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                                            Applied: {new Date(item.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-zinc-300">
                                                <div className="text-xs text-zinc-200 flex items-center gap-1.5 font-mono">
                                                    <Mail size={12} className="text-[#EC0D6E]" /> {item.email}
                                                </div>
                                                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-mono">
                                                    <Phone size={12} className="text-zinc-500" /> {item.mobile}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase text-white border border-white/10">
                                                        {item.department}
                                                    </span>
                                                    <span className="text-[#EC0D6E] text-xs font-semibold">
                                                        {item.batch} Batch
                                                    </span>
                                                </div>
                                                <div className="text-xs text-zinc-400 mt-1.5 font-mono">
                                                    Roll: <span className="text-white">{item.class_roll}</span> | Reg: <span className="text-white">{item.registration}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-xs font-bold uppercase tracking-wider border border-blue-500/20"
                                                        title="Review Application & Details"
                                                    >
                                                        <Info size={14} /> Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-bold uppercase tracking-wider border border-red-500/20"
                                                        title="Reject & Send Rejection Email"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                                                No pending applications. All caught up!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Review Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0f0714] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_60px_rgba(236,13,110,0.15)] flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-[#EC0D6E]" size={20} />
                                    <h2 className="text-xl font-display font-bold uppercase text-white tracking-wider">
                                        Review Application
                                    </h2>
                                </div>
                                <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                                    ID: {selectedRequest.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                            {actionFeedback && (
                                <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
                                    actionFeedback.type === "success"
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                        : "bg-red-500/10 border-red-500/30 text-red-300"
                                }`}>
                                    {actionFeedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    <span>{actionFeedback.message}</span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Photo */}
                                <div className="shrink-0 w-36 h-36 rounded-2xl overflow-hidden bg-white/5 border border-white/20 relative shadow-inner">
                                    {selectedRequest.photo_url ? (
                                        <img
                                            src={selectedRequest.photo_url}
                                            alt={selectedRequest.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4">
                                            <User size={28} className="mb-2 text-zinc-600" />
                                            No Photo Provided
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info details */}
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Full Name</p>
                                            <p className="text-base font-bold text-white mt-0.5">{selectedRequest.full_name}</p>
                                        </div>
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Department & Batch</p>
                                            <p className="text-sm font-bold text-zinc-200 mt-0.5">{selectedRequest.department} ({selectedRequest.batch} Batch)</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Email Address</p>
                                            <p className="text-xs font-mono text-zinc-300 mt-0.5 truncate">{selectedRequest.email}</p>
                                        </div>
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Mobile Contact</p>
                                            <p className="text-xs font-mono text-zinc-300 mt-0.5">{selectedRequest.mobile}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Class Roll</p>
                                            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedRequest.class_roll}</p>
                                        </div>
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Registration Number</p>
                                            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedRequest.registration}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Automation Info Notice */}
                            <div className="p-4 rounded-2xl bg-[#EC0D6E]/5 border border-[#EC0D6E]/20 text-xs text-zinc-300 space-y-1">
                                <p className="font-semibold text-white flex items-center gap-1.5">
                                    <Mail size={13} className="text-[#EC0D6E]" /> Automated Gmail SMTP Actions:
                                </p>
                                <p className="text-zinc-400">
                                    • <strong>Approve:</strong> Automatically generates secure password, provisions member account in Supabase, and dispatches Welcome Email with credentials.
                                </p>
                                <p className="text-zinc-400">
                                    • <strong>Reject:</strong> Removes application and sends automated polite rejection email to applicant.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 text-xs transition-colors"
                            >
                                Close
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleReject(selectedRequest)}
                                    disabled={isProcessing}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs transition-all disabled:opacity-50"
                                >
                                    <XCircle size={15} /> Reject Application
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white shadow-[0_0_20px_rgba(236,13,110,0.4)] hover:shadow-[0_0_30px_rgba(236,13,110,0.6)] text-xs transition-all disabled:opacity-50"
                                >
                                    <CheckCircle size={15} /> {isProcessing ? "Processing..." : "Approve & Send Welcome Email"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
