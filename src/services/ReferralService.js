/**
 * Сервис для управления реферальной программой
 */

// Ключи для хранения данных в localStorage и файлах
const STORAGE_KEYS = {
  REFERRALS: 'teamex_referrals',
  COMMISSIONS: 'teamex_commissions'
};

// Константы для реферальной программы
const REFERRAL_CONSTANTS = {
  PLATFORM_SHARE: 0.3,    // 30% для площадки
  FIRST_LINE_SHARE: 0.4,  // 40% для первой линии
  SECOND_LINE_SHARE: 0.2, // 20% для второй линии
  THIRD_LINE_SHARE: 0.1,  // 10% для третьей линии
  COMMISSION_RATE: 0.01   // 1% от суммы сделки (настраиваемый параметр)
};

/**
 * Получить реферальный код пользователя
 * @param {number|string} userId - ID пользователя в Telegram
 * @returns {string} Реферальный код пользователя
 */
export const getUserReferralCode = (userId) => {
  if (!userId) return null;
  
  // Простой способ генерации реферального кода на основе ID пользователя
  return `ref_${userId}_${Date.now().toString(36)}`;
};

/**
 * Сгенерировать реферальную ссылку для пользователя
 * @param {number|string} userId - ID пользователя в Telegram
 * @param {string} botUsername - Имя Telegram бота
 * @returns {string} Реферальная ссылка
 */
export const generateReferralLink = (userId, botUsername) => {
  if (!userId || !botUsername) return null;
  
  const refCode = getUserReferralCode(userId);
  return `https://t.me/${botUsername}?start=${refCode}`;
};

/**
 * Получить список всех рефералов
 * @returns {Object} Объект со всеми реферальными связями
 */
export const getAllReferrals = () => {
  try {
    const referralsData = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return referralsData ? JSON.parse(referralsData) : {};
  } catch (error) {
    console.error('Ошибка при получении данных о рефералах:', error);
    return {};
  }
};

/**
 * Добавить нового реферала
 * @param {number|string} referrerId - ID реферера (кто пригласил)
 * @param {number|string} referredId - ID реферала (кого пригласили)
 * @returns {boolean} Результат операции
 */
export const addReferral = (referrerId, referredId) => {
  try {
    if (!referrerId || !referredId) return false;
    
    // Преобразуем в строки для безопасности
    const referrerIdStr = referrerId.toString();
    const referredIdStr = referredId.toString();
    
    // Нельзя быть собственным рефералом
    if (referrerIdStr === referredIdStr) return false;
    
    // Получаем текущие реферальные связи
    const referrals = getAllReferrals();
    
    // Проверяем, не зарегистрирован ли уже пользователь через другого реферера
    if (referrals[referredIdStr] && referrals[referredIdStr].referrerId) {
      return false; // Уже зарегистрирован через кого-то другого
    }
    
    // Находим верхние уровни (до 3-х линий вверх)
    let firstLine = referrerIdStr;
    let secondLine = null;
    let thirdLine = null;
    
    if (referrals[firstLine]) {
      secondLine = referrals[firstLine].referrerId;
      
      if (secondLine && referrals[secondLine]) {
        thirdLine = referrals[secondLine].referrerId;
      }
    }
    
    // Обновляем реферальные данные
    referrals[referredIdStr] = {
      referrerId: firstLine,
      secondLineId: secondLine,
      thirdLineId: thirdLine,
      dateAdded: new Date().toISOString()
    };
    
    // Сохраняем обновленные данные
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
    
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении реферала:', error);
    return false;
  }
};

/**
 * Получить комиссии пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {Array} Массив комиссий пользователя
 */
export const getUserCommissions = (userId) => {
  try {
    if (!userId) return [];
    
    const userIdStr = userId.toString();
    const commissionsData = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
    const commissions = commissionsData ? JSON.parse(commissionsData) : {};
    
    return commissions[userIdStr] || [];
  } catch (error) {
    console.error('Ошибка при получении комиссий пользователя:', error);
    return [];
  }
};

/**
 * Получить общую сумму комиссий пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {number} Общая сумма комиссий
 */
export const getTotalUserCommissions = (userId) => {
  const commissions = getUserCommissions(userId);
  return commissions.reduce((total, commission) => total + commission.amount, 0);
};

/**
 * Рассчитать и распределить комиссии от сделки
 * @param {number|string} userId - ID пользователя, совершившего сделку
 * @param {number} amount - Сумма сделки
 * @param {string} operation - Тип операции (buy/sell)
 * @returns {Object} Результат распределения комиссий
 */
