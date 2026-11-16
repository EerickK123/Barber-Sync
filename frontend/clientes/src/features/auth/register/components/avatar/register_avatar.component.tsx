import React from 'react';
import { TouchableOpacity } from 'react-native';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { PrefabAvatar } from '@/global/components';
import { useTheme } from '@/global/providers/theme';

interface Props {
  uri?: string;
  onPress: () => void;
}

export const RegisterAvatar = ({ uri, onPress }: Props) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} className="mb-6 items-center">
      <PrefabAvatar uri={uri} size="lg" />
      <FontAwesome
        name="camera"
        size={18}
        color={theme.accent}
        style={{
          marginTop: 8,
        }}
      />
    </TouchableOpacity>
  );
};
