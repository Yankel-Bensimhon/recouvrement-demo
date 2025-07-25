import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const endpoint = `${BACKEND_URL}/api/claims`;

  try {
    if (method === 'GET') {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { cookie: req.headers.cookie || '' },
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (method === 'POST') {
      const body = req.body;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.cookie || '',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (method === 'PUT') {
      const { id, ...updateData } = req.body;
      const url = `${endpoint}/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.cookie || '',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      const url = `${endpoint}/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { cookie: req.headers.cookie || '' },
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
