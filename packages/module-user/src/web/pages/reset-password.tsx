import { Card, Container } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WebRoutes } from '../../share';
import { ResetPasswordForm } from '../components';

const ResetPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <Container size={400} py={50}>
      <Card withBorder>
        <ResetPasswordForm
          username={params.get('username') || ''}
          token={params.get('token') || ''}
          onSuccess={() => navigate(WebRoutes.Login.path)}
        />
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
