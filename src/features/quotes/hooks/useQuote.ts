import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '../services/api';

export const useQuote = (enabled: boolean) =>
  useQuery({
    queryKey: ['quote'],
    queryFn: fetchQuote,
    enabled,
    staleTime: 30_000,
    retry: 2,
  });
