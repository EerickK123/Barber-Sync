import { AuthLayout } from '@/global/layouts/auth/auth.layout';
import { RegisterScreen } from '@/features/auth/register/screen/register.screen';

const RegisterRoute = () => {
  return (
    <AuthLayout>
      <RegisterScreen />
    </AuthLayout>
  );
};

export default RegisterRoute;
