import Navbar from "@/components/navbar";
import HeroSection from "@/components/HeroSection";
import TimelineRecouvrement from "@/components/TimeLineRecouvrement";
import LegalModes from "@/components/LegalModes";
import AvantagesAvocat from "@/components/AvantagesAvocat";
import AccueilActions from "@/components/AccueilActions";
import MiseEnDemeureGenerator from "@/components/MiseEnDemeureGenerator";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <section id="hero"><HeroSection /></section>
      <section id="timeline" className="my-10"><TimelineRecouvrement /></section>
      <section id="legalmodes" className="my-10"><LegalModes /></section>
      <section id="avantagesavocat" className="my-10"><AvantagesAvocat /></section>
      <section id="accueilactions" className="my-10"><AccueilActions /></section>
      <section id="generatedoc" className="my-10"><MiseEnDemeureGenerator /></section>
      <Footer />
    </div>
  );
}
