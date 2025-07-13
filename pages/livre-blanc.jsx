import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LivreBlanc() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Livre blanc du recouvrement de créances</h1>
        <p className="text-gray-700">
          Le contenu de cette page sera bientôt disponible.
        </p>
      </div>
      <Footer />
    </>
  );
}
