import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { BarbershopServicesProps } from '@/features/barbershopProfile/types/barbershop_profile.types';
import {
  formatCurrency,
  formatDuration,
} from '@/features/barbershopProfile/utils/barbershop_profile.utils';

export const BarbershopServices = ({ services }: BarbershopServicesProps) => {
  const { theme } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      {services.map((service) => (
        <View
          key={service.id}
          className="rounded-3xl border p-5"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <PrefabText variant="body" translate={false} style={{ fontWeight: '800' }}>
                {service.name}
              </PrefabText>
              <PrefabText variant="caption" translate={false} style={{ marginTop: 4 }}>
                {formatDuration(service.duration)}
              </PrefabText>
            </View>
            <PrefabText
              variant="body"
              translate={false}
              style={{ fontWeight: '800', color: theme.accent }}
            >
              {formatCurrency(service.price)}
            </PrefabText>
          </View>
        </View>
      ))}
    </View>
  );
};