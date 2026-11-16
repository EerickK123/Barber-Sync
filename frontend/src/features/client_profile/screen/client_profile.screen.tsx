import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Switch,
} from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';

// Hooks y Servicios
import { useGetClientProfile, useUpdateClientProfile } from '../hook/client_profile.hook';
import { pickImageFromGallery } from '@/global/utils/image/image_picker.utils';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ClientProfileScreen = () => {
  const { theme, toggleTheme, mode } = useTheme();

  // 1. Instanciamos ambos hooks
  const { data, isLoading } = useGetClientProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateClientProfile();

  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    avatarFile: null as any,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    currentPasswordConfirm: '',
    newPassword: '',
  });

  // Animación del modal
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openModal = () => {
    setShowPasswordModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 120,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', currentPasswordConfirm: '', newPassword: '' });
    });
  };

  // Sincronizar datos iniciales
  useEffect(() => {
    if (data?.profile) {
      setFormData((prev) => ({
        ...prev,
        name: data.profile.name,
        lastName: data.profile.lastName,
        email: data.profile.email,
        phone: data.profile.phone,
        avatar: data.profile.avatar,
        avatarFile: null, // Limpiamos el archivo pendiente si la data fresca llega
      }));
    }
  }, [data]);

  const handlePickImage = async () => {
    if (!isEditing) return;
    try {
      const image = await pickImageFromGallery();
      if (image) {
        setFormData((prev) => ({
          ...prev,
          avatar: image.uri,
          // Mapeamos a las keys exactas que React Native FormData espera
          avatarFile: {
            uri: image.uri,
            type: image.mimeType || 'image/jpeg',
            name: image.fileName || 'profile.jpg',
          },
        }));
      }
    } catch (error: any) {
      Alert.alert(
        'Permisos requeridos',
        error.message === 'app.errors.GALLERY_PERMISSION_REQUIRED'
          ? 'Necesitamos acceso a tu galería para cambiar la foto de perfil.'
          : 'Ocurrió un error al abrir la galería.'
      );
    }
  };

  // =========================================================
  // LÓGICA DE ACTUALIZACIÓN
  // =========================================================

  const handleEditOrSaveToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Flujo de Guardado (Información Básica + Avatar)
    try {
      await updateProfile({
        profileData: {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        avatarFile: formData.avatarFile ? formData.avatarFile : undefined,
      });

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No fue posible actualizar tu perfil');
    }
  };

  const handleSavePassword = async () => {
    const { currentPassword, currentPasswordConfirm, newPassword } = passwordForm;

    if (!currentPassword || !currentPasswordConfirm || !newPassword) {
      return Alert.alert('Atención', 'Por favor llena todos los campos.');
    }

    if (currentPassword !== currentPasswordConfirm) {
      return Alert.alert('Atención', 'La contraseña actual no coincide con la confirmación.');
    }

    try {
      // Enviamos el resto de la data más la info de contraseñas
      await updateProfile({
        profileData: {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          currentPassword,
          newPassword,
        },
      });

      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      closeModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar la contraseña');
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          /* lógica de logout */
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* --- HEADER --- */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
        <PrefabText variant="title" style={{ fontWeight: '800', color: theme.textPrimary }}>
          Mi perfil
        </PrefabText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- AVATAR --- */}
        <View className="mt-6 items-center">
          <Pressable onPress={handlePickImage} className="relative" disabled={!isEditing}>
            <View
              className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} className="h-full w-full" />
              ) : (
                <Feather name="user" size={50} color={theme.textMuted} />
              )}
            </View>
            {isEditing && (
              <View
                className="absolute right-0 bottom-0 rounded-full border-2 p-2"
                style={{ backgroundColor: theme.accent, borderColor: theme.background }}>
                <Feather name="camera" size={16} color="white" />
              </View>
            )}
          </Pressable>

          <PrefabText
            variant="subtitle"
            style={{ marginTop: 16, fontWeight: '800', color: theme.textPrimary }}>
            {formData.name} {formData.lastName}
          </PrefabText>
        </View>

        {/* --- TABS --- */}
        <View className="mt-8 flex-row border-b" style={{ borderColor: theme.border }}>
          <TabButton
            label="Mi información"
            isActive={activeTab === 'info'}
            onPress={() => setActiveTab('info')}
            theme={theme}
          />
          <TabButton
            label="Ajustes"
            isActive={activeTab === 'settings'}
            onPress={() => setActiveTab('settings')}
            theme={theme}
          />
        </View>

        {/* --- CONTENIDO --- */}
        <View className="px-6 pt-4 pb-10">
          {activeTab === 'info' ? (
            <View>
              {/* Botón editar / guardar */}
              <View className="mb-4 items-end">
                <Pressable
                  onPress={handleEditOrSaveToggle}
                  disabled={isPending}
                  className="flex-row items-center rounded-xl px-4 py-2"
                  style={{
                    backgroundColor: isEditing ? theme.accent : theme.surfaceMuted,
                    gap: 6,
                  }}>
                  {isPending && isEditing && (
                    <ActivityIndicator size="small" color={theme.accentText} />
                  )}
                  <PrefabText
                    variant="caption"
                    style={{
                      fontWeight: '700',
                      color: isEditing ? theme.accentText : theme.accent,
                    }}>
                    {isEditing ? 'Guardar' : 'Editar'}
                  </PrefabText>
                </Pressable>
              </View>

              <View style={{ gap: 24 }}>
                <ProfileInput
                  icon="user"
                  label="Nombre"
                  value={formData.name}
                  editable={isEditing}
                  onChangeText={(t: string) => setFormData({ ...formData, name: t })}
                  theme={theme}
                />
                <ProfileInput
                  icon="user"
                  label="Apellido"
                  value={formData.lastName}
                  editable={isEditing}
                  onChangeText={(t: string) => setFormData({ ...formData, lastName: t })}
                  theme={theme}
                />
                <ProfileInput
                  icon="mail"
                  label="Email"
                  value={formData.email}
                  editable={isEditing}
                  onChangeText={(t: string) => setFormData({ ...formData, email: t })}
                  theme={theme}
                />
                <ProfileInput
                  icon="phone"
                  label="Teléfono"
                  value={formData.phone}
                  editable={isEditing}
                  onChangeText={(t: string) => setFormData({ ...formData, phone: t })}
                  theme={theme}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Botón cambiar contraseña */}
              {isEditing && (
                <Pressable
                  onPress={openModal}
                  className="mt-8 flex-row items-center justify-between rounded-2xl px-4 py-3"
                  style={{ backgroundColor: theme.surfaceMuted }}>
                  <View className="flex-row items-center" style={{ gap: 10 }}>
                    <Feather name="lock" size={18} color={theme.accent} />
                    <PrefabText variant="body" style={{ fontWeight: '600', color: theme.accent }}>
                      Cambiar contraseña
                    </PrefabText>
                  </View>
                  <Feather name="chevron-right" size={18} color={theme.accent} />
                </Pressable>
              )}
            </View>
          ) : (
            // --- AJUSTES ---
            <View style={{ gap: 0 }}>
              <SettingsRow
                label="Tema"
                theme={theme}
                right={
                  <Switch
                    value={mode === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.border, true: theme.accent }}
                    thumbColor={theme.background}
                  />
                }
              />
              <SettingsRow
                label="Idioma"
                theme={theme}
                right={
                  <Switch
                    value={false}
                    onValueChange={() => {}}
                    trackColor={{ false: theme.border, true: theme.accent }}
                    thumbColor={theme.background}
                  />
                }
              />
              <Pressable
                onPress={handleLogout}
                className="mt-6 flex-row items-center justify-center rounded-2xl px-4 py-4"
                style={{ backgroundColor: theme.surfaceMuted, gap: 10 }}>
                <Feather name="log-out" size={20} color="#ef4444" />
                <PrefabText variant="body" style={{ fontWeight: '700', color: '#ef4444' }}>
                  Cerrar sesión
                </PrefabText>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- MODAL CONTRASEÑA --- */}
      <Modal transparent visible={showPasswordModal} onRequestClose={closeModal}>
        <Pressable
          className="flex-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={closeModal}
          disabled={isPending}
        />
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 28,
            paddingBottom: 40,
          }}>
          <View
            className="mb-6 self-center rounded-full"
            style={{ width: 40, height: 4, backgroundColor: theme.border }}
          />

          <PrefabText
            variant="subtitle"
            style={{ fontWeight: '800', color: theme.textPrimary, marginBottom: 24 }}>
            Cambiar contraseña
          </PrefabText>

          <View style={{ gap: 20 }}>
            <PasswordInput
              label="Contraseña actual"
              value={passwordForm.currentPassword}
              onChangeText={(t: string) => setPasswordForm({ ...passwordForm, currentPassword: t })}
              theme={theme}
            />
            <PasswordInput
              label="Confirmar contraseña actual"
              value={passwordForm.currentPasswordConfirm}
              onChangeText={(t: string) =>
                setPasswordForm({ ...passwordForm, currentPasswordConfirm: t })
              }
              theme={theme}
            />
            <PasswordInput
              label="Nueva contraseña"
              value={passwordForm.newPassword}
              onChangeText={(t: string) => setPasswordForm({ ...passwordForm, newPassword: t })}
              theme={theme}
            />
          </View>

          <Pressable
            onPress={handleSavePassword}
            disabled={isPending}
            className="mt-8 flex-row items-center justify-center rounded-2xl py-4"
            style={{ backgroundColor: theme.accent, gap: 8, opacity: isPending ? 0.7 : 1 }}>
            {isPending && <ActivityIndicator size="small" color={theme.accentText} />}
            <PrefabText variant="body" style={{ fontWeight: '700', color: theme.accentText }}>
              Guardar contraseña
            </PrefabText>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
};

