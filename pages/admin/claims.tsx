import { useEffect, useState } from 'react'
import { Claim, User } from '@prisma/client'

const STATUSES = ['nouveau', 'mise_en_demeure', 'injonction', 'solde', 'perdu']

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({ debtor_name: '', status: 'nouveau', userId: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/claims')
      .then((res) => res.json())
      .then((data) => {
        setClaims(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur lors du chargement des créances')
        setLoading(false)
      })

    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newClaim = await res.json()
      setClaims([newClaim, ...claims])
      setForm({ debtor_name: '', status: 'nouveau', userId: '' })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créances en cours</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Nom du débiteur"
          value={form.debtor_name}
          onChange={(e) => setForm({ ...form, debtor_name: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border px-2 py-1"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          className="border px-2 py-1"
          required
        >
          <option value="">-- Choisir un client --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.email}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          Ajouter
        </button>
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && claims.length === 0 && (
        <p className="text-orange-500">Aucune créance trouvée.</p>
      )}

      {!loading && claims.length > 0 && (
        <table className="w-full table-auto border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Débiteur</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Client</th>
              <th className="border px-4 py-2">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td className="border px-4 py-2">{c.debtor_name}</td>
                <td className="border px-4 py-2">{c.status}</td>
                <td className="border px-4 py-2">{c.user?.email}</td>
                <td className="border px-4 py-2">
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
