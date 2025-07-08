import React, { useEffect, useState } from "react";

// Helper pour lire/écrire dans localStorage
const STORAGE_KEY = "recouvrement_dossiers";

function loadDossiers() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}
function saveDossiers(dossiers) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
  }
}

export default function DossierDashboard() {
  const [dossiers, setDossiers] = useState([]);
  const [form, setForm] = useState({
    client: "",
    montant: "",
    echeance: "",
    statut: "Nouveau"
  });

  useEffect(() => {
    setDossiers(loadDossiers());
  }, []);

  useEffect(() => {
    saveDossiers(dossiers);
  }, [dossiers]);

  function addDossier(e) {
    e.preventDefault();
    if (!form.client || !form.montant || !form.echeance) return;
    setDossiers([
      ...dossiers,
      {
        id: Date.now(),
        ...form
      }
    ]);
    setForm({ client: "", montant: "", echeance: "", statut: "Nouveau" });
  }

  function deleteDossier(id) {
    setDossiers(dossiers.filter(d => d.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord des dossiers</h2>
      <form onSubmit={addDossier} className="flex flex-col gap-2 mb-6 bg-gray-50 p-4 rounded-xl shadow">
        <input
          placeholder="Nom du client"
          className="border p-2 rounded"
          value={form.client}
          onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Montant (€)"
          className="border p-2 rounded"
          value={form.montant}
          onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
        />
        <input
          type="date"
          placeholder="Echéance"
          className="border p-2 rounded"
          value={form.echeance}
          onChange={e => setForm(f => ({ ...f, echeance: e.target.value }))}
        />
        <button className="bg-blue-700 text-white px-3 py-2 rounded" type="submit">
          Ajouter le dossier
        </button>
      </form>
      <table className="w-full border text-left bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-2">Client</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Echéance</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dossiers.length === 0 && (
            <tr>
              <td colSpan={5} className="text-gray-500 text-center p-4">
                Aucun dossier pour le moment.
              </td>
            </tr>
          )}
          {dossiers.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.client}</td>
              <td className="p-2">{d.montant} €</td>
              <td className="p-2">{d.echeance}</td>
              <td className="p-2">{d.statut}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteDossier(d.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
