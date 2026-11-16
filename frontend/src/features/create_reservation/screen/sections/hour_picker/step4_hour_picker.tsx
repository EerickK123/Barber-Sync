import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { SelectedTime } from '../../../types/create_reservation.types';

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PAD = Math.floor(VISIBLE_ITEMS / 2);

// 14 repeticiones es el balance perfecto: cero lag al renderizar y espacio suficiente
// para que el usuario gire agresivamente sin tocar nunca los bordes.
const REPEAT_COUNT = 14; 

interface HourColumnProps {
  items: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
  label: string;
}

const HourColumn = ({ items, selectedValue, onSelect, label }: HourColumnProps) => {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [localValue, setLocalValue] = useState(selectedValue);
  const itemsLength = items.length;
  const data = useMemo(() => Array(REPEAT_COUNT).fill(items).flat(), [items]);

  useEffect(() => {
    setLocalValue(selectedValue);
    const middleBlockStart = Math.floor(REPEAT_COUNT / 2) * itemsLength;
    const targetIndex = middleBlockStart + items.indexOf(selectedValue);
    const timeoutId = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: targetIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 0)

    return () => clearTimeout(timeoutId);
  }, [items]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    const index = Math.round(offset / ITEM_HEIGHT);
    
    if (index >= 0 && index < data.length) {
      const val = data[index];
      if (val !== localValue) {
        setLocalValue(val);
      }
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    const index = Math.round(offset / ITEM_HEIGHT);
    
    if (index >= 0 && index < data.length) {
      const val = data[index];
      onSelect(val);

      const minIndexThreshold = 2 * itemsLength;
      const maxIndexThreshold = (REPEAT_COUNT - 2) * itemsLength;

      if (index < minIndexThreshold || index > maxIndexThreshold) {
        const middleBlockStart = Math.floor(REPEAT_COUNT / 2) * itemsLength;
        const resetIndex = middleBlockStart + (index % itemsLength);
        scrollRef.current?.scrollTo({ y: resetIndex * ITEM_HEIGHT, animated: false });
      }
    }
  };

  return (
    <View className="flex-1 items-center" style={{ gap: 4 }}>
      <PrefabText variant="caption" translate={false} style={{ marginBottom: 6, fontWeight: '700' }}>
        {label}
      </PrefabText>
      <View style={{ height: PICKER_HEIGHT, overflow: 'hidden', width: '100%' }}>
        
        {/* Cuadro azul central (Selection Overlay) */}
        <View
          pointerEvents="none"
          className="absolute w-full rounded-xl"
          style={{
            top: ITEM_HEIGHT * PAD,
            height: ITEM_HEIGHT,
            backgroundColor: theme.accentMuted,
            borderWidth: 1,
            borderColor: theme.accent,
            zIndex: 1,
          }}
        />
        
        <ScrollView
          ref={scrollRef}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16} // Permite atrapar eventos cada ~16ms (60 fps)
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={(e) => {
            // Asegura que si el usuario frena el dedo en seco sin soltar, también se registre
            const velocity = e.nativeEvent.velocity?.y ?? 0;
            if (Math.abs(velocity) < 0.1) {
              handleScrollEnd(e);
            }
          }}
          contentContainerStyle={{ paddingTop: ITEM_HEIGHT * PAD, paddingBottom: ITEM_HEIGHT * PAD }}
        >
          {data.map((item, index) => {
            // Evaluamos contra el estado LOCAL para que responda instantáneamente
            const isSelected = item === localValue; 
            return (
              <Pressable
                key={`${index}-${item}`}
                style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setLocalValue(item);
                  scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
                  onSelect(item);
                }}
              >
                <PrefabText
                  variant="body"
                  translate={false}
                  style={{
                    fontWeight: isSelected ? '900' : '400',
                    fontSize: isSelected ? 22 : 16,
                    color: isSelected ? theme.accent : theme.textSecondary,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {String(item).padStart(2, '0')}
                </PrefabText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

// ── Picker Component Orquestador ──────────────────────────────────────────────

interface Step4HourPickerProps {
  selectedTime: SelectedTime;
  onSelect: (time: SelectedTime) => void;
  openTime: string; // Ej: "09:30"
  closeTime: string; // Ej: "18:30"
}

export const Step4HourPicker = ({ selectedTime, onSelect, openTime, closeTime }: Step4HourPickerProps) => {
  const { theme } = useTheme();

  // 1. Filtrado de horas reactivo y protegido (Evitamos re-cálculos si no cambia el día)
  const availableHours = useMemo(() => {
    if (!openTime || !closeTime) return Array.from({ length: 24 }, (_, i) => i);
    
    const startHour = parseInt(openTime.split(':')[0], 10);
    const endHour = parseInt(closeTime.split(':')[0], 10);
    return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  }, [openTime, closeTime]);

  // 2. Minutos múltiplos de 5 fijos y cacheados
  const availableMinutes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i * 5);
  }, []);

  const handleHourChange = (hour: number) => onSelect({ ...selectedTime, hour });
  const handleMinuteChange = (minute: number) => onSelect({ ...selectedTime, minute });

  return (
    <View style={{ gap: 16 }}>
      <View className="overflow-hidden rounded-3xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <View className="flex-row items-center justify-between px-5 py-3 border-b" style={{ borderColor: theme.border }}>
          <PrefabText variant="caption" translate={false} style={{ fontWeight: '700' }}>
            Selecciona el horario ({openTime} - {closeTime})
          </PrefabText>
        </View>
        <View className="flex-row px-4 py-3" style={{ gap: 8 }}>
          <HourColumn 
            items={availableHours} 
            selectedValue={selectedTime.hour} 
            onSelect={handleHourChange} 
            label="Hora" 
          />
          <View className="justify-center pb-6">
            <PrefabText variant="body" translate={false} style={{ fontWeight: '900', fontSize: 22, color: theme.textMuted }}>
              :
            </PrefabText>
          </View>
          <HourColumn 
            items={availableMinutes} 
            selectedValue={selectedTime.minute} 
            onSelect={handleMinuteChange} 
            label="Minutos" 
          />
        </View>
      </View>
    </View>
  );
};