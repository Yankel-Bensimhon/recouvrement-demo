import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TimeLineRecouvrement from "../components/TimeLineRecouvrement";
import LegalModes from "../components/LegalModes";
import AvantagesAvocat from "../components/AvantagesAvocat";
import MiseEnDemeureGenerator from "../components/MiseEnDemeureGenerator";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <section id="hero" className="min-h-[60vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 to-blue-400 text-white text-center py-12 md:py-20">
        <HeroSection />
        <a href="#generer-med" className="mt-8">
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg text-lg">
            Générer une mise en demeure gratuite
          </button>
        </a>
      </section>

      <section id="comment-ca-marche" className="max-w-3xl mx-auto my-12 md:my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Comment ça marche ?</h2>
        <TimeLineRecouvrement />
      </section>

      <section id="agir-en-justice" className="max-w-4xl mx-auto my-12 md:my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Agir en justice</h2>
        <LegalModes />
      </section>

      <section id="avantages" className="max-w-4xl mx-auto my-12 md:my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Avantages de nos services</h2>
        <AvantagesAvocat />
      </section>

      <section id="generer-med" className="max-w-xl mx-auto my-12 md:my-16 bg-white rounded-xl shadow-lg p-6 px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Générateur de mise en demeure</h2>
        <MiseEnDemeureGenerator />
      </section>

      <Footer />
    </>
  );
}
