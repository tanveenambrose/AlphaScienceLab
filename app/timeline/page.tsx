"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TimelineFeed from "@/components/TimelineFeed";
import GridWaveBg from "@/components/GridWaveBg";
import BackgroundGlow from "@/components/BackgroundGlow";

export default function TimelinePage() {
    return (
        <main className="min-h-screen flex flex-col relative bg-background text-on-surface">
            {/* Interactive Grid Wave & Background Glows matching About Section */}
            <GridWaveBg className="fixed inset-0 z-0 opacity-40 pointer-events-none" />
            <BackgroundGlow />

            {/* Navbar */}
            <Navbar />

            {/* Main Timeline Content */}
            <div className="flex-1 relative z-10 pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
                <TimelineFeed />
            </div>

            {/* Footer */}
            <Footer />
        </main>
    );
}
