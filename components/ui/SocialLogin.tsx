import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { SocialLoginButton } from './SocialLoginButton';

interface SocialLoginProps {
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => void;
}

export function SocialLogin({ onSocialLogin }: SocialLoginProps) {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialLoginButton
        provider="google"
        onPress={() => onSocialLogin('google')}
      />
      
      {Platform.OS === 'ios' && (
        <SocialLoginButton
          provider="apple"
          onPress={() => onSocialLogin('apple')}
        />
      )}
      
      <SocialLoginButton
        provider="facebook"
        onPress={() => onSocialLogin('facebook')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginHorizontal: Spacing.md,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
});