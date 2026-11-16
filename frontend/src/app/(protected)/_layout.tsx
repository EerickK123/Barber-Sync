import { Stack, Redirect } from 'expo-router';

import { useAuthStore } from '@/global/stores';
import { jwtDecode } from 'jwt-decode';

const ProtectedLayout = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Redirect href="/(public)/(auth)/login" />;
  }
  const isExpired = jwtDecode(accessToken).exp! * 1000 < Date.now();

  if (isExpired) {
    return <Redirect href="/(public)/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#0A0A0A',
        },
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: 'fade',
        }}
      />

      <Stack.Screen
        name="barbershop_profile"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="create_reservation"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="reservation"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
