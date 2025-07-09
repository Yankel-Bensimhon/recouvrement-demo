export default function RecouvrementModes() {
  const modes = [
    {
      nom: "Relance amiable",
      description: "Rappel par email, téléphone ou courrier. Aucun coût, permet souvent d’obtenir un paiement rapide.",
      delai: "Sous 8 à 15 jours",
      points: [
        "Pas d’intervention judiciaire",
        "Rapide, sans frais"
      ],
    },
    {
      nom: "Mise en demeure",
      description: "Lettre formelle exigeant le paiement, envoyée par LRAR ou via avocat. Point de départ des intérêts de retard.",
      delai: "8 jours minimum",
      points: [
        "Indispensable avant toute action judiciaire",
        "Donne un poids légal"
      ],
    },
    {
      nom: "Injonction de payer",
      description: "Procédure simple et rapide devant le tribunal, sans audience. Parfait pour factures non contestées.",
      delai: "1 à 2 mois",
      points: [
        "Coût limité (timbre fiscal)",
        "Rapide et efficace"
      ],
    },
    {
      nom: "Assignation en référé ou au fond",
      description: "Procédure judiciaire classique (si contestation, ou somme élevée). Passage devant le juge.",
      delai: "2 à 12 mois",
      points: [
        "Nécessite avocat",
        "Permet d’obtenir une décision exécutoire"
      ],
    },
  ];
  return (
    <section className="bg-blue-50 py-16" id="modes">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          Les modes juridiques de recouvrement
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {modes.map(mode => (
            <div key={mode.nom} className="bg-white rounded-2xl shadow p-6 border-t-4 border-blue-700">
              <h3 className="text-xl font-bold mb-2 text-blue-800">{mode.nom}</h3>
              <div className="text-gray-700 mb-2">{mode.description}</div>
              <div className="text-sm text-blue-700 font-semibold mb-2">
                Délai typique&nbsp;: {mode.delai}
              </div>
              <ul className="list-disc pl-6 text-gray-600 text-sm">
                {mode.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
