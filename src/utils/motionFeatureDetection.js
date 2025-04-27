/**
 * Утилита для определения поддержки анимаций и отключения их в проблемных средах
 */

// Проверка, находимся ли мы в production сборке
const isProduction = process.env.NODE_ENV === 'production';

// Проверка доступности Telegram WebApp
const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;

// Проверка наличия тачскрина или мобильного устройства
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Определяем, нужно ли отключить анимации полностью
const shouldDisableAnimations = isProduction && (isTelegramWebApp || isTouchDevice);

/**
 * Возвращает пустые свойства анимации, если анимации отключены
 * @param {Object} animationProps - Свойства анимации Framer Motion
 * @returns {Object} - Исходные свойства или пустые заглушки
 */
export const safeAnimationProps = (animationProps = {}) => {
  if (shouldDisableAnimations) {
    // Возвращаем пустые свойства для отключения анимаций
    return {};
  }
  return animationProps;
};

/**
 * Возвращает безопасные варианты анимации
 */
export const safeVariants = (variants = {}) => {
  if (shouldDisableAnimations) {
    // Для каждого ключа создаем пустой вариант без анимации
    const safeVariants = {};
    Object.keys(variants).forEach(key => {
      safeVariants[key] = { transition: { duration: 0 } };
    });
    return safeVariants;
  }
  return variants;
};

export default {
  shouldDisableAnimations,
  safeAnimationProps,
  safeVariants,
}; 