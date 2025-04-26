import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 30px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const IconTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

// Компонент для генерации иконок разных размеров
const GenerateIcons = () => {
  return (
    <Container>
      <IconContainer>
        <IconTitle>Logo 32x32</IconTitle>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#0E131A" />
          <path d="M16 5C9.925 5 5 9.925 5 16C5 22.075 9.925 27 16 27C22.075 27 27 22.075 27 16C27 9.925 22.075 5 16 5ZM16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8Z" fill="#3772FF" />
          <path d="M16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12Z" fill="#3772FF" />
        </svg>
      </IconContainer>
      
      <IconContainer>
        <IconTitle>Logo 192x192</IconTitle>
        <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
          <rect width="192" height="192" rx="48" fill="#0E131A" />
          <path d="M96 30C59.55 30 30 59.55 30 96C30 132.45 59.55 162 96 162C132.45 162 162 132.45 162 96C162 59.55 132.45 30 96 30ZM96 48C122.51 48 144 69.49 144 96C144 122.51 122.51 144 96 144C69.49 144 48 122.51 48 96C48 69.49 69.49 48 96 48Z" fill="#3772FF" />
          <path d="M96 72C82.745 72 72 82.745 72 96C72 109.255 82.745 120 96 120C109.255 120 120 109.255 120 96C120 82.745 109.255 72 96 72Z" fill="#3772FF" />
        </svg>
      </IconContainer>
      
      <IconContainer>
        <IconTitle>Logo 512x512</IconTitle>
        <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" rx="128" fill="#0E131A" />
          <path d="M256 80C159.4 80 80 159.4 80 256C80 352.6 159.4 432 256 432C352.6 432 432 352.6 432 256C432 159.4 352.6 80 256 80ZM256 128C326.7 128 384 185.3 384 256C384 326.7 326.7 384 256 384C185.3 384 128 326.7 128 256C128 185.3 185.3 128 256 128Z" fill="#3772FF" />
          <path d="M256 192C220.7 192 192 220.7 192 256C192 291.3 220.7 320 256 320C291.3 320 320 291.3 320 256C320 220.7 291.3 192 256 192Z" fill="#3772FF" />
        </svg>
      </IconContainer>
    </Container>
  );
};

export default GenerateIcons; 