import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center text-gray-500 py-6 mt-12">
      <div className="mb-4">
        © {new Date().getFullYear()} Yesod – Service de recouvrement de créances professionnelles opéré par le Cabinet d’Avocat Yankel Bensimhon - Avocat au Barreau de Paris - 43, Avenue Foch 75116 - Paris. Tous droits réservés
      </div>
      <div className="space-x-4">
        <Link href="/legal" className="hover:underline">Mentions légales</Link>
        <Link href="/privacy" className="hover:underline">Politique de Confidentialité</Link>
        <Link href="/terms" className="hover:underline">Conditions d'utilisation</Link>
      </div>
    </footer>
  );
}
