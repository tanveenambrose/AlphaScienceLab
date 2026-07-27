"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Research & Domains", href: "#research" },
    {
        name: "Projects",
        href: "#projects",
        dropdown: [
            "VLSI and Semiconductor", "Hardware, PCB & Embedded Systems",
            "Robotics & Automation", "Software & Web Development",
            "Structural Analysis", "2D and 3D Design",
            "Research, Innovation & Documentation", "All Projects"
        ]
    },
    { name: "Events", href: "/events" },
    { name: "Team", href: "#team" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const isHome = pathname === "/";

    const isLinkActive = (linkName: string) => {
        if (linkName === "Home" && pathname === "/") return true;
        if (linkName === "Projects" && pathname.startsWith("/projects")) return true;
        return false;
    };

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

    const handleLinkClick = (link: { name: string; href: string; dropdown?: string[] | undefined }) => {
        if (isMobile && link.dropdown) {
            setActiveDropdown(activeDropdown === link.name ? null : link.name);
        } else if (!link.dropdown) {
            setIsOpen(false);
        }
    };

    return (
        <nav
            className={clsx(
                "fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-container-max rounded-full border z-[100] transition-all duration-500",
                isHome && !scrolled
                    ? "border-transparent bg-transparent backdrop-blur-none shadow-none"
                    : "border-primary/20 bg-surface/80 backdrop-blur-xl shadow-[0_0_20px_rgba(221,183,255,0.1)]"
            )}
        >
            <div className="flex justify-between items-center px-4 md:px-8 py-2 md:py-3 w-full">
                {/* Logo */}
                <Link href="/" className="shrink-0">
                    {!logoError && (
                        <Image
                            src="/assests/asl.png"
                            alt="ASL Logo"
                            width={90}
                            height={40}
                            priority
                            style={{ objectFit: "contain" }}
                            onError={() => setLogoError(true)}
                        />
                    )}
                </Link>

                {/* Desktop Nav Links */}
                <ul className="hidden md:flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <li
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => !isMobile && setActiveDropdown(link.name)}
                            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
                        >
                                {!link.dropdown ? (
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        "font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95",
                                        isLinkActive(link.name)
                                            ? "text-primary font-bold border-b border-primary/50"
                                            : "text-on-surface-variant hover:text-secondary"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => isMobile && handleLinkClick(link)}
                                    className={clsx(
                                        "font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95",
                                        activeDropdown === link.name || isLinkActive(link.name)
                                            ? "text-primary font-bold border-b border-primary/50"
                                            : "text-on-surface-variant hover:text-secondary"
                                    )}
                                >
                                    <span className="flex items-center gap-1">
                                        {link.name}
                                        <ChevronDown className={clsx("w-3 h-3 transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                                    </span>
                                </button>
                            )}

                            {/* Dropdown Desktop */}
                            {link.dropdown && (
                                <div className={clsx(
                                    "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 pointer-events-none",
                                    activeDropdown === link.name ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-2"
                                )}>
                                    <div className="bg-surface-container/95 backdrop-blur-2xl border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(221,183,255,0.15)] w-[360px]">
                                        <div className="grid grid-cols-2">
                                            {link.dropdown.map((item, i) => {
                                                let targetUrl = "";
                                                if (item === "VLSI and Semiconductor") targetUrl = "/projects/vlsi";
                                                else if (item === "Hardware, PCB & Embedded Systems") targetUrl = "/projects/hardware";
                                                else if (item === "Robotics & Automation") targetUrl = "/projects/robotics";
                                                else if (item === "Software & Web Development") targetUrl = "/projects/software";
                                                else if (item === "Structural Analysis") targetUrl = "/projects/structural";
                                                else if (item === "2D and 3D Design") targetUrl = "/projects/design";
                                                else if (item === "Research, Innovation & Documentation") targetUrl = "/projects/research";
                                                else if (item === "All Projects") targetUrl = "/projects/all";
                                                else targetUrl = `/#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;

                                                return (
                                                    <Link
                                                        key={item}
                                                        href={targetUrl}
                                                        className={clsx(
                                                            "px-4 py-6 flex items-center justify-center text-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest/50 transition-colors",
                                                            i % 2 === 0 ? "border-r border-primary/10" : "",
                                                            i >= 2 ? "border-t border-primary/10" : ""
                                                        )}
                                                    >
                                                        {item}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right side: theme toggle + Join ASL */}
                <div className="flex items-center gap-3">
                    <button
                        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-surface/40 backdrop-blur-md text-primary hover:text-secondary hover:border-secondary/50 hover:shadow-[0_0_10px_rgba(76,215,246,0.3)] transition-all duration-300 active:scale-95"
                        aria-label="Toggle Theme"
                    >
                        <span className="material-symbols-outlined text-[20px]">light_mode</span>
                    </button>
                    <button
                        id="nav-join-btn"
                        onClick={() => window.location.href = '/join'}
                        className="hidden md:block bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest px-6 py-2 rounded-full hover:shadow-[0_0_15px_rgba(221,183,255,0.5)] transition-all"
                    >
                        Join ASL
                    </button>
                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-on-surface focus:outline-none z-[101]"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={clsx(
                    "fixed inset-0 top-0 flex flex-col items-center justify-center gap-6 transition-transform duration-500 md:hidden z-[99]",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{
                    background: "rgba(5,20,36,0.98)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <div className="flex flex-col items-center gap-6 w-full max-h-[80vh] overflow-y-auto px-6">
                    {navLinks.map((link) => (
                        <div key={link.name} className="flex flex-col items-center w-full">
                            <div
                                className="flex items-center gap-3 text-2xl font-headline-lg text-primary tracking-tighter hover:text-secondary transition-colors cursor-pointer"
                                onClick={() => link.dropdown ? setActiveDropdown(activeDropdown === link.name ? null : link.name) : (setIsOpen(false), window.location.href = link.href)}
                            >
                                <span>{link.name}</span>
                                {link.dropdown && (
                                    <ChevronDown className={clsx("w-5 h-5 transition-transform", activeDropdown === link.name && "rotate-180")} />
                                )}
                            </div>

                            {link.dropdown && activeDropdown === link.name && (
                                <div className="grid grid-cols-1 w-full mt-4 bg-surface-container/80 border border-primary/20 rounded-xl overflow-hidden">
                                    {link.dropdown.map(sub => {
                                        let targetUrl = "";
                                        if (sub === "VLSI and Semiconductor") targetUrl = "/projects/vlsi";
                                        else if (sub === "Hardware, PCB & Embedded Systems") targetUrl = "/projects/hardware";
                                        else if (sub === "Robotics & Automation") targetUrl = "/projects/robotics";
                                        else if (sub === "Software & Web Development") targetUrl = "/projects/software";
                                        else if (sub === "Structural Analysis") targetUrl = "/projects/structural";
                                        else if (sub === "2D and 3D Design") targetUrl = "/projects/design";
                                        else if (sub === "Research, Innovation & Documentation") targetUrl = "/projects/research";
                                        else if (sub === "All Projects") targetUrl = "/projects/all";
                                        else targetUrl = `/#${sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;

                                        return (
                                            <Link
                                                key={sub}
                                                href={targetUrl}
                                                onClick={() => setIsOpen(false)}
                                                className="px-6 py-4 text-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-primary/10 hover:bg-surface-container-highest/50 hover:text-secondary"
                                            >
                                                {sub}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    id="mobile-join-btn"
                    onClick={() => window.location.href = '/join'}
                    className="bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest px-10 py-3 rounded-full hover:shadow-[0_0_15px_rgba(221,183,255,0.5)] transition-all mt-4"
                >
                    Join ASL
                </button>
            </div>
        </nav>
    );
}
