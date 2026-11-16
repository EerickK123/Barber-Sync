import React from 'react';
import { Pressable } from 'react-native';
import { PrefabCard } from '@/global/components';
import { BarbershopCardProps } from './types/barbershop_card.types';


export const BarbershopCard = ({ data, onPress }: BarbershopCardProps) => {
  return (
    <Pressable onPress={onPress} className="mb-5">
      <PrefabCard
        variant="barbershop"
        title={data.barbershop_name}
        subtitle={data.barbershop_code}
        coverUrl={data.barbershop_cover_url}
        avatarUrl={data.barbershop_profile_url}
      />
    </Pressable>
  );
};
