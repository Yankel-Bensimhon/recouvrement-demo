import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import ClaimsStatusPieChart from './ClaimsStatusPieChart';

const STATUTS = {
  nouveau: { label: "Nouveau", color: "bg-blue-200 text-blue-800" },
  mise_en_demeure: { label: "Mise en demeure", color: "bg-yellow-200 text-yellow-900" },
  injonction: { label: "Injonction", color: "bg-purple-200 text-purple-800" },
  "assignation en référé": { label: "Assignation", color: "bg-red-200 text-red-800" },
  solde: { label: "Soldé", color: "bg-green-200 text-green-800" },
  perdu: { label: "Irrécouvrable", color: "bg-gray-300 text-gray-700" },
};

function formatEuro(val) {
  if (typeof val !== 'number') {
    val = parseFloat(val);
  }
  return val.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export default function ClientDashboardLayout() {
  const { data: session, status: authStatus } = useSession();
  const [dossiers, setDossiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      if (authStatus === "authenticated") {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/claims");
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Erreur serveur ou réponse non JSON." }));
            throw new Error(errorData.message || `Erreur HTTP : ${response.status}`);
          }
          const data = await response.json();
          setDossiers(data);
        } catch (e) {
          console.error("Failed to fetch dossiers:", e);
          setError(e.message);
          setDossiers([]);
        } finally {
          setIsLoading(false);
        }
      } else if (authStatus === "unauthenticated") {
        setIsLoading(false);
        setError("Vous devez être connecté pour voir les dossiers.");
        setDossiers([]);
      }
    };
    fetchDossiers();
  }, [authStatus]);

  if (authStatus === "loading" || (isLoading && authStatus === "authenticated")) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-lg">Chargement des données...</p></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Vos dossiers de recouvrement</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart taking 1/3 of the space */}
        <div className="lg:col-span-1">
          <ClaimsStatusPieChart claims={dossiers} />
        </div>

        {/* Summary Cards taking 2/3 of the space */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-5 text-center shadow-lg flex flex-col justify-center">
            <div className="text-3xl font-bold text-blue-700">{dossiers.length}</div>
            <div className="text-sm text-gray-600 mt-1">Dossiers Actifs</div>
          </div>
          <div className="bg-green-50 rounded-xl p-5 text-center shadow-lg flex flex-col justify-center">
            <div className="text-3xl font-bold text-green-700">
              {formatEuro(dossiers.reduce((acc, d) => acc + parseFloat(d.recovered_amount || 0), 0))}
            </div>
            <div className="text-sm text-gray-600 mt-1">Montant Total Recouvré</div>
          </div>
          <div className="bg-red-50 rounded-xl p-5 text-center shadow-lg flex flex-col justify-center">
            <div className="text-3xl font-bold text-red-700">
              {formatEuro(dossiers.reduce((acc, d) => acc + parseFloat(d.claim_amount || 0), 0) - dossiers.reduce((acc, d) => acc + parseFloat(d.recovered_amount || 0), 0))}
            </div>
            <div className="text-sm text-gray-600 mt-1">Montant Restant Dû</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-5 text-center shadow-lg flex flex-col justify-center">
            <div className="text-3xl font-bold text-yellow-700">
              {dossiers.filter(d => d.status === "mise_en_demeure").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Mises en Demeure</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Débiteur</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant Dû</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant Recouvré</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Réf.</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dossiers.length > 0 ? dossiers.map((dossier) => (
              <tr key={dossier.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dossier.debtor_name}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800">{formatEuro(dossier.claim_amount)}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-green-600">{formatEuro(dossier.recovered_amount)}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUTS[dossier.status]?.color || 'bg-gray-200 text-gray-800'}`}>
                    {STATUTS[dossier.status]?.label || dossier.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{dossier.invoice_reference}</td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Voir détails</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-1">Aucun dossier pour le moment.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
