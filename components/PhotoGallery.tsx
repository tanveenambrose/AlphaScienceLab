"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryImage {
    id: string;
    image: string;
    title?: string;
}

function Skeleton() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="mb-16 text-center">
                    <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square sm:aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            </div>
        </section>
    );
}

function EmptyState() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-white mb-4">
                        Photo <span className="text-primary">Gallery</span>
                    </h2>
                    <p className="text-slate-400 font-tech">Glimpses inside the Alpha Science Lab</p>
                </div>
                <div className="flex items-center justify-center py-16">
                    <p className="text-zinc-500 font-display text-xl uppercase tracking-widest">No images available</p>
                </div>
            </div>
        </section>
    );
}

export default function PhotoGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/admin/gallery");
                if (!res.ok) {
                    console.error("Gallery API error:", res.status);
                    setImages([]);
                    return;
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    const validImages: GalleryImage[] = data
                        .map((img: any) => ({
                            id: img.id || String(Math.random()),
                            image: img.image || img.image_url || "",
                            title: img.title || img.caption || "",
                        }))
                        .filter((img: GalleryImage) => Boolean(img.image));
                    setImages(validImages);
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("Failed to load gallery", error);
                setImages([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (isLoading) return <Skeleton />;
    if (images.length === 0) return <EmptyState />;

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
                    {images.map((img: GalleryImage) => (
                        <div key={img.id} className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden group">
                            <Image src={img.image} alt={img.title || "ASL Photo"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                {img.title && (
                                    <h3 className="text-white font-display font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {img.title}
                                    </h3>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}