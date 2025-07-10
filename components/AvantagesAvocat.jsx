export default function AvantagesAvocat() {
  const avantages = [
    {
      icon: "🔒",
      title: "Sécurisation juridique",
      text: "Tous vos courriers et démarches sont conformes au droit, pour éviter les vices de procédure et garantir leur force légale.",
    },
    {
      icon: "🧑‍⚖️",
      title: "Procédures complètes",
      text: "De la simple relance jusqu’à l’exécution par Commissaire de Justice (ex Huissiers), tout est pris en charge selon le bon mode de recouvrement.",
    },
    {
      icon: "🤝",
      title: "Accompagnement & conseil",
      text: "Un avocat suit vos dossiers et vous conseille, y compris en cas de contestation, médiation, ou négociation.",
    },
    {
      icon: "👍",
      title: "Réputation & force",
      text: "L’intervention d’un avocat expert en recouvrement et voies d'exécution impressionne et incite au paiement. Votre image de professionnel est renforcée.",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {avantages.map((a, i) => (
        <div key={i} className="bg-blue-50 p-6 rounded-xl shadow flex gap-4 items-start">
          <span className="text-3xl">{a.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-blue-800">{a.title}</h3>
            <p className="text-gray-700">{a.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
