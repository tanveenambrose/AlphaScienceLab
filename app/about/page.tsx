"use client";

import { useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";

export default function AboutPage() {
    const dispRef = useRef<SVGFEDisplacementMapElement>(null);
    const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseMove = useCallback(() => {
        if (dispRef.current) {
            dispRef.current.setAttribute("scale", "35");
        }
        if (decayRef.current) clearTimeout(decayRef.current);
        decayRef.current = setTimeout(() => {
            if (dispRef.current) {
                dispRef.current.setAttribute("scale", "12");
            }
        }, 600);
    }, []);

    return (
        <main
            className="min-h-screen flex flex-col relative"
            onMouseMove={handleMouseMove}
        >
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <filter id="gridWave">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="2" result="noise">
                        <animate attributeName="baseFrequency" values="0.015 0.04;0.025 0.07;0.015 0.04" dur="8s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap
                        ref={dispRef}
                        in="SourceGraphic"
                        in2="noise"
                        scale="12"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
            <div
                className="fixed inset-0 grid-bg pointer-events-none z-0"
                style={{ filter: "url(#gridWave)" }}
            />
            <Navbar />
            <div className="flex-1 relative z-10">
                <AboutContent />
            </div>
            <Footer />
        </main>
    );
}
