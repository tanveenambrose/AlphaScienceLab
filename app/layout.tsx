import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Preloader from "@/components/Preloader";
import { PreloaderProvider } from "@/components/PreloaderContext";
import GridWaveBg from "@/components/GridWaveBg";

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta-sans",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AlphaScienceLab | Creativity Starts From Belief",
    description: "Advanced Research, Experimental Automation, and Scientific Discoveries.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                />
            </head>
<body
                className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${geist.variable} antialiased min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <PreloaderProvider>
                    <Preloader />
                    <SmoothScrollProvider>
                        <div className="relative z-10">
                            {children}
                        </div>
                    </SmoothScrollProvider>
                </PreloaderProvider>
                <GridWaveBg className="fixed inset-0 z-[60]" />
            </body>
        </html>
    );
}
