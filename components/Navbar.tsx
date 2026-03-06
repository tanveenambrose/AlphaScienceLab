"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={clsx(
                "fixed top-0 inset-x-0 z-[100] transition-all duration-300 px-8 py-4",
                scrolled
                    ? "border-b border-white/10 shadow-lg"
                    : "border-b border-white/5"
            )}
            style={{
                background: "rgba(0, 0, 0, 0.40)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo — using your exact image from public/assests/asl.png */}
                <Link href="/" className="shrink-0">
                    {!logoError && (
                        <Image
                            src="/assests/asl.png"
                            alt="ASL Logo"
                            width={90}
                            height={50}
                            priority
                            style={{ objectFit: "contain" }}
                            onError={() => setLogoError(true)}
                        />
                    )}
                </Link>

                {/* Centered desktop links */}
                <ul className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="relative py-2 text-[15px] font-semibold tracking-wide text-white/70 hover:text-white transition-colors duration-200 group"
                            >
                                {link.name}
                                {/* Active underline for Home */}
                                {link.name === "Home" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary" />
                                )}
                                {/* Hover underline for others */}
                                {link.name !== "Home" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Join ASL glass button */}
                <button
                    id="nav-join-btn"
                    className="hidden md:block glass-btn rounded-full px-7 py-2.5 text-[15px] font-semibold text-white tracking-wide"
                >
                    Join ASL
                </button>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            <div
                className={clsx(
                    "fixed inset-0 top-[65px] flex flex-col items-center justify-center gap-10 transition-transform duration-300 md:hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{
                    background: "rgba(0,0,0,0.95)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-4xl font-display font-black uppercase text-white tracking-tighter hover:text-white/70 transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}
                <button
                    id="mobile-join-btn"
                    className="glass-btn rounded-full px-12 py-4 text-xl font-semibold text-white tracking-wide mt-4"
                >
                    Join ASL
                </button>
            </div>
        </nav>
    );
}
