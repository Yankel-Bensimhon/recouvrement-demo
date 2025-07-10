import React, { useState, useEffect } from 'react';

export default function EditClaimModal({ claim, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (claim) {
      // Format date for input type="date" if due_date exists
      const formattedClaim = { ...claim };
      if (claim.due_date) {
        formattedClaim.due_date = new Date(claim.due_date).toISOString().split('T')[0];
      }
      setFormData(formattedClaim);
    } else {
      setFormData({
        debtor_name: '',
        claim_amount: '',
        due_date: '',
        debtor_email: '',
        debtor_address: '',
        invoice_reference: '',
        description: '',
        status: 'nouveau', // Default status
      });
    }
  }, [claim]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            claim_amount: parseFloat(formData.claim_amount) // Ensure amount is a number
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Erreur HTTP: ${response.status}`);
      }
      onSave(responseData); // Pass updated claim back to parent
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Failed to update claim:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Modifier la créance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-debtor_name" className="block text-sm font-medium text-gray-700">Nom du débiteur *</label>
            <input type="text" name="debtor_name" id="edit-debtor_name" value={formData.debtor_name || ''} onChange={handleChange} required
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-claim_amount" className="block text-sm font-medium text-gray-700">Montant (€) *</label>
              <input type="number" name="claim_amount" id="edit-claim_amount" value={formData.claim_amount || ''} onChange={handleChange} required step="0.01"
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="edit-due_date" className="block text-sm font-medium text-gray-700">Date d'échéance</label>
              <input type="date" name="due_date" id="edit-due_date" value={formData.due_date || ''} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="edit-debtor_email" className="block text-sm font-medium text-gray-700">Email du débiteur</label>
            <input type="email" name="debtor_email" id="edit-debtor_email" value={formData.debtor_email || ''} onChange={handleChange}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="edit-debtor_address" className="block text-sm font-medium text-gray-700">Adresse du débiteur</label>
            <textarea name="debtor_address" id="edit-debtor_address" value={formData.debtor_address || ''} onChange={handleChange} rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-invoice_reference" className="block text-sm font-medium text-gray-700">Réf. facture/contrat</label>
              <input type="text" name="invoice_reference" id="edit-invoice_reference" value={formData.invoice_reference || ''} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Statut</label>
              <select name="status" id="edit-status" value={formData.status || 'nouveau'} onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="nouveau">Nouveau</option>
                <option value="mise_en_demeure">Mise en demeure</option>
                <option value="injonction">Injonction déposée</option>
                <option value="assignation en référé">Assignation déposée</option>
                <option value="solde">Soldé</option>
                <option value="perdu">Irrécouvrable</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description/Notes</label>
            <textarea name="description" id="edit-description" value={formData.description || ''} onChange={handleChange} rows="2"
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-2">
            <button type="button" onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition duration-150">
              Annuler
            </button>
            <button type="submit" disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-60">
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
