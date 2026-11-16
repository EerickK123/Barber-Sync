import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { PrefabAvatar } from '@/global/components/avatar/avatar.component';
import { BarbershopTeamProps } from '@/features/barbershopProfile/types/barbershop_profile.types';

export const BarbershopTeam = ({ employees, onSelectEmployee }: BarbershopTeamProps) => {
  const { theme } = useTheme();

  return (
    <View className="px-5" style={{ gap: 12 }}>
      {employees.map((employee) => (
        <Pressable
          key={employee.uuid}
          onPress={() => onSelectEmployee(employee)}
          className="flex-row items-center gap-4 rounded-3xl border p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <PrefabAvatar uri={employee.avatar} size="md" />
          <View className="flex-1">
            <PrefabText variant="subtitle" translate={false}>
              {employee.name} {employee.lastName}
            </PrefabText>
            <PrefabText variant="caption" translate={false} style={{ marginTop: 4 }}>
              {employee.skills.length} especialidad
              {employee.skills.length !== 1 ? 'es' : ''}
            </PrefabText>
          </View>
        </Pressable>
      ))}
    </View>
  );
};