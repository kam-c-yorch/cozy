import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography, getResponsiveFontSize } from '@/constants/Typography';
import { Layout, Spacing } from '@/constants/Spacing';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple' | 'facebook';
  onPress: () => void;
}

export function SocialLoginButton({ provider, onPress }: SocialLoginButtonProps) {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          title: 'Continue with Google',
          icon: 'G',
          backgroundColor: Colors.white,
          textColor: Colors.primaryText,
          borderColor: Colors.border,
        };
      case 'apple':
        return {
          title: 'Continue with Apple',
          icon: '',
          backgroundColor: Colors.black,
          textColor: Colors.white,
          borderColor: Colors.black,
        };
      case 'facebook':
        return {
          title: 'Continue with Facebook',
          icon: 'f',
          backgroundColor: '#1877F2',
          textColor: Colors.white,
          borderColor: '#1877F2',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {config.icon && (
          <Text style={[styles.icon, { color: config.textColor }]}>
            {config.icon}
          </Text>
        )}
        <Text style={[styles.text, { color: config.textColor }]}>
          {config.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
});