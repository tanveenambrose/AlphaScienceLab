"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Trash2, Info, X, Save } from "lucide-react";

export default function AdminJoinRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

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
                console.error("API error or invalid data format:", data);
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchRequests();
            } else {
                alert("Failed to update the request");
            }
        } catch (error) {
            console.error("Update error", error);
        } finally {
            setIsSaving(false);
        }
    };

    const openModal = (request: any) => {
        setSelectedRequest(request);
        setFormData({ ...request });
        setIsModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <RequireAuth>
            <div className="relative z-10 w-full h-full flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-bold uppercase">Join ASL Requests</h1>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-10 text-center text-zinc-500 uppercase tracking-widest text-sm font-bold">Loading requests...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Applicant Details</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Department</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Interest / Hours</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {requests.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-white uppercase tracking-tight">{item.firstName} {item.lastName}</div>
                                            <div className="text-xs text-zinc-400 mt-1">{item.email}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">
                                            <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">{item.department}</span>
                                            <span className="text-zinc-500 text-xs">Sem {item.semester} / Batch {item.batch}</span>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400 text-xs leading-relaxed">
                                            <div className="uppercase"><span className="font-bold text-white/50 mr-2">Focus:</span> <span className="text-white font-medium">{item.interest}</span></div>
                                            <div className="uppercase"><span className="font-bold text-white/50 mr-2">Avail:</span> <span className="text-white font-medium">{item.hours}/wk</span></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                <button onClick={() => openModal(item)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest border border-blue-500/20" title="Review & Edit Details">
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
                                    <tr><td colSpan={4} className="text-center py-16 text-zinc-500 uppercase tracking-widest text-sm font-bold opacity-50">No pending join requests!</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit / Review Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.1)]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-display font-black uppercase text-white tracking-widest">Review Applicant Form</h2>
                                <p className="text-xs text-zinc-500 mt-2 uppercase font-bold tracking-widest">ID: <span className="text-blue-400 font-mono lowercase">{selectedRequest.id}</span></p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>
                        
                        <div className="p-6 max-h-[75vh] overflow-y-auto">
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Column 1: Personal Info */}
                                    <div className="space-y-5 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-3 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Personal details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">First Name</label>
                                                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Last Name</label>
                                                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 outline-none transition-all" />
                                        </div>
                                    </div>

                                    {/* Column 2: Academic Info */}
                                    <div className="space-y-5 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-3 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EC0D6E]"/> Academic Info</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Dept.</label>
                                                <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EC0D6E]/50 outline-none transition-all cursor-pointer">
                                                    <option value="CSE">CSE</option>
                                                    <option value="EEE">EEE</option>
                                                    <option value="Civil">Civil</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Batch</label>
                                                <input type="text" name="batch" value={formData.batch} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EC0D6E]/50 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Semester</label>
                                                <input type="number" min="1" max="12" name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EC0D6E]/50 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Primary Interest</label>
                                                <select name="interest" value={formData.interest} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EC0D6E]/50 outline-none transition-all cursor-pointer">
                                                    <option value="vlsi">VLSI</option>
                                                    <option value="robotics">Robotics</option>
                                                    <option value="software">Software</option>
                                                    <option value="hardware">Hardware</option>
                                                    <option value="design">Design</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hours / Wk</label>
                                                <input type="text" name="hours" value={formData.hours} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EC0D6E]/50 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Full Width text areas */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Reported Skills</label>
                                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-white/30 outline-none transition-all font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Reason for joining</label>
                                        <textarea rows={5} name="reason" value={formData.reason} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-zinc-300 text-sm focus:border-white/30 outline-none resize-none transition-all leading-relaxed" />
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/10 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white transition-colors text-xs">Close</button>
                                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-xs disabled:opacity-50">
                                        <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
