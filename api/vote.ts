import { VoteValue } from '../src/generated/prisma';
import { prisma } from './lib/prisma';
import { calcStats } from './lib/quoteUtils';
import { assertRateLimit } from './lib/rateLimit';
import { voteSchema } from './lib/validation';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = voteSchema.parse(req.body);
    assertRateLimit(`${payload.telegramUserId}:${payload.quoteId}`);

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.vote.findUnique({
        where: { quoteId_telegramUserId: { quoteId: payload.quoteId, telegramUserId: payload.telegramUserId } },
      });

      if (!existing) {
        await tx.vote.create({ data: { quoteId: payload.quoteId, telegramUserId: payload.telegramUserId, value: payload.value as VoteValue } });
      } else if (existing.value !== payload.value) {
        await tx.vote.update({ where: { id: existing.id }, data: { value: payload.value as VoteValue } });
      }

      const grouped = await tx.vote.groupBy({ by: ['value'], where: { quoteId: payload.quoteId }, _count: { _all: true } });
      const likes = grouped.find((g) => g.value === VoteValue.like)?._count._all ?? 0;
      const dislikes = grouped.find((g) => g.value === VoteValue.dislike)?._count._all ?? 0;
      const stats = calcStats(likes, dislikes);

      const quote = await tx.quote.update({
        where: { id: payload.quoteId },
        data: { likes, dislikes, totalVotes: stats.totalVotes, scorePercent: stats.scorePercent, hidden: stats.hidden },
        select: { id: true, text: true, type: true, likes: true, dislikes: true, totalVotes: true, scorePercent: true },
      });

      return { quote, userVote: payload.value };
    });

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'RATE_LIMITED') return res.status(429).json({ error: 'Too many requests' });
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid payload' });
    return res.status(500).json({ error: 'Internal error' });
  }
}
