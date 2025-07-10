// components/MiseEnDemeureGenerator.jsx

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Helper function pour charger une image (logo) et la convertir en base64
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

export default function MiseEnDemeureGenerator() {
  const logoUrl = "URL_OU_BASE64_DE_TON_LOGO";

  // États des champs
  const [societeC, setSocieteC] = useState("");
  const [capital, setCapital] = useState("");
  const [adresseC, setAdresseC] = useState("");
  const [villeC, setVilleC] = useState("");
  const [siren, setSiren] = useState("");
  const [societeD, setSocieteD] = useState("");
  const [adresseD, setAdresseD] = useState("");
  const [villeD, setVilleD] = useState("");
  const [factures, setFactures] = useState([{ numero: "", date: "", montant: "" }]);

  // Ajout / modification / suppression des factures
  const addFacture = () =>
    setFactures([...factures, { numero: "", date: "", montant: "" }]);
  const updateFacture = (i, key, value) => {
    const tmp = [...factures];
    tmp[i][key] = value;
    setFactures(tmp);
  };
  const removeFacture = (i) => {
    const tmp = [...factures];
    tmp.splice(i, 1);
    setFactures(tmp);
  };

  // Calcul du total
  const total = factures.reduce((sum, f) => sum + parseFloat(f.montant || 0), 0);

  // Conversion en lettres simplifiée
  const montantEnLettres = (n) =>
    n.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });

  const handleDownload = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 20;

    // 1) Logo
    if (logoUrl) {
      try {
        const imgData = await loadImage(logoUrl);
        doc.addImage(imgData, "PNG", 10, 8, 30, 15);
      } catch {}
    }

    // 2) En-tête
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Mise en demeure générée par Maître Yankel BENSIMHON via Yesod", 50, 20);

    // 3) Créancier
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text(`${societeC} — Capital social : ${capital} €`, 10, 35);
    doc.text(`${adresseC} — ${villeC}`, 10, 41);
    doc.text(`N° SIREN : ${siren}`, 10, 47);

    // 4) Destinataire
    y = 55;
    doc.text("À l’attention de :", 10, y);
    doc.text(societeD, 15, y + 6);
    doc.text(adresseD, 15, y + 12);
    doc.text(villeD, 15, y + 18);

    // 5) Objet et date
    y +=  thirty; // 55 + 30 = 85
    const today = new Date().toLocaleDateString("fr-FR");
    doc.text("Objet : Mise en demeure avant poursuites", 10, y);
    doc.text(`Paris, le ${today}`, 10, y + 6);

    // 6) Corps
    y +=  fifteen; // 85 + 15 = 100
    doc.setFontSize(10);
    doc.text(
      `Madame, Monsieur,\n\nJe représente la société ${societeC} (SIREN ${siren}, RCS ${villeC}), envers qui vous êtes redevables des sommes suivantes :`,
      10,
      y
    );

    // 7) Listing factures
    factures.forEach((f, i) => {
      doc.text(
        `- Facture n°${f.numero} du ${f.date} : ${f.montant} € TTC`,
        12,
        y +  (i + 4) * 6
      );
    });

    // 8) Total
    y += factures.length * 6 + 30;
    doc.text(`Soit un total de : ${total.toFixed(2)} € TTC`, 10, y);

    // 9) Mise en demeure formelle
    y += 15;
    doc.text(
      `JE VOUS METS EN DEMEURE DE RÉGLER LA SOMME DE ${total.toFixed(
        2
      )} € (${montantEnLettres(total)}) SOUS HUITAINE À COMPTER DE LA RÉCEPTION DE LA PRÉSENTE LETTRE RECOMMANDÉE.`,
      10,
      y
    );

    // 10) Signature
    y += 30;
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text(
      "Maître Yankel BENSIMHON\nCabinet d’avocat — Yesod\n43 avenue Foch, 75116 Paris",
      10,
      y
    );

    // 11) Footer
    doc.setFont("helvetica", "normal")
       .setFontSize(8)
       .setTextColor(120);
    doc.text(
      "Service opéré par le Cabinet d’avocat Yankel Bensimhon, inscrit au Barreau de Paris — Yesod",
      10,
      285
    );
    doc.text("43 avenue Foch, 75116 Paris", 10, 290);

    // Sauvegarde
    doc.save("Mise_en_demeure_Yesod.pdf");
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Générateur de mise en demeure</h2>

      {/* Formulaire Créancier */}
      <input
        className="input mb-2"
        placeholder="Nom de la société créancière"
        value={societeC}
        onChange={(e) => setSocieteC(e.target.value)}
      />
      <input
        className="input mb-2"
        placeholder="Capital social (€)"
        value={capital}
        onChange={(e) => setCapital(e.target.value)}
      />
      <input
        className="input mb-2"
        placeholder="Adresse créancier"
        value={adresseC}
        onChange={(e) => setAdresseC(e.target.value)}
      />
      <input
        className="input mb-2"
        placeholder="Ville créancier"
        value={villeC}
        onChange={(e) => setVilleC(e.target.value)}
      />
      <input
        className="input mb-4"
        placeholder="N° SIREN"
        value={siren}
        onChange={(e) => setSiren(e.target.value)}
      />

      {/* Formulaire Débiteur */}
      <input
        className="input mb-2"
        placeholder="Nom de la société débitrice"
        value={societeD}
        onChange={(e) => setSocieteD(e.target.value)}
      />
      <input
        className="input mb-2"
        placeholder="Adresse débiteur"
        value={adresseD}
        onChange={(e) => setAdresseD(e.target.value)}
      />
      <input
        className="input mb-4"
        placeholder="Ville débiteur"
        value={villeD}
        onChange={(e) => setVilleD(e.target.value)}
      />

      {/* Factures */}
      <h3 className="font-semibold mb-2">Factures</h3>
      {factures.map((f, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="input flex-1"
            placeholder="N° facture"
            value={f.numero}
            onChange={(e) => updateFacture(i, "numero", e.target.value)}
          />
          <input
            className="input flex-1"
            placeholder="Date (JJ/MM/AAAA)"
            value={f.date}
            onChange={(e) => updateFacture(i, "date", e.target.value)}
          />
          <input
            className="input flex-1"
            placeholder="Montant TTC"
            value={f.montant}
            onChange={(e) => updateFacture(i, "montant", e.target.value)}
          />
          {factures.length > 1 && (
            <button
              type="button"
              onClick={() => removeFacture(i)}
              className="text-red-500"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addFacture}
        className="text-blue-700 mb-4"
      >
        + Ajouter une facture
      </button>

      <div className="font-bold mb-4">Total : {total.toFixed(2)} €</div>

      <button
        onClick={handleDownload}
        className="bg-blue-700 text-white py-2 px-4 rounded"
      >
        Télécharger (PDF)
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
