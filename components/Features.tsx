"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const researchAreas = [
    {
        title: "VLSI & Semiconductors",
        desc: "Advanced integrated circuit design, CMOS technology, and semiconductor physics.",
        image: "/research/vlsi.png",
        color: "from-[#CB70FF] to-[#E2AEFF]",
    },
    {
        title: "Embedded Systems",
        desc: "Industrial solutions with PCB design, firmware optimization, and real-time processing.",
        image: "/research/embedded.png",
        color: "from-[#8C4FFF] to-[#B578FF]",
    },
    {
        title: "Robotics & AI",
        desc: "Engineering autonomous systems with machine learning and computer vision.",
        image: "/research/robotics.png",
        color: "from-[#7F3DFF] to-[#CB70FF]",
    },
    {
        title: "Software & Web",
        desc: "Scalable architectures, modern web technologies, and cloud-native solutions.",
        image: "/research/software.png",
        color: "from-[#3D7FFF] to-[#8C4FFF]",
    },
    {
        title: "Structural Analysis",
        desc: "Next-gen structural integrity simulations and advanced materials engineering.",
        image: "/research/structural.png",
        color: "from-[#B578FF] to-[#E2AEFF]",
    },
];

export default function Features() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScroll);
            return () => el.removeEventListener("scroll", checkScroll);
        }
    }, []);

    useGSAP(() => {
        gsap.from(".feature-card", {
            opacity: 0,
            x: 100,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
            }
        });
    }, { scope: sectionRef });

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section ref={sectionRef} id="projects" className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-secondary opacity-30 blur-5xl -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[2px] bg-primary" />
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Research Engine</h2>
                        </div>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter text-white">
                            Our Research <span className="text-primary/80">Areas</span>
                        </h3>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className={clsx(
                                "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
                                canScrollLeft ? "bg-white/5 text-white hover:border-primary/50 hover:bg-white/10" : "bg-white/2 opacity-30 text-white/50 cursor-not-allowed"
                            )}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className={clsx(
                                "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
                                canScrollRight ? "bg-white/5 text-white hover:border-primary/50 hover:bg-white/10" : "bg-white/2 opacity-30 text-white/50 cursor-not-allowed"
                            )}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {researchAreas.map((area, idx) => (
                        <div
                            key={idx}
                            className="feature-card min-w-[320px] md:min-w-[420px] h-[550px] relative rounded-[40px] overflow-hidden group snap-start border border-white/10 hover:border-primary/40 transition-colors duration-500"
                        >
                            {/* Glass Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-md" />

                            {/* Image Part */}
                            <div className="absolute top-0 inset-x-0 h-[50%] overflow-hidden">
                                <Image
                                    src={area.image}
                                    alt={area.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            </div>

                            {/* Content Part */}
                            <div className="absolute bottom-0 inset-x-0 p-10 flex flex-col justify-end h-full">
                                <div className={`w-12 h-[3px] bg-gradient-to-r ${area.color} mb-6 rounded-full`} />

                                <h4 className="text-3xl font-display font-black uppercase text-white mb-4 tracking-tighter leading-tight">
                                    {area.title}
                                </h4>

                                <p className="text-white/60 text-base font-medium leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {area.desc}
                                </p>

                                <div className="flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors group/btn">
                                        Explora Area
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                    <span className="text-white/10 text-4xl font-black font-display tracking-tighter">0{idx + 1}</span>
                                </div>
                            </div>

                            {/* Hover Inner Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
