import React from 'react';
import { View, Image, Text } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { PrefabSection } from '@/global/components/section/section.component';
import { PrefabText } from '@/global/components/text/text.component';
import { BarbershopInfoSectionProps } from '@/features/barbershopProfile/types/barbershop_profile.types';
import Feather from "@react-native-vector-icons/feather";
export const BarbershopInfoSection = ({ barbershopInfo }: BarbershopInfoSectionProps) => {
  const { theme } = useTheme();

  return (
    <View className="px-5">
      <PrefabSection>
        <View
          className="rounded-3xl border p-5"
          style={{ backgroundColor: theme.background, borderColor: theme.border }}>
          <PrefabText variant="button" translate={true} style={{ color: theme.textPrimary}}>
            {'Información general'}
          </PrefabText>
          <View className="gap-4 pt-2">
            <View className="flex-row items-center gap-3">
              <View
                className="rounded-xl p-2"
                style={{
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}>
                <Feather name="map-pin" size={16} color={theme.error} />
              </View>
              <View className="flex-1">
                <PrefabText variant="caption" translate={true}>
                  {'Dirección'}
                </PrefabText>
                <PrefabText variant="button" translate={true} style={{ color: theme.textPrimary}}>
                  {barbershopInfo.address}
                </PrefabText>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View
                className="rounded-xl p-2"
                style={{
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}>
                <Feather name="phone" size={16} color={theme.success} />
              </View>
              <View className="flex-1">
                <PrefabText variant="caption" translate={true}>
                  {'Teléfono'}
                </PrefabText>
                <PrefabText variant="button" translate={true} style={{ color: theme.textPrimary}}>
                  {barbershopInfo.phone}
                </PrefabText>
              </View>
            </View>
          </View>
        </View>
      </PrefabSection>
      <PrefabSection title="Galería" translate={false}>
        {barbershopInfo.gallery && barbershopInfo.gallery.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            {barbershopInfo.gallery.map((imgUrl, idx) => (
              <View
                key={idx}
                style={{
                  width: '32%',
                  aspectRatio: 3 / 6,
                  marginBottom: 10, // Espacio entre filas
                  borderRadius: 0,
                  overflow: 'hidden', // Asegura que la imagen no se salga del borde redondeado
                  borderWidth: 1,
                  borderColor: theme.textMuted,
                }}>
                <Image
                  source={{ uri: imgUrl }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        ) : (
          <View
            className="items-center rounded-2xl border border-dashed py-10"
            style={{ borderColor: theme.border }}>
            <PrefabText variant="caption" center translate={false}>
              Galería próximamente
            </PrefabText>
          </View>
        )}
      </PrefabSection>
    </View>
  );
};

/*

<View className="px-5 pt-6 gap-4">
      



*/
