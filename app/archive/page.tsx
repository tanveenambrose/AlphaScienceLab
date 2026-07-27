"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsGallery from "@/components/ProjectsGallery";
import Events from "@/components/Events";

export default function ArchivePage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="relative z-10 flex-1">
                <section className="pt-40 pb-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
                        Archive
                    </h1>
                    <p className="text-zinc-400 text-lg uppercase tracking-[0.2em] font-medium mt-4">
                        Projects &amp; Events
                    </p>
                </section>
                <ProjectsGallery />
                <Events />
            </div>
            <Footer />
        </main>
    );
}
