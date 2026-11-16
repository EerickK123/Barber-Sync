import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/global/stores';
import { useTheme } from '@/global/providers/theme';
import { PrefabLoader } from '@/global/components/loader/loader.component';
// import { registerForPushNotificationsAsync } from '@/global/utils';
// import Constants, { ExecutionEnvironment } from 'expo-constants';

const IndexPage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const initializeSession = useAuthStore((state) => state.initializeSession);

  useEffect(() => {
    initializeSession().then((hasValidSession) => {
      router.replace(hasValidSession ? '/(protected)/(tabs)/home' : '/(public)/(auth)/login');
    });
  }, [initializeSession, router]);

  // useEffect(() => {
  //   const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  //   if (!isExpoGo) {   
  //     registerForPushNotificationsAsync().then((token) => {
  //       if (token) {
  //         console.log('¡Token obtenido con éxito!');
  //       }
  //     }).catch((error) => {
  //       console.warn('No se pudo registrar el token de notificaciones:', error);
  //     });
  //   } else {
  //     console.log('⚠️ Las notificaciones push están deshabilitadas en Expo Go (SDK 58). Usa un Development Build para probarlas.');
  //   }
  // }, []);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.background,
      }}>
      <PrefabLoader text="APP.LOADING.LOGIN" />
    </View>
  );
};

export default IndexPage;

/*

app/
│
├── _layout.tsx [X]
├── index.tsx [X]
│
├── (public)/ [X]
│   ├── _layout.tsx [X]
│   │
│   ├── (auth)/ [X]
│   │   ├── _layout.tsx [X]
│   │   ├── login.tsx [X]
│   │   ├── register.tsx [X]
│   │   └── forgot-password.tsx
│   │
│   └── onboarding/ [X]
│       ├── welcome.tsx
│       └── permissions.tsx
│
├── (protected)/
│   ├── _layout.tsx [X]
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx [X]
│   │   ├── home.tsx [X]
│   │   ├── reservations.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   │
│   ├── barbershop/
│   │   ├── [code].tsx
│   │   ├── employees.tsx
│   │   └── services.tsx
│   │
│   ├── reservation/
│   │   ├── create.tsx
│   │   ├── success.tsx
│   │   └── [id].tsx
│   │
│   └── modal/
│       ├── join-barbershop.tsx
│       └── qr-scanner.tsx
│
└── +not-found.tsx

*/
