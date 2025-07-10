// components/PiecesChecklist.jsx

const PIECES = [
  { code: "contrat", label: "Contrat / devis signé ou échange de mails/whatsapp", obligatoire: true },
  { code: "livraison", label: "Bon de livraison / accusé réception / PV de recette", obligatoire: true },
  { code: "facture", label: "Factures impayées", obligatoire: true },
  { code: "grand_livre", label: "Grand livre client (récapitulatif impayés)", obligatoire: true },
];

export default function PiecesChecklist({ checkedPieces = [], onCheck }) {
  return (
    <div className="p-4 bg-blue-50 rounded-xl mt-4 mb-6">
      <h4 className="font-semibold text-blue-700 mb-3">Pièces à joindre au dossier</h4>
      <ul className="space-y-2">
        {PIECES.map(piece => (
          <li key={piece.code} className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={checkedPieces.includes(piece.code)}
              onChange={() => onCheck(piece.code)}
            />
            <span className="font-medium">{piece.label}</span>
            {piece.obligatoire && <span className="text-xs ml-2 text-orange-600">(obligatoire)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
