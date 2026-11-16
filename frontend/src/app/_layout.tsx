import { Stack } from 'expo-router';
import '@/global/locale/i18n';
import '@/global/api/interceptor/api.private.interceptor';
import { QueryProvider } from '@/global/providers/query';
import { ThemeProvider, useTheme } from '@/global/providers/theme';
import { RestoreProvider } from '@/global/providers/session/restore';
require('../../global.css');

const RootLayout = () => {

  return (
    <QueryProvider>
      <ThemeProvider>
        <RestoreProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_left',
              animationDuration: 3000,
            }}
          />
        </RestoreProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default RootLayout;


