import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Иконки
import { IoHomeOutline, IoSwapHorizontalOutline, IoMenuOutline, IoChevronBack } from 'react-icons/io5';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  h1 {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, #00F0FF, #5773FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavItem = styled(motion.div)`
  cursor: pointer;
  font-size: 24px;
  color: ${props => props.active ? '#5773FF' : 'currentColor'};
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #5773FF;
  padding: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

function Header({ telegramUser }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const tg = window.Telegram?.WebApp;
  
  // Обработчик возврата в Telegram
  const handleBackClick = () => {
    if (tg) {
      tg.close();
    }
  };

  return (
    <HeaderContainer>
      {isHome ? (
        <Logo to="/">
          <h1>TeamEx</h1>
        </Logo>
      ) : (
        <BackButton 
          onClick={handleBackClick}
          whileTap={{ scale: 0.95 }}
        >
          <IoChevronBack /> Назад
        </BackButton>
      )}
      
      {telegramUser && (
        <UserInfo>
          {telegramUser.photo_url && <img src={telegramUser.photo_url} alt={telegramUser.first_name} />}
          <span>{telegramUser.first_name}</span>
        </UserInfo>
      )}
      
      <Navigation>
        <NavItem
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          active={location.pathname === '/'}
        >
          <Link to="/">
            <IoHomeOutline />
          </Link>
        </NavItem>
        <NavItem
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          active={location.pathname === '/exchange'}
        >
          <Link to="/exchange">
            <IoSwapHorizontalOutline />
          </Link>
        </NavItem>
      </Navigation>
    </HeaderContainer>
  );
}

export default Header; 