import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import ProjectsGallery from "@/components/ProjectsGallery";
import PhotoGallery from "@/components/PhotoGallery";
import ResearchAreas from "@/components/ResearchAreas";
import Stories from "@/components/Stories";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <ResearchAreas />
            <div id="projects">
                <ProjectsGallery />
            </div>
            <PhotoGallery />
            <Stories />
            <Events />
            <JoinSection />
            <Footer />
        </main>
    );
}
