"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsHero from "@/components/Events";

export default function EventsPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 pt-32 pb-margin-desktop">
                <EventsHero />
            </div>
            <Footer />
        </main>
    );
}
