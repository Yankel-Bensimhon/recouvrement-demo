import InjonctionGenerator from "../components/InjonctionGenerator";
export default function InjonctionPage() {
  // Pour test, on met un dossier de démo
  const dossier = {
    creditorName: "Société Demo",
    creditorAddress: "10 avenue des Champs, Paris",
    debtorName: "Client Test",
    debtorAddress: "20 rue du Test, Lyon",
    amount: "1200",
    invoiceNumber: "FAC-2024-001",
    invoiceDate: "2024-07-01",
    dueDate: "2024-07-15"
  };
  return (
    <div>
      <InjonctionGenerator dossier={dossier} />
    </div>
  );
}
