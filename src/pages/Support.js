import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Section = styled.section`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-white);
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: var(--text-white);
`;

const ContactBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const ContactTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-white);
`;

const ContactLink = styled.a`
  color: var(--main-green);
  display: block;
  margin-top: 10px;
  font-size: 16px;
`;

const Support = () => {
  const navigate = useNavigate();
  
  return (
    <Layout 
      title="ПОДДЕРЖКА" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <Section>
        <Paragraph>
          Наша служба поддержки работает круглосуточно, 7 дней в неделю.
        </Paragraph>

        <Paragraph>
          Для связи с нами вы можете использовать чат в этом приложении или написать нам напрямую.
        </Paragraph>

        <ContactBox>
          <ContactTitle>Контакты службы поддержки:</ContactTitle>
          <ContactLink href="https://t.me/Mosca67_Support" target="_blank">
            @Mosca67_Support
          </ContactLink>
        </ContactBox>
      </Section>
      
      <Button 
        onClick={() => window.open('https://t.me/Mosca67_Support', '_blank')}
        fullWidth
      >
        Написать в поддержку
      </Button>
    </Layout>
  );
};

export default Support; 