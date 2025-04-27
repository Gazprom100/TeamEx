const express = require('express');
const cors = require('cors');
const path = require('path');
const { startBot } = require('./bot');
require('dotenv').config();

// Инициализация Express сервера
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы из build директории
app.use(express.static(path.join(__dirname, 'build')));

// API эндпоинты
app.get('/api/rates', (req, res) => {
  // В реальном приложении эти данные должны приходить из БД или внешнего API
  res.json({
    success: true,
    data: {
      buy: 96.5,  // Курс покупки USDT (сколько рублей за 1 USDT)
      sell: 95.0  // Курс продажи USDT (сколько рублей за 1 USDT)
    }
  });
});

// Все остальные GET запросы отправляют index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Старт сервера
const server = app.listen(PORT, () => {
  console.log(`[SERVER] Web сервер запущен на порту ${PORT}`);
});

// Проверка и запуск Telegram бота
let botController = null;
if (process.env.BOT_TOKEN) {
  botController = startBot(process.env.BOT_TOKEN);
} else {
  console.warn('[SERVER] Переменная BOT_TOKEN не найдена в .env файле. Telegram бот не будет запущен.');
}

// Функция для корректного завершения работы
const gracefulShutdown = (signal) => {
  console.log(`\n[SERVER] Получен сигнал ${signal}. Начинаем корректное завершение работы...`);
  
  // Останавливаем HTTP сервер
  server.close(() => {
    console.log('[SERVER] HTTP сервер остановлен.');
    
    // Останавливаем Telegram бота, если он был запущен
    if (botController && botController.stopBot) {
      botController.stopBot();
    }
    
    console.log('[SERVER] Работа приложения завершена.');
    process.exit(0);
  });
  
  // Таймаут на случай зависания
  setTimeout(() => {
    console.error('[SERVER] Не удалось корректно завершить работу за 10 секунд. Принудительное завершение.');
    process.exit(1);
  }, 10000);
};

// Обработка сигналов завершения
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('[SERVER] Необработанное исключение:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER] Необработанное отклонение промиса:', reason);
}); 