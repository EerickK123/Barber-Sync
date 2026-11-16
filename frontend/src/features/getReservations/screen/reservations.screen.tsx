import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, Image, Modal } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { useGetClientReservations } from '../hook/getReservations.hook';

// --- Constantes ---
const STATUS = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED_CLIENT: 3,
  CANCELLED_BARBER: 4,
};

// --- Utilidades de Formateo ---
const formatDateTime = (datetimeStr: string) => {
  if (!datetimeStr) return { date: '', time: '' };
  
  const [datePart, timePart] = datetimeStr.split(' ');
  const [year, month, day] = datePart.split('-');

  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const dayOfWeek = days[dateObj.getDay()];
  const monthName = months[dateObj.getMonth()];
  const formattedDate = `${dayOfWeek} ${parseInt(day)} de ${monthName} de ${year}`;

  return { date: formattedDate, time: timePart };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- Configuración de Estados Dinámica ---
// Ahora recibe el "theme" para acoplarse a tu paleta de error, warning y success
const getStatusConfig = (statusId: number, theme: any) => {
  const configs: Record<number, { color: string, label: string }> = {
    1: { color: theme.warning, label: 'Pendiente' },
    2: { color: theme.success, label: 'Completada' },
    3: { color: theme.error, label: 'Cancelada' },
    4: { color: theme.error, label: 'Cancelada por Barbería' },
  };
  return configs[statusId] || { color: theme.textMuted, label: 'Desconocido' };
};

// --- Modal de Detalle Integrado ---
const ReservationDetailModal = ({ reservation, visible, onClose }: any) => {
  const { theme } = useTheme();

  if (!reservation) return null;

  const { status, barbershop, service, employee, datetime } = reservation;
  const { date, time } = formatDateTime(datetime);
  const statusConfig = getStatusConfig(status.id, theme);

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
          <PrefabText variant="title" translate={false} style={{ color: theme.textPrimary }}>
            Mi reservación
          </PrefabText>
          <Pressable
            onPress={onClose}
            className="rounded-full p-1.5"
            style={{ backgroundColor: theme.surfaceMuted }}
          >
            <Feather name="x" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        <View className="px-6 pt-6" style={{ gap: 16 }}>
          {/* Badge de estado (Agregamos '1A' al hex para un 10% de opacidad del mismo color) */}
          <View
            className="self-start rounded-xl px-4 py-2"
            style={{ backgroundColor: statusConfig.color + '1A' }}
          >
            <PrefabText
              variant="caption"
              translate={false}
              style={{ color: statusConfig.color, fontWeight: '800', textTransform: 'uppercase' }}
            >
              {statusConfig.label}
            </PrefabText>
          </View>

          {/* Tarjeta de la Barbería */}
          <View
            className="rounded-3xl border p-5 flex-row items-center"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <Image 
              source={{ uri: barbershop.avatar }} 
              className="w-16 h-16 rounded-2xl"
              style={{ backgroundColor: theme.surfaceMuted }}
            />
            <View className="flex-1 ml-4">
              <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
                Barbería
              </PrefabText>
              <PrefabText variant="body" translate={false} style={{ fontWeight: '800', marginTop: 2, color: theme.textPrimary }}>
                {barbershop.name}
              </PrefabText>
              <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary, marginTop: 4 }}>
                {barbershop.address}
              </PrefabText>
            </View>
          </View>

          {/* Tarjeta de Servicio y Detalles */}
          <View
            className="rounded-3xl border p-5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
              Servicio
            </PrefabText>
            <View className="flex-row justify-between items-center mt-1">
              <PrefabText variant="subtitle" translate={false} style={{ color: theme.textPrimary }}>
                {service.name}
              </PrefabText>
              <PrefabText variant="subtitle" translate={false} style={{ color: theme.accent }}>
                {formatCurrency(service.price)}
              </PrefabText>
            </View>

            {/* Separador */}
            <View className="h-[1px] w-full my-4" style={{ backgroundColor: theme.border }} />

            {/* Empleado y Fecha */}
            <View className="flex-row items-center">
              <Image 
                source={{ uri: employee.avatar }} 
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: theme.surfaceMuted }}
              />
              <View className="flex-1 ml-3">
                <PrefabText variant="body" translate={false} style={{ fontWeight: '700', color: theme.textPrimary }}>
                  {employee.name} {employee.lastName}
                </PrefabText>
                <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
                  Profesional asignado
                </PrefabText>
              </View>
            </View>

            <View
              className="flex-row justify-between mt-5 rounded-2xl p-4"
              style={{ backgroundColor: theme.surfaceMuted }}
            >
              <View className="flex-1 flex-row items-center">
                <Feather name="calendar" size={16} color={theme.textPrimary} />
                <View className="ml-3 flex-1">
                  <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
                    Fecha
                  </PrefabText>
                  <PrefabText variant="caption" translate={false} style={{ fontWeight: '700', marginTop: 2, textTransform: 'capitalize', color: theme.textPrimary }}>
                    {date}
                  </PrefabText>
                </View>
              </View>

              <View style={{ width: 1, backgroundColor: theme.border, marginHorizontal: 12 }} />

              <View className="flex-row items-center pr-4">
                <Feather name="clock" size={16} color={theme.textPrimary} />
                <View className="ml-3">
                  <PrefabText variant="caption" translate={false} style={{ color: theme.textSecondary }}>
                    Hora
                  </PrefabText>
                  <PrefabText variant="body" translate={false} style={{ fontWeight: '700', marginTop: 2, color: theme.textPrimary }}>
                    {time}
                  </PrefabText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Pantalla Principal ---
