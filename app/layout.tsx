import type { Metadata } from "next";
import { Inter, Bakbak_One, Anton, Aldrich } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

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
    <html lang="en">
      <body
        className={`${inter.variable} ${bakbak.variable} ${anton.variable} ${aldrich.variable} antialiased bg-black text-white`}
      >
        {/* Global animated RGB background — fixed, sits behind all content */}
        <AnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
