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

const InfoText = styled.p`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 40px;
  color: var(--text-white);
`;

const Referral = () => {
  const navigate = useNavigate();
  
  return (
    <Layout 
      title="РЕФЕРАЛЬНАЯ ПРОГРАММА" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <InfoText>
        Реферальная программа находится в разработке и скоро будет доступна.
      </InfoText>
    </Layout>
  );
};

export default Referral; 