"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const CATEGORIES = [
    "VLSI and Semiconductor",
    "Hardware, PCB & Embedded Systems",
    "Robotics & Automation",
    "Software & Web Development",
    "Structural Analysis",
    "2D and 3D Design",
    "Research, Innovation & Documentation"
];

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [isUploading, setIsUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "Featured projects of Alpha Science Lab",
        description: "",
        image: "",
        color: "#EC0D6E",
        link: "",
        category: CATEGORIES[0]
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: uploadData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Upload error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
        const method = editingId ? "PUT" : "POST";

        try {
            const dataToSave = { ...formData, category: activeCategory };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
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
            setFormData({
                ...project,
                subtitle: project.subtitle || "Featured projects of Alpha Science Lab"
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                subtitle: "Featured projects of Alpha Science Lab",
                description: "",
                image: "",
                color: "#EC0D6E",
                link: "",
                category: activeCategory
            });
        }
        setIsModalOpen(true);
    };

    const filteredProjects = projects.filter(p => p.category === activeCategory || (!p.category && activeCategory === CATEGORIES[0])); // Fallback for old projects

    return (
        <RequireAuth>
            <div className="relative z-10 w-full flex flex-col gap-8 h-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-bold uppercase">Manage Projects</h1>
                    <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#EC0D6E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#ff1a7d] transition-colors">
                        <Plus size={18} /> Add New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar / Categories */}
                    <div className="col-span-1 flex flex-col gap-2 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 h-fit sticky top-20">
                        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 px-2">Sections</h2>
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                                    activeCategory === category 
                                        ? "bg-[#EC0D6E]/20 text-white border border-[#EC0D6E]/50 font-semibold shadow-[0_0_15px_rgba(236,13,110,0.2)]" 
                                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Projects Table */}
                    <div className="col-span-1 md:col-span-3 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white tracking-widest uppercase">{activeCategory}</h2>
                            <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-zinc-300">{filteredProjects.length} Projects</span>
                        </div>
                        
                        <div className="flex-1 overflow-auto">
                            {isLoading ? (
                                <div className="p-10 text-center text-zinc-500">Loading projects...</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Project Info</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Image URL</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredProjects.map((project) => (
                                            <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-6 font-semibold w-1/2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }}></div>
                                                        <div>
                                                            <div className="text-white uppercase font-black tracking-tight">{project.title}</div>
                                                            <div className="text-xs text-zinc-500 font-normal mt-1 leading-relaxed line-clamp-2 pr-6">
                                                                {project.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-zinc-400 text-xs truncate max-w-[150px]">{project.image}</td>
                                                <td className="py-4 px-6 bg-bl">
                                                    <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity">
                                                        <button onClick={() => openModal(project)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-colors" title="Edit">
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-colors" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredProjects.length === 0 && (
                                            <tr><td colSpan={3} className="text-center py-16 text-zinc-500 uppercase tracking-widest text-sm font-bold opacity-50">No projects in this section</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(236,13,110,0.1)]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-display font-black uppercase text-white tracking-widest">{editingId ? 'Edit Project Setup' : 'New Project Setup'}</h2>
                                <p className="text-xs text-zinc-500 mt-2 uppercase font-bold tracking-widest">Section: <span className="text-[#EC0D6E]">{activeCategory}</span></p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Mimicking the 2nd image fields needed: Title, Image, Description, and Glow Color */}
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Project Title (e.g. PRESIDENT OF SALES)</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white font-black uppercase tracking-widest focus:border-[#EC0D6E]/50 outline-none transition-all focus:shadow-[0_0_20px_rgba(236,13,110,0.1)]" placeholder="Enter title" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Project Image (Left side)</label>
                                            <div className="flex gap-3">
                                                <input type="text" required value={formData.image} placeholder="Image URL or upload..." onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 min-w-0 bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#EC0D6E]/50 outline-none transition-all focus:shadow-[0_0_20px_rgba(236,13,110,0.1)] text-xs truncate" />
                                                <label className="flex flex-shrink-0 items-center justify-center px-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                                    {isUploading ? <span className="animate-spin border-2 border-white/20 border-t-[#EC0D6E] rounded-full w-4 h-4" /> : <span className="text-[10px] uppercase tracking-widest font-bold text-white">Upload</span>}
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Theme Glow</label>
                                                <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl px-4 py-2">
                                                    <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                    <span className="text-xs text-zinc-400 uppercase font-bold">{formData.color}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Link (Optional)</label>
                                                <input type="text" value={formData.link || ""} placeholder="/projects/details" onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 h-[58px] text-white focus:border-[#EC0D6E]/50 outline-none transition-all focus:shadow-[0_0_20px_rgba(236,13,110,0.1)] text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Description (Right side paragraph)</label>
                                        <textarea required rows={7} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full h-[calc(100%-28px)] bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-zinc-300 focus:border-[#EC0D6E]/50 outline-none resize-none transition-all leading-relaxed text-sm focus:shadow-[0_0_20px_rgba(236,13,110,0.1)]" placeholder="Lorem ipsum dolor sit amet..." />
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/10 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white transition-colors text-xs">Cancel</button>
                                    <button type="submit" className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest bg-[#EC0D6E] hover:bg-white text-white hover:text-black transition-all shadow-[0_0_20px_rgba(236,13,110,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-xs">
                                        {editingId ? 'Save Changes' : 'Create Project'}
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
