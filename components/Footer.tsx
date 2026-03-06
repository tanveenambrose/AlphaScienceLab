import { Twitter, Github, Linkedin, MessageSquare } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-24 bg-black border-t border-white/5 relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-3xl font-black font-display tracking-tighter uppercase">
                                ASL
                            </span>
                        </div>

                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, MessageSquare].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="p-4 bg-[#1E1E1E] rounded-full border border-white/5 hover:border-[#7F3DFF]/50 transition-all text-slate-400 hover:text-[#7F3DFF]"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full md:w-auto">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Navigation</h4>
                            <ul className="space-y-4">
                                {["Home", "Projects", "About", "Team"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Legal</h4>
                            <ul className="space-y-4">
                                {["Privacy", "Terms", "Ethics"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Stay Updated</h4>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-[#1E1E1E] border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-[#7F3DFF]/50 transition-all"
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#7F3DFF] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} Alpha Science Lab. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
