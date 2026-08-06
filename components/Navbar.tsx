"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Settings, Shield, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useAuth } from "@/lib/authContext";
import ProfileModal from "@/components/ProfileModal";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Archive", href: "/archive" },
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
    { name: "Timeline", href: "/timeline" },
    { name: "Team", href: "#team" },
    { name: "About", href: "/about" },
    { name: "Join ASL", href: "/join" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // User profile dropdown & modal state
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAvatarError(false);
    }, [user?.avatarUrl]);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (typeof document !== "undefined") {
            if (nextDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    };

    const isHome = pathname === "/";

    const isLinkActive = (linkName: string, href: string) => {
        if (linkName === "Home" && pathname === "/") return true;
        if (linkName === "Projects" && pathname.startsWith("/projects")) return true;
        if (href && href.startsWith("/") && pathname.startsWith(href)) return true;
        return false;
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        onScroll();
        checkMobile();

        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", checkMobile);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", checkMobile);
            document.removeEventListener("mousedown", handleClickOutside);
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
        <>
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
                                style={{ objectFit: "contain", width: "auto", height: "auto" }}
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
                                {link.name === "Join ASL" ? (
                                    !user && <Link
                                        href={link.href}
                                        className="bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest px-6 py-2 rounded-full hover:shadow-[0_0_15px_rgba(221,183,255,0.5)] transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                ) : !link.dropdown ? (
                                    <Link
                                        href={link.href}
                                        className={clsx(
                                            "font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95",
                                            isLinkActive(link.name, link.href)
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
                                            activeDropdown === link.name || isLinkActive(link.name, link.href)
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

                    {/* Right side: Theme toggle + Profile Avatar OR Login Button */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-surface/40 backdrop-blur-md text-primary hover:text-secondary hover:border-secondary/50 hover:shadow-[0_0_10px_rgba(76,215,246,0.3)] transition-all duration-300 active:scale-95"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-secondary" />}
                        </button>

                        {user ? (
                            /* Logged-in Circular Profile Avatar Dropdown */
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="relative w-10 h-10 rounded-full border-2 border-[#EC0D6E]/50 bg-[#EC0D6E]/20 hover:border-[#EC0D6E] hover:shadow-[0_0_15px_rgba(236,13,110,0.4)] transition-all flex items-center justify-center overflow-hidden shrink-0 group focus:outline-none"
                                    aria-label="User Profile Menu"
                                >
                                    {!avatarError && user.avatarUrl ? (
                                        <img
                                            key={user.avatarUrl}
                                            src={user.avatarUrl}
                                            alt={user.name || "User Profile"}
                                            className="w-full h-full object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-white uppercase">
                                            {user.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
                                        </span>
                                    )}
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full z-10" />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-[#0d0414]/95 border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(236,13,110,0.2)] p-2 z-[110]">
                                        {/* User Header */}
                                        <div className="p-3 border-b border-white/10 flex items-center gap-3">
                                            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#EC0D6E]/40 bg-[#EC0D6E]/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                {!avatarError && user.avatarUrl ? (
                                                    <img
                                                        key={user.avatarUrl}
                                                        src={user.avatarUrl}
                                                        alt={user.name || "User Profile"}
                                                        className="w-full h-full object-cover"
                                                        onError={() => setAvatarError(true)}
                                                    />
                                                ) : (
                                                    user.name ? user.name.slice(0, 2).toUpperCase() : "AS"
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                                                <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Options: Profile and Sign Out */}
                                        <div className="py-1 space-y-0.5">
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    setIsProfileModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                                            >
                                                <Settings size={15} className="text-[#EC0D6E]" />
                                                Profile Settings
                                            </button>

                                            {(user.role === "admin" || user.role === "media" || user.role === "main") && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-500/10 transition-colors text-left"
                                                >
                                                    <Shield size={15} className="text-purple-400" />
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                            >
                                                <LogOut size={15} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Login Button when user is not logged in */
                            <Link
                                href="/login"
                                className="hidden md:inline-block border border-primary/30 text-primary font-label-sm text-label-sm uppercase tracking-widest px-6 py-2 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all"
                            >
                                Login
                            </Link>
                        )}

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
                        {user && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full bg-[#EC0D6E]/20 border border-[#EC0D6E]/40 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0">
                                        {!avatarError && user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.name || "User Profile"}
                                                className="w-full h-full object-cover"
                                                onError={() => setAvatarError(true)}
                                            />
                                        ) : (
                                            user.name ? user.name.slice(0, 2).toUpperCase() : "AS"
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{user.name}</h4>
                                        <p className="text-xs text-zinc-400">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsProfileModalOpen(true);
                                    }}
                                    className="p-2 rounded-xl bg-white/5 text-zinc-300"
                                >
                                    <Settings size={18} />
                                </button>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <div key={link.name} className="flex flex-col items-center w-full">
                                {link.name === "Join ASL" ? (
                                    !user && <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest px-8 py-3 rounded-full hover:shadow-[0_0_15px_rgba(221,183,255,0.5)] transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {user ? (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="border border-red-500/30 text-red-400 font-label-sm text-label-sm uppercase tracking-widest px-10 py-3 rounded-full hover:bg-red-500/10 transition-all mt-4"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="border border-primary/30 text-primary font-label-sm text-label-sm uppercase tracking-widest px-10 py-3 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all mt-4"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>
    );
}
