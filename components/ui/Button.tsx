import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography, getResponsiveFontSize } from '@/constants/Typography';
import { Layout } from '@/constants/Spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.black} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.black,
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: getResponsiveFontSize('body'),
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primaryText,
  },
  outlineText: {
    color: Colors.black,
  },
  
  smallText: {
    fontSize: getResponsiveFontSize('small'),
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  mediumText: {
    fontSize: getResponsiveFontSize('body'),
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  largeText: {
    fontSize: getResponsiveFontSize('subtitle'),
    lineHeight: getResponsiveFontSize('subtitle') * Typography.lineHeight.normal,
  },
  
  disabledText: {
    opacity: 0.7,
  },
});