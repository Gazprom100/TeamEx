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

const About = () => {
  const navigate = useNavigate();
  
  return (
    <Layout 
      title="О НАС" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <Section>
        <Paragraph>
          Занимаемся обменом криптовалют более 3х лет.
        </Paragraph>

        <Paragraph>
          Работаем 24/7. При первом визите необходимо иметь паспорт.
        </Paragraph>

        <Paragraph>
          Работаем только за наличные рубли.
        </Paragraph>

        <Paragraph>
          Мы работаем стол в стол, т.е. не храним ваши средства у себя.
        </Paragraph>

        <Paragraph>
          У нас вы можете купить USDT без комиссии по самому лучшему курсу в Москве.
        </Paragraph>

        <Paragraph>
          Наш адрес:
          <br />
          г. Москва, Пресненская набережная 12,
          <br />
          Башня Федерация. Восток, этаж 11
        </Paragraph>

        <Paragraph>
          Для получения пропуска к нам в офис и покупки USDT, вам нужно создать заявку через бота
        </Paragraph>

        <Paragraph>
          Гостевой пропуск выдается на ресепшене:
          <br />
          На минус первом этаже с 8.00 до 19.00
          <br />
          На первом этаже с 19.00 до 8.00.
        </Paragraph>
      </Section>
    </Layout>
  );
};

export default About; 