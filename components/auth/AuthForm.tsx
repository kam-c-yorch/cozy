import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RoleSelector } from '../ui/RoleSelector';
import { SocialLogin } from '../ui/SocialLogin';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { signUp, signIn, resetPassword } from '../../lib/auth';

interface AuthFormProps {
  onAuthSuccess: (role: 'realtor' | 'home_seeker') => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'realtor' | 'home_seeker' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!isLogin && !selectedRole) {
        throw new Error('Please select your role');
      }

      if (!isLogin && password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (isLogin) {
        const result = await signIn(email, password);
        onAuthSuccess(result.profile.role);
      } else {
        const result = await signUp(email, password, selectedRole!);
        onAuthSuccess(selectedRole!);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      setLoading(true);
      const result = await resetPassword(email);
      if (result.success) {
        Alert.alert('Success', 'Password reset email sent! Check your inbox.');
      } else {
        Alert.alert('Error', result.error || 'Failed to send reset email');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setError('');
    setLoading(true);

    try {
      // Social login implementation would go here
      Alert.alert('Coming Soon', `${provider} login will be available soon!`);
    } catch (err) {
      setError('Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Selection - Only show for sign up */}
        {!isLogin && (
          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>I am a</Text>
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          </View>
        )}

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              style={styles.input}
            />
          )}

          <Button
            title={isLogin ? 'Log In' : 'Sign Up'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          {isLogin && (
            <Button
              title="Forgot Password?"
              onPress={handleForgotPassword}
              variant="outline"
              style={styles.forgotButton}
            />
          )}

          {/* Toggle between login and signup */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Button
              title={isLogin ? 'Sign Up' : 'Log In'}
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              variant="outline"
              style={styles.toggleButton}
            />
          </View>

          {/* Social Login */}
          <SocialLogin onSocialLogin={handleSocialLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  roleSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.secondaryText,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
  },
  formTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  input: {
    marginBottom: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  forgotButton: {
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  toggleText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  toggleButton: {
    paddingHorizontal: 0,
  },
  errorText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
});