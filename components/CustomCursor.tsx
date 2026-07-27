"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

const emptySubscribe = () => () => {};
function useIsClient() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mounted = useIsClient();

    useEffect(() => {
        if (!mounted) return;
        const cursor = cursorRef.current;
        if (!cursor) return;

        const xSetter = gsap.quickSetter(cursor, "x", "px");
        const ySetter = gsap.quickSetter(cursor, "y", "px");

        const moveCursor = (e: MouseEvent) => {
            xSetter(e.clientX);
            ySetter(e.clientY);
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
