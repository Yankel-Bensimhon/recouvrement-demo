import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-wrap justify-between items-center p-4 bg-white shadow">
      <div className="font-bold text-xl text-blue-900">Yesod</div>
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
        <div className="md:flex md:space-x-4">
          <Link href="#comment-ca-marche" className="block mt-4 md:inline-block md:mt-0 hover:underline">Comment ça marche ?</Link>
          <Link href="#agir-en-justice" className="block mt-4 md:inline-block md:mt-0 hover:underline">Agir en justice</Link>
          <Link href="#avantages" className="block mt-4 md:inline-block md:mt-0 hover:underline">Avantages de nos services</Link>
          <Link href="#generer-med" className="block mt-4 md:inline-block md:mt-0 hover:underline font-bold text-blue-700">Générer gratuitement une mise en demeure juridique</Link>
          <Link href="/auth/signin" className="block mt-4 md:inline-block md:mt-0 text-blue-700">Connexion</Link>
          <Link href="/auth/signup" className="block mt-4 md:inline-block md:mt-0 bg-blue-700 text-white px-3 py-1 rounded">Inscription</Link>
        </div>
      </div>
    </nav>
  );
}
