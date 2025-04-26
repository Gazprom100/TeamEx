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

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-white);
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: var(--text-white);
`;

const RulesList = styled.ol`
  padding-left: 20px;
  margin-bottom: 20px;
`;

const RuleItem = styled.li`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: var(--text-white);
`;

const Rules = () => {
  const navigate = useNavigate();
  
  return (
    <Layout 
      title="ПРАВИЛА" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <Title>Правила использования сервиса</Title>
      
      <Section>
        <SectionTitle>1. Общие положения</SectionTitle>
        <Paragraph>
          Пользуясь нашим сервисом, вы соглашаетесь соблюдать настоящие правила.
          Мы оставляем за собой право изменять правила в любое время без предварительного уведомления.
        </Paragraph>
      </Section>
      
      <Section>
        <SectionTitle>2. Правила обмена</SectionTitle>
        <RulesList>
          <RuleItem>
            Для выполнения операции обмена необходимо заполнить все обязательные поля в форме заявки.
          </RuleItem>
          <RuleItem>
            При первом посещении офиса обязательно иметь при себе паспорт.
          </RuleItem>
          <RuleItem>
            Мы работаем только за наличные рубли.
          </RuleItem>
          <RuleItem>
            Курс обмена может меняться в зависимости от рыночной ситуации.
          </RuleItem>
          <RuleItem>
            После создания заявки вам нужно получить пропуск на ресепшене и посетить наш офис.
          </RuleItem>
        </RulesList>
      </Section>
      
      <Section>
        <SectionTitle>3. Ограничения ответственности</SectionTitle>
        <Paragraph>
          Мы не несем ответственности за:
        </Paragraph>
        <RulesList>
          <RuleItem>
            Убытки, возникшие в результате ошибок пользователя при указании адреса кошелька.
          </RuleItem>
          <RuleItem>
            Задержки транзакций, связанные с работой блокчейн-сети.
          </RuleItem>
          <RuleItem>
            Проблемы, возникшие в результате использования неофициальных приложений и сервисов третьих сторон.
          </RuleItem>
        </RulesList>
      </Section>
      
      <Section>
        <SectionTitle>4. Конфиденциальность</SectionTitle>
        <Paragraph>
          Мы уважаем вашу конфиденциальность и собираем только необходимую информацию для предоставления услуг.
          Ваши персональные данные используются в соответствии с законодательством РФ.
        </Paragraph>
      </Section>
    </Layout>
  );
};

export default Rules; 