import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const dossiers = await prisma.dossier.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(dossiers)
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  if (req.method === 'POST') {
    const { titre, status, userId } = req.body
    if (!titre || !status || !userId) {
      return res.status(400).json({ message: 'Champs requis manquants' })
    }

    try {
      const dossier = await prisma.dossier.create({
        data: { titre, status, userId },
      })
      return res.status(201).json(dossier)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erreur serveur lors de la création' })
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' })
}
