"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
        <section ref={container} className="py-16 sm:py-20 lg:py-24 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-10 sm:mb-12">
                    <div className="w-2 h-2 bg-[#7F3DFF] rounded-full" />
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-500">Recent stories</h2>
                </div>

                <div className="flex flex-col gap-8 sm:gap-12">
                    {stories.map((story, idx) => (
                        <div
                            key={idx}
                            className="story-card group flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 items-start md:items-center border-b border-white/5 pb-8 sm:pb-12 last:border-0 cursor-pointer"
                        >
                            {/* Thumbnail */}
                            <div className="w-full md:w-1/3 aspect-video bg-[#1E1E1E] rounded-2xl sm:rounded-3xl overflow-hidden relative shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7F3DFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Text */}
                            <div className="w-full md:w-2/3">
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#7F3DFF] mb-3">
                                    {story.tag}
                                </span>
                                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black font-display mb-4 sm:mb-6 tracking-tighter uppercase group-hover:text-[#7F3DFF] transition-colors leading-tight">
                                    {story.title}
                                </h3>
                                <p className="text-slate-400 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                                    {story.desc}
                                </p>
                                <div className="mt-6 sm:mt-8 flex items-center gap-4 text-[#7F3DFF] font-black uppercase tracking-widest text-xs">
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
