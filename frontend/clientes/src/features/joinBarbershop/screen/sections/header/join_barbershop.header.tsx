import React from 'react';

import { View } from 'react-native';

import { PrefabHeader } from '@/global/components';

export const JoinBarbershopHeader = () => {
  return (
    <View className="px-6 pt-14">
      <PrefabHeader
        title="app.barbershop.join.title"
        subtitle="app.barbershop.join.subtitle"
      />
    </View>
  );
};