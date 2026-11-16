import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { BarbershopTabsProps } from '@/features/barbershopProfile/types/barbershop_profile.types';

const TABS = ['Información', 'Agenda', 'Servicios', 'Equipo'];

export const BarbershopTabs = ({ activeTab, onTabChange }: BarbershopTabsProps) => {
  const { theme } = useTheme();

  return (
    <View
      className="mt-6"
      style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(index)}
              className="mr-7 pb-3"
              style={{
                borderBottomWidth: 2,
                borderBottomColor: isActive ? theme.accent : 'transparent',
              }}
            >
              <PrefabText
                variant="caption"
                translate={false}
                style={{
                  fontWeight: 'bold',
                  color: isActive ? theme.accent : theme.textSecondary,
                }}
              >
                {tab}
              </PrefabText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};