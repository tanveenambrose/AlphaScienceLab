"use client";

/**
 * AnimatedBackground
 * Fixed full-screen layer of moving, glowing RGB gradient orbs.
 * Sits behind all content via z-index: 0. All content must use relative z-10+.
 */
export default function AnimatedBackground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0 }}
            suppressHydrationWarning
        >
            {/* ── Orb 1 — purple/magenta (top-right) ─────────── */}
            <div className="rgb-orb rgb-orb-1" />

            {/* ── Orb 2 — deep crimson/maroon (bottom-left) ─── */}
            <div className="rgb-orb rgb-orb-2" />

            {/* ── Orb 3 — electric blue (bottom-right) ────────── */}
            <div className="rgb-orb rgb-orb-3" />

            {/* ── Orb 4 — violet (center-top) ─────────────────── */}
            <div className="rgb-orb rgb-orb-4" />

            {/* ── Orb 5 — teal accent (mid-left) ──────────────── */}
            <div className="rgb-orb rgb-orb-5" />

            {/* ── Dark overlays — keeps it deep and premium ── */}
            {/* Base dark fill */}
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.60)" }} />
            {/* Vignette — darker at edges */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 10%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.92) 100%)",
                }}
            />
        </div>
    );
}
