import { prisma } from '../lib/prisma';

export default async function handler(_req: any, res: any) {
  const quotes = await prisma.quote.findMany({ where: { hidden: true }, orderBy: { totalVotes: 'desc' } });
  res.status(200).json({ quotes });
}
