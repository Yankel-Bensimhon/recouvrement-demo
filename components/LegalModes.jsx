export default function LegalModes() {
  const modes = [
    {
      title: "Relance amiable",
      desc: "Rappel par email ou courrier. Aucun coût, permet souvent d’obtenir un paiement rapide.",
      delay: "Immédiat",
      points: ["Pas d’intervention judiciaire", "Rapide, sans frais"],
    },
    {
      title: "Mise en demeure",
      desc: "Lettre formelle d'avocat exigeant le paiement, envoyée par LRAR. Point de départ des intérêts de retard et de la procédure judiciaire.",
      delay: "8 jours minimum",
      points: [
        "Indispensable avant toute action judiciaire",
        "Donne un poids légal",
      ],
    },
    {
      title: "Injonction de payer",
      desc: "Procédure simple et rapide devant le tribunal, sans audience. Parfait pour factures non contestées.",
      delay: "1 à 2 mois",
      points: ["Coût limité (frais de greffe + signification par Commissaire de Justice)", "Rapide et efficace"],
    },
    {
      title: "Assignation en référé ou au fond",
      desc: "Procédure judiciaire classique (si contestation, ou somme élevée). Passage devant le juge.",
      delay: "2 à 12 mois",
      points: [
        "Nécessite avocat",
        "Permet d’obtenir une décision exécutoire",
      ],
    },
    {
      title: "Saisies sur compte (ATD)",
      desc: "Permet de surprendre votre adversaire en saisissant ses avoirs. Redoutable d'efficacité.",
      delay: "15j en moyenne",
      points: [
        "Nécessite avocat",
        "Permet de sécuriser les fonds le temps de la procédure",
      ],
    },

  ];

  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {modes.map((mode, idx) => (
        <div key={idx} className="bg-blue-50 p-6 rounded-xl shadow border-t-4 border-blue-400">
          <h3 className="text-xl font-bold text-blue-800 mb-2">{mode.title}</h3>
          <p className="text-gray-700 mb-2">{mode.desc}</p>
          <p className="text-blue-700 font-semibold mb-1">
            Délai typique : {mode.delay}
          </p>
          <ul className="list-disc ml-5 text-gray-600">
            {mode.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
