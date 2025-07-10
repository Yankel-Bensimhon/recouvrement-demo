const steps = [
  {
    title: "1. Création du dossier",
    text: "Importez vos créances ou saisissez-les en ligne. Ajoutez vos documents justificatifs en toute sécurité.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><path d="M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: "2. Relances & mise en demeure",
    text: "Relance automatisée par email ou courrier. Génération de la mise en demeure personnalisée avec logo et mentions d’avocat.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><path d="M8 10h8M8 14h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: "3. Action judiciaire",
    text: "En un clic : dossier transmis à l’avocat pour l’injonction de payer ou l’assignation. Suivi du dossier et preuve horodatée.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><path d="M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="2" fill="#fff" /></svg>
    ),
  },
  {
    title: "4. Encaissement ou classement",
    text: "En cas de paiement, vous clôturez le dossier en un clic ; sinon, nous poursuivons jusqu’au recouvrement ou classement.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
];

export default function RecouvrementTimeline() {
  return (
    <section className="py-16 bg-white" id="timeline">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-10 text-center">Comment ça marche ?</h2>
        <ol className="relative border-l-4 border-blue-200 ml-6">
          {steps.map((step, idx) => (
            <li key={step.title} className="mb-14 ml-4 flex items-start group">
              <div className="flex-shrink-0 mr-4">
                <span className="block rounded-full bg-blue-700 p-1 shadow-lg transform group-hover:scale-105 transition">{step.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
