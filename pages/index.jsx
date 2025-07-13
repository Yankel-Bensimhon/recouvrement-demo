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

      <section id="hero" className="relative min-h-[60vh] flex flex-col justify-center items-center text-white text-center py-12 md:py-20">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        </div>
        <div className="relative z-10">
          <HeroSection />
          <a href="#generer-med" className="mt-8">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg text-lg">
              Générer une mise en demeure gratuite
            </button>
          </a>
        </div>
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
