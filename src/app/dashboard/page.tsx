'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Claim } from '@prisma/client'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [claims, setClaims] = useState<Claim[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/claims')
        .then((res) => res.json())
        .then(setClaims)
    }
  }, [status])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied</p>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={() => signOut()} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
          Sign Out
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">My Claims</h2>
        {claims.length === 0 ? (
          <p>No claims found.</p>
        ) : (
          <table className="w-full table-auto border border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Debtor</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="border px-4 py-2">{claim.debtor_name}</td>
                  <td className="border px-4 py-2">{claim.claim_amount}</td>
                  <td className="border px-4 py-2">{claim.status}</td>
                  <td className="border px-4 py-2">{new Date(claim.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
