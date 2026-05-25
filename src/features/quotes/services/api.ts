import type { QuoteDto, VoteResponse, VoteValue } from '../../../shared/types/quote';

export const fetchQuote = async (): Promise<QuoteDto> => {
  const response = await fetch('/api/quote');
  if (!response.ok) throw new Error('Failed to fetch quote');
  const data = await response.json();
  return data.quote;
};

export const postVote = async (payload: { quoteId: string; value: VoteValue; telegramUserId: string }): Promise<VoteResponse> => {
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to vote');
  return response.json();
};
