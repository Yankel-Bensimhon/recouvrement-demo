import React, { useState } from "react";

const initialDossiers = [
  {
    id: 1,
    debtor: "Dupont SARL",
    amount: 1200,
    status: "Relancé",
    documentUrl: "/docs/mise_en_demeure_dupont.pdf",
  },
  {
    id: 2,
    debtor: "Martin EI",
    amount: 600,
    status: "En attente",
    documentUrl: "/docs/mise_en_demeure_martin.pdf",
  },
];

export default function Dashboard() {
  const [dossiers, setDossiers] = useState(initialDossiers);

  const handleRelancer = (id) => {
    alert("Relance envoyée pour le dossier #" + id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Tableau de bord – Suivi de vos créances</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2">Débiteur</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dossiers.map((dossier) => (
            <tr key={dossier.id} className="border-t">
              <td className="py-2">{dossier.debtor}</td>
              <td>{dossier.amount} €</td>
              <td>
                <span className={`px-2 py-1 rounded-xl text-xs ${dossier.status === "Relancé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {dossier.status}
                </span>
              </td>
              <td>
                <a href={dossier.documentUrl} className="underline text-blue-700 mr-3" download>
                  Télécharger
                </a>
                {dossier.status !== "Relancé" && (
                  <button
                    onClick={() => handleRelancer(dossier.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
                  >
                    Relancer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-end">
        <button className="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-900 transition">
          + Nouvelle créance
        </button>
      </div>
    </div>
  );
}
