import { NextApiRequest, NextApiResponse } from 'next';
import { fetchNewsletters } from '@/lib/fetchNewsletters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skip = 0, take = 10 } = req.query;

  try {
    const newsletters = await fetchNewsletters(Number(skip), Number(take));
    res.status(200).json(newsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Error fetching newsletters' });
  }
}
