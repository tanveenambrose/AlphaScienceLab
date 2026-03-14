"use client";

import { useRef } from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import BackgroundGlow from "./BackgroundGlow";

const areas = [
    {
        title: "VLSI and Semiconductor",
        desc: "Pushing the boundaries of integrated circuit design and semiconductor technology.",
        image: "/projects/VLSI and Semiconductor.png",
    },
    {
        title: "Hardware, PCB & Embedded Systems",
        desc: "Designing robust hardware architectures and high-performance embedded solutions.",
        image: "/projects/Hardware, PCB & Embedded Systems.png",
    },
    {
        title: "Robotics & Automation",
        desc: "Innovating in autonomous systems and advanced robotic control mechanisms.",
        image: "/projects/Robotics & Automation.png",
    },
];

export default function ResearchAreas() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <BackgroundGlow />
            <div className="max-w-[1440px] mx-auto relative z-10">
                <div className="px-[108px] mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Our Research Areas
                    </h2>
                </div>
                
                <div 
                    ref={containerRef}
                    className="flex gap-[40px] overflow-x-auto pb-12 px-[108px] hide-scrollbar snap-x snap-mandatory"
                >
                    {areas.map((area, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex-shrink-0 w-[354px] h-[529px] group relative rounded-[30px] overflow-hidden border-[3px] border-[#B578FF]/30 hover:border-[#B578FF]/60 transition-all duration-500 snap-start backdrop-blur-md bg-black/20"
                        >
                            <NextImage
                                src={area.image}
                                alt={area.title}
                                fill
                                className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-0 p-10">
                                <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight leading-tight">
                                    {area.title}
                                </h3>
                                <p className="text-zinc-400 text-sm uppercase tracking-widest">
                                    {area.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
