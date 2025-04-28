import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardTypes, CardSizes } from '../components/Card';
import { Button, ButtonVariants, ButtonSizes } from '../components/Button';
import useSafeAnimation from '../hooks/useSafeAnimation';
import AdminStats from '../components/admin/AdminStats';
import AdminMessages from '../components/admin/AdminMessages';
import AdminRates from '../components/admin/AdminRates';
import AdminRequests from '../components/admin/AdminRequests';
import { isUserAdmin, loginAdmin, logoutAdmin, ADMIN_PASSWORD } from '../services/AdminAuth';

// Стили для админ-панели
const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
  
  @media (min-width: 992px) {
    padding: var(--spacing-lg);
  }
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const AdminTitle = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
`;

const AdminControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const TabsContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 576px) {
    overflow-x: auto;
    padding-bottom: var(--spacing-xs);
    &::-webkit-scrollbar {
      height: 4px;
    }
  }
`;

const TabButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-primary)'};
  }
  
  @media (max-width: 576px) {
    white-space: nowrap;
  }
`;

const ContentContainer = styled(motion.div)`
  flex: 1;
`;

// Основной компонент админ-панели
const Admin = ({ telegramUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isMounted } = useSafeAnimation(300);
  
  // Проверка, является ли пользователь админом
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        
        // Проверяем права доступа через сервис
        const hasAccess = isUserAdmin(telegramUser);
        setIsAdmin(hasAccess);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [telegramUser]);
  
  // Обработчик смены вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Функция для выхода из админ-панели
  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    navigate('/');
  };
  
  // Обработчик входа в админ-панель
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Используем сервис для авторизации
    if (loginAdmin(adminPassword)) {
      setIsAdmin(true);
    } else {
      alert('Неверный пароль');
    }
  };
  
  // Отображаем соответствующий контент в зависимости от активной вкладки
  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'messages':
        return <AdminMessages />;
      case 'rates':
        return <AdminRates />;
      case 'requests':
        return <AdminRequests />;
      default:
        return <AdminStats />;
    }
  };
  
  // Пока проверяем права доступа, показываем загрузку
  if (isLoading || !isMounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Загрузка...
      </div>
    );
  }
  
  // Если пользователь не администратор, показываем форму входа
  if (!isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Вход в панель администратора</h2>
        <Card style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '10px' }}>
              Пароль администратора:
              <input 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button 
                variant={ButtonVariants.OUTLINE}
                size={ButtonSizes.SMALL}
                onClick={() => navigate('/')}
              >
                На главную
              </Button>
              <Button 
                variant={ButtonVariants.PRIMARY}
                size={ButtonSizes.SMALL}
                type="submit"
              >
                Войти
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }
  
  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Панель администратора</AdminTitle>
        <AdminControls>
          <Button 
            variant={ButtonVariants.OUTLINE}
            size={ButtonSizes.SMALL}
            onClick={() => navigate('/')}
          >
            На главную
          </Button>
          <Button 
            variant={ButtonVariants.DANGER}
            size={ButtonSizes.SMALL}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </AdminControls>
      </AdminHeader>
      
      <TabsContainer>
        <TabButton active={activeTab === 'stats'} onClick={() => handleTabChange('stats')}>Статистика</TabButton>
        <TabButton active={activeTab === 'requests'} onClick={() => handleTabChange('requests')}>Заявки</TabButton>
        <TabButton active={activeTab === 'rates'} onClick={() => handleTabChange('rates')}>Курс</TabButton>
        <TabButton active={activeTab === 'messages'} onClick={() => handleTabChange('messages')}>Сообщения</TabButton>
      </TabsContainer>
      
      <ContentContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        key={activeTab}
      >
        {renderContent()}
      </ContentContainer>
    </AdminContainer>
  );
};

export default Admin; 