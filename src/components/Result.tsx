import React from 'react';

interface ResultProps {
  text: string;
  type: 'compliment' | 'insult' | null;
}

export const Result: React.FC<ResultProps> = ({ text, type }) => {
  if (!text) return null;

  const bgColor = type === 'compliment' 
    ? 'bg-green-900/50 border-green-700' 
    : 'bg-red-900/50 border-red-700';

  return (
    <div className={`mt-8 p-6 rounded-lg border ${bgColor} animate-fade-in max-w-sm mx-auto`}>
      <p className="text-lg text-center text-white">{text}</p>
    </div>
  );
};
