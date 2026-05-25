export const getTelegramUserId = (): string | null => {
  const id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  return typeof id === 'number' ? String(id) : null;
};
