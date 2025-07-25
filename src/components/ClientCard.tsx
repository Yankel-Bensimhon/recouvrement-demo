// Card component to display summary information about a client.
// Clicking the card navigates to the client's detail page.

import Link from 'next/link';

export interface ClientSummary {
  id: number;
  name: string;
  email: string;
  company?: string | null;
}

export default function ClientCard({ client }: { client: ClientSummary }) {
  return (
    <Link href={`/clients/${client.id}`}>
      <a className="block p-4 border rounded-lg hover:shadow bg-white">
        <h3 className="text-lg font-semibold">{client.name}</h3>
        <p className="text-sm text-gray-500">{client.email}</p>
        {client.company && (
          <p className="text-sm text-gray-500">{client.company}</p>
        )}
      </a>
    </Link>
  );
}
