/**
 * Сервис для управления курсами обмена USDT
 */

// Ключи для хранения данных в localStorage
const STORAGE_KEYS = {
  BUY_RATE: 'teamex_buy_rate',
  SELL_RATE: 'teamex_sell_rate',
  RATES_HISTORY: 'teamex_rates_history'
};

// Значения курсов по умолчанию
const DEFAULT_VALUES = {
  BUY_RATE: 80.5,
  SELL_RATE: 78.0
};

// API endpoint для получения курсов
const API_ENDPOINT = '/api/rates';

/**
 * Проверка доступности сервера
 * @returns {Promise<boolean>} Результат проверки
 */
const isServerAvailable = async () => {
  try {
    const response = await fetch(API_ENDPOINT, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Сервер недоступен, используем локальное хранилище', error);
    return false;
  }
};

/**
 * Получить текущие курсы с сервера
 * @returns {Promise<Object>} Объект с курсами
 */
const fetchRatesFromServer = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error('Ошибка при получении курсов с сервера');
    }
    const data = await response.json();
    
    if (data.success) {
      // Кэшируем значения в localStorage на случай отсутствия интернета
      localStorage.setItem(STORAGE_KEYS.BUY_RATE, data.data.buy.toString());
      localStorage.setItem(STORAGE_KEYS.SELL_RATE, data.data.sell.toString());
      
      return { buyRate: data.data.buy, sellRate: data.data.sell };
    } else {
      throw new Error(data.message || 'Ошибка при получении курсов');
    }
  } catch (error) {
    console.error('Ошибка при получении курсов с сервера:', error);
    // Возвращаем курсы из localStorage в случае ошибки
    return {
      buyRate: getBuyRateFromStorage(),
      sellRate: getSellRateFromStorage()
    };
  }
};

/**
 * Обновить курсы на сервере
 * @param {number} buyRate - Новый курс покупки
 * @param {number} sellRate - Новый курс продажи
 * @returns {Promise<Object>} Результат обновления
 */
const updateRatesOnServer = async (buyRate, sellRate) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy: parseFloat(buyRate),
        sell: parseFloat(sellRate)
      })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении курсов на сервере');
    }
    
    const data = await response.json();
    
    if (data.success) {
      return { 
        buyRate: data.data.buy, 
        sellRate: data.data.sell 
      };
    } else {
      throw new Error(data.message || 'Ошибка при обновлении курсов');
    }
  } catch (error) {
    console.error('Ошибка при обновлении курсов на сервере:', error);
    throw error;
  }
};

/**
 * Получить текущий курс покупки USDT из localStorage
 * @returns {number} Текущий курс покупки
 */
const getBuyRateFromStorage = () => {
  const storedRate = localStorage.getItem(STORAGE_KEYS.BUY_RATE);
  return storedRate ? parseFloat(storedRate) : DEFAULT_VALUES.BUY_RATE;
};

/**
 * Получить текущий курс продажи USDT из localStorage
 * @returns {number} Текущий курс продажи
 */
const getSellRateFromStorage = () => {
  const storedRate = localStorage.getItem(STORAGE_KEYS.SELL_RATE);
  return storedRate ? parseFloat(storedRate) : DEFAULT_VALUES.SELL_RATE;
};

/**
 * Получить текущий курс покупки USDT
 * @returns {Promise<number>} Текущий курс покупки
 */
export const getBuyRate = async () => {
  const serverAvailable = await isServerAvailable();
  
  if (serverAvailable) {
    const rates = await fetchRatesFromServer();
    return rates.buyRate;
  } else {
    return getBuyRateFromStorage();
  }
};

/**
 * Получить текущий курс продажи USDT
 * @returns {Promise<number>} Текущий курс продажи
 */
export const getSellRate = async () => {
  const serverAvailable = await isServerAvailable();
  
  if (serverAvailable) {
    const rates = await fetchRatesFromServer();
    return rates.sellRate;
  } else {
    return getSellRateFromStorage();
  }
};

/**
 * Получить историю изменений курса
 * @returns {Array} История изменений курса
 */
export const getRatesHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.RATES_HISTORY);
  return history ? JSON.parse(history) : [];
};

/**
 * Обновить курсы обмена
 * @param {number} buyRate - Новый курс покупки
 * @param {number} sellRate - Новый курс продажи
 * @param {string} username - Имя пользователя, обновившего курс
 * @returns {Promise<Object>} Обновленные курсы и запись истории
 */
export const updateRates = async (buyRate, sellRate, username = 'admin') => {
  // Проверка корректности значений
  if (isNaN(buyRate) || isNaN(sellRate) || buyRate <= 0 || sellRate <= 0) {
    throw new Error('Курсы должны быть положительными числами');
  }
  
  // Преобразование в числа для безопасности
  const newBuyRate = parseFloat(buyRate);
  const newSellRate = parseFloat(sellRate);
  
  try {
    // Пытаемся обновить курсы на сервере
    const serverAvailable = await isServerAvailable();
    let updatedRates;
    
    if (serverAvailable) {
      updatedRates = await updateRatesOnServer(newBuyRate, newSellRate);
    } else {
      // Если сервер недоступен, обновляем только локально
      localStorage.setItem(STORAGE_KEYS.BUY_RATE, newBuyRate.toString());
      localStorage.setItem(STORAGE_KEYS.SELL_RATE, newSellRate.toString());
      updatedRates = { buyRate: newBuyRate, sellRate: newSellRate };
    }
    
    // Создание записи истории
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: username,
      buyRate: updatedRates.buyRate,
      sellRate: updatedRates.sellRate
    };
    
    // Получение и обновление истории
    const history = getRatesHistory();
    const updatedHistory = [historyEntry, ...history];
    
    // Ограничение истории до 100 записей
    if (updatedHistory.length > 100) {
      updatedHistory.length = 100;
    }
    
    // Сохранение обновленной истории
    localStorage.setItem(STORAGE_KEYS.RATES_HISTORY, JSON.stringify(updatedHistory));
    
    // Возвращение актуальных данных
    return {
      buyRate: updatedRates.buyRate,
      sellRate: updatedRates.sellRate,
      historyEntry
    };
  } catch (error) {
    console.error('Ошибка при обновлении курсов:', error);
    throw error;
  }
};

export default {
  getBuyRate,
  getSellRate,
  getRatesHistory,
  updateRates
}; 