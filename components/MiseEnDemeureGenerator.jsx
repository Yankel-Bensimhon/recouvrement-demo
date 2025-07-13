import { useState } from "react";
import { jsPDF } from "jspdf";

export default function MiseEnDemeureGenerator() {
  const [form, setForm] = useState({
    societeC: "",
    adresseC: "",
    codePostalC: "",
    villeC: "",
    societeD: "",
    adresseD: "",
    codePostalD: "",
    villeD: "",
    representantD: "",
    fonctionD: "",
    factures: [{ numero: "", date: "", montant: "" }],
  });

  const total = form.factures.reduce((sum, f) => sum + (parseFloat(f.montant) || 0), 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFactureChange = (i, e) => {
    const newFactures = [...form.factures];
    newFactures[i][e.target.name] = e.target.value;
    setForm({ ...form, factures: newFactures });
  };

  const addFacture = () => {
    setForm({ ...form, factures: [...form.factures, { numero: "", date: "", montant: "" }] });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("MISE EN DEMEURE AVANT POURSUITES", 10, y);
    y += 12;
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text(`Créancier : ${form.societeC}`, 10, y); y += 8;
    doc.text(`Adresse : ${form.adresseC}, ${form.codePostalC} ${form.villeC}`, 10, y); y += 8;
    doc.text(`Débiteur : ${form.societeD}`, 10, y); y += 8;
    doc.text(`Adresse : ${form.adresseD}, ${form.codePostalD} ${form.villeD}`, 10, y); y += 8;
    doc.text(`Représentant légal : ${form.representantD} (${form.fonctionD})`, 10, y); y += 10;

    const today = new Date().toLocaleDateString("fr-FR");
    doc.text(`Paris, le ${today}`, 10, y); y += 12;

    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Objet : Mise en demeure de payer", 10, y); y += 10;
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text(
      "Je vous informe que vous restez redevable envers notre client des sommes suivantes au titre des factures impayées ci-dessous :",
      10, y, { maxWidth: 180 }
    );
    y += 14;

    // Factures
    form.factures.forEach((f, i) => {
      if (!f.numero) return;
      doc.text(
        `• Facture n°${f.numero} du ${f.date} - Montant TTC : ${f.montant} €`,
        10,
        y
      );
      y += 8;
    });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Total dû : ${total.toFixed(2)} €`, 10, y); y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(
      `Malgré nos relances amiables, la somme reste impayée à ce jour. Nous vous mettons en demeure de régler le montant total sous 8 jours à réception de la présente, faute de quoi des poursuites judiciaires pourront être engagées sans autre avis.`,
      10,
      y,
      { maxWidth: 180 }
    );
    y += 20;
    doc.text(
      "Nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.",
      10,
      y
    );
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Yesod - Opéré par le cabinet d’avocat Yankel Bensimhon", 10, y);
    y += 8;
    doc.setFont("helvetica", "italic");
    doc.text("Avocat au Barreau de Paris, 43 avenue Foch, 75116 Paris", 10, y);

    doc.save(`Mise_en_demeure_${form.societeD.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <form className="space-y-2" onSubmit={e => {e.preventDefault(); generatePDF();}}>
      <input className="w-full border p-2 rounded" placeholder="Nom de la société créancière" name="societeC" value={form.societeC} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Adresse créancier" name="adresseC" value={form.adresseC} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Code postal créancier" name="codePostalC" value={form.codePostalC} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Ville créancier" name="villeC" value={form.villeC} onChange={handleChange} required />

      <input className="w-full border p-2 rounded" placeholder="Nom de la société débitrice" name="societeD" value={form.societeD} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Adresse débiteur" name="adresseD" value={form.adresseD} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Code postal débiteur" name="codePostalD" value={form.codePostalD} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Ville débiteur" name="villeD" value={form.villeD} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Nom du représentant légal débiteur" name="representantD" value={form.representantD} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" placeholder="Fonction du représentant légal débiteur" name="fonctionD" value={form.fonctionD} onChange={handleChange} required />

      <div className="font-bold mt-4 mb-2">Factures</div>
      {form.factures.map((f, i) => (
        <div key={i} className="flex flex-wrap gap-2 mb-2">
          <input className="flex-1 border p-2 rounded" placeholder="N° facture" name="numero" value={f.numero} onChange={e => handleFactureChange(i, e)} />
          <input className="flex-1 border p-2 rounded" placeholder="Date (JJ/MM/AAAA)" name="date" value={f.date} onChange={e => handleFactureChange(i, e)} />
          <input className="flex-1 border p-2 rounded" placeholder="Montant TTC" name="montant" value={f.montant} onChange={e => handleFactureChange(i, e)} />
        </div>
      ))}
      <button type="button" onClick={addFacture} className="text-blue-700 underline mb-2">+ Ajouter une facture</button>
      <div className="font-bold">Total : {total.toFixed(2)} €</div>
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded mt-2 w-full">Télécharger (PDF)</button>
    </form>
  );
}
