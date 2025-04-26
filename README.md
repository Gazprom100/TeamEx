# TeamEx Exchange

Telegram веб-приложение для обмена криптовалют на рубли и обратно. Проект включает веб-интерфейс и Telegram бота.

## Функциональность

- Покупка и продажа USDT
- Отображение текущих курсов валют
- Интеграция с Telegram WebApp и Telegram ботом

## Технологии

- React
- Styled Components
- Framer Motion
- Telegram Bot API (через библиотеку Telegraf)
- Telegram WebApp API

## Установка и запуск

### Веб-приложение

1. Клонировать репозиторий
```
git clone https://github.com/yourusername/TeamEx.git
cd TeamEx
```

2. Установить зависимости
```
npm install
```

3. Запустить веб-приложение в режиме разработки
```
npm start
```

### Telegram Бот

1. Создайте файл `.env` в корне проекта со следующим содержимым:
```
BOT_TOKEN=your_telegram_bot_token_here
```

2. Запустите бота
```
node bot.js
```

## Использование

### Через браузер

Откройте [https://teamex.onrender.com](https://teamex.onrender.com) в вашем браузере.

### Через Telegram

1. Откройте бота [@TeamExBot](https://t.me/YourBotUsername) в Telegram
2. Нажмите кнопку "Start" или введите команду `/start`
3. Используйте меню для взаимодействия с ботом

Также вы можете использовать inline-кнопку "Открыть веб-приложение" для доступа к полному функционалу через Telegram WebApp.

## Скриншоты

![Главная страница](screenshots/home.png)
![Страница обмена](screenshots/exchange.png)

## Разработка

Проект поддерживает как веб-интерфейс, так и интерфейс внутри Telegram. Функциональность синхронизирована между обоими вариантами.

### Структура проекта

- `/src` - исходный код веб-приложения
  - `/components` - React компоненты
  - `/pages` - страницы веб-приложения
  - `/hooks` - React хуки
- `bot.js` - код Telegram бота

## Лицензия

MIT 