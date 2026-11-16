import React from 'react';

import {
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';

import Feather from "@react-native-vector-icons/feather";

import { useTheme } from '@/global/providers/theme';

import { JoinBarbershopScreen } from '@/features/joinBarbershop/screen/join_barbershop.screen';

import { JoinBarbershopModalProps } from '../../types/get_barbershops.types';

export const JoinBarbershopModal = ({
  visible,
  onClose,
}: JoinBarbershopModalProps) => {
  const { theme } =
    useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={
        onClose
      }>
        
      <View
        className="flex-1"
        style={{
          backgroundColor:
            theme.background,
        }}>
        <View className="items-end px-6 pt-6 pb-2">
          <TouchableOpacity
            onPress={
              onClose
            }>
            <Feather
              name="x"
              size={30}
              color={
                theme.textPrimary
              }
            />
          </TouchableOpacity>
        </View>

        <JoinBarbershopScreen
          onSuccess={
            onClose
          }
        />
      </View>
    </Modal>
  );
};