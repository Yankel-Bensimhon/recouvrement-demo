import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AccueilActions from "../components/AccueilActions";
import TimeLineRecouvrement from "../components/TimeLineRecouvrement";
import LegalModes from "../components/LegalModes";
import AvantagesAvocat from "../components/AvantagesAvocat";
import MiseEnDemeureGenerator from "../components/MiseEnDemeureGenerator";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AccueilActions />
      <TimeLineRecouvrement />
      <LegalModes />
      <AvantagesAvocat />
      <section id="med">
        <MiseEnDemeureGenerator />
      </section>
      <Footer />
    </>
  );
}
