import { Card, Container } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Routes } from '../../share';

import { LoginForm } from '../components/LoginForm';

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <Container size={400} py={50}>
      <Card withBorder>
        <LoginForm
          onSuccess={() => navigate(params.get('ref') || Routes.Home.path)}
        />
      </Card>
    </Container>
  );
};

export default LoginPage;
