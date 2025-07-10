import React, { useState } from 'react';
import MiseEnDemeureGenerator from './MiseEnDemeureGenerator'; // Assuming this is the refactored one
// Import other generators like InjonctionGenerator when ready

export default function GenerateDocumentModal({
  claim,        // The claim for which to generate the document
  user,         // Session user object
  isOpen,
  onClose,
  onDocumentGenerated // Callback after document is recorded and claim status potentially updated
}) {
  const [documentType, setDocumentType] = useState('mise_en_demeure'); // Default or could be passed
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerationComplete = async ({ claimId, documentType, formDataUsed, statusToSet }) => {
    setIsProcessing(true);
    setError(null);
    try {
      // 1. Save document metadata
      const docResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim_id: claimId,
          document_type: documentType,
          data: formDataUsed, // The form data used for generation
        }),
      });
      const docData = await docResponse.json();
      if (!docResponse.ok) {
        throw new Error(docData.message || 'Erreur lors de l\'enregistrement du document.');
      }
      console.log('Document metadata saved:', docData);

      // 2. Update claim status
      if (statusToSet) {
        const claimUpdateResponse = await fetch(`/api/claims/${claimId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: statusToSet }),
        });
        const claimUpdateData = await claimUpdateResponse.json();
        if (!claimUpdateResponse.ok) {
          throw new Error(claimUpdateData.message || 'Erreur lors de la mise à jour du statut de la créance.');
        }
        console.log('Claim status updated:', claimUpdateData);

        // Notify parent to refresh or update claim data
        if (onDocumentGenerated) {
          onDocumentGenerated(claimUpdateData); // Pass the updated claim
        }
      } else {
         if (onDocumentGenerated) { // Still notify if no status change, but document was made
          onDocumentGenerated(claim); // Pass original claim if no status change needed by this doc
        }
      }

      onClose(); // Close modal on full success
    } catch (err) {
      console.error("Error in generation process:", err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Générer un document pour : {claim.debtor_name} (€{parseFloat(claim.claim_amount).toFixed(2)})
          </h2>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
            <strong className="font-bold">Erreur : </strong>{error}
          </div>
        )}

        {/* Simple Document Type Selector (can be expanded) */}
        {/* <div className="mb-4">
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Type de document</label>
          <select
            id="documentType"
            name="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="mise_en_demeure">Mise en Demeure</option>
            <option value="injonction_de_payer" disabled>Injonction de Payer (Bientôt)</option>
          </select>
        </div> */}

        {documentType === 'mise_en_demeure' && (
          <MiseEnDemeureGenerator
            claim={claim}
            user={user}
            onGenerationComplete={handleGenerationComplete}
          />
        )}
        {/* Add other generators here based on documentType */}
        {/* {documentType === 'injonction_de_payer' && <InjonctionGenerator claim={claim} ... />} */}

        {isProcessing && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Traitement en cours, veuillez patienter...
          </div>
        )}
      </div>
    </div>
  );
}
