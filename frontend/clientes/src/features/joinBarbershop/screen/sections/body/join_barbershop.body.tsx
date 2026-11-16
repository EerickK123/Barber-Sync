import React from 'react';

import { Pressable, View } from 'react-native';

import Feather from "@react-native-vector-icons/feather";

import { useTheme } from '@/global/providers/theme';

import {
  PrefabAlert,
  PrefabButton,
  PrefabCard,
  PrefabInput,
  PrefabSeparator,
  PrefabText,
} from '@/global/components';

import { JoinBarbershopBodyProps } from '@/features/joinBarbershop/types/join_barbershop.types';

export const JoinBarbershopBody = ({
  showDescription,
  descriptionText,
  code,
  onChangeCode,
  onSubmit,
  isPending,
  error,
  onClearError,
  onOpenScanner,
}: JoinBarbershopBodyProps) => {
  const { theme } = useTheme();

  return (
    <View className="flex-1 px-6 pt-4">
      {showDescription && (
        <PrefabCard variant="ghost">
          <PrefabText>
            {descriptionText}
          </PrefabText>
        </PrefabCard>
      )}

      <Pressable
        onPress={onOpenScanner}
        disabled={isPending}>
        <PrefabCard variant="outline">
          <View className="items-center py-6">
            <Feather
              name="maximize"
              size={42}
              color={theme.accent}
            />

            <View className="mt-3">
              <PrefabText>
                Escanear código QR
              </PrefabText>
            </View>
          </View>
        </PrefabCard>
      </Pressable>

      <PrefabSeparator />

      <PrefabInput
        label="Código de la barbería"
        placeholder="ABC-123"
        value={code}
        onChangeText={onChangeCode}
        autoCapitalize="characters"
        maxLength={7}
        disabled={isPending}
      />

      <PrefabAlert
        variant="error"
        message={error ?? undefined}
        onClear={onClearError}
      />

      <View className="mt-4">
        <PrefabButton
          title="Unirme"
          variant="primary"
          isLoading={isPending}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};