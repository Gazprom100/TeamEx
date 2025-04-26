import axios from 'axios';

// API URL может быть изменен при необходимости
const API_URL = process.env.REACT_APP_API_URL || 'https://api.teamex.exchange';

const tg = window.Telegram?.WebApp;

// Создаем инстанс axios с базовым URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем заголовок с данными пользователя Telegram при каждом запросе
apiClient.interceptors.request.use((config) => {
  if (tg && tg.initDataUnsafe) {
    config.headers['X-Telegram-Data'] = btoa(JSON.stringify(tg.initDataUnsafe));
  }
  return config;
});

// Инициализация WebApp Telegram
export const setupTelegramWebApp = () => {
  if (!tg) {
    console.error('Telegram WebApp is not available');
    return null;
  }

  try {
    // Настраиваем кнопки и тему WebApp
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Адаптируем тему к Telegram
    const colorScheme = tg.colorScheme || 'light';
    document.documentElement.setAttribute('data-theme', colorScheme);
    
    // Прослушиваем изменения темы
    tg.onEvent('themeChanged', () => {
      document.documentElement.setAttribute('data-theme', tg.colorScheme);
    });
    
    console.log('Telegram WebApp initialized:', tg.initDataUnsafe);
    return tg;
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return null;
  }
};

// API методы
const api = {
  // Получение актуальных курсов USDT
  getRates: async () => {
    try {
      const response = await apiClient.get('/rates');
      return response.data;
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Возвращаем дефолтные значения в случае ошибки
      return { 
        buy: 98.5,  // Курс покупки USDT (за сколько рублей можно купить 1 USDT)
        sell: 96.5  // Курс продажи USDT (за сколько рублей можно продать 1 USDT)
      };
    }
  },
  
  // Отправка заявки на обмен
  submitExchangeRequest: async (requestData) => {
    const response = await apiClient.post('/exchange/request', requestData);
    return response.data;
  },
  
  // Получение истории заявок пользователя (если пользователь авторизован в Telegram)
  getUserHistory: async () => {
    if (!tg || !tg.initDataUnsafe) {
      throw new Error('User not authenticated via Telegram');
    }
    
    const response = await apiClient.get('/user/history');
    return response.data;
  },
  
  // Отправка запроса в поддержку
  submitSupportRequest: async (supportData) => {
    const response = await apiClient.post('/support/request', supportData);
    return response.data;
  },
  
  // Получение информации о пользователе Telegram
  getUserInfo: () => {
    if (!tg || !tg.initDataUnsafe) {
      return null;
    }
    
    return tg.initDataUnsafe.user;
  }
};

export default api; 