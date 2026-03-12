"use client";

import { useState, useRef } from "react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import BackgroundGlow from "./BackgroundGlow";

const stories = [
    {
        title: "Meet Team ASL Bravo",
        desc: "Our team ASL Bravo just finished an amazing bachelor project. Innovating in VLSI and Robotics with state-of-the-art solutions.",
        tag: "Recent Stories",
        image: "/research/vlsi_grid.png"
    },
    {
        title: "CPU Instruction Set",
        desc: "Implementation of custom CPU instruction set for the Alpha-A1 processor. A deep dive into microarchitecture.",
        tag: "Technical",
        image: "/research/embedded_grid.png"
    },
    {
        title: "Robotics Breakthrough",
        desc: "Our latest robotics platform achieved autonomous navigation in complex environments using neural vision.",
        tag: "Research",
        image: "/research/robotics_grid.png"
    },
    {
        title: "Semiconductor Future",
        desc: "Exploring the next generation of semiconductor materials for high-efficiency power electronics.",
        tag: "Innovation",
        image: "/research/vlsi_grid.png"
    }
];

export default function Stories() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="py-24 relative bg-black overflow-hidden">
            <BackgroundGlow />
            <div className="max-w-[1440px] mx-auto px-[93px] relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-2 h-2 bg-[#7F3DFF] rounded-full" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Recent stories</h2>
                </div>

                <div className="relative w-full h-[500px] bg-[#0A0A0A] rounded-[30px] overflow-hidden border border-white/5 shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex h-full"
                        >
                            {/* Left: Text Content */}
                            <div className="w-[564px] pl-[60px] pr-[48px] flex flex-col justify-center">
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#7F3DFF] mb-4">
                                    {stories[activeIndex].tag}
                                </span>
                                <h3 className="text-[40px] font-bold font-sans mb-6 tracking-[-0.02em] uppercase leading-[1.1] text-white">
                                    {stories[activeIndex].title}
                                </h3>
                                <p className="text-white/80 text-[18px] font-normal leading-[1.6] max-w-md">
                                    {stories[activeIndex].desc}
                                </p>
                                <div className="mt-10 flex items-center gap-2 text-white font-semibold text-[18px] cursor-pointer group">
                                    Read more
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>

                            {/* Right: Featured Image */}
                            <div className="w-[690px] relative h-full">
                                <NextImage
                                    src={stories[activeIndex].image}
                                    alt={stories[activeIndex].title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Gradient overlay to blend image with text area */}
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-[16px] mt-8">
                    {stories.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-[12px] h-[12px] rounded-full transition-all duration-300 ${
                                activeIndex === idx ? "bg-white" : "bg-white/30 hover:bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
