export default function Footer() {
  return (
    <footer className="w-full text-center text-gray-500 py-6 mt-12">
      © {new Date().getFullYear()} Yesod – Opéré par le cabinet d’avocat Yankel Bensimhon. Tous droits réservés.
    </footer>
  );
}
