import React from 'react';
import { View, Modal, ScrollView, Pressable, Text } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { PrefabAvatar } from '@/global/components/avatar/avatar.component';
import { EmployeeModalProps } from '@/features/barbershopProfile/types/barbershop_profile.types';
import {
  formatCurrency,
  formatDuration,
} from '@/features/barbershopProfile/utils/barbershop_profile.utils';

export const EmployeeModal = ({ employee, visible, onClose }: EmployeeModalProps) => {
  const { theme } = useTheme();

  if (!employee) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 pt-6 pb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <PrefabText variant="title" translate={false}>
            Perfil del barbero
          </PrefabText>
          <Pressable
            onPress={onClose}
            className="rounded-full p-1.5"
            style={{ backgroundColor: theme.surface }}>
            <Feather name="x" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          {/* Avatar */}
          <View className="mt-6 mb-6 items-center">
            <View
              style={{
                borderRadius: 50,
                borderWidth: 3,
                borderColor: theme.accent,
                overflow: 'hidden',
              }}>
              <PrefabAvatar uri={employee.avatar} size="lg" />
            </View>
            <PrefabText variant="title" translate={false} style={{ marginTop: 16 }}>
              {employee.name} {employee.lastName}
            </PrefabText>

            <PrefabText variant="caption" translate={false} style={{ marginTop: 4 }}>
              {employee.skills.length} especialidad{employee.skills.length !== 1 ? 'es' : ''}
            </PrefabText>
          </View>

          {/* Skills */}
          <PrefabText variant="subtitle" translate={false} style={{ marginBottom: 12 }}>
            Especialidades
          </PrefabText>

          <View style={{ gap: 10 }}>
            {employee.skills.map((skill) => (
              <View
                key={skill.skill_id}
                className="rounded-2xl border p-4"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <PrefabText variant="body" translate={false} style={{ fontWeight: '800' }}>
                      {skill.skill_name}
                    </PrefabText>
                    <PrefabText variant="caption" translate={false} style={{ marginTop: 2 }}>
                      {formatDuration(skill.duration)}
                    </PrefabText>
                  </View>
                  <PrefabText
                    variant="body"
                    translate={false}
                    style={{ fontWeight: '800', color: theme.accent }}>
                    {formatCurrency(skill.price)}
                  </PrefabText>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
