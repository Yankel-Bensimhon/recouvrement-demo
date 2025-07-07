import MiseEnDemeureGenerator from "../components/MiseEnDemeureGenerator";
export default function Home() {
  return (
    <div>
      <header className="bg-blue-700 py-6 text-white text-center">
        <h1 className="text-3xl font-bold">Recouvrement SaaS Demo</h1>
        <p className="text-xl mt-2">Générez votre lettre de mise en demeure gratuitement</p>
      </header>
      <main>
        <MiseEnDemeureGenerator />
      </main>
    </div>
  );
}
