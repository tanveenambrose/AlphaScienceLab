"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsGallery from "@/components/ProjectsGallery";

export default function AllPage() {
    return (
        <main className="min-h-screen bg-[#080309] text-white relative overflow-hidden flex flex-col font-inter">
            <Navbar />
            
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[30%] -left-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px]" />
                <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] bg-[#3D1022]/40 rounded-full blur-[150px]" />
            </div>

            <div className="flex-1 flex flex-col px-4 pt-[160px] pb-10 relative z-10 w-full max-w-[1259px] mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-start w-full mb-[21px] relative">
                    <div className="absolute -left-[10%] -top-[100%] w-[500px] h-[500px] bg-[#962E9B]/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                    <h1 className="font-display text-[50px] text-white font-bold tracking-normal leading-none select-none mb-3">
                        All Projects
                    </h1>
                    <p className="font-tech text-white text-[16.2px] font-normal tracking-[0.05em]">
                        Featured by Alpha Science Lab
                    </p>
                </div>

                <div className="w-full h-px border-b border-solid border-[#962E9B]/70 mb-[25px] relative"></div>

                {/* Showcasing all projects via Gallery component */}
                <div className="-mx-4 pb-20">
                    <ProjectsGallery />
                </div>

            </div>
            
            <Footer />
        </main>
    );
}
