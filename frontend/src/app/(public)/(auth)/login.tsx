import React from "react";
import { LoginScreen } from "@/features/auth/login/screen/login.screen";
import { AuthLayout } from "@/global/layouts/auth/auth.layout";

const LoginRoute = () => {
  return (
    <AuthLayout>
      <LoginScreen />
    </AuthLayout>
  );
};

export default LoginRoute;
