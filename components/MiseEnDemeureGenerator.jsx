import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Helper function (can be moved to a utils file if used elsewhere)
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

export default function MiseEnDemeureGenerator({
  claim, // The specific claim data passed as a prop
  onGenerationComplete, // Callback function when generation and API calls are done
  user // User information (e.g., session.user, containing company_name, email etc.)
}) {
  // State for the form fields specific to the "mise en demeure"
  // Some fields can be pre-filled from `claim` or `user` props
  const [formData, setFormData] = useState({
    destinataireNom: claim?.debtor_name || "",
    destinataireAdresse: claim?.debtor_address || "",
    // expediteurNom: user?.company_name || user?.name || "Votre Société", // Get from user session
    // expediteurAdresse: "Votre Adresse Complète", // This should ideally be part of user profile
    villeDocument: "Paris", // Default or from user profile
    dateDocument: new Date().toLocaleDateString('fr-FR'),
    montantDu: claim?.claim_amount ? parseFloat(claim.claim_amount).toFixed(2) : "0.00",
    referenceFacture: claim?.invoice_reference || "N/A",
    delaiPaiementSupplementaire: "8", // Default additional payment days
    // ... other fields specific to this document that are not in the claim object
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form data if claim prop changes (e.g., user selects a different claim)
  useEffect(() => {
    if (claim) {
      setFormData(prev => ({
        ...prev,
        destinataireNom: claim.debtor_name || "",
        destinataireAdresse: claim.debtor_address || "",
        montantDu: claim.claim_amount ? parseFloat(claim.claim_amount).toFixed(2) : "0.00",
        referenceFacture: claim.invoice_reference || "N/A",
      }));
    }
    // if (user) {
    //   setFormData(prev => ({
    //     ...prev,
    //     expediteurNom: user.company_name || user.name || "Votre Société",
    //   }));
    // }
  }, [claim, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const CabinetLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARTSURBVHhe7Z1vyjhPEIChP0kQkCBY8SbyCAKCBG/gDRLxJoJvIHgjCAlIQPJGhJtIQPJGEBDyJv9/d1fX1PV0VXVmZnpGkf3ZOc/s7Ozu6q6q7q7q6kIMAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQhAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAAC+H0BqSd2r9qP0T0AAAAASUVORK5CYII="; // Replace with your actual logo or remove

  const handleGenerateAndSave = async () => {
    setIsLoading(true);
    setError(null);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let yPos = 60; // Initial Y position

    // --- PDF Content Generation (Simplified example, adapt as needed) ---
    // 1. Logo (Optional)
    if (CabinetLogoBase64) {
      try {
        // const imgData = await loadImage(CabinetLogoBase64); // Not needed if base64 is directly usable
        doc.addImage(CabinetLogoBase64, "PNG", 40, yPos, 80, 40); // Adjust size/pos
        yPos += 60;
      } catch (e) {
        console.error("Error loading logo:", e);
      }
    }

    // 2. Expediteur (Cabinet d'avocat - from user or hardcoded for demo)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Maître Yankel BENSIMHON", 400, yPos); yPos += 15;
    doc.setFont("helvetica", "normal");
    doc.text("Cabinet d'avocat — Yesod", 400, yPos); yPos += 12;
    doc.text("43 avenue Foch, 75116 Paris", 400, yPos); yPos += 12;
    // doc.text(`Tel: ${user?.phone || "Votre Tel"}`, 400, yPos); yPos += 12;
    // doc.text(`Email: ${user?.email || "Votre Email"}`, 400, yPos); yPos += 25;
    yPos += 15;


    // 3. Destinataire (from formData)
    doc.setFont("helvetica", "normal");
    doc.text(formData.destinataireNom, 40, yPos); yPos += 15;
    doc.text(formData.destinataireAdresse.split('\n')[0] || "", 40, yPos); yPos += 12; // Assuming address might have newlines
    if(formData.destinataireAdresse.split('\n')[1]) {
      doc.text(formData.destinataireAdresse.split('\n')[1] || "", 40, yPos); yPos += 12;
    }
    yPos += 25;

    // 4. Lieu et Date
    doc.text(`${formData.villeDocument}, le ${formData.dateDocument}`, 400, yPos); yPos += 30;

    // 5. Objet
    doc.setFont("helvetica", "bold");
    doc.text("Objet : Mise en demeure de payer", 40, yPos); yPos += 15;
    doc.setFont("helvetica", "normal");
    doc.text(`Lettre Recommandée avec Accusé de Réception (LRAR)`, 40, yPos); yPos += 30;

    // 6. Corps du texte
    doc.setFontSize(10);
    const textBody = [
      `Madame, Monsieur ${formData.destinataireNom},`,
      `Sauf erreur ou omission de votre part, vous restez redevable envers ${user?.company_name || user?.name || "mon client"} de la somme de ${formData.montantDu} € au titre de la facture n° ${formData.referenceFacture}.`,
      `Cette facture, arrivée à échéance, demeure à ce jour impayée malgré nos relances amiables.`,
      `En conséquence, je vous mets en demeure, par la présente, de régler la somme de ${formData.montantDu} € dans un délai de ${formData.delaiPaiementSupplementaire} jours à compter de la réception de cette lettre.`,
      `Ce règlement peut être effectué par virement bancaire sur le compte [RIB à insérer/préciser] ou par chèque à l'ordre de ${user?.company_name || user?.name || "mon client"}.`,
      `À défaut de règlement intégral dans le délai imparti, je me verrai contraint(e), conformément au mandat qui m'a été confié, de saisir la juridiction compétente afin d'obtenir le recouvrement forcé des sommes dues, avec intérêts et frais de procédure à votre charge.`,
      `Dans l'attente de votre prompt règlement, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`
    ];

    textBody.forEach(line => {
      const splitLines = doc.splitTextToSize(line, 520); // Adjust width as needed (A4 width - margins)
      doc.text(splitLines, 40, yPos);
      yPos += (splitLines.length * 12) + 6; // 12 for font size, 6 for spacing
    });
    yPos += 20;

    // 7. Signature
    doc.setFont("helvetica", "bold");
    doc.text("Maître Yankel BENSIMHON", 400, yPos); yPos += 12;
    doc.text("Avocat au Barreau de Paris", 400, yPos); yPos += 30;

    // 8. Footer (optional)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Ce document constitue une mise en demeure officielle.", 40, doc.internal.pageSize.height - 30);

    // --- End PDF Content ---

    doc.save(`Mise_en_demeure_${formData.destinataireNom.replace(/\s+/g, '_')}.pdf`);

    // Call the callback to inform parent about generation and potentially save metadata
    if (onGenerationComplete) {
      onGenerationComplete({
        claimId: claim.id,
        documentType: 'mise_en_demeure',
        formDataUsed: formData, // Data used for this specific generation
        statusToSet: 'mise_en_demeure' // Suggested new status for the claim
      });
    }
    setIsLoading(false);
  };

  if (!claim) { // Should not happen if used correctly inside a modal with a selected claim
    return <div className="p-4 text-red-500">Erreur : Aucune créance sélectionnée pour la génération.</div>;
  }

  return (
    <div className="p-2 sm:p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Générer une Mise en Demeure</h3>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); handleGenerateAndSave(); }} className="space-y-3">
        {/* Simplified form - adapt with more fields as needed */}
        <div>
          <label htmlFor="destinataireNom" className="block text-sm font-medium text-gray-600">Nom du Destinataire</label>
          <input type="text" name="destinataireNom" id="destinataireNom" value={formData.destinataireNom} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="destinataireAdresse" className="block text-sm font-medium text-gray-600">Adresse Destinataire</label>
          <textarea name="destinataireAdresse" id="destinataireAdresse" value={formData.destinataireAdresse} onChange={handleChange} required rows="2"
                    className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
         <div>
          <label htmlFor="montantDu" className="block text-sm font-medium text-gray-600">Montant Dû (€)</label>
          <input type="text" name="montantDu" id="montantDu" value={formData.montantDu} readOnly // Typically read-only from claim
                 className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="referenceFacture" className="block text-sm font-medium text-gray-600">Référence Facture</label>
          <input type="text" name="referenceFacture" id="referenceFacture" value={formData.referenceFacture} readOnly // Typically read-only
                 className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"/>
        </div>
         <div>
          <label htmlFor="delaiPaiementSupplementaire" className="block text-sm font-medium text-gray-600">Délai de paiement supplémentaire (jours)</label>
          <input type="number" name="delaiPaiementSupplementaire" id="delaiPaiementSupplementaire" value={formData.delaiPaiementSupplementaire} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
        {/* Add more fields here: villeDocument, dateDocument etc. if they need to be editable */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Génération en cours..." : "Générer et Télécharger PDF"}
        </button>
      </form>
    </div>
  );
}

// Old image loader, not directly used if logo is base64 or simple URL for addImage
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}
