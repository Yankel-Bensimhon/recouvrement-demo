import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo (remplacez le texte par <img src="/logo.svg" ... /> si besoin) */}
        <Link href="/">
          <span className="text-blue-800 font-extrabold text-2xl tracking-tight">Cabinet BENSIMHON</span>
        </Link>

        {/* Menu principal */}
        <div className="flex items-center gap-8">
          <a href="#timeline" className="text-blue-700 hover:text-blue-900 font-medium transition">Timeline</a>
          <a href="#legal-modes" className="text-blue-700 hover:text-blue-900 font-medium transition">Modes juridiques</a>
          <a href="#avocat-avantage" className="text-blue-700 hover:text-blue-900 font-medium transition">Avantage avocat</a>
          <a href="#mise-en-demeure" className="text-blue-700 hover:text-blue-900 font-medium transition">Mise en demeure</a>
        </div>

        {/* Bouton espace client */}
        <Link href="/dashboard">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl px-4 py-2 ml-4 shadow transition">
            Mon espace
          </button>
        </Link>
      </div>
    </nav>
  );
}
