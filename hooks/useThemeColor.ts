import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const scheme = (useColorScheme() ?? 'light') as Theme;
  const colorFromProps = props[scheme];
  return colorFromProps ?? Colors[scheme][colorName];
}