export const ReservationsScreen = () => {
  const { theme } = useTheme();
  
  // 1. Estados de Navegación de Tabs
  const [activeTab, setActiveTab] = useState<'proximas' | 'historial'>('proximas');
  const [historySubTab, setHistorySubTab] = useState<'completadas' | 'canceladas_cliente' | 'canceladas_barber'>('completadas');
  
  // 2. Determinar status_id dinámico para la API
  const currentStatusId = useMemo(() => {
    if (activeTab === 'proximas') return STATUS.PENDING;
    if (historySubTab === 'completadas') return STATUS.COMPLETED;
    if (historySubTab === 'canceladas_cliente') return STATUS.CANCELLED_CLIENT;
    return STATUS.CANCELLED_BARBER;
  }, [activeTab, historySubTab]);

  // 3. Query con Scroll Infinito
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useGetClientReservations(currentStatusId);

  const reservations = useMemo(() => 
    data?.pages.flatMap(page => page.reservations) || [], 
  [data]);

  // 4. Modal de Detalle
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  // --- Renders Internos ---
  const renderHeader = () => (
    <View className="px-6 pt-14 pb-4" style={{ backgroundColor: theme.background }}>
      <PrefabText variant="title" style={{ fontWeight: '800', color: theme.textPrimary }}>Mis Reservas</PrefabText>
      
      {/* Tabs Principales */}
      <View className="flex-row mt-6 p-1 rounded-2xl" style={{ backgroundColor: theme.surfaceMuted }}>
        <Pressable 
          onPress={() => setActiveTab('proximas')}
          className="flex-1 py-3 rounded-xl items-center"
          style={activeTab === 'proximas' ? { backgroundColor: theme.background, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : { backgroundColor: 'transparent' }}
        >
          <PrefabText variant="caption" style={{ fontWeight: activeTab === 'proximas' ? '700' : '400', color: activeTab === 'proximas' ? theme.textPrimary : theme.textSecondary }}>Próximas</PrefabText>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab('historial')}
          className="flex-1 py-3 rounded-xl items-center"
          style={activeTab === 'historial' ? { backgroundColor: theme.background, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : { backgroundColor: 'transparent' }}
        >
          <PrefabText variant="caption" style={{ fontWeight: activeTab === 'historial' ? '700' : '400', color: activeTab === 'historial' ? theme.textPrimary : theme.textSecondary }}>Historial</PrefabText>
        </Pressable>
      </View>

      {/* Sub-Tabs Historial */}
      {activeTab === 'historial' && (
        <View className="flex-row mt-4" style={{ gap: 8 }}>
          {(['completadas', 'canceladas_cliente', 'canceladas_barber'] as const).map((tab) => {
            const isActive = historySubTab === tab;
            return (
              <Pressable 
                key={tab}
                onPress={() => setHistorySubTab(tab)}
                className="px-3 py-2 rounded-full border"
                style={{ 
                  backgroundColor: isActive ? theme.textPrimary : 'transparent',
                  borderColor: isActive ? theme.textPrimary : theme.border 
                }}
              >
                <PrefabText variant="caption" style={{ color: isActive ? theme.background : theme.textSecondary }}>
                  {tab === 'completadas' ? 'Completadas' : tab === 'canceladas_cliente' ? 'Canceladas' : 'Por Barbería'}
                </PrefabText>
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const config = getStatusConfig(item.status.id, theme);
    const { date, time } = formatDateTime(item.datetime);

    return (
      <Pressable 
        onPress={() => setSelectedReservation(item)}
        className="mx-6 mb-4 p-5 rounded-3xl border flex-row items-center"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <Image 
          source={{ uri: item.barbershop.avatar }} 
          className="w-14 h-14 rounded-2xl"
          style={{ backgroundColor: theme.surfaceMuted }}
        />
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-start">
            <PrefabText variant="body" style={{ fontWeight: '700', color: theme.textPrimary }} numberOfLines={1}>
              {item.barbershop.name}
            </PrefabText>
            <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: config.color + '1A' }}>
              <PrefabText variant="caption" style={{ color: config.color, fontSize: 10, fontWeight: '700' }}>
                {config.label.toUpperCase()}
              </PrefabText>
            </View>
          </View>
          
          <PrefabText variant="caption" style={{ color: theme.textSecondary, marginTop: 2 }}>
            {item.service.name}
          </PrefabText>
          
          <View className="flex-row items-center mt-3">
            <Feather name="calendar" size={12} color={theme.textMuted} />
            <PrefabText variant="caption" style={{ color: theme.textMuted, marginLeft: 4, fontSize: 12, textTransform: 'capitalize' }}>
              {date} • {time}
            </PrefabText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]} 
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          // Aquí está la magia: si está cargando muestra el loader, si no, el mensaje de vacío.
          isLoading ? (
            <View className="items-center justify-center mt-20 px-10">
              <ActivityIndicator size="large" color={theme.accent} />
            </View>
          ) : (
            <View className="items-center justify-center mt-20 px-10">
              <Feather name="calendar" size={48} color={theme.textMuted} />
              <PrefabText variant="body" style={{ color: theme.textSecondary, marginTop: 16, textAlign: 'center' }}>
                No tienes reservaciones en esta categoría
              </PrefabText>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 20 }} />
          ) : <View style={{ height: 40 }} />
        }
      />

      {/* Renderizado de Modal Controlado */}
      <ReservationDetailModal 
        visible={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </View>
  );
};