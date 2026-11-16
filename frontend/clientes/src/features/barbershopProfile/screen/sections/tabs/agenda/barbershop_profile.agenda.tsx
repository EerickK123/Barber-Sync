import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import {
  BarbershopAgendaProps,
  CalendarDay,
  Reservation,
} from '@/features/barbershopProfile/types/barbershop_profile.types';
import {
  formatCurrency,
  formatDuration,
  generateTimelineHours,
  mergeReservations,
  MergedBusyBlock,
  MineBlock,
} from '@/features/barbershopProfile/utils/barbershop_profile.utils';
import { ReservationDetailModal } from '@/features/barbershopProfile/components/reservation_detail_modal/reservation_detail_modal.component';

const PIXELS_PER_SLOT = 6;
const HOUR_HEIGHT = 12 * PIXELS_PER_SLOT; // 72px por hora
const MIN_HEIGHT_FOR_TEXT = 30;

export const BarbershopAgenda = ({
  calendar,
  selectedDate,
  selectedDay,
  onSelectDate,
}: BarbershopAgendaProps) => {
  const { theme } = useTheme();
  const [agendaView, setAgendaView] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const markedDates = useMemo(() => {
    const result: Record<string, object> = {};
    calendar.forEach((day: CalendarDay) => {
      const isDisabled = day.is_past || !day.working_day;
      const isSelected = day.date === selectedDate;
      result[day.date] = {
        disabled: isDisabled,
        disableTouchEvent: isDisabled,
        ...(isSelected ? { selected: true, selectedColor: theme.accent } : {}),
        ...(day.working_day && !day.is_past && !isSelected
          ? { marked: true, dotColor: theme.accent }
          : {}),
      };
    });
    return result;
  }, [calendar, selectedDate, theme.accent]);

  const timelineHours = useMemo(() => {
    if (!selectedDay?.open || !selectedDay?.close) return [];
    return generateTimelineHours(selectedDay.open, selectedDay.close);
  }, [selectedDay]);

  const { mergedBusy, mineReservations } = useMemo(
    () => mergeReservations(selectedDay?.reservations ?? []),
    [selectedDay?.reservations],
  );

  return (
    <View className="px-5">
      {/* Toggle de vistas */}
      <View
        className="mb-6 flex-row rounded-2xl border p-1"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <Pressable
          className="flex-1 items-center rounded-xl py-2"
          style={{ backgroundColor: agendaView === 'calendar' ? theme.accent : 'transparent' }}
          onPress={() => setAgendaView('calendar')}
        >
          <PrefabText
            variant="caption"
            translate={false}
            style={{
              fontWeight: 'bold',
              color: agendaView === 'calendar' ? theme.accentText : theme.textPrimary,
            }}
          >
            Mensual
          </PrefabText>
        </Pressable>

        <Pressable
          className="flex-1 items-center rounded-xl py-2"
          style={{ backgroundColor: agendaView === 'timeline' ? theme.accent : 'transparent' }}
          onPress={() => setAgendaView('timeline')}
        >
          <PrefabText
            variant="caption"
            translate={false}
            style={{
              fontWeight: 'bold',
              color: agendaView === 'timeline' ? theme.accentText : theme.textPrimary,
            }}
          >
            Horario
          </PrefabText>
        </Pressable>
      </View>

      {/* Vista Mensual */}
      {agendaView === 'calendar' && (
        <View
          className="mb-6 overflow-hidden rounded-3xl border"
          style={{ borderColor: theme.border }}
        >
          <Calendar
            current={selectedDate ?? calendar[0]?.date}
            minDate={calendar[0]?.date}
            maxDate={calendar[calendar.length - 1]?.date}
            markedDates={markedDates}
            onDayPress={(day: DateData) => {
              onSelectDate(day.dateString);
              setAgendaView('timeline');
            }}
            hideExtraDays
            disableAllTouchEventsForDisabledDays
            theme={{
              backgroundColor: theme.surface,
              calendarBackground: theme.surface,
              selectedDayBackgroundColor: theme.accent,
              selectedDayTextColor: theme.accentText,
              todayTextColor: theme.accent,
              dayTextColor: theme.textPrimary,
              textDisabledColor: theme.border,
              dotColor: theme.accent,
              monthTextColor: theme.textPrimary,
              arrowColor: theme.accent,
              textMonthFontWeight: '900',
            }}
          />
        </View>
      )}

      {/* Vista Horario (Timeline) */}
      {agendaView === 'timeline' &&
        (selectedDay && selectedDay.working_day ? (
          <View
            className="mb-6 overflow-hidden rounded-3xl border"
            style={{ borderColor: theme.border, backgroundColor: theme.surface }}
          >
            {/* Header del día */}
            <View
              className="flex-row items-center justify-between border-b p-4"
              style={{ borderColor: theme.border }}
            >
              <View>
                <PrefabText variant="subtitle" translate={false} className="capitalize">
                  {selectedDay.day_name} {selectedDay.date}
                </PrefabText>
                <PrefabText variant="caption" translate={false} style={{ marginTop: 2 }}>
                  Agenda del día
                </PrefabText>
              </View>
              <PrefabText variant="caption" translate={false} className="font-mono">
                {selectedDay.open} - {selectedDay.close}
              </PrefabText>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
              <View
                className="relative w-full"
                style={{ height: (timelineHours.length - 1) * HOUR_HEIGHT + 40, marginTop: 15 }}
              >
                {/* Grid de horas */}
                {timelineHours.map((hour, index) => (
                  <View
                    key={hour}
                    className="absolute w-full flex-row px-4"
                    style={{ top: index * HOUR_HEIGHT }}
                  >
                    <PrefabText
                      variant="caption"
                      translate={false}
                      style={{ width: 45, marginTop: -8 }}
                    >
                      {hour}
                    </PrefabText>
                    <View
                      className="flex-1 border-b"
                      style={{ borderColor: theme.border, opacity: 0.5 }}
                    />
                  </View>
                ))}

                {/* Bloques ocupados (merged, no son míos) */}
                {mergedBusy.map((block: MergedBusyBlock, index: number) => {
                  const blockHeight = block.occupied_slots * PIXELS_PER_SLOT;
                  return (
                    <View
                      key={`busy-${index}`}
                      className="absolute justify-center overflow-hidden rounded-xl px-3"
                      style={{
                        top: block.start_slot * PIXELS_PER_SLOT,
                        height: blockHeight,
                        left: 70,
                        right: 16,
                        backgroundColor: theme.border,
                        opacity: 0.4,
                      }}
                    >
                      {blockHeight >= MIN_HEIGHT_FOR_TEXT && (
                        <PrefabText
                          variant="caption"
                          translate={false}
                          style={{ color: theme.textPrimary, fontWeight: 'bold' }}
                          numberOfLines={1}
                        >
                          Ocupado
                        </PrefabText>
                      )}
                    </View>
                  );
                })}

                {/* Bloques míos (presionables) */}
                {mineReservations.map((res: MineBlock, index: number) => {
                  const blockHeight = res.occupied_slots * PIXELS_PER_SLOT;
                  const showText = blockHeight >= MIN_HEIGHT_FOR_TEXT;
                  return (
                    <Pressable
                      key={`mine-${index}`}
                      className="absolute justify-center overflow-hidden rounded-xl px-3"
                      style={{
                        top: res.start_slot * PIXELS_PER_SLOT,
                        height: blockHeight,
                        left: 70,
                        right: 16,
                        backgroundColor: theme.accent,
                        paddingVertical: showText ? 8 : 0,
                      }}
                      onPress={() => setSelectedReservation(res)}
                    >
                      {showText && (
                        <>
                          <PrefabText
                            variant="caption"
                            translate={false}
                            style={{ color: theme.accentText, fontWeight: 'bold' }}
                            numberOfLines={1}
                          >
                            {res.service_info.name}
                          </PrefabText>
                          {blockHeight > 40 && (
                            <PrefabText
                              variant="caption"
                              translate={false}
                              style={{ fontSize: 10, color: theme.accentText, opacity: 0.9 }}
                            >
                              {formatDuration(res.service_info.duration)} ·{' '}
                              {formatCurrency(res.service_info.price)}
                            </PrefabText>
                          )}
                        </>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : selectedDay ? (
          <View
            className="mt-4 rounded-2xl border border-dashed p-4"
            style={{
              borderColor: theme.error,
              backgroundColor: 'rgba(239,68,68,0.08)',
            }}
          >
            <PrefabText center translate={false} style={{ color: theme.error }}>
              Este día la barbería está cerrada.
            </PrefabText>
          </View>
        ) : null)}

      {/* Modal de detalle de reservación propia */}
      <ReservationDetailModal
        reservation={selectedReservation}
        visible={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </View>
  );
};