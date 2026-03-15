"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PhotoGallery() {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/admin/gallery");
                const data = await res.json();
                setImages(data);
            } catch (error) {
                console.error("Failed to load gallery", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (isLoading || images.length === 0) return null; // Hide section if no images or loading

    return (
        <section id="photo-gallery" className="py-24 bg-black relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-white mb-4">
                        Photo <span className="text-primary">Gallery</span>
                    </h2>
                    <p className="text-slate-400 font-tech">Glimpses inside the Alpha Science Lab</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden group">
                            <Image src={img.image} alt={img.title || "ASL Photo"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <h3 className="text-white font-display font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
