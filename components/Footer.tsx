import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-surface-container-lowest/80 backdrop-blur-md w-full border-t border-outline-variant/20">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md mb-stack-lg">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Image
                            src="/assests/asl.png"
                            alt="ASL Logo"
                            width={90}
                            height={40}
                            style={{ objectFit: "contain" }}
                        />
                        <p className="font-body-md text-body-md text-on-surface-variant">Creativity Starts From Belief</p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Quick Links</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/about" className="text-on-surface-variant hover:text-secondary transition-colors">About</Link>
                            <Link href="/#projects" className="text-on-surface-variant hover:text-secondary transition-colors">Courses</Link>
                            <Link href="/events" className="text-on-surface-variant hover:text-secondary transition-colors">Events</Link>
                            <Link href="/archive" className="text-on-surface-variant hover:text-secondary transition-colors">Archive</Link>
                            <Link href="/join" className="text-on-surface-variant hover:text-secondary transition-colors">Contact</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Contact</h4>
                        <div className="text-on-surface-variant text-body-md flex flex-col gap-2">
                            <p>Mymensingh Engineering College</p>
                            <p>Mymensingh, Bangladesh</p>
                            <p>Email: contact@asl.mec.ac.bd</p>
                        </div>
                    </div>

                    {/* Follow Us */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
                                <span className="material-symbols-outlined">facebook</span>
                            </a>
                            <a href="#" className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
                                <span className="material-symbols-outlined">link</span>
                            </a>
                            <a href="#" className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
                                <span className="material-symbols-outlined">photo_camera</span>
                            </a>
                            <a href="#" className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
                                <span className="material-symbols-outlined">code</span>
                            </a>
                            <a href="#" className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
                                <span className="material-symbols-outlined">play_circle</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body-md text-body-md text-on-surface-variant">© 2026 Alpha Science Lab. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
