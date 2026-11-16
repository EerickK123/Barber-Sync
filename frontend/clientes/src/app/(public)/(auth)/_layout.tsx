import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>

      <Stack.Screen
        name="login"
        options={{
          animation: 'ios_from_left',
          animationDuration: 300
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          animation: 'ios_from_right',
          animationDuration: 300
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
