import { useState, useEffect, useCallback } from 'react';
import { compliments } from './data/compliments';
import { insults } from './data/insults';
import { useQuote } from './features/quotes/hooks/useQuote';
import { useVoteMutation } from './features/quotes/hooks/useVoteMutation';
import { VotePanel } from './features/quotes/components/VotePanel';
import { getTelegramUserId } from './shared/lib/telegram';
import './App.css';

type Screen = 'splash' | 'home' | 'loading' | 'result' | 'share';
type ResultType = 'compliment' | 'insult' | null;

const loadingSubPhrases = [
  'Поиск тёплых слов в базе циников...',
  'Подготовка психологического оружия...',
  'Сканирование ауры через фронталку...',
  'Загрузка модуля эмпатии (шутка)...',
  'Анализ кармы по последним лайкам...',
  'Вычисление уровня кринжа...',
  'Подбор идеального сочетания слов...',
  'Нейросеть немного нервничает...',
  'Генерация случайной правды...',
  'Синтез сарказма и поддержки...',
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [resultText, setResultText] = useState<string>('');
  const [resultType, setResultType] = useState<ResultType>(null);
  const [loadingSub, setLoadingSub] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  const { data: activeQuote, refetch: refetchQuote } = useQuote(currentScreen === 'loading');
  const voteMutation = useVoteMutation();

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Update status bar time
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Splash timeout - transition to home
    const splashTimer = setTimeout(() => {
      setCurrentScreen('home');
    }, 3200);

    // Create particles when component mounts
    createParticles();

    return () => {
      clearInterval(timer);
      clearTimeout(splashTimer);
    };
  }, []);

  const createParticles = useCallback(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const colors = ['var(--accent-dim)', 'var(--secondary-dim)', 'var(--glow-dim)', 'var(--danger-dim)'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  }, []);

  const getRandomPhrase = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleCompliment = useCallback(() => {
    setCurrentScreen('loading');
    void refetchQuote();
    void refetchQuote();
    setLoadingSub(loadingSubPhrases[Math.floor(Math.random() * loadingSubPhrases.length)]);
    
    setTimeout(() => {
      const phrase = activeQuote?.type === 'compliment' ? activeQuote.text : getRandomPhrase(compliments);
      setResultText(phrase);
      setResultType('compliment');
      setCurrentScreen('result');
    }, 2800);
  }, []);

  const handleInsult = useCallback(() => {
    setCurrentScreen('loading');
    setLoadingSub(loadingSubPhrases[Math.floor(Math.random() * loadingSubPhrases.length)]);
    
    setTimeout(() => {
      const phrase = activeQuote?.type === 'insult' ? activeQuote.text : getRandomPhrase(insults);
      setResultText(phrase);
      setResultType('insult');
      setCurrentScreen('result');
    }, 2800);
  }, []);


  const handleVote = useCallback((value: 'like' | 'dislike') => {
    const userId = getTelegramUserId();
    if (!userId || !activeQuote) return;
    voteMutation.mutate({ quoteId: activeQuote.id, value, telegramUserId: userId });
  }, [activeQuote, voteMutation]);

  const handleGoHome = useCallback(() => {
    setCurrentScreen('home');
    setResultText('');
    setResultType(null);
  }, []);

  const handleShare = useCallback(() => {
    setCurrentScreen('share');
  }, []);

  const handleCloseShare = useCallback(() => {
    setCurrentScreen('result');
  }, []);

const handleShareTelegram = useCallback(() => {
  const tg = window.Telegram?.WebApp;
  if (!tg || !resultText) {
    fallbackShare();
    return;
  }

  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'roast_app_bot';
  const userId = tg.initDataUnsafe?.user?.id || '';
  const cleanUsername = botUsername.replace(/^@/, '');
  
  const botLink = userId 
    ? `https://t.me/${cleanUsername}?start=ref_${userId}`
    : `https://t.me/${cleanUsername}`;
  
  // Только текст, ссылка внизу
  const shareText = `«${resultText}»\n\n🤖 Получил(а) это в ОРАКУЛЕ\n\n⬇️ Попробуй сам ⬇️\n${botLink}`;
  
  const encodedText = encodeURIComponent(shareText);
  // Убираем параметр url - не будет превью-карточки сверху!
  const shareUrl = `https://t.me/share/url?text=${encodedText}`;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = shareUrl;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  } else {
    const link = document.createElement('a');
    link.href = shareUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  tg.HapticFeedback?.notificationOccurred('success');
  
  setTimeout(() => {
    setCurrentScreen('result');
  }, 500);
}, [resultText]);

