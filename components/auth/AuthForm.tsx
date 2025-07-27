import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { signUp, signIn, resetPassword } from '../../lib/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RoleSelector } from '../ui/RoleSelector';
import { SocialLogin } from '../ui/SocialLogin';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

interface AuthFormProps {
  onAuthSuccess: (role: 'realtor' | 'home_seeker') => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [selectedRole, setSelectedRole] = useState<'realtor' | 'home_seeker' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const isTabletOrDesktop = screenWidth >= 768;

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setResetEmailSent(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedRole && !isLogin) {
      setErrors({ role: 'Please select your role' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        if (result.user && result.profile) {
          onAuthSuccess(result.profile.role);
        }
      } else {
        const result = await signUp(formData.email, formData.password, selectedRole!);
        if (result.user && result.profile) {
          onAuthSuccess(result.profile.role);
        }
      }
    } catch (error: any) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Email already exists';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }

    try {
      await resetPassword(formData.email);
      setResetEmailSent(true);
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to send reset email' });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };

  return (
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

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}
            
            {resetEmailSent && (
              <Text style={styles.successText}>
                Password reset email sent! Check your inbox.
              </Text>
            )}

            {/* Role Selection - Only for Sign Up */}
            {!isLogin && (
              <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
              />
            )}

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
              <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <Button
              title={isLogin ? 'Log In' : 'Sign Up'}
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            {/* Social Login */}
            <SocialLogin onSocialLogin={handleSocialLogin} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  
  // Error/Success Text
  errorText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  successText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
});