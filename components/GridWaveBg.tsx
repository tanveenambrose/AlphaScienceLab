"use client";

import { useRef, useEffect } from "react";

interface Props {
    className?: string;
}

export default function GridWaveBg({ className = "" }: Props) {
    const filterId = "globalGridWave";
    const dispRef = useRef<SVGFEDisplacementMapElement>(null);
    const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onMouseMove = () => {
            if (dispRef.current) {
                dispRef.current.setAttribute("scale", "35");
            }
            if (decayRef.current) clearTimeout(decayRef.current);
            decayRef.current = setTimeout(() => {
                if (dispRef.current) {
                    dispRef.current.setAttribute("scale", "12");
                }
            }, 600);
        };
        document.addEventListener("mousemove", onMouseMove);
        return () => document.removeEventListener("mousemove", onMouseMove);
    }, []);

    return (
        <>
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <filter id={filterId}>
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
                className={`grid-bg pointer-events-none ${className}`}
                style={{ filter: `url(#${filterId})` }}
            />
        </>
    );
}
