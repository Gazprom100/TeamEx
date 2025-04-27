const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { startBot } = require('./bot');
require('dotenv').config();

// Инициализация Express сервера
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка middleware
app.use(cors({
  origin: '*', // Разрешаем запросы с любого источника (в продакшене настроить более строго)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Путь к файлу с данными о курсах
const RATES_FILE_PATH = path.join(__dirname, 'data', 'rates.json');

// Путь к файлу с данными о рефералах
const REFERRALS_FILE_PATH = path.join(__dirname, 'data', 'referrals.json');
const COMMISSIONS_FILE_PATH = path.join(__dirname, 'data', 'commissions.json');

// Создание директории для данных, если она не существует
const ensureDataDirExists = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Начальные данные о курсах
const DEFAULT_RATES = {
  buy: 96.5,  // Курс покупки USDT (сколько рублей за 1 USDT)
  sell: 95.0  // Курс продажи USDT (сколько рублей за 1 USDT)
};

// Загрузка данных о курсах
const loadRates = () => {
  ensureDataDirExists();
  
  try {
    if (fs.existsSync(RATES_FILE_PATH)) {
      const data = fs.readFileSync(RATES_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
    
    // Если файл не существует, создаем его с дефолтными значениями
    fs.writeFileSync(RATES_FILE_PATH, JSON.stringify(DEFAULT_RATES, null, 2));
    return DEFAULT_RATES;
  } catch (error) {
    console.error('[SERVER] Ошибка при загрузке данных о курсах:', error);
    return DEFAULT_RATES;
  }
};

// Сохранение данных о курсах
const saveRates = (rates) => {
  ensureDataDirExists();
  
  try {
    fs.writeFileSync(RATES_FILE_PATH, JSON.stringify(rates, null, 2));
    return true;
  } catch (error) {
    console.error('[SERVER] Ошибка при сохранении данных о курсах:', error);
    return false;
  }
};

// Загрузка данных о рефералах
const loadReferrals = () => {
  ensureDataDirExists();
  
  try {
    if (fs.existsSync(REFERRALS_FILE_PATH)) {
      const data = fs.readFileSync(REFERRALS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
    
    // Если файл не существует, создаем его с пустым объектом
    fs.writeFileSync(REFERRALS_FILE_PATH, JSON.stringify({}, null, 2));
    return {};
  } catch (error) {
    console.error('[SERVER] Ошибка при загрузке данных о рефералах:', error);
    return {};
  }
};

// Сохранение данных о рефералах
const saveReferrals = (referrals) => {
  ensureDataDirExists();
  
  try {
    fs.writeFileSync(REFERRALS_FILE_PATH, JSON.stringify(referrals, null, 2));
    return true;
  } catch (error) {
    console.error('[SERVER] Ошибка при сохранении данных о рефералах:', error);
    return false;
  }
};

// Загрузка данных о комиссиях
const loadCommissions = () => {
  ensureDataDirExists();
  
  try {
    if (fs.existsSync(COMMISSIONS_FILE_PATH)) {
      const data = fs.readFileSync(COMMISSIONS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
    
    // Если файл не существует, создаем его с пустым объектом
    fs.writeFileSync(COMMISSIONS_FILE_PATH, JSON.stringify({}, null, 2));
    return {};
  } catch (error) {
    console.error('[SERVER] Ошибка при загрузке данных о комиссиях:', error);
    return {};
  }
};

// Сохранение данных о комиссиях
const saveCommissions = (commissions) => {
  ensureDataDirExists();
  
  try {
    fs.writeFileSync(COMMISSIONS_FILE_PATH, JSON.stringify(commissions, null, 2));
    return true;
  } catch (error) {
    console.error('[SERVER] Ошибка при сохранении данных о комиссиях:', error);
    return false;
  }
};

// Статические файлы из build директории
app.use(express.static(path.join(__dirname, 'build')));

// API эндпоинты для работы с курсами
app.get('/api/rates', (req, res) => {
  try {
    console.log('[SERVER] GET /api/rates - Запрос на получение курсов');
    const rates = loadRates();
    console.log('[SERVER] Текущие курсы:', rates);
    
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error('[SERVER] Ошибка при получении курсов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении курсов'
    });
  }
});

app.post('/api/rates', (req, res) => {
  try {
    console.log('[SERVER] POST /api/rates - Запрос на обновление курсов');
    console.log('[SERVER] Данные запроса:', req.body);
    
    const { buy, sell } = req.body;
    
    // Валидация входных данных
    if (buy === undefined || sell === undefined) {
      console.warn('[SERVER] Отсутствуют параметры buy или sell');
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать параметры buy и sell'
      });
    }
    
    // Проверка на корректные значения
    const buyRate = parseFloat(buy);
    const sellRate = parseFloat(sell);
    
    if (isNaN(buyRate) || isNaN(sellRate)) {
      console.warn('[SERVER] Неверный формат значений');
      return res.status(400).json({
        success: false,
        message: 'Значения курсов должны быть числами'
      });
    }
    
    if (buyRate <= 0 || sellRate <= 0) {
      console.warn('[SERVER] Отрицательные или нулевые значения курсов');
      return res.status(400).json({
        success: false,
        message: 'Курсы должны быть положительными числами'
      });
    }
    
    // Сохранение новых значений
    const newRates = {
      buy: buyRate,
      sell: sellRate
    };
    
    if (saveRates(newRates)) {
      console.log('[SERVER] Курсы успешно обновлены:', newRates);
      res.json({
        success: true,
        data: newRates,
        message: 'Курсы успешно обновлены'
      });
    } else {
      console.error('[SERVER] Ошибка при сохранении курсов');
      res.status(500).json({
        success: false,
        message: 'Ошибка при сохранении данных о курсах'
      });
    }
  } catch (error) {
    console.error('[SERVER] Ошибка при обработке запроса на обновление курсов:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// API эндпоинты для работы с рефералами
app.get('/api/referrals/:userId', (req, res) => {
  try {
    console.log('[SERVER] GET /api/referrals/:userId - Запрос на получение данных о рефералах пользователя');
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Не указан ID пользователя'
      });
    }
    
    const referrals = loadReferrals();
    const userReferrals = {
      // Информация о реферале (кто пригласил пользователя)
      referrer: referrals[userId] || null,
      
      // Список пользователей, которых пригласил этот пользователь (первая линия)
      referredUsers: Object.entries(referrals)
        .filter(([id, data]) => data.referrerId === userId)
        .map(([id, data]) => ({
          userId: id,
          dateAdded: data.dateAdded
        }))
    };
    
    res.json({
      success: true,
      data: userReferrals
    });
  } catch (error) {
    console.error('[SERVER] Ошибка при получении данных о рефералах:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных о рефералах'
    });
  }
});

// Добавление новой реферальной связи
app.post('/api/referrals', (req, res) => {
  try {
    console.log('[SERVER] POST /api/referrals - Запрос на добавление реферальной связи');
    console.log('[SERVER] Данные запроса:', req.body);
    
    const { referrerId, referredId } = req.body;
    
    // Валидация входных данных
    if (!referrerId || !referredId) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать ID реферера и реферала'
      });
    }
    
    // Нельзя быть собственным рефералом
    if (referrerId === referredId) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя быть собственным рефералом'
      });
    }
    
    // Получаем текущие реферальные связи
    const referrals = loadReferrals();
    
    // Проверяем, не зарегистрирован ли уже пользователь через другого реферера
    if (referrals[referredId] && referrals[referredId].referrerId) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь уже зарегистрирован через другого реферера'
      });
    }
    
    // Находим верхние уровни (до 3-х линий вверх)
    let firstLine = referrerId;
    let secondLine = null;
    let thirdLine = null;
    
    if (referrals[firstLine]) {
      secondLine = referrals[firstLine].referrerId;
      
      if (secondLine && referrals[secondLine]) {
        thirdLine = referrals[secondLine].referrerId;
      }
    }
    
    // Обновляем реферальные данные
    referrals[referredId] = {
      referrerId: firstLine,
      secondLineId: secondLine,
      thirdLineId: thirdLine,
      dateAdded: new Date().toISOString()
    };
    
    // Сохраняем обновленные данные
    if (saveReferrals(referrals)) {
      res.json({
        success: true,
        message: 'Реферальная связь успешно добавлена',
        data: referrals[referredId]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Ошибка при сохранении реферальной связи'
      });
    }
  } catch (error) {
    console.error('[SERVER] Ошибка при добавлении реферальной связи:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Получение комиссий пользователя
app.get('/api/commissions/:userId', (req, res) => {
  try {
    console.log('[SERVER] GET /api/commissions/:userId - Запрос на получение комиссий пользователя');
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Не указан ID пользователя'
      });
    }
    
    const commissions = loadCommissions();
    const userCommissions = commissions[userId] || [];
    
    // Подсчет общей суммы комиссий
    const totalCommissions = userCommissions.reduce((total, commission) => total + commission.amount, 0);
    
    res.json({
      success: true,
      data: {
        commissions: userCommissions,
        totalCommissions
      }
    });
  } catch (error) {
    console.error('[SERVER] Ошибка при получении комиссий пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении комиссий пользователя'
    });
  }
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