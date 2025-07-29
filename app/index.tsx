import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RoleSelector } from '../components/ui/RoleSelector';
import { SocialLogin } from '../components/ui/SocialLogin';
import { AuthForm } from '../components/auth/AuthForm';
import { getCurrentUserProfile } from '../lib/auth';

export default function LandingScreen() {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    checkAuthStatus();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      if (userProfile && isMounted.current) {
        // User is already authenticated, navigate to dashboard
        router.replace('/(tabs)');
      } else {
        if (isMounted.current) {
          setShowAuth(true);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (isMounted.current) {
        setShowAuth(true);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleAuthSuccess = (role: 'realtor' | 'home_seeker') => {
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!showAuth) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: Spacing.md,
  },
});