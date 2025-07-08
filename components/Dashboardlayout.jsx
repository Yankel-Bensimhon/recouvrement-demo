import React, { useState } from "react";

const STATUTS = {
  nouveau: { label: "Nouveau", color: "bg-blue-200 text-blue-800" },
  mise_en_demeure: { label: "Mise en demeure", color: "bg-yellow-200 text-yellow-900" },
  injonction: { label: "Injonction déposée", color: "bg-purple-200 text-purple-800" },
  "assignation en référé": { label: "Assignation déposée", color: "bg-red-200 text-red-800" },
  solde: { label: "Soldé", color: "bg-green-200 text-green-800" },
  perdu: { label: "Irrécouvrable", color: "bg-gray-300 text-gray-700" },
};

const DOSSIERS_FAKE = [
  {
    id: 1,
    client: "SARL Dupond",
    montant: 2200,
    echeance: "2024-06-30",
    statut: "nouveau",
    updated: "2024-07-08",
  },
  {
    id: 2,
    client: "SAS Electricité Martin",
    montant: 7300,
    echeance: "2024-07-01",
    statut: "mise_en_demeure",
    updated: "2024-07-04",
  },
  {
    id: 3,
    client: "SCI Paris 17e",
    montant: 12400,
    echeance: "2024-06-15",
    statut: "injonction",
    updated: "2024-07-05",
  },
  {
    id: 4,
    client: "M. Lopez",
    montant: 3500,
    echeance: "2024-06-01",
    statut: "solde",
    updated: "2024-07-01",
  },
  {
    id: 5,
    client: "SARL Peinture Dupuis",
    montant: 1800,
    echeance: "2024-05-15",
    statut: "perdu",
    updated: "2024-06-28",
  },
];

function formatEuro(val) {
  return val.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function DashboardLayout() {
  const [dossiers, setDossiers] = useState(DOSSIERS_FAKE);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord de recouvrement</h1>

      {/* Résumé chiffres clés */}
      <div className="flex gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 flex-1 text-center shadow">
          <div className="text-xl font-bold">{dossiers.length}</div>
          <div className="text-xs text-gray-500">Dossiers suivis</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex-1 text-center shadow">
          <div className="text-xl font-bold">
            {formatEuro(dossiers.reduce((acc, d) => acc + d.montant, 0))}
          </div>
          <div className="text-xs text-gray-500">Montant total</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 flex-1 text-center shadow">
          <div className="text-xl font-bold">
            {dossiers.filter(d => d.statut === "mise_en_demeure").length}
          </div>
          <div className="text-xs text-gray-500">Mises en demeure</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 flex-1 text-center shadow">
          <div className="text-xl font-bold">
            {dossiers.filter(d => d.statut === "injonction").length}
          </div>
          <div className="text-xs text-gray-500">Injonctions déposées</div>
        </div>
      </div>

      {/* Tableau des dossiers */}
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left text-sm">Client</th>
              <th className="py-2 text-left text-sm">Montant</th>
              <th className="py-2 text-left text-sm">Échéance</th>
              <th className="py-2 text-left text-sm">Statut</th>
              <th className="py-2 text-left text-sm">Dernière action</th>
              <th className="py-2 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((dossier) => (
              <tr key={dossier.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{dossier.client}</td>
                <td className="py-2">{formatEuro(dossier.montant)}</td>
                <td className="py-2">{dossier.echeance}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${STATUTS[dossier.statut]?.color}`}>
                    {STATUTS[dossier.statut]?.label || dossier.statut}
                  </span>
                </td>
                <td className="py-2">{dossier.updated}</td>
                <td className="py-2 text-center">
                  <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 mr-2">Éditer</button>
                  <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">Relancer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ajout rapide, import excel, autres modules à venir */}
      <div className="mt-8 flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">+ Ajouter un dossier</button>
        <button className="bg-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300">Importer Excel</button>
      </div>
    </div>
  );
}
