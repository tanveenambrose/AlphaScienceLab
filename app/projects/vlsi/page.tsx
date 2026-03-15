"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function VLSIPage() {
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
                        VLSI and Semiconductor
                    </h1>
                    <p className="font-tech text-white text-[16.2px] font-normal tracking-[0.05em]">
                        Featured by Alpha Science Lab
                    </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px border-b border-solid border-[#962E9B]/70 mb-[25px] relative"></div>

                {/* Content Block 1 (Image Top/Left, Text Bottom/Right) */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 lg:gap-[58px] w-full mb-[80px]">
                    {/* Image Left */}
                    <div className="w-full md:w-[701px] h-[467px] max-w-full relative rounded-[5px] overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)] shrink-0">
                        <Image 
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600"
                            alt="Semiconductor Microchip"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    {/* Text Right */}
                    <div className="flex-1 flex flex-col items-end w-full pt-2">
                        <div className="relative mb-4 inline-block">
                            <div className="absolute inset-0 bg-[#A200FF] blur-[30px] opacity-50 rounded-full z-0"></div>
                            <h2 className="font-accent text-[44.25px] uppercase font-normal leading-tight relative text-white drop-shadow-[0_0_15px_rgba(162,0,255,1)] z-10 text-right">
                                PRESIDENT OF SALES
                            </h2>
                        </div>
                        <p className="text-white/80 font-tech text-[18px] leading-[139%] text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                {/* Content Block 2 (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 lg:gap-[58px] w-full mb-[40px]">
                    {/* Text Left */}
                    <div className="flex-1 flex flex-col items-start w-full order-2 md:order-1 pt-2">
                        {/* Title with Magenta Glow matching Figma */}
                        <div className="relative mb-4 inline-block">
                            {/* Fuchsia/Pink Glow from Figma */}
                            <div className="absolute inset-0 bg-[#FF00FF] blur-[30px] opacity-40 rounded-full z-0"></div>
                            <h2 
                                className="font-accent text-[44.25px] uppercase font-normal leading-tight relative text-white drop-shadow-[0_0_15px_rgba(255,0,255,1)] z-10"
                            >
                                MEDICAL ASSISTANT
                            </h2>
                        </div>
                        <p className="text-white font-tech text-[18px] leading-[139%] text-justify relative z-10 pr-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    {/* Image Right */}
                    <div className="w-full md:w-[701px] h-[467px] max-w-full relative rounded-[5px] overflow-hidden shadow-[0_0_40px_rgba(255,0,255,0.1)] shrink-0 order-1 md:order-2">
                        <Image 
                            src="https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1600"
                            alt="Medical Assistant AI Processor"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Next Page Navigation */}
                <div className="w-full flex justify-end mt-4">
                    <a href="#" className="font-tech text-white text-[14px] opacity-70 hover:opacity-100 hover:text-[#962E9B] transition-all flex items-center gap-2 pr-4">
                        Next page <span className="text-[16px]">&rarr;</span>
                    </a>
                </div>

            </div>
            
            <Footer />
        </main>
    );
}