// ... COMPONENTES AUXILIARES (TabButton, ProfileInput, SettingsRow, PasswordInput se mantienen igual) ...
// (Omitidos por brevedad visual, puedes dejar los mismos de tu archivo original)

// --- COMPONENTES AUXILIARES ---

const TabButton = ({ label, isActive, onPress, theme }: any) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1, // 50% del ancho
      alignItems: 'center', // texto centrado
      paddingBottom: 12,
      borderBottomWidth: isActive ? 3 : 0,
      borderBottomColor: theme.accent,
    }}>
    <PrefabText
      variant="body"
      style={{
        fontWeight: isActive ? '800' : '400',
        color: isActive ? theme.accent : theme.textSecondary,
      }}>
      {label}
    </PrefabText>
  </Pressable>
);

const ProfileInput = ({
  icon,
  label,
  value,
  editable,
  onChangeText,
  theme,
  keyboardType = 'default',
}: any) => (
  <View className="flex-row items-center">
    <View
      className="h-10 w-10 items-center justify-center rounded-xl"
      style={{ backgroundColor: theme.surfaceMuted }}>
      <Feather name={icon} size={18} color={theme.textSecondary} />
    </View>

    <View className="ml-4 flex-1">
      <PrefabText variant="caption" style={{ color: theme.textMuted, marginBottom: 2 }}>
        {label}
      </PrefabText>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={{
            color: theme.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentMuted,
          }}
          selectionColor={theme.accent}
        />
      ) : (
        <PrefabText variant="body" style={{ fontWeight: '600', color: theme.textPrimary }}>
          {value}
        </PrefabText>
      )}
    </View>
  </View>
);

const SettingsRow = ({ label, right, theme }: any) => (
  <View
    className="flex-row items-center justify-between py-4"
    style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
    <PrefabText variant="body" style={{ fontWeight: '600', color: theme.textPrimary }}>
      {label}
    </PrefabText>
    {right}
  </View>
);

const PasswordInput = ({ label, value, onChangeText, theme }: any) => {
  const [show, setShow] = useState(false);
  return (
    <View>
      <PrefabText variant="caption" style={{ color: theme.textMuted, marginBottom: 6 }}>
        {label}
      </PrefabText>
      <View
        className="flex-row items-center rounded-xl px-4"
        style={{ backgroundColor: theme.surfaceMuted, height: 48 }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          style={{ flex: 1, color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}
          selectionColor={theme.accent}
        />
        <Pressable onPress={() => setShow(!show)}>
          <Feather name={show ? 'eye-off' : 'eye'} size={18} color={theme.textMuted} />
        </Pressable>
      </View>
    </View>
  );
};
