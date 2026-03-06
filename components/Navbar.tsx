"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Menu, X } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Projects", href: "#projects" },
        { name: "About", href: "#about" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-10 py-6",
                scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-black font-display tracking-tighter">
                        ASL
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors uppercase"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button className="hidden md:block px-8 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform cursor-pointer">
                    Join ASL
                </button>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div
                className={cn(
                    "fixed inset-0 top-[84px] bg-black p-10 transition-transform md:hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-bold text-white uppercase"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button className="w-full py-5 bg-white text-black rounded-2xl font-bold uppercase">
                        Join ASL
                    </button>
                </div>
            </div>
        </nav>
    );
}
