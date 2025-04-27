import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  color: ${props => props.color || 'currentColor'};
  transition: all 0.2s ease;
`;

// Иконка обмена
export const ExchangeIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 21.5L4.5 18.5L7.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 18.5H15C18.038 18.5 20.5 16.038 20.5 13C20.5 9.962 18.038 7.5 15 7.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 2.5L19.5 5.5L16.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.5 5.5H9C5.962 5.5 3.5 7.962 3.5 11C3.5 14.038 5.962 16.5 9 16.5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка графика
export const ChartIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7H21V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 20H3V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка кошелька
export const WalletIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8C2 6.89543 2.89543 6 4 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 10H18C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 3L4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 3L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка пользователя
export const UserIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка поддержки
export const SupportIcon = ({ size, color, ...props }) => (
  <IconWrapper size={size} color={color} {...props}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5C21 16.7467 16.7467 21 11.5 21C7.77661 21 4.56832 18.8395 3 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11.5" cy="11.5" r="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 22L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка информации
export const InfoIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка безопасности
export const SecurityIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка для криптовалют (общая)
export const CryptoIcon = ({ size, color, ...props }) => (
  <IconWrapper size={size} color={color} {...props}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3.5V2M14.5 3.5V2M9 22V20.5M14.5 22V20.5M3.5 9H2M3.5 14.5H2M22 9H20.5M22 14.5H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 8.5H10.5C9.94772 8.5 9.5 8.94772 9.5 9.5V10C9.5 10.5523 9.94772 11 10.5 11H13.5C14.0523 11 14.5 11.4477 14.5 12V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8.5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15V13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Иконка проверки/валидации
export const VerifyIcon = ({ size, color, ...props }) => (
  <IconWrapper size={size} color={color} {...props}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Логотип TeamEx
export const TeamExLogo = ({ size, color, ...props }) => (
  <IconWrapper size={size} color={color} {...props}>
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6H24M8 16H24M8 26H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 6H4.01M4 16H4.01M4 26H4.01M28 6H28.01M28 16H28.01M28 26H28.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4287 4C16.3217 4 17.0857 4.672 17.1807 5.559L17.9997 14L18.8187 5.559C18.9137 4.672 19.6777 4 20.5707 4H25.9997C26.5517 4 26.9997 4.448 26.9997 5C26.9997 5.552 26.5517 6 25.9997 6H20.5707L18.8767 27.559C18.7817 28.446 18.0177 29.118 17.1247 29.118H17.1237C16.2317 29.118 15.4677 28.446 15.3717 27.559L15.9997 18L14.6277 27.559C14.5317 28.446 13.7677 29.118 12.8757 29.118H12.8747C11.9817 29.118 11.2177 28.446 11.1227 27.559L9.4287 6H3.9997C3.4477 6 2.9997 5.552 2.9997 5C2.9997 4.448 3.4477 4 3.9997 4H9.4287C10.3217 4 11.0857 4.672 11.1807 5.559L12.9997 14L13.8187 5.559C13.9137 4.672 14.6777 4 15.5707 4H15.4287Z" fill="currentColor"/>
    </svg>
  </IconWrapper>
);

export const LogoIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6ZM12 12H20V20H12V12Z" fill="currentColor"/>
    </svg>
  </IconWrapper>
);

export const HomeIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const ArrowRightIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const ArrowLeftIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const BankIcon = ({ size, color }) => (
  <IconWrapper size={size} color={color}>
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 21V15M8 21V15M12 21V15M16 21V15M20 21V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 10L12 3L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 10V12C4 12.5523 4.44772 13 5 13H19C19.5523 13 20 12.5523 20 12V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const AdminIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM20 4H22V6H20V8H18V6H16V4H18V2H20V4ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.67 16 18 17.07 18 18V18.5H6V18C6 17.07 9.33 16 12 16Z" 
    fill="currentColor"/>
  </svg>
);

export default {
  ExchangeIcon,
  ChartIcon,
  WalletIcon,
  UserIcon,
  SupportIcon,
  InfoIcon,
  SecurityIcon,
  CryptoIcon,
  VerifyIcon,
  TeamExLogo,
  LogoIcon,
  HomeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BankIcon,
  AdminIcon
}; 