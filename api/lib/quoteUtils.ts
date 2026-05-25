export const calcStats = (likes: number, dislikes: number) => {
  const totalVotes = likes + dislikes;
  const scorePercent = totalVotes === 0 ? 0 : (likes / totalVotes) * 100;
  const hidden = totalVotes >= 10 && scorePercent < 30;
  return { totalVotes, scorePercent, hidden };
};
