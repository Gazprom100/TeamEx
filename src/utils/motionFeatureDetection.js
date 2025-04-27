/**
 * Утилита для определения поддержки анимаций и отключения их в проблемных средах
 */

// Проверка, находимся ли мы в production сборке
const isProduction = process.env.NODE_ENV === 'production';

// Проверка доступности Telegram WebApp
const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;

// Проверка наличия тачскрина или мобильного устройства
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Проверка глобальных флагов отключения анимаций
const isAnimationsDisabled = typeof window !== 'undefined' && 
  (window.DISABLE_ALL_ANIMATIONS || window.DISABLE_COMPLEX_ANIMATIONS);

// Определяем, нужно ли отключить анимации полностью
const shouldDisableAnimations = isProduction && (
  isAnimationsDisabled || isTelegramWebApp || isTouchDevice
);

/**
 * Проверяет, разрешены ли сложные анимации в текущей среде
 * @returns {Boolean} - true если анимации разрешены, false если нет
 */
export const areComplexAnimationsAllowed = () => {
  if (typeof window === 'undefined') return false;
  
  // Если явно отключены сложные анимации - запрещаем
  if (window.DISABLE_COMPLEX_ANIMATIONS || window.DISABLE_ALL_ANIMATIONS) {
    return false;
  }
  
  // В автономном режиме (не в Telegram) разрешаем простые анимации
  if (!isTelegramWebApp) {
    return true;
  }
  
  // В Telegram WebApp на мобильных устройствах запрещаем сложные анимации
  if (isTelegramWebApp && isTouchDevice) {
    return false;
  }
  
  return true;
};

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
  
  // Если отключены только сложные анимации, удаляем hover и drag
  if (typeof window !== 'undefined' && window.DISABLE_COMPLEX_ANIMATIONS) {
    const safeProps = { ...animationProps };
    
    // Удаляем свойства hover, tap и drag
    delete safeProps.whileHover;
    delete safeProps.whileTap;
    delete safeProps.drag;
    delete safeProps.dragConstraints;
    
    return safeProps;
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
  
  // Если отключены только сложные анимации, удаляем hover и tap
  if (typeof window !== 'undefined' && window.DISABLE_COMPLEX_ANIMATIONS) {
    const safeVariants = { ...variants };
    delete safeVariants.hover;
    delete safeVariants.tap;
    return safeVariants;
  }
  
  return variants;
};

export default {
  shouldDisableAnimations,
  areComplexAnimationsAllowed,
  safeAnimationProps,
  safeVariants,
}; 