import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../Card';
import api from '../../services/api';

const Container = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RequestsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background: rgba(255,255,255,0.05);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255,255,255,0.07);
`;

const TableHeader = styled.th`
  padding: 12px 8px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px 8px;
  color: var(--text-primary);
  font-size: 15px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  background: ${({ status }) => status === 'pending' ? 'var(--color-warning)' : status === 'done' ? 'var(--color-success)' : 'var(--color-danger)'};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
`;

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getAllRequests?.();
        setRequests(data || []);
      } catch (e) {
        setError('Ошибка загрузки заявок');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Заявки на обмен</h2>
      {loading ? (
        <EmptyState>Загрузка...</EmptyState>
      ) : error ? (
        <EmptyState>{error}</EmptyState>
      ) : requests.length === 0 ? (
        <EmptyState>Нет заявок</EmptyState>
      ) : (
        <Card style={{ padding: 0, overflowX: 'auto' }}>
          <RequestsTable>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Пользователь</TableHeader>
                <TableHeader>Тип</TableHeader>
                <TableHeader>Сумма (USDT)</TableHeader>
                <TableHeader>Сумма (RUB)</TableHeader>
                <TableHeader>Статус</TableHeader>
                <TableHeader>Дата</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {requests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.username || req.user_id}</TableCell>
                  <TableCell>{req.type === 'buy' ? 'Покупка' : 'Продажа'}</TableCell>
                  <TableCell>{req.amount}</TableCell>
                  <TableCell>{req.total}</TableCell>
                  <TableCell><StatusBadge status={req.status || 'pending'}>{req.status === 'done' ? 'Выполнено' : req.status === 'cancelled' ? 'Отменено' : 'В ожидании'}</StatusBadge></TableCell>
                  <TableCell>{req.createdAt ? new Date(req.createdAt).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </RequestsTable>
        </Card>
      )}
    </Container>
  );
};

export default AdminRequests; 