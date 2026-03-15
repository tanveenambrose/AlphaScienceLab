"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "Featured projects of Alpha Science Lab",
        description: "",
        image: "",
        color: "#EC0D6E",
        link: ""
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/admin/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchProjects();
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            if (res.ok) fetchProjects();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const openModal = (project?: any) => {
        if (project) {
            setEditingId(project.id);
            setFormData(project);
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                subtitle: "Featured projects of Alpha Science Lab",
                description: "",
                image: "",
                color: "#EC0D6E",
                link: ""
            });
        }
        setIsModalOpen(true);
    };

    return (
        <RequireAuth>
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold uppercase">Manage Projects</h1>
                    <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#EC0D6E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#ff1a7d] transition-colors">
                        <Plus size={18} /> Add New Project
                    </button>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                        <div className="p-10 text-center text-zinc-500">Loading projects...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Project Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Image URL</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 font-semibold">
                                            {project.title}
                                            <div className="text-xs text-zinc-500 font-normal">{project.subtitle}</div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300 text-sm max-w-[200px] truncate">{project.image}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                <button onClick={() => openModal(project)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-colors">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {projects.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-10 text-zinc-500">No projects found. Create one above!</td></tr>
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
                            <h2 className="text-xl font-display font-bold">{editingId ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Title</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Subtitle</label>
                                    <input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
                                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Image URL</label>
                                    <input type="text" required value={formData.image} placeholder="/projects/soccer_bot.png" onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Color</label>
                                        <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-1 py-1 cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Link (Optional)</label>
                                        <input type="text" value={formData.link || ""} placeholder="/projects/vlsi" onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-xl font-semibold bg-[#EC0D6E] hover:bg-[#ff1a7d] transition-colors">{editingId ? 'Save Changes' : 'Create Project'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
