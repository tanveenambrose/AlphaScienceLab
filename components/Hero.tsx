"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Animate hero text elements in sequence
            // hero-btn is intentionally NOT in GSAP so buttons are always visible
            gsap.set([".hero-kicker", ".hero-titles", ".hero-strip"], { opacity: 0 });
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(".hero-kicker", { opacity: 1, duration: 0.6, delay: 0.15 })
                .to(".hero-titles", { opacity: 1, duration: 0.8 }, "-=0.2")
                .to(".hero-strip", { opacity: 1, duration: 0.5 }, "-=0.4");
        },
        { scope: container }
    );

    return (
        <section
            ref={container}
            suppressHydrationWarning
            className="relative w-full"
            style={{ minHeight: "100svh", overflowX: "hidden" }}
        >

            {/* Background handled by global AnimatedBackground component */}


            {/* ── Main content — left-aligned, vertically centered ── */}
            <div
                className="relative flex flex-col items-start justify-center text-left z-10"
                style={{
                    minHeight: "100svh",
                    paddingTop: "clamp(80px, 10vh, 120px)",
                    paddingBottom: "clamp(40px, 5vh, 80px)",
                    paddingLeft: "clamp(32px, 8vw, 160px)",
                }}
            >

                {/* ① Kicker — Anton SC, 60px @ 1440px = 4.2vw */}
                <p
                    className="hero-kicker font-accent text-white/75 leading-none ml-12"
                    style={{
                        fontSize: "clamp(20px, 4.2vw, 60px)",
                        lineHeight: 0.73,
                        letterSpacing: "0em",
                        marginBottom: "clamp(8px, 1.5vh, 24px)",
                        fontVariant: "normal",
                        textTransform: "uppercase",
                    }}
                >
                    <span style={{ fontSize: "1em" }}>C</span><span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>REATIVITY&nbsp;</span><span style={{ fontSize: "1em" }}>S</span><span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>TARTS</span>
                </p>

                {/* ② Headline block */}
                <div className="hero-titles flex flex-col items-start mb-10" style={{ gap: 0 }}>

                    {/* Row 1: ALPHA + FROM BELIEF */}
                    <div className="flex items-end justify-start" style={{ gap: "clamp(12px, 2.2vw, 48px)" }}>
                        {/* ALPHA — Bakbak One, 158.69px @ 1440px = 11vw */}
                        <h1
                            className="font-display uppercase text-white m-0 p-0"
                            style={{
                                fontSize: "clamp(52px, 11vw, 158px)",
                                lineHeight: 0.73,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            ALPHA
                        </h1>
                        {/* FROM BELIEF — Anton SC, same 60px as Creativity Starts */}
                        <span
                            className="font-accent text-white/80"
                            style={{
                                fontSize: "clamp(20px, 4.2vw, 60px)",
                                lineHeight: 0.73,
                                letterSpacing: "0em",
                                paddingBottom: "clamp(6px, 0.8vw, 14px)",
                                fontVariant: "normal",
                                textTransform: "uppercase",
                            }}
                        >
                            <span style={{ fontSize: "1em" }}>F</span><span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>ROM&nbsp;</span><span style={{ fontSize: "1em" }}>B</span><span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>ELIEF</span>
                        </span>
                    </div>

                    {/* Row 2: SCIENCE LAB — Bakbak One */}
                    <h1
                        className="font-display uppercase text-white m-0 p-0"
                        style={{
                            fontSize: "clamp(52px, 11vw, 158px)",
                            lineHeight: 0.73,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        SCIENCE LAB
                    </h1>
                </div>

                {/* ③ Subtitle strip — centered across full width */}
                <div
                    className="hero-strip subtitle-strip flex items-center mb-10 justify-center"
                    style={{
                        marginTop: "clamp(14px, 2.8vh, 40px)",
                        width: "100vw",
                        marginLeft: "calc(-1 * clamp(32px, 8vw, 160px))",
                        paddingTop: "clamp(10px, 1.4vh, 22px)",
                        paddingBottom: "clamp(10px, 1.4vh, 22px)",
                        paddingLeft: "clamp(32px, 8vw, 160px)",
                        paddingRight: "clamp(32px, 8vw, 160px)",
                    }}
                >
                    <p
                        className="font-tech text-white/90 text-center m-0"
                        style={{
                            fontSize: "clamp(14px, 2.22vw, 32px)",
                            lineHeight: 0.73,
                            letterSpacing: "-0.06em",
                            textAlign: "center",
                            verticalAlign: "middle",
                        }}
                    >
                        Innovating in VLSI, Robotics, Software, and Design
                    </p>
                </div>

                {/* ④ CTA Glass Buttons — centered across full width */}
                <div
                    className="flex items-center justify-center flex-wrap w-full"
                    style={{
                        marginTop: "clamp(14px, 2.8vh, 40px)",
                        marginLeft: "calc(-1 * clamp(32px, 8vw, 160px))",
                        paddingLeft: "clamp(32px, 8vw, 160px)",
                        paddingRight: "clamp(32px, 8vw, 160px)",
                        gap: "clamp(12px, 2vw, 36px)"
                    }}
                >
                    <button
                        id="hero-explore-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white"
                        style={{
                            width: "clamp(200px, 26.8vw, 386px)",
                            height: "clamp(48px, 4.65vw, 67px)",
                            borderRadius: "30px",
                            fontSize: "clamp(16px, 2.49vw, 35.84px)",
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: "0em",
                            textAlign: "center",
                            verticalAlign: "middle",
                        }}
                    >
                        Explore projects
                    </button>
                    <button
                        id="hero-team-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white"
                        style={{
                            width: "clamp(200px, 26.8vw, 386px)",
                            height: "clamp(48px, 4.65vw, 67px)",
                            borderRadius: "30px",
                            fontSize: "clamp(16px, 2.49vw, 35.84px)",
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: "0em",
                            textAlign: "center",
                            verticalAlign: "middle",
                        }}
                    >
                        Meet the team
                    </button>
                </div>

            </div>
        </section>
    );
}
