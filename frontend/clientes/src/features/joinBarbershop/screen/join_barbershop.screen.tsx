import React, {
  useState,
} from 'react';

import {
  Keyboard,
  Modal,
  View,
} from 'react-native';

import { Camera } from 'expo-camera';

import { router } from 'expo-router';

import { useQueryClient } from '@tanstack/react-query';

import { JoinBarbershopHeader } from './sections/header/join_barbershop.header';

import { JoinBarbershopBody } from './sections/body/join_barbershop.body';



import { useJoinBarbershopByCode } from '../hook/join_barbershop.hook';

import { JoinBarbershopScreenProps } from '../types/join_barbershop.types';
import { QRScanner } from '../components/qr_scanner/qr_scanner.component';

export const JoinBarbershopScreen = ({
  onSuccess,
  showDescription = true,
}: JoinBarbershopScreenProps) => {
  const queryClient = useQueryClient();

  const [code, setCode] = useState('');

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const [scannerVisible, setScannerVisible] =
    useState(false);

  const {
    mutate,
    isPending,
    error: serverError,
    reset,
  } = useJoinBarbershopByCode();

  const descriptionText =
    'Ingresa el código proporcionado por tu barbería o escanea el código QR para vincular tu cuenta automáticamente.';

  const handleCodeChange = (
    text: string
  ) => {
    setValidationError(null);

    reset();

    let raw = text
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    raw = raw.substring(0, 6);

    if (raw.length > 3) {
      setCode(
        `${raw.substring(0, 3)}-${raw.substring(3)}`
      );
      return;
    }

    setCode(raw);
  };

  const handleClearErrors = () => {
    setValidationError(null);

    reset();
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['get_barbershops'],
    });

    if (onSuccess) {
      onSuccess();
      return;
    }

    router.back();
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    const isValid =
      /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code);

    if (!isValid) {
      setValidationError(
        'El código debe tener formato ABC-123'
      );
      return;
    }

    mutate(code, {
      onSuccess: handleSuccess,
    });
  };

  const handleOpenScanner = async () => {
    const permission =
      await Camera.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setValidationError(
        'Permiso de cámara requerido'
      );
      return;
    }

    setScannerVisible(true);
  };

  const handleQRRead = (
    value: string
  ) => {
    setScannerVisible(false);

    handleCodeChange(value);

    mutate(value, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <View className="flex-1 bg-background">
      <JoinBarbershopHeader />

      <JoinBarbershopBody
        showDescription={showDescription}
        descriptionText={descriptionText}
        code={code}
        onChangeCode={handleCodeChange}
        onSubmit={handleSubmit}
        isPending={isPending}
        error={
          validationError ??
          serverError?.message ??
          null
        }
        onClearError={handleClearErrors}
        onOpenScanner={handleOpenScanner}
      />

      <Modal
        visible={scannerVisible}
        animationType="slide">
        <QRScanner
          onRead={handleQRRead}
          onClose={() =>
            setScannerVisible(false)
          }
        />
      </Modal>
    </View>
  );
};