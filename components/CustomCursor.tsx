"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    // Don't render on the server — avoids hydration mismatch from inline style
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const cursor = cursorRef.current;
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button, a, .glass")) {
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: "rgba(56, 189, 248, 0.2)",
                    border: "1px solid rgba(56, 189, 248, 0.5)",
                    duration: 0.3,
                });
            } else {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: "white",
                    border: "none",
                    duration: 0.3,
                });
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleHover);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={cursorRef}
            className="custom-cursor hidden md:block"
            style={{
                left: -10,
                top: -10,
            }}
        />
    );
}
