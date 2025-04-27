import { useEffect, useState } from 'react';

export const useSafeAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Проверка на наличие Telegram WebApp
    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    
    // Увеличенный таймаут для полной загрузки DOM
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, isTelegramWebApp ? 600 : 300); // Увеличиваем таймаут для более надежной загрузки
    
    return () => {
      clearTimeout(timeout);
      setIsMounted(false);
    };
  }, []);
  
  return isMounted;
};

export default useSafeAnimation; 