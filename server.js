const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Токен бота
const token = process.env.TELEGRAM_BOT_TOKEN;
// ID для отправки уведомлений
const adminChatId = process.env.ADMIN_CHAT_ID;
// API ключ для bitteam
const bitteamApiKey = process.env.BT_API;

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

// Маршрут для получения текущего курса USDT с биржи bitteam
app.get('/api/rates', async (req, res) => {
  try {
    const response = await axios.get('https://api.bitteam.com/market/ticker/USDT_RUB');
    
    // Если API недоступен, возвращаем моковые данные
    const rates = {
      buy: parseFloat(response.data?.last || '97.5'), 
      sell: parseFloat(response.data?.last || '95.5') * 0.98, // Добавляем спред 2%
    };
    
    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    // В случае ошибки возвращаем моковые данные
    res.json({
      buy: 97.5,
      sell: 95.5,
    });
  }
});

// Маршрут для обработки заявок
app.post('/api/orders', async (req, res) => {
  try {
    const { 
      user_id, 
      username, 
      type, 
      amount, 
      total, 
      payment_method, 
      card_number 
    } = req.body;
    
    // Валидация
    if (!user_id || !type || !amount || !total || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (type === 'buy' && !card_number) {
      return res.status(400).json({ error: 'Card number is required for buying USDT' });
    }
    
    // Формируем сообщение для администратора
    let adminMessage = `🔔 *Новая заявка на ${type === 'buy' ? 'покупку' : 'продажу'} USDT*\n\n`;
    adminMessage += `👤 Пользователь: ${username ? '@' + username : 'ID: ' + user_id}\n`;
    adminMessage += `💰 Сумма: ${amount} ${type === 'buy' ? 'RUB' : 'USDT'}\n`;
    adminMessage += `💵 Итого: ${total} ${type === 'buy' ? 'USDT' : 'RUB'}\n`;
    adminMessage += `💳 Способ оплаты: ${payment_method}\n`;
    
    if (type === 'buy' && card_number) {
      // Маскируем номер карты для безопасности
      const maskedCard = card_number.substring(0, 4) + ' **** **** ' + card_number.substring(12);
      adminMessage += `💳 Карта: ${maskedCard}\n`;
    }
    
    // ID администратора из переменной окружения
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    
    // Отправляем сообщение администратору
    if (adminId) {
      await bot.sendMessage(adminId, adminMessage, { parse_mode: 'Markdown' });
    }
    
    // Формируем сообщение для клиента
    let userMessage = `✅ *Ваша заявка принята*\n\n`;
    userMessage += `Тип операции: ${type === 'buy' ? 'Покупка USDT' : 'Продажа USDT'}\n`;
    userMessage += `Сумма: ${amount} ${type === 'buy' ? 'RUB' : 'USDT'}\n`;
    userMessage += `Итого: ${total} ${type === 'buy' ? 'USDT' : 'RUB'}\n\n`;
    userMessage += `⏱ Ожидайте сообщения от оператора для уточнения деталей сделки.`;
    
    // Отправляем сообщение пользователю
    await bot.sendMessage(user_id, userMessage, { parse_mode: 'Markdown' });
    
    // Записываем заявку в базу данных (в реальном проекте)
    // await Order.create({ ... });
    
    // Возвращаем успешный ответ
    res.json({ success: true, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Обработка Telegram запросов через webhook
app.post('/webhook', (req, res) => {
  if (req.body.message) {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text || '';
    
    // Обработка команды /start
    if (text === '/start') {
      const startMessage = `👋 Привет! Я бот для обмена USDT.\n\n` +
        `Для начала работы, нажмите кнопку ниже и откройте веб-приложение.`;
        
      const keyboard = {
        inline_keyboard: [
          [{ text: '🔄 Обменять USDT', web_app: { url: process.env.WEBAPP_URL || 'https://teamex-exchange.vercel.app' } }]
        ]
      };
      
      bot.sendMessage(chatId, startMessage, { 
        reply_markup: JSON.stringify(keyboard) 
      });
    }
  }
  
  res.sendStatus(200);
});

// Маршрут для SPA (если фронтенд и бэкенд на одном сервере)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Обработка команд бота
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage = `👋 Привет, ${msg.from.first_name}! Я бот для обмена USDT.\n\n` +
    `Для начала работы, нажмите кнопку ниже и откройте веб-приложение.`;
    
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔄 Обменять USDT', web_app: { url: process.env.WEBAPP_URL || 'https://teamex-exchange.vercel.app' } }]
    ]
  };
  
  bot.sendMessage(chatId, startMessage, { 
    reply_markup: keyboard 
  });
});

// Обработка неизвестных команд
bot.on('message', (msg) => {
  if (!msg.text || !msg.text.startsWith('/')) return;
  
  // Пропускаем обработанные команды
  if (msg.text === '/start') return;
  
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Используйте кнопку ниже для доступа к обмену:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔄 Обменять USDT', web_app: { url: process.env.WEBAPP_URL || 'https://teamex-exchange.vercel.app' } }]
      ]
    }
  });
}); 