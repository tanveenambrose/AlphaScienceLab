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
        title: "Molecular Research",
        desc: "Unlocking the secrets of life through advanced molecular dynamics and genetic engineering.",
        icon: Dna,
        color: "text-blue-400",
    },
    {
        title: "Quantum Synthesis",
        desc: "Developing next-gen materials using quantum chemical simulations and atomic-level precision.",
        icon: Zap,
        color: "text-purple-400",
    },
    {
        title: "AI Analysis",
        desc: "Leveraging deep learning for predictive scientific modelling and automated data interpretation.",
        icon: Cpu,
        color: "text-cyan-400",
    },
    {
        title: "Safety First",
        desc: "Highest biosafety level protocols (BSL-4 equivalent) for all experimental biological research.",
        icon: ShieldCheck,
        color: "text-indigo-400",
    },
    {
        title: "Discovery Pipeline",
        desc: "Rapid prototyping and validation of scientific hypotheses in a high-throughput lab environment.",
        icon: Workflow,
        color: "text-emerald-400",
    },
    {
        title: "Advanced Scrutiny",
        desc: "Rigorous peer-review and multi-stage verification of all experimental research outputs.",
        icon: Search,
        color: "text-sky-400",
    },
];

export default function Features() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".feature-card", {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".feature-grid",
                start: "top 80%",
                toggleActions: "play none none reverse",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="py-24 relative overflow-hidden bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Pioneering Science</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        AlphaScienceLab combines unconventional thinking with rigorous scientific methodologies
                        to address the most complex challenges of the 21st century.
                    </p>
                </div>

                <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="feature-card p-10 glass border border-white/5 rounded-3xl group hover:border-primary/30 transition-all hover:bg-white/5"
                        >
                            <div className={`p-4 rounded-2xl bg-white/5 inline-block mb-8 group-hover:scale-110 transition-transform ${feature.color}`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-display mb-4 group-hover:text-primary transition-colors line-clamp-1">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed font-sans">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
