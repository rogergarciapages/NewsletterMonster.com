import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { newsletter_id, sender } = req.query;

  if (!newsletter_id || !sender) {
    return res.status(400).json({ error: 'Missing newsletter_id or sender' });
  }

  const newsletterId = Array.isArray(newsletter_id) ? parseInt(newsletter_id[0], 10) : parseInt(newsletter_id, 10);

  try {
    const newsletterData = await prisma.newsletter.findUnique({
      where: { newsletter_id: newsletterId },
      include: {
        User: true,
      },
    });

    if (!newsletterData) {
      console.error('Newsletter not found', { newsletterId, sender });
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    const slugifiedSender = slugify(newsletterData.sender || '');

    if (slugifiedSender !== sender) {
      console.error('Sender mismatch', { slugifiedSender, sender });
      return res.status(404).json({ error: 'Sender not found' });
    }

    return res.status(200).json(newsletterData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Internal Server Error', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      console.error('Unexpected error', error);
      return res.status(500).json({ error: 'Internal Server Error', details: 'An unexpected error occurred' });
    }
  }
};

export default handler;
