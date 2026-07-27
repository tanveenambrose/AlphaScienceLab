import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <AboutContent />
            </div>
            <Footer />
        </main>
    );
}
