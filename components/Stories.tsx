"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

const stories = [
    {
        title: "Meet Team ASL Bravo",
        desc: "Our team ASL Bravo just finished an amazing bachelor... Innovating in VLSI and Robotics.",
        tag: "Recent Stories",
    },
    {
        title: "CPU Instruction Set",
        desc: "Implementation of custom CPU instruction set for the Alpha-A1 processor.",
        tag: "Technical",
    }
];

export default function Stories() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".story-card", {
            opacity: 0,
            x: 50,
            duration: 1,
            stagger: 0.3,
            scrollTrigger: {
                trigger: container.current,
                start: "top 70%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 bg-[#7F3DFF] rounded-full" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Recent stories</h2>
                </div>

                <div className="flex flex-col gap-12">
                    {stories.map((story, idx) => (
                        <div key={idx} className="story-card group flex flex-col md:flex-row gap-12 items-center border-b border-white/5 pb-12 last:border-0 cursor-pointer">
                            <div className="w-full md:w-1/3 aspect-video bg-[#1E1E1E] rounded-3xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7F3DFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="w-full md:w-2/3">
                                <h3 className="text-3xl md:text-5xl font-black font-display mb-6 tracking-tighter uppercase group-hover:text-[#7F3DFF] transition-colors leading-tight">
                                    {story.title}
                                </h3>
                                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                                    {story.desc}
                                </p>
                                <div className="mt-8 flex items-center gap-4 text-[#7F3DFF] font-black uppercase tracking-widest text-xs">
                                    Read More
                                    <div className="w-8 h-px bg-[#7F3DFF] group-hover:w-16 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
