"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function JoinSection() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".join-box", {
            opacity: 0,
            y: 40,
            duration: 1,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} id="about" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="join-box max-w-4xl mx-auto p-12 md:p-20 bg-[#1E1E1E] border border-white/5 rounded-[40px] relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7F3DFF]/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl md:text-6xl font-black font-display mb-8 tracking-tighter uppercase leading-tight text-white">
                            Join the <span className="text-primary">Inner Circle</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                            Stay at the forefront of scientific discovery. Join our community of researchers, engineers, and visionaries.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-8 py-5 text-white font-medium focus:border-primary outline-none transition-all glass"
                            />
                            <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(127,61,255,0.4)] hover:shadow-[0_0_50px_rgba(127,61,255,0.6)] cursor-pointer">
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
