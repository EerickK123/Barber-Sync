import React from 'react';
import { ScrollView, View } from 'react-native';
import Feather from "@react-native-vector-icons/feather";

import { PrefabEmpty, PrefabButton, PrefabAlert } from '@/global/components';
import { GetBarbershopsBodyProps } from '@/features/getBarbershops/types/get_barbershops.types';
import { BarbershopCard } from '../../../card/barbershop_card.component';
import { useTheme } from '@/global/providers/theme';

export const GetBarbershopsBody = ({
  barbershops,
  error,
  searchQuery,
  onOpenJoinModal,
  onOpenBarbershop,
}: GetBarbershopsBodyProps) => {
  const {theme} = useTheme()
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 8 }}
      >
        {error && (
          <View className="mb-4">
            <PrefabAlert variant="error" message={error} />
          </View>
        )}

        {barbershops.length === 0 && searchQuery ? (
          <PrefabEmpty
            title="Sin resultados"
            description={`No encontramos nada para "${searchQuery}".`}
          />
        ) : null}

        {barbershops.map((barbershop, index) => (
          <BarbershopCard
            key={`${barbershop.barbershop_code}-${index}`}
            onPress={() => onOpenBarbershop(barbershop.barbershop_code)}
            data={barbershop}
          />
        ))}
      </ScrollView>

      <View className="absolute bottom-4 right-6 z-50">
        <PrefabButton
          variant="icon"
          onPress={onOpenJoinModal}
          icon={<Feather name="plus" size={24} color={theme.textPrimary} />}
          style={{backgroundColor: theme.background}}
        />
      </View>
    </View>
  );
};