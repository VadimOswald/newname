import { z } from 'zod';

export const voteSchema = z.object({
  quoteId: z.string().min(1).max(191),
  value: z.enum(['like', 'dislike']),
  telegramUserId: z.string().min(1).max(32),
});
