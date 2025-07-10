export default function TimeLineRecouvrement() {
  const steps = [
    {
      title: "1. Création du dossier",
      text: "Importez vos créances ou saisissez-les en ligne. Ajoutez vos documents justificatifs en toute sécurité.",
      icon: "📝",
    },
    {
      title: "2. Relances & mise en demeure",
      text: "Relance automatisée par email ou courrier. Génération de la mise en demeure personnalisée avec logo et mentions d’avocat.",
      icon: "📨",
    },
    {
      title: "3. Action judiciaire",
      text: "En un clic : dossier transmis à l’avocat pour l’injonction de payer ou l’assignation en référé en urgence.",
      icon: "⚖️",
    },
    {
      title: "4. Encaissement ou classement",
      text: "En cas de paiement, vous clôturez le dossier en un clic ; sinon, nous poursuivons jusqu’au recouvrement ou classement grâce à notre réseau de Commissaires de Justices.",
      icon: "✅",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-4">
          <span className="text-3xl">{step.icon}</span>
          <div>
            <h3 className="text-xl font-semibold text-blue-800">{step.title}</h3>
            <p className="text-gray-700">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
