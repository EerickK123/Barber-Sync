import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';

import { PrefabLoader } from '@/global/components/loader/loader.component';
import { PrefabAlert } from '@/global/components/alert/alert.component';
import { PrefabHeader } from '@/global/components/header/header.component';
import { PrefabButton } from '@/global/components/button/button.component';

import { useGetBarbershopProfile } from '../hook/barbershop_profile.hook';
import { CalendarDay, Employee } from '../types/barbershop_profile.types';
import { useBarbershopProfileStore } from '@/global/stores/barbershop/barbershop.store';

import { EmployeeModal } from '../components/employee_modal/employee_modal.component';
import { BarbershopHero } from './sections/hero/barbershop_profile.hero';
import { BarbershopAgenda } from './sections/tabs/agenda/barbershop_profile.agenda';
import { BarbershopTabs } from './sections/tabs/barbershop_profile.tabs';
import { BarbershopInfoSection } from './sections/tabs/info/barbershop_profile.info';
import { BarbershopServices } from './sections/tabs/services/barbershop_profile.services';
import { BarbershopTeam } from './sections/tabs/team/barbershop_profile.team';

export const BarbershopProfileScreen = () => {
  const { theme } = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { mutate, data, isPending, error } = useGetBarbershopProfile();
  
  // Corregido: Extraemos la función correcta del nuevo store de Zustand
  const setBarbershopProfile = useBarbershopProfileStore((state) => state.setBarbershopProfile);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (code) mutate(code);
  }, [code, mutate]);

  const profile = data?.data ?? null;

  useEffect(() => {
    if (!profile) return;
    
    // Corregido: Seteamos la información usando el nuevo método del store
    setBarbershopProfile(profile);
    
    const firstAvailable = profile.calendar.find(
      (d: CalendarDay) => !d.is_past && d.working_day,
    );
    setSelectedDate(firstAvailable?.date ?? profile.calendar[0]?.date ?? null);
  }, [profile, setBarbershopProfile]);

  const selectedDay = useMemo(
    () => profile?.calendar.find((d: CalendarDay) => d.date === selectedDate) ?? null,
    [profile?.calendar, selectedDate],
  );

  const canReserve = !!selectedDay && !selectedDay.is_past && selectedDay.working_day;

  const reservationLabel = !selectedDay
    ? 'Selecciona un día'
    : selectedDay.is_past
    ? 'Día no disponible'
    : !selectedDay.working_day
    ? 'Barbería cerrada'
    : 'Añadir Reservación';

  if (isPending) return <PrefabLoader text="Cargando barbería..." translate={false} />;

  if (error) {
    return (
      <View className="flex-1 justify-center p-5" style={{ backgroundColor: theme.background }}>
        <PrefabAlert message={error.message} variant="error" translate={false} />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Botón back flotante sobre el hero */}
      <PrefabHeader
        title=""
        translate={false}
        className="absolute top-12 left-0 right-0 z-20 px-5 bg-transparent"
        leftComponent={
          <PrefabButton
            variant="icon"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            icon={<Feather name="arrow-left" size={20} color="white" />}
            onPress={() => router.back()}
          />
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <BarbershopHero info={profile.barbershop_info} />
        <BarbershopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <View className="pt-6">
          {activeTab === 0 && (
            <BarbershopInfoSection barbershopInfo={profile.barbershop_info} />
          )}
          {activeTab === 1 && (
            <BarbershopAgenda
              calendar={profile.calendar}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              onSelectDate={setSelectedDate}
            />
          )}
          {activeTab === 2 && (
            <View className="px-5">
              <BarbershopServices services={profile.services} />
            </View>
          )}
          {activeTab === 3 && (
            <BarbershopTeam
              employees={profile.employees}
              onSelectEmployee={setSelectedEmployee}
            />
          )}
        </View>
      </ScrollView>

      {/* Botón de reservación flotante */}
      <View
        className="absolute bottom-0 w-full p-5 border-t"
        style={{ borderColor: theme.border, backgroundColor: theme.background }}
      >
        <PrefabButton
          title={reservationLabel}
          translate={false}
          disabled={!canReserve}
          onPress={() =>
            router.push({
              pathname: '/(protected)/create_reservation',
              params: { date: selectedDate ?? '' },
            })
          }
        />
      </View>

      <EmployeeModal
        employee={selectedEmployee}
        visible={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </View>
  );
};