"use client";

import { useState, useEffect } from "react";

const EVENT_DATE = new Date("2026-12-01T00:00:00");

function useCountdown(target: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) return;
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [target]);

    return timeLeft;
}

export default function Events() {
    const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <section id="events" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
            <div className="glass-panel rounded-xl overflow-hidden relative min-h-[614px] flex flex-col justify-end p-8 md:p-16 neon-glow-primary">
                {/* Background image */}
                <div
                    className="absolute inset-0 opacity-30 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuARXI7-0vOz0UPC4vjQU42AN0RUCQuExw6zFgJhveSLZiNMuKA7x3l9chaMesuPpV1086DR77vdAQOuqY4Iim_dj68znuJdJuP2MZaxwcLxxtLkWg0FI0cS_TDrrIW7QD_PnZyUxjaknecWeop4PHnl3VS1R4DsgfGwYSU7UQQubOhMkGwVrQjrnt0gz3t8lxA4PgvSTy9sRbMpp-XRpgk4WrVjuERSmvKCWV5Rynr_2GRbnBlfMPimwP6Sf3KPj2EotdtWc_Nth_M')",
                    }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
                {/* Content */}
                <div className="relative z-20 max-w-3xl">
                    <span className="inline-block bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                        Flagship Event
                    </span>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4 text-gradient">
                        BLUEPRINT 2026
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                        The annual CAD and structural design competition. Push the boundaries of aerospace engineering and advanced robotics design.
                    </p>
                    {/* Countdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="glass-panel p-4 rounded-lg text-center">
                            <div className="font-display-md text-display-md text-secondary">{pad(days)}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days</div>
                        </div>
                        <div className="glass-panel p-4 rounded-lg text-center">
                            <div className="font-display-md text-display-md text-secondary">{pad(hours)}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hours</div>
                        </div>
                        <div className="glass-panel p-4 rounded-lg text-center">
                            <div className="font-display-md text-display-md text-secondary">{pad(minutes)}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Mins</div>
                        </div>
                        <div className="glass-panel p-4 rounded-lg text-center">
                            <div className="font-display-md text-display-md text-secondary">{pad(seconds)}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Secs</div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button className="bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest px-8 py-3 rounded-full hover:shadow-[0_0_15px_rgba(221,183,255,0.5)] transition-all cursor-pointer">
                            Register Now
                        </button>
                        <button className="bg-transparent border border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-widest px-8 py-3 rounded-full hover:bg-secondary/10 transition-all cursor-pointer">
                            View Rules
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
