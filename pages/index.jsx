import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AccueilActions from "../components/AccueilActions";
import TimelineRecouvrement from "../components/TimelineRecouvrement";
import LegalModes from "../components/LegalModes";
import AvantagesAvocat from "../components/AvantagesAvocat";
import MiseEnDemeureGenerator from "../components/MiseEnDemeureGenerator";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AccueilActions />
      <TimelineRecouvrement />
      <LegalModes />
      <AvantagesAvocat />
      <MiseEnDemeureGenerator />
      <Footer />
    </>
  );
}
