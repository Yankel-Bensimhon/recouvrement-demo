import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import EditClaimModal from './EditClaimModal'; // Import the modal

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

export default function DashboardLayout() {
  const { data: session, status: authStatus } = useSession();
  const [dossiers, setDossiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newClaim, setNewClaim] = useState({
    debtor_name: "", claim_amount: "", due_date: "", debtor_email: "",
    debtor_address: "", invoice_reference: "", description: "", status: "nouveau",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClaimToEdit, setCurrentClaimToEdit] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClaim(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddDossier = async (e) => {
    e.preventDefault();
    if (authStatus !== "authenticated") {
      setError("Vous devez être connecté pour ajouter un dossier.");
      return;
    }
    setError(null);
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newClaim, claim_amount: parseFloat(newClaim.claim_amount) }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Erreur HTTP : ${response.status}`);
      }
      setDossiers(prevDossiers => [responseData, ...prevDossiers]);
      setShowAddForm(false);
      setNewClaim({ debtor_name: "", claim_amount: "", due_date: "", debtor_email: "", debtor_address: "", invoice_reference: "", description: "", status: "nouveau" });
    } catch (err) {
      console.error("Failed to add dossier:", err);
      setError(`Erreur lors de l'ajout: ${err.message}`);
    }
  };

  const handleOpenEditModal = (claim) => {
    setCurrentClaimToEdit(claim);
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentClaimToEdit(null);
  };

  const handleSaveClaim = (updatedClaim) => {
    setDossiers(dossiers.map(d => d.id === updatedClaim.id ? updatedClaim : d));
    // Optionally show a success message
  };

  const handleDeleteClaim = async (claimId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette créance ? Cette action est irréversible.")) {
      return;
    }
    setError(null);
    try {
      const response = await fetch(`/api/claims/${claimId}`, { method: 'DELETE' });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Erreur HTTP : ${response.status}`);
      }
      setDossiers(dossiers.filter(d => d.id !== claimId));
    } catch (err) {
      console.error("Failed to delete claim:", err);
      setError(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  if (authStatus === "loading" || (isLoading && authStatus === "authenticated")) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-lg">Chargement des données...</p></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Tableau de bord de recouvrement</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Summary Cards */}
        <div className="bg-blue-50 rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-blue-700">{dossiers.length}</div>
          <div className="text-sm text-gray-600">Dossiers Actifs</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-green-700">
            {formatEuro(dossiers.reduce((acc, d) => acc + parseFloat(d.claim_amount || 0), 0))}
          </div>
          <div className="text-sm text-gray-600">Montant Total Dû</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-yellow-700">
            {dossiers.filter(d => d.status === "mise_en_demeure").length}
          </div>
          <div className="text-sm text-gray-600">Mises en Demeure</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-purple-700">
            {dossiers.filter(d => d.status === "injonction").length}
          </div>
          <div className="text-sm text-gray-600">Injonctions</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <button
          onClick={() => { setShowAddForm(!showAddForm); setError(null); }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
        >
          {showAddForm ? "Annuler l'ajout" : "+ Ajouter un dossier"}
        </button>
        <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out">
            Importer (Bientôt)
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddDossier} className="bg-white p-6 rounded-xl shadow-xl mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">Nouveau dossier de recouvrement</h2>
          {/* Form fields (repeated structure, consider a component for fields if many) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="debtor_name" className="block text-sm font-medium text-gray-700">Nom du débiteur *</label>
              <input type="text" name="debtor_name" id="debtor_name" value={newClaim.debtor_name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="claim_amount" className="block text-sm font-medium text-gray-700">Montant (€) *</label>
              <input type="number" name="claim_amount" id="claim_amount" value={newClaim.claim_amount} onChange={handleInputChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Date d'échéance</label>
              <input type="date" name="due_date" id="due_date" value={newClaim.due_date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="debtor_email" className="block text-sm font-medium text-gray-700">Email débiteur</label>
              <input type="email" name="debtor_email" id="debtor_email" value={newClaim.debtor_email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="debtor_address" className="block text-sm font-medium text-gray-700">Adresse débiteur</label>
            <textarea name="debtor_address" id="debtor_address" value={newClaim.debtor_address} onChange={handleInputChange} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="invoice_reference" className="block text-sm font-medium text-gray-700">Réf. facture/contrat</label>
              <input type="text" name="invoice_reference" id="invoice_reference" value={newClaim.invoice_reference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut Initial</label>
                <select name="status" id="status" value={newClaim.status} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    {Object.entries(STATUTS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>
          </div>
           <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description/Notes</label>
              <textarea name="description" id="description" value={newClaim.description} onChange={handleInputChange} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Débiteur</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Échéance</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Créé le</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Réf.</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dossiers.length > 0 ? dossiers.map((dossier) => (
              <tr key={dossier.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dossier.debtor_name}</div>
                    {dossier.debtor_email && <div className="text-xs text-gray-500">{dossier.debtor_email}</div>}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800">{formatEuro(dossier.claim_amount)}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(dossier.due_date)}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUTS[dossier.status]?.color || 'bg-gray-200 text-gray-800'}`}>
                    {STATUTS[dossier.status]?.label || dossier.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(dossier.created_at)}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{dossier.invoice_reference}</td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenEditModal(dossier)} className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Modifier</button>
                  <button onClick={() => handleDeleteClaim(dossier.id)} className="text-red-600 hover:text-red-800 transition-colors duration-150">Supprimer</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-1">Aucun dossier pour le moment.</p>
                    {authStatus === "authenticated" && (
                         <button onClick={() => { setShowAddForm(true); setError(null); }} className="text-sm text-blue-600 hover:underline">Ajoutez votre premier dossier.</button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {isEditModalOpen && currentClaimToEdit && (
        <EditClaimModal
          claim={currentClaimToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveClaim}
        />
      )}
    </div>
  );
}
