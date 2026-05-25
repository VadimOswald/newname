export type QuoteType = 'compliment' | 'insult';
export type VoteValue = 'like' | 'dislike';

export interface QuoteDto {
  id: string;
  text: string;
  type: QuoteType;
  likes: number;
  dislikes: number;
  totalVotes: number;
  scorePercent: number;
}

export interface VoteResponse {
  quote: QuoteDto;
  userVote: VoteValue;
}
