
import { View } from "react-native";
import Feather from "@react-native-vector-icons/feather";
import { LoginForm } from "../components/form/login_form.component";

import { useLogin } from "../hook/login.hook";
import { LoginPayload } from "../types/login.types";
import { PrefabButton } from "../../../../global/components";
import { useTheme } from "../../../../global/providers/theme";

const LoginScreen = () => {
  const { mutate, error, isPending, reset } = useLogin();
  const { toggleTheme, mode, theme } = useTheme();

  const handleSubmit = (payload: LoginPayload) => {
    mutate(payload);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <LoginForm
        onSubmit={handleSubmit}
        isPending={isPending}
        errorMessage={error?.message}
        onClearError={reset}
      />
      <PrefabButton
        onPress={toggleTheme}
        variant="icon"
        icon={
          <Feather
            name={mode === "dark" ? "sun" : "moon"}
            color={theme.accent}
          />
        }
      />
    </View>
  );
};


export default LoginScreen;