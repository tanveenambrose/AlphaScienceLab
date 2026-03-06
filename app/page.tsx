import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stories from "@/components/Stories";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <CustomCursor />
      <Navbar />
      <Hero />
      <div id="projects">
        <Features />
      </div>
      <Stories />
      <JoinSection />
      <Footer />
    </main>
  );
}
