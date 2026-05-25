import { prisma } from './lib/prisma';

export default async function handler(_req: any, res: any) {
  const total = await prisma.quote.count({ where: { hidden: false } });
  if (!total) return res.status(404).json({ error: 'No quotes found' });

  const skip = Math.floor(Math.random() * total);
  const quote = await prisma.quote.findFirst({
    where: { hidden: false },
    skip,
    select: {
      id: true, text: true, type: true, likes: true, dislikes: true, totalVotes: true, scorePercent: true,
    },
  });

  return res.status(200).json({ quote });
}
