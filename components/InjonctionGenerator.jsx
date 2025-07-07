import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function InjonctionGenerator({ dossier }) {
  const [tribunal, setTribunal] = useState("");
  const [penalites, setPenalites] = useState("");
  const [pieces, setPieces] = useState([]);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(
`Requete en injonction de payer
Tribunal: ${tribunal}

Demandeur:
${dossier.creditorName}
${dossier.creditorAddress}

Debiteur:
${dossier.debtorName}
${dossier.debtorAddress}

Objet:
Paiement de ${dossier.amount} EUR au titre de la facture n° ${dossier.invoiceNumber}, emise le ${dossier.invoiceDate}, venue a echeance le ${dossier.dueDate}.

Expose:
Le debiteur n'ayant pas regle sa dette malgre relances et mise en demeure restees infructueuses (lettres jointes), je sollicite une ordonnance d'injonction de payer.

Pieces jointes:
${pieces.join(", ")}

Fait a [ville], le ${new Date().toLocaleDateString("fr-FR")}
[Signature]`
    , 10, 10);
    doc.save("Injonction_de_payer.pdf");
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">Generateur d'injonction de payer</h3>
      <label>Tribunal competent</label>
      <input
        type="text"
        className="border rounded p-2 mb-2 w-full"
        value={tribunal}
        onChange={e => setTribunal(e.target.value)}
      />
      <label>Penalites de retard (optionnel)</label>
      <input
        type="text"
        className="border rounded p-2 mb-2 w-full"
        value={penalites}
        onChange={e => setPenalites(e.target.value)}
      />
      <label>Pieces a joindre</label>
      <input
        type="text"
        className="border rounded p-2 mb-2 w-full"
        value={pieces}
        onChange={e => setPieces(e.target.value.split(","))}
        placeholder="facture, mise en demeure..."
      />
      <button
        onClick={handleDownloadPDF}
        className="mt-2 bg-blue-700 text-white px-3 py-1 rounded"
      >
        Telecharger PDF
      </button>
    </div>
  );
}
