"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col relative">
            <Navbar />
            <div className="flex-1 relative z-10">
                <AboutContent />
            </div>
            <Footer />
        </main>
    );
}
