import { useEffect, useState, useRef } from 'react';

/**
 * Хук для безопасного использования анимаций.
 * Предотвращает ошибки, связанные с преждевременной анимацией DOM-элементов.
 * 
 * @param {number} delay - Задержка в миллисекундах перед началом анимации
 * @returns {Object} - Объект с флагом готовности и ссылкой на контейнер
 */
export const useSafeAnimation = (delay = 300) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Проверка на наличие Telegram WebApp и нужна ли дополнительная задержка
    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    const safeDelay = isTelegramWebApp ? delay * 2 : delay;
    
    let timeout;
    // Двойная защита - сначала проверяем готовность контейнера
    if (containerRef.current) {
      timeout = setTimeout(() => {
        setIsMounted(true);
      }, safeDelay);
    } else {
      // Если контейнер еще не создан, устанавливаем более длительную задержку
      timeout = setTimeout(() => {
        if (containerRef.current) {
          setIsMounted(true);
        } else {
          // Еще одна попытка, если контейнер все еще не создан
          const retryTimeout = setTimeout(() => {
            setIsMounted(true);
          }, safeDelay * 2);
          
          return () => clearTimeout(retryTimeout);
        }
      }, safeDelay);
    }
    
    return () => {
      clearTimeout(timeout);
      setIsMounted(false);
    };
  }, [delay]);
  
  return { isMounted, containerRef };
};

export default useSafeAnimation; 