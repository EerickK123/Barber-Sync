import { Stack } from 'expo-router';

const PublicLayout = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      contentStyle: { backgroundColor: 'transparent' },
    }}
  />
);

export default PublicLayout;
