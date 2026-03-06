"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from(".hero-uptitle", {
            opacity: 0,
            y: 20,
            duration: 1,
        })
            .from(".hero-main span", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
            }, "-=0.6")
            .from(".hero-subtitle", {
                opacity: 0,
                y: 20,
                duration: 1,
            }, "-=0.8")
            .from(".hero-btns", {
                opacity: 0,
                y: 20,
                duration: 1,
            }, "-=0.8");

    }, { scope: container });

    return (
        <section ref={container} className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 bg-black">
            {/* Subtle Glow behind Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-20 container mx-auto px-6 text-center">
                <div className="hero-uptitle text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">
                    Creativity Starts
                </div>

                <h1 className="hero-main flex flex-col items-center font-display font-black leading-[0.85] text-[15vw] md:text-[10vw] uppercase tracking-tighter mb-10">
                    <div className="flex items-baseline gap-4 md:gap-8">
                        <span className="inline-block">Alpha</span>
                        <span className="hero-belief text-[2vw] md:text-[1.5vw] font-bold tracking-widest text-[#7F3DFF] align-top mt-[-2vw]">
                            From Belief
                        </span>
                    </div>
                    <span className="inline-block">Science Lab</span>
                </h1>

                <p className="hero-subtitle text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed font-sans font-medium">
                    Innovating in VLSI, Robotics, Software, and Design
                </p>

                <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-8">
                    <button className="min-w-[220px] px-10 py-5 border-2 border-[#7F3DFF] text-white rounded-2xl font-bold hover:bg-[#7F3DFF]/10 transition-all cursor-pointer uppercase tracking-widest text-sm">
                        Explore projects
                    </button>
                    <button className="min-w-[220px] px-10 py-5 bg-[#7F3DFF] text-white rounded-2xl font-bold hover:scale-105 transition-transform cursor-pointer uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(127,61,255,0.3)]">
                        Meet the team
                    </button>
                </div>
            </div>
        </section>
    );
}
