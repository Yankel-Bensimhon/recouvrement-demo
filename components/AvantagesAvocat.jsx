import { ShieldCheck, FileText, Users, ThumbsUp } from "lucide-react";

export default function AvantagesAvocat() {
  const items = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-700" />,
      title: "Sécurisation juridique",
      desc: "Tous vos courriers et démarches sont conformes au droit, pour éviter les vices de procédure et garantir leur force légale."
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-700" />,
      title: "Procédures complètes",
      desc: "De la simple relance jusqu’à l’exécution par huissier, tout est pris en charge selon le bon mode de recouvrement."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-700" />,
      title: "Accompagnement & conseil",
      desc: "Un avocat suit vos dossiers et vous conseille, y compris en cas de contestation, médiation, ou négociation."
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-blue-700" />,
      title: "Réputation & force",
      desc: "L’intervention d’un avocat impressionne et incite au paiement. Votre image de professionnel est renforcée."
    }
  ];
  return (
    <section className="bg-white py-16" id="avocat">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          Pourquoi choisir un avocat pour votre recouvrement&nbsp;?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {items.map(item => (
            <div key={item.title} className="flex items-start gap-4 bg-blue-50 rounded-2xl shadow p-6">
              <div>{item.icon}</div>
              <div>
                <div className="font-bold text-blue-800 text-lg mb-1">{item.title}</div>
                <div className="text-gray-700">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
