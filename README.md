# TeamEx Exchange

Современная платформа для обмена USDT на рубли и обратно.

## Установка и запуск

1. **Клонирование репозитория:**
   ```
   git clone https://github.com/yourusername/TeamEx.git
   cd TeamEx
   ```

2. **Установка зависимостей:**
   ```
   npm install
   ```

3. **Настройка переменных окружения:**
   ```
   cp env.example .env
   ```
   Отредактируйте файл `.env` и укажите токен Telegram-бота.

4. **Генерация иконок:**
   ```
   npm run generate-icons
   ```
   После этого SVG-файлы будут созданы в папке `public`. Их нужно конвертировать в PNG.

5. **Запуск для разработки:**
   ```
   npm run dev
   ```
   Запускает клиент на порту 3000 и сервер с API на порту, указанном в .env (по умолчанию 3000).

6. **Запуск для продакшена:**
   ```
   npm run build
   npm start
   ```

## Деплой на Render

1. **Создайте новый веб-сервис** на [Render](https://render.com)
2. **Подключите репозиторий** с GitHub
3. **Настройте переменные окружения**:
   - `PORT` - порт (по умолчанию Render использует свой)
   - `BOT_TOKEN` - токен вашего Telegram-бота
4. **Команда сборки**: `npm install && npm run build`
5. **Команда запуска**: `node server.js`

## Архитектура проекта

- **Frontend**: React, React Router, Styled Components, Framer Motion
- **Backend**: Express.js, Telegraf (для Telegram-бота)
- **API**: REST API для обмена данными между клиентом и сервером

## Основные функции

- Обмен USDT на RUB и обратно
- Просмотр текущих курсов
- Telegram-бот для обработки заявок
- Личный кабинет пользователя

## Автор

Евгений Владимирович - teamex@example.com 