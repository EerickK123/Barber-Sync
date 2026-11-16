import React from 'react';
import { View, Pressable } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { ServiceInfo } from '@/features/barbershopProfile/types/barbershop_profile.types';
import { formatCurrency, parseDurationToMinutes } from '../../../utils/create_reservation.utils';

interface Step1ServiceProps {
  services: ServiceInfo[];
  selectedService: ServiceInfo | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (service: ServiceInfo) => void;
}

export const Step1Service = ({
  services,
  selectedService,
  isOpen,
  onToggle,
  onSelect,
}: Step1ServiceProps) => {
  const { theme } = useTheme();

  return (
    <View>
      {/* Trigger */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between rounded-2xl border p-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: selectedService ? theme.accent : theme.border,
        }}
      >
        <View className="flex-row items-center flex-1 pr-3" style={{ gap: 12 }}>
          <Feather
            name="scissors"
            size={18}
            color={selectedService ? theme.accent : theme.textSecondary}
          />
          {selectedService ? (
            <View>
              <PrefabText
                variant="body"
                translate={false}
                style={{ fontWeight: '800', color: theme.textPrimary }}
              >
                {selectedService.name}
              </PrefabText>
              <PrefabText variant="caption" translate={false} style={{ marginTop: 2 }}>
                {parseDurationToMinutes(selectedService.duration)} min ·{' '}
                {formatCurrency(selectedService.price)}
              </PrefabText>
            </View>
          ) : (
            <PrefabText variant="body" translate={false} style={{ color: theme.textSecondary }}>
              Selecciona un servicio
            </PrefabText>
          )}
        </View>
        <Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.textSecondary}
        />
      </Pressable>

      {/* Options */}
      {isOpen && (
        <View
          className="mt-2 overflow-hidden rounded-2xl border"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          {services.map((service, index) => {
            const isSelected = selectedService?.id === service.id;
            const isLast = index === services.length - 1;
            return (
              <Pressable
                key={service.id}
                onPress={() => onSelect(service)}
                className="flex-row items-center justify-between p-4"
                style={{
                  backgroundColor: isSelected ? theme.accentMuted : 'transparent',
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ gap: 3 }}>
                  <PrefabText
                    variant="body"
                    translate={false}
                    style={{ fontWeight: '700', color: theme.textPrimary }}
                  >
                    {service.name}
                  </PrefabText>
                  <PrefabText variant="caption" translate={false}>
                    {parseDurationToMinutes(service.duration)} min
                  </PrefabText>
                </View>
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  <PrefabText
                    variant="body"
                    translate={false}
                    style={{ fontWeight: '800', color: theme.accent }}
                  >
                    {formatCurrency(service.price)}
                  </PrefabText>
                  {isSelected && (
                    <Feather name="check-circle" size={16} color={theme.accent} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};