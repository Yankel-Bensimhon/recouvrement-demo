import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}
