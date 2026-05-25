# Telegram Mini App — Генератор Комплиментов и Оскорблений

Минималистичный Telegram Mini App на React для изучения структуры Mini Apps, интеграции с Telegram, frontend разработки и деплоя.

## Функционал

- Две кнопки: «Поддержи меня» и «Уничтожь меня»
- Случайная генерация комплиментов или оскорблений
- Минималистичный dark theme интерфейс
- Анимация fade-in при появлении текста
- Интеграция с Telegram WebApp SDK

## Технологический стек

- **React** — UI библиотека
- **Vite** — сборщик проекта
- **TypeScript** — типизация
- **TailwindCSS** — стилизация

## Структура проекта

```
src/
 ├── App.tsx              # Основной компонент приложения
 ├── main.tsx             # Точка входа
 ├── styles/
 ├── data/
 │    ├── compliments.ts  # Массив комплиментов
 │    └── insults.ts      # Массив оскорблений
 └── components/
      └── Result.tsx      # Компонент отображения результата
```

## Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка production версии
npm run build

# Preview production сборки
npm run preview
```

## Деплой на Vercel

1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Залогиньтесь в Vercel:
   ```bash
   vercel login
   ```

3. Задеплойте проект:
   ```bash
   vercel
   ```

4. Следуйте инструкциям в терминале.

## Подключение к Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)

2. В BotFather используйте команду `/newapp` для создания Mini App

3. Или настройте существующего бота:
   - Используйте команду `/mybots`
   - Выберите вашего бота
   - Bot Settings → Menu Button → Configure Menu Button
   - Отправьте URL вашего приложения (полученный после деплоя на Vercel)

4. URL должен быть HTTPS (Vercel предоставляет автоматически)

## Пример URL после деплоя

```
https://your-app-name.vercel.app
```

## Использование в Telegram

После настройки бота:
- Откройте бота в Telegram
- Нажмите кнопку меню или ссылку на Mini App
- Приложение откроется внутри Telegram

## Лицензия

MIT
