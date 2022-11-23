import { useNavigate, useSearchParams } from 'react-router-dom';
import { Routes } from '../../share';

import { LoginForm } from '../components/LoginForm';

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <div className="my-6 flex justify-content-center">
      <LoginForm
        onSuccess={() => navigate(params.get('ref') || Routes.Home.path)}
      />
    </div>
  );
};

export default LoginPage;
