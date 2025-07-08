import React, { useState } from "react";

const STATUTS = {
  nouveau: { label: "Nouveau", color: "bg-blue-200 text-blue-900" },
  mise_en_demeure: { label: "Mise en demeure", color: "bg-orange-200 text-orange-900" },
  injonction: { label: "Injonction déposée", color: "bg-yellow-200 text-yellow-900" },
  "assignation en référé": { label: "Assignation déposée", color: "bg-red-200 text-red-900" },
  solde: { label: "Soldé", color: "bg-green-200 text-green-900" },
  perdu: { label: "Irrécouvrable", color: "bg-gray-200 text-gray-700" },
};

const LABELS_PIECES = {
  contrat: "Contrat/devis",
  livraison: "Bon de livraison",
  facture: "Facture impayée",
  grand_livre: "Grand livre client",
};

function BadgePieces({ pieces }) {
  if (pieces.length === 0) {
    return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Complet</span>;
  }
  return (
    <span
      className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold"
      title={pieces.map(p => LABELS_PIECES[p]).join(", ")}
    >
      {pieces.length} manquante{pieces.length > 1 ? "s" : ""}
    </span>
  );
}

const DOSSIERS_MOCK = [
  {
    id: 1,
    client: "SARL Dupont",
    montant: 2850,
    debiteur: "SAS Leclerc",
    echeance: "2024-07-15",
    statut: "nouveau",
    piecesManquantes: ["grand_livre"],
  },
  {
    id: 2,
    client: "SCI des Lilas",
    montant: 12000,
    debiteur: "Locataire M. Benyamin",
    echeance: "2024-07-01",
    statut: "mise_en_demeure",
    piecesManquantes: [],
  },
  {
    id: 3,
    client: "SARL Taxis Bleu",
    montant: 4400,
    debiteur: "SARL Logis",
    echeance: "2024-06-25",
    statut: "solde",
    piecesManquantes: ["contrat", "facture"],
  },
];

export default function Dashboard() {
  const [dossiers] = useState(DOSSIERS_MOCK);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Tableau de bord des créances</h1>
      <table className="w-full bg-white rounded-xl shadow border border-blue-50">
        <thead>
          <tr className="bg-blue-50 text-blue-800">
            <th className="p-3 text-left">Créancier</th>
            <th className="p-3 text-left">Débiteur</th>
            <th className="p-3 text-right">Montant (€)</th>
            <th className="p-3 text-center">Échéance</th>
            <th className="p-3 text-center">Statut</th>
            <th className="p-3 text-center">Pièces</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {dossiers.map((d) => (
            <tr key={d.id} className="border-t hover:bg-blue-50 transition">
              <td className="p-3">{d.client}</td>
              <td className="p-3">{d.debiteur}</td>
              <td className="p-3 text-right">{d.montant.toLocaleString()}</td>
              <td className="p-3 text-center">{d.echeance}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUTS[d.statut].color}`}>
                  {STATUTS[d.statut].label}
                </span>
              </td>
              <td className="p-3 text-center">
                <BadgePieces pieces={d.piecesManquantes} />
              </td>
              <td className="p-3 text-right">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Actions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 flex flex-col items-center">
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl shadow"
          disabled
        >
          + Ajouter une créance (bientôt)
        </button>
        <div className="text-gray-400 mt-2 text-xs">Intégration import Excel/API Quickbooks/Sage à venir</div>
      </div>
    </div>
  );
}
