"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* Splits a string into individual letter <span>s */
function SplitText({ text, className, useSmallCaps }: { text: string; className?: string; useSmallCaps?: boolean }) {
    if (!useSmallCaps) {
        return (
            <>
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        className={`letter-char ${className ?? ""}`}
                        style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </>
        );
    }

    /* Small Caps Logic: First letter of each word remains 1em, others are 0.72em */
    /* All bottom-aligned to the baseline */
    const words = text.split(" ");
    return (
        <>
            {words.map((word, wIdx) => (
                <span key={wIdx} style={{ display: "inline-block", whiteSpace: "nowrap", verticalAlign: "baseline" }}>
                    {word.split("").map((char, lIdx) => {
                        const isFirst = lIdx === 0;
                        return (
                            <span
                                key={lIdx}
                                className={`letter-char ${className ?? ""}`}
                                style={{
                                    display: "inline-block",
                                    fontSize: isFirst ? "1em" : "0.72em",
                                    verticalAlign: "baseline"
                                }}
                            >
                                {char}
                            </span>
                        );
                    })}
                    {/* Add non-breaking space after word if not the last word */}
                    {wIdx < words.length - 1 && (
                        <span className={`letter-char ${className ?? ""}`} style={{ display: "inline-block", verticalAlign: "baseline" }}>
                            &nbsp;
                        </span>
                    )}
                </span>
            ))}
        </>
    );
}

const PROJECT_CATEGORIES = [
    "VLSI and Semiconductor",
    "Hardware, PCB & Embedded Systems",
    "Robotics & Automation",
    "Software & Web Development",
    "Structural Analysis",
    "2D and 3D Design",
    "Research, Innovation & Documentation",
    "Others"
];

