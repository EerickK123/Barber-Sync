import React, { useRef } from 'react';

import { View } from 'react-native';

import { CameraView } from 'expo-camera';

import { PrefabButton } from '@/global/components';

import { QRScannerProps } from '../../types/join_barbershop.types';

export const QRScanner = ({
  onRead,
  onClose,
}: QRScannerProps) => {
  const scannedRef = useRef(false);

  return (
    <View className="flex-1">
      <CameraView
        style={{
          flex: 1,
        }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={({ data }) => {
          if (scannedRef.current) {
            return;
          }

          scannedRef.current = true;

          onRead(data);
        }}
      />

      <View className="absolute bottom-10 left-6 right-6">
        <PrefabButton
          title="Cerrar"
          variant="secondary"
          onPress={onClose}
        />
      </View>
    </View>
  );
};