// Функция fallback на случай, если Telegram API недоступен
const fallbackShare = () => {
  const botUsername = 'roast_app_bot';
  const shareText = `«${resultText}»\n\n🤖 ОРАКУЛ: https://t.me/${botUsername}`;
  const encodedText = encodeURIComponent(shareText);
  window.open(`https://t.me/share/url?url=${encodeURIComponent(`https://t.me/${botUsername}`)}&text=${encodedText}`, '_blank');
};

  const handleCopyPhrase = useCallback(() => {
    navigator.clipboard?.writeText(resultText).catch(() => {});
    tryHaptic();
  }, [resultText]);

  const tryHaptic = useCallback(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
  }, []);

  const getTransitionClass = (from: Screen, to: Screen): string => {
    if (from === 'splash' && to === 'home') return 'slide-up';
    if (from === 'home' && to === 'loading') return 'scale-in';
    if (from === 'loading' && to === 'result') return 'scale-in';
    if (from === 'result' && to === 'share') return 'scale-in';
    if (from === 'share' && to === 'result') return 'scale-in';
    if (from === 'result' && to === 'home') return 'slide-up';
    return 'slide-up';
  };

  const isSupport = resultType === 'compliment';
  const resultColor = isSupport ? 'oklch(62% 0.24 290)' : 'oklch(50% 0.20 25)';
  const resultGlowColor = isSupport
    ? 'oklch(25% 0.15 290 / .3)'
    : 'oklch(22% 0.12 25 / .3)';

  // Generate character spans for animated text
  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char"
        style={{ animationDelay: `${index * 20 + Math.random() * 30}ms` }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div id="app">
      {/* Status Bar Mock */}
      <div className="status-bar" aria-hidden="true">
        <span className="time" id="statusTime">{currentTime}</span>
        <div className="status-icons">
          <svg viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
          <svg viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      {/* Splash Screen */}
      <div 
        id="splash" 
        className={`screen splash ${currentScreen === 'splash' ? 'active' : ''}`}
      >
        <div className="splash-content">
          <div className="glitch-wrapper">
            <div className="glitch-text" data-text="ОРАКУЛ">ОРАКУЛ</div>
          </div>
          <div className="splash-subtitle">Инициализация генератора...</div>
          <div className="splash-loader">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="splash-status">v2.4.1 — загрузка модуля сарказма</div>
        </div>
      </div>

      {/* Home Screen */}
      <div 
        id="home" 
        className={`screen home ${currentScreen === 'home' ? `active ${getTransitionClass('splash', 'home')}` : ''}`}
      >
        <div className="ambient-particles" id="particles"></div>
        <div className="home-content">
          <div className="brand-badge">Beta · AI-powered</div>
          <div className="brand-title">ОРАКУЛ</div>
          <div className="brand-subtitle">
            Саркастический AI-оракул.
          </div>
          <div className="btn-group">
            <button 
              className="btn btn-support" 
              onClick={handleCompliment}
            >
              <div className="btn-inner">
                <span className="btn-icon">✦</span>
                <span className="btn-label">Поддержи меня</span>
                <span className="btn-sub">тёплый сарказм</span>
              </div>
            </button>
            <button 
              className="btn btn-destroy" 
              onClick={handleInsult}
            >
              <div className="btn-inner">
                <span className="btn-icon">✕</span>
                <span className="btn-label">Уничтожь меня</span>
                <span className="btn-sub">суровая правда</span>
              </div>
            </button>
          </div>
        </div>
        <div className="home-footer">touch to begin</div>
      </div>

      {/* Loading Screen */}
      <div 
        id="loading" 
        className={`screen loading ${currentScreen === 'loading' ? `active ${getTransitionClass('home', 'loading')}` : ''}`}
      >
        <div className="loading-content">
          <div className="loading-brain">
            <div className="loading-brain-ring"></div>
            <div className="loading-brain-ring"></div>
            <div className="loading-brain-ring"></div>
          </div>
          <div>
            <div className="loading-text loading-glitch">Анализирую вашу личность</div>
            <div className="loading-sub" id="loadingSub">{loadingSub}</div>
          </div>
          <div className="loading-progress">
            <div className="loading-progress-bar" id="progressBar"></div>
          </div>
        </div>
      </div>

      {/* Result Screen */}
      <div 
        id="result" 
        className={`screen result ${currentScreen === 'result' ? `active ${getTransitionClass('loading', 'result')}` : ''}`}
        style={{
          ['--result-glow-color' as string]: resultGlowColor,
          ['--result-color' as string]: resultColor,
        } as React.CSSProperties}
      >
        <div className="result-content">
          <div 
            className="result-type-badge" 
            id="resultBadge"
            style={{ color: resultColor, borderColor: isSupport ? 'var(--accent-dim)' : 'var(--danger-dim)' }}
          >
            {isSupport ? 'Комплимент' : 'Оскорбление'}
          </div>
          <div className="result-card" id="resultCard">
            <div 
              className={`result-card-glow ${isSupport ? 'support' : 'destroy'}`} 
              id="resultGlow"
            ></div>
            <div 
              className="result-phrase" 
              id="resultPhrase"
              onClick={handleCopyPhrase}
            >
              {renderAnimatedText(resultText)}
            </div>
          </div>

          {activeQuote && (
            <VotePanel quote={activeQuote} loading={voteMutation.isPending} onVote={handleVote} />
          )}
          <div className="result-actions">
            <button className="btn-again" onClick={handleGoHome}>Ещё</button>
            <button className="btn-share-result" onClick={handleShare}>Поделиться</button>
          </div>
        </div>
      </div>

      {/* Share Overlay */}
      <div 
        id="share" 
        className={`screen share ${currentScreen === 'share' ? `active ${getTransitionClass('result', 'share')}` : ''}`}
        style={{
          ['--result-glow-color' as string]: resultGlowColor,
          ['--result-color' as string]: resultColor,
        } as React.CSSProperties}
      >
        <div className="share-content">
          <div className="share-card" id="shareCard">
            <div className="share-brand">ОРАКУЛ</div>
            <div className="share-divider"></div>
            <div className="share-phrase" id="sharePhrase">{resultText}</div>
            <div 
              className="share-type" 
              id="shareType"
              style={{ color: resultColor }}
            >
              {isSupport ? 'комплимент от AI' : 'оскорбление от AI'}
            </div>
            <div className="share-divider"></div>
            <div className="share-footer">© ОРАКУЛ · AI-оракул</div>
          </div>
          <div className="share-actions">
            <button className="btn-share-result" onClick={handleShareTelegram}>
              Поделиться в Telegram
            </button>
            <button className="share-close" onClick={handleCloseShare}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
