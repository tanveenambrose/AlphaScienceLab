import { Twitter, Github, Linkedin, MessageSquare } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-16 sm:py-20 lg:py-24 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-14 sm:mb-24 gap-10 sm:gap-12">

                    {/* Brand + socials */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6 sm:mb-8">
                            <span className="text-2xl sm:text-3xl font-black font-display tracking-tighter uppercase">
                                ASL
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 sm:mb-8">
                            Advanced Research, Experimental Automation, and Scientific Discoveries.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                            {[Twitter, Github, Linkedin, MessageSquare].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="p-3 sm:p-4 bg-[#1E1E1E] rounded-full border border-white/5 hover:border-[#7F3DFF]/50 transition-all text-slate-400 hover:text-[#7F3DFF]"
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav links grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-16 w-full md:w-auto">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-5 sm:mb-8">Navigation</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {["Home", "Projects", "About", "Team"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-5 sm:mb-8">Legal</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {["Privacy", "Terms", "Ethics"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-5 sm:mb-8">Stay Updated</h4>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-[#1E1E1E] border border-white/5 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-sm font-medium focus:outline-none focus:border-[#7F3DFF]/50 transition-all pr-20 sm:pr-24"
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-[#7F3DFF] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 sm:pt-12 border-t border-white/5 gap-4">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] text-center sm:text-left">
                        © {new Date().getFullYear()} Alpha Science Lab. All rights reserved.
                    </p>
                    <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                        Crafted with precision
                    </p>
                </div>
            </div>
        </footer>
    );
}
