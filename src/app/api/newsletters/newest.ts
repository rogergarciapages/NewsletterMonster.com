import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skip = 0, take = 10 } = req.query;

  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { created_at: 'desc' },
      skip: Number(skip),
      take: Number(take),
      select: {
        newsletter_id: true,
        subject: true,
        top_screenshot_url: true,
        you_rocks_count: true,
        likes_count: true,
        sender: true,
        created_at: true,
        summary: true,
        user_id: true,
        html_file_url: true,
        full_screenshot_url: true,
      },
    });

    const formattedNewsletters = newsletters.map(newsletter => ({
      ...newsletter,
      createdAt: newsletter.created_at, // Ensure createdAt is included in the response
    }));

    res.status(200).json(formattedNewsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Error fetching newsletters' });
  }
}
