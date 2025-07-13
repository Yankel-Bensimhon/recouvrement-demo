import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Autocomplete from "react-google-autocomplete";

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

export default function MiseEnDemeureGenerator({ claim, user, onGenerationComplete }) {
  // The form now holds data that can be edited before generating the PDF.
  // It's pre-filled from the claim and user objects.
  const [apiKey, setApiKey] = useState("");
  const [formData, setFormData] = useState({
    creditorName: '',
    creditorStreet: '',
    creditorZip: '',
    creditorCity: '',
    debtorName: '',
    debtorStreet: '',
    debtorZip: '',
    debtorCity: '',
    invoiceReference: '',
    dueDate: '',
    claimAmount: 0,
    factures: [{ numero: "", date: "", montant: "" }],
    // Add any other fields you might need from the claim
  });

  useEffect(() => {
    fetch('/api/config/google-api-key')
      .then(res => res.json())
      .then(data => {
        console.log("API Key data:", data);
        setApiKey(data.apiKey);
      });
  }, []);

  // When the component mounts or the claim/user props change, update the form state.
  useEffect(() => {
    if (claim && user) {
        const debtorAddressParts = (claim.debtor_address || '').split(', ');
      setFormData({
        creditorName: user.company_name || 'Votre Société', // Fallback name
        creditorStreet: 'Votre Rue',
        creditorZip: '75000',
        creditorCity: 'Paris',
        debtorName: claim.debtor_name || '',
        debtorStreet: debtorAddressParts[0] || '',
        debtorZip: debtorAddressParts[1] || '',
        debtorCity: debtorAddressParts[2] || '',
        invoiceReference: claim.invoice_reference || '',
        dueDate: claim.due_date || '',
        claimAmount: claim.claim_amount || 0,
        factures: [{ numero: "", date: "", montant: "" }],
      });
    }
  }, [claim, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFactureChange = (i, e) => {
    const newFactures = [...formData.factures];
    newFactures[i][e.target.name] = e.target.value;
    setFormData({ ...formData, factures: newFactures });
  };

  const addFacture = () => {
    setFormData({ ...formData, factures: [...formData.factures, { numero: "", date: "", montant: "" }] });
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.creditorName) newErrors.creditorName = "Le nom du créancier est requis.";
    if (!formData.creditorStreet) newErrors.creditorStreet = "La rue du créancier est requise.";
    if (!formData.creditorZip) newErrors.creditorZip = "Le code postal du créancier est requis.";
    if (!formData.creditorCity) newErrors.creditorCity = "La ville du créancier est requise.";
    if (!formData.debtorName) newErrors.debtorName = "Le nom du débiteur est requis.";
    if (!formData.debtorStreet) newErrors.debtorStreet = "La rue du débiteur est requise.";
    if (!formData.debtorZip) newErrors.debtorZip = "Le code postal du débiteur est requis.";
    if (!formData.debtorCity) newErrors.debtorCity = "La ville du débiteur est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateAndSavePDF = () => {
    if (!validateForm()) {
      return;
    }
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("fr-FR");
    let y = 20;

    // --- PDF Content ---
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("MISE EN DEMEURE AVANT POURSUITES", 105, y, { align: 'center' });
    y += 15;

    // Creditor and Debtor Info
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("Créancier", 10, y);
    doc.text("Débiteur", 110, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(formData.creditorName, 10, y);
    doc.text(formData.debtorName, 110, y);
    y += 6;
    doc.text(`${formData.creditorStreet}, ${formData.creditorZip} ${formData.creditorCity}`, 10, y);
    doc.text(`${formData.debtorStreet}, ${formData.debtorZip} ${formData.debtorCity}`, 110, y, { maxWidth: 90 });
    y += 15;

    // Letter Details
    doc.text(`Paris, le ${today}`, 150, y);
    y += 12;
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Objet : Mise en demeure de payer", 10, y);
    y += 10;
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text(
      `Madame, Monsieur,`,
      10, y
    );
    y += 10;
    doc.text(
      `Sauf erreur ou omission de notre part, nous constatons que la créance référencée ci-dessous, arrivée à échéance, reste à ce jour impayée:`,
      10, y, { maxWidth: 190 }
    );
    y += 12;

    // Invoice Details
    doc.setFont("helvetica", "bold");
    formData.factures.forEach((f, i) => {
      if (!f.numero) return;
      doc.text(
        `• Facture n°${f.numero} du ${f.date} - Montant TTC : ${f.montant} €`,
        15,
        y
      );
      y += 8;
    });
    const total = formData.factures.reduce((sum, f) => sum + (parseFloat(f.montant) || 0), 0);
    doc.text(`Total dû : ${total.toFixed(2)} €`, 15, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.text(
      `En conséquence, nous vous mettons en demeure de nous régler la somme de ${parseFloat(formData.claimAmount).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} sous un délai de 8 (huit) jours à compter de la réception de la présente.`,
      10, y, { maxWidth: 190 }
    );
    y += 12;
    doc.text(
        `À défaut de paiement dans ce délai, nous serons contraints d'engager une procédure judiciaire à votre encontre, ce qui entraînerait des frais supplémentaires à votre charge.`,
      10, y, { maxWidth: 190 }
    );
    y += 12;
    doc.text(
      "Cette mise en demeure vaut comme dernier avis amiable avant le lancement de poursuites.",
      10, y, { maxWidth: 190 }
    );
    y += 20;

    doc.text(
      "Nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.",
      10, y
    );
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text(formData.creditorName, 150, y);

    // --- Save and Callback ---
    // Save the PDF to be downloaded by the user
    doc.save(`Mise_en_demeure_${formData.debtorName.replace(/\s+/g, '_')}.pdf`);

    // Call the callback function to notify the parent modal
    if (onGenerationComplete) {
      onGenerationComplete({
        claimId: claim.id,
        documentType: 'mise_en_demeure',
        formDataUsed: formData, // The data used for this specific PDF
        statusToSet: 'mise_en_demeure', // The new status for the claim
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); generateAndSavePDF(); }}>
      {/* The form is now for reviewing and making minor edits, not for initial input */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Vérifier les informations</h3>
        <div className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Créancier</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nom</label>
                        <input type="text" name="creditorName" value={formData.creditorName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        {errors.creditorName && <p className="text-red-500 text-xs mt-1">{errors.creditorName}</p>}
                    </div>
                </div>
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-600">Adresse</label>
                {apiKey ? (
                    <Autocomplete
                        apiKey={apiKey}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onPlaceSelected={(place) => {
                            const street = place.address_components.find(c => c.types.includes('route'))?.long_name || '';
                            const zip = place.address_components.find(c => c.types.includes('postal_code'))?.long_name || '';
                            const city = place.address_components.find(c => c.types.includes('locality'))?.long_name || '';
                            setFormData(prev => ({ ...prev, creditorStreet: street, creditorZip: zip, creditorCity: city }));
                        }}
                        options={{
                            types: ["address"],
                            componentRestrictions: { country: "fr" },
                        }}
                    />
                ) : (
                    <p className="text-sm text-gray-500">Chargement de l'autocomplétion...</p>
                )}
                </div>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Débiteur</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nom</label>
                        <input type="text" name="debtorName" value={formData.debtorName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        {errors.debtorName && <p className="text-red-500 text-xs mt-1">{errors.debtorName}</p>}
                    </div>
                </div>
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-600">Adresse</label>
                {apiKey ? (
                    <Autocomplete
                        apiKey={apiKey}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onPlaceSelected={(place) => {
                            const street = place.address_components.find(c => c.types.includes('route'))?.long_name || '';
                            const zip = place.address_components.find(c => c.types.includes('postal_code'))?.long_name || '';
                            const city = place.address_components.find(c => c.types.includes('locality'))?.long_name || '';
                            setFormData(prev => ({ ...prev, debtorStreet: street, debtorZip: zip, debtorCity: city }));
                        }}
                        options={{
                            types: ["address"],
                            componentRestrictions: { country: "fr" },
                        }}
                    />
                ) : (
                    <p className="text-sm text-gray-500">Chargement de l'autocomplétion...</p>
                )}
                </div>
            </div>
        </div>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails des factures</h3>
        {formData.factures.map((f, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-2">
                <input className="flex-1 border p-2 rounded" placeholder="N° facture" name="numero" value={f.numero} onChange={e => handleFactureChange(i, e)} autoComplete="off" />
                <input className="flex-1 border p-2 rounded" placeholder="Date (JJ/MM/AAAA)" name="date" value={f.date} onChange={e => handleFactureChange(i, e)} />
                <input className="flex-1 border p-2 rounded" placeholder="Montant TTC" name="montant" value={f.montant} onChange={e => handleFactureChange(i, e)} />
            </div>
        ))}
        <button type="button" onClick={addFacture} className="text-blue-700 underline mb-2">+ Ajouter une facture</button>
        <div className="font-bold">Total : {formData.factures.reduce((sum, f) => sum + (parseFloat(f.montant) || 0), 0).toFixed(2)} €</div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out"
        >
          Générer et Télécharger la Mise en Demeure
        </button>
      </div>
    </form>
  );
}
