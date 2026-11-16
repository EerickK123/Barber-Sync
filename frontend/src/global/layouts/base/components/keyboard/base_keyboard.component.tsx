import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { ScreenKeyboardProps } from '../../types/base_layout.types';

export const ScreenKeyboard = ({
  children,
  keyboardOffset,
  keyboardBehavior,
}: ScreenKeyboardProps) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={keyboardBehavior ?? (Platform.OS === 'ios' ? 'padding' : 'height')}
      keyboardVerticalOffset={keyboardOffset}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
