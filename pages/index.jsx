import herosection from "@/components/herosection";
import TimelineRecouvrement from "@/components/TimelineRecouvrement";
import legalmodes from "@/components/legalmodes";
import avantagesavocat from "@/components/avantagesavocat";
import MiseEnDemeureGenerator from "@/components/MiseEnDemeureGenerator";
import footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* Bannière illustrative avec logo et accroche */}
      <BannerHero />

      {/* Présentation activité */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Plateforme SaaS de recouvrement de créances</h2>
        <p className="text-lg text-gray-700">
          Automatisez vos relances, centralisez vos dossiers, suivez vos créances, et lancez les procédures judiciaires <span className="font-semibold">en quelques clics</span>.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <a href="#generateur" className="bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800 transition">Générer une mise en demeure</a>
          <Link href="/dashboard" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition">Mon espace</Link>
        </div>
      </section>

      {/* Timeline du recouvrement */}
      <section className="max-w-4xl mx-auto px-4 py-10" id="timeline">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Les étapes clés d’un recouvrement</h3>
        <TimelineRecouvrement />
      </section>

      {/* Modes juridiques de recouvrement */}
      <section className="max-w-4xl mx-auto px-4 py-10" id="modes-juridique">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Quels modes juridiques pour recouvrer vos créances ?</h3>
        <ModesJuridique />
      </section>

      {/* Avantages d'un avocat */}
      <section className="max-w-4xl mx-auto px-4 py-10" id="avocat-benefits">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Pourquoi passer par un avocat ?</h3>
        <AvocatBenefits />
      </section>

      {/* Générateur de mise en demeure */}
      <section className="max-w-3xl mx-auto px-4 py-12" id="generateur">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Générez gratuitement votre mise en demeure</h3>
        <MiseEnDemeureGenerator />
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center mt-12">
        <div className="mb-2">
          Service opéré par le <strong>Cabinet d’Avocat Yankel Bensimhon</strong> – 43 Avenue Foch, 75116 Paris
        </div>
        <div className="text-sm opacity-80">
          © {new Date().getFullYear()} – Tous droits réservés
        </div>
      </footer>
    </div>
  );
}