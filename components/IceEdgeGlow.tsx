"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * IceEdgeGlow
 * Renders animated ice-blue frost glow rings around the viewport edges
 * and pulsing corner crystals. Fixed position, pointer-events: none.
 */
export default function IceEdgeGlow() {
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        // Pulse the top edge
        tl.to(".ice-edge-top", {
            opacity: 0.85,
            duration: 2.8,
            ease: "sine.inOut",
        }, 0);

        // Pulse the bottom edge (offset phase)
        tl.to(".ice-edge-bottom", {
            opacity: 0.70,
            duration: 3.4,
            ease: "sine.inOut",
        }, 0.6);

        // Pulse left/right sides
        tl.to(".ice-edge-left", {
            opacity: 0.60,
            duration: 4.0,
            ease: "sine.inOut",
        }, 1.2);
        tl.to(".ice-edge-right", {
            opacity: 0.55,
            duration: 3.7,
            ease: "sine.inOut",
        }, 0.9);

        // Rotate the inner frost ring slowly
        gsap.to(".ice-inner-ring", {
            rotation: 360,
            duration: 22,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
        });

        // Breathe corner orbs
        gsap.to(".ice-corner", {
            scale: 1.25,
            opacity: 0.55,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.7,
        });

        tlRef.current = tl;
        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 1 }}
            suppressHydrationWarning
        >
            {/* ── Top edge glow ── */}
            <div
                className="ice-edge-top absolute top-0 left-0 right-0"
                style={{
                    height: "220px",
                    background:
                        "linear-gradient(to bottom, rgba(100,220,255,0.22) 0%, rgba(80,180,255,0.10) 40%, transparent 100%)",
                    filter: "blur(18px)",
                    opacity: 0.5,
                }}
            />

            {/* ── Bottom edge glow ── */}
            <div
                className="ice-edge-bottom absolute bottom-0 left-0 right-0"
                style={{
                    height: "200px",
                    background:
                        "linear-gradient(to top, rgba(80,200,255,0.18) 0%, rgba(60,160,240,0.08) 40%, transparent 100%)",
                    filter: "blur(20px)",
                    opacity: 0.4,
                }}
            />

            {/* ── Left edge glow ── */}
            <div
                className="ice-edge-left absolute top-0 bottom-0 left-0"
                style={{
                    width: "180px",
                    background:
                        "linear-gradient(to right, rgba(90,210,255,0.18) 0%, rgba(70,175,255,0.07) 40%, transparent 100%)",
                    filter: "blur(22px)",
                    opacity: 0.35,
                }}
            />

            {/* ── Right edge glow ── */}
            <div
                className="ice-edge-right absolute top-0 bottom-0 right-0"
                style={{
                    width: "180px",
                    background:
                        "linear-gradient(to left, rgba(90,210,255,0.18) 0%, rgba(70,175,255,0.07) 40%, transparent 100%)",
                    filter: "blur(22px)",
                    opacity: 0.35,
                }}
            />

            {/* ── Corner frost orb — top-left ── */}
            <div
                className="ice-corner absolute"
                style={{
                    top: "-80px",
                    left: "-80px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(140,230,255,0.28) 0%, rgba(80,180,255,0.12) 45%, transparent 75%)",
                    filter: "blur(30px)",
                    opacity: 0.4,
                }}
            />

            {/* ── Corner frost orb — top-right ── */}
            <div
                className="ice-corner absolute"
                style={{
                    top: "-80px",
                    right: "-80px",
                    width: "340px",
                    height: "340px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(100,220,255,0.30) 0%, rgba(60,160,240,0.14) 45%, transparent 75%)",
                    filter: "blur(28px)",
                    opacity: 0.38,
                }}
            />

            {/* ── Corner frost orb — bottom-left ── */}
            <div
                className="ice-corner absolute"
                style={{
                    bottom: "-80px",
                    left: "-80px",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(120,225,255,0.25) 0%, rgba(70,170,255,0.10) 45%, transparent 75%)",
                    filter: "blur(32px)",
                    opacity: 0.35,
                }}
            />

            {/* ── Corner frost orb — bottom-right ── */}
            <div
                className="ice-corner absolute"
                style={{
                    bottom: "-80px",
                    right: "-80px",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(110,215,255,0.28) 0%, rgba(65,155,235,0.12) 45%, transparent 75%)",
                    filter: "blur(26px)",
                    opacity: 0.38,
                }}
            />

            {/* ── Inner frosted ring — glowing border around the viewport ── */}
            <div
                className="ice-inner-ring absolute inset-[6px] rounded-[3px]"
                style={{
                    border: "1px solid rgba(140, 228, 255, 0.12)",
                    boxShadow:
                        "inset 0 0 60px rgba(100, 210, 255, 0.06), 0 0 40px rgba(100, 210, 255, 0.04)",
                    pointerEvents: "none",
                }}
            />

            {/* ── Screen-edge vignette with ice tint ── */}
            <div
                className="absolute inset-0"
                style={{
                    boxShadow:
                        "inset 0 0 120px rgba(80,200,255,0.07), inset 0 0 250px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
