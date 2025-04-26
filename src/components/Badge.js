import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BadgeVariants = {
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  NEUTRAL: 'neutral',
};

const BadgeSizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

const getBadgeColors = (variant) => {
  switch (variant) {
    case BadgeVariants.PRIMARY:
      return {
        bg: 'rgba(55, 114, 255, 0.15)',
        color: 'var(--accent-primary)',
        border: 'var(--accent-primary)'
      };
    case BadgeVariants.SUCCESS:
      return {
        bg: 'rgba(0, 183, 117, 0.15)',
        color: 'var(--accent-success)',
        border: 'var(--accent-success)'
      };
    case BadgeVariants.WARNING:
      return {
        bg: 'rgba(255, 195, 74, 0.15)',
        color: 'var(--accent-warning)',
        border: 'var(--accent-warning)'
      };
    case BadgeVariants.DANGER:
      return {
        bg: 'rgba(245, 59, 87, 0.15)',
        color: 'var(--accent-danger)',
        border: 'var(--accent-danger)'
      };
    case BadgeVariants.INFO:
      return {
        bg: 'rgba(2, 132, 199, 0.15)',
        color: 'var(--accent-secondary)',
        border: 'var(--accent-secondary)'
      };
    case BadgeVariants.NEUTRAL:
    default:
      return {
        bg: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--text-secondary)',
        border: 'var(--border-color)'
      };
  }
};

const getBadgeSize = (size) => {
  switch (size) {
    case BadgeSizes.SMALL:
      return {
        padding: '2px 8px',
        fontSize: '12px'
      };
    case BadgeSizes.LARGE:
      return {
        padding: '6px 14px',
        fontSize: '16px'
      };
    case BadgeSizes.MEDIUM:
    default:
      return {
        padding: '4px 10px',
        fontSize: '14px'
      };
  }
};

const StyledBadge = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 100px;
  font-weight: 600;
  white-space: nowrap;
  
  ${({ variant }) => {
    const colors = getBadgeColors(variant);
    return `
      background-color: ${colors.bg};
      color: ${colors.color};
      border: 1px solid ${colors.bg};
    `;
  }}
  
  ${({ size }) => {
    const sizeStyles = getBadgeSize(size);
    return `
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
    `;
  }}
  
  ${({ outline, variant }) => {
    if (outline) {
      const colors = getBadgeColors(variant);
      return `
        background-color: transparent;
        border: 1px solid ${colors.border};
      `;
    }
    return '';
  }}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
`;

const Badge = ({
  children,
  variant = BadgeVariants.PRIMARY,
  size = BadgeSizes.MEDIUM,
  icon,
  outline = false,
  ...props
}) => {
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <StyledBadge
      variant={variant}
      size={size}
      outline={outline}
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledBadge>
  );
};

export { Badge, BadgeVariants, BadgeSizes }; 