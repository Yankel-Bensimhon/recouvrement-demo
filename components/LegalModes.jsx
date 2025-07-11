// components/LegalModes.jsx

import React from "react";

const modes = [
  {
    title: "Relance amiable",
    delay: "Sous 8 à 15 jours",
    points: [
      "Pas d’intervention judiciaire",
      "Rapide, sans frais",
    ],
    description: "Rappel par email, téléphone ou courrier. Aucun coût, permet souvent d’obtenir un paiement rapide.",
  },
  {
    title: "Mise en demeure",
    delay: "8 jours minimum",
    points: [
      "Indispensable avant toute action judiciaire",
      "Donne un poids légal",
    ],
    description: "Lettre formelle exigeant le paiement, envoyée par LRAR ou via avocat. Point de départ des intérêts de retard.",
  },
  {
    title: "Injonction de payer",
    delay: "1 à 2 mois",
    points: [
      "Coût limité (timbre fiscal)",
      "Rapide et efficace",
    ],
    description: "Procédure simple et rapide devant le tribunal, sans audience. Parfait pour factures non contestées.",
  },
  {
    title: "Assignation en référé ou au fond",
    delay: "2 à 12 mois",
    points: [
      "Nécessite avocat",
      "Permet d’obtenir une décision exécutoire",
    ],
    description: "Procédure judiciaire classique (si contestation, ou somme élevée). Passage devant le juge.",
  },
];

export default function LegalModes() {
  return (
    <section id="modes-juridiques" className="py-12 px-4 bg-blue-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900">
        Les modes juridiques de recouvrement
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {modes.map((mode) => (
          <div
            key={mode.title}
            className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500 flex flex-col h-full"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{mode.title}</h3>
            <div className="mb-2 text-blue-700 font-medium">
              Délai typique&nbsp;: <span className="font-bold">{mode.delay}</span>
            </div>
            <div className="mb-2 text-gray-700">{mode.description}</div>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 flex-1">
              {mode.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
