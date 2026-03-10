"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const navLinks = [
    { name: "Home", href: "/" },
    {
        name: "Projects",
        href: "#projects",
        dropdown: [
            "VLSI and Semiconductor", "Hardware, PCB & Embedded Systems",
            "Robotics & Automation", "Software & Web Development",
            "Structural Analysis", "2D and 3D Design",
            "Research, Innovation & Documentation", "Others"
        ]
    },
    {
        name: "About",
        href: "#about",
        dropdown: [
            "Members", "Executives",
            "Alumni", "Photo Gallery"
        ]
    },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        onScroll();
        checkMobile();

        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const handleLinkClick = (link: any) => {
        if (isMobile && link.dropdown) {
            setActiveDropdown(activeDropdown === link.name ? null : link.name);
        } else if (!link.dropdown) {
            setIsOpen(false);
        }
    };

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
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

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
                        <li
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => !isMobile && setActiveDropdown(link.name)}
                            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                        >
                            <button
                                onClick={() => isMobile && handleLinkClick(link)}
                                className={clsx(
                                    "relative py-2 text-[15px] font-semibold tracking-wide flex items-center gap-1 transition-colors duration-200",
                                    activeDropdown === link.name ? "text-white" : "text-white/70 hover:text-white"
                                )}
                            >
                                {link.name}
                                {link.dropdown && (
                                    <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                                )}

                                {/* Underline */}
                                {link.name === "Home" ? (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary" />
                                ) : (
                                    <span className={clsx(
                                        "absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-white/40 transition-transform duration-200 origin-left",
                                        activeDropdown === link.name ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    )} />
                                )}
                            </button>

                            {/* Dropdown Desktop */}
                            {link.dropdown && (
                                <div className={clsx(
                                    "absolute top-full left-1/2 -translate-x-1/2 mt-4 transition-all duration-300 pointer-events-none",
                                    activeDropdown === link.name ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-2"
                                )}>
                                    <div className="bg-[#050505]/95 backdrop-blur-2xl border border-primary/40 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(150,46,155,0.2)] w-[360px]">
                                        <div className="grid grid-cols-2">
                                            {link.dropdown.map((item, i) => (
                                                <Link
                                                    key={item}
                                                    href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                                    className={clsx(
                                                        "px-4 py-8 flex items-center justify-center text-center text-[12px] font-black uppercase tracking-widest text-white hover:bg-primary/10 transition-colors min-h-[100px]",
                                                        "border-primary/30",
                                                        i % 2 === 0 ? "border-r" : "",
                                                        i >= 2 ? "border-t" : ""
                                                    )}
                                                >
                                                    {item}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                    className="md:hidden text-white focus:outline-none z-[101]"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            <div
                className={clsx(
                    "fixed inset-0 top-0 flex flex-col items-center justify-center gap-6 transition-transform duration-500 md:hidden z-[99]",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{
                    background: "rgba(0,0,0,0.98)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <div className="flex flex-col items-center gap-6 w-full max-h-[80vh] overflow-y-auto px-6">
                    {navLinks.map((link) => (
                        <div key={link.name} className="flex flex-col items-center w-full">
                            <div
                                className="flex items-center gap-3 text-3xl font-display font-black uppercase text-white tracking-tighter hover:text-white/70 transition-colors cursor-pointer"
                                onClick={() => link.dropdown ? setActiveDropdown(activeDropdown === link.name ? null : link.name) : (setIsOpen(false), window.location.href = link.href)}
                            >
                                <span>{link.name}</span>
                                {link.dropdown && (
                                    <ChevronDown className={clsx("w-6 h-6 transition-transform", activeDropdown === link.name && "rotate-180")} />
                                )}
                            </div>

                            {link.dropdown && activeDropdown === link.name && (
                                <div className="grid grid-cols-1 w-full mt-4 bg-white/5 border border-white/10 rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                    {link.dropdown.map(sub => (
                                        <Link
                                            key={sub}
                                            href="#"
                                            onClick={() => setIsOpen(false)}
                                            className="px-6 py-4 text-center text-sm font-bold text-white/80 border-b border-white/5 hover:bg-white/10"
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

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
