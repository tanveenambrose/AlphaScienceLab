import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
        className={`${inter.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