const TEAM_CATEGORIES = [
    "Members",
    "Executives",
    "Alumni",
    "Photo Gallery"
];

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);
    const [activeGrid, setActiveGrid] = useState<"projects" | "team" | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleInteraction = (type: "projects" | "team" | null) => {
        setActiveGrid(type);
    };

    useGSAP(
        () => {
            /* ── initial state — everything hidden ── */
            gsap.set([".hero-strip", ".hero-btns"], { opacity: 0 });
            gsap.set(".hero-kicker", { opacity: 1 }); // container visible; letters control visibility
            gsap.set("#hero-from-belief", { opacity: 1 });

            /* ── set letters invisible before animating ── */
            gsap.set(".title-word .letter-char", {
                opacity: 0,
                y: 60,
                filter: "blur(20px)",
                rotationX: -50,
            });

            /* ── kicker & belief letters: start clean but hidden for first run ── */
            gsap.set([".kicker-char", ".belief-char"], {
                opacity: 0,
                x: -22,
                filter: "blur(8px)",
                display: "inline-block"
            });

            /* ── Glitch Animation Logic ── */
            let glitchTween: gsap.core.Tween | null = null;

            const startGlitch = () => {
                if (glitchTween) glitchTween.kill();
                glitchTween = gsap.to([".kicker-char", ".belief-char"], {
                    duration: 0.08,
                    x: "random(-24, -20)",
                    opacity: "random(0.1, 0.4)",
                    skewX: "random(-10, 10)",
                    filter: () => `blur(${gsap.utils.random(4, 10)}px)`,
                    repeat: -1,
                    yoyo: true,
                    ease: "none",
                });
            };

            const stopGlitch = (targets: string) => {
                if (glitchTween) {
                    glitchTween.kill();
                    glitchTween = null;
                }

                // Faster, smoother snap back to clean state
                gsap.to(targets, {
                    opacity: 1,
                    x: 0,
                    skewX: 0,
                    filter: "blur(0px)",
                    duration: 0.4,
                    stagger: { each: 0.03, ease: "expo.out" },
                    ease: "expo.out",
                });
            };

            /* ════════════════════════════════════════
               INTRO — plays once on page load
               Order: ALPHA → SCIENCE → LAB
                      then CREATIVITY STARTS + FROM BELIEF
                      then strip + buttons
            ════════════════════════════════════════ */
            const intro = gsap.timeline({
                defaults: { ease: "expo.out" },
            });

            // No startGlitch here — first time is clean

            /* ① ALPHA letters cascade in */
            intro.to(
                "#word-alpha .letter-char",
                { opacity: 1, y: 0, filter: "blur(0px)", rotationX: 0, duration: 0.75, stagger: { each: 0.085, ease: "expo.out" }, delay: 0.3 }
            );

            /* ② SCIENCE letters follow */
            intro.to(
                "#word-science .letter-char",
                { opacity: 1, y: 0, filter: "blur(0px)", rotationX: 0, duration: 0.75, stagger: { each: 0.07, ease: "expo.out" } },
                "-=0.2"
            );

            /* ③ LAB lands last */
            intro.to(
                "#word-lab .letter-char",
                { opacity: 1, y: 0, filter: "blur(0px)", rotationX: 0, duration: 0.75, stagger: { each: 0.11, ease: "expo.out" } },
                "-=0.25"
            );

            /* ④ When LAB is done, reveal subtext CLEAN for the first load */
            intro.to([".kicker-char", ".belief-char"], {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: { each: 0.05, ease: "expo.out" },
                ease: "expo.out",
            }, "+=0.15");

            /* ⑤ Strip and buttons ease in last */
            intro.to(".hero-strip", { opacity: 1, duration: 0.65 }, "-=0.2");
            intro.to(".hero-btns", { opacity: 1, duration: 0.65 }, "-=0.4");

            /* Animation plays once and holds final position */
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
                {/* ① Kicker — letter-by-letter from left */}
                <p
                    className="hero-kicker font-accent text-white/75 leading-none ml-6"
                    style={{
                        fontSize: "clamp(14px, 3.2vw, 60px)",
                        lineHeight: 0.9,
                        letterSpacing: "0.02em",
                        marginBottom: "clamp(6px, 1.2vh, 24px)",
                        textTransform: "uppercase",
                        paddingLeft: "clamp(6px, 1vw, 48px)",
                        overflow: "hidden",
                    }}
                >
                    <SplitText text="CREATIVITY STARTS" className="kicker-char" useSmallCaps />
                </p>

                {/* ② Headline block */}
                <div className="flex flex-col items-start w-full" style={{ gap: 0, marginBottom: "clamp(14px, 2vh, 32px)" }}>

                    {/* Row 1: ALPHA + FROM BELIEF */}
                    <div className="flex flex-wrap items-end justify-start" style={{ gap: "clamp(6px, 1.5vw, 48px)" }}>
                        <h1
                            id="word-alpha"
                            className="title-word font-display uppercase text-white m-0 p-0"
                            style={{
                                fontSize: "clamp(44px, 10vw, 158px)",
                                lineHeight: 0.82,
                                letterSpacing: "-0.01em",
                                perspective: "600px",
                            }}
                        >
                            <SplitText text="ALPHA" />
                        </h1>
                        <span
                            id="hero-from-belief"
                            className="font-accent text-white/80"
                            style={{
                                fontSize: "clamp(14px, 3.2vw, 60px)",
                                lineHeight: 0.9,
                                paddingBottom: "clamp(4px, 0.6vw, 14px)",
                                textTransform: "uppercase",
                                overflow: "hidden",
                            }}
                        >
                            <SplitText text="FROM BELIEF" className="belief-char" useSmallCaps />
                        </span>
                    </div>

                    {/* Row 2: SCIENCE LAB — split into two words for independent stagger */}
                    <div className="flex flex-wrap items-end justify-start" style={{ gap: "clamp(10px, 2vw, 52px)" }}>
                        <h1
                            id="word-science"
                            className="title-word font-display uppercase text-white m-0 p-0"
                            style={{
                                fontSize: "clamp(44px, 10vw, 158px)",
                                lineHeight: 0.82,
                                letterSpacing: "-0.01em",
                                perspective: "600px",
                            }}
                        >
                            <SplitText text="SCIENCE" />
                        </h1>
                        <h1
                            id="word-lab"
                            className="title-word font-display uppercase text-white m-0 p-0"
                            style={{
                                fontSize: "clamp(44px, 10vw, 158px)",
                                lineHeight: 0.82,
                                letterSpacing: "-0.01em",
                                perspective: "600px",
                            }}
                        >
                            <SplitText text="LAB" />
                        </h1>
                    </div>
                </div>

                {/* ③ Subtitle strip — full-width bleed with dual-gradient Figma shading */}
                <div
                    className="hero-strip subtitle-strip relative flex items-center justify-center w-screen overflow-hidden"
                    style={{
                        marginTop: "clamp(24px, 4vh, 80px)",
                        marginBottom: "clamp(24px, 4vh, 80px)",
                        marginLeft: "50%",
                        transform: "translateX(-50%)",
                        padding: "clamp(14px, 2vh, 28px) 0",
                        background: "#000000",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {/* Background Part 1: Left segment (Black in center, Maroon on left) */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1/2"
                        style={{ background: "linear-gradient(270deg, #000000 0%, rgba(61, 16, 34, 0.7) 100%)" }}
                    />

                    {/* Background Part 2: Right segment (Black in center, Purple on right) */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-1/2"
                        style={{ background: "linear-gradient(90deg, #000000 0%, rgba(150, 46, 155, 0.7) 100%)" }}
                    />

                    {/* Content */}
                    <p
                        className="relative z-20 font-tech text-center m-0"
                        style={{
                            fontSize: "clamp(14px, 1.8vw, 32px)",
                            lineHeight: 0.73,
                            fontWeight: 400,
                            letterSpacing: "-0.06em",
                            color: "#e4e4e7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Innovating in VLSI, Robotics, Software, and Design
                    </p>
                </div>

                {/* ④ CTA Buttons */}
                <div
                    className="hero-btns relative flex items-center justify-center flex-wrap w-full"
                    style={{
                        gap: "clamp(12px, 2.5vw, 40px)",
                        marginTop: "clamp(20px, 4vh, 60px)",
                        minHeight: "120px", // Reserve space to avoid layout shift
                    }}
                >
                    <button
                        id="hero-explore-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white flex items-center justify-center p-0 relative z-40"
                        onMouseEnter={() => !isMobile && handleInteraction("projects")}
                        onMouseLeave={() => !isMobile && handleInteraction(null)}
                        onClick={() => isMobile && handleInteraction(activeGrid === "projects" ? null : "projects")}
                        style={{
                            width: "clamp(180px, 28vw, 420px)",
                            height: "clamp(48px, 5.2vw, 84px)",
                            borderRadius: "50px",
                            fontSize: "clamp(14px, 2vw, 35.84px)",
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: "0em",
                            textAlign: "center",
                        }}
                    >
                        Explore projects
                    </button>
                    <button
                        id="hero-team-btn"
                        className="hero-btn glass-btn font-sans font-semibold text-white flex items-center justify-center p-0 relative z-40"
                        onMouseEnter={() => !isMobile && handleInteraction("team")}
                        onMouseLeave={() => !isMobile && handleInteraction(null)}
                        onClick={() => isMobile && handleInteraction(activeGrid === "team" ? null : "team")}
                        style={{
                            width: "clamp(180px, 28vw, 420px)",
                            height: "clamp(48px, 5.2vw, 84px)",
                            borderRadius: "50px",
                            fontSize: "clamp(14px, 2vw, 35.84px)",
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: "0em",
                            textAlign: "center",
                        }}
                    >
                        Meet the team
                    </button>

                    {/* Popover Grid: CATEGORIES */}
                    <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[90vw] md:max-w-[1200px] mt-8 bg-black z-50 overflow-hidden transition-all duration-500 pointer-events-none ${activeGrid ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-4 scale-95"}`}
                        style={{
                            border: "1px solid rgba(150, 46, 155, 0.4)",
                            boxShadow: "0 0 60px rgba(150, 46, 155, 0.2)",
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {(activeGrid === "projects" ? PROJECT_CATEGORIES : TEAM_CATEGORIES).map((cat, i) => (
                                <div
                                    key={i}
                                    className="p-8 flex items-center justify-center text-center font-tech text-white/90 cursor-pointer hover:bg-white/5 transition-colors border-[0.5px] border-[#962E9B]/30"
                                    style={{
                                        fontSize: "clamp(12px, 1.4vw, 24px)",
                                        minHeight: "100px",
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile 'Click Outside' Overlay */}
                {isMobile && activeGrid && (
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => handleInteraction(null)}
                    />
                )}
            </div>
        </section>
    );
}
