import { Button } from 'react-native';
import { useAuthStore } from '@/global/stores';
import { GetBarbershopsScreen } from '@/features/getBarbershops';
import { router } from 'expo-router';
import { BaseLayout } from '@/global/layouts/base/base.layout';
import React from 'react';

const Home = () => {
  const { logout } = useAuthStore();

  return (
    <>
      <BaseLayout
      padding='none'
      
      >
        <GetBarbershopsScreen />
        <Button
          title="back"
          onPress={() => {
            router.push('/login');
            setTimeout(() => {
              logout();
            }, 480);
          }}
        />
      </BaseLayout>
    </>
  );
};
export default Home;
