import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-blue-800 font-extrabold text-2xl tracking-tight">
            Cabinet BENSIMHON
        </Link>

        {/* Menu principal - visible sur la page d'accueil, caché si utilisateur connecté ? Ou garder ? */}
        {/* Pour l'instant, on le garde, mais on pourrait le cacher/modifier si on est sur le dashboard */}
        <div className="hidden sm:flex items-center gap-8">
          <a href="/#timeline" className="text-blue-700 hover:text-blue-900 font-medium transition">Timeline</a>
          <a href="/#legal-modes" className="text-blue-700 hover:text-blue-900 font-medium transition">Modes juridiques</a>
          <a href="/#avocat-avantage" className="text-blue-700 hover:text-blue-900 font-medium transition">Avantage avocat</a>
          <a href="/#mise-en-demeure" className="text-blue-700 hover:text-blue-900 font-medium transition">Mise en demeure</a>
        </div>

        {/* Boutons d'authentification ou profil utilisateur */}
        <div className="flex items-center">
          {status === "loading" ? (
            <div className="w-28 h-9 bg-gray-200 animate-pulse rounded-lg"></div> // Placeholder for loading state
          ) : session ? (
            <>
              <span className="text-sm text-gray-700 mr-2 hidden md:inline">
                {session.user.name || session.user.email}
              </span>
               <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 text-sm shadow-sm transition duration-150 mr-2">
                  Mon Espace
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })} // Redirect to home page after sign out
                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg px-4 py-2 text-sm shadow-sm transition duration-150 border border-red-200"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-blue-700 hover:text-blue-800 font-medium transition px-4 py-2 rounded-lg hover:bg-blue-50 text-sm mr-1">
                Connexion
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 text-sm shadow-sm transition duration-150">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
