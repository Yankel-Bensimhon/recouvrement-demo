import Link from "next/link";
import { Mail, UserCircle } from "lucide-react";

export default function AccueilActions() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Link href="/mise-en-demeure">
            <button className="flex items-center gap-2 px-8 py-4 bg-blue-700 text-white text-xl rounded-2xl shadow hover:bg-blue-800 transition">
              <Mail className="w-6 h-6" />
              Générer une mise en demeure
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-blue-700 text-blue-800 text-xl rounded-2xl shadow hover:bg-blue-50 transition">
              <UserCircle className="w-6 h-6" />
              Mon espace client
            </button>
          </Link>
        </div>
        <div className="text-gray-500 text-sm text-center mt-2">
          <span className="font-semibold">Service gratuit</span> &nbsp;|&nbsp; Cabinet d’avocat à Paris, dédié au recouvrement professionnel.
        </div>
      </div>
    </section>
  );
}
