import Image from "next/image";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full relative z-10 bg-[#080309] border-t border-white/5 py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                
                {/* Main Content Grid row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-14 md:gap-0 mt-8 mb-20 w-full">
                    
                    {/* Left: Logo & Title */}
                    <div className="flex flex-col items-center md:items-start md:flex-1">
                        <div className="relative w-[110px] h-[60px] mb-3">
                            <Image
                                src="/assests/asl.png"
                                alt="ASL Logo"
                                fill
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        <span className="font-tech text-white text-[15px] font-bold tracking-[0.1em] whitespace-nowrap">
                            ALPHA SCIENCE LAB
                        </span>
                    </div>

                    {/* Center: Social Icons */}
                    <div className="flex justify-center items-center gap-5 md:flex-1">
                        {[
                            { Icon: Instagram, href: "#", label: "Instagram" },
                            { Icon: Facebook, href: "https://www.facebook.com/Alpha.Science.Lab", label: "Facebook" },
                            { Icon: Linkedin, href: "https://www.linkedin.com/company/alpha-science-lab", label: "LinkedIn" },
                            { Icon: Twitter, href: "#", label: "Twitter" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                target={social.href !== "#" ? "_blank" : undefined}
                                rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                                aria-label={social.label}
                                className="w-9 h-9 flex items-center justify-center text-white hover:text-primary transition-colors"
                            >
                                <social.Icon className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                        ))}
                    </div>

                    {/* Right: Newsletter */}
                    <div className="flex flex-col items-center md:items-end w-full max-w-xs md:flex-1">
                        <div className="w-full flex flex-col items-center md:items-start">
                            <label className="block text-white text-[14px] font-semibold mb-3 tracking-wide text-center md:text-left">
                                Stay Updated
                            </label>
                            <div className="w-full flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="Write mail here"
                                    className="w-full rounded-full px-5 py-3.5 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/40 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                />
                                <div className="flex justify-end w-full">
                                   <button className="rounded-full px-6 py-1.5 bg-black border border-white text-white text-[10px] font-semibold tracking-wider hover:bg-white/10 hover:border-white transition-colors cursor-pointer mr-2">
                                       Submit
                                   </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="flex justify-center items-center">
                    <p className="text-white text-[12px] tracking-[0.05em] text-center uppercase font-medium">
                        COPYRIGHT: © 2024 ALPHA SCIENCE LAB.
                    </p>
                </div>
            </div>
        </footer>
    );
}
