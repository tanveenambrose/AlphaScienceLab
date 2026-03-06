"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Beaker, Atom, FlaskConical, Sparkles } from "lucide-react";

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from(".hero-title span", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
        })
            .from(".hero-tag", {
                opacity: 0,
                scale: 0.8,
                duration: 0.8,
            }, "-=0.8")
            .from(".hero-desc", {
                opacity: 0,
                y: 20,
                duration: 1,
            }, "-=0.6")
            .from(".hero-btns", {
                opacity: 0,
                y: 20,
                duration: 1,
            }, "-=0.8")
            .from(".hero-shapes div", {
                opacity: 0,
                scale: 0,
                duration: 1.5,
                stagger: 0.2,
                rotate: 45,
            }, "-=1");

        // Floating animation for shapes
        gsap.to(".hero-shapes div", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                amount: 1,
                from: "random"
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            {/* Shapes */}
            <div className="hero-shapes absolute inset-0 z-10 pointer-events-none opacity-40">
                <div className="absolute top-[15%] left-[10%] p-4 bg-white/5 rounded-2xl glass">
                    <Atom className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute top-[20%] right-[15%] p-4 bg-white/5 rounded-2xl glass">
                    <Beaker className="w-10 h-10 text-secondary" />
                </div>
                <div className="absolute bottom-[20%] left-[20%] p-4 bg-white/5 rounded-2xl glass">
                    <FlaskConical className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute bottom-[15%] right-[25%] p-4 bg-white/5 rounded-2xl glass">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
            </div>

            <div className="relative z-20 container mx-auto px-6 text-center">
                <div className="hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 mx-auto">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium tracking-wider uppercase text-blue-200">The Future of Discovery</span>
                </div>

                <h1 ref={textRef} className="hero-title text-6xl md:text-8xl font-bold font-display mb-8 leading-tight">
                    <span className="inline-block">Alpha</span>{" "}
                    <span className="inline-block gradient-text">Science</span>{" "}
                    <span className="inline-block">Lab</span>
                </h1>

                <p className="hero-desc text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-sans">
                    Accelerating humanity's progress through advanced research, experimental automation, and
                    next-generation scientific breakthroughs.
                </p>

                <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform cursor-pointer">
                        Explore Research
                    </button>
                    <button className="px-8 py-4 border border-white/20 glass rounded-full font-bold hover:bg-white/5 transition-colors cursor-pointer">
                        Partner with Us
                    </button>
                </div>
            </div>
        </section>
    );
}
