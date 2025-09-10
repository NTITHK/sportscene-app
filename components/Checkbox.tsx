// components/Checkbox.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = { value: boolean; onValueChange: (v: boolean) => void; size?: number };

export default function Checkbox({ value, onValueChange, size = 22 }: Props) {
  return (
    <Pressable onPress={() => onValueChange(!value)} style={[styles.box, { width: size, height: size }]}>
      {value ? <Ionicons name="checkmark" size={size - 6} color="#1d4ed8" /> : <View />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
