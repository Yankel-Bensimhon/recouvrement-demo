export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col justify-center items-center min-h-[60vh] py-20 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 text-white text-center overflow-hidden"
      id="home"
    >
      {/* Effet visuel d’illustration en fond */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-20 pointer-events-none"
        aria-hidden
      >
        <svg width="700" height="200" viewBox="0 0 700 200">
          <ellipse cx="350" cy="100" rx="320" ry="70" fill="#fff" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-6">
          Le recouvrement de créances, <br className="hidden md:inline" />
          100% automatisé, 100% sécurisé
        </h1>
        <p className="text-lg md:text-xl font-medium mb-8">
          Plateforme SaaS pour TPE/PME : <b>générez gratuitement vos mises en demeure</b>, pilotez vos créances, accédez au suivi juridique simplifié, tout est centralisé et sécurisé chez votre avocat.
        </p>
        <a
          href="#mise-en-demeure"
          className="inline-block bg-white text-blue-800 font-semibold px-8 py-3 rounded-2xl shadow-lg text-lg hover:bg-blue-100 transition"
        >
          Générer une mise en demeure gratuite
        </a>
      </div>

      <div className="absolute right-6 bottom-6 opacity-40 select-none pointer-events-none hidden md:block" aria-hidden>
        {/* Petit effet décoratif d’icône */}
        <svg width="120" height="120" fill="none">
          <rect x="20" y="20" width="80" height="80" rx="15" fill="#fff" />
          <path d="M35 50h50M35 65h50M35 80h32" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
    </section>
  );
}
