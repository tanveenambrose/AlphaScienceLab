"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";

export default function AdminGallery() {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error("Failed to fetch gallery", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: newImageUrl, title }),
            });
            if (res.ok) {
                setNewImageUrl("");
                setTitle("");
                setIsModalOpen(false);
                fetchGallery();
            }
        } catch (error) {
            console.error("Upload error", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
            if (res.ok) fetchGallery();
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    return (
        <RequireAuth>
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold uppercase">Photo Gallery</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#EC0D6E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#ff1a7d] transition-colors">
                        <Plus size={18} /> Add Image Option
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-zinc-500 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl">Loading gallery...</div>
                ) : images.length === 0 ? (
                    <div className="p-10 text-center text-zinc-500 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl">No images in gallery. Upload one!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                                <Image src={img.image} alt={img.title || "Gallery image"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-white font-semibold flex-1 truncate">{img.title}</div>
                                        <button onClick={() => handleDelete(img.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal Option */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#120518] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-display font-bold">Add External Image</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Image URL</label>
                                <input type="url" required value={newImageUrl} placeholder="https://..." onChange={(e) => setNewImageUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Caption / Title (Optional)</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EC0D6E]/50 outline-none" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-xl font-semibold bg-[#EC0D6E] hover:bg-[#ff1a7d] transition-colors">Save To Gallery</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
