import { Card, Container } from '@mantine/core';
import { webRoutes } from '@roxavn/core/base';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LoginForm } from '../components';

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <Container size={400} py={50}>
      <Card withBorder>
        <LoginForm
          onSuccess={() => navigate(params.get('ref') || webRoutes.Me.path)}
        />
      </Card>
    </Container>
  );
};

export default LoginPage;
