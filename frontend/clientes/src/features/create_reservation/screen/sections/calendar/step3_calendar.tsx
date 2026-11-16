import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme } from '@/global/providers/theme';
import { CalendarDay } from '@/features/barbershopProfile/types/barbershop_profile.types';

interface Step3CalendarProps {
  calendar: CalendarDay[];
  selectedDay: CalendarDay | null;
  onSelect: (day: CalendarDay) => void;
}

export const Step3Calendar = ({ calendar, selectedDay, onSelect }: Step3CalendarProps) => {
  const { theme } = useTheme();

  const markedDates = useMemo(() => {
    const result: Record<string, object> = {};
    calendar.forEach((day) => {
      const isDisabled = day.is_past || !day.working_day;
      const isSelected = day.date === selectedDay?.date;
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
  }, [calendar, selectedDay, theme.accent]);

  return (
    <View className="overflow-hidden rounded-3xl border" style={{ borderColor: theme.border, zIndex: 10 }}>
      <Calendar
        current={selectedDay?.date ?? calendar[0]?.date}
        minDate={calendar[0]?.date}
        maxDate={calendar[calendar.length - 1]?.date}
        markedDates={markedDates}
        onDayPress={(day: DateData) => {
          const target = calendar.find((d) => d.date === day.dateString);
          if (target && !target.is_past && target.working_day) {
            onSelect(target);
          }
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
  );
};