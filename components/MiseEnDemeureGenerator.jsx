import React, { useState } from "react";
import { jsPDF } from "jspdf";

const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Logo.png"; // Mets ici l’URL de TON logo
const FOOTER = "Service opéré par le Cabinet d'avocat Yankel BENSIMHON • 43 Avenue Foch 75116 Paris";

export default function MiseEnDemeureGenerator() {
  const [form, setForm] = useState({
    creditor: "",
    creditorAddress: "",
    debtor: "",
    debtorAddress: "",
    amount: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    city: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // Logo
    try {
      const logoData = await toDataURL(LOGO_URL);
      doc.addImage(logoData, "PNG", 15, 10, 40, 18);
    } catch (err) {
      // Ignore si le logo ne se charge pas
    }

    // En-tête
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MISE EN DEMEURE", 105, 40, { align: "center" });

    // Parties
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Créancier : ${form.creditor}`, 15, 50);
    doc.text(form.creditorAddress, 15, 55);
    doc.text(`Débiteur : ${form.debtor}`, 15, 65);
    doc.text(form.debtorAddress, 15, 70);

    // Corps personnalisé (modifie ici ton texte modèle)
    let corps = `
${form.city}, le ${form.date}

Objet : Mise en demeure de payer la facture n° ${form.invoiceNumber}

Madame, Monsieur,

Nous vous rappelons que la facture n° ${form.invoiceNumber} d'un montant de ${form.amount} €, émise le ${form.invoiceDate} et venue à échéance le ${form.dueDate}, demeure impayée à ce jour.

En conséquence, nous vous mettons en demeure de procéder au règlement de cette somme sous un délai de 8 jours à compter de la réception de la présente, faute de quoi nous nous réservons le droit d’engager toute procédure judiciaire nécessaire à la sauvegarde de nos droits, sans autre avis ni délai.

Nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.

`;

    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.text(doc.splitTextToSize(corps, 180), 15, 85);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(FOOTER, 15, 287);

    doc.save("Mise_en_demeure.pdf");
    setLoading(false);
  };

  // Convertit une image en base64
  function toDataURL(url) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow my-8">
      <h2 className="text-xl font-bold mb-4">Générateur de mise en demeure</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold">Créancier</label>
          <input name="creditor" className="border p-2 rounded w-full" value={form.creditor} onChange={handleChange} />
          <input name="creditorAddress" className="border p-2 rounded w-full mt-2" placeholder="Adresse créancier" value={form.creditorAddress} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold">Débiteur</label>
          <input name="debtor" className="border p-2 rounded w-full" value={form.debtor} onChange={handleChange} />
          <input name="debtorAddress" className="border p-2 rounded w-full mt-2" placeholder="Adresse débiteur" value={form.debtorAddress} onChange={handleChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Montant (€)</label>
          <input name="amount" className="border p-2 rounded w-full" value={form.amount} onChange={handleChange} />
          <label className="mt-2 block">Numéro facture</label>
          <input name="invoiceNumber" className="border p-2 rounded w-full" value={form.invoiceNumber} onChange={handleChange} />
        </div>
        <div>
          <label>Date facture</label>
          <input name="invoiceDate" className="border p-2 rounded w-full" value={form.invoiceDate} onChange={handleChange} />
          <label className="mt-2 block">Date échéance</label>
          <input name="dueDate" className="border p-2 rounded w-full" value={form.dueDate} onChange={handleChange} />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div>
          <label>Ville</label>
          <input name="city" className="border p-2 rounded w-full" value={form.city} onChange={handleChange} />
        </div>
        <div>
          <label>Date</label>
          <input name="date" className="border p-2 rounded w-full" value={form.date} onChange={handleChange} placeholder="jj/mm/aaaa" />
        </div>
      </div>
      <button
        onClick={handleDownloadPDF}
        disabled={loading}
        className="mt-2 bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition"
      >
        {loading ? "Génération..." : "Télécharger PDF"}
      </button>
    </div>
  );
}
