import type { QuoteDto, VoteValue } from '../../../shared/types/quote';

interface Props {
  quote: QuoteDto;
  disabled?: boolean;
  loading?: boolean;
  onVote: (value: VoteValue) => void;
}

export function VotePanel({ quote, disabled, loading, onVote }: Props) {
  return (
    <div className="vote-panel">
      <button disabled={disabled || loading} onClick={() => onVote('like')}>👍 {quote.likes}</button>
      <button disabled={disabled || loading} onClick={() => onVote('dislike')}>👎 {quote.dislikes}</button>
      <div className="vote-rating">{quote.scorePercent.toFixed(1)}% · {quote.totalVotes}</div>
    </div>
  );
}
