import React from 'react';
import { View, Pressable, Image } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { Employee } from '@/features/barbershopProfile/types/barbershop_profile.types';

interface Step2EmployeeProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (employee: Employee) => void;
}

export const Step2Employee = ({
  employees,
  selectedEmployee,
  isOpen,
  onToggle,
  onSelect,
}: Step2EmployeeProps) => {
  const { theme } = useTheme();

  return (
    <View>
      {/* Trigger */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between rounded-2xl border p-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: selectedEmployee ? theme.accent : theme.border,
        }}
      >
        <View className="flex-row items-center flex-1 pr-3" style={{ gap: 12 }}>
          <Feather
            name="user"
            size={18}
            color={selectedEmployee ? theme.accent : theme.textSecondary}
          />
          {selectedEmployee ? (
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Image
                source={{ uri: selectedEmployee.avatar }}
                style={{ width: 28, height: 28, borderRadius: 14 }}
              />
              <PrefabText
                variant="body"
                translate={false}
                style={{ fontWeight: '800', color: theme.textPrimary }}
              >
                {selectedEmployee.name} {selectedEmployee.lastName}
              </PrefabText>
            </View>
          ) : (
            <PrefabText variant="body" translate={false} style={{ color: theme.textSecondary }}>
              Selecciona un barbero
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
          {employees.length === 0 ? (
            <View className="p-5 items-center">
              <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
                No hay barberos disponibles para este servicio.
              </PrefabText>
            </View>
          ) : (
            employees.map((emp, index) => {
              const isSelected = selectedEmployee?.uuid === emp.uuid;
              const isLast = index === employees.length - 1;
              return (
                <Pressable
                  key={emp.uuid}
                  onPress={() => onSelect(emp)}
                  className="flex-row items-center p-4"
                  style={{
                    backgroundColor: isSelected ? theme.accentMuted : 'transparent',
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: theme.border,
                    gap: 14,
                  }}
                >
                  <Image
                    source={{ uri: emp.avatar }}
                    style={{ width: 42, height: 42, borderRadius: 21 }}
                  />
                  <View className="flex-1" style={{ gap: 3 }}>
                    <PrefabText
                      variant="body"
                      translate={false}
                      style={{ fontWeight: '700', color: theme.textPrimary }}
                    >
                      {emp.name} {emp.lastName}
                    </PrefabText>
                    <PrefabText variant="caption" translate={false}>
                      {emp.skills.length} especialidad{emp.skills.length !== 1 ? 'es' : ''}
                    </PrefabText>
                  </View>
                  {isSelected && (
                    <Feather name="check-circle" size={18} color={theme.accent} />
                  )}
                </Pressable>
              );
            })
          )}
        </View>
      )}
    </View>
  );
};