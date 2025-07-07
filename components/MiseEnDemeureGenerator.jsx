import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function MiseEnDemeureGenerator() {
  const [form, setForm] = useState({
    creditorType: "Société",
    creditorName: "",
    creditorAddress: "",
    creditorEmail: "",
    debtorType: "Société",
    debtorName: "",
    debtorAddress: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    amount: "",
    object: "",
    paymentDelay: "8",
  });
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Template de la lettre
  const generateLetter = () => {
    return `
${form.creditorType} ${form.creditorName}
${form.creditorAddress}
${form.creditorEmail && `Email : ${form.creditorEmail}`}

À
${form.debtorType} ${form.debtorName}
${form.debtorAddress}

Le ${new Date().toLocaleDateString("fr-FR")}

Objet : Mise en demeure de payer – Facture n°${form.invoiceNumber} du ${form.invoiceDate} – Montant : ${form.amount} €

Madame, Monsieur,

Je me permets, par la présente, de vous mettre en demeure de procéder au paiement de la somme de ${form.amount} €, relative à la facture n°${form.invoiceNumber} émise le ${form.invoiceDate}, venue à échéance le ${form.dueDate}, restée impayée à ce jour.

Malgré nos précédentes relances, le paiement n’a toujours pas été effectué. Je vous rappelle que le non-règlement de cette créance constitue un manquement à vos obligations contractuelles (${form.object}).

En conséquence, je vous mets en demeure de régler ladite somme sous ${form.paymentDelay} jours à compter de la réception de ce courrier. À défaut de paiement dans ce délai, nous nous réservons le droit d’engager toute procédure de recouvrement, y compris judiciaire, à vos frais exclusifs.

Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées.

${form.creditorType} ${form.creditorName}

Pièces jointes : copie de la facture
`;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setPreview(generateLetter());
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = generateLetter().split("\n");
    let y = 10;
    lines.forEach((line) => {
      doc.text(line, 10, y);
      y += 8;
    });
    doc.save("Mise_en_demeure.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 my-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Générez votre lettre de mise en demeure gratuitement</h1>
      <form className="space-y-4" onSubmit={handlePreview}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Type créancier</label>
            <select name="creditorType" value={form.creditorType} onChange={handleChange} className="w-full border rounded p-2">
              <option>Société</option>
              <option>Monsieur</option>
              <option>Madame</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Nom / Société (créancier)</label>
            <input type="text" name="creditorName" value={form.creditorName} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="col-span-2">
            <label className="font-semibold">Adresse (créancier)</label>
            <input type="text" name="creditorAddress" value={form.creditorAddress} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="col-span-2">
            <label className="font-semibold">E-mail (créancier)</label>
            <input type="email" name="creditorEmail" value={form.creditorEmail} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        <hr className="my-2" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Type débiteur</label>
            <select name="debtorType" value={form.debtorType} onChange={handleChange} className="w-full border rounded p-2">
              <option>Société</option>
              <option>Monsieur</option>
              <option>Madame</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Nom / Société (débiteur)</label>
            <input type="text" name="debtorName" value={form.debtorName} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="col-span-2">
            <label className="font-semibold">Adresse (débiteur)</label>
            <input type="text" name="debtorAddress" value={form.debtorAddress} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
        </div>
        <hr className="my-2" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">N° de facture/contrat</label>
            <input type="text" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="font-semibold">Date de facture</label>
            <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="font-semibold">Date d’échéance</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="font-semibold">Montant dû (€)</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
        </div>
        <div>
          <label className="font-semibold">Objet de la créance (nature : vente, prestation, etc.)</label>
          <input type="text" name="object" value={form.object} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="font-semibold">Délai de paiement demandé (jours)</label>
          <input type="number" name="paymentDelay" value={form.paymentDelay} onChange={handleChange} className="w-full border rounded p-2" min="5" max="30" required />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="rgpd" required className="mr-2" />
          <label htmlFor="rgpd" className="text-sm">J’accepte que mes données soient utilisées pour la génération du document conformément à la politique de confidentialité.</label>
        </div>
        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-bold hover:bg-blue-700 transition">Prévisualiser la lettre</button>
          {showPreview && (
            <button type="button" className="bg-green-600 text-white rounded px-4 py-2 font-bold hover:bg-green-700 transition" onClick={handleDownloadPDF}>
              Télécharger PDF
            </button>
          )}
        </div>
      </form>
      {showPreview && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Prévisualisation</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 rounded p-4">{preview}</pre>
        </div>
      )}
    </div>
  );
}
