"use client";

import { useState, useEffect } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import { Calendar, Plus, Trash2, X, MapPin, Clock, Search } from "lucide-react";
import Image from "next/image";

interface EventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    image?: string;
    status: "Upcoming" | "Completed" | "Live";
}

export default function AdminEvents() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("ASL Main Auditorium & Online");
    const [category, setCategory] = useState("Hackathon & Innovation");
    const [image, setImage] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/admin/events");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch events:", error);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    date: date || new Date().toISOString().split("T")[0],
                    location,
                    category,
                    image: image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
                    status: "Upcoming",
                }),
            });

            if (res.ok) {
                setTitle("");
                setDescription("");
                setDate("");
                setImage("");
                setIsModalOpen(false);
                fetchEvents();
            }
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchEvents();
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RequireAuth>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-wide flex items-center gap-3">
                            <Calendar className="text-[#EC0D6E]" />
                            Events Management
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Schedule, edit, and manage hackathons, workshops, and scientific symposia
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EC0D6E] to-[#9333EA] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(236,13,110,0.4)] transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Create New Event
                    </button>
                </div>

                {/* Filter */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search events by title or category..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#EC0D6E]/50 transition-all"
                    />
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#EC0D6E] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl">
                        <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">No Events Scheduled</h3>
                        <p className="text-zinc-400 text-sm">Add an event to display on the ASL Events calendar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEvents.map((item) => (
                            <div
                                key={item.id}
                                className="group rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-[#EC0D6E]/30 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                                    <Image
                                        src={item.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            item.status === "Live"
                                                ? "bg-red-500 text-white animate-pulse"
                                                : "bg-[#EC0D6E] text-white"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(item.id)}
                                        className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#EC0D6E]">
                                            {item.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#EC0D6E] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-[#EC0D6E]" /> {item.date}
                                        </span>
                                        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                                            <MapPin size={14} className="text-purple-400" /> {item.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Event Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <div className="w-full max-w-lg bg-[#0a0210] border border-white/10 rounded-3xl p-6 relative space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="text-[#EC0D6E]" size={20} />
                                    Create New Event
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Event Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. ASL Robotics & AI Symposium 2026"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Detailed event overview and agenda..."
                                        rows={3}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400 uppercase">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400 uppercase">Category</label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase">Cover Image URL</label>
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC0D6E]"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
                                        Publish Event
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
