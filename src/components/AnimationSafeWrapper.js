import React, { useEffect } from 'react';
import styled from 'styled-components';
import useSafeAnimation from '../hooks/useSafeAnimation';

/**
 * Компонент-обертка для безопасной анимации.
 * Отображает компоненты с анимацией только когда DOM готов.
 */
const AnimationSafeWrapper = ({ 
  children, 
  delay = 400, 
  fallback = null,
  ...otherProps 
}) => {
  const { isMounted, containerRef } = useSafeAnimation(delay);
  
  // Проверяем глобальные флаги анимаций
  useEffect(() => {
    // Если есть ошибки анимации и мы в автономном режиме, используем запасной вариант
    const shouldUseStatic = 
      typeof window !== 'undefined' && 
      (window.DISABLE_ALL_ANIMATIONS || 
       window.DISABLE_COMPLEX_ANIMATIONS);
    
    if (shouldUseStatic && containerRef.current) {
      // Блокируем все события мыши, которые могут вызвать hover анимации
      const blockEvents = (event) => {
        if (event.type.startsWith('mouse') || event.type.startsWith('pointer')) {
          event.stopPropagation();
        }
      };
      
      // Добавляем блокировку событий к контейнеру
      const containerElement = containerRef.current;
      const eventTypes = ['mouseover', 'mouseenter', 'mousemove', 'pointerover', 'pointerenter'];
      
      eventTypes.forEach(type => {
        containerElement.addEventListener(type, blockEvents, true);
      });
      
      return () => {
        eventTypes.forEach(type => {
          containerElement.removeEventListener(type, blockEvents, true);
        });
      };
    }
  }, [containerRef]);
  
  // Если анимации полностью отключены, всегда показываем запасной вариант
  if (typeof window !== 'undefined' && window.DISABLE_ALL_ANIMATIONS) {
    return <Container {...otherProps}>{fallback}</Container>;
  }
  
  // Если отключены только сложные анимации, проверяем есть ли в children hover/drag и используем fallback
  if (typeof window !== 'undefined' && window.DISABLE_COMPLEX_ANIMATIONS) {
    const childrenString = children?.toString() || '';
    const hasComplexAnimations = 
      childrenString.includes('whileHover') || 
      childrenString.includes('whileTap') || 
      childrenString.includes('drag');
    
    if (hasComplexAnimations) {
      return <Container {...otherProps}>{fallback}</Container>;
    }
  }
  
  return (
    <Container ref={containerRef} {...otherProps}>
      {isMounted ? children : fallback}
    </Container>
  );
};

const Container = styled.div`
  display: contents; /* Этот элемент не влияет на разметку */
`;

export default AnimationSafeWrapper; 