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
];

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
  const [dossiers, setDossiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for new claim form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClaim, setNewClaim] = useState({
    debtor_name: "",
    claim_amount: "",
    due_date: "",
    debtor_email: "",
    debtor_address: "",
    invoice_reference: "",
    description: "",
  });

import { useSession, getSession } from 'next-auth/react'; // Import useSession

export default function DashboardLayout() {
  const { data: session, status } = useSession(); // Get session state
  const [dossiers, setDossiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for new claim form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClaim, setNewClaim] = useState({
    debtor_name: "",
    claim_amount: "",
    due_date: "",
    debtor_email: "",
    debtor_address: "",
    invoice_reference: "",
    description: "",
  });

  useEffect(() => {
    const fetchDossiers = async () => {
      if (status === "authenticated") { // Only fetch if authenticated
        try {
          setIsLoading(true);
          // To send the token, NextAuth's `fetch` wrapper is not strictly necessary if using `getSession`
          // to get the token and manually adding it. Or, rely on cookie-based session if applicable.
          // For JWTs, you'd typically get the token and add it to Authorization header.
          // The simple `fetch` here relies on the browser sending the NextAuth session cookie.
          // If backend expects JWT in header, this needs adjustment.

          // Let's assume for now the proxy and NextAuth handle cookie forwarding,
          // or the backend middleware is adapted for NextAuth's session cookie if not using Bearer token.
          // For a robust JWT approach, you'd do:
          // const sessionData = await getSession(); // Get full session with token
          // const token = sessionData?.accessToken; // Or whatever your token is named
          // headers: { 'Authorization': `Bearer ${token}` }

          // No longer need to manually add Authorization header if relying on cookie-based auth
          // The browser will send the cookie automatically.
          // const sessionWithToken = await getSession();
          // let headers = { "Content-Type": "application/json" };
          // if (sessionWithToken?.jwt) {
          //   headers['Authorization'] = `Bearer ${sessionWithToken.jwt}`;
          // } else if (session?.accessToken) {
          //    headers['Authorization'] = `Bearer ${session.accessToken}`;
          // }

          const response = await fetch("/api/claims"); // No custom headers needed for cookie auth by default
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Erreur inconnue ou réponse non JSON" }));
            if (response.status === 401) {
               setError(errorData.message || "Non autorisé à charger les dossiers. Veuillez vous reconnecter.");
            } else {
              setError(errorData.message || `Erreur HTTP : ${response.status}`);
            }
            setDossiers([]); // Clear dossiers on auth error
            return;
          }
          const data = await response.json();
          setDossiers(data);
          setError(null);
        } catch (e) {
          console.error("Failed to fetch dossiers:", e);
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
        setError("Vous devez être connecté pour voir les dossiers.");
        setDossiers([]);
      }
      // If status is 'loading', we wait.
    };

    fetchDossiers();
  }, [status]); // Re-run if session status changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClaim(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddDossier = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Vous devez être connecté pour ajouter un dossier.");
      return;
    }
    try {
      // Similar to fetchDossiers, ensure token is sent if backend expects Bearer token.
      // For now, relying on session cookie.
      // No longer need to manually add Authorization header if relying on cookie-based auth
      // const sessionWithToken = await getSession();
      // let headers = { "Content-Type": "application/json" };
      // if (sessionWithToken?.jwt) {
      //   headers['Authorization'] = `Bearer ${sessionWithToken.jwt}`;
      // } else if (session?.accessToken) {
      //   headers['Authorization'] = `Bearer ${session.accessToken}`;
      // }

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Standard header
        body: JSON.stringify({
          ...newClaim,
          claim_amount: parseFloat(newClaim.claim_amount) // Ensure amount is a number
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erreur inconnue ou réponse non JSON" }));
         if (response.status === 401) {
            setError(errorData.message || "Non autorisé à ajouter le dossier.");
        } else {
            setError(errorData.message || `Erreur HTTP : ${response.status}`);
        }
        return;
      }
      const addedClaim = await response.json();
      setDossiers(prevDossiers => [addedClaim, ...prevDossiers]); // Add to start of list
      setShowAddForm(false);
      setNewClaim({ // Reset form
        debtor_name: "",
        claim_amount: "",
        due_date: "",
        debtor_email: "",
        debtor_address: "",
        invoice_reference: "",
        description: "",
      });
    } catch (err) {
      console.error("Failed to add dossier:", err);
      alert(`Erreur lors de l'ajout du dossier: ${err.message}`);
    }
  };


  if (isLoading) {
    return <div className="max-w-5xl mx-auto p-6 text-center">Chargement des dossiers...</div>;
  }

  if (error && dossiers.length === 0) { // Only show full page error if no data at all
    return <div className="max-w-5xl mx-auto p-6 text-center text-red-500">Erreur de chargement des dossiers: {error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord de recouvrement</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}. Les données affichées peuvent être incomplètes ou obsolètes.</span>
      </div>}

      {/* Résumé chiffres clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center shadow">
          <div className="text-2xl font-bold">{dossiers.length}</div>
          <div className="text-sm text-gray-500">Dossiers Actifs</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center shadow">
          <div className="text-2xl font-bold">
            {formatEuro(dossiers.reduce((acc, d) => acc + parseFloat(d.claim_amount || 0), 0))}
          </div>
          <div className="text-sm text-gray-500">Montant Total Dû</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center shadow">
          <div className="text-2xl font-bold">
            {dossiers.filter(d => d.status === "mise_en_demeure").length}
          </div>
          <div className="text-sm text-gray-500">Mises en Demeure</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center shadow">
          <div className="text-2xl font-bold">
            {dossiers.filter(d => d.status === "injonction").length}
          </div>
          <div className="text-sm text-gray-500">Injonctions Déposées</div>
        </div>
      </div>

      {/* Boutons d'action principaux */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-150 ease-in-out"
        >
          {showAddForm ? "Annuler" : "+ Ajouter un dossier"}
        </button>
        {/* Placeholder for other actions like import */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow transition duration-150 ease-in-out">
            Importer Excel (Bientôt)
        </button>
      </div>

      {/* Formulaire d'ajout de dossier */}
      {showAddForm && (
        <form onSubmit={handleAddDossier} className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-3">Nouveau dossier de recouvrement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="debtor_name" className="block text-sm font-medium text-gray-700">Nom du débiteur *</label>
              <input type="text" name="debtor_name" id="debtor_name" value={newClaim.debtor_name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="claim_amount" className="block text-sm font-medium text-gray-700">Montant de la créance (€) *</label>
              <input type="number" name="claim_amount" id="claim_amount" value={newClaim.claim_amount} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" step="0.01" />
            </div>
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Date d'échéance</label>
              <input type="date" name="due_date" id="due_date" value={newClaim.due_date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="debtor_email" className="block text-sm font-medium text-gray-700">Email du débiteur</label>
              <input type="email" name="debtor_email" id="debtor_email" value={newClaim.debtor_email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="debtor_address" className="block text-sm font-medium text-gray-700">Adresse du débiteur</label>
            <textarea name="debtor_address" id="debtor_address" value={newClaim.debtor_address} onChange={handleInputChange} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="invoice_reference" className="block text-sm font-medium text-gray-700">Référence facture/contrat</label>
              <input type="text" name="invoice_reference" id="invoice_reference" value={newClaim.invoice_reference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description/Notes</label>
              <input type="text" name="description" id="description" value={newClaim.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Enregistrer le dossier</button>
          </div>
        </form>
      )}

      {/* Tableau des dossiers */}
      <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Débiteur</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réf. Facture</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dossiers.length > 0 ? dossiers.map((dossier) => (
              <tr key={dossier.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dossier.debtor_name}</div>
                    {dossier.debtor_email && <div className="text-xs text-gray-500">{dossier.debtor_email}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatEuro(dossier.claim_amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(dossier.due_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUTS[dossier.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {STATUTS[dossier.status]?.label || dossier.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(dossier.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dossier.invoice_reference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors mr-3">Détails</button>
                  <button className="text-red-600 hover:text-red-800 transition-colors">Supprimer</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Aucun dossier pour le moment.
                  <button onClick={() => setShowAddForm(true)} className="ml-2 text-blue-600 hover:underline">Ajoutez votre premier dossier.</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
