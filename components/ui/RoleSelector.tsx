import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography, getResponsiveFontSize } from '@/constants/Typography';
import { Layout, Spacing } from '@/constants/Spacing';
import { Chrome as Home, Key } from 'lucide-react-native';

interface RoleSelectorProps {
  selectedRole: 'seeker' | 'realtor' | null;
  onRoleSelect: (role: 'seeker' | 'realtor') => void;
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>I am a...</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'seeker' && styles.roleButtonActive,
          ]}
          onPress={() => onRoleSelect('seeker')}
          activeOpacity={0.8}
        >
          <Home 
            size={24} 
            color={selectedRole === 'seeker' ? Colors.white : Colors.black}
            strokeWidth={2}
          />
          <Text style={[
            styles.roleButtonText,
            selectedRole === 'seeker' && styles.roleButtonTextActive,
          ]}>
            Client
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'realtor' && styles.roleButtonActive,
          ]}
          onPress={() => onRoleSelect('realtor')}
          activeOpacity={0.8}
        >
          <Key 
            size={24} 
            color={selectedRole === 'realtor' ? Colors.white : Colors.black}
            strokeWidth={2}
          />
          <Text style={[
            styles.roleButtonText,
            selectedRole === 'realtor' && styles.roleButtonTextActive,
          ]}>
            Realtor
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  title: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  roleButtonActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  roleButtonText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.black,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  roleButtonTextActive: {
    color: Colors.white,
  },
});