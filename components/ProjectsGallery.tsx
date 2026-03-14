"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "SOCCER BOT",
        subtitle: "Featured projects of Alpha Science Lab",
        description: "Robo soccer bots are available as both pre-built remote-controlled toys for casual play and as DIY kits designed for educational purposes or competitive leagues. The type of product you choose will depend on whether you are looking for a simple toy or a more involved robotics project.",
        image: "/projects/soccer_bot.png",
        color: "#962E9B",
    },
    {
        id: 2,
        title: "LINE FOLLOWER ROBOT",
        subtitle: "Featured projects of Alpha Science Lab",
        description: "An automated guided vehicle that follows visual lines embedded on the floor. These robots are widely used in industrial automation for transporting materials along fixed paths with high precision.",
        image: "/projects/line_follower.png",
        color: "#7B61FF",
    },
    {
        id: 3,
        title: "VLSI DESIGN",
        subtitle: "Featured projects of Alpha Science Lab",
        description: "Advanced integrated circuit design focusing on low-power architectures and high-performance computing. Our research pushes the limits of semiconductor technology through innovative transistor-level optimizations.",
        image: "/projects/vlsi_design.png",
        color: "#3D7FFF",
    },
];

export default function ProjectsGallery() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeProject = projects[activeIndex];

    const nextProject = () => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    return (
        <section id="projects-gallery" className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none transition-colors duration-1000"
                style={{
                    background: `radial-gradient(circle at center, ${activeProject.color}33 0%, transparent 70%)`,
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-20 text-center">
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter mb-4">
                        Projects Gallery
                    </h2>
                    <p className="text-zinc-500 text-lg uppercase tracking-[0.2em] font-medium">
                        {activeProject.subtitle}
                    </p>
                </div>

                {/* Main Featured Card */}
                <div className="relative bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden min-h-[600px] flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

                    <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <h3 className="text-4xl md:text-6xl font-accent font-black text-white mb-8 uppercase tracking-tight leading-none">
                                    {activeProject.title}
                                </h3>
                                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-12 font-light">
                                    {activeProject.description}
                                </p>

                                <div className="flex items-center gap-8">
                                    <button className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/90 transition-all duration-300">
                                        View Details
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={prevProject}
                                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors group"
                                        >
                                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={nextProject}
                                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors group"
                                        >
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Image Area with Inner Product Glow */}
                    <div className="w-full md:w-1/2 relative h-[400px] md:h-auto overflow-hidden p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                transition={{ duration: 0.6, ease: "circOut" }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                {/* Inner Soft Glow around the image */}
                                <div
                                    className="absolute inset-0 rounded-full blur-[100px] opacity-40 transition-colors duration-1000"
                                    style={{ backgroundColor: activeProject.color }}
                                />

                                <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border border-white/10 shadow-3xl">
                                    <Image
                                        src={activeProject.image}
                                        alt={activeProject.title}
                                        fill
                                        className="object-cover opacity-100"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Carousel Tray */}
                <div className="mt-16 flex items-center gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
                    {projects.map((project, idx) => (
                        <button
                            key={project.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`flex-shrink-0 w-[300px] h-[100px] bg-[#111] rounded-2xl relative transition-all duration-500 overflow-hidden border ${activeIndex === idx
                                    ? "border-white/40 scale-100 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                    : "border-white/5 opacity-40 hover:opacity-80 scale-95"
                                } p-4 flex items-center gap-4 group`}
                        >
                            <div className="relative w-20 h-full rounded-lg overflow-hidden shrink-0">
                                <Image src={project.image} alt={project.title} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden text-left">
                                <span className="text-white font-black text-xs uppercase tracking-tighter truncate w-full">
                                    {project.title}
                                </span>
                                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                                    Project {idx + 1}
                                </span>
                            </div>
                            {activeIndex === idx && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
