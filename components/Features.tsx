"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Dna, ShieldCheck, Zap, Cpu, Search, Workflow } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const features = [
    {
        title: "VLSI & Semiconductors",
        desc: "Specializing in advanced integrated circuit design, CMOS technology, and semiconductor device physics.",
        color: "from-primary/20",
    },
    {
        title: "Embedded Systems",
        desc: "Developing robust industrial solutions with PCB design, firmware optimization, and real-time processing.",
        color: "from-secondary/20",
    },
    {
        title: "Robotics & AI",
        desc: "Engineering the next generation of autonomous systems with integrated machine learning and computer vision.",
        color: "from-accent/40",
    },
];

export default function Features() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".feature-card", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".feature-grid",
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} id="projects" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="feature-card relative overflow-hidden p-12 bg-[#1E1E1E] border border-white/5 rounded-[40px] group hover:border-[#7F3DFF]/50 transition-all min-h-[400px] flex flex-col justify-end"
                        >
                            {/* Radial gradient glow */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} to-transparent blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative z-10">
                                <h3 className="text-3xl font-black font-display mb-4 uppercase tracking-tighter leading-tight">{feature.title}</h3>
                                <p className="text-slate-400 font-medium tracking-wide text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
