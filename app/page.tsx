import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsGallery from "@/components/ProjectsGallery";
import ResearchAreas from "@/components/ResearchAreas";
import Stories from "@/components/Stories";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-black">
      <CustomCursor />
      <Navbar />
      <Hero />
      <ResearchAreas />
      <div id="projects">
        <ProjectsGallery />
      </div>
      <Stories />
      <JoinSection />
      <Footer />
    </main>
  );
}
