/**
 * Сервис для авторизации и проверки прав администраторов
 */

// Список ID администраторов из Telegram
export const ADMIN_IDS = [
  297810833, // ID администратора
  // Добавьте других администраторов по необходимости
];

// Хэш административного пароля (для демо используем простой пароль)
// В реальном приложении используйте более безопасные методы хранения и проверки
export const ADMIN_PASSWORD = 'admin1234'; // Пароль администратора

/**
 * Проверяет, имеет ли пользователь права администратора
 * @param {Object} telegramUser - Пользователь Telegram
 * @returns {boolean} - Результат проверки
 */
export const isUserAdmin = (telegramUser) => {
  // Проверяем, авторизован ли админ через localStorage
  const hasStoredAccess = localStorage.getItem('adminAccess') === 'true';
  
  // Проверяем, является ли Telegram пользователь администратором
  const isTelegramAdmin = telegramUser && ADMIN_IDS.includes(telegramUser?.id);
  
  // Отладочная информация в консоль
  console.log('Проверка доступа админа:', {
    telegramUser: telegramUser,
    telegramUserId: telegramUser?.id,
    hasStoredAccess: hasStoredAccess,
    isTelegramAdmin: isTelegramAdmin,
    adminIds: ADMIN_IDS
  });
  
  // Временно разрешаем доступ всем для тестирования панели администратора
  // ВНИМАНИЕ: Удалите эту строку в продакшн-версии!
  return true; // Временное решение для тестирования
  
  // return hasStoredAccess || isTelegramAdmin; // Раскомментируйте эту строку и удалите предыдущую для продакшена
};

/**
 * Авторизует пользователя как администратора
 * @param {string} password - Введенный пароль
 * @returns {boolean} - Результат авторизации
 */
export const loginAdmin = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminAccess', 'true');
    return true;
  }
  return false;
};

/**
 * Выход из учетной записи администратора
 */
export const logoutAdmin = () => {
  localStorage.removeItem('adminAccess');
};

export default {
  isUserAdmin,
  loginAdmin,
  logoutAdmin,
  ADMIN_IDS,
  ADMIN_PASSWORD
}; 