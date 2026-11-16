import React from 'react';

import { View } from 'react-native';

import { PrefabHeader, PrefabInput } from '@/global/components';

import { GetBarbershopsHeaderProps } from '@/features/getBarbershops/types/get_barbershops.types';

export const GetBarbershopsHeader = ({
  searchQuery,
  onSearchChange,
}: GetBarbershopsHeaderProps) => {
  return (
    <View className="px-6 pt-14 pb-4">
      <PrefabHeader title="barbershops.title" subtitle="barbershops.subtitle" />
      <PrefabInput label="barbershops.search" value={searchQuery} onChangeText={onSearchChange} />
    </View>
  );
};
