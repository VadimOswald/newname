import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postVote } from '../services/api';
import type { QuoteDto, VoteValue } from '../../../shared/types/quote';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postVote,
    retry: 2,
    onMutate: async ({ quoteId, value }) => {
      await queryClient.cancelQueries({ queryKey: ['quote'] });
      const previous = queryClient.getQueryData<QuoteDto>(['quote']);

      if (previous && previous.id === quoteId) {
        const next = { ...previous };
        if (value === 'like') next.likes += 1;
        if (value === 'dislike') next.dislikes += 1;
        next.totalVotes = next.likes + next.dislikes;
        next.scorePercent = next.totalVotes ? (next.likes / next.totalVotes) * 100 : 0;
        queryClient.setQueryData(['quote'], next);
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['quote'], ctx.previous);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quote'], data.quote);
    },
  });
};
