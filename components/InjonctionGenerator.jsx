import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function InjonctionGenerator({ dossier }) {
  const [tribunal, setTribunal] = useState("");
  const [penalites, setPenalites] = useState("");
  const [pieces, setPieces] = useState([]);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(\`Requête en injonction de payer
Tribunal: \${tribunal}

Demandeur:
\${dossier.creditorName}
\${dossier.creditorAddress}

Débiteur:
\${dossier.debtorName}
\${dossier.debtorAddress}

Objet:
Paiement de \${dossier.amount} € au titre de la facture n° \${dossier.invoiceNumber}, émise le \${dossier.invoiceDate}, venue à échéance le \${dossier.dueDate}.

Exposé:
Le débiteur n’ayant pas réglé sa dette malgré relances et mise en demeure restées infructueuses (lettres jointes), je sollicite une ordonnance d’injonction de payer.

Pièces jointes:
\${pieces.join(", ")}

Fait à [ville], le \${new Date().toLocaleDateString("fr-FR")}
[Signature]\`, 10, 10);
    doc.save("Injonction_de_payer.pdf");
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">Générateur d’injonction de payer</h3>
      <label>Tribunal compétent</label>
      <input type="text" className="border rounded p-2 mb-2 w-full" value={tribunal} onChange={e => setTribunal(e.target.value)} />
      <label>Pénalités de retard (optionnel)</label>
      <input type="text" className="border rounded p-2 mb-2 w-full" value={penalites} onChange={e => setPenalites(e.target.value)} />
      <label>Pièces à joindre</label>
      <input type="text" className="border rounded p-2 mb-2 w-full" value={pieces} onChange={e => setPieces(e.target.value.split(","))} placeholder="facture, mise en demeure..." />
      <button onClick={handleDownloadPDF} className="mt-2 bg-blue-700 text-white px-3 py-1 rounded">Télécharger PDF</button>
    </div>
  );
}
