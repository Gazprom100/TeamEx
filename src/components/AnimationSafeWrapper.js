import React from 'react';
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