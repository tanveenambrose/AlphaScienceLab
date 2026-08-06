"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Plus, Trash2, X, Archive, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ArchiveItem {
    id: string;
    image: string;
    title?: string;
    category?: string;
    date?: string;
}

export default function AdminArchive() {
    const [items, setItems] = useState<ArchiveItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Project Artifact");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchArchive();
    }, []);

    const fetchArchive = async () => {
        try {
            const res = await fetch("/api/admin/archive");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch archive items", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/archive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: newImageUrl, title, category }),
            });
            if (res.ok) {
                setNewImageUrl("");
                setTitle("");
                setIsModalOpen(false);
                fetchArchive();
            }
        } catch (error) {
            console.error("Upload error", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this archive item?")) return;
        try {
            const res = await fetch(`/api/admin/archive/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchArchive();
            }
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const filteredItems = items.filter(item =>
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RequireAuth>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-wide flex items-center gap-3">
                            <Archive className="text-[#EC0D6E]" />
                            Archive Management
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Manage lab archives, media assets, and historical project documentation
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(236,13,110,0.4)] transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Archive Item
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search archive items..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]/50 transition-all"
                    />
                </div>

                {/* Grid Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#EC0D6E] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl">
                        <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">No Archive Items Found</h3>
                        <p className="text-zinc-400 text-sm">Upload media assets to preserve in the ASL Archive.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#EC0D6E]/40 transition-all duration-300 shadow-lg"
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                                    <Image
                                        src={item.image || "/assets/asl.png"}
                                        alt={item.title || "Archive item"}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white text-base truncate">
                                        {item.title || "Untitled Archive Item"}
                                    </h3>
                                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EC0D6E]/10 text-[#EC0D6E] border border-[#EC0D6E]/20">
                                        {item.category || "General Archive"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Item Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <div className="w-full max-w-md bg-[#0a0210] border border-white/10 rounded-3xl p-6 relative space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Archive className="text-[#EC0D6E]" size={20} />
                                    Add Archive Item
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Robotics Championship 2025"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Category</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Media Event, Project Artifact"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Image URL</label>
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://example.com/photo.jpg"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-[#EC0D6E] text-white text-sm font-bold hover:bg-[#ff1a7d]"
                                    >
                                        Upload to Archive
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
