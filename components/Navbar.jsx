import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-wrap justify-between items-center p-4 bg-white shadow-md">
      <div className="font-bold text-2xl text-gray-800">Yesod</div>
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
        <div className="md:flex md:space-x-6 md:items-center">
          <Link href="#comment-ca-marche" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-gray-800">Comment ça marche ?</Link>
          <Link href="#agir-en-justice" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-gray-800">Agir en justice</Link>
          <Link href="/livre-blanc" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-gray-800">Livre blanc du recouvrement de créances</Link>
          <Link href="#generer-med" className="block mt-4 md:inline-block md:mt-0 font-semibold text-blue-600 hover:text-blue-800">Générer gratuitement une mise en demeure</Link>
          <Link href="/auth/signin" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-gray-800">Connexion</Link>
          <Link href="/auth/signup" className="block mt-4 md:inline-block md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Inscription</Link>
        </div>
      </div>
    </nav>
  );
}
