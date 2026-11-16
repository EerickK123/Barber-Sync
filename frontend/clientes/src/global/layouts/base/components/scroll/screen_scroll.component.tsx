import { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';

export const ScreenScroll = ({ children }: PropsWithChildren) => {
  return (
    <ScrollView
      className="flex-1"
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1, 
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};