import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { ReservationDetailModalProps } from '@/features/barbershopProfile/types/barbershop_profile.types';
import {
  formatCurrency,
  formatDuration,
} from '@/features/barbershopProfile/utils/barbershop_profile.utils';

export const ReservationDetailModal = ({
  reservation,
  visible,
  onClose,
}: ReservationDetailModalProps) => {
  const { theme } = useTheme();

  if (!reservation || !reservation.service_info) return null;

  const { service_info, start_slot, occupied_slots, status } = reservation;
  const durationMin = occupied_slots * 5;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 pt-6 pb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
        >
          <PrefabText variant="title" translate={false}>
            Mi reservación
          </PrefabText>
          <Pressable
            onPress={onClose}
            className="rounded-full p-1.5"
            style={{ backgroundColor: theme.surface }}
          >
            <Feather name="x" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        <View className="px-6 pt-6" style={{ gap: 12 }}>
          {/* Badge de estado */}
          <View
            className="self-start rounded-xl px-4 py-2"
            style={{ backgroundColor: theme.accentMuted }}
          >
            <PrefabText
              variant="caption"
              translate={false}
              style={{ color: theme.accent, fontWeight: '800', textTransform: 'uppercase' }}
            >
              {status.replace(/_/g, ' ')}
            </PrefabText>
          </View>

          {/* Servicio */}
          <View
            className="rounded-3xl border p-5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <PrefabText variant="caption" translate={false}>
              Servicio
            </PrefabText>
            <PrefabText
              variant="subtitle"
              translate={false}
              style={{ marginTop: 4 }}
            >
              {service_info.name}
            </PrefabText>

            <View
              className="flex-row justify-between mt-4 rounded-2xl p-4"
              style={{ backgroundColor: theme.background }}
            >
              <View className="items-center">
                <PrefabText variant="caption" translate={false}>
                  Duración
                </PrefabText>
                <PrefabText
                  variant="body"
                  translate={false}
                  style={{ fontWeight: '800', marginTop: 4 }}
                >
                  {formatDuration(service_info.duration)}
                </PrefabText>
              </View>

              <View
                style={{ width: 1, backgroundColor: theme.border }}
              />

              <View className="items-center">
                <PrefabText variant="caption" translate={false}>
                  Precio
                </PrefabText>
                <PrefabText
                  variant="body"
                  translate={false}
                  style={{ fontWeight: '800', color: theme.accent, marginTop: 4 }}
                >
                  {formatCurrency(service_info.price)}
                </PrefabText>
              </View>

              <View
                style={{ width: 1, backgroundColor: theme.border }}
              />

              <View className="items-center">
                <PrefabText variant="caption" translate={false}>
                  Slot inicio
                </PrefabText>
                <PrefabText
                  variant="body"
                  translate={false}
                  style={{ fontWeight: '800', marginTop: 4 }}
                >
                  #{start_slot}
                </PrefabText>
              </View>
            </View>
          </View>

          {/* Info extra */}
          <View
            className="rounded-3xl border p-5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Feather name="clock" size={16} color={theme.textSecondary} />
              <PrefabText variant="body" translate={false} style={{ color: theme.textSecondary }}>
                Duración total: {durationMin} minutos ({occupied_slots} slots)
              </PrefabText>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};