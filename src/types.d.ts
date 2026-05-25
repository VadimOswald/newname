declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        HapticFeedback?: {
          impactOccurred: (style: string) => void;
          notificationOccurred: (style: string) => void;
        };
        initDataUnsafe?: {
          user?: {
            id?: number;
          };
        };
      };
    };
  }
}

export {};
