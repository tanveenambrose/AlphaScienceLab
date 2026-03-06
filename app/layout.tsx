import type { Metadata } from "next";
import { Inter, Bakbak_One, Anton, Aldrich } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import IceEdgeGlow from "@/components/IceEdgeGlow";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bakbak = Bakbak_One({
  weight: "400",
  variable: "--font-bakbak",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const aldrich = Aldrich({
  weight: "400",
  variable: "--font-aldrich",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bakbak.variable} ${anton.variable} ${aldrich.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        {/* Global animated RGB background — fixed, sits behind all content */}
        <AnimatedBackground />
        {/* Ice edge glow — layered above bg, below content */}
        <IceEdgeGlow />
        <SmoothScrollProvider>
          <div className="relative z-10">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
