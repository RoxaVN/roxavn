import { Card, Container } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WebRoutes } from '../../base';
import { LoginForm } from '../components';

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <Container size={400} py={50}>
      <Card withBorder>
        <LoginForm
          onSuccess={() => navigate(params.get('ref') || WebRoutes.Me.path)}
        />
      </Card>
    </Container>
  );
};

export default LoginPage;