export const distributeCommissions = (userId, amount, operation) => {
  try {
    if (!userId || !amount || amount <= 0) return null;
    
    const userIdStr = userId.toString();
    const referrals = getAllReferrals();
    const userReferral = referrals[userIdStr];
    
    // Если пользователь не в реферальной структуре, вся комиссия идет площадке
    if (!userReferral) {
      return {
        platform: amount * REFERRAL_CONSTANTS.COMMISSION_RATE,
        firstLine: 0,
        secondLine: 0,
        thirdLine: 0
      };
    }
    
    // Базовая комиссия от сделки
    const totalCommission = amount * REFERRAL_CONSTANTS.COMMISSION_RATE;
    
    // Распределение по линиям
    const firstLineAmount = totalCommission * REFERRAL_CONSTANTS.FIRST_LINE_SHARE;
    const secondLineAmount = totalCommission * REFERRAL_CONSTANTS.SECOND_LINE_SHARE;
    const thirdLineAmount = totalCommission * REFERRAL_CONSTANTS.THIRD_LINE_SHARE;
    const platformAmount = totalCommission * REFERRAL_CONSTANTS.PLATFORM_SHARE;
    
    // Получаем текущие комиссии
    const commissionsData = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
    const commissions = commissionsData ? JSON.parse(commissionsData) : {};
    
    // Сохраняем комиссии для каждой линии
    const timestamp = new Date().toISOString();
    
    // Первая линия
    if (userReferral.referrerId) {
      if (!commissions[userReferral.referrerId]) {
        commissions[userReferral.referrerId] = [];
      }
      
      commissions[userReferral.referrerId].push({
        amount: firstLineAmount,
        fromUserId: userIdStr,
        level: 1,
        operation,
        timestamp
      });
    } else {
      // Если нет первой линии, комиссия идет площадке
    }
    
    // Вторая линия
    if (userReferral.secondLineId) {
      if (!commissions[userReferral.secondLineId]) {
        commissions[userReferral.secondLineId] = [];
      }
      
      commissions[userReferral.secondLineId].push({
        amount: secondLineAmount,
        fromUserId: userIdStr,
        level: 2,
        operation,
        timestamp
      });
    }
    
    // Третья линия
    if (userReferral.thirdLineId) {
      if (!commissions[userReferral.thirdLineId]) {
        commissions[userReferral.thirdLineId] = [];
      }
      
      commissions[userReferral.thirdLineId].push({
        amount: thirdLineAmount,
        fromUserId: userIdStr,
        level: 3,
        operation,
        timestamp
      });
    }
    
    // Сохраняем обновленные комиссии
    localStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(commissions));
    
    return {
      platform: platformAmount,
      firstLine: firstLineAmount,
      secondLine: secondLineAmount,
      thirdLine: thirdLineAmount,
      total: totalCommission
    };
  } catch (error) {
    console.error('Ошибка при распределении комиссий:', error);
    return null;
  }
};

/**
 * Получить статистику реферальной программы
 * @returns {Object} Статистика реферальной программы
 */
export const getReferralStats = () => {
  try {
    const referrals = getAllReferrals();
    const commissionsData = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
    const commissions = commissionsData ? JSON.parse(commissionsData) : {};
    
    // Подсчет количества рефералов
    const totalReferrals = Object.keys(referrals).length;
    
    // Подсчет общей суммы комиссий
    let totalCommissionsAmount = 0;
    Object.values(commissions).forEach(userCommissions => {
      userCommissions.forEach(commission => {
        totalCommissionsAmount += commission.amount;
      });
    });
    
    // Подсчет комиссий за последние 30 дней
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let last30DaysCommissions = 0;
    Object.values(commissions).forEach(userCommissions => {
      userCommissions.forEach(commission => {
        const commissionDate = new Date(commission.timestamp);
        if (commissionDate >= thirtyDaysAgo) {
          last30DaysCommissions += commission.amount;
        }
      });
    });
    
    return {
      totalReferrals,
      totalCommissionsAmount,
      last30DaysCommissions
    };
  } catch (error) {
    console.error('Ошибка при получении статистики реферальной программы:', error);
    return {
      totalReferrals: 0,
      totalCommissionsAmount: 0,
      last30DaysCommissions: 0
    };
  }
};

export default {
  getUserReferralCode,
  generateReferralLink,
  getAllReferrals,
  addReferral,
  getUserCommissions,
  getTotalUserCommissions,
  distributeCommissions,
  getReferralStats
}; 