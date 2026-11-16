import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import Feather from "@react-native-vector-icons/feather";

import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { PrefabButton } from '@/global/components/button/button.component';
import { PrefabAlert } from '@/global/components/alert/alert.component';
import { useBarbershopProfileStore } from '@/global/stores/barbershop/barbershop.store';

import {
  ServiceInfo,
  Employee,
  CalendarDay,
} from '@/features/barbershopProfile/types/barbershop_profile.types';
import { SelectedTime } from '../types/create_reservation.types';
import { validateReservationTime } from '../utils/create_reservation.utils';
import { useCreateReservation } from '../hook/create_reservation.hook';

import { Step1Service } from './sections/services/step1_service';
import { Step2Employee } from './sections/employee/step2_employee';
import { Step3Calendar } from './sections/calendar/step3_calendar';
import { Step4HourPicker } from './sections/hour_picker/step4_hour_picker';

const StepLabel = ({ step, total, label }: { step: number; total: number; label: string }) => {
  const { theme } = useTheme();
  return (
    <View className="mb-3 flex-row items-center" style={{ gap: 8, zIndex: -1 }}>
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 22, height: 22, backgroundColor: theme.accent }}>
        <PrefabText
          variant="caption"
          translate={false}
          style={{ color: theme.accentText, fontWeight: '900', fontSize: 10 }}>
          {step}
        </PrefabText>
      </View>
      <PrefabText
        variant="caption"
        translate={false}
        style={{ fontWeight: '700', color: theme.textSecondary }}>
        {label}
      </PrefabText>
      <PrefabText variant="caption" translate={false} style={{ color: theme.textMuted }}>
        · Paso {step} de {total}
      </PrefabText>
    </View>
  );
};

export const CreateReservationScreen = () => {
  const { theme } = useTheme();

  const barbershopInfo = useBarbershopProfileStore((s) => s.barbershopInfo);
  const services = useBarbershopProfileStore((s) => s.services);
  const employees = useBarbershopProfileStore((s) => s.employees);
  const calendar = useBarbershopProfileStore((s) => s.calendar);

  const { mutateAsync: createReservation, isPending } = useCreateReservation();
  console.log(createReservation.name);
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectedTime>({ hour: 9, minute: 0 });

  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableEmployees = useMemo(() => {
    if (!selectedService) return [];
    return employees.filter((emp) => emp.skills.some((s) => s.skill_id === selectedService.id));
  }, [selectedService, employees]);

  const handleServiceSelect = (service: ServiceInfo) => {
    setSelectedService(service);
    setSelectedEmployee(null);
    setSelectedDay(null);
    setStep1Open(false);
    setStep2Open(true);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedDay(null);
    setStep2Open(false);
  };

  const handleDaySelect = (day: CalendarDay) => {
    setSelectedDay(day);
    if (day.open) {
      const [h, m] = day.open.split(':').map(Number);
      setSelectedTime({ hour: h, minute: m });
    }
  };

  const handleSubmit = async () => {
    if (!barbershopInfo || !selectedService || !selectedEmployee || !selectedDay) return;
    setErrorMsg(null);

    const validation = validateReservationTime(
      selectedDay,
      selectedEmployee.uuid,
      selectedService.duration,
      selectedTime.hour,
      selectedTime.minute
    );

    if (!validation.isValid) {
      setErrorMsg(validation.errorMsg ?? 'El horario no es válido.');
      return;
    }

    try {
      const formattedHour = String(selectedTime.hour).padStart(2, '0');
      const formattedMinute = String(selectedTime.minute).padStart(2, '0');
      const datetimePayload = `${selectedDay.date} ${formattedHour}:${formattedMinute}`;

      await createReservation({
        reservation_info: {
          reservation_barbershop: barbershopInfo.id,
          reservation_service: selectedService.id,
          reservation_employee: selectedEmployee.uuid,
          reservation_datetime: datetimePayload,
        },
      });
      router.back();
    } catch (err: any) {
      setErrorMsg(err.message ?? 'No se pudo crear la reserva en el servidor.');
    }
  };

  if (!barbershopInfo) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: theme.background }}>
        <PrefabText variant="body" translate={false} style={{ color: theme.textSecondary }}>
          No hay información de la barbería.
        </PrefabText>
      </View>
    );
  }

  const canSubmit = !!selectedService && !!selectedEmployee && !!selectedDay;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View
        className="flex-row items-center px-5 pt-12 pb-4"
        style={{ borderBottomWidth: 1, borderBottomColor: theme.border, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          className="mr-4 rounded-full p-1"
          style={{ backgroundColor: theme.surface }}>
          <Feather name="arrow-left" size={22} color={theme.textPrimary} />
        </Pressable>
        <View>
          <PrefabText variant="title" translate={false}>
            Nueva Reserva
          </PrefabText>
          <PrefabText variant="caption" translate={false} style={{ marginTop: 2 }}>
            {barbershopInfo.name}
          </PrefabText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20, paddingTop: 24 }}
        keyboardShouldPersistTaps="handled">
        <AvailabilityErrorModal
          visible={!!errorMsg}
          message={errorMsg || ''}
          onClose={() => setErrorMsg(null)}
        />

        <View className="mb-6" style={{ zIndex: 50 }}>
          <StepLabel step={1} total={4} label="Servicio" />
          <Step1Service
            services={services}
            selectedService={selectedService}
            isOpen={step1Open}
            onToggle={() => setStep1Open((p) => !p)}
            onSelect={handleServiceSelect}
          />
        </View>

        {selectedService && (
          <View className="mb-6" style={{ zIndex: 40 }}>
            <StepLabel step={2} total={4} label="Barbero" />
            <Step2Employee
              employees={availableEmployees}
              selectedEmployee={selectedEmployee}
              isOpen={step2Open}
              onToggle={() => setStep2Open((p) => !p)}
              onSelect={handleEmployeeSelect}
            />
          </View>
        )}

        {selectedEmployee && (
          <View className="mb-6" style={{ zIndex: 30 }}>
            <StepLabel step={3} total={4} label="Fecha" />
            <Step3Calendar
              calendar={calendar}
              selectedDay={selectedDay}
              onSelect={handleDaySelect}
            />
          </View>
        )}

        {selectedDay && selectedService && selectedDay.open && selectedDay.close && (
          <View className="mb-6" style={{ zIndex: 20 }}>
            <StepLabel step={4} total={4} label="Hora Exacta" />
            <Step4HourPicker
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
              openTime={selectedDay.open}
              closeTime={selectedDay.close}
            />
          </View>
        )}
      </ScrollView>

      <View
        className="absolute bottom-0 w-full px-5 pt-4 pb-8"
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.background,
        }}>
        <PrefabButton
          title={canSubmit ? 'Confirmar Reserva' : 'Completa todos los pasos'}
          translate={false}
          disabled={!canSubmit}
          isLoading={isPending}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

interface AvailabilityErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const AvailabilityErrorModal = ({
  visible,
  message,
  onClose,
}: AvailabilityErrorModalProps) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent>
      <View
        className="flex-1 items-center justify-center p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="w-full rounded-3xl p-6" style={{ backgroundColor: theme.surface }}>
          <PrefabText variant="error" style={{ marginBottom: 12 }}>
            Horario no disponible
          </PrefabText>
          <PrefabText variant="body" style={{ color: theme.textSecondary, marginBottom: 24 }}>
            {message}
          </PrefabText>

          <Pressable
            onPress={onClose}
            className="w-full items-center rounded-xl py-4"
            style={{ backgroundColor: theme.accent }}>
            <PrefabText style={{ color: '#FFF', fontWeight: '700' }}>Entendido</PrefabText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
