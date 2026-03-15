"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScrollProvider
 * Initialises ReactLenis on mount and drives its RAF loop with GSAP's ticker.
 * Place this high in the component tree (e.g. inside RootLayout).
 */
export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<LenisRef>(null);

    useEffect(() => {
        const update = (time: number) => {
            lenisRef.current?.lenis?.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    useEffect(() => {
        if (!lenisRef.current?.lenis) return;

        const lenis = lenisRef.current.lenis;
        lenis.on("scroll", ScrollTrigger.update);

        return () => {
            lenis.off("scroll", ScrollTrigger.update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                touchMultiplier: 2,
            }}
        >
            {children}
        </ReactLenis>
    );
}
