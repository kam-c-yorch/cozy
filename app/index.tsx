import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Typography, getResponsiveFontSize } from '@/constants/Typography';
import { Layout, Spacing } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { SocialLoginButton } from '@/components/ui/SocialLoginButton';

const { width: screenWidth } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'realtor' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRoleSelect = (role: 'seeker' | 'realtor') => {
    setSelectedRole(role);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isLogin && !selectedRole) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle authentication logic here
      console.log('Form submitted:', { ...formData, role: selectedRole, isLogin });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    console.log(`Login with ${provider}`);
  };

  const isTabletOrDesktop = screenWidth >= 768;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isTabletOrDesktop && styles.contentTablet]}>
          {/* Hero Illustration */}
          <View style={styles.heroSection}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.brandText}>Cozy</Text>
              <Text style={styles.taglineText}>
                Find your perfect home or list your property in Nigeria
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Role Selection - Only for Sign Up */}
            {!isLogin && (
              <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            )}
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

            {/* Auth Form */}
            <View style={styles.formContainer}>
              <View style={styles.authToggle}>
                <TouchableOpacity onPress={() => setIsLogin(true)}>
                  <Text style={[styles.authToggleText, isLogin && styles.authToggleTextActive]}>
                    Log In
                  </Text>
                </TouchableOpacity>
                <Text style={styles.authToggleSeparator}>•</Text>
                <TouchableOpacity onPress={() => setIsLogin(false)}>
                  <Text style={[styles.authToggleText, !isLogin && styles.authToggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email address"
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  placeholder="Confirm your password"
                  secureTextEntry
                  error={errors.confirmPassword}
                />
              )}

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <Button
                title={isLogin ? 'Log In' : 'Sign Up'}
                onPress={handleSubmit}
                style={styles.submitButton}
              />

              {/* Social Login */}
              <View style={styles.socialSection}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <SocialLoginButton
                  provider="google"
                  onPress={() => handleSocialLogin('google')}
                />
                
                {Platform.OS === 'ios' && (
                  <SocialLoginButton
                    provider="apple"
                    onPress={() => handleSocialLogin('apple')}
                  />
                )}
                
                <SocialLoginButton
                  provider="facebook"
                  onPress={() => handleSocialLogin('facebook')}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  contentTablet: {
    maxWidth: Layout.maxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Hero Section
  heroSection: {
    height: 280,
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  welcomeText: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('subtitle') * Typography.lineHeight.normal,
  },
  brandText: {
    fontSize: getResponsiveFontSize('heading'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
    textAlign: 'center',
    marginVertical: Spacing.xs,
    lineHeight: getResponsiveFontSize('heading') * Typography.lineHeight.tight,
  },
  taglineText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
  },
  
  // Form Section
  formSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  formContainer: {
    backgroundColor: Colors.white,
  },
  authToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  authToggleText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.secondaryText,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  authToggleTextActive: {
    color: Colors.primaryText,
  },
  authToggleSeparator: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginHorizontal: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  submitButton: {
    marginVertical: Spacing.md,
  },
  
  // Social Login
  socialSection: {
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
  
  // Error Text
  errorText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
});