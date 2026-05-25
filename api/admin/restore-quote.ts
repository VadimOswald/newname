import { z } from 'zod';
import { prisma } from '../lib/prisma';

const schema = z.object({ quoteId: z.string().min(1).max(191) });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { quoteId } = schema.parse(req.body);
  const quote = await prisma.quote.update({ where: { id: quoteId }, data: { hidden: false } });
  res.status(200).json({ quote });
}
