import { FlaskConical, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-20 bg-slate-950 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <FlaskConical className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold font-display tracking-tight">
                                Alpha<span className="text-primary">Science</span>Lab
                            </span>
                        </div>
                        <p className="text-slate-400 font-sans leading-relaxed mb-6">
                            Empowering the next generation of scientific innovation with advanced methodologies
                            and cutting-edge lab technology.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-slate-300 hover:text-primary"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full md:w-auto">
                        <div>
                            <h4 className="text-lg font-bold font-display mb-6">Discovery</h4>
                            <ul className="space-y-4">
                                {["Materials", "Bioscience", "Automation", "Energy"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold font-display mb-6">Lab</h4>
                            <ul className="space-y-4">
                                {["Safety", "Protocols", "Equipment", "Testing"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="hidden lg:block">
                            <h4 className="text-lg font-bold font-display mb-6">Legal</h4>
                            <ul className="space-y-4">
                                {["Privacy", "Terms", "Ethics", "Compliance"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} AlphaScienceLab. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-white text-sm">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white text-sm">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
