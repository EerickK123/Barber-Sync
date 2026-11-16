import { PrefabLoader } from '@/global/components';
import { router } from 'expo-router';

import React, { useState, useMemo } from 'react';
import { GetBarbershopsBody } from '../components/feed/sections/body/feed.body';
import { GetBarbershopsHeader } from '../components/feed/sections/header/feed.header';
import { JoinBarbershopModal } from '../components/modal/get_barbershops.modal';
import { useGetBarbershops } from '../hook/get_barbershops.hook';
import { JoinBarbershopScreen } from '../../joinBarbershop';


export const GetBarbershopsScreen = () => {
  const { data, isLoading, error } = useGetBarbershops();

  const [searchQuery, setSearchQuery] = useState('');

  const [isJoinVisible, setIsJoinVisible] = useState(false);

  const barbershops = data?.barbershops ?? [];

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) {
      return barbershops;
    }

    const query = searchQuery.toLowerCase();

    return barbershops.filter(
      (barbershop) =>
        barbershop.barbershop_name.toLowerCase().includes(query) ||
        barbershop.barbershop_code.toLowerCase().includes(query)
    );
  }, [barbershops, searchQuery]);

  if (isLoading) {
    return <PrefabLoader text="app.loading" />;
  }

  if (barbershops.length === 0) {
    return <JoinBarbershopScreen />;
  }

  return (
    <>
      <GetBarbershopsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <GetBarbershopsBody
        barbershops={filtered}
        error={error?.message}
        searchQuery={searchQuery}
        onOpenJoinModal={() => setIsJoinVisible(true)}
        onOpenBarbershop={(code) =>
          router.push({
            pathname: '/(protected)/barbershop_profile',
            params: {
              code,
            },
          })
        }
      />
      <JoinBarbershopModal visible={isJoinVisible} onClose={() => setIsJoinVisible(false)} />
    </>
  );
};
