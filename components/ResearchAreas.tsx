"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const areas = [
    {
        title: "VLSI and Semiconductor",
        desc: "MEC is doing doing doing",
        image: "/research/vlsi_grid.png",
    },
    {
        title: "Hardware, PCB & Embedded Systems",
        desc: "MEC is doing doing doing",
        image: "/research/embedded_grid.png",
    },
    {
        title: "Robotics & Automation",
        desc: "MEC is doing doing doing",
        image: "/research/robotics_grid.png",
    },
];

export default function ResearchAreas() {
    return (
        <section className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {areas.map((area, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 hover:border-[#7B61FF]/50 transition-all duration-500"
                        >
                            <Image
                                src={area.image}
                                alt={area.title}
                                fill
                                className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-0 p-8">
                                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight leading-tight">
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
        </section>
    );
}
