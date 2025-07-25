// Card component to display summary information about a dossier.
// Clicking the card navigates to the dossier's detail page.

import Link from 'next/link';

export interface DossierSummary {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function DossierCard({ dossier }: { dossier: DossierSummary }) {
  return (
    <Link href={`/dossiers/${dossier.id}`}>
      <a className="block p-4 border rounded-lg hover:shadow bg-white">
        <h3 className="text-lg font-semibold">{dossier.title}</h3>
        <p className="text-sm text-gray-500">{dossier.status}</p>
        <p className="text-sm text-gray-400">
          {new Date(dossier.created_at).toLocaleDateString()}
        </p>
      </a>
    </Link>
  );
}
