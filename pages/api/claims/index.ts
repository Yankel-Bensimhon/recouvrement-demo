import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const claims = await prisma.claim.findMany({
        include: { user: true },
        orderBy: { created_at: 'desc' },
      })
      return res.status(200).json(claims)
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  if (req.method === 'POST') {
    const { debtor_name, status, userId, claim_amount } = req.body
    if (!debtor_name || !status || !userId || !claim_amount) {
      return res.status(400).json({ message: 'Champs requis manquants' })
    }

    try {
      const claim = await prisma.claim.create({
        data: {
          debtor_name,
          status,
          userId,
          claim_amount
        },
      })
      return res.status(201).json(claim)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erreur serveur lors de la création' })
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' })
}
