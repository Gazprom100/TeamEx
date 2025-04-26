import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-white);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: var(--text-gray);
  margin-bottom: 20px;
`;

const Requests = () => {
  const navigate = useNavigate();
  const requests = []; // Empty for demo, would come from API
  
  return (
    <Layout 
      title="ВСЕ ЗАЯВКИ" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      {requests.length > 0 ? (
        <div>
          {/* Would map through requests here */}
        </div>
      ) : (
        <EmptyState>
          <EmptyText>У вас пока нет заявок</EmptyText>
        </EmptyState>
      )}
    </Layout>
  );
};

export default Requests; 