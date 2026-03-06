import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Features />

      {/* Visual Break / Call to Action Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-12 flex flex-col items-center gap-4">
            <span>Unlock the secrets of the</span>
            <span className="gradient-text">Future. Today.</span>
          </h2>
          <div className="flex justify-center gap-6">
            <button className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-primary/20 cursor-pointer">
              Join the Mission
            </button>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="text-xl font-bold font-display tracking-widest uppercase">Lab-A1</div>
            <div className="text-xl font-bold font-display tracking-widest uppercase">Bio-Nano</div>
            <div className="text-xl font-bold font-display tracking-widest uppercase">Material-X</div>
            <div className="text-xl font-bold font-display tracking-widest uppercase">Phys-Quant</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </section>

      <Footer />
    </main>
  );
}
