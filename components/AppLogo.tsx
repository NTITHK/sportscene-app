import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Centralized logo path
const logo = require('../assets/images/logo.png');

type Props = {
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
};

export default function AppLogo({ style, resizeMode = 'contain' }: Props) {
  return <Image source={logo} style={style} resizeMode={resizeMode} />;
}
