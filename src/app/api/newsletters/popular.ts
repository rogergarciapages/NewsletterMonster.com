import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skip = 0, take = 10 } = req.query;

  try {
    const newsletters = await prisma.newsletter.findMany({
      where: {
        OR: [
          { likes_count: { gt: 0 } },
          { you_rocks_count: { gt: 0 } },
        ],
      },
      orderBy: [
        { likes_count: 'desc' },
        { you_rocks_count: 'desc' },
        { created_at: 'desc' },
      ],
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

    res.status(200).json(newsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Error fetching newsletters' });
  }
}
