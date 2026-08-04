"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { 
    Plus, Pencil, Trash2, X, Search, Mail, Phone, 
    GraduationCap, Key, Shield, UserCheck, RefreshCw, Eye, EyeOff
} from "lucide-react";
import Image from "next/image";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    batch?: string;
    class_roll?: string;
    registration?: string;
    mobile?: string;
    temp_password?: string;
    image?: string;
    image_url?: string;
    bio?: string;
    created_at?: string;
}

export default function AdminMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterRole, setFilterRole] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Member",
        department: "",
        batch: "",
        class_roll: "",
        registration: "",
        mobile: "",
        image: "",
        temp_password: "",
        bio: ""
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/members");
            const data = await res.json();
            if (Array.isArray(data)) {
                setMembers(data);
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error("Failed to fetch members", error);
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/members/${editingId}` : "/api/admin/members";
        const method = editingId ? "PUT" : "POST";

        try {
            const payload = {
                ...formData,
                image_url: formData.image, // ensure both image & image_url are aligned
            };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchMembers();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || "Failed to save member details.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Network error occurred while saving.");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name} from members?`)) return;
        try {
            const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchMembers();
            } else {
                alert("Failed to delete member.");
            }
        } catch (error) {
            console.error("Delete error", error);
            alert("Network error deleting member.");
        }
    };

    const openModal = (member?: Member) => {
        if (member) {
            setEditingId(member.id);
            setFormData({
                name: member.name || "",
                email: member.email || "",
                role: member.role || "Member",
                department: member.department || "",
                batch: member.batch || "",
                class_roll: member.class_roll || "",
                registration: member.registration || "",
                mobile: member.mobile || "",
                image: member.image || member.image_url || "",
                temp_password: member.temp_password || "",
                bio: member.bio || ""
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                email: "",
                role: "Member",
                department: "",
                batch: "",
                class_roll: "",
                registration: "",
                mobile: "",
                image: "",
                temp_password: "",
                bio: ""
            });
        }
        setIsModalOpen(true);
    };

    const togglePasswordVisibility = (id: string) => {
        setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter and search logic
    const filteredMembers = members.filter(m => {
        const matchesRole = filterRole === "All" || m.role === filterRole;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.email && m.email.toLowerCase().includes(q)) ||
            (m.department && m.department.toLowerCase().includes(q)) ||
            (m.batch && m.batch.toLowerCase().includes(q)) ||
            (m.class_roll && m.class_roll.toLowerCase().includes(q)) ||
            (m.registration && m.registration.toLowerCase().includes(q)) ||
            (m.mobile && m.mobile.toLowerCase().includes(q))
        );
        return matchesRole && matchesSearch;
    });

    return (
        <RequireAuth>
            <div className="relative z-10 w-full h-full flex flex-col gap-8 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-white">
                            ASL Members Directory
                        </h1>
                        <p className="text-xs text-zinc-400 mt-1">
                            View, search, edit member profiles, credentials, and manage team designations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchMembers}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-white/10 transition-all"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(236,13,110,0.4)] transition-all"
                        >
                            <Plus size={16} /> Add Member
                        </button>
                    </div>
                </div>

                {/* Filters & Search Controls */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Role Filter Tabs */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {["All", "Executive", "Member", "Alumni"].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilterRole(r)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterRole === r
                                        ? "bg-[#EC0D6E]/15 border border-[#EC0D6E]/40 text-[#EC0D6E]"
                                        : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-transparent"
                                }`}
                            >
                                {r === "All" ? "All Roles" : `${r}s`}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, roll..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#EC0D6E] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                         <div className="p-16 text-center space-y-3">
                             <div className="w-8 h-8 border-2 border-[#EC0D6E] border-t-transparent rounded-full animate-spin mx-auto" />
                             <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Loading members directory...</p>
                         </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Member Profile</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Role & Dept</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Academic / Contact</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Credentials</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredMembers.map((item) => {
                                        const imgUrl = item.image || item.image_url;
                                        return (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 overflow-hidden relative shrink-0">
                                                            {imgUrl ? (
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[#EC0D6E] font-bold text-sm bg-[#EC0D6E]/10">
                                                                    {item.name ? item.name.charAt(0) : "M"}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white uppercase tracking-tight text-sm">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                                                                <Mail size={11} className="text-[#EC0D6E]" /> {item.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                                            item.role === "Executive" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" :
                                                            item.role === "Alumni" ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                                                            "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                        }`}>
                                                            {item.role || "Member"}
                                                        </span>
                                                        <span className="text-xs font-semibold text-zinc-300">
                                                            {item.department || "General"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-xs text-zinc-300 font-mono">
                                                        {item.batch && <span className="text-[#EC0D6E] font-bold">{item.batch} Batch </span>}
                                                        {item.class_roll && <span>| Roll: <strong className="text-white">{item.class_roll}</strong> </span>}
                                                        {item.registration && <span>| Reg: {item.registration}</span>}
                                                    </div>
                                                    {item.mobile && (
                                                        <div className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1">
                                                            <Phone size={11} className="text-zinc-500" /> {item.mobile}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {item.temp_password ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-emerald-400">
                                                                {showPasswords[item.id] ? item.temp_password : "••••••••"}
                                                            </span>
                                                            <button
                                                                onClick={() => togglePasswordVisibility(item.id)}
                                                                className="text-zinc-500 hover:text-white transition-colors"
                                                                title={showPasswords[item.id] ? "Hide password" : "Show password"}
                                                            >
                                                                {showPasswords[item.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-500 font-mono italic">Set by user</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2.5">
                                                        <button
                                                            onClick={() => openModal(item)}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-xs font-bold uppercase tracking-wider border border-blue-500/20"
                                                            title="Edit Member Details"
                                                        >
                                                            <Pencil size={13} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.name)}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-bold uppercase tracking-wider border border-red-500/20"
                                                            title="Delete Member"
                                                        >
                                                            <Trash2 size={13} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredMembers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                                                {searchQuery ? "No members match your search." : "No members found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Add / Edit Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0f0714] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_60px_rgba(236,13,110,0.15)] flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                            <h2 className="text-xl font-display font-bold uppercase text-white tracking-wider">
                                {editingId ? "Edit Member Profile" : "Add New Member"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="p-6 md:p-8 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Full Name <span className="text-[#EC0D6E]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Tanveen Ambrose"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Email Address <span className="text-[#EC0D6E]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g. user@gmail.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Role / Designation <span className="text-[#EC0D6E]">*</span>
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-[#170a1e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none cursor-pointer"
                                    >
                                        <option value="Executive">Executive</option>
                                        <option value="Member">Member</option>
                                        <option value="Alumni">Alumni</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Department / Wing <span className="text-[#EC0D6E]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department}
                                        placeholder="e.g. CSE, EEE, Robotics"
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Batch
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.batch}
                                        placeholder="e.g. 15th"
                                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Class Roll
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.class_roll}
                                        placeholder="e.g. 210310"
                                        onChange={(e) => setFormData({ ...formData, class_roll: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Registration No.
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.registration}
                                        placeholder="e.g. 1301"
                                        onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Mobile Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.mobile}
                                        placeholder="01XXXXXXXXX"
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        Temporary Password / Token
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.temp_password}
                                        placeholder="e.g. ASL-A1B2C3D4"
                                        onChange={(e) => setFormData({ ...formData, temp_password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400 focus:border-[#EC0D6E] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                    Photo / Image URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    placeholder="https://... or data:image/..."
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                    Bio & Research Interests
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.bio}
                                    placeholder="Brief bio or notes..."
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#EC0D6E] outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white shadow-[0_0_20px_rgba(236,13,110,0.4)] hover:shadow-[0_0_30px_rgba(236,13,110,0.6)] transition-all"
                                >
                                    {editingId ? "Save Changes" : "Add Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
