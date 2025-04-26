import { useEffect, useState } from 'react';

export const useSafeAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Устанавливаем состояние монтирования только после того, как компонент полностью отрендерен
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    
    return () => {
      clearTimeout(timeout);
      setIsMounted(false);
    };
  }, []);
  
  return isMounted;
};

export default useSafeAnimation; 