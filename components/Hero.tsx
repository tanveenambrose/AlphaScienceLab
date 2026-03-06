"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.set([".hero-kicker", ".hero-titles", ".hero-strip", ".hero-btns"], { opacity: 0 });
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(".hero-kicker", { opacity: 1, duration: 0.6, delay: 0.15 })
                .to(".hero-titles", { opacity: 1, duration: 0.8 }, "-=0.2")
                .to(".hero-strip", { opacity: 1, duration: 0.5 }, "-=0.4")
                .to(".hero-btns", { opacity: 1, duration: 0.5 }, "-=0.3");
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
            {/* ── Main content ── */}
            <div
                className="relative flex flex-col items-start justify-center text-left z-10 w-full"
                style={{
                    minHeight: "100svh",
                    paddingTop: "clamp(90px, 12vh, 140px)",
                    paddingBottom: "clamp(48px, 6vh, 100px)",
                    paddingLeft: "clamp(20px, 6vw, 160px)",
                    paddingRight: "clamp(20px, 6vw, 160px)",
                }}
            >
                {/* ① Kicker */}
                <p
                    className="hero-kicker font-accent text-white/75 leading-none"
                    style={{
                        fontSize: "clamp(14px, 3.2vw, 60px)",
                        lineHeight: 0.9,
                        letterSpacing: "0em",
                        marginBottom: "clamp(6px, 1.2vh, 24px)",
                        textTransform: "uppercase",
                        paddingLeft: "clamp(6px, 1vw, 48px)",
                    }}
                >
                    <span style={{ fontSize: "1em" }}>C</span>
                    <span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>REATIVITY&nbsp;</span>
                    <span style={{ fontSize: "1em" }}>S</span>
                    <span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>TARTS</span>
                </p>

                {/* ② Headline block */}
                <div className="hero-titles flex flex-col items-start w-full" style={{ gap: 0, marginBottom: "clamp(14px, 2vh, 32px)" }}>

                    {/* Row 1: ALPHA + FROM BELIEF */}
                    <div className="flex flex-wrap items-end justify-start" style={{ gap: "clamp(6px, 1.5vw, 48px)" }}>
                        <h1
                            className="font-display uppercase text-white m-0 p-0"
                            style={{
                                fontSize: "clamp(44px, 10vw, 158px)",
                                lineHeight: 0.82,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            ALPHA
                        </h1>
                        <span
                            className="font-accent text-white/80"
                            style={{
                                fontSize: "clamp(14px, 3.2vw, 60px)",
                                lineHeight: 0.9,
                                paddingBottom: "clamp(4px, 0.6vw, 14px)",
                                textTransform: "uppercase",
                            }}
                        >
                            <span style={{ fontSize: "1em" }}>F</span>
                            <span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>ROM&nbsp;</span>
                            <span style={{ fontSize: "1em" }}>B</span>
                            <span style={{ fontSize: "0.72em", verticalAlign: "middle" }}>ELIEF</span>
                        </span>
                    </div>

                    {/* Row 2: SCIENCE LAB */}
                    <h1
                        className="font-display uppercase text-white m-0 p-0"
                        style={{
                            fontSize: "clamp(44px, 10vw, 158px)",
                            lineHeight: 0.82,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        SCIENCE LAB
                    </h1>
                </div>

                {/* ③ Subtitle strip — full-width bleed */}
                <div
                    className="hero-strip subtitle-strip flex items-center justify-center w-screen"
                    style={{
                        marginTop: "clamp(10px, 2vh, 40px)",
                        marginBottom: "clamp(10px, 2vh, 40px)",
                        marginLeft: "clamp(-90px, -6vw, -300px)",
                        marginRight: "clamp(20px, 6vw, 300px)",
                        paddingTop: "clamp(10px, 1.4vh, 22px)",
                        paddingBottom: "clamp(10px, 1.4vh, 22px)",
                        paddingLeft: "clamp(20px, 6vw, 160px)",
                        paddingRight: "clamp(20px, 6vw, 160px)",
                    }}
                >
                    <p
                        className="font-tech text-white/90 text-center m-0"
                        style={{
                            fontSize: "clamp(13px, 1.8vw, 32px)",
                            lineHeight: 1.1,
                            letterSpacing: "-0.04em",
                        }}
                    >
                        Innovating in VLSI, Robotics, Software, and Design
                    </p>
                </div>

                {/* ④ CTA Buttons */}
                <div
                    className="hero-btns flex items-center justify-center flex-wrap w-full"
                    style={{
                        gap: "clamp(10px, 2vw, 36px)",
                        marginTop: "clamp(6px, 1.5vh, 24px)",
                    }}
                >
                    <button
                        id="hero-explore-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white"
                        style={{
                            width: "clamp(160px, 26vw, 386px)",
                            height: "clamp(44px, 4.5vw, 67px)",
                            borderRadius: "30px",
                            fontSize: "clamp(14px, 2vw, 35px)",
                            fontWeight: 600,
                            lineHeight: 1,
                        }}
                    >
                        Explore projects
                    </button>
                    <button
                        id="hero-team-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white"
                        style={{
                            width: "clamp(160px, 26vw, 386px)",
                            height: "clamp(44px, 4.5vw, 67px)",
                            borderRadius: "30px",
                            fontSize: "clamp(14px, 2vw, 35px)",
                            fontWeight: 600,
                            lineHeight: 1,
                        }}
                    >
                        Meet the team
                    </button>
                </div>
            </div>
        </section>
    );
}
