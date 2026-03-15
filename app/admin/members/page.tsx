"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";

export default function AdminMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Member",
        department: "",
        image: ""
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch("/api/admin/members");
            const data = await res.json();
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/members/${editingId}` : "/api/admin/members";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchMembers();
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
            if (res.ok) fetchMembers();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const openModal = (member?: any) => {
        if (member) {
            setEditingId(member.id);
            setFormData(member);
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                email: "",
                role: "Member",
                department: "",
                image: ""
            });
        }
        setIsModalOpen(true);
    };

    const filteredMembers = filter === "All" ? members : members.filter(m => m.role === filter);

    return (
        <RequireAuth>
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold uppercase">ASL Members & Executives</h1>
                    <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#EC0D6E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#ff1a7d] transition-colors">
                        <Plus size={18} /> Add Member
                    </button>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-6 mb-8">
                    <div className="flex gap-4">
                        {["All", "Executive", "Member", "Alumni"].map(r => (
                            <button key={r} onClick={() => setFilter(r)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === r ? "bg-[#EC0D6E]/10 border border-[#EC0D6E]/30 text-[#EC0D6E]" : "bg-white/5 hover:bg-white/10 text-zinc-300"}`}>
                                {r === "All" ? "All Roles" : `${r}s`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-10 text-center text-zinc-500">Loading members...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Profile</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Role</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Department</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredMembers.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden relative">
                                                    <Image src={item.image || "https://www.w3schools.com/howto/img_avatar.png"} alt="avatar" fill className="object-cover" unoptimized 
                                                        onError={(e) => { e.currentTarget.src = "https://www.w3schools.com/howto/img_avatar.png" }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{item.name}</div>
                                                    <div className="text-xs text-zinc-400">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                item.role === 'Executive' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                                item.role === 'Alumni' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                                            }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">{item.department}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                <button onClick={() => openModal(item)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-colors">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-10 text-zinc-500">No members found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#120518] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-display font-bold">{editingId ? 'Edit Member' : 'Add Member'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Email</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Department / Group</label>
                                    <input type="text" required value={formData.department} placeholder="e.g. Robotics Team" onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Role</label>
                                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none appearance-none cursor-pointer">
                                        <option value="Executive" className="bg-black">Executive</option>
                                        <option value="Member" className="bg-black">Member</option>
                                        <option value="Alumni" className="bg-black">Alumni</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Image URL</label>
                                <input type="text" value={formData.image} placeholder="https://..." onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-xl font-semibold bg-[#EC0D6E] hover:bg-[#ff1a7d] transition-colors">{editingId ? 'Save Changes' : 'Add Member'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
