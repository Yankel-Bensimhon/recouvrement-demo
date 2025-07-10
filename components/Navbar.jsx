import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="font-bold text-xl text-blue-900">Yesod</div>
      <div className="space-x-4">
        <Link href="#comment-ca-marche" className="hover:underline">Comment ça marche ?</Link>
        <Link href="#agir-en-justice" className="hover:underline">Agir en justice</Link>
        <Link href="#avantages" className="hover:underline">Avantages de nos services</Link>
        <Link href="#generer-med" className="hover:underline font-bold text-blue-700">Générer gratuitement une mise en demeure juridique</Link>
        <Link href="/auth/signin" className="text-blue-700">Connexion</Link>
        <Link href="/auth/signup" className="bg-blue-700 text-white px-3 py-1 rounded">Inscription</Link>
      </div>
    </nav>
  );
}
