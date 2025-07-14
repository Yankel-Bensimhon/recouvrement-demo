import { useEffect, useState } from 'react'

interface Dossier {
  id: string
  titre: string
  status: string
  createdAt: string
  user: {
    email: string
  }
}

interface User {
  id: string
  email: string
}

const STATUTS = ['en_attente', 'en_cours', 'clôturé']

export default function AdminDossiersPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({ titre: '', status: 'en_attente', userId: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dossiers')
      .then((res) => res.json())
      .then((data) => {
        setDossiers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur lors du chargement des dossiers')
        setLoading(false)
      })

    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/dossiers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newDossier = await res.json()
      setDossiers([newDossier, ...dossiers])
      setForm({ titre: '', status: 'en_attente', userId: '' })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dossiers en cours</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Titre"
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border px-2 py-1"
        >
          {STATUTS.map((s) => (
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

      {!loading && dossiers.length === 0 && (
        <p className="text-orange-500">Aucun dossier trouvé.</p>
      )}

      {!loading && dossiers.length > 0 && (
        <table className="w-full table-auto border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Titre</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Client</th>
              <th className="border px-4 py-2">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((d) => (
              <tr key={d.id}>
                <td className="border px-4 py-2">{d.titre}</td>
                <td className="border px-4 py-2">{d.status}</td>
                <td className="border px-4 py-2">{d.user?.email}</td>
                <td className="border px-4 py-2">
                  {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
